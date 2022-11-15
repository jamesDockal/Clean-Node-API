import { SignUpController } from '../../presentation/controllers/signup/signup';
import { DbAddAccount } from '../../data/useCases/add-account/db-add-account';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { BCryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogControllerDecorator } from '../decorators/log';
import { Controller } from '../../presentation/protocols';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { makeSignUpValidationComposite } from './signup-validation';

export const makeSignUpController = (): Controller => {
	const salt = 12;
	const bcryptAdapter = new BCryptAdapter(salt);
	const accountMongoRepository = new AccountMongoRepository();

	const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

	const emailValidatorAdapter = new EmailValidatorAdapter();

	const validationComposite = makeSignUpValidationComposite();

	const signUpController = new SignUpController(
		emailValidatorAdapter,
		dbAddAccount,
		validationComposite
	);

	const logErrorRepository = new LogMongoRepository();

	return new LogControllerDecorator(signUpController, logErrorRepository);
};
