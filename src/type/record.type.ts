import { EnabledStatus } from '../enums/EnabledStatus';
import { MonitorStatus } from '../enums/MonitorStatus';
import { RecordStatus } from '../enums/RecordStatus';
import RecordType from '../enums/RecordType';
import { SetEnableStatus } from '../enums/SetEnableStatus';

// export interface RecordRaw {
//     id: number
//     name: string
//     value: string
//     line: string | undefined
//     type: RecordType
//     ttl: string
//     weight: string
//     mx: string
//     enabled: EnabledStatus
//     status: RecordStatus
//     monitorStatus: MonitorStatus
//     remark: string
//     updatedOn: string
//     useApd: string
// }

export interface QueryRecordListRequest {
    offset?: number
    length?: number
    subDomain?: string
    recordType?: RecordType
    recordLine?: string
    recordLineId?: number
    keyword?: string
}

export interface UpdateRecordRequest {
    name?: string
    id: number
    recordType: RecordType
    value?: string
    mx?: string
    recordLine?: string
    recordLineId?: string
    ttl?: string
    status?: RecordStatus
    weight?: string
}

export interface DDnsRequest {
    id: number
    name: string
    value?: string
    recordLine?: string
    recordLineId?: string
}

export interface CreateRecordRequest {
    name: string
    recordType?: RecordType
    value?: string
    mx?: string
    recordLine?: string
    recordLineId?: string
    ttl?: string
    status?: SetEnableStatus
    weight?: string
}

export interface QueryRecordOptions {
    sync?: boolean
}

export interface RecordRaw {
    id: number|string;
    ttl: string;
    value: string;
    enabled: EnabledStatus;
    status?: string;
    updated_on: string;
    record_type_v1?: string;
    status_v1?: string;
    enabled_v1?: string;
    name: string;
    line?: string;
    line_id?: string;
    type: RecordType;
    weight?: any;
    monitor_status?: MonitorStatus;
    remark: string;
    use_aqb?: string;
    mx: string;
    hold?: string;
}

export interface RecordInfoRaw {
    id: number;
    sub_domain: string;
    record_type: RecordType;
    record_line: string;
    record_line_id: string;
    value: string;
    weight?: any;
    mx: string;
    ttl: string;
    enabled: EnabledStatus;
    monitor_status: MonitorStatus;
    remark: string;
    updated_on: string;
    domain_id: string;
}

export interface RecordLintRaw {
    id: number;
    name: string;
    status: string;
    weight?: any;
}
