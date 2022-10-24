import { InvalidParamError, MissingParamError } from '../erros';
import {
	Controller,
	EmailValidator,
	HttpRequest,
	HttpResponse,
} from '../protocols';
import { badRequest, serverError } from '../helpers/http-helper';
import { AddAccount } from '../../domain/useCases/add-account';

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator;
	private readonly addAccount: AddAccount;

	constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccount;
	}

	handle(httpRequest: HttpRequest): HttpResponse {
		try {
			const requiredFields = [
				'name',
				'email',
				'password',
				'passwordConfirmation',
			];
			const { body } = httpRequest;

			for (const field of requiredFields) {
				if (!body[field]) {
					return badRequest(new MissingParamError(field));
				}
			}
			const { name, email, password, passwordConfirmation } = body;

			if (password !== passwordConfirmation) {
				return badRequest(new InvalidParamError('passwordConfirmation'));
			}

			const isValid = this.emailValidator.isValid(email);
			if (!isValid) {
				return badRequest(new InvalidParamError('email'));
			}

			this.addAccount.add({
				name,
				email,
				password,
			});
		} catch (error) {
			return serverError();
		}
	}
}
