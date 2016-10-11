document.getElementById('cb_0').addEventListener('click',save_options);		//谷歌
document.getElementById('cb_1').addEventListener('click',save_options);		//谷歌复原
document.getElementById('cb_2').addEventListener('click',save_options);		//百度
document.getElementById('cb_3').addEventListener('click',save_options);		//必应
document.getElementById('cb_4').addEventListener('click',save_options);		//雅虎
document.getElementById('cb_5').addEventListener('click',save_options);		//搜狗
document.getElementById('cb_6').addEventListener('click',save_options);		//360
document.getElementById('cb_7').addEventListener('click',save_options);		//自定义

document.getElementById('custom_name').addEventListener('input',save_options);		//自定义名称
document.getElementById('custom_search').addEventListener('input',save_options);	//自定义搜索

document.getElementById('cb1_explain').addEventListener('click',explain);

// Saves options to localStorage.
function save_options() {
	for( i=0;i<searchselect_array.length+1;i++ )
	{
		cb_id = 'cb_' + i;
		localStorage[ cb_id ] = $(cb_id).checked?'checked':'no';
	}
	localStorage[ 'custom_name' ] = custom_name.value;
	localStorage[ 'custom_search' ] = custom_search.value;
	var status = document.getElementById("status");
	status.textContent  = "选项已保存";
	setTimeout(function() {status.textContent  = "";}, 1000);
}

function explain()
{
	if( $('div_exp').style.display == 'none' )
	{
		$('lb_imgg').className = 'heighup';
		$('div_exp').style.display = '';
	}
	else
	{
		$('lb_imgg').className = '';
		$('div_exp').style.display = 'none';
	}
}