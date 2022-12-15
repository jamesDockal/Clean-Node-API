import { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { app } from '../config/app';

let surveyCollection: Collection;

describe('Survey Routes', () => {
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

	describe('POST /signup', () => {
		test('should return 200 on signup', async () => {
			await request(app)
				.post('/api/signup')
				.send({
					name: 'any_name',
					email: 'any_email@mail.com',
					password: 'any_password',
					passwordConfirmation: 'any_password',
				})
				.expect(200);
		});
	});

	describe('POST /Survey', () => {
		test('should return 200 on Survey creation', async () => {
			await request(app)
				.post('/api/survey')
				.send({
					question: 'any_question',
					answers: [
						{
							answer: 'any_answer',
							image: 'any_image',
						},
					],
				})
				.expect(204);
		});
	});
});
