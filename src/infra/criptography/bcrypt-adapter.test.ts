import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_password')
    expect(hashSpy).toBeCalledWith('any_password', salt)
  })
  it('Should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_password')
    expect(hash).toBe('hash')
  })
  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(
      () => {
        throw new Error()
      }
    )
    const promise = sut.encrypt('any_password')
    await expect(promise).rejects.toThrow()
  })
})
