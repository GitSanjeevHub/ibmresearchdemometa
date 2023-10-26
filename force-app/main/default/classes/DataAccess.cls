public without sharing class DataAccess {

    @auraEnabled
    public static List<SObject> getSObjectListSOQL(
                                        List<String> fields,
                                        List<String> childObjectQueries, 
								        String objectName, 
                                        String filters,
                                        String orderBy,
                                        String orderDirection,
                                        Integer rowLimit,
                                       Integer offset
                                       ){
        String SOQLQuery;
        List<SObject> records;

        
		
    	SOQLQuery = 'SELECT ';
        SOQLQuery += String.join(fields, ', ') + ' ';
        SOQLQuery += 'FROM '+objectName + ' ';
		
        if (filters != null && filters != null)
            SOQLQuery += ' WHERE ' + filters + ' ';
		
		if (orderBy != null && orderDirection != null){
            SOQLQuery += ' ORDER BY '+orderBy + ' ' + orderDirection;
       	}
                                           
        if (rowLimit != null){
            SOQLQuery += ' LIMIT '+rowLimit;
       	}
         
        System.debug('SOQLQuery: '+SOQLQuery);
                                           
        records = Database.query(SOQLQuery);
                                           
        System.debug('records: '+records);
        System.debug('# records: '+records.size());
                                           
        return records;
                                           
   	}

    @AuraEnabled
    public static String upsertRecords(List<SObject> records, Boolean allOrNothing){

        System.debug('upsertRecords');
        System.debug(records);
        System.debug(records.size());
        System.debug(allOrNothing);

        List<Database.UpsertResult> upsertResults = 
            Database.Upsert(records, allOrNothing);
        System.debug(upsertResults);

        return JSON.serialize(upsertResults);

    }
        
    
    @AuraEnabled
    public static String deleteRecords(List<SObject> records){
        System.debug('deleteRecords '+records);

        List<Database.DeleteResult> deleteResults = Database.delete(records, false);
        System.debug(deleteResults);

        return JSON.serialize(deleteResults);
    }


    @AuraEnabled(Cacheable=true)
    public static string getRecordTypeInfosByDeveloperName(String objectName){

        System.debug('getRecordTypeInfosByDeveloperName '+objectName);
        Map<String, Schema.RecordTypeInfo> recordTypeInfos = Schema.getGlobalDescribe().get(
            objectName).getDescribe().getRecordTypeInfosByDeveloperName();

        System.debug(recordTypeInfos);

        return JSON.serialize(recordTypeInfos);
        
    }
}