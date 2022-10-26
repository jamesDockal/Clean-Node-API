import bcrypt from 'bcrypt';
import { BCryptAdapter } from './bcrypt-adapter';

describe('Bcrypt Adapter', () => {
	test('should call bcrypt with correct values', async () => {
		const salt = 12;
		const sut = new BCryptAdapter(salt);
		const hashSpy = jest.spyOn(bcrypt, 'hash');

		const value = 'any_value';
		await sut.encrypt(value);
		expect(hashSpy).toHaveBeenCalledWith(value, salt);
	});
});
