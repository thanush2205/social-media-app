import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import UserAvatar from './UserAvatar';
import { extractErrorMessage } from '../api/client';
import { timeAgo } from '../utils/format';

/**
 * Expandable comment list with an input box to add a new comment.
 */
export default function CommentSection({
  comments,
  currentUser,
  onAddComment,
  onCommentAdded,
}) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError('');
    try {
      const { data } = await onAddComment(trimmed);
      onCommentAdded(data.comment);
      setText('');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.default' }}>
      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          No comments yet. Be the first to comment!
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 1.5 }}>
          {comments.map((comment) => (
            <Box key={comment._id} sx={{ display: 'flex', gap: 1.25 }}>
              <UserAvatar
                name={comment.user?.name || 'U'}
                src={comment.user?.avatar}
                size={32}
              />
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.75,
                  maxWidth: '80%',
                }}
              >
                <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                  {comment.user?.name || 'Unknown'}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {comment.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeAgo(comment.createdAt)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <UserAvatar name={currentUser?.name} src={currentUser?.avatar} size={32} />
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitting}
          inputProps={{ maxLength: 300 }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={submitting || !text.trim()}
          aria-label="Post comment"
        >
          {submitting ? <CircularProgress size={20} /> : <SendIcon />}
        </IconButton>
      </Box>

      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}