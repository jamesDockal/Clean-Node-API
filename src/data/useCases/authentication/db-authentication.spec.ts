import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

const makeFakeAccount = (): AccountModel => ({
	id: 'any_',
	email: 'any_email@mail.com',
	name: 'any_name',
	password: 'any_password',
});

const makeFakeAuthentication = (): AccountModel => ({
	id: 'any_',
	email: 'any_email@mail.com',
	name: 'any_name',
	password: 'any_password',
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub
		implements LoadAccountByEmailRepository
	{
		async load(email: string): Promise<AccountModel> {
			const account: AccountModel = makeFakeAccount();

			return account;
		}
	}
	return new LoadAccountByEmailRepositoryStub();
};

interface SutTypes {
	sut: DbAuthentication;
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

	return {
		sut,
		loadAccountByEmailRepositoryStub,
	};
};

describe('DbAuthentication UseCase', () => {
	test('should call LoadAccountByEmailRepository with correct email', async () => {
		const { loadAccountByEmailRepositoryStub, sut } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

		await sut.auth(makeFakeAuthentication());

		expect(loadSpy).toBeCalledWith('any_email@mail.com');
	});

	test('should throw if LoadAccountByEmailRepository throws', async () => {
		const { loadAccountByEmailRepositoryStub, sut } = makeSut();
		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'load')
			.mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

		const promise = sut.auth(makeFakeAuthentication());

		await expect(promise).rejects.toThrow();
	});
});
