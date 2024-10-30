/* exported $ isEmpty getUrlSearchIndex getUrlParms getRedirectUrl dataBackup dataRecover */
function $(objStr) { return document.getElementById(objStr); }
// Avoid 'chrome' namespace
var isChrome = false; //On Chrome
if (typeof browser === "undefined" && typeof chrome === "object") {
    var browser = chrome; //On Chrome
    isChrome = true;
}
var search_custom_num = 6;
var search_array = ["google", "rambler", "baidu", "bing", "yahoo", "sogou", "haosou"];

var searchselect_array =
    [
        ["Google", "https://www.google.com.hk/search?hl=zh-CN&newwindow=1&q=", "q", "https://www.google.com.hk"],
        ["Rambler", "https://nova.rambler.ru/search?query=", "query", "https://nova.rambler.ru"],
        ["百度", "https://www.baidu.com/s?wd=", "wd", "https://www.baidu.com"],
        ["必应", "https://cn.bing.com/search?q=", "q", "https://cn.bing.com"],
        ["雅虎", "https://search.yahoo.com/search?p=", "p", "https://search.yahoo.com"],
        ["搜狗", "https://www.sogou.com/web?query=", "query", "https://www.sogou.com"],
        ["360搜索", "https://www.so.com/s?q=", "q", "https://www.so.com"],
    ];
var searchhost_array =
    [
        ["www.google.com", 0],
        ["www.google.com.hk", 0],
        ["ipv4.google.com", 0],
        [/www.google(\.\w+){1,2}/, 0],
        ["r0.ru", 1],
        ["nova.rambler.ru", 1],
        ["www.baidu.com", 2],
        ["cn.bing.com", 3],
        ["www.bing.com", 3],
        ["search.yahoo.com", 4],
        ["www.sogou.com", 5],
        ["www.so.com", 6]
    ];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function isEmpty(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
}
function insertCustomArray() {
    browser.storage.local.get(null, function (result) {
        if (null == result["custom_search_0"])
            return;
        var i;
        for (i = search_array.length; i > 7; i--) {  // 判断是否需要删除尾部追加的自定义搜索
            search_array.pop();
            searchhost_array.pop();
            searchselect_array.pop();
        }
        for (i = 0; i < search_custom_num; i++) {
            var custom_name_id = "custom_name_" + i;
            var custom_search_id = "custom_search_" + i;
            var insert_array = "custom_" + i;
            var custom_name = result[custom_name_id];
            var custom_search = result[custom_search_id];
            search_array.push(insert_array);
            insert_array = [getHost(custom_search), 7 + i];
            searchhost_array.push(insert_array);
            var qstr_array = "q";
            var regexp = /[#?&]\w{1,7}=$|[#?&]\w{1,7}=&/g;  // q=    search=    keyword=
            if (custom_search.toLowerCase().match("%s")) {
                qstr_array = "%s";
            } else {
                qstr_array = custom_search.toLowerCase().match(regexp);
                if (qstr_array != null) {
                    qstr_array = qstr_array[qstr_array.length - 1];
                    qstr_array = qstr_array.substr(1, qstr_array.length - 2);
                } else {
                    qstr_array = "q";
                }
            }
            insert_array = [custom_name, custom_search, qstr_array, "http://" + getHost(custom_search)];
            searchselect_array.push(insert_array);
        }
    });
}
function getHost(url) {
    var pos = url.indexOf("//");
    var host;
    if (-1 < pos)
        host = url.substr(pos + 2);
    else
        return "www.google.com.hk";
    if (host.length > 0) {
        pos = host.indexOf("/");
        if (-1 < pos)
            host = host.substr(0, pos);
    }
    return host.toLowerCase();
}
function getUrlSearchIndex(url) {
    var index = -1;
    insertCustomArray();
    var host = getHost(url);
    for (var i = 0; i < searchhost_array.length; i++) {
        if (host.match(searchhost_array[i][0]) != null) {
            index = searchhost_array[i][1];
            break;
        }
    }
    return index;
}
function getUrlParms(hrefstr, search_old_pattern) {
    var args = new Object();
    hrefstr = decodeURI(hrefstr);

    // 针对一些特殊得搜索结构，如:
    // souku：http://so.youku.com/search_video/q_dd
    // 维基百科：https://zh.wikipedia.org/wiki/dd
    // 百度百科：https://baike.baidu.com/item/dd/14774512
    if (search_old_pattern != null) {
        var search_key_old = search_old_pattern[2];
        var host_old = search_old_pattern[1].replace(/%s/i, "");
        if (search_key_old == "%s" && !host_old.includes("=")) {
            var pattern = new RegExp(host_old, "i");
            hrefstr = hrefstr.replace(pattern, host_old + "?q=");  //在搜索词前添加 ?q=
        }
    }

    //针对Google的情况，防止关键字分错，https://www.google.co.uk/?gws_rd=ssl#q=dd    https://www.google.co.jp/?gws_rd=ssl,cr#q=dd
    hrefstr = hrefstr.replace(/\?gws_rd=([^#?&]+)/, "");
    //针对Google的情况 https://ipv4.google.com/sorry/index?continue=https://www.google.com.hk/search%3Fq%3Ddd    //https://ipv4.google.com/sorry/IndexRedirect?continue=https://www.google.com/search%3Fq%3Ddd
    if (hrefstr.match("//ipv4.google.com/") != null) {
        hrefstr = hrefstr.replace(/^https?:\/\/ipv4\.google\.com\/sorry\/([a-zA-Z0-9]+)\?continue=/, "");
        // hrefstr = unescape(hrefstr);
    } else if (hrefstr.match("//so.youku.com/search_video/q_") != null) { //针对Soku
        var end = hrefstr.indexOf("?", "http://so.youku.com/search_video/q_?q=".length)
        if (end > 0)
            hrefstr = hrefstr.substring(0, end);    // 移除?之后的内容 http://so.youku.com/search_video/q_?q=dd?f=1
    } else if (hrefstr.match("//baike.baidu.com/item") != null) {  //针对百度百科
        var end = hrefstr.indexOf("/", "http://baike.baidu.com/item/q_?q=".length)
        if (end > 0)
            hrefstr = hrefstr.substring(0, end);    // 移除dd/之后的内容 https://baike.baidu.com/item/?q=dd/14774512
    }
    var pos = hrefstr.indexOf("?");
    if (0 > pos)
        pos = hrefstr.indexOf("#");//针对Google的情况，没找到时重找一次： https://www.google.com.hk/#q=dd
    if (0 > pos) {
        pos = hrefstr.indexOf("&");//针对Google出错时的情况，寻找关键字： https://www.google.com.hk/search&q=dd
    } else {
        var query = hrefstr.substring(pos + 1);
        var pairs = query.split("&");//在逗号处断开   
        for (var i = 0; i < pairs.length; i++) {
            pos = pairs[i].indexOf("=");//查找name=value   
            if (pos == -1) continue;//如果没有找到就跳过   
            var argname = pairs[i].substring(0, pos);//提取name   
            var value = pairs[i].substring(pos + 1);//提取value   
            if (typeof args[argname] == "undefined") { //只保留第一次找到的
                args[argname] = value;//存为属性 
            }
        }
    }
    return args;
}
function getRedirectUrl(tab_url, index_new) {
    var q = "", new_url;
    var index_old = getUrlSearchIndex(tab_url);
    var args = getUrlParms(tab_url, searchselect_array[index_old]);
    var search_key = searchselect_array[index_old][2];
    if (-1 < index_old) {
        if (search_key == "%s") {
            search_key = searchselect_array[index_old][1];
            search_key = search_key.toLowerCase();
            search_key = search_key.substring(0, search_key.indexOf("%s"));
            search_key = search_key.match(/[^?#&/]*$/);
            if (search_key != null) {
                if (search_key[0].match("="))
                    search_key = search_key[0].replace("=", "");
                else
                    search_key = "q";
                q = args[search_key]; // search word
            } else {
                q = args["q"]; // Protection, should not step into this
            }
        } else {
            q = args[search_key];
        }
    }
    search_key = searchselect_array[index_new][2];
    if (q) {
        if (search_key == "%s") {
            new_url = searchselect_array[index_new][1].replace(/%s/i, q);
        } else {
            new_url = searchselect_array[index_new][1] + q;
        }
    } else {
        new_url = searchselect_array[index_new][3];
    }

    return new_url;
}
function dataBackup() {
    browser.storage.local.get(null, function (result) {
        var data = new Object();
        for (var i = 0; i < searchselect_array.length + search_custom_num; i++) {
            var cb_id = "cb_" + i;
            data[cb_id] = result[cb_id];
        }
        for (i = 0; i < search_custom_num; i++) {
            var custom_name_id = "custom_name_" + i;
            var custom_search_id = "custom_search_" + i;
            data[custom_name_id] = result[custom_name_id];
            data[custom_search_id] = result[custom_search_id];
        }
        data["cb_switch"] = result["cb_switch"];
        data["cb_pop_close"] = result["cb_pop_close"];
        data["cb_autosync"] = result["cb_autosync"];
        data["backup_data"] = true;

        browser.storage.sync.clear().then(() => {
            sleep(1000);
            browser.storage.sync.set(data, function () { });
        }, null);
    });
}
function dataRecover() {
    browser.storage.sync.get(null).then((data) => {
        sleep(1000);
        browser.storage.local.set(data);
    }, null);
}
