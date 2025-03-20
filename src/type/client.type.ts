import { ErrorFormatFunction, MapRaw } from "./other.type";

export interface ClientOptions {
  loginToken?: string;
  ext?: MapRaw;
  serverHost?: string;
  customErrorFormat?: ErrorFormatFunction
}
