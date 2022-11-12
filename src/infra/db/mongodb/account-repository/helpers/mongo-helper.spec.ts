import { MongoHelper as sut } from './mongo-helper';

describe('Mongo Helper', () => {
	beforeAll(async () => {
		await sut.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await sut.disconnect();
	});

	test('should disconnect from mongodb', async () => {
		const accountCollection = await sut.getCollection('accounts');
		expect(accountCollection).toBeTruthy();
		expect(sut.client).toBeTruthy();

		await sut.disconnect();
		expect(sut.client).toBeFalsy();
	});

	test('should reconnect if mongodb is down', async () => {
		let accountCollection = await sut.getCollection('accounts');
		expect(accountCollection).toBeTruthy();
		expect(sut.client).toBeTruthy();

		await sut.disconnect();

		accountCollection = await sut.getCollection('accounts');
		expect(accountCollection).toBeTruthy();
		expect(sut.client).toBeTruthy();
	});
});
