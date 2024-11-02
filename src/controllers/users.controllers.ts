import { NextFunction, Request, Response } from 'express'
import { LoginReqBody, LogoutReqBody, RegisterReqBody, TokenPayload } from '~/models/requests/users.requests'
import User from '~/models/schemas/User.schemas'
import databaseServices from '~/services/database.services'
import usersServices from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
//controller là handler điều phối các dữ liệu vào đúng các service xử lí trích
//xuất dữ liệu với server

//controller là nơi xử lí logic, dữ liệu khi đến tầng này thì phải clean

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body

  //gọi database tạo user từ email và password lưu vào collection users của mongoDB

  //kiểm tra email có bị trùng ko, email có tồn tại ko, email có ai dùng chưa
  const isDup = await usersServices.checkEmailExist(email)
  if (isDup) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY, //422
      message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS
    })
  }
  const result = await usersServices.register(req.body)

  res.status(201).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
}

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body
  //dùng email và password để tìm user
  const result = await usersServices.login({ email, password })

  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result //có acc và rf
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  //vào đây thì nghĩa là 2 tiken kia là do mình kí ra
  //xem thử là thông tin user-id trong payload của access và
  //user_id trong payload của refresh có phải là 1 k?
  const { user_id: user_id_at } = req.decoded_authorization as TokenPayload
  const { user_id: user_id_rf } = req.decoded_refresh_token as TokenPayload
  //chặn việc nó gửi 2 mã 2 thằng khác nhau
  if (user_id_at != user_id_rf) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED, //401
      message: USERS_MESSAGES.REFRESH_TOKEN_TS_INVALID
    })
  }
  //nó gửi 1 cái refresh_token cũ và k còn tồn tại database
  //vào db xem doc nào chứ refresh_token này và có phải là user đó k
  await usersServices.checkRefreshToken({ user_id: user_id_rf, refresh_token })
  //nếu mà có thì mới xóa khỏi database
  await usersServices.logout(refresh_token)
  //nếu code tới đây mượt, k có con bug nào thì
  res.status(HTTP_STATUS.OK).json({
    messange: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}
