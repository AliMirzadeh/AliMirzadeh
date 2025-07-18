-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT FALSE
);

-- Index for published posts ordered by date
CREATE INDEX IF NOT EXISTS idx_published_date ON blog_posts (published, created_at DESC);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_slug ON blog_posts (slug);
