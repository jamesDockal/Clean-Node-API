import { Decrypter } from 'data/protocols/criptography/decrypter';
import jwt from 'jsonwebtoken';

import { TokenGenerator } from '../../../data/protocols/criptography/token-generator';

export class JwtAdapter implements TokenGenerator, Decrypter {
	constructor(private readonly secret: string) {}

	async generate(value: string): Promise<string> {
		return jwt.sign({ id: value }, this.secret);
	}

	async decrypt(value: string): Promise<string> {
		return (await jwt.verify(value, this.secret)) as string;
	}
}
