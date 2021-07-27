import { IHttpResponse, IHttpRequest } from './protocols/http'
import { badRequest } from './helpers/httpHelper'
import MissingParamError from './errors/missing-param'
import { IEmailValidtor } from './protocols/email-validator'
import InvalidParamError from './errors/invalid-param'

export default class SingUpController {
  private readonly emailValidator: IEmailValidtor

  constructor (emailValidator: IEmailValidtor) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email } = httpRequest.body

    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return {
      statusCode: 200,
      body: 'ok'
    }
  }
}
