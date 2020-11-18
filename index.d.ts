declare interface DomainOptions {
    loginToken?: string;
    loginId?: string;
    domainId?: string;
}

declare function Callback (err: Error, record: Record): void;

declare class Record {
    constructor(recordJson: recordOptions, domain: string);

    init(recordJson: recordOptions);
    toJSON(): recordOptions;
    setDomain(domain: string);

    initByAPI(callback: typeof Callback);
    clone(newRecord: Record);
    update(subDomain: string, recordType: string, value: string, options: recordOptions, callback: typeof Callback);
    setDns(value: string, options: recordOptions, callback: typeof Callback);
    ddns(callback: typeof Callback);
    setRemark(remark: string, callback: typeof Callback);
    setStatus(status: string, callback: typeof Callback);
    remove(callback: typeof Callback);
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
    get getIp(): typeof getIpFunc;
    set getIp(func: typeof getIpFunc);
    get domain(): { name: string, id: string }

    static get Domain(): AsyncDomain;

    recordListAsync(offset: string, length: string): Promise<AsyncRecord[]>;
    recordByNameAsync(subDomainName: string, json: boolean): Promise<AsyncRecord>;
    recordByNameAsync(subDomainName: string): Promise<AsyncRecord>;
    recordByIdAsync(recordId: string): Promise<AsyncRecord>;
    recordByKeywordAsync(keyword: string, offset: string, length: string): Promise<AsyncRecord[]>;
    recordByKeywrodAsync(keyword: string): Promise<AsyncRecord[]>;
    setGetIpFunction(func: typeof getIpFunc);
    createRecordAsync(subDomain: string, recordType: string, value: string, options: recordOptions): Promise<AsyncRecord>;
    updateRecordAsync(recordId: string, subDomain: string, recordType: string, value: string, options: recordOptions): Promise<AsyncRecord>;
    updateRecordByNameAsync(subDomainName: string, recordType: string, value: string, options: recordOptions): Promise<AsyncRecord>;
    updateRecordByNameAsync(subDomainName: string, recordType: string, value: string): Promise<AsyncRecord>;
    removeRecordAsync(recordId: string): Promise<AsyncRecord>;
    ddnsAsync(recordId: string, subDomainName: string, value: string, options: recordOptions): Promise<AsyncRecord>
    remarkAsync(recordId: string, remark: string): Promise<AsyncRecord>
    setStatusAsync(recordId: string, status: string): Promise<AsyncRecord>
}

declare function DomainCallback(err: Error, domain: Domain): void;
export default class Domain {
    constructor(email: string, password: string, domainName: string, options: DomainOptions);
    constructor(email: string, options: DomainOptions);

    get records(): Record[];
    get recordsCount(): string;
    get getIp(): typeof getIpFunc;
    set getIp(func: typeof getIpFunc);
    get domain(): { name: string, id: string }

    static get Domain(): AsyncDomain;

    recordList(offset: string, length: string, callback: typeof DomainCallback);
    recordByName(subDomainName: string, json: boolean, callback: typeof DomainCallback);
    recordByName(subDomainName: string, callback: typeof DomainCallback);
    recordById(recordId: string, callback: typeof DomainCallback);
    recordByKeyword(keyword: string, offset: string, length: string, callback: typeof DomainCallback);
    recordByKeywrod(keyword: string, callback: typeof DomainCallback);
    setGetIpFunction(func: typeof getIpFunc);
    createRecord(subDomain: string, recordType: string, value: string, options: recordOptions, callback: typeof DomainCallback);
    updateRecord(recordId: string, subDomain: string, recordType: string, value: string, options: recordOptions, callback: typeof DomainCallback);
    updateRecordByName(subDomainName: string, recordType: string, value: string, options: recordOptions, callback: typeof DomainCallback);
    updateRecordByName(subDomainName: string, recordType: string, value: string, callback: typeof DomainCallback);
    removeRecord(recordId: string, callback: typeof DomainCallback);
    ddns(recordId: string, subDomainName: string, value: string, options: recordOptions, callback: typeof DomainCallback)
    remark(recordId: string, remark: string, callback: typeof DomainCallback)
    setStatus(recordId: string, status: string, callback: typeof DomainCallback)
}

export {};
