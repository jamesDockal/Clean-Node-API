import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

describe('DbAuthentication UseCase', () => {
	test('should call LoadAccountByEmailRepository with correct email', async () => {
		class LoadAccountByEmailRepositoryStub
			implements LoadAccountByEmailRepository
		{
			async load(email: string): Promise<AccountModel> {
				const account: AccountModel = {
					id: 'any_',
					email: 'any_email',
					name: 'any_name',
					password: 'any_password',
				};

				return account;
			}
		}

		const loadAccountByEmailRepositoryStub =
			new LoadAccountByEmailRepositoryStub();

		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

		const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
		await sut.auth({
			email: 'any_email@mail.com',
			password: 'any_password',
		});

		expect(loadSpy).toBeCalledWith('any_email@mail.com');
	});
});
