import { DomainListResponse } from "../type/api.type";
import { ClientOptions } from "../type/client.type";
import { DomainRaw } from "../type/domain.type";
import DNSPodClient from "./client";

export default
class DomainClient {
  private client: DNSPodClient;
  constructor(loginToken: string, options?: ClientOptions) {
    this.client = new DNSPodClient(loginToken, options);
  }

  async queryDomainList(): Promise<DomainRaw[]> {
    const route = "/Domain.List";
    const response = await this.client.request(route, {}) as DomainListResponse;
    return response.domains;
  }
}
