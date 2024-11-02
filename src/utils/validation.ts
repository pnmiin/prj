//viết hàm validate nhận vào checkSchema
//hàm sẽ trả ra middleware xử lí lỗi

import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { Request, Response, NextFunction } from 'express'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
//ai gọi validate(checkSchema) nhận được middleware
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req) //ghi lỗi vào req
    const errors = validationResult(req) //lấy lỗi từ trong req
    if (errors.isEmpty()) {
      return next()
    } else {
      const errorObject = errors.mapped()
      const entityError = new EntityError({ errors: {} }) // truyền arow rỗng vì ban đầu ko có lỗi
      //duyệt qua các key trog object lỗi
      for (const key in errorObject) {
        //lấy msg trog các key đó
        const { msg } = errorObject[key]
        if (msg instanceof ErrorWithStatus && msg.status != HTTP_STATUS.UNPROCESSABLE_ENTITY) {
          return next(msg) //trả ra các lỗi đặc biệt và xử lí nó trc
        }
        entityError.errors[key] = msg
      }
      next(entityError)
    }
  }
}
