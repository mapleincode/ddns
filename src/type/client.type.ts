import { ErrorFormatFunction, MapRaw } from "./other.type";

export interface ClientOptions {
  loginToken?: string;
  serverHost?: string;
  customErrorFormat?: ErrorFormatFunction
}

export interface ClientExtOptions {
  domain_id?: number
}
