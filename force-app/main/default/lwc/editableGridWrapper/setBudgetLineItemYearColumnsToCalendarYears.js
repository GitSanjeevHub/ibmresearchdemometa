export default function setBudgetLineItemYearColumnsToCalendarYears(columns, startingYear){

    //console.log('setBudgetLineItemYearColumnsToCalendarYears '+startingYear);

    //console.log(JSON.parse(JSON.stringify(columns)));

    let yearColumnBundles = [
        [
            {
                fieldName: 'Year_1_Quantity__c',
                suffixWord: 'Units'
            }, 
            {
                fieldName: 'Year_1_Cost__c',
                suffixWord: 'Cost'
            }
        ],
        [
            {
                fieldName: 'Year_2_Quantity__c',
                suffixWord: 'Units'
            }, 
            {
                fieldName: 'Year_2_Cost__c',
                suffixWord: 'Cost'
            }
        ],
        [
            {
                fieldName: 'Year_3_Quantity__c',
                suffixWord: 'Units'
            }, 
            {
                fieldName: 'Year_3_Cost__c',
                suffixWord: 'Cost'
            }
        ],
        [
            {
                fieldName: 'Year_4_Quantity__c',
                suffixWord: 'Units'
            }, 
            {
                fieldName: 'Year_4_Cost__c',
                suffixWord: 'Cost'
            }
        ],
        [
            {
                fieldName: 'Year_5_Quantity__c',
                suffixWord: 'Units'
            }, 
            {
                fieldName: 'Year_5_Cost__c',
                suffixWord: 'Cost'
            }
        ],
        [
            {
                fieldName: 'Year_6_Quantity__c',
                suffixWord: 'Units'
            }, 
            {
                fieldName: 'Year_6_Cost__c',
                suffixWord: 'Cost'
            }
        ],
        [
            {
                fieldName: 'Year_7_Quantity__c',
                suffixWord: 'Units'
            }, 
            {
                fieldName: 'Year_7_Cost__c',
                suffixWord: 'Cost'
            }
        ]
    ];

    for (var yearIndex=0; yearIndex<yearColumnBundles.length; yearIndex++){

        let yearColumnBundle = yearColumnBundles[yearIndex];
        let yearToPrepend = startingYear + yearIndex;

        //console.log(yearToPrepend);

        for (var j=0; j<yearColumnBundle.length; j++){
            let yearColumnFieldName = yearColumnBundle[j].fieldName;
            //console.log(yearColumnFieldName);

            let column = getMatchingColumn(columns, yearColumnFieldName);
            
            if (column){
                column.label = yearToPrepend + ' ' + yearColumnBundle[j].suffixWord;
                //console.log(column.label);
            }

        }

    }

}

function getMatchingColumn(columns, fieldName){
    for (var i=0; i<columns.length; i++){
        let column = columns[i];
        if (column.fieldName === fieldName)
            return column;
    }
    return null;
}