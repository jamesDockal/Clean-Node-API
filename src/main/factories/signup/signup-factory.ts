import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '../../../data/useCases/add-account/db-add-account';
import { BCryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogControllerDecorator } from '../../decorators/log';
import { Controller } from '../../../presentation/protocols';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log';
import { makeSignUpValidationComposite } from './signup-validation';
import { DbAuthentication } from '../../../data/useCases/authentication/db-authentication';
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter';
import env from '../../config/env';

export const makeSignUpController = (): Controller => {
	const salt = 12;
	const bcryptAdapter = new BCryptAdapter(salt);
	const accountMongoRepository = new AccountMongoRepository();

	const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

	const validationComposite = makeSignUpValidationComposite();

	const jwtAdapter = new JwtAdapter(env.jwtSecret);
	const dbAuthentication = new DbAuthentication(
		accountMongoRepository,
		bcryptAdapter,
		jwtAdapter,
		accountMongoRepository
	);

	const signUpController = new SignUpController(
		dbAddAccount,
		validationComposite,
		dbAuthentication
	);

	const logErrorRepository = new LogMongoRepository();

	return new LogControllerDecorator(signUpController, logErrorRepository);
};
