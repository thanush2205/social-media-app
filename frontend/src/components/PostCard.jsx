import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Box,
  Typography,
  IconButton,
  Button,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ModeComment as CommentIcon,
} from '@mui/icons-material';
import { toggleLike, addComment } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import { timeAgo, formatCount } from '../utils/format';
import UserAvatar from './UserAvatar';
import CommentSection from './CommentSection';
import { extractErrorMessage } from '../api/client';

export default function PostCard({ post, onLikeToggle, onCommentAdded }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likedByMe);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [comments, setComments] = useState(post.comments || []);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [likeError, setLikeError] = useState('');

  const handleLike = async () => {
    setLikeError('');
    // Optimistic update for instant UI feedback.
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((c) => c + (nextLiked ? 1 : -1));

    try {
      const { data } = await toggleLike(post._id);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
      onLikeToggle?.(post._id, data.liked, data.likesCount);
    } catch (error) {
      // Revert on failure.
      setLiked(!nextLiked);
      setLikesCount((c) => c - (nextLiked ? 1 : -1));
      setLikeError(extractErrorMessage(error));
    }
  };

  const handleCommentAdded = (comment) => {
    setComments((prev) => [...prev, comment]);
    setCommentsCount((c) => c + 1);
    onCommentAdded?.(post._id, comment);
  };

  return (
    <Card
      sx={{
        mb: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: (t) =>
          t.palette.mode === 'dark'
            ? '0 2px 12px rgba(0,0,0,0.35)'
            : '0 1px 8px rgba(0,0,0,0.06)',
      }}
    >
      <CardHeader
        avatar={
          <UserAvatar name={post.user.name} src={post.user.avatar} size={42} />
        }
        title={
          <Typography variant="subtitle2" fontWeight={700}>
            {post.user.name}
          </Typography>
        }
        subheader={timeAgo(post.createdAt)}
        sx={{ pb: 0.5 }}
      />

      {(post.text || post.image) && (
        <CardContent sx={{ pt: post.text ? 0.5 : 1, pb: 1 }}>
          {post.text && (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {post.text}
            </Typography>
          )}
          {post.image && (
            <Box
              component="img"
              src={post.image}
              alt="Post"
              loading="lazy"
              sx={{
                width: '100%',
                maxHeight: 420,
                objectFit: 'cover',
                borderRadius: 2,
                mt: post.text ? 1.5 : 0,
                bgcolor: 'action.hover',
              }}
            />
          )}
        </CardContent>
      )}

      <CardActions
        sx={{ px: 1.5, py: 0.5, justifyContent: 'space-between' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={handleLike}
            color={liked ? 'error' : 'default'}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            {formatCount(likesCount)}
          </Typography>

          <Button
            size="small"
            startIcon={<CommentIcon fontSize="small" />}
            onClick={() => setShowComments((v) => !v)}
            sx={{ ml: 2, textTransform: 'none', color: 'text.secondary' }}
          >
            {formatCount(commentsCount)} Comments
          </Button>
        </Box>
      </CardActions>

      {likeError && (
        <Typography variant="caption" color="error" sx={{ px: 2, display: 'block', pb: 0.5 }}>
          {likeError}
        </Typography>
      )}

      <Collapse in={showComments}>
        <Divider />
        <CommentSection
          comments={comments}
          currentUser={user}
          onAddComment={(text) => addComment(post._id, text)}
          onCommentAdded={handleCommentAdded}
        />
      </Collapse>
    </Card>
  );
}