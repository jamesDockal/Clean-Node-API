import { Authentication } from 'domain/useCases/authentication';
import {
	AddAccount,
	Controller,
	HttpRequest,
	HttpResponse,
	Validation,
} from './signup-protocols';

import {
	badRequest,
	forbidden,
	ok,
	serverError,
} from '../../../../presentation/helpers/http-helper';
import { InvalidParamError } from '../../../erros';

export class SignUpController implements Controller {
	private readonly addAccount: AddAccount;
	private readonly validation: Validation;
	private readonly authentication: Authentication;

	constructor(
		addAccount: AddAccount,
		validation: Validation,
		authentication: Authentication
	) {
		this.addAccount = addAccount;
		this.validation = validation;
		this.authentication = authentication;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const error = this.validation.validate(httpRequest.body);

			if (error) {
				return badRequest(error);
			}

			const { name, email, password } = httpRequest.body;

			const account = await this.addAccount.add({
				name,
				email,
				password,
			});

			if (!account) {
				return forbidden(new InvalidParamError('email'));
			}

			const accessToken = await this.authentication.auth({
				email,
				password,
			});

			return ok({
				accessToken,
			});
		} catch (error) {
			return serverError(error);
		}
	}
}
