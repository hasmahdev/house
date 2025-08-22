import { RequestHandler } from "express";
import {
  Room,
  Section,
  Mission,
  CreateRoomRequest,
  CreateSectionRequest,
  CreateMissionRequest,
  UpdateMissionRequest,
} from "@shared/api";

// Mock data - in production, this would be a real database
let rooms: Room[] = [
  {
    id: "1",
    name: "المطبخ",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "غرفة المعيشة",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "الحمام",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let sections: Section[] = [
  {
    id: "1",
    name: "Countertops",
    roomId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Appliances",
    roomId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Seating Area",
    roomId: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let missions: Mission[] = [
  {
    id: "1",
    title: "Clean kitchen counters",
    sectionId: "1",
    assignedToUserId: "2",
    status: "pending",
    priority: "high",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Vacuum living room",
    sectionId: "3",
    assignedToUserId: "2",
    status: "in_progress",
    priority: "medium",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Room endpoints
export const handleGetRooms: RequestHandler = (req, res) => {
  res.json(rooms);
};

export const handleCreateRoom: RequestHandler = (req, res) => {
  try {
    const { name }: CreateRoomRequest = req.body;

    if (!name) {
      return res.status(400).json({ error: "Room name is required" });
    }

    const newRoom: Room = {
      id: (rooms.length + 1).toString(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    rooms.push(newRoom);
    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleDeleteRoom: RequestHandler = (req, res) => {
  try {
    const { roomId } = req.params;

    const roomIndex = rooms.findIndex((r) => r.id === roomId);
    if (roomIndex === -1) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Also delete associated sections and missions
    sections = sections.filter((s) => s.roomId !== roomId);
    missions = missions.filter(
      (m) => !sections.find((s) => s.id === m.sectionId && s.roomId === roomId),
    );

    rooms.splice(roomIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Section endpoints
export const handleGetSections: RequestHandler = (req, res) => {
  const { roomId } = req.params;
  const roomSections = sections.filter((s) => s.roomId === roomId);
  res.json(roomSections);
};

export const handleCreateSection: RequestHandler = (req, res) => {
  try {
    const { name, roomId }: CreateSectionRequest = req.body;

    if (!name || !roomId) {
      return res
        .status(400)
        .json({ error: "Section name and room ID are required" });
    }

    const room = rooms.find((r) => r.id === roomId);
    if (!room) {
      return res.status(400).json({ error: "Room not found" });
    }

    const newSection: Section = {
      id: (sections.length + 1).toString(),
      name,
      roomId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sections.push(newSection);
    res.status(201).json(newSection);
  } catch (error) {
    console.error("Create section error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mission endpoints
export const handleGetMissions: RequestHandler = (req, res) => {
  const { userId } = req.query;

  if (userId) {
    const userMissions = missions.filter((m) => m.assignedToUserId === userId);
    return res.json(userMissions);
  }

  res.json(missions);
};

export const handleCreateMission: RequestHandler = (req, res) => {
  try {
    const {
      title,
      sectionId,
      assignedToUserId,
      priority,
      dueDate,
    }: CreateMissionRequest = req.body;

    if (!title || !sectionId || !assignedToUserId || !priority) {
      return res
        .status(400)
        .json({
          error:
            "Title, section ID, assigned user ID, and priority are required",
        });
    }

    const section = sections.find((s) => s.id === sectionId);
    if (!section) {
      return res.status(400).json({ error: "Section not found" });
    }

    const newMission: Mission = {
      id: (missions.length + 1).toString(),
      title,
      sectionId,
      assignedToUserId,
      status: "pending",
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    missions.push(newMission);
    res.status(201).json(newMission);
  } catch (error) {
    console.error("Create mission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleUpdateMission: RequestHandler = (req, res) => {
  try {
    const { missionId } = req.params;
    const updates: UpdateMissionRequest = req.body;

    const missionIndex = missions.findIndex((m) => m.id === missionId);
    if (missionIndex === -1) {
      return res.status(404).json({ error: "Mission not found" });
    }

    const mission = missions[missionIndex];
    const updatedMission: Mission = {
      ...mission,
      ...updates,
      dueDate: updates.dueDate ? new Date(updates.dueDate) : mission.dueDate,
      completedAt:
        updates.status === "completed" && mission.status !== "completed"
          ? new Date()
          : mission.completedAt,
      updatedAt: new Date(),
    };

    missions[missionIndex] = updatedMission;
    res.json(updatedMission);
  } catch (error) {
    console.error("Update mission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleDeleteMission: RequestHandler = (req, res) => {
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
