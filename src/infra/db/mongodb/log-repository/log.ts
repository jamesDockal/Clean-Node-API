import { LogErrorRepository } from '../../../../data/protocols/db/log-error-repository';
import { MongoHelper } from '../helpers/mongo-helper';

export class LogMongoRepository implements LogErrorRepository {
	async logError(stack: string): Promise<void> {
		const errorColection = await MongoHelper.getCollection('errors');
		await errorColection.insertOne({
			stack,
			date: new Date(),
		});
	}
}
