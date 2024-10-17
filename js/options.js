/* global searchselect_array search_custom_num */
window.addEventListener("load", restore_options);

// Restores select box state to saved value from localStorage.
function restore_options() {
    window.removeEventListener("load", restore_options, false);
    browser.storage.local.get(null, function(result) {
        for( var i=0; i<searchselect_array.length+search_custom_num; i++ ) {
            var cb_id = "cb_" + i;
            if( "no" == result[cb_id])
                $( cb_id ).checked = "";
            else
                $( cb_id ).checked = "checked";
        }
        for( i=0; i<search_custom_num; i++ ) {
            var custom_name_id   = "custom_name_" + i;
            var custom_search_id = "custom_search_" + i;
            $(custom_name_id).value = result[custom_name_id];
            $(custom_search_id).value = result[custom_search_id];
        }
        if( "no" ==  result["cb_switch"] )
            $( "cb_switch" ).checked = "";
        else
            $( "cb_switch" ).checked = "checked";
        if( "no" ==  result["cb_autosync"] )
            $( "cb_autosync" ).checked = "";
        else
            $( "cb_autosync" ).checked = "checked";
    });
}