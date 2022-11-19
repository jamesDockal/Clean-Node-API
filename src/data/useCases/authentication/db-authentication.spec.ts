import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

const makeFakeAccount = (): AccountModel => ({
	id: 'any_',
	email: 'any_email@mail.com',
	name: 'any_name',
	password: 'hash_password',
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

const makeHashComparer = (): HashComparer => {
	class HashComparerStub implements HashComparer {
		async compare(value: string, hash: string): Promise<boolean> {
			return true;
		}
	}
	return new HashComparerStub();
};

interface SutTypes {
	sut: DbAuthentication;
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
	hashComparerStub: HashComparer;
}

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const hashComparerStub = makeHashComparer();
	const sut = new DbAuthentication(
		loadAccountByEmailRepositoryStub,
		hashComparerStub
	);

	return {
		sut,
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
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

	test('should call LoadAccountByEmailRepository with correct email', async () => {
		const { loadAccountByEmailRepositoryStub, sut } = makeSut();
		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'load')
			.mockReturnValueOnce(null);

		const accessToken = await sut.auth(makeFakeAuthentication());

		expect(accessToken).toBeNull();
	});

	test('should call HashComparer with correct values', async () => {
		const { sut, hashComparerStub } = makeSut();
		const hashComparerSpy = jest.spyOn(hashComparerStub, 'compare');

		await sut.auth(makeFakeAuthentication());

		expect(hashComparerSpy).toBeCalledWith('any_password', 'hash_password');
	});
});
