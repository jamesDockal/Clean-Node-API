import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    console.log('process.env.MONGO_URL', process.env.MONGO_URL)

    await MongoHelper.connect(process.env.MONGO_URL as string)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  it('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    })
    expect(account).toBeTruthy()

    // expect(account).toBeTruthy()
    // expect(account.id).toBeTruthy()
    // expect(account.name).toBe('any_name')
    // expect(account.email).toBe('any_email')
    // expect(account.password).toBe('any_password')
  })
})
