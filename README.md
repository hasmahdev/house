# CleanHouse - House Cleaning Management App

A modern, minimal web application for managing household cleaning tasks with multi-user support and admin capabilities.

## Features

✨ **Core Features:**

- **Room Management**: Create and organize rooms in your house
- **Section Organization**: Break down rooms into specific sections (e.g., Kitchen → Countertops, Appliances)
- **Mission Assignment**: Create and assign cleaning tasks to family members
- **User Accounts**: Password-protected accounts for each family member
- **Admin Panel**: Comprehensive admin interface for user and mission management
- **Role-Based Access**: Admin and member roles with different permissions

🎨 **Design:**

- Clean, modern, minimal interface
- Beautiful teal/green color scheme
- Fully responsive design
- Smooth animations and transitions

## Quick Start

1. **Development**:

   ```bash
   pnpm install
   pnpm dev
   ```

2. **Demo Accounts**:
   - **Admin**: admin@cleanhouse.app / admin123
   - **Member**: member@cleanhouse.app / member123

## Backend Requirements

### Current Implementation

The app currently runs with a **mock backend** using Express.js with in-memory data storage. This is suitable for development and demo purposes.

### Production Backend Requirements

For a production deployment, you'll need to implement the following:

#### 1. Database

- **PostgreSQL** or **MySQL** recommended
- Required tables:
  - `users` (id, email, name, password_hash, role, created_at, updated_at)
  - `rooms` (id, name, description, created_at, updated_at)
  - `sections` (id, name, description, room_id, created_at, updated_at)
  - `missions` (id, title, description, section_id, assigned_user_id, status, priority, due_date, completed_at, created_at, updated_at)

#### 2. Authentication & Security

- **Password Hashing**: Use bcrypt or similar for password storage
- **JWT Tokens**: Implement proper JWT authentication
- **Session Management**: Secure session handling
- **CORS Configuration**: Proper CORS setup for production domains

#### 3. API Endpoints (Already Implemented)

```typescript
// Authentication
POST /api/auth/login
GET /api/users
POST /api/users
DELETE /api/users/:userId

// Rooms
GET /api/rooms
POST /api/rooms
DELETE /api/rooms/:roomId

// Sections
GET /api/rooms/:roomId/sections
POST /api/sections

// Missions
GET /api/missions
POST /api/missions
PUT /api/missions/:missionId
DELETE /api/missions/:missionId
```

#### 4. Recommended Backend Stack

**Option 1: Node.js/Express (Current)**

- Express.js with TypeScript
- PostgreSQL with Prisma ORM
- bcrypt for password hashing
- jsonwebtoken for JWT auth

**Option 2: Supabase (Recommended for Quick Production)**

- Built-in PostgreSQL database
- Authentication & user management
  - Create a project in Supabase
  - Add `.env` variables:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
  - Client initialized in `client/lib/supabase.ts`

### Deployment: Vercel

- Configure project on Vercel
- Add Environment Variables from `.env.example`
- Routes:
  - API served by `api/[...path].ts` (Express wrapped via serverless)
  - SPA built into `dist/spa` and served via `vercel.json` rewrites
- Real-time subscriptions
- File storage if needed

**Option 3: Next.js API Routes**

- Full-stack React with API routes
- Prisma ORM for database
- NextAuth.js for authentication

#### 5. Environment Variables Needed

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/cleanhouse
JWT_SECRET=your-super-secret-jwt-key
BCRYPT_ROUNDS=12
NODE_ENV=production
```

#### 6. Deployment Considerations

- **Database hosting**: Railway, Supabase, or managed PostgreSQL
- **App hosting**: Vercel, Netlify, or Railway
- **Environment security**: Proper secret management
- **HTTPS**: SSL certificate for production

## MCP Integrations

This app is ready for Builder.io MCP integrations:

- **Neon**: For production PostgreSQL database
- **Supabase**: For backend-as-a-service with auth
- **Netlify/Vercel**: For deployment and hosting

## File Structure

```
client/               # React frontend
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks (auth, etc.)
├── pages/           # Route components
└── lib/             # Utilities

server/              # Express backend
├── routes/          # API route handlers
└── index.ts         # Server configuration

shared/              # Shared TypeScript types
└── api.ts           # API interfaces
```

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, Node.js
- **Routing**: React Router 6
- **State**: React Query for server state
- **Build**: Vite
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React

## Contributing

This is a demonstration project built with Builder.io. For production use, implement the backend requirements listed above.
