# File Storage Client

A modern React-based file storage client application that allows users to upload, download, preview, and manage their files securely.

## Features

-  Signup
-  Signin
-  User Authentication (Sign up & Login)
-  File Upload with size limit (10MB)
-  File Download
-  File Preview
-  File Deletion
-  File List with Pagination
-  Responsive Design

## Tech Stack

- React
- TypeScript
- Material-UI (MUI)
- Axios for API calls
- React Router for navigation
- Context API for state management

## Prerequisites

- npm or yarn
- Backend server running (see server README)

## Installation

1. Clone the repository
2. Navigate to the client directory:
```bash
cd file-storage-client
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Create a `.env` file in the root directory with the following variables:
```
REACT_APP_API_URL=http://localhost:3000/api
```

## Running the Application

1. Start the development server:
```bash
npm start
# or
yarn start
```

2. Open [http://localhost:3001](http://localhost:3001) in your browser

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── contexts/       # React contexts (Auth, etc.)
  ├── pages/         # Page components
  ├── services/      # API services
  ├── utils/         # Utility functions
  └── App.tsx        # Main application component
```

## API Integration

The client communicates with the backend API for:
- User authentication
- File operations (upload, download, delete)
- File listing and pagination

## Security Features

- JWT-based authentication
- Secure file uploads
- Protected routes
- Token refresh mechanism

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
