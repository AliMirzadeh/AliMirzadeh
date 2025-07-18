// Database initialization functions
export async function initializeDatabase(db: D1Database): Promise<boolean> {
	try {
		// Create the blog_posts table if it doesn't exist
		await db.exec(`
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
			
			CREATE INDEX IF NOT EXISTS idx_published_date ON blog_posts (published, created_at DESC);
			CREATE INDEX IF NOT EXISTS idx_slug ON blog_posts (slug);
		`);
		
		return true;
	} catch (error) {
		console.error('Failed to initialize database:', error);
		return false;
	}
}

export async function testDatabaseConnection(db: D1Database): Promise<boolean> {
	try {
		await db.prepare('SELECT 1').first();
		return true;
	} catch (error) {
		console.error('Database connection test failed:', error);
		return false;
	}
}
