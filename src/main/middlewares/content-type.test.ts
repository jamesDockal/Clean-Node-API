import request from 'supertest';
import { app } from '../config/app';

describe('Content Type Middleware', () => {
	test('should default return content type as JSON', async () => {
		app.post('/test_content_type', (req, res) => {
			res.send();
		});

		await request(app)
			.post('/test_content_type')
			.expect('content-type', /json/);
	});
	test('should return XML content type when forced', async () => {
		app.get('/test_content_type_xml', (req, res) => {
			res.type('xml');
			res.send('');
		});

		await request(app)
			.get('/test_content_type_xml')
			.expect('content-type', /xml/);
	});
});
