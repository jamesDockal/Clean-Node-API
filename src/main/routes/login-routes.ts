import { Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeLoginController } from '../factories/login/login-factory';
import { makeSignUpController } from '../factories/signup/signup-factory';

export default (router: Router): void => {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	router.post('/signup', adaptRoute(makeSignUpController()));

	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	router.post('/login', adaptRoute(makeLoginController()));
};
