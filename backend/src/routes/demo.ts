import { Context } from 'hono'
import { DemoResponse } from '../api'

export const handleDemo = (c: Context) => {
  const response: DemoResponse = {
    message: 'Hello from Hono server',
  }
  return c.json(response)
}
