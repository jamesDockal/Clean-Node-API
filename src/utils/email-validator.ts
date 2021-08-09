import { IEmailValidtor } from '../presentation/protocols/email-validator'
import validator from 'validator'

export class EmailValidatorAdapter implements IEmailValidtor {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
