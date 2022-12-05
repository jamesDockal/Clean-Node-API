import { Authentication } from '../../../domain/useCases/authentication';
import {
	AddAccount,
	Controller,
	HttpRequest,
	HttpResponse,
	Validation,
} from './signup-protocols';

import { badRequest, ok, serverError } from '../../helpers/http-helper';

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

			await this.addAccount.add({
				name,
				email,
				password,
			});

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
