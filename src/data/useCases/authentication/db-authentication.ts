import {
	HashComparer,
	LoadAccountByEmailRepository,
	TokenGenerator,
	UpdateAccessTokenRepository,
	Authentication,
	AuthenticationModel,
} from './db-authentication-protocols';

export class DbAuthentication implements Authentication {
	constructor(
		private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
		private readonly hashComparer: HashComparer,
		private readonly tokenGenerator: TokenGenerator,
		private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
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
				const accessToken = await this.tokenGenerator.generate(account.id);

				await this.updateAccessTokenRepository.updateAccessToken(
					account.id,
					accessToken
				);

				return accessToken;
			}
		}

		return null;
	}
}
