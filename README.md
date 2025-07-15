# Back End

The backend serves as an API to handle requests from the frontend

## Domain Access

https://spotify.thekunfo.com/

**Production API URL**:

- Primary: `https://apispotify.thekunfo.com/api/`
- Alternative: `https://api.apispotify.thekunfo.com/`

Both patterns are supported for API access in production mode.

Technologies and Techniques Used

- Node.js: JavaScript runtime environment for backend development

- Express.js: Web framework to build RESTful APIs

- MongoDB: NoSQL database to store playlist and user data

- Mongoose: ODM library to interact with MongoDB easily

- JWT (JSON Web Tokens): For user authentication and session management

- Helmet: Security middleware to set various HTTP headers

- ESLint and Prettier: Tools to maintain code quality and style consistency

- Async/Await and Promises: For efficient asynchronous request handling

## Security Features

The API implements multiple security layers using Helmet middleware:

- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling resource loading
- **HTTP Strict Transport Security (HSTS)**: Forces HTTPS connections in production
- **X-Frame-Options**: Prevents clickjacking attacks by denying iframe embedding
- **X-Content-Type-Options**: Prevents MIME type sniffing attacks
- **X-XSS-Protection**: Enables browser XSS filtering
- **Referrer Policy**: Controls referrer information sent to other sites
- **CORS Configuration**: Restricts cross-origin requests to approved domains

## Configuration Management

The application uses a structured configuration system with separate files for different environments:

### Configuration Files Structure:

- `config/constants.js` - Application constants and default values
- `config/development.js` - Development environment configuration
- `config/production.js` - Production environment configuration
- `config/index.js` - Environment loader and configuration validator
- `utils/config.js` - Legacy compatibility layer

### Environment-Specific Settings:

**Development:**

- MongoDB: Local database connection
- JWT: Development secret key included in config
- CORS: Localhost origins
- Security: Relaxed CSP for development tools
- Logging: Debug level with console output

**Production:**

- MongoDB: Environment variable required (`MONGODB_URI`)
- JWT: Environment variable required (`JWT_SECRET`)
- CORS: Domain-specific origins with API subdomain/subdirectory support
- Security: Strict HSTS and CSP policies
- Logging: Info level, file-only output

### Rate Limiting

The API implements comprehensive rate limiting to prevent abuse and ensure fair usage:

**Rate Limit Types:**
- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login/signup attempts per 15 minutes per IP
- **Playlist Operations**: 20 create/update/delete operations per 5 minutes per IP
- **Read Operations**: 60 GET requests per minute per IP

**Development Mode**: All rate limits are 10x more lenient for easier testing

**Rate Limit Headers**: API responses include standard `RateLimit-*` headers with current usage information

**Rate Limit Configuration**: Configured in `middlewares/rateLimiter.js` with environment-specific adjustments

### Security Features

The API implements multiple security layers using Helmet middleware:

- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling resource loading
- **HTTP Strict Transport Security (HSTS)**: Forces HTTPS connections in production
- **X-Frame-Options**: Prevents clickjacking attacks by denying iframe embedding
- **X-Content-Type-Options**: Prevents MIME type sniffing attacks
- **X-XSS-Protection**: Enables browser XSS filtering
- **Referrer Policy**: Controls referrer information sent to other sites
- **CORS Configuration**: Restricts cross-origin requests to approved domains

### Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

`npm run lint` — to check code quality with ESLint
