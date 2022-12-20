import { AccessDeniedError } from '../../presentation/erros';
import { forbidden } from '../../presentation/helpers/http-helper';
import { AuthMiddleware } from './auth-middleware';

describe('Auth Middleware', () => {
	test('should return 403 if no x-access-token exists in headers', async () => {
		const sut = new AuthMiddleware();
		const httpResponse = await sut.handle({});
		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});
});
