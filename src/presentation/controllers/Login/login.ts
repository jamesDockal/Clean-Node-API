import { InvalidParamError, MissingParamError } from '../../erros';
import {
	badRequest,
	ok,
	serverError,
	unauthorized,
} from '../../helpers/http-helper';
import { Validation } from '../signup/signup-protocols';
import {
	Controller,
	HttpRequest,
	HttpResponse,
	EmailValidator,
	Authentication,
} from './login-protocols';

export class LoginController implements Controller {
	private readonly emailValidator: EmailValidator;
	private readonly authentication: Authentication;
	private readonly validation: Validation;

	constructor(
		emailValidator: EmailValidator,
		authentication: Authentication,
		validation: Validation
	) {
		this.emailValidator = emailValidator;
		this.authentication = authentication;
		this.validation = validation;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			this.validation.validate(httpRequest.body);
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

			const token = await this.authentication.auth(email, password);
			if (!token) {
				return unauthorized();
			}

			return ok({
				accessToken: token,
			});
		} catch (error) {
			return serverError(error);
		}
	}
}
