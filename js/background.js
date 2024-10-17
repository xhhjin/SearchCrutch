importScripts('./base.js')

/* global insertCustomArray GetHost inHostArray GetUrlParms searchhost_array searchselect_array search_array isEmpty search_custom_num dataBackup dataRecover */
function checkForValidUrl(tabId, changeInfo, tab) {
    if( !changeInfo.status )
        return;
    //if( 'loading' != changeInfo.status )
    //	return;
    browser.storage.local.get(null, function(result) {
        if( "chrome://newtab/" == tab.url ) {
            browser.pageAction.show(tabId);
            return;
        }
        if( -1 < tab.url.substr(7,25).indexOf("www.google.com/reader") ) {
            browser.pageAction.setPopup({popup:"",tabId: tabId});
            browser.pageAction.setIcon({path:"img/icon-38-b.png",tabId: tabId});
            browser.pageAction.setTitle({title:"一键切换HTTP/HTTPS",tabId: tabId});
            browser.pageAction.show(tabId);
            return;
        }
        insertCustomArray();
        var host = GetHost( tab.url );
        var i_host = inHostArray(host);
        if( -1 < i_host ) {
            //for direct visit from google refer url
            if( (1==searchhost_array[i_host][1] || 0 == searchhost_array[i_host][1] ) && ( 10 < tab.url.indexOf("url?") || 10 < tab.url.indexOf("imgres?") ) ) {
                browser.pageAction.setPopup({popup:"",tabId: tabId});
                browser.pageAction.setIcon({path:"img/icon-38-g.png",tabId: tabId});
                browser.pageAction.setTitle({title:"直接访问所在网页",tabId: tabId});
                browser.pageAction.show(tabId);
                return;
            }
            if( "checked" == result["cb_switch"] ) {
                browser.pageAction.setPopup({popup: "", tabId: tab.id});
                browser.pageAction.setTitle({title:"点击切换搜索引擎",tabId: tabId});
                browser.pageAction.show(tabId);
                return;
            }
            browser.pageAction.show(tabId);
            return;
        }
    });
}

// Listen for any changes to the URL of any tab.
browser.tabs.onUpdated.addListener(checkForValidUrl);
 
function ActionClick(tab) {
    browser.storage.local.get(null, function(result) {
        if( -1 < tab.url.substr(7,25).indexOf("www.google.com/reader") ) {
            var oldurl = tab.url;
            var newurl = oldurl;
            if( "http" == oldurl.substr(0,4) ) {
                if( "https" == oldurl.substr(0,5) )
                    newurl = "http"+ oldurl.substr(5);
                else
                    newurl = "https"+ oldurl.substr(4);
            }
            browser.tabs.update( tab.id, {url:newurl}, function(){});
        } else if( "checked" == result["cb_switch"] ) {
            browser.pageAction.setIcon({path:"img/icon-38-b.png",tabId: tab.id});
            var index = 0;
            insertCustomArray();
            var host = GetHost(tab.url);
            var i_host = inHostArray(host) ;
            index = searchhost_array[i_host][1];
            for( var i=0; i<search_array.length; i++ ) {
                index++;
                if( index >= search_array.length )
                    index = 0;
                var cb_id = "cb_" + index;
                if( "checked" == result[cb_id] )
                    break;
            }
            var q ="";
            var args = GetUrlParms(tab.url);
            var search_key = searchselect_array[ searchhost_array[i_host][1] ][2];
            if( -1 < i_host ) {
                if(search_key == "%s") {
                    search_key = searchselect_array[ searchhost_array[i_host][1] ][1];
                    search_key = search_key.toLowerCase();
                    search_key = search_key.substring(0, search_key.indexOf("%s"));
                    search_key = search_key.match(/[^?#&/]*$/);
                    if(search_key != null) {
                        if(search_key[0].match("="))
                            search_key = search_key[0].replace("=",  "");
                        else
                            search_key ="q";
                        q = args[search_key]; // search word
                    } else {
                        q = args["q"]; // Protection, should not step into this
                    }
                } else {
                    q = args[search_key];
                }
            }
            search_key = searchselect_array[index][2];
            if(q) {
                if(search_key=="%s") {
                    newurl = searchselect_array[index][1].replace(/%s/i,  q);
                } else {
                    newurl = searchselect_array[index][1] + q;
                }
            
            } else {
                newurl = searchselect_array[index][3];
            }

            browser.tabs.update( tab.id, {url:newurl}, function(){});
        } else {
            args = GetUrlParms(tab.url);
            var ori_url = args[ "url" ];
            if( ori_url )
                browser.tabs.update( tab.id, {url: decodeURIComponent(ori_url) }, function(){});
            else {
                ori_url = args[ "imgrefurl" ];
                if( ori_url )
                    browser.tabs.update( tab.id, {url: decodeURIComponent(ori_url) }, function(){});
            }
        }
    });
}

// Listen for the click of the URL.
browser.action.onClicked.addListener(ActionClick);

function ActionShortcut(tab, flag) {
    browser.storage.local.get(null, function(result) {
        browser.pageAction.setIcon({path:"img/icon-38-b.png",tabId: tab.id});
        var index = 0;
        insertCustomArray();
        var host = GetHost(tab.url);
        var i_host = inHostArray(host);
        if( 0 > i_host ) 
            return;
        index = searchhost_array[i_host][1];
        for( var i=0; i<search_array.length; i++ ) {
            switch (flag) {
            case "switch-pre":
                index--;
                if( index < 0 )
                    index = search_array.length-1;
                break;
            case "switch-next":
                index++;
                if( index >= search_array.length )
                    index = 0;
                break;
            }

            var cb_id = "cb_" + index;
            if( "checked" == result[cb_id] )
                break;
        }
        var q ="", newurl;
        var args = GetUrlParms(tab.url);
        var search_key = searchselect_array[ searchhost_array[i_host][1] ][2];
        if( -1 < i_host ) {
            if(search_key == "%s") {
                search_key = searchselect_array[ searchhost_array[i_host][1] ][1];
                search_key = search_key.toLowerCase();
                search_key = search_key.substring(0, search_key.indexOf("%s"));
                search_key = search_key.match(/[^?#&/]*$/);
                if(search_key != null) {
                    if(search_key[0].match("="))
                        search_key = search_key[0].replace("=",  "");
                    else
                        search_key ="q";
                    q = args[search_key]; // search word
                } else {
                    q = args["q"]; // Protection, should not step into this
                }
            } else {
                q = args[search_key];
            }
        }
        search_key = searchselect_array[index][2];
        if(q) {
            if(search_key=="%s") {
                newurl = searchselect_array[index][1].replace(/%s/i,  q);
            } else {
                newurl = searchselect_array[index][1] + q;
            }
        } else {
            newurl = searchselect_array[index][3];
        }

        browser.tabs.update( tab.id, {url:newurl}, function(){});
    });
}

// Listen for these commands of shortcuts
browser.commands.onCommand.addListener(function(command) {
    switch ( command ) {
    case "switch-pre":
        browser.tabs.query({currentWindow: true, active: true}, function(tabs){
            ActionShortcut(tabs[0], command);
        });
        break;
    case "switch-next":
        browser.tabs.query({currentWindow: true, active: true}, function(tabs){
            ActionShortcut(tabs[0], command);
        });
        break;
    default:
        break;
    }
});

// Listen for the changes in storage
browser.storage.onChanged.addListener(function(changes, area) {
    browser.storage.local.get(null, function(result) {
        if( result["cb_autosync"] != "checked" && area != "sync")
            return;
        for (var key in changes) {
            var itemChange = changes[key];
            if (typeof itemChange.newValue != "undefined") {
                browser.storage.sync.set({[key] : itemChange.newValue});
            }
        }
    });
});

var firstRun = "false";
browser.storage.local.get(null, function(result) {
    if (undefined == result["firstRun"]) 
        firstRun = "true";
    if (firstRun == "true") {
        browser.tabs.create({url:"options.html"},function() {});
        if (undefined == result["cb_autosync"])
            browser.storage.local.set({"cb_autosync" : "checked"});
        if (undefined == result["cb_switch"])
            browser.storage.local.set({"cb_switch" : "no"});

        for( var i=0; i<search_custom_num; i++ ) { // 6 = search_custom_num
            var custom_name_id   = "custom_name_" + i;
            var custom_search_id   = "custom_search_" + i;
            browser.storage.local.set({[custom_name_id] : ""});
            browser.storage.local.set({[custom_search_id] : ""});
        }
        for( i=0; i<search_array.length+search_custom_num; i++ ) { // 13 = search_array.length+search_custom_num   
            var cb_id = "cb_" + i;
            browser.storage.local.set({[cb_id] : "no"});
        }
        browser.storage.local.set({"cb_0" : "checked"});
        browser.storage.local.set({"cb_2" : "checked"});
        browser.storage.local.set({"cb_3" : "checked"});
        browser.storage.local.set({"firstRun" : "false"});
    
        // Sync the backup data
        browser.storage.sync.get("backup_data", function (item) { 
            if(isEmpty(item)) {    // Upload
                dataBackup();
            } else {    // Download
                dataRecover();
            }
        });
    }
});
