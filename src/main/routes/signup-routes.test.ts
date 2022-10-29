import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/account-repository/helpers/mongo-helper';
import { app } from '../config/app';

describe('SignUp Routes', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		const accountCollection = MongoHelper.getCollection('accounts');
		await accountCollection.deleteMany({});
	});

	test('should return status on success', async () => {
		await request(app).post('/api/signup').expect(200);
	});
});