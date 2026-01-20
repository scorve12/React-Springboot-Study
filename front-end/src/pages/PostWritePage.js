import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { boardAPI } from '../services/boardAPI';
import './PostWritePage.css';

function PostWritePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          const response = await boardAPI.getPost(id);
          const { title, content, author } = response.data;
          setFormData({ title, content, author });
        } catch (err) {
          alert('게시물을 불러올 수 없습니다.');
          navigate('/');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await boardAPI.updatePost(id, formData);
        navigate(`/post/${id}`);
      } else {
        await boardAPI.createPost(formData);
        navigate('/');
      }
    } catch (err) {
      alert(isEditMode ? '게시물 수정에 실패했습니다.' : '게시물 등록에 실패했습니다.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>게시물을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <main className="write-content">
        <div className="write-card">
          <header className="write-header">
            <h1>{isEditMode ? '게시물 수정' : '새 글 작성'}</h1>
            <p>{isEditMode ? '게시물 내용을 수정하세요' : '새로운 이야기를 들려주세요'}</p>
          </header>

          <form onSubmit={handleSubmit} className="write-form">
            <div className="form-group">
              <label htmlFor="author">작성자</label>
              <input
                id="author"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="이름을 입력하세요"
                disabled={isEditMode}
                className={isEditMode ? 'disabled' : ''}
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
                placeholder="제목을 입력하세요"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">내용</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="내용을 입력하세요"
                rows="12"
              />
            </div>

            <div className="form-actions">
              <Link to={isEditMode ? `/post/${id}` : '/'} className="btn-cancel">
                취소
              </Link>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? '처리 중...' : isEditMode ? '수정하기' : '등록하기'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PostWritePage;
