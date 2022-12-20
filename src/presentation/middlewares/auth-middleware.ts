import { AccessDeniedError } from '../../presentation/erros';
import { forbidden } from '../../presentation/helpers/http-helper';
import { HttpRequest, HttpResponse } from 'presentation/protocols';
import { Middleware } from '../../presentation/protocols/middleware';
import { LoadAccountByToken } from 'domain/useCases/load-account-by-token';

export class AuthMiddleware implements Middleware {
	constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		await this.loadAccountByToken.load(httpRequest.headers?.['x-access-token']);

		return forbidden(new AccessDeniedError());
	}
}
