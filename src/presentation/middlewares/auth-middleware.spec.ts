import { AccountModel } from 'domain/models/account';
import { LoadAccountByToken } from 'domain/useCases/load-account-by-token';
import { AccessDeniedError } from '../../presentation/erros';
import { forbidden, ok } from '../../presentation/helpers/http-helper';
import { AuthMiddleware } from './auth-middleware';

const makeLoadAccountByToken = (): LoadAccountByToken => {
	class LoadAccountByTokenStub implements LoadAccountByToken {
		async load(accessToken: string, role?: string): Promise<AccountModel> {
			return {
				email: 'any_email',
				id: 'any_id',
				name: 'any_name',
				password: 'any_password',
			};
		}
	}

	return new LoadAccountByTokenStub();
};

interface SutTypes {
	sut: AuthMiddleware;
	loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (role?: string): SutTypes => {
	const loadAccountByTokenStub = makeLoadAccountByToken();
	const sut = new AuthMiddleware(loadAccountByTokenStub, role);

	return {
		sut,
		loadAccountByTokenStub,
	};
};

describe('Auth Middleware', () => {
	test('should return 403 if no x-access-token exists in headers', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle({});
		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});

	test('should call LoadAccountByToken with correct accessToken', async () => {
		const role = 'any_role';
		const { sut, loadAccountByTokenStub } = makeSut(role);

		const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

		await sut.handle({
			headers: {
				'x-access-token': 'any_token',
			},
		});

		expect(loadSpy).toHaveBeenCalledWith('any_token', role);
	});

	test('should call LoadAccountByToken with correct accessToken', async () => {
		const { sut, loadAccountByTokenStub } = makeSut();

		jest
			.spyOn(loadAccountByTokenStub, 'load')
			.mockReturnValueOnce(new Promise((resolve) => resolve(null)));

		const httpResponse = await sut.handle({});

		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
	});

	test('should call LoadAccountByToken with correct accessToken', async () => {
		const { sut } = makeSut();

		const httpResponse = await sut.handle({
			headers: {
				'x-access-token': 'any_token',
			},
		});

		expect(httpResponse).toEqual(
			ok({
				accountId: 'any_id',
			})
		);
	});
});
