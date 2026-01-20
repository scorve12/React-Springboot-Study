import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const boardAPI = {
  // 모든 게시물 조회
  getAllPosts: () => api.get('/api/posts'),
  
  // 특정 게시물 조회
  getPost: (id) => api.get(`/api/posts/${id}`),
  
  // 게시물 생성
  createPost: (postData) => api.post('/api/posts', postData),
  
  // 게시물 수정
  updatePost: (id, postData) => api.put(`/api/posts/${id}`, postData),
  
  // 게시물 삭제
  deletePost: (id) => api.delete(`/api/posts/${id}`),
};

export default api;
