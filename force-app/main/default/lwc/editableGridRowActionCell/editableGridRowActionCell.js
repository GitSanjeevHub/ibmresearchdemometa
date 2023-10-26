import { LightningElement, api, track } from 'lwc';

export default class EditableGridRowActionCell extends LightningElement {

    @api index;

    @api canClone;
    @api canDelete;

    @api showDeleteConfirmation;


    handleClone(){
        this.dispatchEvent(new CustomEvent(
            'clone', { 
                detail : {
                    index: this.index
                }
            })
        );
    }


    promptForDelete(){
        console.log('promptForDelete');
        this.dispatchEvent(new CustomEvent(
            'toggledeleteprompt', { 
                detail : {
                    index: this.index,
                    togglePreference: true
                }
            })
        );
    }
    cancelDelete(){
        this.dispatchEvent(new CustomEvent(
            'toggledeleteprompt', { 
                detail : {
                    index: this.index,
                    togglePreference: false
                }
            })
        );
    }

    handleDelete(){
        this.dispatchEvent(new CustomEvent(
            'delete', { 
                detail : {
                    index: this.index
                }
            })
        );
        
    }



}