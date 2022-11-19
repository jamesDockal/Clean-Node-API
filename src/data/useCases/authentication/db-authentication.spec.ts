import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { TokenGenerator } from '../../protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

const makeFakeAccount = (): AccountModel => ({
	id: 'any_id',
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

const makeTokenGenerator = (): TokenGenerator => {
	class TokenGeneratorStub implements TokenGenerator {
		async generate(value: string): Promise<string> {
			return 'access_token';
		}
	}
	return new TokenGeneratorStub();
};

interface SutTypes {
	sut: DbAuthentication;
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
	hashComparerStub: HashComparer;
	tokenGeneratorStub: TokenGenerator;
}

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const hashComparerStub = makeHashComparer();
	const tokenGeneratorStub = makeTokenGenerator();
	const sut = new DbAuthentication(
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		tokenGeneratorStub
	);

	return {
		sut,
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		tokenGeneratorStub,
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

	test('should return null if HashComparer returns false', async () => {
		const { sut, hashComparerStub } = makeSut();
		jest
			.spyOn(hashComparerStub, 'compare')
			.mockReturnValueOnce(new Promise((resolve) => resolve(false)));

		const accessToken = await sut.auth(makeFakeAuthentication());

		expect(accessToken).toBeNull();
	});

	test('should call TokenGenerator with correct id', async () => {
		const { sut, tokenGeneratorStub } = makeSut();
		const tokenSpy = jest.spyOn(tokenGeneratorStub, 'generate');

		await sut.auth(makeFakeAuthentication());

		expect(tokenSpy).toBeCalledWith('any_id');
	});

	test('should return access token', async () => {
		const { sut } = makeSut();

		const accessToken = await sut.auth(makeFakeAuthentication());

		expect(accessToken).toBe('access_token');
	});
});
