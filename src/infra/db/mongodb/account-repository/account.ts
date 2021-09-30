import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
// import { AccountModel } from '../../../../domain/models/account-model'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<any> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const createdAccount = await accountCollection.insertOne(accountData)

    return await new Promise(resolve => resolve(createdAccount.insertedId.toHexString()))
  }
}
