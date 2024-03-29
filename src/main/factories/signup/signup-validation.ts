import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeSignUpValidationComposite = (): ValidationComposite => {
	const validations: Validation[] = [];
	const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
	for (const field of requiredFields) {
		validations.push(new RequiredFieldValidation(field));
	}

	validations.push(
		new CompareFieldsValidation('password', 'passwordConfirmation')
	);

	const emailValidatorAdapter = new EmailValidatorAdapter();
	validations.push(new EmailValidation('email', emailValidatorAdapter));

	return new ValidationComposite(validations);
};
