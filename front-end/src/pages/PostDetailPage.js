import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { boardAPI } from '../services/boardAPI';
import './PostDetailPage.css';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await boardAPI.getPost(id);
        setPost(response.data);
        setError(null);
      } catch (err) {
        setError('게시물을 불러올 수 없습니다.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      try {
        await boardAPI.deletePost(id);
        navigate('/');
      } catch (err) {
        alert('게시물 삭제에 실패했습니다.');
        console.error('Error deleting post:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>게시물을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">!</div>
          <h2>오류가 발생했습니다</h2>
          <p>{error || '게시물을 찾을 수 없습니다.'}</p>
          <Link to="/" className="btn-back">목록으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <main className="detail-content">
        <article className="post-article">
          <header className="article-header">
            <h1 className="article-title">{post.title}</h1>
            <div className="article-meta">
              <div className="meta-item">
                <span className="meta-label">작성자</span>
                <span className="meta-value author">{post.author}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">작성일</span>
                <span className="meta-value">{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </header>

          <div className="article-body">
            <p>{post.content}</p>
          </div>

          <footer className="article-footer">
            <Link to="/" className="btn-secondary">
              <span className="icon">←</span>
              목록
            </Link>
            <div className="action-buttons">
              <Link to={`/edit/${post.id}`} className="btn-edit">
                수정
              </Link>
              <button onClick={handleDelete} className="btn-delete">
                삭제
              </button>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}

export default PostDetailPage;
