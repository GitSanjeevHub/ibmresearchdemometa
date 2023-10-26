import { LightningElement, api, wire } from 'lwc';
import { getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';

export default class LwcWirePicklistByRecordType extends LightningElement {

    @api recordTypeId;
    @api objectApiName;


    @wire(getPicklistValuesByRecordType, {
        objectApiName: '$objectApiName', 
        recordTypeId: '$recordTypeId' }) picklistValues({error, data}){

        console.log(
            'LWC Wire Picklist '+ this.objectApiName + ' ' + this.recordTypeId);

        if (data){

            //console.log(JSON.parse(JSON.stringify(data)));

            this.dispatchEvent( new CustomEvent(
                'wire', { 
                    detail : {
                        data: JSON.stringify(data.picklistFieldValues)
                    }
                })
            );

        }
        if (error){
            console.log(JSON.stringify(error));

        }

    }


}