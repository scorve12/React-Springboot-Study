import React, { useState, useEffect } from 'react';
import { boardAPI } from '../services/boardAPI';
import './BoardPage.css';

function BoardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  });

  // 게시물 목록 조회
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await boardAPI.getAllPosts();
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('게시물을 불러올 수 없습니다.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // 게시물 생성
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await boardAPI.createPost(formData);
      setFormData({ title: '', content: '', author: '' });
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      alert('게시물 생성에 실패했습니다.');
      console.error('Error creating post:', err);
    }
  };

  // 게시물 삭제
  const handleDeletePost = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await boardAPI.deletePost(id);
        fetchPosts();
      } catch (err) {
        alert('게시물 삭제에 실패했습니다.');
        console.error('Error deleting post:', err);
      }
    }
  };

  // 컴포넌트 마운트 시 게시물 조회
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <div className="board-container">
      <div className="board-header">
        <h1>📋 자유 게시판</h1>
        <p>Spring Boot & React API 테스트</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="board-controls">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '취소' : '✏️ 새 게시물 작성'}
        </button>
        <button className="btn btn-secondary" onClick={fetchPosts}>
          🔄 새로고침
        </button>
      </div>

      {showForm && (
        <div className="post-form-container">
          <form onSubmit={handleCreatePost} className="post-form">
            <div className="form-group">
              <label htmlFor="author">작성자</label>
              <input
                id="author"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="작성자명을 입력해주세요"
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="제목을 입력해주세요"
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">내용</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="내용을 입력해주세요"
                rows="6"
              />
            </div>
            <button type="submit" className="btn btn-success">
              등록하기
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">로딩 중...</div>
      ) : posts.length === 0 ? (
        <div className="empty-message">작성된 게시물이 없습니다.</div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleDeletePost(post.id)}
                >
                  삭제
                </button>
              </div>
              <div className="post-meta">
                <span className="author">작성자: {post.author}</span>
                <span className="date">{formatDate(post.createdAt)}</span>
              </div>
              <div className="post-content">{post.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BoardPage;
