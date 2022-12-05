import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols';
import { DbAddAccount } from './db-add-account';
import {
	Encrypter,
	AccountModel,
	AddAccountModel,
	AddAccountRepository,
} from './db-add-account-protocols';

const makeEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt(value: string): Promise<string> {
			return await new Promise((resolve) => resolve('hashed_password'));
		}
	}

	return new EncrypterStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add(account: AddAccountModel): Promise<AccountModel> {
			const fakeAccount = {
				id: 'valid_id',
				name: 'valid_name',
				email: 'valid_email',
				password: 'hashed_password',
			};
			return await new Promise((resolve) => resolve(fakeAccount));
		}
	}

	return new AddAccountRepositoryStub();
};

const makeFakeAccount = (): AddAccountModel => ({
	name: 'valid_name',
	email: 'valid_email',
	password: 'valid_password',
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub
		implements LoadAccountByEmailRepository
	{
		async loadByEmail(email: string): Promise<AccountModel | null> {
			return null;
		}
	}
	return new LoadAccountByEmailRepositoryStub();
};

interface SutTypes {
	sut: DbAddAccount;
	encrypterStub: Encrypter;
	addAccountRepositoryStub: AddAccountRepository;
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
	const encrypterStub = makeEncrypter();
	const addAccountRepositoryStub = makeAddAccountRepository();
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const sut = new DbAddAccount(
		encrypterStub,
		addAccountRepositoryStub,
		loadAccountByEmailRepositoryStub
	);

	return {
		sut,
		encrypterStub,
		addAccountRepositoryStub,
		loadAccountByEmailRepositoryStub,
	};
};

describe('DbAddAccount UseCase', () => {
	test('should call Encrypter with correct password', async () => {
		const { sut, encrypterStub } = makeSut();

		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};
		await sut.add(accountData);
		expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
	});

	test('should throw if Encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut();

		jest
			.spyOn(encrypterStub, 'encrypt')
			.mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};
		const promise = sut.add(accountData);
		await expect(promise).rejects.toThrow();
	});

	test('should call AddAccountRepository with correct values', async () => {
		const { sut, addAccountRepositoryStub } = makeSut();

		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};
		await sut.add(accountData);
		expect(addSpy).toBeCalledWith({
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password',
		});
	});

	test('should return an account on success', async () => {
		const { sut } = makeSut();
		const accountData = {
			name: 'valid_name',
			email: 'valid_email',
			password: 'valid_password',
		};

		const account = await sut.add(accountData);
		expect(account).toEqual({
			id: 'valid_id',
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password',
		});
	});

	test('should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();

		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

		await sut.add(makeFakeAccount());
		expect(loadSpy).toBeCalledWith('valid_email');
	});

	test('should return null if LoadAccountByEmailRepository not return null', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		jest
			.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
			.mockReturnValueOnce(new Promise((resolve) => resolve(null)));

		const account = await sut.add(makeFakeAccount());
		expect(account).toBeTruthy();
	});
});
