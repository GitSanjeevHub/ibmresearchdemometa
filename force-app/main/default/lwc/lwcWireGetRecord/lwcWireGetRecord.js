import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class LwcWireGetRecord extends LightningElement {

    @api recordId;
    @api fields;

    fieldsTracked;


    connectedCallback(){
        console.log('LWCWireGetRecord '+this.recordId);
        
        this.fieldsTracked = this.fields;
    }

    @wire(getRecord, { recordId: '$recordId', fields : '$fieldsTracked', modes: ['Edit'] }) 
            wiredRecord({ error, data }) {

        console.log("LWC Get Record Wire");
        if (error){
            console.log(JSON.stringify(error));
        }
        else if (data) {
            //console.log(JSON.parse(JSON.stringify(data)));
            
            this.dispatchEvent( new CustomEvent(
                'wire', { 
                    detail : {
                        data: JSON.stringify(data)
                    }
                })
            );

        }
    }

}