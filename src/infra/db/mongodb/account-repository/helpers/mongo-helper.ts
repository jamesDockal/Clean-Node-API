import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
	client: null as MongoClient,
	uri: null as string,

	async connect(url: string) {
		this.uri = url;
		this.client = await MongoClient.connect(url);
	},

	async disconnect() {
		await this.client.close();
		this.client = null;
	},

	async getCollection(name: string): Promise<Collection> {
		if (!this.client?.topology) {
			await this.connect(this.uri);
		}
		return this.client.db().collection(name);
	},
};
