# CRM System - Full Stack Application

A complete CRM (Customer Relationship Management) system with a Node.js/Express backend and React frontend.

## Project Structure

```
.
├── backend/          # Node.js/Express REST API
│   ├── src/          # Source code
│   ├── prisma/       # Prisma schema and migrations
│   ├── tests/        # Jest tests
│   └── package.json
├── frontend/         # React frontend
│   ├── src/          # React components and pages
│   └── package.json
└── README.md
```

## Features

### Backend API
- **Employee Authentication**: Register and login with JWT tokens
- **Public Enquiry Form**: Unauthenticated endpoint for customers to submit enquiries
- **Enquiry Management**: 
  - List unclaimed enquiries
  - Atomically claim enquiries (prevents race conditions)
  - View enquiries claimed by logged-in employee
- **Security**: Password hashing with bcrypt, JWT token authentication
- **Validation**: Input validation for all endpoints
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

### Frontend
- **Modern React UI** with beautiful, responsive design
- **Public Enquiry Form** - Customers can submit enquiries without registration
- **Employee Authentication** - Login and registration pages
- **Employee Dashboard** - View and manage enquiries
- **Real-time Updates** - Auto-refresh enquiry lists every 30 seconds
- **Protected Routes** - Secure access to employee-only pages

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **Prisma** ORM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **Jest** for testing

### Frontend
- **React** 18
- **Vite** for fast development
- **React Router** for routing
- **Axios** for API calls
- **Modern CSS** with responsive design

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd ishan
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/crm_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

Create the PostgreSQL database:

```bash
createdb crm_db
```

Or using psql:
```sql
CREATE DATABASE crm_db;
```

Generate Prisma Client and run migrations:

```bash
cd backend
npm run db:generate
npm run db:migrate
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional):

```env
VITE_API_URL=http://localhost:3000
```

## Running the Application

### Development Mode

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3000`

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Backend
```bash
cd backend
npm start
```

## API Endpoints

### Authentication

#### Register Employee
```bash
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "employee@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```bash
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "employee@example.com",
  "password": "password123"
}
```

### Enquiries

#### Create Public Enquiry (Unauthenticated)
```bash
POST /api/enquiries/public
```

**Request Body:**
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+1234567890",
  "message": "This is my enquiry message"
}
```

#### Get Unclaimed Enquiries (Authenticated)
```bash
GET /api/enquiries/unclaimed
Headers: Authorization: Bearer <token>
```

#### Claim Enquiry (Authenticated)
```bash
POST /api/enquiries/:id/claim
Headers: Authorization: Bearer <token>
```

#### Get My Enquiries (Authenticated)
```bash
GET /api/enquiries/mine
Headers: Authorization: Bearer <token>
```

## Frontend Routes

- `/` - Home page
- `/enquiry` - Public enquiry form (unauthenticated)
- `/login` - Employee login
- `/register` - Employee registration
- `/dashboard` - Employee dashboard (protected, requires authentication)

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend
The frontend uses Vite's built-in development server with hot module replacement.

## Database Management

### Generate Prisma Client
```bash
cd backend
npm run db:generate
```

### Create a new migration
```bash
cd backend
npm run db:migrate
```

### Open Prisma Studio (Database GUI)
```bash
cd backend
npm run db:studio
```

## Business Rules

1. **Enquiries start unclaimed**: All new enquiries have `claimedBy = null`
2. **Atomic claim operation**: The claim endpoint uses `updateMany` with a `claimedBy: null` condition to prevent race conditions. Only one employee can claim an enquiry at a time.
3. **Authentication required**: Only authenticated employees can:
   - View unclaimed enquiries
   - Claim enquiries
   - View their own claimed enquiries
4. **Public form**: The public enquiry endpoint is unauthenticated and accessible to anyone
5. **Password security**: All passwords are hashed using bcrypt before storage
6. **JWT tokens**: Tokens are signed with a secret key from environment variables

## Error Handling

### Backend
The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // For validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `409` - Conflict (e.g., enquiry already claimed, duplicate email)

### Frontend
The frontend displays user-friendly error messages and success notifications.

## Development Tips

1. **CORS**: The frontend proxy in `vite.config.js` handles API requests during development
2. **Hot Reload**: Both frontend and backend support hot reload in development mode
3. **Environment Variables**: Use `.env` files for configuration (see `.env.example` files)
4. **Database Changes**: After modifying Prisma schema, run `npm run db:migrate` in the backend folder..

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
