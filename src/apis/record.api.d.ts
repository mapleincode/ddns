import { SetEnableStatus } from "../enums/SetEnableStatus";
import { ClientOptions } from "../type/client.type";
import { CreateRecordRequest, DDnsRequest, QueryRecordListRequest, RecordInfoRaw, RecordLintRaw, RecordRaw, UpdateRecordRequest } from "../type/record.type";
export default class RecordClient {
    private client;
    constructor(domainId: number, loginToken: string, options?: ClientOptions);
    recordList(options?: QueryRecordListRequest): Promise<RecordRaw[]>;
    recordById(recordId: number): Promise<RecordInfoRaw>;
    createRecord(options: CreateRecordRequest): Promise<RecordLintRaw>;
    updateRecord(options: UpdateRecordRequest): Promise<RecordLintRaw>;
    removeRecord(recordId: number): Promise<void>;
    dns(options: DDnsRequest): Promise<{
        id: number;
        name: string;
        value: string;
    }>;
    remark(recordId: number, remark: string): Promise<void>;
    setStatus(recordId: number, status: SetEnableStatus): Promise<{
        id: number;
        name: string;
        status: SetEnableStatus;
        weight?: string;
    }>;
}
