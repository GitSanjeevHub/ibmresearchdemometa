{
    "objectName" : "Budget_Line_Item__c",
    "recordTypeName" : "I_RS_Collaborator_SubContractor",
    "columns": [
        {
            "fieldName": "I_RS_Category__c",
            "label": "Category",
            "type": "picklist",
            "visible": true,
            "canUpdate": true
        },
        {
            "fieldName": "I_RS_Description__c",
            "label": "Description/Justification",
            "type": "textArea",
            "required": false,
            "visible": true,
            "canUpdate": true
        },
        {
            "fieldName": "I_RS_In_Kind__c",
            "label": "In Kind",
            "type": "checkbox",
            "width": 80,
            "defaultValue": false,
            "required": false,
            "visible": true,
            "canUpdate": true
        },
        {
            "fieldName": "I_RS_Organisation__c",
            "label": "Funder",
            "type": "lookup",
            "lookupObjectName": "Account",
            "lookupObjectRelationship": "I_RS_Organisation__r",
            "lookupIconName": "standard:account",
            "defaultValueReference": "I_RS_Funding_Body_Id__c",
            "defaultTitleReference": "I_RS_Funding_Body__c",
            "lookupTitleField": "Name",
            "lookupSubtitleField": "Type__c",
            "lookupAdditionalFieldsToQuery": [
                "I_RS_Include_GST_In_Budgeting__c",
                "I_RS_Part_of_La_Trobe__c"
            ],
            "visible": true,
            "canUpdate": true
        },
        {
            "fieldName": "I_RS_Organisation_Being_Funded__c",
            "label": "Provided To",
            "type": "lookup",
            "lookupObjectName": "Account",
            "lookupObjectRelationship": "I_RS_Organisation_Being_Funded__r",
            "lookupIconName": "standard:account",
            "lookupTitleField": "Name",
            "lookupSubtitleField": "Type__c",
            "visible": true,
            "canUpdate": true
        },
        {
            "fieldName": "Year_1_Cost__c",
            "label": "Year 1 Cost",
            "type": "number",
            "defaultValue": 0,
            "min": 0,
            "step" : "0.01",
            "formatter": "currency",
            "columnExpansionLevel": 1,
            "canUpdate": true
        },
        {
            "fieldName": "Year_2_Cost__c",
            "label": "Year 2 Cost",
            "type": "number",
            "defaultValue": 0,
            "min": 0,
            "step" : "0.01",
            "formatter": "currency",
            "columnExpansionLevel": 2,
            "canUpdate": true
        },
        {
            "fieldName": "Year_3_Cost__c",
            "label": "Year 3 Cost",
            "type": "number",
            "defaultValue": 0,
            "min": 0,
            "step" : "0.01",
            "formatter": "currency",
            "columnExpansionLevel": 3,
            "canUpdate": true
        },
        {
            "fieldName": "Year_4_Cost__c",
            "label": "Year 4 Cost",
            "type": "number",
            "defaultValue": 0,
            "min": 0,
            "step" : "0.01",
            "formatter": "currency",
            "columnExpansionLevel": 4,
            "canUpdate": true
        },
        {
            "fieldName": "Year_5_Cost__c",
            "label": "Year 5 Cost",
            "type": "number",
            "defaultValue": 0,
            "step" : "0.01",
            "min": 0,
            "formatter": "currency",
            "columnExpansionLevel": 5,
            "canUpdate": true
        },
        {
            "fieldName": "Year_6_Cost__c",
            "label": "Year 6 Cost",
            "type": "number",
            "defaultValue": 0,
            "step" : "0.01",
            "min": 0,
            "formatter": "currency",
            "columnExpansionLevel": 6,
            "canUpdate": true
        },
        {
            "fieldName": "Year_7_Cost__c",
            "label": "Year 7 Cost",
            "type": "number",
            "defaultValue": 0,
            "min": 0,
            "step" : "0.01",
            "formatter": "currency",
            "columnExpansionLevel": 7,
            "canUpdate": true
        },
        {
            "fieldName": "I_RS_Amount__c",
            "label": "Total Cost",
            "type": "number",
            "defaultValue": 0,
            "step" : "0.01",
            "formatter": "currency",
            "visible": true,
            "canUpdate": false
        },
        {
            "fieldName": "I_RS_Cash_Amount_Inc_GST_Currency__c",
            "label": "Total Cost Inc. GST",
            "type": "number",
            "width": 160,
            "defaultValue": 0,
            "step" : "0.01",
            "formatter": "currency",
            "visible": true,
            "canUpdate": false
        }
    ],
    "automations": [
        {
            "name": "Get Total by adding columns",
            "type": "javascript",
            "runOn": [
                "change"
            ],
            "triggerFields": [
                "Year_1_Cost__c",
                "Year_2_Cost__c",
                "Year_3_Cost__c",
                "Year_4_Cost__c",
                "Year_5_Cost__c",
                "Year_6_Cost__c",
                "Year_7_Cost__c"
            ],
            "criteria": [],
            "assignments": [
                {
                    "destination": "row",
                    "cellIdentifierInRow": "I_RS_Amount__c",
                    "valueType": "sum",
                    "addends": [
                        {
                            "source": "row",
                            "fieldName": "Year_1_Cost__c"
                        },
                        {
                            "source": "row",
                            "fieldName": "Year_2_Cost__c"
                        },
                        {
                            "source": "row",
                            "fieldName": "Year_3_Cost__c"
                        },
                        {
                            "source": "row",
                            "fieldName": "Year_4_Cost__c"
                        },
                        {
                            "source": "row",
                            "fieldName": "Year_5_Cost__c"
                        },
                        {
                            "source": "row",
                            "fieldName": "Year_6_Cost__c"
                        },
                        {
                            "source": "row",
                            "fieldName": "Year_7_Cost__c"
                        }
                    ]
                }
            ]
        },
        {
            "name": "Get Total Including GST - Copy Default",
            "type": "javascript",
            "runOn": [
                "new",
                "change"
            ],
            "triggerFields": [
                "I_RS_Category__c",
                "I_RS_In_Kind__c",
                "I_RS_Organisation__c",
                "Unit_Price__c",
                "Year_1_Cost__c",
                "Year_2_Cost__c",
                "Year_3_Cost__c",
                "Year_4_Cost__c",
                "Year_5_Cost__c",
                "Year_6_Cost__c",
                "Year_7_Cost__c"
            ],
            "criteria": [],
            "assignments": [
                {
                    "destination": "row",
                    "cellIdentifierInRow": "I_RS_Cash_Amount_Inc_GST_Currency__c",
                    "valueType": "copy",
                    "source": "row",
                    "copyFrom": "I_RS_Amount__c"
                }
            ]
        },
        {
            "name": "Get Total Including GST - External Contributor",
            "type": "apex",
            "runOn": [
                "change",
                "recalculate"
            ],
            "methodName": "applyGST",
            "triggerFields": [
                "I_RS_Category__c",
                "I_RS_In_Kind__c",
                "I_RS_Organisation__c",
                "Unit_Price__c",
                "Year_1_Cost__c",
                "Year_2_Cost__c",
                "Year_3_Cost__c",
                "Year_4_Cost__c",
                "Year_5_Cost__c",
                "Year_6_Cost__c",
                "Year_7_Cost__c"
            ],
            "inputData" : "oneRow",
            "criteria": [
                {
                    "fieldName": "I_RS_In_Kind__c",
                    "operator": "!=",
                    "values": [
                        true
                    ]
                },
                {
                    "fieldName": "I_RS_Organisation__c",
                    "operator": "!=",
                    "values": [
                        null,
                        ""
                    ]
                },
                {
                    "fieldName": "I_RS_Organisation__r.I_RS_Include_GST_In_Budgeting__c",
                    "operator": "=",
                    "values": [
                        true
                    ]
                },
                {
                    "fieldName": "I_RS_Organisation__r.I_RS_Part_of_La_Trobe__c",
                    "operator": "!=",
                    "values": [
                        true
                    ]
                }
            ]
        },
        {
            "name": "Get Total Including GST - La Trobe Contributor",
            "type": "apex",
            "runOn": [
                "change"
            ],
            "methodName": "applyGST",
            "inputData" : "oneRow",
            "triggerFields": [
                "I_RS_Category__c",
                "I_RS_In_Kind__c",
                "I_RS_Organisation__c",
                "Unit_Price__c",
                "Year_1_Cost__c",
                "Year_2_Cost__c",
                "Year_3_Cost__c",
                "Year_4_Cost__c",
                "Year_5_Cost__c",
                "Year_6_Cost__c",
                "Year_7_Cost__c"
            ],
            "criteria": [
                {
                    "fieldName": "I_RS_Category__c",
                    "operator": "=",
                    "values": [
                        "Cash External"
                    ]
                },
                {
                    "fieldName": "I_RS_Organisation__r.I_RS_Part_of_La_Trobe__c",
                    "operator": "=",
                    "values": [
                        true
                    ]
                },
                {
                    "fieldName": "I_RS_In_Kind__c",
                    "operator": "=",
                    "values": [
                        false,
                        null
                    ]
                }
            ]
        }
    ],
    "lookupFieldNameToHostRecord": "I_RS_Budget__c",
    "hostRecordFields": [
        "Budget__c.Name",
        "Budget__c.I_RS_Year_1_Starts__c",
        "Budget__c.I_RS_Min_Years_To_Display_In_Calculator__c",
        "Budget__c.I_RS_Line_Item_Permission_Create__c",
        "Budget__c.I_RS_Line_Item_Permission_Save__c",
        "Budget__c.I_RS_Line_Item_Permission_Delete__c",
        "Budget__c.I_RS_Budget_Calculator_Label_UI_Locked__c",
        "Budget__c.I_RS_Funding_Body__c",
        "Budget__c.I_RS_Funding_Body_Id__c",
        "Budget__c.I_RS_Non_Salary_Overhead_Multiplier__c"
    ],
    "columnExpansionLevels": [
        {
            "source": "hostRecord",
            "fieldName": "I_RS_Min_Years_To_Display_In_Calculator__c"
        }
    ],

    "placeholderRowCount" : 1,

    "tableBodyHeight" : "35vh",

    "canCreate" : false,
    "canClone" : false,
    "canDelete" : false,
    "canSave" : false,

    "showSimpleWarningsAndErrors" : true,

    "allOrNothingUpserts" : false,

    "createAccessPermissionCriteria": [
        {
            "source": "hostRecord",
            "field": "I_RS_Line_Item_Permission_Create__c",
            "operator": "=",
            "values": [
                true
            ]
        }
    ],
    "cloneAccessPermissionCriteria": [
        {
            "source": "hostRecord",
            "field": "I_RS_Line_Item_Permission_Create__c",
            "operator": "=",
            "values": [
                true
            ]
        }
    ],
    "saveAccessPermissionCriteria": [
        {
            "source": "hostRecord",
            "field": "I_RS_Line_Item_Permission_Save__c",
            "operator": "=",
            "values": [
                true
            ]
        }
    ],
    "deleteAccessPermissionCriteria": [
        {
            "source": "hostRecord",
            "field": "I_RS_Line_Item_Permission_Delete__c",
            "operator": "=",
            "values": [
                true
            ]
        }
    ],
    "messageWhenLockedFromSaving": {
        "source": "hostRecord",
        "fieldName": "I_RS_Budget_Calculator_Label_UI_Locked__c"
    },
    "refreshPageOnSave" : true
}