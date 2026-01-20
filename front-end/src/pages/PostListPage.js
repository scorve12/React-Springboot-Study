import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { boardAPI } from '../services/boardAPI';
import './PostListPage.css';

function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="header-content">
          <h1>Community Board</h1>
          <p>자유롭게 이야기를 나눠보세요</p>
        </div>
      </header>

      <main className="main-content">
        <div className="list-header">
          <div className="post-count">
            전체 <span className="count">{posts.length}</span>개의 글
          </div>
          <Link to="/write" className="btn-write">
            <span className="icon">+</span>
            글쓰기
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>게시물을 불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>아직 게시물이 없습니다</h3>
            <p>첫 번째 글을 작성해보세요!</p>
            <Link to="/write" className="btn-primary">글쓰기</Link>
          </div>
        ) : (
          <div className="post-table">
            <div className="table-header">
              <div className="col-id">번호</div>
              <div className="col-title">제목</div>
              <div className="col-author">작성자</div>
              <div className="col-date">작성일</div>
            </div>
            <div className="table-body">
              {posts.map((post, index) => (
                <Link to={`/post/${post.id}`} key={post.id} className="table-row">
                  <div className="col-id">{posts.length - index}</div>
                  <div className="col-title">
                    <span className="title-text">{post.title}</span>
                  </div>
                  <div className="col-author">{post.author}</div>
                  <div className="col-date">{formatDate(post.createdAt)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default PostListPage;
