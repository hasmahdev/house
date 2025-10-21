import { Context } from 'hono'
import { LoginRequest, LoginResponse, User } from '../api'

const users: User[] = [
  {
    id: '1',
    name: 'ماما',
    role: 'admin',
    password: 'admin123',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'عضو العائلة',
    role: 'member',
    password: 'member123',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const handleLogin = async (c: Context) => {
  try {
    const { userId, password }: LoginRequest = await c.req.json()

    if (!userId || !password) {
      return c.json({ error: 'User ID and password are required' }, 400)
    }

    const user = users.find((u) => u.id === userId && u.password === password)
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
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

export const handleGetUsers = (c: Context) => {
  try {
    const usersWithoutPasswords = users.map(({ password, ...user }) => user)
    return c.json(usersWithoutPasswords)
  } catch (error) {
    console.error('Get users error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleCreateUser = async (c: Context) => {
  try {
    const { name, password, role } = await c.req.json()

    if (!name || !password || !role) {
      return c.json({ error: 'All fields are required' }, 400)
    }

    if (users.find((u) => u.name === name)) {
      return c.json({ error: 'User with this name already exists' }, 400)
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      role,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    users.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    return c.json(userWithoutPassword, 201)
  } catch (error) {
    console.error('Create user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const handleDeleteUser = (c: Context) => {
  try {
    const userId = c.req.param('userId')

    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      return c.json({ error: 'User not found' }, 404)
    }

    users.splice(userIndex, 1)
    return c.body(null, 204)
  } catch (error) {
    console.error('Delete user error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}
