export interface ISDKError {
  code: number;
  message: string;
}
export class SDKError extends Error implements ISDKError {
  code: number;
  message: string;
  name: string;

  constructor(code: number, message: string = '') {
    super(message);
    this.code = code;
    this.message = message;
    this.name = 'Discord SDK Error';
  }
}
