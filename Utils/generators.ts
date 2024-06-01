import { internet } from 'faker'
export class Utils {

  static generateRandomNumber(length: number): string {
    let randomNumber = '';

    for (let i = 0; i < length; i++) {
      const digit = Math.floor(Math.random() * 10).toString();
      randomNumber += digit;
    }

    return randomNumber;
  }

  static generateEmail(): string {
    return internet.email();
  }

  static generateString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

}