if( '/reader' != location.pathname.substr(0,7) )
{
	if ( document.forms[0] || location.search.indexOf("webcache.googleusercontent.com")>0 || location.search.indexOf("&imgrefurl=")>0 ) 
	{
		chrome.runtime.sendMessage({"event":"gok",'label':'gfinish'}, function(response) {})
		input_wd = document.getElementsByName('q');
	}
}

