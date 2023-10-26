import { LightningElement, wire, api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';


export default class LwcWireGetObjectInfo extends LightningElement {

    @api objectName;


    @wire(getObjectInfo, { objectApiName: '$objectName' }) wiredMetadataInfo({ error, data}){
        console.log('getObjectInfo');
        if (data){
            console.log('wire successful');
            console.log(data);
            
            this.dispatchEvent( new CustomEvent(
                'wire', { 
                    detail : {
                        data: JSON.stringify(data)
                    }
                })
            );
        }
        if (error){
            console.log(JSON.stringify(error));
        }
    }

}