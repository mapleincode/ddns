/**
 * Created by maple on 2018/1/10.
 */
import RecordClient from "./apis/record.api";
import { EnabledStatus } from './enums/EnabledStatus';
import { MonitorStatus } from './enums/MonitorStatus';
import { RecordStatus } from './enums/RecordStatus';
import RecordType from './enums/RecordType';
import DNSDomain from './DNSDomain';
import { SetEnableStatus } from './enums/SetEnableStatus';
import { DomainRaw } from "./type/domain.type";
import { DDnsRequest, RecordRaw, UpdateRecordRequest } from "./type/record.type";

type RecordJson = Pick<RecordRaw, any> & { domain: DomainRaw };

class DNSRecord {
    private id: number = 0;
    private name: string = '';
    private type: RecordType = RecordType.A;
    private value: string | undefined;


    private readonly domain: DNSDomain;
    private readonly raw: RecordRaw;
    private deleteStatus: boolean = false;

    constructor (domain: DNSDomain, data: RecordRaw, client: RecordClient) {
        this.domain = domain;
        this.raw = data;
        this.updateByRaw(data);
    }

    /**
     * 更新 record 的属性
     * @param record
     */
    updateByRaw (record: RecordRaw): void {
        this.id = parseInt(record.id + "");
        this.name = record.name;
        this.value = record.value;

        // 覆盖参数
        Object.assign(this.raw, record);
    }

    /**
     * 设置 delete 状态
     */
    setDeleteStatus(): void {
        this.deleteStatus = true;
    }

    /**
     * 是否被删除
     */
    isDeleted() : boolean {
        return this.deleteStatus;
    }

    getRaw (): RecordRaw {
        return this.raw;
    }

    getDomainRaw(): DomainRaw {
        return this.domain.getRaw();
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
    }

    async dns (value: string): Promise<void> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        await this.domain.ddns("record", this);
    }

    async ddns (): Promise<void> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        await this.domain.ddns("record", this);
    }

    async setRemark (remark: string): Promise<void> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        await this.domain.setRemark("record", this, remark);
    }

    async setStatus (status: SetEnableStatus): Promise<void> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        await this.domain.setStatus("record", this, status);
    }

    async delete (): Promise<void> {
        if (this.deleteStatus) {
            throw new Error('record has already removed');
        }

        await this.domain.deleteRecord("record", this);
    }
}

export default DNSRecord;
