({

    doInit : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        if (recordId == null){

            recordId=decodeURIComponent
                ((new RegExp('[?|&]c__recordId=' + '([^&;]+?)(&|#|;|$)').
                    exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
            console.log('Param recordId from URL = ' + recordId);
            component.set("v.recordId", recordId);
        }

        var configFile = component.get("v.configFile");
        if (configFile == null){
            configFile=decodeURIComponent
            ((new RegExp('[?|&]c__configFile=' + '([^&;]+?)(&|#|;|$)').
                exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
                console.log('Param configFile from URL = ' + configFile);
                component.set("v.configFile", configFile);
        }

        //Load static resource
        var path = $A.get("$Resource."+component.get("v.configFile"));
        var req = new XMLHttpRequest();
        req.open("GET", path);
        req.addEventListener("load", $A.getCallback(function() {
            let config = JSON.parse(req.response);
            console.log(config);
            component.set("v.config", config);

            component.set("v.objectName", config.objectName);
            component.set("v.recordTypeName", config.recordTypeName);
        }));
        req.send(null);

    },

    /*recalculateRecords : function(component, event, helper){
        console.log("EditableGridWrapperAura - recalculate records");
        component.find("grid").recalcaluateRecords();
    },*/

    refreshRecordsFromServer : function(component, event, helper){
        if (component.get("v.acceptRefreshRecordAppEvents")){
            console.log("EditableGridWrapperAura - refreshRecords from server");
            let grid = component.find("grid");
            if (grid){
                grid.refreshRecordsFromServer();
            }
        }
    },

    handleSuccessfulSave : function(component, event, helper) {
        console.log('aura - handle successful save');

        if (component.get("v.config").refreshPageOnSave){
            console.log('aura:refreshRecordDetails');
            helper.refreshLightningPage(component);
            
            var cmpEvent = component.getEvent("successfulSave");
            cmpEvent.setParams({
                "recordTypeName" : component.get("v.recordTypeName") });
            cmpEvent.fire();

        }

	},

})