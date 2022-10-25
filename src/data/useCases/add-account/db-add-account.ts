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
	constructor(
		encrypter: Encrypter,
		aaddAccountRepository: AddAccountRepository
	) {
		this.encrypter = encrypter;
		this.addAccountRepository = aaddAccountRepository;
	}

	async add(accountData: AddAccountModel): Promise<AccountModel> {
		const hashedPassword = await this.encrypter.encrypt(accountData.password);
		const account = await this.addAccountRepository.add({
			...accountData,
			password: hashedPassword,
		});
		return account;
	}
}
