import RecordType from "../enums/RecordType";
import { SetEnableStatus } from "../enums/SetEnableStatus";
import {
  CreateRecordResponse,
  RecordDNSResponse,
  RecordInfoResponse,
  RecordListResponse,
  RecordSetStatusResponse
} from "../type/api.type";
import { ClientOptions } from "../type/client.type";
import {
  CreateRecordRequest,
  DDnsRequest,
  QueryRecordListRequest, RecordInfoRaw, RecordLintRaw, RecordRaw,
  UpdateRecordRequest
} from "../type/record.type";
import DNSPodClient from "./client";

export default
class RecordClient {
  private client: DNSPodClient;

  constructor(domainId: number, loginToken: string, options?: ClientOptions) {
    if (!options) {
      options = {};
    }

    if (!options.ext) {
      options.ext = {}
    }

    if (domainId) {
      options.ext.domain_id = domainId;
    }

    this.client = new DNSPodClient(loginToken, options);
  }

  async recordList (options?: QueryRecordListRequest): Promise<RecordRaw[]> {
    const path = '/Record.List';

    const params = options === undefined ? {} : options;
    const data = await this.client.request(path, params) as RecordListResponse;
    return data.records;
  }

  // async recordByName (name: string): Promise<any> {
  //   const recordList = await this.recordList({ subDomain: name });
  //   if (recordList !== undefined && (recordList.length > 0)) {
  //     return recordList[0];
  //   }
  //   throw new Error('record by name not found');
  // }

  async recordById (recordId: number): Promise<RecordInfoRaw> {
    const path = '/Record.Info';

    const params = {
      record_id: recordId
    };
    const data = await this.client.request(path, params) as RecordInfoResponse;
    return data.record;
  }

  // async recordByKeyword (keyword: string, offset?: number, length?: number): Promise<any | undefined> {
  //   const recordList = await this.recordList({ keyword, offset, length });
  //   if (recordList !== undefined && (recordList.length > 0)) {
  //     return recordList[0] as any;
  //   }
  // }

  async createRecord (options: CreateRecordRequest): Promise<RecordLintRaw> {
    const apiPath = '/Record.Create';

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

    const response = await this.client.request(apiPath, json) as CreateRecordResponse;
    return response.record;
  }

  async updateRecord (options: UpdateRecordRequest): Promise<RecordLintRaw> {
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

    const response = await this.client.request(path, json) as CreateRecordResponse;
    return response.record;
  }

  // noinspection JSUnusedGlobalSymbols
  // async updateRecordByName (name: string, options: UpdateRecordRequest & { id?: number }): Promise<any> {
  //   const record = await this.recordByName(name);
  //
  //   options.id = record.getId();
  //
  //   return await this.updateRecord(options);
  // }

  async removeRecord (recordId: number): Promise<void> {
    const path = '/Record.Remove';
    const params = {
      record_id: recordId
    };

    await this.client.request(path, params);
  }

  async dns (options: DDnsRequest): Promise<{ id: number; name: string; value: string }> {
    const route = '/Record.Ddns';
    const json = {
      record_id: options.id,
      sub_domain: options.name,
      record_line: options.recordLine === undefined ? '默认' : options.recordLine,
      record_line_id: options.recordLineId,
      value: options.value
    };

    const response = await this.client.request(route, json) as RecordDNSResponse;
    return response.record;
  }

  async remark (recordId: number, remark: string): Promise<void> {
    const path = '/Record.Remark';

    await this.client.request(path, {
      record_id: recordId,
      remark
    });
  }

  async setStatus (recordId: number, status: SetEnableStatus): Promise<{
    id: number;
    name: string;
    status: SetEnableStatus;
    weight?: string
  }> {
    const path = '/Record.Status';

    const response = await this.client.request(path, {
      record_id: recordId,
      status
    }) as RecordSetStatusResponse;
    return response.record;
  }
}
