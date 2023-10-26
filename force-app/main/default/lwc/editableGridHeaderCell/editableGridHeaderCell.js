import { LightningElement, api } from 'lwc';

export default class EditableGridHeaderCell extends LightningElement {

    @api title;
    @api fieldName;
    @api sortDirection = 'asc';
    @api helpText;

    handleClick(){

        this.sortDirection = (this.sortDirection === 'asc' ? 'desc' : 'asc');

        this.dispatchEvent(
            new CustomEvent(
                'headerclick', { 
                    detail : {
                        sortBy: this.fieldName,
                        sortDirection: this.sortDirection
                    }
            })
        );

    }

}