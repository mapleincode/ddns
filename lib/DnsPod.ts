import { errorFormat, getIP } from './utils';
import DnsPodDomain from './DnsPodDomain';
import request from 'request-promise';

class DnsPod {
    private getIp: typeof getIP = getIP;
    private errorFormat: typeof errorFormat = errorFormat;
    private serverUrl = 'https://dnsapi.cn';

    private readonly loginId: number;
    private readonly loginToken: string;
    private readonly token: string;

    constructor (loginId: number, loginToken: string) {
        this.loginId = loginId;
        this.loginToken = loginToken;
        this.token = `${loginId},${loginToken}`;
    }

    setGetIpFunction (getIpFunc: typeof getIP): void {
        this.getIp = getIpFunc;
    }

    getGetIpFunction (): typeof getIP {
        return this.getIp;
    }

    setErrorFormatFunction (errorFormatFunc: typeof errorFormat): void {
        this.errorFormat = errorFormatFunc;
    }

    getErrorFormatFunction (): typeof errorFormat {
        return this.errorFormat;
    }

    setServerUrl (serverUrl: string): void {
        this.serverUrl = serverUrl;
    }

    static auth (loginId: number, loginToken: string): DnsPod {
        return new DnsPod(loginId, loginToken);
    }

    domain (domainName: string, options?: DomainOptions): DnsPodDomain {
        return new DnsPodDomain(this, domainName, options);
    }

    async getLocalIp (): Promise<string> {
        return await this.getIp();
    }

    async request (domain: DnsPodDomain, path: string, json: { [key: string]: any }): Promise<Raw> {
        const data = {
            ...json,
            login_token: this.token,
            format: 'json',
            domain: domain.getName(),
            domain_id: domain.getId()
        };

        if (data.domain_id === 0) {
            delete data.domain_id;
        }

        const requestParams = {
            method: 'POST',
            form: data,
            json: true,
            uri: this.serverUrl + path
        };
        console.log(requestParams);
        const body = await request(requestParams);
        console.log(body);
        const status: { code: string, message: string } = body.status;

        if (status.code !== '1') {
            throw errorFormat(path, status.code, status.message);
        }

        if (body.domain !== undefined) {
            domain.setRawData(body.domain);
        }

        return body;
    }
}

export default DnsPod;
