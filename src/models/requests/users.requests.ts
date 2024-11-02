import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

//file này lưu các định nghĩa của các request
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LoginReqBody {
  email: string
  password: string
}

//định nghĩa lại những gì nhận đc sau decode
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface LogoutReqBody {
  refresh_token: string
}
