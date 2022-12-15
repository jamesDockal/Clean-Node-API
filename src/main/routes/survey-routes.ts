import { Router } from 'express';
import { makeSurveyController } from '../factories/add-survey/add-survey-factory';
import { adaptRoute } from '../adapters/express-route-adapter';

export default (router: Router): void => {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	router.post('/survey', adaptRoute(makeSurveyController()));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
};
