/**
 * Created by maple on 2018/1/10.
 */
import RecordType from './enums/RecordType';
import DnsPodDomain from './DnsPodDomain';
import { RecordRaw } from './data/RecordRaw';
import { DdnsRequest, UpdateRecordRequest } from './data/RequestOptions';
import isEmpty from './utils/is_empty';

type RecordJson = Pick<RecordRaw, any> & { domain: DomainRaw };

class DnsPodRecord {
    private id: number = 0;
    private name: string = '';
    private line: string | undefined = undefined;
    private type: RecordType = RecordType.A;
    private ttl: string | undefined = undefined;
    private value: string | undefined;
    private weight: string | undefined = undefined;
    private mx: string | undefined = undefined;
    private enabled: EnabledStatus | undefined = undefined;
    private status: RecordStatus | undefined = undefined;
    private monitorStatus: MonitorStatus | undefined = undefined;
    private remark: string | undefined = undefined;
    private updatedOn: string | undefined = undefined;
    private useApd: string | undefined = undefined;

    private readonly domain: DnsPodDomain;
    private raw: RecordRaw;
    private readonly deleteStatus: boolean = false;

    constructor (domain: DnsPodDomain, data: Raw) {
        this.domain = domain;

        data.monitorStatus = data.monitorStatus !== undefined ? data.monitorStatus : data.monitor_status;
        data.updateOn = data.updateOn !== undefined ? data.updateOn : data.update_on;
        data.useApd = data.useApd !== undefined ? data.useApd : data.use_apd;

        const record = data as RecordRaw;
        this.raw = record;
        this.initByRaw(record);
    }

    initByRaw (record: RecordRaw): void {
        this.raw = record;
        this.id = record.id;
        this.name = record.name;
        this.line = record.line;
        this.type = record.type;
        this.ttl = record.ttl;
        this.value = record.value;
        this.weight = record.weight;
        this.mx = record.mx;
        this.enabled = record.enabled;
        this.status = record.status;
        this.monitorStatus = record.monitorStatus;
        this.remark = record.remark;
        this.updatedOn = record.updatedOn;
        this.useApd = record.useApd;
    }

    toJSON (): RecordJson {
        return {
            domain: this.domain.toJSON(),
            ...this.raw
        };
    }

    getRaw (): RecordRaw {
        return this.raw;
    }

    getId (): number {
        return this.id;
    }

    getName (): string {
        return this.name;
    }

    getType (): RecordType {
        return this.type;
    }

    getTypeAsString (): string {
        return this.type.toString();
    }

    async sync (): Promise<void> {
        const recordId = this.id;
        if (recordId === undefined) {
            throw new Error('recordId can\'t be empty');
        }
        const newRecord = await this.domain.recordById(recordId);
        this.initByRaw(newRecord.getRaw());
    }

    async update (options: Partial<UpdateRecordRequest>): Promise<void> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        const _options: UpdateRecordRequest = {
            recordType: this.type,
            ...options,
            id: this.id
        };

        await this.domain.updateRecord(_options);
        await this.sync();
    }

    async dns (options: Omit<DdnsRequest, 'id'>): Promise<void> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        await this.domain.dns({
            ...options,
            id: this.id
        });
        await this.sync();
    }

    async ddns (): Promise<void> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        const ip = await this.domain.getGetIpFunction()();
        await this.domain.dns({
            id: this.id,
            value: ip
        });

        await this.sync();
    }

    async setRemark (remark: string): Promise<void> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        await this.domain.remark(this.id, remark);
        await this.sync();
    }

    async setStatus (status: SetEnableStatus): Promise<void> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        await this.domain.setStatus(this.id, status);
        await this.sync();
    }

    async delete (): Promise<Raw> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        return await this.domain.removeRecord(this.id);
    }
}

export default DnsPodRecord;
