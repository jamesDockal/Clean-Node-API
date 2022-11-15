import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { makeSignUpValidationComposite } from './signup-validation';

jest.mock('../../presentation/helpers/validators/validation-composite');

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
		expect(ValidationComposite).toBeCalledWith(validations);
	});
});
