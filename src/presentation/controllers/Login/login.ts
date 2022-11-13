import { MissingParamError } from '../../erros';
import { badRequest } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class LoginController implements Controller {
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const requiredFields = ['email', 'password'];
		const { body } = httpRequest;

		for (const field of requiredFields) {
			if (!body[field]) {
				return badRequest(new MissingParamError(field));
			}
		}
	}
}
