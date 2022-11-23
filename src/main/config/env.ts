export default {
	mongUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
	serverPort: process.env.PORT || 3030,
	jwtSecret: process.env.JWT_SECRET || 'jwt_secret',
};
