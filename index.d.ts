declare interface DomainOptions {
    loginToken?: string;
    loginId?: string;
    domainId?: string;
};

declare class Record {
    constructor(recordJson: recordOptions, domain: string);

    init(recordJson: recordOptions);
    toJSON(): recordOptions;
    setDomain(domain: string);

    initByAPI(callback: function);
    clone(newRecord: Record);
    update(subDomain: string, recordType: string, value: string, options: recordOptions, callback: function);
    setDns(value: string, options: recordOptions, callback: function);
    ddns(callback: function);
    setRemark(remark: string, callback: function);
    setStatus(status: number, callback: function);
    remove(callback: function);
}

declare class AsyncRecord {
    constructor(recordJson: recordOptions, domain: string);

    init(recordJson: recordOptions);
    toJSON(): recordOptions;
    setDomain(domain: string);

    initByAPI(): AsyncRecord;
    clone(newRecord: AsyncRecord);
    update(subDomain: string, recordType: string, value: string, options: recordOptions): AsyncRecord;
    setDns(value: string, options: recordOptions): AsyncRecord;
    ddns(): AsyncRecord;
    setRemark(remark: string): AsyncRecord;
    setStatus(status: number): AsyncRecord;
    remove();
}

declare function getIpFunc();

declare interface recordOptions {
    subDomain?: string;
    recordType?: string;
    value?: string;
    mx?: string;
    recordLine?: string;
    ttl?: number;
    status?: number;
    weight?: number;
    [string]?: any;
}

export class AsyncDomain {
    constructor(email: string, password: string, domainName: string, options: DomainOptions);
    constructor(email: string, options: DomainOptions);

    get records(): Record[];
    get recordsCount(): number;
    get getIp(): getIpFunc;
    set getIp(func: getIpFunc);

    static get Domain(): AsyncDomain;

    async recordList(offset: number, length: number): Promise<AsyncRecord[]>;
    async recordByName(subDomainName: string, json: boolean): Promise<AsyncRecord>;
    async recordByName(subDomainName: string): Promise<AsyncRecord>;
    async recordById(recordId: string): Promise<AsyncRecord>;
    async recordByKeyword(keyword: string, offset: number, length: number): Promise<AsyncRecord[]>;
    async recordByKeywrod(keyword: string): Promise<AsyncRecord[]>;
    async setGetIpFunction(func: getIpFunc);
    async createRecord(subDomain: string, recordType: string, value: string, options: recordOptions): Promise<AsyncRecord>;
    async updateRecord(recordId: string, subDomain: string, recordType: string, value: string, options: recordOptions): Promise<AsyncRecord>;
    async updateRecordByName(subDomainName: string, recordType: string, value: string, options: recordOptions): Promise<AsyncRecord>;
    async updateRecordByName(subDomainName: string, recordType: string, value: string): Promise<AsyncRecord>;
    async removeRecord(recordId: string): Promise<AsyncRecord>;
    async ddns(recordId: string, subDomainName: string, value: string, options: recordOptions): Promise<AsyncRecord>
    async remark(recordId: string, remark: string): Promise<AsyncRecord>
    async setStatus(recordId: string, status: number): Promise<AsyncRecord>
}

export default class Domain {
    constructor(email: string, password: string, domainName: string, options: DomainOptions);
    constructor(email: string, options: DomainOptions);

    get records(): Record[];
    get recordsCount(): number;
    get getIp(): getIpFunc;
    set getIp(func: getIpFunc);

    static get Domain(): AsyncDomain;

    recordList(offset: number, length: number, callback: funciton);
    recordByName(subDomainName: string, json: boolean, callback: function);
    recordByName(subDomainName: string, callback: function);
    recordById(recordId: string, callback: function);
    recordByKeyword(keyword: string, offset: number, length: number, callback: function);
    recordByKeywrod(keyword: string, callback: function);
    setGetIpFunction(func: getIpFunc);
    createRecord(subDomain: string, recordType: string, value: string, options: recordOptions, callback: function);
    updateRecord(recordId: string, subDomain: string, recordType: string, value: string, options: recordOptions, callback: function);
    updateRecordByName(subDomainName: string, recordType: string, value: string, options: recordOptions, callback: function);
    updateRecordByName(subDomainName: string, recordType: string, value: string, callback: function);
    removeRecord(recordId: string, callback: function);
    ddns(recordId: string, subDomainName: string, value: string, options: recordOptions, callback: function)
    remark(recordId: string, remark: string, callback: function)
    setStatus(recordId: string, status: number, callback: function)
}

export {};
