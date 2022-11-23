import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidationComposite = (): ValidationComposite => {
	const validations: Validation[] = [];
	const requiredFields = ['email', 'password'];
	for (const field of requiredFields) {
		validations.push(new RequiredFieldValidation(field));
	}

	const emailValidatorAdapter = new EmailValidatorAdapter();
	validations.push(new EmailValidation('email', emailValidatorAdapter));

	return new ValidationComposite(validations);
};
