function checkForValidUrl(tabId, changeInfo, tab) {
	if( !changeInfo.status )
		return;
	//if( 'loading' != changeInfo.status )
	//	return;
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
	insertCustomArray();
	host = GetHost( tab.url );
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
		if( 'checked' == localStorage['cb_switch'] )
		{
			chrome.pageAction.setPopup({popup: '', tabId: tab.id});
			chrome.pageAction.setTitle({title:'点击切换搜索引擎',tabId: tabId});
			chrome.pageAction.show(tabId);
			return;
		}
		chrome.pageAction.show(tabId);
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
	}
	else if( 'checked' == localStorage['cb_switch'] )
	{
		chrome.pageAction.setIcon({path:'img/icon-38-b.png',tabId: tab.id});
		index = 0;
		insertCustomArray();
		host = GetHost(tab.url);
		i_host = inHostArray(host) ;
		index = searchhost_array[i_host][1];
		for( i=0; i<search_array.length; i++ )
		{
			index++;
			if( index >= search_array.length )
				index = 0;
			cb_id = 'cb_' + index;
			if( 'checked' == localStorage[ cb_id ] )
				break;
		}
		q ='';
		if( localStorage["word"] )
			q = localStorage["word"] ;
		else
		{
			args = GetUrlParms(tab.url);
			if( -1 < i_host )
			{
				q = args[ searchselect_array[ searchhost_array[i_host][1] ][2] ];
			}
		}
		if(q)
			newurl = searchselect_array[index][1] + q;
		else
			newurl = searchselect_array[index][3];

		chrome.tabs.update( tab.id, {url:newurl}, function(tab){});
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
	}
}

chrome.pageAction.onClicked.addListener(ActionClick);
	
function onRequest(request, sender, sendResponse) {
	if( request.search )
	{
		localStorage["word"] = request.search;
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