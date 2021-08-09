import { AddAccountRepository } from '../../protocols/add-account-repository'
import { AddAccount, AddAccountModel, AccountModel, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  private readonly addAccountRepositoryStub: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepositoryStub: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepositoryStub = addAccountRepositoryStub
  }

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.addAccountRepositoryStub.add(Object.assign({}, accountData, { password: hashedPassword }))
    return await new Promise(resolve => resolve(null))
  }
}
