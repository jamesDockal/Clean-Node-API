import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log';
import { LoginController } from '../../../presentation/controllers/login/login';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log';

import env from '../../config/env';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { DbAuthentication } from '../../../data/useCases/authentication/db-authentication';
import { makeLoginValidationComposite } from './login-validation';

export const makeLoginController = (): Controller => {
	const salt = 12;
	const bcryptAdapter = new BCryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(env.jwtSecret);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAuthentication = new DbAuthentication(
		accountMongoRepository,
		bcryptAdapter,
		jwtAdapter,
		accountMongoRepository
	);

	const loginController = new LoginController(
		dbAuthentication,
		makeLoginValidationComposite()
	);

	const logErrorRepository = new LogMongoRepository();

	return new LogControllerDecorator(loginController, logErrorRepository);
};
