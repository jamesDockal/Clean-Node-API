import { Validation } from 'presentation/helpers/validators/validation';
import { Controller, HttpRequest, HttpResponse } from './add-survey-protocols';

export class AddSurveyController implements Controller {
	constructor(private readonly validation: Validation) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		this.validation.validate(httpRequest.body);
		return null;
	}
}
