import { RequestHandler } from "express";
import { LoginRequest, LoginResponse, User } from "@shared/api";
import { supabaseServer } from "../lib/supabase";

// Mock users database - in production, this would be a real database
const users: User[] = [
  {
    id: "1",
    name: "ماما",
    role: "admin",
    password: "admin123", // In production, this would be hashed
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "ع��و العائلة",
    role: "member",
    password: "member123", // In production, this would be hashed
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { userId, password }: LoginRequest = req.body;

    if (!userId || !password) {
      return res
        .status(400)
        .json({ error: "User ID and password are required" });
    }

    // If Supabase is configured, use it for auth
    if (supabaseServer) {
      // Here we treat userId as email for Supabase email sign-in
      const { data, error } = await supabaseServer.auth.signInWithPassword({
        email: userId,
        password,
      });
      if (error || !data.session || !data.user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user: User = {
        id: data.user.id,
        name: data.user.email ?? data.user.id,
        role: "member",
        createdAt: new Date(data.user.created_at ?? Date.now()),
        updatedAt: new Date(),
      };

      const response: LoginResponse = {
        user,
        token: data.session.access_token,
      };
      return res.json(response);
    }

    // Fallback to mock users (no Supabase configured)
    const user = users.find((u) => u.id === userId && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const { password: _, ...userWithoutPassword } = user;
    const response: LoginResponse = {
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}`,
    };
    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetUsers: RequestHandler = (req, res) => {
  try {
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleCreateUser: RequestHandler = (req, res) => {
  try {
    const { name, password, role } = req.body;

    if (!name || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (users.find((u) => u.name === name)) {
      return res
        .status(400)
        .json({ error: "User with this name already exists" });
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      role,
      password, // In production, this would be hashed
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleDeleteUser: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;

    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users.splice(userIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
