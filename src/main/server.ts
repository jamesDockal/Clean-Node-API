import { MongoHelper } from '../infra/db/mongodb/account-repository/helpers/mongo-helper';
import { app } from './config/app';
import env from './config/env';

MongoHelper.connect(env.mongUrl)
	.then(() => {
		app.listen(env.serverPort, () => {
			console.log(`Server running on port: ${env.serverPort}`);
		});
	})
	.catch(console.error);
