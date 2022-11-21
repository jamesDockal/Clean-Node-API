import bcrypt from 'bcrypt';
import { BCryptAdapter } from './bcrypt-adapter';

const salt = 12;

jest.mock('bcrypt', () => ({
	async hash(): Promise<string> {
		return await new Promise((resolve) => resolve('hashed_value'));
	},

	async compare(): Promise<boolean> {
		return true;
	},
}));
interface SutTypes {
	sut: BCryptAdapter;
}

const makeSut = (): SutTypes => {
	const sut = new BCryptAdapter(salt);

	return {
		sut,
	};
};

describe('Bcrypt Adapter', () => {
	test('should call bcrypt with correct values', async () => {
		const { sut } = makeSut();
		const hashSpy = jest.spyOn(bcrypt, 'hash');

		const value = 'any_value';
		await sut.encrypt(value);
		expect(hashSpy).toHaveBeenCalledWith(value, salt);
	});

	test('should return a hash on success', async () => {
		const { sut } = makeSut();

		const hashedValue = await sut.encrypt('any_value');

		expect(hashedValue).toBe('hashed_value');
	});
	test('should throw if bcrypt throws', async () => {
		const { sut } = makeSut();

		jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
			throw new Error();
		});

		const promise = sut.encrypt('any_value');

		await expect(promise).rejects.toThrow();
	});

	test('should call compare with correct values', async () => {
		const { sut } = makeSut();
		const hashSpy = jest.spyOn(bcrypt, 'compare');

		await sut.compare('any_value', 'any_hash');
		expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash');
	});

	test('should return true when compare succeds', async () => {
		const { sut } = makeSut();

		const isValid = await sut.compare('any_value', 'any_hash');
		expect(isValid).toBe(true);
	});

	test('should return false when compare fails', async () => {
		const { sut } = makeSut();

		jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

		const isValid = await sut.compare('any_value', 'any_hash');
		expect(isValid).toBe(false);
	});
});
