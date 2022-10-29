export default {
	mongUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
	serverPort: process.env.PORT || 3030,
};
