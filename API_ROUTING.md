# API Routing Configuration

## Overview

The Spotify Share API now supports both subdirectory and subdomain routing patterns:

### 1. Subdirectory Access (`/api`)

All API endpoints are now available under the `/api` path:

- Base URL: `http://localhost:3002/api` (development)
- Base URL: `https://yourdomain.com/api` (production)

### 2. Subdomain Access (`api.`)

The API automatically detects requests from `api.` subdomains and routes them appropriately:

- Base URL: `http://api.localhost:3002` (development)
- Base URL: `https://api.yourdomain.com` (production)

## Endpoint Structure

### Public Endpoints (No Authentication)

- `GET /api/` - API status and documentation
- `POST /api/signin` - User authentication
- `POST /api/signup` - User registration
- `GET /api/playlists` - Get all public playlists
- `GET /api/playlists/:id` - Get specific playlist

### Protected Endpoints (Authentication Required)

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `POST /api/playlists` - Create new playlist
- `PATCH /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/like` - Like a playlist
- `POST /api/playlists/:id/unlike` - Unlike a playlist

## CORS Configuration

The application now supports CORS for both routing patterns:

### Development

- `http://localhost:*`
- `http://127.0.0.1:*`
- `http://api.localhost:*`

### Production

- `https://spotify.thekunfo.com`
- `https://apispotify.thekunfo.com`

## Implementation Details

### Subdomain Detection Middleware

```javascript
app.use((req, res, next) => {
  const host = req.get("host") || "";
  const isApiSubdomain = host.startsWith("api.");

  if (isApiSubdomain && req.path === "/") {
    req.url = "/api";
  } else if (isApiSubdomain && !req.path.startsWith("/api")) {
    req.url = `/api${req.path}`;
  }

  next();
});
```

### Route Mounting

- All API routes are mounted under `/api` prefix
- Root endpoint (`/`) provides API information and redirection
- 404 handling for non-existent endpoints

## Migration Notes

- All existing API calls should be updated to include `/api` prefix
- The API maintains backward compatibility through automatic subdomain routing
- No changes required for existing route handlers or controllers
