import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
	async sign(): Promise<string> {
		return 'any_token';
	},
}));

describe('Jwt Adapter', () => {
	test('should call sign with correct values', async () => {
		const sut = new JwtAdapter('secret');
		const signSpy = jest.spyOn(jwt, 'sign');
		await sut.generate('any_id');
		expect(signSpy).toHaveBeenCalledWith(
			{
				id: 'any_id',
			},
			'secret'
		);
	});

	test('should return a token on sign success', async () => {
		const sut = new JwtAdapter('secret');
		const token = await sut.generate('any_id');
		expect(token).toBe('any_token');
	});
});