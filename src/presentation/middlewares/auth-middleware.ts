import { AccessDeniedError } from '../../presentation/erros';
import { forbidden } from '../../presentation/helpers/http-helper';
import { HttpRequest, HttpResponse } from 'presentation/protocols';
import { Middleware } from '../../presentation/protocols/middleware';

export class AuthMiddleware implements Middleware {
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		return forbidden(new AccessDeniedError());
	}
}
