import { Validation } from 'presentation/helpers/validators/validation';
import { badRequest } from '../../../../presentation/helpers/http-helper';
import { AddSurveyController } from './add-survey-controller';
import { HttpRequest } from './add-survey-protocols';

const makeFakeRequest = (): HttpRequest => ({
	body: {
		question: 'any_question',
		answers: [
			{
				image: 'any_image',
				answer: 'any_answer',
			},
		],
	},
});

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate(input: any): Error {
			return null;
		}
	}

	return new ValidationStub();
};

interface SutTypes {
	sut: AddSurveyController;
	validationStub: Validation;
}

const makeSut = (): SutTypes => {
	const validationStub = makeValidation();

	const sut = new AddSurveyController(validationStub);

	return {
		sut,
		validationStub,
	};
};

describe('AddSurvey Controller', () => {
	test('should call Validation with correct values', async () => {
		const { sut, validationStub } = makeSut();
		const validateSpy = jest.spyOn(validationStub, 'validate');
		const httpRequest = makeFakeRequest();
		await sut.handle(httpRequest);
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
	});

	test('should return 400 if Validation fails', async () => {
		const { sut, validationStub } = makeSut();
		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
		const httpRequest = makeFakeRequest();
		const response = await sut.handle(httpRequest);
		expect(response).toEqual(badRequest(new Error()));
	});
});