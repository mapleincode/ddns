import { SetEnableStatus } from "../enums/SetEnableStatus";
import { DomainRaw, DomainRawLint } from "./domain.type";
import { RecordInfoRaw, RecordLintRaw, RecordRaw } from "./record.type";

export interface ResponseStatus {
  code: string;
  message: string;
  created_at: string;
}

export interface DomainResponseInfo {
  domain_total: number;
  all_total: number;
  mine_total: number;
  share_total: number;
  vip_total: number;
  ismark_total: number;
  pause_total: number;
  error_total: number;
  lock_total: number;
  spam_total: number;
  vip_expire: number;
  share_out_total: number;
}

export interface Response {
  status: ResponseStatus;
}
export interface DomainListResponse {
  status: ResponseStatus;
  info: DomainResponseInfo;
  domains: DomainRaw[];
}

export interface RecordResponseInfo {
  sub_domains: string;
  record_total: string;
  records_num: string;
}

export interface RecordListResponse {
  status: ResponseStatus;
  domain: DomainRawLint;
  info: RecordResponseInfo;
  records: RecordRaw[];
}

export interface CreateRecordResponse {
  status: ResponseStatus;
  record: RecordLintRaw;
}

export interface RecordInfoResponse {
  status: ResponseStatus;
  domain: DomainRawLint;
  record: RecordInfoRaw;
}
export interface RecordDNSResponse {
  status: ResponseStatus;

  record: {
    id: number,
    name: string,
    value: string
  }
}

export interface RecordSetStatusResponse {
  status: ResponseStatus,

  record: {
    id: number;
    name: string;
    status: SetEnableStatus,
    weight?: string
  }
}
