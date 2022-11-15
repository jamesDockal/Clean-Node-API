import { InvalidParamError, MissingParamError } from '../../erros';
import {
	badRequest,
	ok,
	serverError,
	unauthorized,
} from '../../helpers/http-helper';
import { EmailValidator, HttpRequest } from '../signup/signup-protocols';
import { LoginController } from './login';
import { Authentication } from './login-protocols';

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth(email: string, password: string): Promise<string> {
			return 'any_token';
		}
	}

	return new AuthenticationStub();
};

interface SutTypes {
	sut: LoginController;
	emailValidatorStub: EmailValidator;
	authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const authenticationStub = makeAuthentication();

	const sut = new LoginController(emailValidatorStub, authenticationStub);

	return {
		sut,
		emailValidatorStub,
		authenticationStub,
	};
};

const makeFakeRequest = (): HttpRequest => ({
	body: {
		email: 'any_email',
		password: 'any_password',
	},
});

describe('Login Controller', () => {
	test('should return 400 if no email is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				password: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
	});

	test('should return 400 if no password is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email',
			},
		};

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
	});

	test('should call EmailValidator with correct value', async () => {
		const { sut, emailValidatorStub } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email',
				password: 'any_password',
			},
		};

		const emailSpy = jest.spyOn(emailValidatorStub, 'isValid');

		await sut.handle(httpRequest);

		expect(emailSpy).toBeCalledWith(httpRequest.body.email);
	});

	test('should call return if an invalid email is provided', async () => {
		const { sut, emailValidatorStub } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email',
				password: 'any_password',
			},
		};

		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			return false;
		});

		const httpResponse = await sut.handle(httpRequest);

		expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
	});

	test('should call Authentication with correct values', async () => {
		const { sut, authenticationStub } = makeSut();
		const authSpy = jest.spyOn(authenticationStub, 'auth');
		const httpRequest = makeFakeRequest();
		await sut.handle(httpRequest);

		expect(authSpy).toBeCalledWith(
			httpRequest.body.email,
			httpRequest.body.password
		);
	});

	test('should return 401 if invalid credentials are provided', async () => {
		const { sut, authenticationStub } = makeSut();
		jest
			.spyOn(authenticationStub, 'auth')
			.mockReturnValueOnce(new Promise((resolve) => resolve(null)));

		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(unauthorized());
	});

	test('should return 500 if Authentication thorws', async () => {
		const { sut, authenticationStub } = makeSut();
		jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
			throw new Error();
		});

		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(serverError(new Error()));
	});

	test('should return 500 if Authentication thorws', async () => {
		const { sut } = makeSut();

		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(
			ok({
				accessToken: 'any_token',
			})
		);
	});
});
