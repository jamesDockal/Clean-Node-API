import { IHttpResponse, IHttpRequest } from '../../protocols/http'

import { badRequest, ok, serverError } from '../helpers/httpHelper'

import { IEmailValidtor } from '../../protocols/email-validator'
import MissingParamError from '../errors/missing-param-error'
import InvalidParamError from '../errors/invalid-param-error'
import { AddAccount } from '../../../domain/usecases/add-account'

export default class SingUpController {
  private readonly emailValidator: IEmailValidtor
  private readonly addAccont: AddAccount

  constructor (emailValidator: IEmailValidtor, addAccont: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccont = addAccont
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('password'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccont.add({
        email,
        name,
        password
      })

      return ok(account)
    } catch (e) {
      return serverError()
    }
  }
}
