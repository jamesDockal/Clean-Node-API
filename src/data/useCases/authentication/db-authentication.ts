import {
	Authentication,
	AuthenticationModel,
} from '../../../domain/useCases/authentication';
import { HashComparer } from '../../protocols/criptography/hash-comparer';
import { TokenGenerator } from '../../protocols/criptography/token-generator';
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthentication implements Authentication {
	constructor(
		private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
		private readonly hashComparer: HashComparer,
		private readonly tokenGenerator: TokenGenerator
	) {}

	async auth(authenticationModel: AuthenticationModel): Promise<string> {
		const account = await this.loadAccountByEmailRepository.load(
			authenticationModel.email
		);
		if (account) {
			const isValid = await this.hashComparer.compare(
				authenticationModel.password,
				account.password
			);

			if (isValid) {
				return await this.tokenGenerator.generate(account.id);
			}
		}

		return null;
	}
}
