import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/log';
import { AddSurveyController } from '../../../presentation/controllers/survey/add-survey/add-survey-controller';
import { SurveyMongoRepository } from '../../../infra/db/survey/survey-mongo-repository';
import { makeAddSurveyValidationComposite } from './add-survey-validation';

export const makeSurveyController = (): Controller => {
	const dbAddSurvey = new SurveyMongoRepository();

	const surveyController = new AddSurveyController(
		makeAddSurveyValidationComposite(),
		dbAddSurvey
	);

	const logErrorRepository = new LogMongoRepository();

	return new LogControllerDecorator(surveyController, logErrorRepository);
};
