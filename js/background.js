function checkForValidUrl(tabId, changeInfo, tab) {
	if( !changeInfo.status )
		return;
	if( 'loading' != changeInfo.status )
		return;
	localStorage["word"] = '';
	if( 'chrome://newtab/' == tab.url )
	{
		chrome.pageAction.show(tabId);
		return;
	}
	if( -1 < tab.url.substr(7,25).indexOf('www.google.com/reader') )
	{
		chrome.pageAction.setPopup({popup:'',tabId: tabId});
		chrome.pageAction.setIcon({path:'img/icon-38-b.png',tabId: tabId});
		chrome.pageAction.setTitle({title:'一键切换HTTP/HTTPS',tabId: tabId});
		chrome.pageAction.show(tabId);
		return;
	}
	host = GetHost( tab.url );
	insertCustomArray();
	i_host = inHostArray(host);
	if( -1 < i_host ) 
	{
		//for direct visit from google refer url
		if( (1==searchhost_array[i_host][1] || 0 == searchhost_array[i_host][1] ) && ( 10 < tab.url.indexOf('url?') || 10 < tab.url.indexOf('imgres?') ) )
		{
			chrome.pageAction.setPopup({popup:'',tabId: tabId});
			chrome.pageAction.setIcon({path:'img/icon-38-g.png',tabId: tabId});
			chrome.pageAction.setTitle({title:'直接访问所在网页',tabId: tabId});
			chrome.pageAction.show(tabId);
			return;
		}
		chrome.pageAction.show(tabId);
		_gaq.push(['_trackEvent', 'search', searchselect_array[ searchhost_array[i_host][1] ][0] ]);
		return;
	}
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
 
function ActionClick(tab)
{
	if( -1 < tab.url.substr(7,25).indexOf('www.google.com/reader') )
	{
		oldurl = tab.url;
		newurl = oldurl;
		if( 'http' == oldurl.substr(0,4) )
		{
			if( 'https' == oldurl.substr(0,5) )
				newurl = 'http'+ oldurl.substr(5);
			else
				newurl = 'https'+ oldurl.substr(4);
		}
		chrome.tabs.update( tab.id, {url:newurl}, function(tab){});
		_gaq.push(['_trackEvent', 'redirect', 'Http/Https' ]);
	}
	else
	{
		args = GetUrlParms(tab.url);
		ori_url = args[ 'url' ];
		if( ori_url )
			chrome.tabs.update( tab.id, {url: decodeURIComponent(ori_url) }, function(tab){});
		else
		{
			ori_url = args[ 'imgrefurl' ];
			if( ori_url )
				chrome.tabs.update( tab.id, {url: decodeURIComponent(ori_url) }, function(tab){});
		}
		_gaq.push(['_trackEvent', 'redirect', 'Go refURL_'+tab.url.substr(14,4) ]);
	}
}

chrome.pageAction.onClicked.addListener(ActionClick);
	
function onRequest(request, sender, sendResponse) {
	if( request.event == "gok" )
	{
		if( request.label == "gfinish" )
		{
			_gaq.push(['_trackEvent', 'search', 'Google_OK' ]);
		}
	}
	if( request.tosearch )
	{
		_gaq.push(['_trackEvent', 'redirect', request.tosearch ]);
	}
	if( request.search )
	{
		localStorage["word"] = request.search;
		_gaq.push(['_trackEvent', 'SearchLength', request.search.length+" " ]);
	}
	sendResponse({});
};
	
// Listen for the content script to send a message to the background page.
chrome.runtime.onMessage.addListener(onRequest);
 
var firstRun = (localStorage['firstRun'] == 'true');
if (!firstRun) {
	chrome.tabs.create({url:"options.html"},function(response) {});
	localStorage['firstRun'] = 'true';
}
 
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-22369668-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();