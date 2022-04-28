export class CryptoBase64 {
  static from<T>(data: any) {
    return JSON.parse(Buffer.from(data, 'base64').toString('utf8')) as T;
  }
  static to(data: any) {
    return Buffer.from(JSON.stringify(data)).toString('base64');
  }
}
