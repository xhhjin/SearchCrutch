window.addEventListener("load", onLoad);

function onLoad()
{
	document.getElementById('a_7').innerHTML=localStorage[ 'custom_name' ];
	chrome.tabs.getSelected(null,function(tab){ 
		insertCustomArray();
		host = GetHost(tab.url);
		i_host = inHostArray(host) ;
		if( -1< i_host)
			SetNowLink( searchhost_array[i_host][1] );
		else
			SetNowLink( -1 );
	});
}

function SetNowLink( index )
{
	for( i=0;i<searchselect_array.length;i++)
	{
		a_id = 'a_' + i ;
		if( $( a_id) )
		{
			if( i == index )
			{
				$( a_id ).href = '#';
				$( a_id ).className = 'disable';
			}
			else
			{
				$( a_id ).href = '#';  //$( a_id ).href = 'javascript:redirect(' + i + ');';
				$( a_id ).className = '';
			}		
			cb_id = 'cb_' + i;
			if( i==1 || i>3 )//those not show by default
			{
				$( a_id ).className = 'notshow';
				if( localStorage[cb_id])
				{
					if( 'checked' == localStorage[cb_id])
					{
						if( i == index )
							$( a_id ).className = 'disable';
						else
							$( a_id ).className = '';
					}
				}
			}
			else if( localStorage[cb_id])
			{
				if( 'no' == localStorage[cb_id])
					$( a_id ).className = 'notshow';
			}
		}
	}
}