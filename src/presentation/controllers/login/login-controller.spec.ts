import { InvalidParamError, MissingParamError } from '../../erros';
import {
	badRequest,
	ok,
	serverError,
	unauthorized,
} from '../../helpers/http-helper';
import { EmailValidation } from '../../helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../helpers/validators/required-field-validation';
import { ValidationComposite } from '../../helpers/validators/validation-composite';
import {
	EmailValidator,
	HttpRequest,
	Validation,
} from '../signup/signup-protocols';
import { LoginController } from './login-controller';
import { Authentication, AuthenticationModel } from './login-protocols';

const makeFakeRequest = (): HttpRequest => ({
	body: {
		email: 'any_email',
		password: 'any_password',
	},
});

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
		async auth({ email, password }: AuthenticationModel): Promise<string> {
			return 'any_token';
		}
	}

	return new AuthenticationStub();
};

const makeValidation = (emailValidator: EmailValidator): Validation => {
	const validations: Validation[] = [];
	const requiredFields = ['email', 'password'];
	for (const field of requiredFields) {
		validations.push(new RequiredFieldValidation(field));
	}

	validations.push(new EmailValidation('email', emailValidator));

	return new ValidationComposite(validations);
};

interface SutTypes {
	sut: LoginController;
	emailValidatorStub: EmailValidator;
	authenticationStub: Authentication;
	validationStub: Validation;
}

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const validationStub = makeValidation(emailValidatorStub);
	const authenticationStub = makeAuthentication();

	const sut = new LoginController(authenticationStub, validationStub);

	return {
		sut,
		emailValidatorStub,
		authenticationStub,
		validationStub,
	};
};

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

		expect(authSpy).toBeCalledWith({
			email: httpRequest.body.email,
			password: httpRequest.body.password,
		});
	});

	test('should return 401 if invalid credentials are provided', async () => {
		const { sut, authenticationStub } = makeSut();
		jest
			.spyOn(authenticationStub, 'auth')
			.mockReturnValueOnce(
				new Promise((resolve) => resolve(null as unknown as string))
			);

		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(unauthorized());
	});

	test('should return 500 if Authentication throws', async () => {
		const { sut, authenticationStub } = makeSut();
		jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
			throw new Error();
		});

		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(serverError(new Error()));
	});

	test('should return 500 if Authentication throws', async () => {
		const { sut } = makeSut();

		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(
			ok({
				accessToken: 'any_token',
			})
		);
	});
});
