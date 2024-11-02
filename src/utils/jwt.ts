//file này lưu hàm 'giúp mình ký ra 1 token' bằng jwt
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { resolve } from 'path'
import { reject } from 'lodash'
import { TokenPayload } from '~/models/requests/users.requests'
dotenv.config()
export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, rejects) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) throw rejects(error)
      else return resolve(token as string)
    })
  })
}

//làm hàm verfy token
export const verifyToken = ({ token, privateKey }: { token: string; privateKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, privateKey, (error, decode) => {
      if (error) throw reject(error)
      else return resolve(decode as TokenPayload)
    })
  })
}
