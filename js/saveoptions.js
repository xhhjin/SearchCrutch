/*global searchselect_array search_custom_num*/
document.getElementById("cb_0").addEventListener("click",save_options);		//谷歌
document.getElementById("cb_1").addEventListener("click",save_options);		//谷歌复原
document.getElementById("cb_2").addEventListener("click",save_options);		//百度
document.getElementById("cb_3").addEventListener("click",save_options);		//必应
document.getElementById("cb_4").addEventListener("click",save_options);		//雅虎
document.getElementById("cb_5").addEventListener("click",save_options);		//搜狗
document.getElementById("cb_6").addEventListener("click",save_options);		//360
document.getElementById("cb_7").addEventListener("click",save_options);		//自定义
document.getElementById("cb_8").addEventListener("click",save_options);		//自定义
document.getElementById("cb_9").addEventListener("click",save_options);		//自定义
document.getElementById("cb_10").addEventListener("click",save_options);	//自定义
document.getElementById("cb_11").addEventListener("click",save_options);	//自定义
document.getElementById("cb_12").addEventListener("click",save_options);	//自定义

document.getElementById("custom_name_0").addEventListener("input",save_options);		//自定义名称
document.getElementById("custom_search_0").addEventListener("input",save_options);		//自定义搜索
document.getElementById("custom_name_1").addEventListener("input",save_options);		//自定义名称
document.getElementById("custom_search_1").addEventListener("input",save_options);		//自定义搜索
document.getElementById("custom_name_2").addEventListener("input",save_options);		//自定义名称
document.getElementById("custom_search_2").addEventListener("input",save_options);		//自定义搜索
document.getElementById("custom_name_3").addEventListener("input",save_options);		//自定义名称
document.getElementById("custom_search_3").addEventListener("input",save_options);		//自定义搜索
document.getElementById("custom_name_4").addEventListener("input",save_options);		//自定义名称
document.getElementById("custom_search_4").addEventListener("input",save_options);		//自定义搜索
document.getElementById("custom_name_5").addEventListener("input",save_options);		//自定义名称
document.getElementById("custom_search_5").addEventListener("input",save_options);		//自定义搜索

document.getElementById("cb_switch").addEventListener("click",save_options);	//单击图标切换
document.getElementById("cb1_explain").addEventListener("click",explain);

// Saves options to localStorage.
function save_options() {
    var i;
    for( i=0; i<searchselect_array.length+search_custom_num; i++ ) {
        var cb_id = "cb_" + i;
        localStorage[ cb_id ] = $(cb_id).checked?"checked":"no";
    }
    for( i=0; i<search_custom_num; i++ ) {
        var custom_name_id = "custom_name_" + i;
        var custom_search_id = "custom_search_" + i;
        localStorage[ custom_name_id ]   = $(custom_name_id).value;
        localStorage[ custom_search_id ] = $(custom_search_id).value;
    }
    localStorage[ "cb_switch" ] = $("cb_switch").checked?"checked":"no";
	
    var status = document.getElementById("status");
    status.textContent = "选项已保存";
    setTimeout(function() {status.textContent = "";}, 1000);
}

function explain() {
    if( $("div_exp").style.display == "none" ) {
        $("lb_imgg").className = "heighup";
        $("div_exp").style.display = "";
    } else {
        $("lb_imgg").className = "";
        $("div_exp").style.display = "none";
    }
}
