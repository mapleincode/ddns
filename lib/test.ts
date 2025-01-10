import DomainClient from "./apis/domain.api";
import RecordClient from "./apis/record.api";
import { SetEnableStatus } from "./enums/SetEnableStatus";
import account from "./test/account.json";

const token = `${account.loginId},${account.loginToken}`;

const domainClient = new DomainClient(token);

async function testApi() {
  const domains = await domainClient.queryDomainList();
  const domainRaws = domains.filter(domain => domain.name === account.domain);

  if (domainRaws.length === 0) {
    throw new Error("domain not found");
  }

  const domain = domainRaws[0];
  const domainId = domain.id;
  const domainName = domain.name;

  const recordClient = new RecordClient(domainId, token);
  const records = await recordClient.recordList();
  // console.log(JSON.stringify(records));

  const record = await recordClient.createRecord({ name: "haha" });

  const recordFiltered = records.filter(re => re.name === 'haha');
  if (recordFiltered.length === 0) {
    throw new Error('record not found');
  }

  const filteredRecord = recordFiltered[0];
  const recordId = filteredRecord.id;

  // await recordClient.recordById(recordId);

  // await recordClient.dns({ id: recordId, name: filteredRecord.name })
  await recordClient.remark(recordId, "yeee");

  await recordClient.setStatus(recordId, SetEnableStatus.disable)

  const result = await recordClient.removeRecord(recordId);
  console.log(result);
}

// test()
