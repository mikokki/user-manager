# User Manager

A full-stack web application for managing users with JWT authentication, React frontend, Node.js/Express backend, and MongoDB database.

## Project Overview

This project demonstrates a complete CRUD (Create, Read, Update, Delete) application built with modern web technologies. Users can view, add, modify, update, and remove user records through an intuitive React interface, with all operations persisted in MongoDB.

## Tech Stack

### Frontend
- **React** - JavaScript library for building user interfaces
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS/Bootstrap** - Styling and responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling (ODM) library
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **Swagger** - API documentation (swagger-ui-express, swagger-jsdoc)

## Project Structure

```
user-manager/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ErrorNotification.js # Global error display
│   │   │   ├── Login.js             # Login form component
│   │   │   ├── Navbar.js            # Navigation bar
│   │   │   ├── ProtectedRoute.js    # Route guard component
│   │   │   ├── Register.js          # Registration form
│   │   │   ├── UserCard.js          # User card display
│   │   │   ├── UserDetail.js        # User details view
│   │   │   ├── UserForm.js          # User create/edit form
│   │   │   └── UserList.js          # User list table
│   │   ├── context/                 # React Context for state
│   │   │   └── ErrorContext.js      # Global error state
│   │   ├── pages/                   # Page components
│   │   │   ├── About.js             # About page
│   │   │   ├── Audit.js             # Audit logs page
│   │   │   ├── Home.js              # Home page
│   │   │   └── Users.js             # Users management page
│   │   ├── services/                # API service layer
│   │   │   ├── auditService.js      # Audit API calls
│   │   │   ├── authService.js       # Authentication API calls
│   │   │   └── userService.js       # User CRUD API calls
│   │   ├── App.js                   # Main app component
│   │   ├── App.css                  # Global styles
│   │   └── index.js                 # App entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
├── server/                          # Node.js backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/                 # Business logic
│   │   ├── auditController.js       # Audit log operations
│   │   ├── authController.js        # Authentication logic
│   │   └── userController.js        # User CRUD operations
│   ├── data/
│   │   └── dummyUsers.js            # Seed data for testing
│   ├── middleware/                  # Express middleware
│   │   ├── auth.js                  # JWT authentication
│   │   └── errorHandler.js          # Global error handler
│   ├── models/                      # Mongoose schemas
│   │   ├── AuditLog.js              # Audit log model
│   │   └── User.js                  # User model
│   ├── routes/                      # API route definitions
│   │   ├── audit.js                 # Audit endpoints
│   │   ├── auth.js                  # Auth endpoints
│   │   └── users.js                 # User endpoints
│   ├── scripts/
│   │   └── setup.js                 # Initial setup script
│   ├── server.js                    # Express server entry point
│   ├── package.json
│   └── .env                         # Environment variables
│
├── .gitignore
└── README.md
```

## API Documentation

Once the server is running, you can access the interactive API documentation at:

**Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

Raw Swagger JSON at: [http://localhost:5000/api-docs.json](http://localhost:5000/api-docs.json)

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/password` | Change password | Private |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Private |
| GET | `/api/users/:id` | Get user by ID | Private |
| POST | `/api/users` | Create a new user | Admin |
| PUT | `/api/users/:id` | Update user by ID | Admin |
| DELETE | `/api/users/:id` | Delete user by ID | Admin |
| POST | `/api/users/seed` | Seed dummy users | Admin |

### Audit Logs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/audit` | Get all audit logs | Private |
| GET | `/api/audit/entity/:id` | Get logs for entity | Private |

## Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  firstName: String (required, trimmed),
  lastName: String (required, trimmed),
  email: String (required, unique, lowercase, validated with regex),
  password: String (required, hashed with bcrypt, min 6 characters, excluded from queries),
  role: String (enum: ['user', 'admin'], default: 'user'),
  phone: String (optional, trimmed),
  address: String (optional, trimmed),
  city: String (optional, trimmed),
  state: String (optional, trimmed),
  zipCode: String (optional, trimmed),
  joinDate: Date (default: current date),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}

// Methods:
// - comparePassword(candidatePassword): Compare hashed passwords
// - generateAuthToken(): Generate JWT token for authentication
```

### Audit Log Model

```javascript
{
  _id: ObjectId,
  action: String (required, enum: ['CREATE', 'UPDATE', 'DELETE']),
  entityType: String (required, default: 'USER'),
  entityId: ObjectId (optional - not required for failed operations),
  details: Mixed (optional - flexible data for storing operation details),
  userEmail: String (optional),
  userName: String (optional),
  timestamp: Date (default: current date),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}

// Indexes for performance:
// - timestamp (descending)
// - action
// - entityId
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud - e.g., MongoDB Atlas)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/user-manager
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789
JWT_EXPIRE=7d
```

4. Run the setup script to create admin user and seed data (in cd server):
```bash
npm run setup
```

This will automatically:
- Connect to MongoDB
- Create an admin user with default credentials
- Seed dummy users for testing
- Display the login credentials

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

5. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### First Time Setup

1. **Run Setup Script** (creates admin user and seeds dummy users):
   ```bash
   cd server
   npm run setup
   ```

2. **Start the Application**:
   - Start backend: `cd server && npm start`
   - Start frontend: `cd client && npm start`

3. **Login**:
   - Navigate to `http://localhost:3000`
   - Click "Login"
   - Email: `admin@example.com`
   - Password: `admin123`

### Using the Application

1. **Register/Login** - Create an account or sign in with existing credentials
2. **View Users** - Navigate to the Users page (requires authentication)
3. **Add User** - Click "Add New User" (admin only)
4. **Edit User** - Click the edit button on any user (admin only)
5. **Delete User** - Click the delete button (admin only)
6. **View Audit Logs** - See all operations history in the Audit page
7. **Update Profile** - Update your own profile information
8. **Change Password** - Change your password from profile settings

### Using Swagger API Documentation

1. **Access Swagger UI** - Navigate to `http://localhost:5000/api-docs`
2. **Authenticate**:
   - First, login via the `/api/auth/login` endpoint to get your JWT token
   - Click the "Authorize" button at the top of the Swagger UI
   - Enter your token in the format: `Bearer <your-token>` (or just paste the token)
   - Click "Authorize" and then "Close"
3. **Test Endpoints** - Use the "Try it out" button on any endpoint to test it directly from the browser
4. **View Schemas** - Scroll down to see all data models and schemas

### User Roles

- **Admin**: Full access to create, update, and delete users
- **Regular User**: Can view users and update their own profile

### Dummy Users

The setup script can optionally seed dummy users:

## Environment Variables

### Server (.env)
```env
MONGODB_URI=mongodb://localhost:27017/user-manager
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789
JWT_EXPIRE=7d
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Scripts

### Server
```bash
npm run setup         # Interactive setup script - create admin user
npm start             # Start the server
npm run dev           # Start with nodemon (auto-reload)
npm test              # Run tests
```

### Client
```bash
npm start             # Start development server
npm run build         # Build for production
npm test              # Run tests
npm eject             # Eject from Create React App (⚠️ irreversible)
```
