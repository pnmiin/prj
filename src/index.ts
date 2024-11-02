import express from 'express'
import userRouter from './routes/users.routers'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
//dùng express tạo server(app)
const app = express()
const PORT = 3000
databaseServices.connect() //kết nối database
//server dùng 1 middlewares biến đổi request dạng json
app.use(express.json())
//app dùng userRouter
app.use('/users', userRouter)
//sever mở ở PORT 3000
//http://localhost:3000/users/get-me req.body{email && password}
app.use(defaultErrorHandler)
app.listen(PORT, () => {
  console.log('SERVER BE đang mở ở port: ' + PORT)
})
