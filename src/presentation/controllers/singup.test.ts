import SingUpController from './signup'

describe('SingUp controller', () => {
  it('should return 400 if no name was provided', () => {
    const sut = new SingUpController()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_passwordConfirmation'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
})
