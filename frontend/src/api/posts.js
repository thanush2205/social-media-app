import { api } from './client';

/**
 * Fetch the public feed with cursor-based pagination.
 * @param {string|null} cursor - id of the last post from the previous page
 * @param {number} limit - page size
 */
export const fetchFeed = (cursor = null, limit = 10) =>
  api.get('/posts', { params: { cursor, limit } });

/**
 * Create a new post (text and/or image).
 * @param {string} text
 * @param {File|null} image
 */
export const createPost = async (text, image) => {
  const formData = new FormData();
  if (text) formData.append('text', text);
  if (image) formData.append('image', image);

  return api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Toggle a like on a post.
 * @returns {Promise<{liked: boolean, likesCount: number}>}
 */
export const toggleLike = (postId) => api.post(`/posts/${postId}/like`);

/**
 * Add a comment to a post.
 * @returns {Promise<{comment: object, commentsCount: number}>}
 */
export const addComment = (postId, text) =>
  api.post(`/posts/${postId}/comment`, { text });