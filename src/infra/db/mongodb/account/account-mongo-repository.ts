import { LoadAccountByTokenRepository } from 'data/protocols/db/load-account-by-token-repository';
import { ObjectId, WithId } from 'mongodb';
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/useCases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository
	implements
		AddAccountRepository,
		LoadAccountByEmailRepository,
		UpdateAccessTokenRepository,
		LoadAccountByTokenRepository
{
	async add(accountData: AddAccountModel): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const result = await accountCollection.insertOne(accountData);

		return {
			...accountData,
			id: String(result.insertedId),
		};
	}

	async loadByEmail(email: string): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const account = (await accountCollection.findOne({
			email,
		})) as unknown as WithId<AccountModel>;

		return (
			account && {
				...account,
				id: String(account._id),
			}
		);
	}

	async updateAccessToken(id: string, token: string): Promise<void> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.updateOne(
			{
				_id: new ObjectId(id),
			},
			{
				$set: {
					accessToken: token,
				},
			}
		);
	}

	async loadByToken(token: string, role?: string): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const account = (await accountCollection.findOne({
			accessToken: token,
			role,
		})) as unknown as WithId<AccountModel>;

		return (
			account && {
				...account,
				id: String(account._id),
			}
		);
	}
}
