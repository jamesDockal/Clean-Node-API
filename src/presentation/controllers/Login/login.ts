import { InvalidParamError, MissingParamError } from '../../erros';
import { badRequest, serverError } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator, Authentication } from './login-protocols';

export class LoginController implements Controller {
	private readonly emailValidator: EmailValidator;
	private readonly authentication: Authentication;

	constructor(emailValidator: EmailValidator, authentication: Authentication) {
		this.emailValidator = emailValidator;
		this.authentication = authentication;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const requiredFields = ['email', 'password'];
			const { body } = httpRequest;

			for (const field of requiredFields) {
				if (!body[field]) {
					return badRequest(new MissingParamError(field));
				}
			}
			const { email, password } = body;

			const isValid = this.emailValidator.isValid(email);
			if (!isValid) {
				return badRequest(new InvalidParamError('email'));
			}

			await this.authentication.auth(email, password);
		} catch (error) {
			return serverError(error);
		}
	}
}
