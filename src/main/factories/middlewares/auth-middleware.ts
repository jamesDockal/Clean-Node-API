import { DbLoadAccountByToken } from '../../../data/useCases/load-account-by-token/db-load-account-by-token';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import env from '../../config/env';
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware';
import { Middleware } from '../../../presentation/protocols';

export const makeAuthMiddleware = (role?: string): Middleware => {
	const accountMongoRepository = new AccountMongoRepository();

	const jwtAdapter = new JwtAdapter(env.jwtSecret);

	const loadAccountByToken = new DbLoadAccountByToken(
		jwtAdapter,
		accountMongoRepository
	);

	const authMiddleware = new AuthMiddleware(loadAccountByToken, role);

	return authMiddleware;
};
