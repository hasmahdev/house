import { Context } from 'hono'
import {
  Room,
  Section,
  Mission,
  CreateRoomRequest,
  CreateSectionRequest,
  CreateMissionRequest,
  UpdateMissionRequest,
} from '../api'

let rooms: Room[] = [
  {
    id: '1',
    name: 'المطبخ',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'غرفة المعيشة',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'الحمام',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

let sections: Section[] = [
  {
    id: '1',
    name: 'الكاونترات',
    roomId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'الأجهزة',
    roomId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'منطقة الجلوس',
    roomId: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

let missions: Mission[] = [
  {
    id: '1',
    title: 'تنظيف كاونترات المطبخ',
    sectionId: '1',
    assignedToUserId: '2',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'تنظيف غرفة المعيشة بالمكنسة',
    sectionId: '3',
    assignedToUserId: '2',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const handleGetRooms = (c: Context) => {
  return c.json(rooms)
}

export const handleCreateRoom = async (c: Context) => {
  try {
    const { name }: CreateRoomRequest = await c.req.json()

    if (!name) {
      return c.json({ error: 'Room name is required' }, 400)
    }

    const newRoom: Room = {
      id: (rooms.length + 1).toString(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    rooms.push(newRoom)
    return c.json(newRoom, 201)
  } catch (error) {
    console.error('Create room error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleDeleteRoom = (c: Context) => {
  try {
    const roomId = c.req.param('roomId')

    const roomIndex = rooms.findIndex((r) => r.id === roomId)
    if (roomIndex === -1) {
      return c.json({ error: 'Room not found' }, 404)
    }

    const sectionsToDelete = sections.filter((s) => s.roomId === roomId)
    const sectionIdsToDelete = sectionsToDelete.map((s) => s.id)

    missions = missions.filter((m) => !sectionIdsToDelete.includes(m.sectionId))

    sections = sections.filter((s) => s.roomId !== roomId)

    rooms.splice(roomIndex, 1)
    return c.body(null, 204)
  } catch (error) {
    console.error('Delete room error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleGetSections = (c: Context) => {
  const roomId = c.req.param('roomId')
  const roomSections = sections.filter((s) => s.roomId === roomId)
  return c.json(roomSections)
}

export const handleCreateSection = async (c: Context) => {
  try {
    const { name, roomId }: CreateSectionRequest = await c.req.json()

    if (!name || !roomId) {
      return c.json({ error: 'Section name and room ID are required' }, 400)
    }

    const room = rooms.find((r) => r.id === roomId)
    if (!room) {
      return c.json({ error: 'Room not found' }, 400)
    }

    const newSection: Section = {
      id: (sections.length + 1).toString(),
      name,
      roomId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    sections.push(newSection)
    return c.json(newSection, 201)
  } catch (error) {
    console.error('Create section error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleGetMissions = (c: Context) => {
  const userId = c.req.query('userId')

  if (userId) {
    const userMissions = missions.filter((m) => m.assignedToUserId === userId)
    return c.json(userMissions)
  }

  return c.json(missions)
}

export const handleCreateMission = async (c: Context) => {
  try {
    const {
      title,
      sectionId,
      assignedToUserId,
      priority,
      dueDate,
    }: CreateMissionRequest = await c.req.json()

    if (!title || !sectionId || !assignedToUserId || !priority) {
      return c.json(
        {
          error:
            'Title, section ID, assigned user ID, and priority are required',
        },
        400
      )
    }

    const section = sections.find((s) => s.id === sectionId)
    if (!section) {
      return c.json({ error: 'Section not found' }, 400)
    }

    const newMission: Mission = {
      id: (missions.length + 1).toString(),
      title,
      sectionId,
      assignedToUserId,
      status: 'pending',
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    missions.push(newMission)
    return c.json(newMission, 201)
  } catch (error) {
    console.error('Create mission error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleUpdateMission = async (c: Context) => {
  try {
    const missionId = c.req.param('missionId')
    const updates: UpdateMissionRequest = await c.req.json()

    const missionIndex = missions.findIndex((m) => m.id === missionId)
    if (missionIndex === -1) {
      return c.json({ error: 'Mission not found' }, 404)
    }

    const mission = missions[missionIndex]
    const updatedMission: Mission = {
      ...mission,
      ...updates,
      dueDate: updates.dueDate ? new Date(updates.dueDate) : mission.dueDate,
      completedAt:
        updates.status === 'completed' && mission.status !== 'completed'
          ? new Date()
          : mission.completedAt,
      updatedAt: new Date(),
    }

    missions[missionIndex] = updatedMission
    return c.json(updatedMission)
  } catch (error) {
    console.error('Update mission error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleDeleteMission = (c: Context) => {
  try {
    const missionId = c.req.param('missionId')

    const missionIndex = missions.findIndex((m) => m.id === missionId)
    if (missionIndex === -1) {
      return c.json({ error: 'Mission not found' }, 404)
    }

    missions.splice(missionIndex, 1)
    return c.body(null, 204)
  } catch (error) {
    console.error('Delete mission error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
