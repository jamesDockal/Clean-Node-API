import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols';
import {
	AddAccount,
	AccountModel,
	AddAccountModel,
	Encrypter,
	AddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
	private readonly encrypter: Encrypter;
	private readonly addAccountRepository: AddAccountRepository;
	private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
	constructor(
		encrypter: Encrypter,
		addAccountRepository: AddAccountRepository,
		loadAccountByEmailRepository: LoadAccountByEmailRepository
	) {
		this.encrypter = encrypter;
		this.addAccountRepository = addAccountRepository;
		this.loadAccountByEmailRepository = loadAccountByEmailRepository;
	}

	async add(accountData: AddAccountModel): Promise<AccountModel> {
		await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
		const hashedPassword = await this.encrypter.encrypt(accountData.password);
		const account = await this.addAccountRepository.add({
			...accountData,
			password: hashedPassword,
		});
		return account;
	}
}
