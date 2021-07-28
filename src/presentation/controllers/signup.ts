import { IHttpResponse, IHttpRequest } from './protocols/http'

import { badRequest, serverError } from './helpers/httpHelper'

import { IEmailValidtor } from './protocols/email-validator'
import MissingParamError from './errors/missing-param-error'
import InvalidParamError from './errors/invalid-param-error'

export default class SingUpController {
  private readonly emailValidator: IEmailValidtor

  constructor (emailValidator: IEmailValidtor) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: IHttpRequest): IHttpResponse {
    try {
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
        body: ' e.message'
      }
    } catch (e) {
      return serverError()
    }
  }
}
