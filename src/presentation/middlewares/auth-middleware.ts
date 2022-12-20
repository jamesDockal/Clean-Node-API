import { AccessDeniedError } from '../../presentation/erros';
import {
	forbidden,
	ok,
	serverError,
} from '../../presentation/helpers/http-helper';
import { HttpRequest, HttpResponse } from 'presentation/protocols';
import { Middleware } from '../../presentation/protocols/middleware';
import { LoadAccountByToken } from 'domain/useCases/load-account-by-token';

export class AuthMiddleware implements Middleware {
	constructor(
		private readonly loadAccountByToken: LoadAccountByToken,
		private readonly role?: string
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const accessToken = httpRequest.headers?.['x-access-token'];
			if (accessToken) {
				const account = await this.loadAccountByToken.load(
					accessToken,
					this.role
				);
				if (account) {
					return ok({
						accountId: account.id,
					});
				}
			}

			return forbidden(new AccessDeniedError());
		} catch (error) {
			return serverError(error);
		}
	}
}
