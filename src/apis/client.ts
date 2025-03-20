/*
 * @Author: maple
 * @Date: 2025-01-08 16:13:12
 * @LastEditors: maple
 * @LastEditTime: 2025-03-20 15:33:20
 */
import path from "path";
import DNSDomain from "../DNSDomain";
import { Response } from "../type/api.type";
import { ClientOptions } from "../type/client.type";
import { ErrorFormatFunction, MapRaw } from "../type/other.type";
import request from "request-promise";
import { errorFormat } from "../utils";

export default
class DNSPodClient {
  private readonly loginToken: string;
  private readonly ext?: MapRaw;
  private readonly serverHost: string;
  private readonly errorFormat: ErrorFormatFunction;

  private static clientMap: {[key: string]: DNSPodClient};

  private constructor(loginToken: string, options?: ClientOptions) {
    this.loginToken = loginToken;
    this.ext = options?.ext;

    if (options?.serverHost) {
      this.serverHost = options.serverHost;
    } else {
      this.serverHost = 'https://dnsapi.cn';
    }

    if (options?.customErrorFormat) {
      this.errorFormat = options.customErrorFormat;
    } else {
      this.errorFormat = errorFormat;
    }
  }

  public static getClient(token: string, options?: ClientOptions) {
    if (!this.clientMap[token]) {
      this.clientMap[token] = new DNSPodClient(token, options);
    }
    return this.clientMap[token];
  }

  async request (apiPath: string, json: MapRaw): Promise<MapRaw> {

    const requestData = {
      ...this.ext,
      ...json,
      login_token: this.loginToken,
      format: 'json'
    };

    const requestParams = {
      method: 'POST',
      form: requestData,
      json: true,
      uri: `${this.serverHost}${apiPath}`
    };
    const body = await request(requestParams) as Response;
    const status: { code: string, message: string } = body.status;
    console.log(requestData);
    console.log(JSON.stringify(body) + "\n\n\n")
    if (status.code !== '1') {
      throw errorFormat(apiPath, status.code, status.message);
    }

    return body;
  }
}
