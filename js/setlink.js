/* global search_custom_num search_array insertCustomArray GetHost inHostArray searchhost_array searchselect_array */
window.addEventListener("load", onLoad);

if (typeof browser === "undefined" && typeof chrome === "object"){
    var browser = chrome; //On Chrome
}

function onLoad() {
    window.removeEventListener("load", onLoad, false);
    for(var i=0; i<search_custom_num; i++ ) {
        var id = search_array.length + i;
        var a_id = "a_" + id ;
        $( a_id ).textContent = localStorage[ "custom_name_" + i ];
    }
    browser.tabs.query({currentWindow: true, active: true}, function(tabs){ 
        var tab = tabs[0];
        insertCustomArray();
        var host = GetHost(tab.url);
        var i_host = inHostArray(host) ;
        if( -1< i_host)
            SetNowLink( searchhost_array[i_host][1] );
        else
            SetNowLink( -1 );
    });
}

function SetNowLink( index ) {
    for(var i=0; i<searchselect_array.length; i++) {
        var a_id = "a_" + i ;
        if( $( a_id) ) {
            if( i == index ) {
                $( a_id ).href = "#";
                $( a_id ).className = "disable";
            } else {
                $( a_id ).href = "#";  //$( a_id ).href = 'javascript:redirect(' + i + ');';
                $( a_id ).className = "";
            }		
            var cb_id = "cb_" + i;
            if( i==1 || i>3 ) { //those not show by default
                $( a_id ).className = "notshow";
                if( localStorage[cb_id]) {
                    if( "checked" == localStorage[cb_id]) {
                        if( i == index )
                            $( a_id ).className = "disable";
                        else
                            $( a_id ).className = "";
                    }
                }
            } else if( localStorage[cb_id]) {
                if( "no" == localStorage[cb_id])
                    $( a_id ).className = "notshow";
            }
        }
    }
}
