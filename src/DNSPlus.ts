import path from "path";
import { FetchLocalIPFunction } from './type/ddns.type';
import { DomainOptions } from "./type/domain.type";
import { ErrorFormatFunction } from "./type/other.type";
import { errorFormat, getIP } from './utils';
import DNSDomain from './DNSDomain';
// @ts-ignore
import request from 'request-promise';

class DNSPlus {
    private getIp: FetchLocalIPFunction = getIP;
    private errorFormat: ErrorFormatFunction = errorFormat;

    private readonly loginId: number;
    private readonly loginToken: string;
    private readonly token: string;

    constructor (loginId: number, loginToken: string) {
        this.loginId = loginId;
        this.loginToken = loginToken;
        this.token = `${loginId},${loginToken}`;
    }

    public setGetIpFunction(getIpFunc: FetchLocalIPFunction): void {
        this.getIp = getIpFunc;
    }

    getGetIpFunction (): FetchLocalIPFunction {
        return this.getIp;
    }

    public setErrorFormatFunction (errorFormatFunc: ErrorFormatFunction): void {
        this.errorFormat = errorFormatFunc;
    }

    public getErrorFormatFunction (): ErrorFormatFunction {
        return this.errorFormat;
    }

    getToken(): string {
        return this.token;
    }

    /**
     * 授权 loginId 和 loginToken
     * @param loginId
     * @param loginToken
     * @return DNSPlus
     */
    static auth (loginId: number, loginToken: string): DNSPlus {
        return new DNSPlus(loginId, loginToken);
    }

    domain (domainName: string, options?: DomainOptions): DNSDomain {
        return new DNSDomain(this, domainName, options);
    }

    async getLocalIp (): Promise<string> {
        return await this.getIp();
    }
}

export default DNSPlus;
