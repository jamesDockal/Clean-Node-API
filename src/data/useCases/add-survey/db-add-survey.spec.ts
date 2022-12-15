import { DbAddSurvey } from './db-add-survey';
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols';

const makeAddSurveyRepositoryStub = (): AddSurveyRepository => {
	class AddSurveyRepositoryStub implements AddSurveyRepository {
		async add(surveyData: AddSurveyModel): Promise<void> {
			return await new Promise((resolve) => resolve());
		}
	}

	return new AddSurveyRepositoryStub();
};

const makeFakeSurveyData = (): AddSurveyModel => ({
	question: 'any_question',
	answers: [
		{
			answer: 'any_answer',
			image: 'any_image',
		},
	],
});

interface SutTypes {
	sut: DbAddSurvey;
	addSurveyRepositoryStub: AddSurveyRepository;
}

const makeSut = (): SutTypes => {
	const addSurveyRepositoryStub = makeAddSurveyRepositoryStub();

	const sut = new DbAddSurvey(addSurveyRepositoryStub);

	return { sut, addSurveyRepositoryStub };
};

describe('DbAddSurvey Usecase', () => {
	test('should call AddSurveyRepository with correct values', async () => {
		const { sut, addSurveyRepositoryStub } = makeSut();

		const addSurveyRepositorySpy = jest.spyOn(addSurveyRepositoryStub, 'add');

		const surveyData = makeFakeSurveyData();
		await sut.add(surveyData);

		expect(addSurveyRepositorySpy).toBeCalledWith(surveyData);
	});
});
