"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RecordType_1 = __importDefault(require("../enums/RecordType"));
const client_1 = __importDefault(require("./client"));
class RecordClient {
    constructor(domainId, loginToken, options) {
        if (!options) {
            options = {};
        }
        if (!options.ext) {
            options.ext = {};
        }
        if (domainId) {
            options.ext.domain_id = domainId;
        }
        this.client = new client_1.default(loginToken, options);
    }
    recordList(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = '/Record.List';
            const params = options === undefined ? {} : options;
            const data = yield this.client.request(path, params);
            return data.records;
        });
    }
    // async recordByName (name: string): Promise<any> {
    //   const recordList = await this.recordList({ subDomain: name });
    //   if (recordList !== undefined && (recordList.length > 0)) {
    //     return recordList[0];
    //   }
    //   throw new Error('record by name not found');
    // }
    recordById(recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = '/Record.Info';
            const params = {
                record_id: recordId
            };
            const data = yield this.client.request(path, params);
            return data.record;
        });
    }
    // async recordByKeyword (keyword: string, offset?: number, length?: number): Promise<any | undefined> {
    //   const recordList = await this.recordList({ keyword, offset, length });
    //   if (recordList !== undefined && (recordList.length > 0)) {
    //     return recordList[0] as any;
    //   }
    // }
    createRecord(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiPath = '/Record.Create';
            if (options.name === '') {
                options.name = '@';
            }
            if (options.recordType === undefined) {
                options.recordType = RecordType_1.default.A;
            }
            if (options.value === undefined) {
                options.value = '127.0.0.1';
            }
            if (options.recordType === RecordType_1.default.MX) {
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
            const response = yield this.client.request(apiPath, json);
            return response.record;
        });
    }
    updateRecord(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const path = '/Record.Modify';
            if (options.recordType === 'MX') {
                if (options.mx === undefined) {
                    throw new Error('options.mx must be get on MX record');
                }
            }
            const json = {
                sub_domain: options.name,
                record_id: options.id,
                record_type: (_a = options.recordType) === null || _a === void 0 ? void 0 : _a.toString(),
                value: options.value,
                mx: options.mx,
                record_line: options.recordLine === undefined ? '默认' : options.recordLine,
                record_line_id: options.recordLineId,
                ttl: options.ttl,
                status: options.status,
                weight: options.weight
            };
            const response = yield this.client.request(path, json);
            return response.record;
        });
    }
    // noinspection JSUnusedGlobalSymbols
    // async updateRecordByName (name: string, options: UpdateRecordRequest & { id?: number }): Promise<any> {
    //   const record = await this.recordByName(name);
    //
    //   options.id = record.getId();
    //
    //   return await this.updateRecord(options);
    // }
    removeRecord(recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = '/Record.Remove';
            const params = {
                record_id: recordId
            };
            yield this.client.request(path, params);
        });
    }
    dns(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = '/Record.Ddns';
            const json = {
                record_id: options.id,
                sub_domain: options.name,
                record_line: options.recordLine === undefined ? '默认' : options.recordLine,
                record_line_id: options.recordLineId,
                value: options.value
            };
            const response = yield this.client.request(route, json);
            return response.record;
        });
    }
    remark(recordId, remark) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = '/Record.Remark';
            yield this.client.request(path, {
                record_id: recordId,
                remark
            });
        });
    }
    setStatus(recordId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = '/Record.Status';
            const response = yield this.client.request(path, {
                record_id: recordId,
                status
            });
            return response.record;
        });
    }
}
exports.default = RecordClient;
