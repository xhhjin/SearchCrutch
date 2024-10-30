/* global $ getRedirectUrl setNowLink */
$("a_0").addEventListener("click", CheckRedirect);        //谷歌
$("a_1").addEventListener("click", CheckRedirect);        //替代谷歌的搜索引擎
$("a_2").addEventListener("click", CheckRedirect);        //百度
$("a_3").addEventListener("click", CheckRedirect);        //必应
$("a_4").addEventListener("click", CheckRedirect);        //雅虎
$("a_5").addEventListener("click", CheckRedirect);        //搜狗
$("a_6").addEventListener("click", CheckRedirect);        //360搜索
$("a_7").addEventListener("click", CheckRedirect);        //自定义搜索1
$("a_8").addEventListener("click", CheckRedirect);        //自定义搜索2
$("a_9").addEventListener("click", CheckRedirect);        //自定义搜索3
$("a_10").addEventListener("click", CheckRedirect);       //自定义搜索4
$("a_11").addEventListener("click", CheckRedirect);       //自定义搜索5
$("a_12").addEventListener("click", CheckRedirect);       //自定义搜索6

function CheckRedirect() {
    var index = this.id.substr("a_".length);
    browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var tab = tabs[0];
        var new_url = getRedirectUrl(tab.url, index);

        browser.tabs.update(tab.id, { url: new_url }, async function () {
            var result = await browser.storage.local.get('cb_pop_close');
            if ("checked" == result["cb_pop_close"])
                window.close();
        });
    });
    setNowLink(index);
}