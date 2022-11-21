import jwt from 'jsonwebtoken';

import { TokenGenerator } from '../../../data/protocols/criptography/token-generator';

export class JwtAdapter implements TokenGenerator {
	constructor(private readonly secret: string) {}

	async generate(value: string): Promise<string> {
		await jwt.sign({ id: value }, this.secret);
		return null;
	}
}
