import { MissingParamError } from '../../erros';
import { badRequest } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from './login-protocols';

export class LoginController implements Controller {
	private readonly emailValidator: EmailValidator;

	constructor(emailValidator: EmailValidator) {
		this.emailValidator = emailValidator;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const requiredFields = ['email', 'password'];
		const { body } = httpRequest;

		for (const field of requiredFields) {
			if (!body[field]) {
				return badRequest(new MissingParamError(field));
			}
		}

		await this.emailValidator.isValid(body.email);
	}
}
