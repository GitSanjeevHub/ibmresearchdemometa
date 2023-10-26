function validateAtLeastOneCode(grid, automation) {

    grid.customLog("Started function validateAtLeastOneCode");
    let classificationMasterField = automation.params.classificationMasterFieldName;

    let errorMessage = 'Must specify at least one code';
    for (var i=0; i<grid.recordList.length; i++){
        if (grid.recordList[i][classificationMasterField]){
            grid.processPreSaveValidationRule(false, errorMessage);
            return;
        }
    }
    grid.processPreSaveValidationRule(true, errorMessage);
}

function validatePercentageTotal(grid, automation) {
    
    grid.customLog("Started function validatePercentageTotal");

    let percentageFieldName = automation.params.percentageFieldName;
    grid.customLog('percentage field name '+percentageFieldName);
    let totalPercentage = 0;
    let errorMessage = 'Total percentage must equal 100%';

    for (var i=0; i<grid.recordList.length; i++){
        let percentage = 1 * (grid.recordList[i][percentageFieldName]);
        grid.customLog(percentage);
        if (percentage){
            totalPercentage += percentage;
            grid.customLog(totalPercentage);
        }
    }
    grid.customLog(grid.preSaveValidationErrors);

    let isError = Math.round(totalPercentage) != 100;
    grid.processPreSaveValidationRule(isError, errorMessage);

};

function autoSetPrimary(grid, automation){

    grid.customLog("autoSetPrimary");

    let primaryField = automation.params.primaryFieldName;
    let percentageField = automation.params.percentageFieldName;
    
    let indexOfCurrentPrimary;
    let percentageOnPrimary;
    
    let indexOfRecordWithHighestPercentage = 0;
    let currentHighestPercentage = 0;
    
    let indexToMarkAsPrimary;

    grid.customLog('Checking records');
    for (var i=0; i<grid.recordList.length; i++){
        let currentRecord = grid.recordList[i];
    
        //Record Primary status if first instance, otherwise remove it on given record
        let isPrimary = currentRecord[primaryField];
        let currentRecordPercentage = 1 * currentRecord[percentageField];
    
        grid.customLog('isPrimary '+isPrimary);
        grid.customLog('currentRecordPercentage'+ currentRecordPercentage);
        
        if (isPrimary){
            
            let isFirstPrimary = indexOfCurrentPrimary == null;
            grid.customLog('isFirstPrimary '+isFirstPrimary);
            if (isFirstPrimary){
                indexOfCurrentPrimary = i;
                percentageOnPrimary = currentRecordPercentage;
            }
            else {
                currentRecord[primaryField] = false;
            }
            grid.customLog('currentRecord Primary: '+currentRecord[primaryField]);
        }
        
        //Maintain highest percentage across records
        
        if (currentRecordPercentage > currentHighestPercentage){
            indexOfRecordWithHighestPercentage = i;
            currentHighestPercentage = currentRecordPercentage;
        }
        grid.customLog('indexOfRecordWithHighestPercentage '+indexOfRecordWithHighestPercentage);
        grid.customLog('currentHighestPercentage '+currentHighestPercentage);

    }

    //Scenarios
    let primaryIsAlreadyHighest = percentageOnPrimary == currentHighestPercentage;
    if (primaryIsAlreadyHighest){
        indexToMarkAsPrimary = indexOfCurrentPrimary;
    }
    else {
        indexToMarkAsPrimary = indexOfRecordWithHighestPercentage;            
    }
    grid.customLog('indexToMarkAsPrimary '+indexToMarkAsPrimary);
    
    for (var j=0; j<grid.recordList.length; j++){
    
        let shouldThisRecordBePrimary = (j == indexToMarkAsPrimary);
        grid.customLog('setting primary of '+j+' to '+shouldThisRecordBePrimary);
        grid.writeField(j, primaryField, 'value', shouldThisRecordBePrimary);
        
    }

}

function validateNoDuplicates(grid, automation){

    grid.customLog("Started function validateNoDuplicates");

    let classificationMasterField = automation.params.classificationMasterFieldName;
    var errorMessage = 'Cannot reference the same code twice';

    let classificationMastersInList = [];
    for (var i=0; i<grid.recordList.length; i++){
        let classificationMaster = grid.recordList[i][classificationMasterField];
        
        if (classificationMaster) {
            if (classificationMastersInList.indexOf(classificationMaster) == -1){
                classificationMastersInList.push(classificationMaster);
            }
            else {
                grid.processPreSaveValidationRule(true, errorMessage);
                return; 
            }
        }

    }
    grid.processPreSaveValidationRule(false, errorMessage);

}

function validateOnlyOnePrimary(grid, automation){

    grid.customLog("Started function validateOnlyOnePrimary");

    let primaryFieldName = automation.params.primaryFieldName;
    let primaryCount = 0;
    var errorMessage = 'One Primary must be provided';
    
    for (var i=0; i<grid.recordList.length; i++){
        let record = grid.recordList[i];
        let primary = record[primaryFieldName];
        if (primary){
            primaryCount++;
        }
    }

    let isError = primaryCount != 1;
    grid.processPreSaveValidationRule(isError, errorMessage);
}

function validatePrimaryIsHighestPercentage(grid, automation){
    
    grid.customLog("validatePrimaryIsHighestPercentage");

    let primaryField = automation.params.primaryFieldName;
    let percentageField = automation.params.percentageFieldName;
    var errorMessage = 'Primary must have highest percentage';
   
    let primaryPercentage = 0;
    let currentHighestPercentage = 0;
    
    grid.customLog('Checking records');
    for (var i=0; i<grid.recordList.length; i++){
        let currentRecord = grid.recordList[i];
    
        //Record Primary status if first instance, otherwise remove it on given record
        let isPrimary = currentRecord[primaryField];
        let currentRecordPercentage = 1 * currentRecord[percentageField];
    
        if (isPrimary === true){
            primaryPercentage = currentRecordPercentage;
        }
        if (currentRecordPercentage > currentHighestPercentage) {
            currentHighestPercentage = currentRecordPercentage;
        }
        grid.customLog('currentHighestPercentage '+currentHighestPercentage);
        grid.customLog('primaryPercentage '+primaryPercentage);
        
    }
    let isError = (currentHighestPercentage > primaryPercentage) === true;
    grid.processPreSaveValidationRule(isError, errorMessage);
}

function removeEmptyRows(grid, automation){

    grid.customLog("starting removeEmptyRows");

    let fieldsToCheck = automation.params.fieldsToCheck;
    for (var i=0; i<grid.recordList.length;){
        console.log('i '+i);
        let record = grid.recordList[i];
        let canRemove = true;
        for (var j=0; j<fieldsToCheck.length; j++){

            let field = fieldsToCheck[j];
            console.log('field '+field);
            let value = record[field];
            console.log('value '+value);
            if (value){
                canRemove = false;
                break;
            }
        }
        if (canRemove){
            console.log('Removing...');
            grid.recordList.splice(i, 1);
            grid.gridData.splice(i, 1);
        }
        else {
            i++;
        }
    }
}


export {
    validateAtLeastOneCode,
    validatePercentageTotal, 
    autoSetPrimary, 
    validateNoDuplicates, 
    validateOnlyOnePrimary, 
    validatePrimaryIsHighestPercentage,
    removeEmptyRows
};