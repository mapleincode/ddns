import RecordType from '../enums/RecordType';

interface RecordListRequest {
    offset?: number
    length?: number
    subDomain?: string
    recordType?: RecordType
    recordLine?: string
    recordLineId?: number
    keyword?: string
}

interface UpdateRecordRequest {
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

interface DdnsRequest {
    id: number
    name?: string
    value: string
    recordLine?: string
    recordLineId?: string
}

interface CreateRecordRequest {
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
