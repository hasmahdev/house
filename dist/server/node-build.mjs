import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const users = [
  {
    id: "1",
    name: "مدير النظام",
    role: "admin",
    password: "admin123",
    // In production, this would be hashed
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "2",
    name: "عضو العائلة",
    role: "member",
    password: "member123",
    // In production, this would be hashed
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }
];
const handleLogin = (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ error: "User ID and password are required" });
    }
    const user = users.find((u) => u.id === userId && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const { password: _, ...userWithoutPassword } = user;
    const response = {
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}`
      // In production, generate real JWT
    };
    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleGetUsers = (req, res) => {
  try {
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleCreateUser = (req, res) => {
  try {
    const { name, password, role } = req.body;
    if (!name || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (users.find((u) => u.name === name)) {
      return res.status(400).json({ error: "User with this name already exists" });
    }
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      role,
      password,
      // In production, this would be hashed
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    users.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleDeleteUser = (req, res) => {
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
let rooms = [
  {
    id: "1",
    name: "Kitchen",
    description: "Main cooking and dining area",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "2",
    name: "Living Room",
    description: "Family gathering space",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "3",
    name: "Bathroom",
    description: "Main bathroom",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }
];
let sections = [
  {
    id: "1",
    name: "Countertops",
    description: "Kitchen counter surfaces",
    roomId: "1",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "2",
    name: "Appliances",
    description: "Kitchen appliances",
    roomId: "1",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "3",
    name: "Seating Area",
    description: "Sofas and chairs",
    roomId: "2",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }
];
let missions = [
  {
    id: "1",
    title: "Clean kitchen counters",
    description: "Wipe down all countertops and appliances",
    sectionId: "1",
    assignedToUserId: "2",
    status: "pending",
    priority: "high",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  },
  {
    id: "2",
    title: "Vacuum living room",
    description: "Vacuum the carpet and clean under furniture",
    sectionId: "3",
    assignedToUserId: "2",
    status: "in_progress",
    priority: "medium",
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date()
  }
];
const handleGetRooms = (req, res) => {
  res.json(rooms);
};
const handleCreateRoom = (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Room name is required" });
    }
    const newRoom = {
      id: (rooms.length + 1).toString(),
      name,
      description,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    rooms.push(newRoom);
    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleDeleteRoom = (req, res) => {
  try {
    const { roomId } = req.params;
    const roomIndex = rooms.findIndex((r) => r.id === roomId);
    if (roomIndex === -1) {
      return res.status(404).json({ error: "Room not found" });
    }
    sections = sections.filter((s) => s.roomId !== roomId);
    missions = missions.filter(
      (m) => !sections.find((s) => s.id === m.sectionId && s.roomId === roomId)
    );
    rooms.splice(roomIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleGetSections = (req, res) => {
  const { roomId } = req.params;
  const roomSections = sections.filter((s) => s.roomId === roomId);
  res.json(roomSections);
};
const handleCreateSection = (req, res) => {
  try {
    const { name, description, roomId } = req.body;
    if (!name || !roomId) {
      return res.status(400).json({ error: "Section name and room ID are required" });
    }
    const room = rooms.find((r) => r.id === roomId);
    if (!room) {
      return res.status(400).json({ error: "Room not found" });
    }
    const newSection = {
      id: (sections.length + 1).toString(),
      name,
      description,
      roomId,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    sections.push(newSection);
    res.status(201).json(newSection);
  } catch (error) {
    console.error("Create section error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleGetMissions = (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userMissions = missions.filter((m) => m.assignedToUserId === userId);
    return res.json(userMissions);
  }
  res.json(missions);
};
const handleCreateMission = (req, res) => {
  try {
    const {
      title,
      description,
      sectionId,
      assignedToUserId,
      priority,
      dueDate
    } = req.body;
    if (!title || !sectionId || !assignedToUserId || !priority) {
      return res.status(400).json({
        error: "Title, section ID, assigned user ID, and priority are required"
      });
    }
    const section = sections.find((s) => s.id === sectionId);
    if (!section) {
      return res.status(400).json({ error: "Section not found" });
    }
    const newMission = {
      id: (missions.length + 1).toString(),
      title,
      description,
      sectionId,
      assignedToUserId,
      status: "pending",
      priority,
      dueDate: dueDate ? new Date(dueDate) : void 0,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    missions.push(newMission);
    res.status(201).json(newMission);
  } catch (error) {
    console.error("Create mission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleUpdateMission = (req, res) => {
  try {
    const { missionId } = req.params;
    const updates = req.body;
    const missionIndex = missions.findIndex((m) => m.id === missionId);
    if (missionIndex === -1) {
      return res.status(404).json({ error: "Mission not found" });
    }
    const mission = missions[missionIndex];
    const updatedMission = {
      ...mission,
      ...updates,
      dueDate: updates.dueDate ? new Date(updates.dueDate) : mission.dueDate,
      completedAt: updates.status === "completed" && mission.status !== "completed" ? /* @__PURE__ */ new Date() : mission.completedAt,
      updatedAt: /* @__PURE__ */ new Date()
    };
    missions[missionIndex] = updatedMission;
    res.json(updatedMission);
  } catch (error) {
    console.error("Update mission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const handleDeleteMission = (req, res) => {
  try {
    const { missionId } = req.params;
    const missionIndex = missions.findIndex((m) => m.id === missionId);
    if (missionIndex === -1) {
      return res.status(404).json({ error: "Mission not found" });
    }
    missions.splice(missionIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error("Delete mission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
function createServer() {
  const app2 = express__default();
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.post("/api/auth/login", handleLogin);
  app2.get("/api/users", handleGetUsers);
  app2.post("/api/users", handleCreateUser);
  app2.delete("/api/users/:userId", handleDeleteUser);
  app2.get("/api/rooms", handleGetRooms);
  app2.post("/api/rooms", handleCreateRoom);
  app2.delete("/api/rooms/:roomId", handleDeleteRoom);
  app2.get("/api/rooms/:roomId/sections", handleGetSections);
  app2.post("/api/sections", handleCreateSection);
  app2.get("/api/missions", handleGetMissions);
  app2.post("/api/missions", handleCreateMission);
  app2.put("/api/missions/:missionId", handleUpdateMission);
  app2.delete("/api/missions/:missionId", handleDeleteMission);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
