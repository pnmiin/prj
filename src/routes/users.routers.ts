import { error } from 'console'
import express, { Request } from 'express'
import { access } from 'fs'
import { register } from 'module'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
//dựng userRoute
const userRouter = express.Router()

/*
    desc: Register a new user
    path: /register
    method: post
    body:{
        name: string,
        email: string,
        password: string,
        confirm_password: string,
        date_of_birth: string có cấu trúc ISO8601
    }
*/
userRouter.post('/register', registerValidator, wrapAsync(registerController))

//users/login
/*
desc: Login
path: users/login
method: post
body:{
    email: string,
    password: string
}
*/
userRouter.post('/login', loginValidator, wrapAsync(loginController))

/*
desc: logout
path: users/logout
method: post
Header: {Authorization: Bearer <access_token>}
body: {refresh_token : string}
*/
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

export default userRouter

//setup middleware cho userRouter
// userRouter.use(
//   (req, res, next) => {
//     console.log('Time: ', Date.now())
//     //return next()
//     next()
//     // res.status(400).send('Not Allowed')
//     // console.log('Ahihi')
//   },
//   (req, res, next) => {
//     console.log('Time2: ', Date.now())
//     next()
//   }
// ) //do nằm ở giữa nên có next

/*
    userRouter.post(
  '/register',
  registerValidator,
  (req, res, next) => {
    console.log('RQH 1')
    // next()
    //cần phải xác thực token(mã hóa ra)
    //ví dụ đang lấy data từ database bị rớt mạng
    //throw new Error('rớt mạng rồi')
    next(new Error('rớt mạng rồi'))
    //next(error) có nội dung nó biết là bug nên đi thẳng xuống errorhandler gần nhất
    //next ưu việt hơn throw vì throw ko chạy trên async đc
    //vsvd mẹo có thể sài throw
    //cách 1:
    // tr{
    //     throw new Error('rớt mạng rồi')
    // }catch(error){
    //     next(error)
    // }
    //cách 2:
    // Promise.reject(new Error('rớt mạng rồi')).catch(next)
  },
  (req, res, next) => {
    console.log('RQH 2')
    next()
  },
  (req, res, next) => {
    console.log('RQH 3')
    res.json({ message: 'success' })
  },
  (error, req, res, next) => {
    res.status(400).json({ message: error.message })
  }
)

export default userRouter

*/
