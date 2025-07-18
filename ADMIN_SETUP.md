# Admin Panel Setup Guide

## Setting up Admin Credentials

To secure your admin panel, you need to set up the admin credentials as Wrangler secrets:

### 1. Set the admin username:
```bash
wrangler secret put ADMIN_USERNAME
```
When prompted, enter: `your-username`

### 2. Set the admin password:
```bash
wrangler secret put ADMIN_PASSWORD
```
When prompted, enter: `your-passwword`

### 3. Deploy your application:
```bash
npm run deploy
```

## Accessing the Admin Panel

Once deployed, you can access the admin panel at:
- **URL**: `https://your-domain.com/admin`
- **Username**: `ali`
- **Password**: `MaxPayne@1999`

## Features

The admin panel includes:
- **Dashboard**: Overview of your blog posts with statistics
- **Posts Management**: Create, edit, delete, and publish blog posts
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Markdown Support**: Write your posts in Markdown format
- **SEO-Friendly**: Automatic slug generation and meta descriptions

## Development

For local development, the default credentials are already set in the auth.ts file as fallbacks.

To run locally:
```bash
npm run dev
```

Then visit `http://localhost:5173/admin` to access the admin panel.

## Security Notes

- Admin credentials are stored as Wrangler secrets (encrypted)
- Sessions expire after 24 hours
- Only HTTPS connections are secure in production
- The admin panel is protected by session-based authentication
