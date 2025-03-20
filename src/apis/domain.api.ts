/*
 * @Author: maple
 * @Date: 2025-01-08 17:43:38
 * @LastEditors: maple
 * @LastEditTime: 2025-03-20 16:34:31
 */
import { DomainListResponse } from "../type/api.type";
import { ClientOptions, ClientExtOptions } from "../type/client.type";
import { DomainRaw } from "../type/domain.type";
import DNSPodClient from "./client";

export default
class DomainClient {
  private client: DNSPodClient;
  private ext: ClientExtOptions;
  constructor(loginToken: string, options?: ClientOptions) {
    this.client = DNSPodClient.getClient(loginToken, options);
    this.ext = {};
  }

  async queryDomainList(): Promise<DomainRaw[]> {
    const route = "/Domain.List";
    const response = await this.client.request(route, {}, this.ext) as DomainListResponse;
    return response.domains;
  }
}
