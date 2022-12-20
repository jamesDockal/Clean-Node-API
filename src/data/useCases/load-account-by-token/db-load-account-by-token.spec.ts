import { LoadAccountByTokenRepository } from 'data/protocols/db/load-account-by-token-repository';
import { Decrypter } from '../../protocols/criptography/decrypter';
import { AccountModel } from '../add-account/db-add-account-protocols';
import { DbLoadAccountByToken } from './db-load-account-by-token';

const makeFakeAccount = (): AccountModel => ({
	id: 'any_id',
	email: 'any_email@mail.com',
	name: 'any_name',
	password: 'hash_password',
});

const makeDecrypterStub = (): Decrypter => {
	class DecrypterStub implements Decrypter {
		async decrypt(value: string): Promise<string> {
			return await new Promise((resolve) => resolve('any_token'));
		}
	}

	return new DecrypterStub();
};

const makeLoadAccountByTokenRepositoryStub =
	(): LoadAccountByTokenRepository => {
		class LoadAccountByTokenRepositoryStub
			implements LoadAccountByTokenRepository
		{
			async loadByToken(value: string, role?: string): Promise<AccountModel> {
				return await new Promise((resolve) => resolve(makeFakeAccount()));
			}
		}

		return new LoadAccountByTokenRepositoryStub();
	};

interface SutTypes {
	sut: DbLoadAccountByToken;
	decrypterStub: Decrypter;
	loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeSut = (): SutTypes => {
	const decrypterStub = makeDecrypterStub();
	const loadAccountByTokenRepositoryStub =
		makeLoadAccountByTokenRepositoryStub();
	const sut = new DbLoadAccountByToken(
		decrypterStub,
		loadAccountByTokenRepositoryStub
	);

	return {
		sut,
		decrypterStub,
		loadAccountByTokenRepositoryStub,
	};
};

describe('DbLoadAccountByToken Usecase', () => {
	test('should call Decrypter with correct values', async () => {
		const { sut, decrypterStub } = makeSut();

		const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt');

		await sut.load('any_token');
		expect(decrypterSpy).toBeCalledWith('any_token');
	});

	test('should return null if Decrypter returns null', async () => {
		const { sut, decrypterStub } = makeSut();

		jest
			.spyOn(decrypterStub, 'decrypt')
			.mockReturnValueOnce(new Promise((resolve) => resolve(null)));

		const account = await sut.load('any_token');
		expect(account).toBeNull();
	});

	test('should call LoadAccountByTokenRepository with correct values', async () => {
		const { sut, loadAccountByTokenRepositoryStub } = makeSut();

		const loadAccountByTokenSpy = jest.spyOn(
			loadAccountByTokenRepositoryStub,
			'loadByToken'
		);

		await sut.load('any_token', 'any_role');

		expect(loadAccountByTokenSpy).toBeCalledWith('any_token', 'any_role');
	});

	test('should return null if LoadAccountByTokenRepository returns null', async () => {
		const { sut, loadAccountByTokenRepositoryStub } = makeSut();

		jest
			.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
			.mockReturnValueOnce(new Promise((resolve) => resolve(null)));

		const account = await sut.load('any_token');
		expect(account).toBeNull();
	});
	test('should return an account on success', async () => {
		const { sut } = makeSut();

		const account = await sut.load('any_token');
		expect(account).toEqual(makeFakeAccount());
	});
});
