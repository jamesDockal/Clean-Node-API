import {
	badRequest,
	created,
} from '../../../../presentation/helpers/http-helper';
import { Validation } from 'presentation/helpers/validators/validation';
import { Controller, HttpRequest, HttpResponse } from './add-survey-protocols';
import { AddSurvey } from 'domain/useCases/add-survey';

export class AddSurveyController implements Controller {
	constructor(
		private readonly validation: Validation,
		private readonly addSurvey: AddSurvey
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const error = this.validation.validate(httpRequest.body);
		if (error) {
			return badRequest(error);
		}

		await this.addSurvey.add(httpRequest.body);

		return created();
	}
}
