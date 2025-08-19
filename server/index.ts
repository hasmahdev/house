import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLogin,
  handleGetUsers,
  handleCreateUser,
  handleDeleteUser,
} from "./routes/auth";
import {
  handleGetRooms,
  handleCreateRoom,
  handleDeleteRoom,
  handleGetSections,
  handleCreateSection,
  handleGetMissions,
  handleCreateMission,
  handleUpdateMission,
  handleDeleteMission,
} from "./routes/cleaning";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/login", handleLogin);
  app.get("/api/users", handleGetUsers);
  app.post("/api/users", handleCreateUser);
  app.delete("/api/users/:userId", handleDeleteUser);

  // Room routes
  app.get("/api/rooms", handleGetRooms);
  app.post("/api/rooms", handleCreateRoom);
  app.delete("/api/rooms/:roomId", handleDeleteRoom);

  // Section routes
  app.get("/api/rooms/:roomId/sections", handleGetSections);
  app.post("/api/sections", handleCreateSection);

  // Mission routes
  app.get("/api/missions", handleGetMissions);
  app.post("/api/missions", handleCreateMission);
  app.put("/api/missions/:missionId", handleUpdateMission);
  app.delete("/api/missions/:missionId", handleDeleteMission);

  return app;
}
