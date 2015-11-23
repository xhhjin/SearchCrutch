window.addEventListener("load", restore_options);

function $(objStr){return document.getElementById(objStr);}

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