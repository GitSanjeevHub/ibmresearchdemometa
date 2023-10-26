/* eslint-disable guard-for-in */
import { LightningElement, api, track, wire } from 'lwc';
import setBudgetLineItemYearColumnsToCalendarYears from './setBudgetLineItemYearColumnsToCalendarYears.js';

import search from '@salesforce/apex/BudgetCalculatorAura.search';

export default class EditableGridWrapper extends LightningElement {

    @api hideUI = false;

    @api recordId = 'a1H5O000000Ddj1UAC';

    @track hostRecord;
    @track recordTypeId;

    @api configApi;
    config;

    @track columnExpansionLevelValues = [];

    @track picklistDependencies;

    expectedLookupDefaultNumber = 0;
    @track lookupDefaults;

    @track loadComplete = false;
    hostRecordWireComplete = false;
    objectMetadataWireComplete = false;
    recordTypePicklistWireComplete = false;

    @api recalculateRecordListWhenHostRecordChanges = false;
    

    handleObjectInfoWire(event){
        
        console.log("Object Info Wire complete");
        this.objectMetadata = JSON.parse(event.detail.data);
        console.log(this.objectMetadata);

        this.setHeaderColumnHelpTooltips();

        this.objectMetadataWireComplete = true;
        
        this.checkIfLoadsComplete();

        console.log('end of object info wire');
        
    }



    connectedCallback(){
        this.setConfig();
    }


    checkIfLoadsComplete(){

        console.log('checkifLoadsComplete');
        console.log('this.hostRecordWireComplete'+this.hostRecordWireComplete);
        console.log('this.objectMetadataWireComplete'+this.objectMetadataWireComplete);
        console.log('this.recordTypePicklistWireComplete'+this.recordTypePicklistWireComplete);

        if (this.hostRecordWireComplete && this.objectMetadataWireComplete && this.recordTypePicklistWireComplete){
            this.loadComplete = true;
        }

    }



    handleHostRecordWire(event){

        console.log('handleHostRecordWire');

        try {
            let record = JSON.parse(event.detail.data);
            console.log(record);

            this.hostRecord = record;

            if (this.config.objectName == "Budget_Line_Item__c")
                setBudgetLineItemYearColumnsToCalendarYears(this.config.columns, record.fields.I_RS_Year_1_Starts__c.value);

            this.setLookupDefaults();

            this.setExpandableColumnLevels();

            this.setMessageWhenLockedFromSaving();

            this.overrideCRUDPermissions('canCreate', 'createAccessPermissionCriteria');
            this.overrideCRUDPermissions('canClone', 'cloneAccessPermissionCriteria');
            this.overrideCRUDPermissions('canSave', 'saveAccessPermissionCriteria');
            this.overrideCRUDPermissions('canDelete', 'deleteAccessPermissionCriteria');

            this.hostRecordWireComplete = true;
            this.checkIfLoadsComplete();

        }
        catch(e){
            console.log(e);
        }

    }

    handleRecordTypeInfoWire(event){

        let recordTypeInfos = JSON.parse(event.detail.data);
        //console.log(recordTypeInfos);

        let recordTypeInfo = recordTypeInfos[this.config.recordTypeName];
        //console.log(recordTypeInfo);

        this.recordTypeId = recordTypeInfo.recordTypeId;
        //console.log(this.recordTypeId);

    }

    handlePicklistWire(event){


        this.picklistMetadata = JSON.parse(event.detail.data);
        
        this.populatePicklistValues();

        this.recordTypePicklistWireComplete = true;

        this.checkIfLoadsComplete();
    }



    setConfig(){
        console.log('setConfig');
        this.config = JSON.parse(JSON.stringify(this.configApi))
    }


    setLookupDefaults(){

        //console.log('setLookupDefaults');

        this.lookupDefaults = {};
        
        for (var i=0; i<this.config.columns.length; i++){

            let column = this.config.columns[i];

            if (column.type === 'lookup' && column.defaultValueReference){

                //console.log(JSON.parse(JSON.stringify(column)));


                this.expectedLookupDefaultNumber++;

                let fieldName = this.config.columns[i].fieldName;
                //console.log(fieldName)

                let defaultValueReference = this.config.columns[i].defaultValueReference;
                let defaultTitleReference = this.config.columns[i].defaultTitleReference;
                
                //console.log(defaultValueReference);
                //console.log(defaultTitleReference);
                
                let defaultValue = this.hostRecord.fields[defaultValueReference].value;
                let defaultTitle = this.hostRecord.fields[defaultTitleReference].value;

                /*this.lookupDefaults[fieldName] = 
                {
                    id: defaultValue,
                    lookupTitle: defaultTitle
                };*/

                if (defaultValue)
                    this.getLookupDefaultRecord(
                        column.fieldName, 
                        column.lookupObjectName, 
                        defaultValue,
                        column.lookupTitleField,
                        column.lookupSubtitleField,
                        column.lookupAdditionalFieldsToQuery);

            }

        }

    }


    getLookupDefaultRecord(fieldName, objectType, recordId, titleField, subTitleField, additionalFields){

        console.log('getLookupDefaultRecordd '+fieldName+objectType+recordId);
        console.log(additionalFields);

        let params = {
            objectName: objectType,
            searchTerm: recordId,
            titleField: titleField,
            subtitleField: subTitleField,
            additionalFieldsToQuery: additionalFields
        };

        search(params)
            .then(results => {

                console.log('getLookupDefaultRecord results '+results);

                try {
                    if (results){
                        let result = results[0];
                        //console.log(JSON.parse(JSON.stringify(result)));

                        this.lookupDefaults[fieldName] = 
                        {
                            id: recordId,
                            lookupTitle: result.record.Name,
                            payload: {lookupData: result}
                        };
                    }
                }
                finally {
                    console.log(this.lookupDefaults);
                }

            })
            .catch(error => {
                console.log(error);
                console.log(JSON.stringify(error));
            });
    }


    setHeaderColumnHelpTooltips(){

        console.log('setHeaderColumnHelpTooltips');
        let objectMetadataFields = this.objectMetadata.fields;

        console.log(JSON.parse(JSON.stringify(this.config.columns)));
        for (var i=0; i<this.config.columns.length; i++){
            //console.log(i);
            let fieldName = this.config.columns[i].fieldName;
            //console.log(fieldName);

            let fieldMetadata = objectMetadataFields[fieldName];
            //console.log(fieldMetadata);
            if (fieldMetadata && fieldMetadata !== undefined){
                let helpText = fieldMetadata.inlineHelpText;
                
                if (helpText)
                    this.config.columns[i].helpText = helpText;
            }
        }

    }

    
    setExpandableColumnLevels(){

        console.log('set expandable column levels');
        var columnExpansionLevelValues = [];
        
        let columnExpansionLevels = this.config.columnExpansionLevels;
        if (columnExpansionLevels){
            if (columnExpansionLevels.length > 0 && this.hostRecord){

                for (var i=0; i<columnExpansionLevels.length; i++){
                    console.log(i);
                    let columnExpansionLevel = columnExpansionLevels[i];
                    console.log(columnExpansionLevel.source);
                    if (columnExpansionLevel.source === 'hostRecord'){
                        let fieldName = columnExpansionLevel.fieldName;
                        console.log(fieldName);

                        let value = this.hostRecord.fields[fieldName].value;
                        console.log(value);

                        columnExpansionLevelValues.push(value);
                    }
                    else {
                        let value = columnExpansionLevel.staticValue;
                        console.log('static value '+value);
                        columnExpansionLevelValues.push(value);

                    }

                }

                console.log('columnExpansionLevelValues '+columnExpansionLevelValues);
                this.columnExpansionLevelValues = columnExpansionLevelValues;

            }

        }

        this.checkIfLoadsComplete();

    }

    setMessageWhenLockedFromSaving(){

        //console.log('setMessageWhenLockedFromSaving');

        let messageConfig = this.config.messageWhenLockedFromSaving;
        //console.log(JSON.parse(JSON.stringify(messageConfig)));
        if (messageConfig){
            if (messageConfig.staticValue){
                this.messageWhenLockedFromSaving = messageConfig.staticValue;
                //console.log(messageWhenLockedFromSaving.staticValue);
            }
            else {
                //console.log('Getting source');

                let messageSource = messageConfig.source;

                if (messageSource === 'hostRecord'){

                    let fieldName = messageConfig.fieldName;
                    //console.log(fieldName);

                    let value = this.hostRecord.fields[fieldName].value;
                    //console.log(value);

                    this.config.messageWhenLockedFromSaving = value;
                }
            }
        }

        //console.log('Final value is '+this.messageWhenLockedFromSaving);

    }

    overrideCRUDPermissions(accessPermissionJSVariable, configAccessPermissionCriteriaName){

        console.log('overrideCRUDPermissions '+accessPermissionJSVariable+configAccessPermissionCriteriaName);
        let configAccessPermissionCriteria = this.config[configAccessPermissionCriteriaName];
        if (configAccessPermissionCriteria) {
            for (var i=0; i<configAccessPermissionCriteria.length; i++){
                //console.log(i);
                let criteria = configAccessPermissionCriteria[i];
                console.log(JSON.parse(JSON.stringify(criteria)));

                let valuesToEvaluateAgainst = criteria.values;
                console.log(valuesToEvaluateAgainst);

                var valueBeingEvaluated;
                if (criteria.source === 'hostRecord')
                    valueBeingEvaluated = this.hostRecord.fields[criteria.field].value;
                console.log(valueBeingEvaluated);

                let valueMatch = valuesToEvaluateAgainst.includes(valueBeingEvaluated);
                var criteriaMatch;

                if (criteria.operator === '=')
                    criteriaMatch = valueMatch;
                else if (criteria.operator === '!=')
                    criteriaMatch = !valueMatch;
                else
                    alert("Unsupported operator");

                console.log("Result "+criteriaMatch);

                if (criteriaMatch != this.config[accessPermissionJSVariable]){
                    this.config[accessPermissionJSVariable] = criteriaMatch;
                    return;
                }

            }
        }

       // console.log(this.canDelete);

    }

    populatePicklistValues(){
        //console.log('populatePicklistValues');
        //console.log(this.config.columns);

        if (this.picklistMetadata){
            for (var fieldName in this.picklistMetadata){

                let picklistValueData = this.picklistMetadata[fieldName];

                if (picklistValueData){
                    let column = this.config.columns.find(obj => {
                        return obj.fieldName === fieldName
                    });
                    
                    if (column){
                        console.log(column);
                        column.picklistValues = picklistValueData.values;
                    }
                }

            }
        }
        
    }


    handleSuccessfulSave(){
        console.log('wrapper - handleSuccessfulSave');
        if (this){
            this.dispatchEvent(new CustomEvent('successfulsave'));
        }
    }


    /*@api
    recalcaluateRecords(){
        let grid = this.template.querySelector('c-editable-grid2');
        if (grid != null){
            grid.recalculateRecordsRemotely();
        }
    }*/

    @api
    refreshRecordsFromServer(){
        let grid = this.template.querySelector('c-editable-grid2');
        if (grid != null){
            grid.getRecordsFromServer();
        }
    }

}