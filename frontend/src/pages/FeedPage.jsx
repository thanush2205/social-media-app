import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Paper,
  Chip,
} from '@mui/material';
import { WavingHand as WaveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchFeed } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import UserAvatar from '../components/UserAvatar';
import { extractErrorMessage } from '../api/client';

const PAGE_SIZE = 10;

export default function FeedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const sentinelRef = useRef(null);

  const loadPage = useCallback(async (cursor = null) => {
    const { data } = await fetchFeed(cursor, PAGE_SIZE);
    return data;
  }, []);

  // Initial load.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadPage()
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts);
        setNextCursor(data.nextCursor);
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await loadPage(nextCursor);
      setPosts((prev) => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore, loadPage]);

  // Auto-load the next page when the sentinel enters the viewport.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor) {
          loadMore();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextCursor, loadMore]);

  const handleLikeToggle = (postId, liked, likesCount) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, likedByMe: liked, likesCount } : p))
    );
  };

  const handleCommentAdded = (postId, comment) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, comments: [...p.comments, comment], commentsCount: (p.commentsCount || 0) + 1 }
          : p
      )
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 680, width: '100%', margin: '0 auto', px: 2, py: 3 }}>
      {/* Welcome banner */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          border: '1px solid',
          borderColor: 'divider',
          background: (t) =>
            t.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(20,184,166,0.12))'
              : 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(20,184,166,0.08))',
        }}
      >
        <UserAvatar name={user?.name} src={user?.avatar} size={48} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={800}>
            <WaveIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Welcome, {user?.name}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here&apos;s what&apos;s happening in the community.
          </Typography>
        </Box>
        <Button variant="contained" size="small" onClick={() => navigate('/create')} sx={{ textTransform: 'none' }}>
          New Post
        </Button>
      </Paper>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Chip label={error} color="error" variant="outlined" onDelete={() => setError('')} />
        </Box>
      )}

      {posts.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            No posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Be the first one to share something with the community.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/create')} sx={{ textTransform: 'none' }}>
            Create a post
          </Button>
        </Paper>
      ) : (
        <Stack spacing={0}>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLikeToggle={handleLikeToggle}
              onCommentAdded={handleCommentAdded}
            />
          ))}
        </Stack>
      )}

      {/* Infinite scroll sentinel + manual fallback */}
      <Box ref={sentinelRef} sx={{ py: 3, textAlign: 'center' }}>
        {loadingMore && <CircularProgress size={28} />}
        {!loadingMore && nextCursor && (
          <Button onClick={loadMore} sx={{ textTransform: 'none' }} color="inherit">
            Load more posts
          </Button>
        )}
        {!nextCursor && posts.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            You&apos;ve reached the end of the feed.
          </Typography>
        )}
      </Box>
    </Box>
  );
}