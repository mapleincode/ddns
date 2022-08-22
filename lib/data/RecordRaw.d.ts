import RecordType from '../enums/RecordType';

interface RecordRaw {
    id: number
    name: string
    value: string
    line: string | undefined
    type: RecordType
    ttl: string
    value: string
    weight: string
    mx: string
    enabled: EnabledStatus
    status: RecordStatus
    monitorStatus: MonitorStatus
    remark: string
    remark: string
    updatedOn: string
    useApd: string
}
