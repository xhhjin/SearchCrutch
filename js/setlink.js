/* global search_custom_num search_array searchselect_array */
window.addEventListener("load", onLoad);

function onLoad() {
    browser.storage.local.get(null, function (result) {
        window.removeEventListener("load", onLoad, false);
        for (var i = 0; i < search_custom_num; i++) {
            var id = search_array.length + i;
            var a_id = "a_" + id;
            $(a_id).textContent = result["custom_name_" + i];
        }
        browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var tab = tabs[0];
            var index = getUrlSearchIndex(tab.url);
            setNowLink(index);
        });
    });
}

function setNowLink(index) {
    browser.storage.local.get(null, function (result) {
        for (var i = 0; i < searchselect_array.length; i++) {
            var a_id = "a_" + i;
            if ($(a_id)) {
                if (i == index) {
                    $(a_id).href = "#";
                    $(a_id).className = "disable";
                } else {
                    $(a_id).href = "#";  //$( a_id ).href = 'javascript:redirect(' + i + ');';
                    $(a_id).className = "";
                }
                var cb_id = "cb_" + i;
                if (i == 1 || i > 3) { //those not show by default
                    $(a_id).className = "notshow";
                    if (result[cb_id]) {
                        if ("checked" == result[cb_id]) {
                            if (i == index)
                                $(a_id).className = "disable";
                            else
                                $(a_id).className = "";
                        }
                    }
                } else if (result[cb_id]) {
                    if ("no" == result[cb_id])
                        $(a_id).className = "notshow";
                }
            }
        }
    });
}
