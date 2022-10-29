import { SignUpController } from '../../presentation/controllers/signup/signup';
import { DbAddAccount } from '../../data/useCases/add-account/db-add-account';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { BCryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';

export const makeSignUpController = (): SignUpController => {
	const salt = 12;
	const bcryptAdapter = new BCryptAdapter(salt);
	const accountMongoRepository = new AccountMongoRepository();

	const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);

	const emailValidatorAdapter = new EmailValidatorAdapter();

	return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
