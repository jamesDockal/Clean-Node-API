import { Router } from 'express';
import { makeSurveyController } from '../factories/add-survey/add-survey-factory';
import { adaptRoute } from '../adapters/express-route-adapter';
import { adaptMiddleware } from '../adapters/express-middleware-adapter';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware';

export default (router: Router): void => {
	const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	router.post('/survey', adminAuth, adaptRoute(makeSurveyController()));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
};
