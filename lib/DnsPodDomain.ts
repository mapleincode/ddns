/**
 * Created by maple on 2018/1/10.
 */
import { CreateRecordRequest, DdnsRequest, RecordListRequest, UpdateRecordRequest } from './data/RequestOptions';
import DnsPod from './DnsPod';
import DnsPodRecord from './DnsPodRecord';
import RecordType from './enums/RecordType';
import { getIP } from './utils';

class DnsPodDomain {
    private readonly recordDataList: DnsPodRecord[] = [];
    private readonly domainOptions: Raw = {};

    private id: number = 0;
    private readonly name: string;
    private readonly dnsPod: DnsPod;

    private raw: DomainRaw | undefined;

    // private noCallback:
    constructor (dnsPod: DnsPod, domainName?: string, options?: DomainOptions) {
        if (domainName === undefined) {
            throw new Error('domainName can\'t be empty');
        }

        if (dnsPod === undefined) {
            throw new Error('dnsPod can\'t be empty');
        }

        this.name = domainName;
        this.dnsPod = dnsPod;

        this.domainOptions = {
            ...options
        };
    }

    getName (): string {
        return this.name;
    }

    getId (): number | undefined {
        return this.id;
    }

    setId (id: number): void {
        this.id = id;
    }

    getRecords (): DnsPodRecord[] {
        return this.recordDataList;
    }

    get recordsSize (): number {
        return this.recordDataList.length;
    }

    getGetIpFunction (): typeof getIP {
        return this.dnsPod.getGetIpFunction();
    }

    setRawData (data: Raw): void {
        if (data === undefined) {
            return;
        }

        if (data.id !== undefined) {
            this.setId(data.id as number);
        }

        data.extStatus = data.ext_status;
        data.dnspodNs = data.dnspod_nas;

        this.raw = data as DomainRaw;
    }

    async recordList (options?: RecordListRequest, raw?: boolean): Promise<DnsPodRecord[] | Raw[]> {
        const path = '/Record.List';

        const params = options === undefined ? {} : options;
        const data = await this.dnsPod.request(this, path, params);
        const rawRecords = data.records as Raw[];

        if (raw === true) {
            return rawRecords;
        }

        return rawRecords.map(record => new DnsPodRecord(this, record));
    }

    async recordByName (name: string, raw: boolean = false): Promise<DnsPodRecord | Raw> {
        const recordList = await this.recordList({ subDomain: name }, raw);
        if (recordList !== undefined && (recordList.length > 0)) {
            return recordList[0];
        }
        throw new Error('record by name not found');
    }

    async recordById (recordId: number): Promise<DnsPodRecord> {
        const path = '/Record.Info';

        const params = {
            record_id: recordId
        };
        const data = await this.dnsPod.request(this, path, params);
        if (data === undefined || data.record === undefined) {
            throw new Error('查询不到对应的 record');
        }

        return new DnsPodRecord(this, data.record);
    }

    async recordByKeyword (keyword: string, offset?: number, length?: number): Promise<DnsPodRecord | undefined> {
        const recordList = await this.recordList({ keyword, offset, length }, false);
        if (recordList !== undefined && (recordList.length > 0)) {
            return recordList[0] as DnsPodRecord;
        }
    }

    async createRecord (options: CreateRecordRequest): Promise<DnsPodRecord> {
        const path = '/Record.Create';

        if (options.name === '') {
            options.name = '@';
        }

        if (options.recordType === undefined) {
            options.recordType = RecordType.A;
        }

        if (options.value === undefined) {
            options.value = '127.0.0.1';
        }

        if (options.recordType === RecordType.MX) {
            if (options.mx === undefined) {
                throw new Error('options.mx must be get on MX record');
            }
        }

        const json = {
            sub_domain: options.name,
            record_type: options.recordType,
            value: options.value,
            mx: options.mx,
            record_line: options.recordLine === undefined ? '默认' : options.recordLine,
            record_line_id: options.recordLineId,
            ttl: options.ttl,
            status: options.status,
            weight: options.weight
        };

        const response = await this.dnsPod.request(this, path, json) as RecordResponse;
        const record = new DnsPodRecord(this, response);
        await record.sync();
        return record;
    }

    async updateRecord (options: UpdateRecordRequest): Promise<RecordResponse> {
        const path = '/Record.Modify';

        if (options.recordType === 'MX') {
            if (options.mx === undefined) {
                throw new Error('options.mx must be get on MX record');
            }
        }

        const json = {
            sub_domain: options.name,
            record_id: options.id,
            record_type: options.recordType?.toString(),
            value: options.value,
            mx: options.mx,
            record_line: options.recordLine === undefined ? '默认' : options.recordLine,
            record_line_id: options.recordLineId,
            ttl: options.ttl,
            status: options.status,
            weight: options.weight
        };

        return await this.dnsPod.request(this, path, json) as RecordResponse;
    }

    // noinspection JSUnusedGlobalSymbols
    async updateRecordByName (name: string, options: UpdateRecordRequest & { id?: number }): Promise<Raw> {
        const record = await this.recordByName(name);

        options.id = record.getId();

        return await this.updateRecord(options);
    }

    async removeRecord (recordId: number): Promise<RecordResponse> {
        const path = '/Record.Remove';
        const params = {
            record_id: recordId
        };

        return await this.dnsPod.request(this, path, params) as RecordResponse;
    }

    async dns (options: DdnsRequest): Promise<Raw> {
        const route = '/Record.Ddns';
        const json = {
            record_id: options.id,
            sub_domain: options.name,
            record_line: options.recordLine === undefined ? '默认' : options.recordLine,
            record_line_id: options.recordLineId,
            value: options.value
        };

        return await this.dnsPod.request(this, route, json) as RecordResponse;
    }

    async remark (recordId: number, remark: string): Promise<Raw> {
        const path = '/Record.Remark';

        return await this.dnsPod.request(this, path, {
            record_id: recordId,
            remark
        });
    }

    async setStatus (recordId: number, status: SetEnableStatus): Promise<Raw> {
        const path = '/Record.Status';

        return await this.dnsPod.request(this, path, {
            record_id: recordId,
            status
        });
    }

    toJSON (): DomainRaw {
        if (this.raw === undefined) {
            throw new Error('api not init');
        }
        return this.raw;
    }
}

export default DnsPodDomain;
