import { sign } from 'jsonwebtoken';
import env from '../../main/config/env';
import { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { app } from '../config/app';

let surveyCollection: Collection;
let accountCollection: Collection;

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
		accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.deleteMany({});
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

	describe('POST /survey', () => {
		test('should return 403 without acccess token', async () => {
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
				.expect(403);
		});

		test('should return 201 with valid access token', async () => {
			const res = await accountCollection.insertOne({
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				role: 'admin',
			});

			const id = res.insertedId.toString();
			const accessToken = await sign({ id }, env.jwtSecret);

			await accountCollection.updateOne(
				{
					_id: res.insertedId,
				},
				{
					$set: {
						accessToken,
					},
				}
			);

			await request(app)
				.post('/api/survey')
				.set('x-access-token', accessToken)
				.send({
					question: 'any_question',
					answers: [
						{
							answer: 'any_answer',
							image: 'any_image',
						},
					],
				})
				.expect(201);
		});
	});
});
