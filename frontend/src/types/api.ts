/**
 * Shared code between client and server
 * Types and interfaces for the house cleaning management app
 */

export interface User {
  id: string;
  name: string;
  role: "admin" | "member";
  password?: string; // Only included on server-side operations
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  name: string;
  roomId: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Mission {
  id: string;
  title: string;
  description?: string;
  sectionId: string;
  assignedToUserId: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response types
export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateUserRequest {
  name: string;
  password: string;
  role: "admin" | "member";
}

export interface CreateRoomRequest {
  name: string;
}

export interface CreateSectionRequest {
  name: string;
  roomId: string;
}

export interface CreateMissionRequest {
  title: string;
  sectionId: string;
  assignedToUserId: string;
  priority: "low" | "medium" | "high";
  dueDate?: string; // ISO date string
}

export interface UpdateMissionRequest {
  title?: string;
  assignedToUserId?: string;
  status?: "pending" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

// Dashboard data structures
export interface DashboardData {
  rooms: Room[];
  totalMissions: number;
  completedMissions: number;
  pendingMissions: number;
  userMissions: Mission[];
}

export interface AdminDashboardData extends DashboardData {
  users: User[];
  allMissions: Mission[];
}

// Example response type for /api/demo
export interface DemoResponse {
  message: string;
}
