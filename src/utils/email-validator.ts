import { IEmailValidtor } from '../presentation/protocols/email-validator'

export class EmailValidatorAdapter implements IEmailValidtor {
  isValid (email: string): boolean {
    return false
  }
}
