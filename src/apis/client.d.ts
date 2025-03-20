import { ClientOptions } from "../type/client.type";
import { MapRaw } from "../type/other.type";
export default class DNSPodClient {
    private readonly loginToken;
    private readonly ext?;
    private readonly serverHost;
    private readonly errorFormat;
    constructor(loginToken: string, options?: ClientOptions);
    request(apiPath: string, json: MapRaw): Promise<MapRaw>;
}
