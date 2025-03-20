/*
 * @Author: maple
 * @Date: 2024-10-30 17:00:27
 * @LastEditors: maple
 * @LastEditTime: 2025-03-20 11:25:02
 */
import { ErrorFormatFunction, GetIPFunction } from './other.type';

export interface DomainOptions {
    getIP?: GetIPFunction
    errorFormat?: ErrorFormatFunction
    serverUrl?: string
    domainId?: number
    domainName: string
    loginId: number
    loginToken: string
}

// export interface DomainRaw {
//     id: number
//     name: string
//     punycode: string
//     grade: string
//     owner: string
//     extStatus: string
//     ttl: number
//     dnspodNs: string[]
// }

export interface DomainRaw {
    id: number;
    status: string;
    grade: string;
    group_id: string;
    searchengine_push: string;
    is_mark: string;
    ttl: string;
    cname_speedup: string;
    remark: string;
    created_on: string;
    updated_on: string;
    server: string;
    punycode: string;
    ext_status: string;
    src_flag: string;
    grade_ns: string[];
    name: string;
    grade_level: number;
    grade_title: string;
    is_vip: string;
    owner: string;
    records: string;
    is_grace_period: string;
    vip_start_at: string;
    vip_end_at: string;
    vip_auto_renew: string;
    tag_list: any[];
}

export interface DomainRawLint {
    id: number;
    name: string;
    punycode: string;
    grade: string;
    owner: string;
    ext_status: string;
    ttl: number;
    min_ttl: number;
    dnspod_ns: string[];
    status: string;
    can_handle_at_ns: boolean;
}


