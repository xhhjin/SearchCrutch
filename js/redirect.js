/* global $ insertCustomArray GetHost inHostArray GetUrlParms searchhost_array searchselect_array SetNowLink */
$("a_0").addEventListener("click",CheckRedirect);        //谷歌
$("a_1").addEventListener("click",CheckRedirect);        //AOL Search
$("a_2").addEventListener("click",CheckRedirect);        //百度
$("a_3").addEventListener("click",CheckRedirect);        //必应
$("a_4").addEventListener("click",CheckRedirect);        //雅虎
$("a_5").addEventListener("click",CheckRedirect);        //搜狗
$("a_6").addEventListener("click",CheckRedirect);        //360搜索
$("a_7").addEventListener("click",CheckRedirect);        //自定义搜索1
$("a_8").addEventListener("click",CheckRedirect);        //自定义搜索2
$("a_9").addEventListener("click",CheckRedirect);        //自定义搜索3
$("a_10").addEventListener("click",CheckRedirect);       //自定义搜索4
$("a_11").addEventListener("click",CheckRedirect);       //自定义搜索5
$("a_12").addEventListener("click",CheckRedirect);       //自定义搜索6

function CheckRedirect( ) {
    var index = this.id.substr("a_".length);
    redirect(index);
}

function redirect( index ) {
    browser.tabs.query({currentWindow: true, active: true}, function(tabs){ 
        var tab = tabs[0];
        var q ="", newurl;
        insertCustomArray();
        var host = GetHost(tab.url);
        var i_host = inHostArray(host);
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
                        search_key ="q"
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
                newurl = searchselect_array[index][1].replace(/%s/i,  q);;
            } else {
                newurl = searchselect_array[index][1] + q;
            }
           
        } else {
            newurl = searchselect_array[index][3];
        }

        browser.tabs.update( tab.id, {url:newurl}, function(){});//*/
    });
    SetNowLink( index );
}
