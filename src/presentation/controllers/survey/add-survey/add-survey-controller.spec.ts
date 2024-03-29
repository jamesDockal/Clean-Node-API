import { AddSurvey, AddSurveyModel } from 'domain/useCases/add-survey';
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

const makeAddSurvey = (): AddSurvey => {
	class AddSurveyStub implements AddSurvey {
		async add(data: AddSurveyModel): Promise<void> {
			return await new Promise((resolve) => resolve());
		}
	}

	return new AddSurveyStub();
};

interface SutTypes {
	sut: AddSurveyController;
	validationStub: Validation;
	addSurveyStub: AddSurvey;
}

const makeSut = (): SutTypes => {
	const validationStub = makeValidation();
	const addSurveyStub = makeAddSurvey();

	const sut = new AddSurveyController(validationStub, addSurveyStub);

	return {
		sut,
		validationStub,
		addSurveyStub,
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

	test('should call AddSurvey with correct values', async () => {
		const { sut, addSurveyStub } = makeSut();
		const addSurveySpy = jest.spyOn(addSurveyStub, 'add');
		const httpRequest = makeFakeRequest();
		await sut.handle(httpRequest);
		expect(addSurveySpy).toHaveBeenCalledWith(httpRequest.body);
	});
});
