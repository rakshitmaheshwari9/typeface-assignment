# File Storage Server

A robust Node.js backend server for handling file storage operations with secure authentication and AWS S3 integration.

Postman Collections for the APIs:-

```https://www.postman.com/sap000-8080/workspace/publci/collection/39195516-1466e20b-7448-40e9-aaeb-a3b9402d6d47?action=share&creator=39195516```

## Features

-  JWT-based Authentication
-  Secure File Upload to AWS S3
-  Secure File Download
-  File Preview Generation
-  File Deletion
-  File Listing with Pagination
-  Token Refresh Mechanism

## Tech Stack

- Node.js
- Nest.js
- TypeScript
- Mysql
- AWS S3
- JWT Authentication

## Prerequisites

- Node.js (v18 or higher)
- pnpm(preferable) or yarn
- Mysql docker image and docker configurations
- AWS Account with S3 bucket configured
- AWS CLI configured with credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

Setup the below in the app-config file:-

```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
```

## Installation

1. Clone the repository
2. Navigate to the server directory:
```bash
cd file-storage-server
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

## Running the Application

1. Run the docker compose to start the mysql server:-
```bash
docker-compose up -d
```


2. Start the local server:
```bash
npm run local
# or
yarn local
```

3. Close the mysql docker server :-
```bash
docker-compose down
```


## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/refresh` - Refresh access token

### Files
- `GET /api/files` - List files (with pagination)
- `POST /api/files/presigned-url` - Get presigned URL for upload
- `GET /api/files/:id/url` - Get file URL for preview/download
- `DELETE /api/files/:id` - Delete file

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Secure file uploads to S3
- CORS configuration
- Input validation

## File Storage

- Files are stored in AWS S3
- Presigned URLs for secure uploads
- File metadata stored in MySQL
- File size limit: 10MB
- Supported file types: All

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Error Handling

The API uses a consistent error response format:
```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```