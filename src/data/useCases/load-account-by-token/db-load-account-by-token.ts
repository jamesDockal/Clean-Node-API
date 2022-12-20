import { Decrypter } from 'data/protocols/criptography/decrypter';
import { LoadAccountByToken } from 'domain/useCases/load-account-by-token';
import { AccountModel } from '../add-account/db-add-account-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
	constructor(private readonly decrypter: Decrypter) {}

	async load(accessToken: string, role?: string): Promise<AccountModel> {
		await this.decrypter.decrypt(accessToken);
		return await new Promise((resolve) => resolve(null));
	}
}
