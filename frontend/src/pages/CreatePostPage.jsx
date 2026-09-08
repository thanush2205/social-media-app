import { useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Avatar,
  Fab,
  CircularProgress,
} from '@mui/material';
import {
  Image as ImageIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';
import UserAvatar from '../components/UserAvatar';

export default function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const removeImage = () => {
    setImage(null);
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed && !image) {
      setError('Add some text or choose an image');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await createPost(trimmed, image);
      navigate('/');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, width: '100%', margin: '0 auto', px: 2, py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <UserAvatar name={user?.name} src={user?.avatar} size={42} />
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Posting to the public feed
            </Typography>
          </Box>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={8}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            inputProps={{ maxLength: 1000 }}
            disabled={submitting}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="caption" color="text.secondary">
              {text.length}/1000
            </Typography>
          </Box>

          {preview && (
            <Box sx={{ position: 'relative', mt: 1, mb: 2 }}>
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 12 }}
              />
              <Fab
                size="small"
                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff' }}
                onClick={removeImage}
                aria-label="Remove image"
              >
                <CloseIcon />
              </Fab>
            </Box>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageSelect}
          />

          <Stack direction="row" sx={{ mt: 2 }} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<ImageIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={submitting || !!preview}
              sx={{ textTransform: 'none' }}
            >
              {preview ? 'Image added' : 'Add image'}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
              disabled={submitting || (!text.trim() && !image)}
              sx={{ ml: 'auto', textTransform: 'none' }}
            >
              {submitting ? 'Posting...' : 'Post'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}