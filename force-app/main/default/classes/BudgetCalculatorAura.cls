public with sharing class BudgetCalculatorAura {
    
    @AuraEnabled(Cacheable=true)
    public static List<LookupSearchResult> search(
        String objectName,
        String searchTerm,
        String titleField,
        String subtitleField,
        List<String> additionalFieldsToQuery,
        String filters,
        String iconName
        ) {        
       
        
        List<LookupSearchResult> searchResultsWrapper = new List<LookupSearchResult>();
        
        List<String> fields = new List<String>{'Id', titleField};
        if (subtitleField != null)
            fields.add(subtitleField);
        if (additionalFieldsToQuery != null)
            fields.addAll(additionalFieldsToQuery);

        String searchFilter;
		if (searchTerm instanceOf Id){
            searchFilter = '(Id = \''+searchTerm+'\')';
        }
        else {
            searchFilter = '('+titleField+' LIKE \'%'+searchTerm+'%\''; 
            if (subtitleField != null){
            	searchFilter += ' OR ' + subtitleField + ' LIKE \''+'%'+searchTerm+'%\'';
            }
            searchFilter += ')';
            
        }

        if (filters != null)
            searchFilter += ' AND ('+filters+')';
        
        //Changed the search result capping to 15 from 5 [T2-1097]
        List<SObject> searchResults = DataAccess.getSObjectListSOQL(
            fields,
            null, 
            objectName, 
            searchFilter,
            'Name',
            'ASC',
            15,
            0
        );
      
        
        for (SObject record : searchResults){
            
            String subtitleValue = (subtitleField != null ? (String) record.get(subtitleField) : '');
            
            LookupSearchResult searchResultWrapper = new LookupSearchResult(
                (String) record.get('Id'), 
                objectName, 
                iconName, 
                (String) record.get(titleField), 
                subtitleValue,
                record
            );
            System.debug(searchResultWrapper);
            
            searchResultsWrapper.add(searchResultWrapper);
            
        }
        
        System.debug(searchResultsWrapper);
        
        return searchResultsWrapper;
        
    }


    
    
    //Disabling for sake of deployment
    
   @AuraEnabled
    public static Budget_Line_Item__c calculateSalaries(Budget_Line_Item__c budgetLineItem){
        
        
        List<Map<String, String>> yearColumnBundles = new List<Map<String, String>>{
            new Map<String, String>{
                'quantityField' => 'Year_1_Quantity__c',
                'baseSalaryField' => 'I_RS_Year_1_Base_Salary__c',
                'costField' => 'Year_1_Cost__c'
            },
            new Map<String, String>{
                'quantityField' => 'Year_2_Quantity__c',
                'baseSalaryField' => 'I_RS_Year_2_Base_Salary__c',
                'costField' => 'Year_2_Cost__c'
            },
            new Map<String, String>{
                'quantityField' => 'Year_3_Quantity__c',
                'baseSalaryField' => 'I_RS_Year_3_Base_Salary__c',
                'costField' => 'Year_3_Cost__c'
            },
            new Map<String, String>{
                'quantityField' => 'Year_4_Quantity__c',
                'baseSalaryField' => 'I_RS_Year_4_Base_Salary__c',
                'costField' => 'Year_4_Cost__c'
            },
            new Map<String, String>{
                'quantityField' => 'Year_5_Quantity__c',
                'baseSalaryField' => 'I_RS_Year_5_Base_Salary__c',
                'costField' => 'Year_5_Cost__c'
            },
            new Map<String, String>{
                'quantityField' => 'Year_6_Quantity__c',
                'baseSalaryField' => 'I_RS_Year_6_Base_Salary__c',
                'costField' => 'Year_6_Cost__c'
            },
            new Map<String, String>{
                'quantityField' => 'Year_7_Quantity__c',
                'baseSalaryField' => 'I_RS_Year_7_Base_Salary__c',
                'costField' => 'Year_7_Cost__c'
            }
        };
 
        Budget_Line_Item__c budgetLineItemOutput = newEmptyBudgetLineItem(yearColumnBundles);
        
            
        //Key fields
        Id budgetId = budgetLineItem.Budget__c;
        
        Budget__c budget = [SELECT Id,  Actual_Overhead__c,
                            Actual_Profit__c FROM Budget__c WHERE Id = :budgetId]; //SOQL by budgetId
        Integer calendarYear = (Integer) budget.I_RS_Year_1_Starts__c;
        Integer projectDuration = (Integer) budget.Project_Proposal__r.I_RS_Project_Duration_In_Years__c; //formula on budget
    
        
        // Fetching custom setting to check if there are any shortfalls
        On_Cost_Default_Values__c latrobeDefaultOnCost = [SELECT Id, Name, Maximum_Allowed_On_Cost__c FROM On_Cost_Default_Values__c WHERE Name = 'La Trobe University'];
        
        
        String salaryGrade;
        String salaryGradeGroup;
        Integer salaryGradeLevelNumber;
        String maxYear;
        Decimal maxLevel;
        
        Salary_Table__c salaryTable = getInitialSalaryTable(budgetLineItem);

        if (salaryTable != null){

            salaryGrade = salaryTable.Name;
            salaryGradeGroup = salaryTable.Salary_Grade_Group__c;
            if(salaryTable.Salary_Grade_Group_Number__c != null)
            {
                salaryGradeLevelNumber = (Integer) salaryTable.Salary_Grade_Group_Number__c;
            }
            else
            {
                salaryGradeLevelNumber = 0;
            }
            system.debug('salaryGrade>>>' + salaryGrade);
            system.debug('salaryGradeGroup' + salaryGradeGroup);
            system.debug('salaryGradeLevelNumber' + salaryGradeLevelNumber);
            
            
            Account lineItemFundingBody = [SELECT Id, Maximum_Allowed_On_Cost__c, Part_of_My_Uni__c FROM Account WHERE Id = :budgetLineItem.Organisation__c]; //SOQL by orgId
            
            String payGradeGroupSOQLKeyword = salaryGradeGroup + '%';
            system.debug('payGradeGroupSOQLKeyword>>>' + payGradeGroupSOQLKeyword);
            
            List<Salary_Table__c> salaryTableList = [SELECT Id, Name,Salary__c, Year__c, 
                Salary_Grade_Group__c, Salary_Grade_Group_Number__c 
                FROM Salary_Table__c WHERE Name LIKE :payGradeGroupSOQLKeyword AND 
                Year__c >= :string.valueOf(calendarYear)]; //SOQL by pay grade group (e.g. 'Level B');
            system.debug('salaryTableList>>>' + salaryTableList);
            
            AggregateResult aggr = [SELECT MAX(Year__c)maxYear, 
            MAX(Salary_Grade_Group_Number__c)maxLevel,Salary_Grade_Group__c 
            FROM Salary_Table__c Where Salary_Grade_Group__c = :salaryGradeGroup  group by Salary_Grade_Group__c];
            if(salaryGradeLevelNumber > 0)
            {
                maxLevel = (Decimal) aggr.get('maxLevel');
            }
            else
            {
                maxLevel = 7;
            }
            maxYear = (String) aggr.get('maxYear');
            system.debug('maxLevel>>>' + maxLevel);
            system.debug('maxYear>>>' + maxYear);
            
            Map<String, Salary_Table__c> salaryTableMap = constructSalaryTableMap(salaryTableList);
            
            
            for (Integer yearArrayIndex=0; yearArrayIndex<projectDuration && yearArrayIndex < 7; yearArrayIndex++)
            { 
                System.debug('>>>yearArrayIndex '+yearArrayIndex);
                system.debug('calendarYear>>>>' + calendarYear);
                system.debug('salaryGradeLevelNumber+++' + salaryGradeLevelNumber);
                
                Decimal yearSalaryCostOutput = 0;

                Map<String, String> yearColumnBundle = yearColumnBundles.get(yearArrayIndex);
                system.debug('yearColumnBundle>>>' + yearColumnBundle);

                String baseSalaryField = yearColumnBundle.get('baseSalaryField');
                String quantityField = yearColumnBundle.get('quantityField');
                String costField = yearColumnBundle.get('costField');

                Salary_Table__c salaryRecordToCalculate = salaryTableMap.get(
                    salaryGradeGroup +'|'+ salaryGradeLevelNumber + '|' + string.valueOf(calendarYear)
                );
                system.debug('salaryRecordToCalculate>>>>' + salaryRecordToCalculate);
                if(salaryRecordToCalculate != null)
                {
                    //Init year cost field
                    yearSalaryCostOutput = salaryRecordToCalculate.Salary__c;

                    //Set base salary field and apply multipliers
                    Decimal baseSalary = salaryRecordToCalculate.Salary__c;
                    baseSalary = applyQuantityAndUnitOfTime(baseSalary, budgetLineItem, quantityField);
                    budgetLineItemOutput.put(baseSalaryField, baseSalary);

                    Boolean applyAdditionalRates = budgetLineItem.Category__c != 'Student' && budgetLineItem.Category__c != 'Non-La Trobe researcher';
                    if(applyAdditionalRates)
                    {
                        
                        if (!budgetLineItem.In_Kind__c){
                            Decimal shortFall = getShortFall(baseSalary, 
                                latrobeDefaultOnCost.Maximum_Allowed_On_Cost__c, 
                                lineItemFundingBody.Maximum_Allowed_On_Cost__c
                                ).setScale(2);
                            System.debug('shortfall for year '+shortFall);
                            
                            budgetLineItemOutput.Shortfall__c += shortFall;
                        }
                            
                        Decimal maxAllowedOncost = lineItemFundingBody.Maximum_Allowed_On_Cost__c;
                        system.debug('maxAllowedOncost>>>' + maxAllowedOncost);
                        yearSalaryCostOutput = applyMaxOnCost(yearSalaryCostOutput, maxAllowedOncost);
                        System.debug('yearSalaryCostOutputAfterApplyingOnCost>>>'+yearSalaryCostOutput);

                        //Apply profit and overhead for external and in cash salary items
                        Boolean externalCashSalaryItem = !lineItemFundingBody.Part_of_My_Uni__c && !budgetLineItem.In_Kind__c;
                        if(externalCashSalaryItem)
                        {
                            Decimal overhead = budget.Actual_Overhead__c;
                            Decimal profit = budget.Actual_Profit__c;
                          

                            yearSalaryCostOutput = applyProfitAndOverHead(yearSalaryCostOutput, profit, overhead);
                        

                        }
                    }
                    
                    yearSalaryCostOutput = applyQuantityAndUnitOfTime(yearSalaryCostOutput, budgetLineItem, quantityField);
                   

                    //Round to 2 decimal places
                    yearSalaryCostOutput = yearSalaryCostOutput.setScale(2);


                    budgetLineItemOutput.put(costField, yearSalaryCostOutput);
                    budgetLineItemOutput.Amount__c += yearSalaryCostOutput;

                    //writeField(yearColumnBundle, budgetLineItem, budgetLineItemOutput, yearSalaryCostOutputByUnitOfTime);


                    
                    calendarYear++;
                    if(salaryGradeLevelNumber > 0)
                    {
                        salaryGradeLevelNumber++;
                    }
                }
                //No Salary record found when moving up...
                else if(salaryRecordToCalculate == null )
                {
                    //Salary grade level (number) is too high but 

                    if(salaryGradeLevelNumber > maxLevel && calendarYear<= integer.valueOf(maxYear))
                    {
                        salaryGradeLevelNumber -= 1; 
                        yearArrayIndex -= 1;
                    }
                    else if(salaryGradeLevelNumber <= maxLevel && calendarYear > integer.valueOf(maxYear))
                    {
                        system.debug('Terminate 1');
                        // terminate
                    }
                    else if(salaryGradeLevelNumber > maxLevel && calendarYear > integer.valueOf(maxYear))
                    {
                        system.debug('Terminate 2');
                        // terminate
                    }
                    
                } 
                
            }  
            
        }

      
        //Return line item. DO NOT SAVE IT TO DATABASE - this will happen on lwc component
        return budgetLineItemOutput;
        
    }  



    static Budget_Line_Item__c newEmptyBudgetLineItem(List<Map<String, String>> yearColumnBundles){

        Budget_Line_Item__c newEmptyBudgetLineItem = new Budget_Line_Item__c(
            
            Amount__c = 0,
            Year_1_Base_Salary__c = 0,
            Year_2_Base_Salary__c = 0,
            Year_3_Base_Salary__c = 0,
            Year_4_Base_Salary__c = 0,
            Year_5_Base_Salary__c = 0,
            Year_6_Base_Salary__c = 0,
            Year_7_Base_Salary__c = 0,
            Year_1_Cost__c = 0,
            Year_2_Cost__c = 0,
            Year_3_Cost__c = 0,
            Year_4_Cost__c = 0,
            Year_5_Cost__c = 0,
            Year_6_Cost__c = 0,
            Year_7_Cost__c = 0,
            Shortfall__c = 0
        );
        for (Map<String, String> yearNumberField : yearColumnBundles){
            String fieldName = yearNumberField.get('costField');
            newEmptyBudgetLineItem.put(fieldName, 0);
        }
        System.debug('>>>New Budget Line Item: '+newEmptyBudgetLineItem);
        return newEmptyBudgetLineItem;

    }


    static Salary_Table__c getInitialSalaryTable(Budget_Line_Item__c budgetLineItem){

      
        Salary_Table__c initialSalaryTable;
        Boolean searchByCodeOnBudget = budgetLineItem.Sub_Category__c != null && budgetLineItem.Sub_Category__c != 'Not Applicable';
        Boolean searchByCodeOnContact = !searchByCodeOnBudget;

        if (searchByCodeOnBudget){

            initialSalaryTable = 
                [select 
                Name, Salary_Grade_Group__c, Salary_Grade_Group_Number__c, Salary__c 
                from Salary_Table__c where Name = :budgetLineItem.Sub_Category__c LIMIT 1][0];
        }
        else if (searchByCodeOnContact)
        {
         
            if (budgetLineItem.Contact__c != null && (String) budgetLineItem.Contact__c != ''){
                Contact contact = [SELECT Id, Salary_Grade__c FROM Contact WHERE Id = :budgetLineItem.Contact__c]; 
                if (contact.Salary_Grade__c != null){
                initialSalaryTable = 
                    [
                        select 
                        Name, Salary_Grade_Group__c, Salary_Grade_Group_Number__c, Salary__c 
                        from Salary_Table__c WHERE
                        HR_System_Group_ID__c = :contact.Salary_Grade__c LIMIT 1][0];
                }
            }
        }

       
        return initialSalaryTable;

    }


    static Map<String, Salary_Table__c> constructSalaryTableMap(List<Salary_Table__c> salaryTableList){

      

        Map<String, Salary_Table__c> salaryTableMap = new Map<String, Salary_Table__c>(); 

        for(Salary_Table__c salary : salaryTableList)
        {
            if(salary.Salary_Grade_Group_Number__c != null)
            {
                salaryTableMap.put(salary.Salary_Grade_Group__c + '|' + salary.Salary_Grade_Group_Number__c + '|' + salary.Year__c, salary); 
            }
            else
            {
                salaryTableMap.put(salary.Salary_Grade_Group__c + '|' + 0 + '|' + salary.Year__c, salary); 
            }
            
        }
    
        return salaryTableMap;
    }


    static Decimal getShortFall(Decimal baseSalary, Decimal benchmarkOnCost, Decimal onCostToSubtract){

        Decimal shortFall = (((baseSalary * benchmarkOnCost)/100) - ((baseSalary * onCostToSubtract)/100));
      

        if (shortFall != null)
            return shortFall;
        else 
            return 0;

    }

    static Decimal applyMaxOnCost(Decimal inputSalaryAmount, Decimal maxAllowedOncost){
        
  
        Decimal maxOnCost = (inputSalaryAmount + (inputSalaryAmount * maxAllowedOncost)/100);
       
        return maxOnCost;
    }


    static Decimal applyProfitAndOverHead(Decimal inputSalaryAmount, Decimal profit, Decimal overhead){

   

        if (profit == null)
            profit = 0;
        if (overhead == null)
            overhead = 0;
        
        Decimal totalAdd = profit + overhead;
     
        Decimal outputSalaryAmount = inputSalaryAmount + (inputSalaryAmount * totalAdd)/100;
      
        return outputSalaryAmount;

    }


    static Decimal applyQuantityAndUnitOfTime(Decimal yearlyAmount, Budget_Line_Item__c budgetLineItem, String quantityField){

        Decimal output = yearlyAmount;

        Decimal quantity = (Decimal) budgetLineItem.get(quantityField);
        output = applyQuantity(output, quantity);

        output = applyUnitOfTime(output, budgetLineItem.Unit_of_Time__c);

        return output;

    }


    static Decimal applyUnitOfTime(Decimal yearSalaryCostOutput, String unitOfTime){

        switch on unitOfTime {
            when 'Years' {
                return yearSalaryCostOutput;
            }
            when 'Months'{
                return yearSalaryCostOutput/12.0;
            }
            when 'Weeks'{
                return yearSalaryCostOutput/52.0;
            }
            when 'Days'{
                return yearSalaryCostOutput/260.0;
            }
            when 'Hours'{
                return yearSalaryCostOutput/1820.0;
            }
        }
        return null;
    }
    
    static Decimal applyQuantity(Decimal inputSalaryAmount, Decimal quantity){

        if (quantity == null)
            return 0;
        else 
            return inputSalaryAmount * quantity;

    }


    public static Budget_Line_Item__c getTotalIncludingGST(Budget_Line_Item__c budgetLineItemInput){

       

        Budget_Line_Item__c budgetLineItemOutput = new Budget_Line_Item__c();
        GST__c gstSetting = GST__c.getOrgDefaults();
        Decimal gstRate = gstSetting.Current_Rate__c;

        Decimal totalIncludingGST = 
            budgetLineItemInput.Amount__c + 
            ((budgetLineItemInput.Amount__c / 100) * gstRate);

        budgetLineItemOutput.Cash_Amount_Inc_GST_Currency__c = totalIncludingGST;

      

        return budgetLineItemOutput;
    
        
}
}