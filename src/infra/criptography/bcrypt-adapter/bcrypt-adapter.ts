import bcrypt from 'bcrypt';
import { Encrypter } from '../../../data/protocols/criptography/encrypter';
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer';

export class BCryptAdapter implements Encrypter, HashComparer {
	private readonly salt: number | string;
	constructor(salt: number | string) {
		this.salt = salt;
	}

	async encrypt(value: string): Promise<string> {
		return await bcrypt.hash(value, 12);
	}

	async compare(value: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(value, hash);
	}
}
