import { Context } from 'hono'
import { LoginRequest, LoginResponse, User } from '../api'
import { getSupabase } from '../db'

export const handleLogin = async (c: Context) => {
  try {
    const { userId, password }: LoginRequest = await c.req.json()
    const supabase = getSupabase(c.env)

    if (!userId || !password) {
      return c.json({ error: 'User ID and password are required' }, 400)
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .eq('password', password)
      .single()

    if (error || !data) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    const user: User = data
    const { password: _, ...userWithoutPassword } = user
    const response: LoginResponse = {
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}`,
    }
    return c.json(response)
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleGetUsers = async (c: Context) => {
  try {
    const supabase = getSupabase(c.env)
    const { data, error } = await supabase.from('users').select('id, name, role, created_at, updated_at')

    if (error) {
      throw new Error(error.message)
    }
    return c.json(data)
  } catch (error) {
    console.error('Get users error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleCreateUser = async (c: Context) => {
  try {
    const { name, password, role } = await c.req.json()
    const supabase = getSupabase(c.env)

    if (!name || !password || !role) {
      return c.json({ error: 'All fields are required' }, 400)
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, password, role }])
      .select()

    if (error) {
      return c.json({ error: 'User with this name already exists' }, 400)
    }

    const newUser = data[0]
    const { password: _, ...userWithoutPassword } = newUser
    return c.json(userWithoutPassword, 201)
  } catch (error) {
    console.error('Create user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleDeleteUser = async (c: Context) => {
  try {
    const userId = c.req.param('userId')
    const supabase = getSupabase(c.env)

    const { error } = await supabase.from('users').delete().eq('id', userId)

    if (error) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.body(null, 204)
  } catch (error) {
    console.error('Delete user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
