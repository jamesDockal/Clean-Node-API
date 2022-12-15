import { SurveyMongoRepository } from './survey-mongo-repository';
import { Collection } from 'mongodb';
import { AddSurveyModel } from 'domain/useCases/add-survey';
import { MongoHelper } from '../mongodb/helpers/mongo-helper';

let surveyCollection: Collection;

const makeFakeSurveyData = (): AddSurveyModel => ({
	question: 'any_question',
	answers: [
		{
			answer: 'any_answer',
			image: 'any_image',
		},
	],
});

describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		surveyCollection = await MongoHelper.getCollection('surveys');
		await surveyCollection.deleteMany({});
	});

	test('should create a survey', async () => {
		const sut = new SurveyMongoRepository();

		const surveyData = makeFakeSurveyData();
		await sut.add(surveyData);

		const survey = await surveyCollection.findOne({
			question: surveyData.question,
		});

		expect(survey).toBeTruthy();
	});
});
