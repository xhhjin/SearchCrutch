importScripts('./base.js');

/* global GetUrlParms search_array isEmpty search_custom_num getRedirectUrl dataBackup dataRecover */
function checkForValidUrl(tabId, changeInfo, tab) {
    if (!changeInfo.status)
        return;
    //if( 'loading' != changeInfo.status )
    //	return;
    browser.storage.local.get(null, function (result) {
        if ("chrome://newtab/" == tab.url) {
            browser.action.enable(tabId);
            return;
        }
        var index = getUrlSearchIndex(tab.url);
        if (-1 < index) {
            //for direct visit from google refer url
            if ((1 == index || 0 == index) && (10 < tab.url.indexOf("url?") || 10 < tab.url.indexOf("imgres?"))) {
                browser.action.setPopup({ popup: "", tabId: tabId });
                browser.action.setIcon({ path: "../img/icon-38-g.png", tabId: tabId });
                browser.action.setTitle({ title: "直接访问所在网页", tabId: tabId });
                browser.action.enable(tabId);
                return;
            }
            if ("checked" == result["cb_switch"]) {
                browser.action.setPopup({ popup: "", tabId: tab.id });
                browser.action.setTitle({ title: "点击切换搜索引擎", tabId: tabId });
                browser.action.enable(tabId);
                return;
            }
            browser.action.enable(tabId);
            return;
        }
    });
}

// Listen for any changes to the URL of any tab.
browser.tabs.onUpdated.addListener(checkForValidUrl);

function ActionClick(tab) {
    browser.action.setIcon({ path: "../img/icon-38-b.png", tabId: tab.id });
    browser.storage.local.get(null, function (result) {
        if ("checked" == result["cb_switch"]) {
            var index = getUrlSearchIndex(tab.url);
            if (0 > index)
                return;
            for (var i = 0; i < search_array.length; i++) {
                index++;
                if (index >= search_array.length)
                    index = 0;
                var cb_id = "cb_" + index;
                if ("checked" == result[cb_id])
                    break;
            }
            var new_url = getRedirectUrl(tab.url, index);
            browser.tabs.update(tab.id, { url: new_url }, function () { });
        } else {
            args = getUrlParms(tab.url, null);
            var ori_url = args["url"];
            if (ori_url)
                browser.tabs.update(tab.id, { url: decodeURIComponent(ori_url) }, function () { });
            else {
                ori_url = args["imgrefurl"];
                if (ori_url)
                    browser.tabs.update(tab.id, { url: decodeURIComponent(ori_url) }, function () { });
            }
        }
    });
}

// Listen for the click of the URL.
browser.action.onClicked.addListener(ActionClick);

function ActionShortcut(tab, flag) {
    browser.action.setIcon({ path: "../img/icon-38-b.png", tabId: tab.id });
    browser.storage.local.get(null, function (result) {
        var index = getUrlSearchIndex(tab.url);
        if (0 > index)
            return;
        for (var i = 0; i < search_array.length; i++) {
            switch (flag) {
                case "switch-pre":
                    index--;
                    if (index < 0)
                        index = search_array.length - 1;
                    break;
                case "switch-next":
                    index++;
                    if (index >= search_array.length)
                        index = 0;
                    break;
            }

            var cb_id = "cb_" + index;
            if ("checked" == result[cb_id])
                break;
        }
        var new_url = getRedirectUrl(tab.url, index);

        browser.tabs.update(tab.id, { url: new_url }, function () { });
    });
}

// Listen for these commands of shortcuts
browser.commands.onCommand.addListener(function (command) {
    switch (command) {
        case "switch-pre":
            browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                ActionShortcut(tabs[0], command);
            });
            break;
        case "switch-next":
            browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                ActionShortcut(tabs[0], command);
            });
            break;
        default:
            break;
    }
});

// Listen for the changes in storage
browser.storage.onChanged.addListener(function (changes, area) {
    browser.storage.local.get(null, function (result) {
        if (result["cb_autosync"] != "checked" && area != "sync")
            return;
        for (var key in changes) {
            var itemChange = changes[key];
            if (typeof itemChange.newValue != "undefined") {
                browser.storage.sync.set({ [key]: itemChange.newValue });
            }
        }
    });
});

var firstRun = "false";
browser.storage.local.get(null, function (result) {
    var data = new Object();
    if (undefined == result["firstRun"])
        firstRun = "true";
    if (firstRun == "true") {
        browser.tabs.create({ url: "options.html" }, function () { });
        data["cb_autosync"] = "checked";
        data["cb_switch"] = "no";
        data["cb_pop_close"] = "no";

        for (var i = 0; i < search_custom_num; i++) { // 6 = search_custom_num
            var custom_name_id = "custom_name_" + i;
            var custom_search_id = "custom_search_" + i;
            data[custom_name_id] = "";
            data[custom_search_id] = "";
        }
        for (i = 0; i < search_array.length + search_custom_num; i++) { // 13 = search_array.length+search_custom_num   
            var cb_id = "cb_" + i;
            data[cb_id] = "no";
        }
        data["cb_0"] = "checked";
        data["cb_2"] = "checked";
        data["cb_3"] = "checked";
        data["firstRun"] = "false";
        browser.storage.local.set(data);

        // Sync the backup data
        browser.storage.sync.get("backup_data", function (item) {
            if (isEmpty(item)) {    // Upload
                dataBackup();
            } else {    // Download
                dataRecover();
            }
        });
    }
});
