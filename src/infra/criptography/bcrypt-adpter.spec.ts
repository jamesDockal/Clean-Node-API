import bcrypt from 'bcrypt';
import { BCryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
	async hash(): Promise<string> {
		return await new Promise((resolve) => resolve('hashed_value'));
	},
}));

const salt = 12;
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
});
