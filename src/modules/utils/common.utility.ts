import { randomBytes, pbkdf2Sync } from 'crypto';

export class CommonUtility {  //隨機產生Salt與密碼雜湊
  public static encryptBySalt(
    input: string,
    salt = randomBytes(16).toString('hex'),
  ) {
    const hash = pbkdf2Sync(input, salt, 1000, 64, 'sha256').toString('hex');
    return { hash, salt };
  }
}