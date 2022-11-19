import bcrypt from 'bcrypt';
import { Encrypter } from '../../data/protocols/criptography/encrypter';

export class BCryptAdapter implements Encrypter {
	private readonly salt: number;
	constructor(salt: number) {
		this.salt = salt;
	}

	async encrypt(value: string): Promise<string> {
		return await bcrypt.hash(value, 12);
	}
}
