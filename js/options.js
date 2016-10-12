window.addEventListener("load", restore_options);

function $(objStr){return document.getElementById(objStr);}

// Restores select box state to saved value from localStorage.
function restore_options() 
{
	window.removeEventListener("load", restore_options, false);
	for( i=0;i<searchselect_array.length+1;i++ )
	{
		cb_id = 'cb_' + i;
		if( 'no' == localStorage[cb_id] )
			$( cb_id ).checked = '';
		if( 'checked' == localStorage[cb_id] )
			$( cb_id ).checked = 'checked';
	}
	if (null == localStorage.getItem('cb_switch'))
		localStorage[ 'cb_switch' ] = "no";
	if (null == localStorage.getItem('custom_name'))
		localStorage[ 'custom_name' ] = "请输入名称";
	if (null == localStorage.getItem("custom_search"))
		localStorage[ 'custom_search' ] = "请输入路径";
	if( 'no' == localStorage['cb_switch'] )
		$( 'cb_switch' ).checked = '';
	else
		$( 'cb_switch' ).checked = 'checked';
	document.getElementById('custom_name').value = localStorage[ 'custom_name' ];
	document.getElementById('custom_search').value = localStorage[ 'custom_search' ];
}