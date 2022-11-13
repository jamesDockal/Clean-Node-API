import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helper';
import {
	Controller,
	HttpRequest,
	HttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

const makeLogErrorRepository = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async logError(stackError: string): Promise<void> {
			return await new Promise((resolve) => resolve(null));
		}
	}

	return new LogErrorRepositoryStub();
};

interface SutTypes {
	sut: LogControllerDecorator;
	controllerStub: Controller;
	logErrorRepositoryStub: LogErrorRepository;
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
	const logErrorRepositoryStub = makeLogErrorRepository();

	const sut = new LogControllerDecorator(
		controllerStub,
		logErrorRepositoryStub
	);

	return {
		sut,
		controllerStub,
		logErrorRepositoryStub,
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

	test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
		const fakeError = new Error();
		fakeError.stack = 'any_stack';

		const error = serverError(fakeError);
		const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

		jest
			.spyOn(controllerStub, 'handle')
			.mockReturnValueOnce(new Promise((resolve) => resolve(error)));

		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password',
			},
		};

		await sut.handle(httpRequest);

		expect(logSpy).toHaveBeenCalledWith('any_stack');
	});
});
