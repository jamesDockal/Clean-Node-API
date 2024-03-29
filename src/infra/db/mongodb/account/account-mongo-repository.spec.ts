import { AccountMongoRepository } from './account-mongo-repository';
import { MongoHelper } from '../helpers/mongo-helper';
import { Collection } from 'mongodb';

let accountCollection: Collection;
describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	beforeEach(async () => {
		accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.deleteMany({});
	});

	test('should return an account on add success', async () => {
		const sut = new AccountMongoRepository();

		const account = await sut.add({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});

		expect(account).toBeTruthy();
		expect(account.id).toBeTruthy();
		expect(account.name).toBe('any_name');
		expect(account.email).toBe('any_email@mail.com');
		expect(account.password).toBe('any_password');
	});

	test('should return an account on loadByEmail success', async () => {
		const sut = new AccountMongoRepository();

		await accountCollection.insertOne({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});

		const account = await sut.loadByEmail('any_email@mail.com');

		expect(account).toBeTruthy();
		expect(account.id).toBeTruthy();
		expect(account.name).toBe('any_name');
		expect(account.email).toBe('any_email@mail.com');
		expect(account.password).toBe('any_password');
	});

	test('should return null if loadByEmail fails', async () => {
		const sut = new AccountMongoRepository();
		const account = await sut.loadByEmail('any_email@mail.com');
		expect(account).toBeFalsy();
	});

	test('should update the account accessToken on updateAccessTokenRepository success', async () => {
		const sut = new AccountMongoRepository();

		const result = await accountCollection.insertOne({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});

		let account = await accountCollection.findOne({
			_id: result.insertedId,
		});

		expect(account.accessToken).toBeFalsy();

		await sut.updateAccessToken(result.insertedId.toString(), 'any_token');

		account = await accountCollection.findOne({
			_id: result.insertedId,
		});

		expect(account).toBeTruthy();
		expect(account.accessToken).toBe('any_token');
	});

	describe('loadByToken()', () => {
		test('should return an account on loadByToken success without role', async () => {
			const sut = new AccountMongoRepository();

			await accountCollection.insertOne({
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				accessToken: 'any_token',
			});

			const account = await sut.loadByToken('any_token');

			expect(account).toBeTruthy();

			expect(account).toBeTruthy();
			expect(account.id).toBeTruthy();
			expect(account.name).toBe('any_name');
			expect(account.email).toBe('any_email@mail.com');
			expect(account.password).toBe('any_password');
		});

		test('should return an account on loadByToken success with role', async () => {
			const sut = new AccountMongoRepository();

			await accountCollection.insertOne({
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				accessToken: 'any_token',
				role: 'any_role',
			});

			const account = await sut.loadByToken('any_token', 'any_role');

			expect(account).toBeTruthy();

			expect(account).toBeTruthy();
			expect(account.id).toBeTruthy();
			expect(account.name).toBe('any_name');
			expect(account.email).toBe('any_email@mail.com');
			expect(account.password).toBe('any_password');
		});
	});
});
