//file này chứa hàm xử lí lỗi của toàn bộ server
//lỗi của validate trả về sẽ có các dạng sau
//      EntityError{status, message, errors}
//      ErrorWithStatus{status, message}
//lỗi cảu controller trả về:
//      ErrorWithStatus{status, message}
//      Error bình thường {message, stack, name}

import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { Request, Response, NextFunction } from 'express'
import { ErrorWithStatus } from '~/models/Errors'
//=> lỗi từ mọi nơi đỗ về đây chưa chắc có status
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json(omit(err, ['status']))
  } else {
    //còn những lỗi khác có nhiều thuộc tính mình k biết, nhưng
    //có thể sẽ có stack và k có status
    //chỉnh hết các key trong object và enumerable true
    Object.getOwnPropertyNames(err).forEach((key) => {
      Object.defineProperty(err, key, { enumerable: true })
    })

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['stack']))
  }
}
