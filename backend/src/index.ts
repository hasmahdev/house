import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { handleDemo } from './routes/demo'
import { handleLogin, handleGetUsers, handleCreateUser, handleDeleteUser } from './routes/auth'
import { handleGetRooms, handleCreateRoom, handleDeleteRoom, handleGetSections, handleCreateSection, handleGetMissions, handleCreateMission, handleUpdateMission, handleDeleteMission } from './routes/cleaning'

const app = new Hono()

app.get('/api/ping', (c) => {
  const ping = process.env.PING_MESSAGE ?? 'ping'
  return c.json({ message: ping })
})

app.get('/api/demo', handleDemo)

app.post('/api/auth/login', handleLogin)
app.get('/api/users', handleGetUsers)
app.post('/api/users', handleCreateUser)
app.delete('/api/users/:userId', handleDeleteUser)

app.get('/api/rooms', handleGetRooms)
app.post('/api/rooms', handleCreateRoom)
app.delete('/api/rooms/:roomId', handleDeleteRoom)

app.get('/api/rooms/:roomId/sections', handleGetSections)
app.post('/api/sections', handleCreateSection)

app.get('/api/missions', handleGetMissions)
app.post('/api/missions', handleCreateMission)
app.put('/api/missions/:missionId', handleUpdateMission)
app.delete('/api/missions/:missionId', handleDeleteMission)

serve(app, () => {
  console.log('Server is running on http://localhost:3000')
})
