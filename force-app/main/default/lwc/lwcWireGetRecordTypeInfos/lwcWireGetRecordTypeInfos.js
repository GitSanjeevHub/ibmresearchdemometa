import { LightningElement, api, wire } from 'lwc';
import getRecordTypeInfos from 
    '@salesforce/apex/DataAccess.getRecordTypeInfosByDeveloperName';

export default class LwcGetRecordTypeInfos extends LightningElement {

    @api objectName;

    @wire (getRecordTypeInfos, { objectName: '$objectName' }) wiredMetadataInfo({ error, data}){
        console.log("Wiring record type infos");
        if (data){
            console.log(data);
        }
        else if (error)
            console.log(JSON.stringify(error));
    }

}