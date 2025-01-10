/**
 * Created by maple on 2018/1/10.
 */
import DomainClient from "./apis/domain.api";
import RecordClient from "./apis/record.api";
import DNSPlus from "./DNSPlus";
import DNSRecord from "./DNSRecord";
import { SetEnableStatus } from "./enums/SetEnableStatus";
import { DomainOptions, DomainRaw } from "./type/domain.type";
import { CreateRecordRequest, QueryRecordOptions, RecordRaw, UpdateRecordRequest } from "./type/record.type";


class DNSDomain {
    private readonly domainOptions?: DomainOptions;

    private id: number = 0;
    private readonly name: string;
    private readonly dnsPod: DNSPlus;
    private isSync = false;
    private domainRaw: DomainRaw|null = null;
    private recordsList: DNSRecord[] = [];
    private token: string;
    private domainClient: DomainClient;
    private recordClient: RecordClient | null = null;

    // private noCallback:
    constructor (dnsPod: DNSPlus, domainName: string, options?: DomainOptions) {
        this.name = domainName;
        this.dnsPod = dnsPod;
        this.token = dnsPod.getToken();

        if (options) {
            this.domainOptions = {
                ...options
            };
        }

        this.domainClient = new DomainClient(this.token, options);
    }

    public getName (): string {
        return this.name;
    }

    getRecords (): DNSRecord[] {
        if (!this.isSync) {
            throw new Error("domain not synced");
        }

        return this.recordsList;
    }

    getRaw(): DomainRaw {
        if (!this.isSync || this.domainRaw == null) {
            throw new Error("domain not synced");
        }
        return this.domainRaw;
    }

    public async sync() {
        // 只允许同步一次
        if (this.isSync) {
            return;
        }

        this.isSync = true;
        const domainRaws = await this.domainClient.queryDomainList();

        // 查询列表
        const domain = domainRaws.find(d => d.name === this.name);
        if (!domain) {
            throw new Error("domain not found");
        }

        // 赋值
        this.id = domain.id;
        this.domainRaw = domain;

        const recordClient = new RecordClient(this.id, this.token, this.domainOptions);
        this.recordClient = recordClient;

        const recordRaws = await recordClient.recordList();
        this.recordsList = recordRaws.map(raw => new DNSRecord(this, raw, recordClient));

    }

    public async syncRecords() {
        if (!this.isSync || this.recordClient == null) {
            await this.sync();
            return this.recordsList;
        }
        const recordClient = this.recordClient;
        const recordRaws = await this.recordClient.recordList();
        this.recordsList = recordRaws.map(raw => new DNSRecord(this, raw, recordClient));
        return this.recordsList;
    }

    public async createRecord(options: CreateRecordRequest): Promise<DNSRecord> {
        if (!this.isSync) {
            await this.sync();
        }
        // !this.recordClient
        // if (this.recordClient == null) {
        //     throw new Error("record client is uninitialized")
        // }
        const record = await this.recordClient!.createRecord(options);
        const recordInfo = await this.recordClient!.recordById(record.id);
        const recordRaw: RecordRaw = {
            ...recordInfo,
            name: recordInfo.sub_domain,
            type: (await recordInfo).record_type
        }
        const recordClient = this.recordClient;
        const dnsRecord = new DNSRecord(this, recordRaw, recordClient!);

        // 加入到 recordsList
        this.recordsList.push(dnsRecord);

        return dnsRecord;
    }

    public async queryRecordById(recordId: number, options?: QueryRecordOptions): Promise<DNSRecord | null> {
        if (!this.isSync) {
            await this.sync();
        }

        let recordsList = this.recordsList;
        if (options?.sync) {
            recordsList = await this.syncRecords();
        }

        const dnsRecord = recordsList.find(record => record.getId() === recordId);
        if (dnsRecord) {
            return dnsRecord;
        }
        return null;
    }

    public async queryRecordByName(name: string, options?: QueryRecordOptions): Promise<DNSRecord | null> {
        if (!this.isSync) {
            await this.sync();
        }

        let recordsList = this.recordsList;
        if (options?.sync) {
            recordsList = await this.syncRecords();
        }

        const dnsRecord = recordsList.find(record => record.getName() === name);
        if (dnsRecord) {
            return dnsRecord;
        }
        return null;
    }

    public async updateRecord(updateParams: UpdateRecordRequest) {
        if (!this.isSync) {
            await this.sync();
        }

        const updatedRecord = await this.recordClient!.updateRecord(updateParams);
        const record = await this.queryRecordById(updatedRecord.id);
        if (!record) {
            throw new Error("updated record not found");
        }

        for (let i = 0; i < this.recordsList.length; i++) {
            if (record.getId() === this.recordsList[i].getId()) {
                this.recordsList[i].updateByRaw(record.getRaw())
                return this.recordsList[i];
            }
        }

        // 没有在列表找到这个 record
        this.recordsList.push(record);

        // 返回默认的 record
        return record;
    }

    public async get(type: "id", id: number): Promise<DNSRecord>;
    public async get(type: "name", name: string): Promise<DNSRecord>;
    public async get(type: "record", record: DNSRecord): Promise<DNSRecord>;
    public async get(type: "id"|"name"|"record", target: unknown): Promise<DNSRecord>;
    public async get(type: unknown, target: unknown): Promise<DNSRecord> {
        if (!this.isSync) {
            await this.sync();
        }

        let record: DNSRecord | null = null;
        if (typeof target === "number") {
            record = await this.queryRecordById(target);
        } else if (typeof target === "string") {
            record = await this.queryRecordByName(target);
        } else if (target instanceof DNSRecord) {
            record = target;
        }

        if (!record) {
            throw new Error("record not found");
        }

        return record;
    }

    public async ddns(type: "id", id: number, value?: string): Promise<DNSRecord>;
    public async ddns(type: "name", name: string, value?: string): Promise<DNSRecord>;
    public async ddns(type: "record", record: DNSRecord, value?: string): Promise<DNSRecord>;
    public async ddns(type: "id"|"name"|"record", target: unknown, value?: string): Promise<DNSRecord> {
        const record = await this.get(type, target);
        const options = { id: record.getId(), name: record.getName(), value: value };
        const result = await this.recordClient!.dns(options);

        record.updateByRaw({
            ...record.getRaw(),
            value: result.value
        });

        return record;
    }

    public async setRemark(type: "id", id: number, remark: string): Promise<DNSRecord>;
    public async setRemark(type: "name", name: string, remark: string): Promise<DNSRecord>;
    public async setRemark(type: "record", record: DNSRecord, remark: string): Promise<DNSRecord>;
    public async setRemark(type: "id"|"name"|"record", target: unknown, remark: string): Promise<DNSRecord> {
        const record = await this.get(type, target);
        await this.recordClient!.remark(record.getId(), remark);

        record.updateByRaw({
            ...record.getRaw(),
            remark: remark
        });

        return record;
    }

    public async setStatus(type: "id", id: number, status: SetEnableStatus): Promise<DNSRecord>;
    public async setStatus(type: "name", name: string, status: SetEnableStatus): Promise<DNSRecord>;
    public async setStatus(type: "record", record: DNSRecord, status: SetEnableStatus): Promise<DNSRecord>;
    public async setStatus(type: "id"|"name"|"record", target: unknown, status: SetEnableStatus): Promise<DNSRecord> {
        const record = await this.get(type, target);
        const result = await this.recordClient!.setStatus(record.getId(), status);

        record.updateByRaw({
            ...record.getRaw(),
            status: result.status
        });

        return record;
    }

    public async deleteRecord(type: "id", id: number): Promise<void>;
    public async deleteRecord(type: "name", name: string): Promise<void>;
    public async deleteRecord(type: "record", record: DNSRecord): Promise<void>;
    public async deleteRecord(type: "id"|"name"|"record", target: unknown): Promise<void> {
        const record = await this.get(type, target);
        const result = await this.recordClient!.removeRecord(record.getId());

        // 标记为删除
        record.setDeleteStatus();
        this.recordsList = this.recordsList.filter(re => re.getId() !== record.getId())
    }
}

export default DNSDomain;
