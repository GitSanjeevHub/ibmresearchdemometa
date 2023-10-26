declare module "@salesforce/apex/DataAccess.getSObjectListSOQL" {
  export default function getSObjectListSOQL(param: {fields: any, childObjectQueries: any, objectName: any, filters: any, orderBy: any, orderDirection: any, rowLimit: any, offset: any}): Promise<any>;
}
declare module "@salesforce/apex/DataAccess.upsertRecords" {
  export default function upsertRecords(param: {records: any, allOrNothing: any}): Promise<any>;
}
declare module "@salesforce/apex/DataAccess.deleteRecords" {
  export default function deleteRecords(param: {records: any}): Promise<any>;
}
declare module "@salesforce/apex/DataAccess.getRecordTypeInfosByDeveloperName" {
  export default function getRecordTypeInfosByDeveloperName(param: {objectName: any}): Promise<any>;
}
