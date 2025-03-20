import { ClientOptions } from "../type/client.type";
import { DomainRaw } from "../type/domain.type";
export default class DomainClient {
    private client;
    constructor(loginToken: string, options?: ClientOptions);
    queryDomainList(): Promise<DomainRaw[]>;
}
