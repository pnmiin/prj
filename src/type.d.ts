import User from './models/schemas/User.schema'
import { Request } from 'express'
declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
