import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { EmailValidator } from '../../presentation/protocols/email-validator';
import { makeSignUpValidationComposite } from './signup-validation';

jest.mock('../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid(email: string): boolean {
			return true;
		}
	}

	return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
	test('should call ValidationComposite with all validations', () => {
		makeSignUpValidationComposite();

		const validations: Validation[] = [];
		const requiredFields = [
			'name',
			'email',
			'password',
			'passwordConfirmation',
		];
		for (const field of requiredFields) {
			validations.push(new RequiredFieldValidation(field));
		}

		validations.push(
			new CompareFieldsValidation('password', 'passwordConfirmation')
		);

		const emailValidator = makeEmailValidator();
		validations.push(new EmailValidation('email', emailValidator));

		expect(ValidationComposite).toBeCalledWith(validations);
	});
});
