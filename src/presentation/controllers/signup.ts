import { IHttpResponse, IHttpRequest } from './protocols/http'
import { badRequest } from './helpers/httpHelper'
import MissingParamError from './errors/missingParam'

export default class SingUpController {
  handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return {
      statusCode: 200,
      body: 'ok'
    }
  }
}
