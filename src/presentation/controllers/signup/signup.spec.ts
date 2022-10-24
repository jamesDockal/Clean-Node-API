import { InvalidParamError, MissingParamError, ServerError } from '../../erros';
import { SignUpController } from './signup';
import {
	AddAccount,
	EmailValidator,
	AccountModel,
	AddAccountModel,
} from './signup-protocols';

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
	class AddAccountStub implements AddAccount {
		add(account: AddAccountModel): AccountModel {
			const fakeAccount = {
				id: 'any_id',
				...account,
			};

			return fakeAccount;
		}
	}

	return new AddAccountStub();
};

interface SutTypes {
	sut: SignUpController;
	emailValidatorStub: EmailValidator;
	addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const addAccountStub = makeAddAccount();

	const sut = new SignUpController(emailValidatorStub, addAccountStub);

	return {
		sut,
		emailValidatorStub,
		addAccountStub,
	};
};

describe('SignUp Controller', () => {
	test('should return 400 if no name was provided', () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('name'));
	});

	test('should return 400 if no email was provided', () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('email'));
	});

	test('should return 400 if no password was provided', () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('password'));
	});

	test('should return 400 if no password confirmation was provided', () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
			},
		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new MissingParamError('passwordConfirmation')
		);
	});

	test('should return 400 if password confirmation fails', () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'invalid_password',
			},
		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(
			new InvalidParamError('passwordConfirmation')
		);
	});

	test('should return 400 if an invalid email was provided', () => {
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

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError('email'));
	});

	test('should call EmailValidator with correct email', () => {
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

		sut.handle(httpRequest);
		expect(isValidSpy).toBeCalledWith(email);
	});

	test('should return 500 if EmailValidator throws', () => {
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

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});

	test('should return call AddAccount with correct values', () => {
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

		sut.handle(httpRequest);
		expect(addSpy).toBeCalledWith({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});
	});

	test('should return 200 if valid data is provided', () => {
		const { sut } = makeSut();

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse.body).toEqual({
			id: 'any_id',
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});
	});
});
