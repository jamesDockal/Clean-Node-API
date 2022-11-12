import {
	Controller,
	HttpRequest,
	HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutTypes {
	sut: LogControllerDecorator;
	controllerStub: Controller;
}

const makeSut = (): SutTypes => {
	class ControllerStub implements Controller {
		async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
			const httpResponse: HttpResponse = {
				statusCode: 200,
				body: {},
			};

			return httpResponse;
		}
	}

	const controllerStub = new ControllerStub();
	const sut = new LogControllerDecorator(controllerStub);

	return {
		sut,
		controllerStub,
	};
};

describe('Log Controller Decorator', () => {
	test('should call controlller handle', async () => {
		const { sut, controllerStub } = makeSut();
		const controllerStubHandleSpy = jest.spyOn(controllerStub, 'handle');

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		await sut.handle(httpRequest);

		expect(controllerStubHandleSpy).toBeCalledWith(httpRequest);
	});
});
