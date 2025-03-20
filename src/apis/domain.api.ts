/*
 * @Author: maple
 * @Date: 2025-01-08 17:43:38
 * @LastEditors: maple
 * @LastEditTime: 2025-03-20 15:30:48
 */
import { DomainListResponse } from "../type/api.type";
import { ClientOptions } from "../type/client.type";
import { DomainRaw } from "../type/domain.type";
import DNSPodClient from "./client";

export default
class DomainClient {
  private client: DNSPodClient;
  constructor(loginToken: string, options?: ClientOptions) {
    this.client = DNSPodClient.getClient(loginToken, options);
  }

  async queryDomainList(): Promise<DomainRaw[]> {
    const route = "/Domain.List";
    const response = await this.client.request(route, {}) as DomainListResponse;
    return response.domains;
  }
}
