document.getElementById('cb_0').addEventListener('click',save_options);		//谷歌
document.getElementById('cb_1').addEventListener('click',save_options);		//谷歌复原
document.getElementById('cb_2').addEventListener('click',save_options);		//百度
document.getElementById('cb_3').addEventListener('click',save_options);		//必应
document.getElementById('cb_4').addEventListener('click',save_options);		//雅虎
document.getElementById('cb_5').addEventListener('click',save_options);		//搜狗
document.getElementById('cb_6').addEventListener('click',save_options);		//有道

document.getElementById('a_reclose').addEventListener('click',re_close);
document.getElementById('cb1_explain').addEventListener('click',explain);

// Saves options to localStorage.
function save_options() {
  for( i=0;i<searchselect_array.length;i++ )
	{
		cb_id = 'cb_' + i;
		localStorage[ cb_id ] = $(cb_id).checked?'checked':'no';
	}
  var status = document.getElementById("status");
  status.innerHTML = "选项已保存";
  setTimeout(function() {
    status.innerHTML = "";
  }, 1000);
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

function re_close()
{
	if( $('div_recommend').style.display == 'none' )
	{
		$('div_recommend').style.display = '';
		$('a_reclose').innerHTML = '隐藏推荐';
	}
	else
	{
		$('div_recommend').style.display = 'none';
		$('a_reclose').innerHTML = '显示推荐';
	}
}