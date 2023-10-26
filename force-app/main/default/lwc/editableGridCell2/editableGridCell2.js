import { LightningElement, api, track } from 'lwc';
import search from '@salesforce/apex/BudgetCalculatorAura.search';


export default class EditableGridCell extends LightningElement {

    cellRendered = false;

    @api index;
    @api isNewRecord;

    @api fieldName;
    @api type;
    @api required = false;

    @track valueTracked;
    
    get value(){
        return this.valueTracked;
    }
    @api
    set value(newValue){
        //console.log('new value '+newValue);
        //console.log('old value'+this.valueTracked);

        if (newValue !== this.valueTracked){
            this.valueTracked = newValue;

            if (this.cellRendered === true){
                this.setNonStandardInputComponent();
            }
        }
    }

    @api set canUpdate(value){
        this.editDisabled = !value;
    }
    get canUpdate(){
        return !this.editDisabled;
    }

    @track editDisabled;

    @track isStandardInputField;
    @track isTextAreaField;
    @track isCheckboxField;
    @track isPicklistField;
    @track isLookupField;
    @track isJavascriptFormulaField;
    @api javascriptFormulaParams = [];

    @api min;
    @api max;
    @api step;

    @api picklistValues;

    @api lookupObjectName;
    @api lookupIconName;

    @api lookupBaselineFilter;
    @api lookupTitleField;
    @api lookupTitle;
    @api lookupSubtitleField;
    @api lookupSubtitle
    @api lookupAdditionalFieldsToQuery;

    @track lookupSelection;

    @api warningMessageConditions;
    
    //@api isValid = false;

    connectedCallback(){
        //console.log('connectedCallback');
        //console.log(this.valueTracked);

        this.renderFieldBasedOnType();

        if (this.isLookupField){
            this.setLookupComponent();
        }
    }

    renderedCallback(){
        
        if (this.type === 'picklist'){
            this.setPicklistComponent();
        }

        if (this.type == 'textArea'){
            if (this.valueTracked){
                let textArea = this.template.querySelector('textarea');
                textArea.style.height = textArea.scrollHeight+'px';
            }
        }

        this.cellRendered = true;
    }


    setNonStandardInputComponent(){

        //console.log('setNonStandardInputComponent');

        if (this.isLookupField){
            this.setLookupComponent();
        }

        if (this.isPicklistField){
            this.setPicklistComponent();
        }


    }

    setPicklistComponent(){
        //console.log('set picklist component - '+this.fieldName);
        //console.log('');
        //console.log('Edit Disabled '+this.editDisabled);

        let selectField = this.template.querySelector('select');
        if (selectField)
            selectField.value = this.valueTracked;

        if (this.picklistValues.length === 1 || this.editDisabled){
            selectField.disabled = true;
        }
        else {
            selectField.disabled = false;
        }
    }


    setLookupComponent(){

        if (this.valueTracked){

            this.lookupSelection = [
                {
                    id: this.valueTracked,
                    sObjectType: this.lookupObjectName,
                    icon: this.lookupIconName,
                    title: this.lookupTitle,
                    subtitle: this.lookupSubtitle,
                }
            ];
        }
        else 
            this.lookupSelection = [];
        
    }


    renderFieldBasedOnType(){

        if (this.fieldName) {

            if (this.type === 'text' ||
                        this.type === 'number' ||
                        this.type === 'currency' ||
                        this.type === 'date'
                        )
                this.isStandardInputField = true;

            else if (this.type === 'textArea'){
                this.isTextAreaField = true;
            }

            else if (this.type === 'checkbox')
                this.isCheckboxField = true;
            
            else if (this.type === 'lookup'){
                this.isLookupField = true;
            }
                    
            else if (this.type === 'picklist'){
                this.isPicklistField = true;
            }
            
            else 
                console.log('Unsupported field!');
            

        }

    }


    autoSizeTextArea(){

        let textArea = this.template.querySelector('textarea');
        if (textArea.value.length > 0){
            let scrollHeight = textArea.scrollHeight + 'px';
            textArea.style.height = scrollHeight;
        }
        else {
            textArea.style.height = '35px';
        }

    }


    handleChange(event){
        
        
        let newValue = this.extractChangeValueBasedOnFieldType(event);
        console.log('handleChange '+this.fieldName+newValue);

        if (newValue !== this.valueTracked){

            if (this.isStandardInputField){
                console.log('reportValidity');
                this.template.querySelector('lightning-input').reportValidity();
                console.log('reportValidity done');
            }

            let payload = {
                index: this.index,
                fieldName: this.fieldName,
                type: this.type,
                newValue : newValue
            }

            if (this.type === 'lookup'){
                if (this.lookupSelection.length > 0)
                    payload.lookupData = this.lookupSelection[0];
                else 
                    payload.lookupData = null;
            }

            console.log(JSON.parse(JSON.stringify(payload)));
            
            const selectedEvent = new CustomEvent(
                'fieldchange', { 
                    detail : {
                        data: JSON.stringify(payload)
                    }
                });

            // Dispatches the event.
            this.dispatchEvent(selectedEvent);
            console.log('event dispatched');

        }

    }




    extractChangeValueBasedOnFieldType(event){

        if (this.isStandardInputField || 
                this.isPicklistField ||
                this.isTextAreaField){

            let value = event.target.value;
            //console.log(value);

            if (this.type === 'number' && value === '')
                return 0;
            

            return value;

        }

        else if (this.isCheckboxField)
            return event.target.checked;

        else if (this.isLookupField) {

            let selection = JSON.parse(event.detail.selection);
            //console.log(selection);
            this.lookupSelection = selection;

            if (event.target.getSelection().length > 0)
                return event.target.getSelection()[0].id;
            else 
                return '';
        }

        alert('Unsupported field');
        return null;

    }



    /*@api validate(){

        let ltnInputComponent = this.template.querySelector('lightning-input');
        var isValid;
        //let warningMessages = this.checkForWarnings();

        if (ltnInputComponent){
            ltnInputComponent.reportValidity();
            isValid = ltnInputComponent.checkValidity();
        }
        
        let ltnTextAreaComponent = this.template.querySelector('lightning-textarea');
        if (ltnTextAreaComponent){
            ltnTextAreaComponent.reportValidity();
            isValid = ltnTextAreaComponent.checkValidity();

        }

        let validationResults = {
            'isValid' : isValid//,
            //'warningMessages' : warningMessages
        };
        ////console.log(validationResults);
        return JSON.stringify(validationResults);

    }*/


    /*@api checkForWarnings(){

        ////console.log('checkForWarnings');
        ////console.log(this.fieldName);
        
        var warningMessages = [];

        if (this.warningMessageConditions){
            for (var i=0; i<this.warningMessageConditions.length; i++){
                
                let condition = this.warningMessageConditions[i];
                ////console.log(this.value);
                ////console.log(condition.operator);
                ////console.log(condition.value);

                switch(condition.operator){

                    case '=' :
                        if (this.value === condition.value)
                            warningMessages.push(condition.message);
                        break;

                    //Stub for more conditions...

                    default:
                        break;
                }

            }

            //console.log(warningMessages);
            return warningMessages;
        }

    }*/


    handleSearch(event) {
        
        //console.log('handleSearch');
        const target = event.target;

        let params = event.detail;

        params.filters = this.lookupBaselineFilter;
        params.additionalFieldsToQuery = this.lookupAdditionalFieldsToQuery;
        params.titleField = this.lookupTitleField;
        params.subtitleField = this.lookupSubtitleField;
        params.iconName = this.lookupIconName;

        console.log(JSON.parse(JSON.stringify(params)));

        search(params)
            .then(results => {
                console.log(JSON.parse(JSON.stringify(results)));
                target.setSearchResults(results);
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }


}