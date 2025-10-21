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
import { getSupabase } from '../db'

export const handleGetRooms = async (c: Context) => {
  const supabase = getSupabase(c.env)
  const { data, error } = await supabase.from('rooms').select('*')
  if (error) {
    console.error('Get rooms error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
  return c.json(data)
}

export const handleCreateRoom = async (c: Context) => {
  try {
    const { name }: CreateRoomRequest = await c.req.json()
    const supabase = getSupabase(c.env)

    if (!name) {
      return c.json({ error: 'Room name is required' }, 400)
    }

    const { data, error } = await supabase.from('rooms').insert([{ name }]).select()

    if (error) {
      console.error('Create room error:', error)
      return c.json({ error: 'Internal server error' }, 500)
    }

    return c.json(data[0], 201)
  } catch (error) {
    console.error('Create room error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleDeleteRoom = async (c: Context) => {
  try {
    const roomId = c.req.param('roomId')
    const supabase = getSupabase(c.env)

    const { error } = await supabase.from('rooms').delete().eq('id', roomId)

    if (error) {
      return c.json({ error: 'Room not found' }, 404)
    }

    return c.body(null, 204)
  } catch (error) {
    console.error('Delete room error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleGetSections = async (c: Context) => {
  const roomId = c.req.param('roomId')
  const supabase = getSupabase(c.env)
  const { data, error } = await supabase.from('sections').select('*').eq('room_id', roomId)
  if (error) {
    console.error('Get sections error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
  return c.json(data)
}

export const handleCreateSection = async (c: Context) => {
  try {
    const { name, roomId }: CreateSectionRequest = await c.req.json()
    const supabase = getSupabase(c.env)

    if (!name || !roomId) {
      return c.json({ error: 'Section name and room ID are required' }, 400)
    }

    const { data, error } = await supabase.from('sections').insert([{ name, room_id: roomId }]).select()

    if (error) {
      console.error('Create section error:', error)
      return c.json({ error: 'Internal server error' }, 500)
    }

    return c.json(data[0], 201)
  } catch (error) {
    console.error('Create section error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleGetMissions = async (c: Context) => {
  const userId = c.req.query('userId')
  const supabase = getSupabase(c.env)

  let query = supabase.from('missions').select('*')

  if (userId) {
    query = query.eq('assigned_to_user_id', userId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Get missions error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }

  return c.json(data)
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
    const supabase = getSupabase(c.env)

    if (!title || !sectionId || !assignedToUserId || !priority) {
      return c.json(
        {
          error:
            'Title, section ID, assigned user ID, and priority are required',
        },
        400
      )
    }

    const { data, error } = await supabase
      .from('missions')
      .insert([
        {
          title,
          section_id: sectionId,
          assigned_to_user_id: assignedToUserId,
          priority,
          due_date: dueDate,
          status: 'pending',
        },
      ])
      .select()

    if (error) {
      console.error('Create mission error:', error)
      return c.json({ error: 'Internal server error' }, 500)
    }

    return c.json(data[0], 201)
  } catch (error) {
    console.error('Create mission error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleUpdateMission = async (c: Context) => {
  try {
    const missionId = c.req.param('missionId')
    const updates: UpdateMissionRequest = await c.req.json()
    const supabase = getSupabase(c.env)

    const { data, error } = await supabase
      .from('missions')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', missionId)
      .select()

    if (error) {
      return c.json({ error: 'Mission not found' }, 404)
    }

    return c.json(data[0])
  } catch (error) {
    console.error('Update mission error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleDeleteMission = async (c: Context) => {
  try {
    const missionId = c.req.param('missionId')
    const supabase = getSupabase(c.env)

    const { error } = await supabase.from('missions').delete().eq('id', missionId)

    if (error) {
      return c.json({ error: 'Mission not found' }, 404)
    }

    return c.body(null, 204)
  } catch (error) {
    console.error('Delete mission error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
