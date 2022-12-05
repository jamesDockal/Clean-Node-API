import { InvalidParamError, MissingParamError, ServerError } from '../../erros';
import { badRequest } from '../../helpers/http-helper';
import { CompareFieldsValidation } from '../../helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../helpers/validators/required-field-validation';
import { ValidationComposite } from '../../helpers/validators/validation-composite';
import { SignUpController } from './signup-controller';
import {
	AddAccount,
	EmailValidator,
	AccountModel,
	AddAccountModel,
	Validation,
	HttpRequest,
	Authentication,
	AuthenticationModel,
} from './signup-protocols';

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
	const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
	for (const field of requiredFields) {
		validations.push(new RequiredFieldValidation(field));
	}

	validations.push(
		new CompareFieldsValidation('password', 'passwordConfirmation')
	);

	validations.push(new EmailValidation('email', emailValidator));

	return new ValidationComposite(validations);
};

const makeAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		async add(account: AddAccountModel): Promise<AccountModel> {
			const fakeAccount = {
				id: 'any_id',
				...account,
			};

			return await new Promise((resolve) => resolve(fakeAccount));
		}
	}

	return new AddAccountStub();
};

const makeFakeRequest = (): HttpRequest => ({
	body: {
		name: 'any_name',
		email: 'any_email@mail.com',
		password: 'any_password',
		passwordConfirmation: 'any_password',
	},
});

interface SutTypes {
	sut: SignUpController;
	emailValidatorStub: EmailValidator;
	addAccountStub: AddAccount;
	validationStub: Validation;
	authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
	const addAccountStub = makeAddAccount();
	const emailValidatorStub = makeEmailValidator();
	const validationStub = makeValidation(emailValidatorStub);
	const authenticationStub = makeAuthentication();

	const sut = new SignUpController(
		addAccountStub,
		validationStub,
		authenticationStub
	);

	return {
		sut,
		emailValidatorStub,
		addAccountStub,
		validationStub,
		authenticationStub,
	};
};

describe('SignUp Controller', () => {
	test('should return 400 if no name was provided', async () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('name'));
	});

	test('should return 400 if no email was provided', async () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('email'));
	});

	test('should return 400 if no password was provided', async () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('password'));
	});

	test('should return 400 if no password confirmation was provided', async () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new MissingParamError('passwordConfirmation')
		);
	});

	test('should return 400 if password confirmation fails', async () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'invalid_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new InvalidParamError('passwordConfirmation')
		);
	});

	test('should return 400 if an invalid email was provided', async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'invalid_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError('email'));
	});

	test('should call EmailValidator with correct email', async () => {
		const { sut, emailValidatorStub } = makeSut();
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
		const email = 'any_email@mail.com';

		const httpRequest = {
			body: {
				name: 'any_name',
				email,
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		await sut.handle(httpRequest);
		expect(isValidSpy).toBeCalledWith(email);
	});

	test('should return 500 if EmailValidator throws', async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
			throw new Error();
		});

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError(new Error()));
	});

	test('should return call AddAccount with correct values', async () => {
		const { sut, addAccountStub } = makeSut();
		const addSpy = jest.spyOn(addAccountStub, 'add');

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		await sut.handle(httpRequest);
		expect(addSpy).toBeCalledWith({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});
	});

	test('should return 200 if valid data is provided', async () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse.body).toEqual({
			id: 'any_id',
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});
	});

	test('should call Validation with correct value', async () => {
		const { sut, validationStub } = makeSut();
		const validateSpy = jest.spyOn(validationStub, 'validate');

		const httpRequest = makeFakeRequest();
		await sut.handle(httpRequest);

		expect(validateSpy).toBeCalledWith(httpRequest.body);
	});

	test('should return 400 if Validation returns an error', async () => {
		const { sut, validationStub } = makeSut();
		jest
			.spyOn(validationStub, 'validate')
			.mockReturnValueOnce(new MissingParamError('any_field'));
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(
			badRequest(new MissingParamError('any_field'))
		);
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
});
