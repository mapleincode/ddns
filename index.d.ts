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
    setStatus(status: string, callback: function);
    remove(callback: function);
}

declare class AsyncRecord {
    constructor(recordJson: recordOptions, domain: string);

    init(recordJson: recordOptions);
    toJSON(): recordOptions;
    setDomain(domain: string);

    initByAPIAsync(): Promise<AsyncRecord>;
    cloneAsync(newRecord: Promise<AsyncRecord>);
    updateAsync(subDomain: string, recordType: string, value: string, options: recordOptions): Promise<AsyncRecord>;
    setDnsAsync(value: string, options: recordOptions): Promise<AsyncRecord>;
    ddnsAsync(): Promise<AsyncRecord>;
    setRemarkAsync(remark: string): Promise<AsyncRecord>;
    setStatusAsync(status: string): Promise<AsyncRecord>;
    removeAsync();
}

declare function getIpFunc();

declare interface recordOptions {
    subDomain?: string;
    recordType?: string;
    value?: string;
    mx?: string;
    recordLine?: string;
    ttl?: string;
    status?: string;
    weight?: string;
    [string]?: any;
}

export class AsyncDomain {
    constructor(email: string, password: string, domainName: string, options: DomainOptions);
    constructor(email: string, options: DomainOptions);

    get records(): Record[];
    get recordsCount(): string;
    get getIp(): getIpFunc;
    set getIp(func: getIpFunc);
    get domain(): { name: string, id: string }

    static get Domain(): AsyncDomain;

    async recordListAsync(offset: string, length: string): Promise<AsyncRecord[]>;
    async recordByNameAsync(subDomainName: string, json: boolean): Promise<AsyncRecord>;
    async recordByNameAsync(subDomainName: string): Promise<AsyncRecord>;
    async recordByIdAsync(recordId: string): Promise<AsyncRecord>;
    async recordByKeywordAsync(keyword: string, offset: string, length: string): Promise<AsyncRecord[]>;
    async recordByKeywrodAsync(keyword: string): Promise<AsyncRecord[]>;
    async setGetIpFunction(func: getIpFunc);
    async createRecordAsync(subDomain: string, recordType: string, value: string, options: recordOptions): Promise<AsyncRecord>;
    async updateRecordAsync(recordId: string, subDomain: string, recordType: string, value: string, options: recordOptions): Promise<AsyncRecord>;
    async updateRecordByNameAsync(subDomainName: string, recordType: string, value: string, options: recordOptions): Promise<AsyncRecord>;
    async updateRecordByNameAsync(subDomainName: string, recordType: string, value: string): Promise<AsyncRecord>;
    async removeRecordAsync(recordId: string): Promise<AsyncRecord>;
    async ddnsAsync(recordId: string, subDomainName: string, value: string, options: recordOptions): Promise<AsyncRecord>
    async remarkAsync(recordId: string, remark: string): Promise<AsyncRecord>
    async setStatusAsync(recordId: string, status: string): Promise<AsyncRecord>
}

export default class Domain {
    constructor(email: string, password: string, domainName: string, options: DomainOptions);
    constructor(email: string, options: DomainOptions);

    get records(): Record[];
    get recordsCount(): string;
    get getIp(): getIpFunc;
    set getIp(func: getIpFunc);
    get domain(): { name: string, id: string }

    static get Domain(): AsyncDomain;

    recordList(offset: string, length: string, callback: funciton);
    recordByName(subDomainName: string, json: boolean, callback: function);
    recordByName(subDomainName: string, callback: function);
    recordById(recordId: string, callback: function);
    recordByKeyword(keyword: string, offset: string, length: string, callback: function);
    recordByKeywrod(keyword: string, callback: function);
    setGetIpFunction(func: getIpFunc);
    createRecord(subDomain: string, recordType: string, value: string, options: recordOptions, callback: function);
    updateRecord(recordId: string, subDomain: string, recordType: string, value: string, options: recordOptions, callback: function);
    updateRecordByName(subDomainName: string, recordType: string, value: string, options: recordOptions, callback: function);
    updateRecordByName(subDomainName: string, recordType: string, value: string, callback: function);
    removeRecord(recordId: string, callback: function);
    ddns(recordId: string, subDomainName: string, value: string, options: recordOptions, callback: function)
    remark(recordId: string, remark: string, callback: function)
    setStatus(recordId: string, status: string, callback: function)
}

export {};
