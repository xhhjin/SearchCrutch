window.addEventListener("load", restore_options);

function $(objStr){return document.getElementById(objStr);}
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

// Restores select box state to saved value from localStorage.
function restore_options() 
{
	for( i=0;i<searchselect_array.length;i++ )
	{
		cb_id = 'cb_' + i;
		if( 'no' == localStorage[cb_id] )
			$( cb_id ).checked = '';
		if( 'checked' == localStorage[cb_id] )
			$( cb_id ).checked = 'checked';
	}//*/
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