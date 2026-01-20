-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Insert sample data
INSERT INTO posts (title, content, author) VALUES
('첫 번째 게시물', '안녕하세요. 이것은 첫 번째 게시물입니다.', '작성자1'),
('두 번째 게시물', 'Spring Boot와 React를 공부 중입니다.', '작성자2'),
('세 번째 게시물', 'PostgreSQL + Spring Boot + React 조합 최고!', '작성자3');
