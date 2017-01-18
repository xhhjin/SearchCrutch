function $(objStr){return document.getElementById(objStr);}
search_array =['google', 'aol', 'baidu','bing','yahoo','sogou','haosou'];
search_custom_num = 6;

var searchselect_array = 
[
	['Google','https://www.google.com.hk/search?hl=zh-CN&newwindow=1&q=','q','https://www.google.com.hk'],
	['AOL Search','http://www.aolsearch.com/search?q=','q','http://www.aolsearch.com'],
	['百度','https://www.baidu.com/s?wd=','wd','https://www.baidu.com'],
	['必应','https://cn.bing.com/search?q=','q','https://cn.bing.com'],
	['雅虎','https://search.yahoo.com/search?p=','p','https://search.yahoo.com'],
	['搜狗','https://www.sogou.com/web?query=','query','https://www.sogou.com'],
	['360搜索','https://www.so.com/s?q=','q','https://www.so.com'],
];
var searchhost_array =
[
	['www.google.com',0],
	['www.google.com.hk',0],
	['ipv4.google.com',0],
	[/www.google(\.\w+){1,2}/,0],
	['www.aolsearch.com',1],
	['search.aol.com',1],
	['www.baidu.com',2],
	['cn.bing.com',3],
	['www.bing.com',3],
	['search.yahoo.com',4],
	['www.sogou.com',5],
	['www.so.com',6]
];
function insertCustomArray()
{
	if (null == localStorage.getItem('custom_search_0'))
		return;
	for(i=search_array.length; i>7; i--)	// 判断是否需要删除尾部追加的自定义搜索
	{
		search_array.pop();
		searchhost_array.pop();
		searchselect_array.pop();
	}
	for(i=0; i<search_custom_num; i++)
	{
		custom_name_id = 'custom_name_' + i;
		custom_search_id = 'custom_search_' + i;
		var insert_array = 'custom_' + i;
		var custom_name  = localStorage[ custom_name_id ];
		var custom_search = localStorage[custom_search_id];	
		search_array.push(insert_array);
		insert_array = [GetHost(custom_search), 7+i];
		searchhost_array.push(insert_array);
		var qstr_array = 'q';
		var regexp = /[#?&]\w{1,7}=$|[#?&]\w{1,7}=&/g;	// q=    search=    keyword=
		qstr_array = custom_search.toLowerCase().match(regexp);
		if( qstr_array != null )
		{
			qstr_array = qstr_array[qstr_array.length-1];
			qstr_array = qstr_array.substr(1, qstr_array.length-2);
		}
		else
		{
			qstr_array = 'q';
		}
		insert_array = [custom_name, custom_search, qstr_array, 'http://'+GetHost(custom_search)];
		searchselect_array.push(insert_array);
	}
}
function inHostArray(host)
{
	for(i=0;i<searchhost_array.length;i++)
	{
		if( host.match(searchhost_array[i][0]) != null )
			return i;
	}
	return -1;
}
function GetUrlParms(hrefstr)    
{
	var args=new Object();
	//针对Google的情况，防止关键字分错，https://www.google.co.uk/?gws_rd=ssl#q=dd    https://www.google.co.jp/?gws_rd=ssl,cr#q=dd
	hrefstr = hrefstr.replace(/\?gws_rd=([^#\?&]+)/,"");
	//针对Google的情况 https://ipv4.google.com/sorry/index?continue=https://www.google.com.hk/search%3Fq%3Ddd    //https://ipv4.google.com/sorry/IndexRedirect?continue=https://www.google.com/search%3Fq%3Ddd
	if( hrefstr.match("//ipv4.google.com/") != null )
	{
		hrefstr = hrefstr.replace(/^https?:\/\/ipv4\.google\.com\/sorry\/([a-zA-Z0-9]+)\?continue=/, "");
		hrefstr = unescape(hrefstr);
	}
	else if( hrefstr.match("//www.soku.com/search_video/q_") != null )  //针对Soku的情况 http://www.soku.com/search_video/q_dd 替换 q_ 为 ?q=
	{
		hrefstr = hrefstr.replace(/^https?:\/\/www\.soku\.com\/search_video\/q_/, "http://www.soku.com/search_video/?q=");
	}
	else if( hrefstr.match("//s.weibo.com/weibo/") != null )  //针对微博搜索的情况 http://s.weibo.com/weibo/dd 添加 ?q=
	{
		hrefstr = hrefstr.replace(/^https?:\/\/s\.weibo\.com\/weibo\//, "http://s.weibo.com/weibo/?q=");
	}
	else if( hrefstr.match("//s.weibo.com/user/") != null )   //针对微博搜索的情况 http://s.weibo.com/user/dd 添加 ?q=
	{
		hrefstr = hrefstr.replace(/^https?:\/\/s\.weibo\.com\/user\//, "http://s.weibo.com/user/?q=");
	}
	pos = hrefstr.indexOf("?");
	if( 0 > pos)
		pos = hrefstr.indexOf("#");//针对Google的情况，没找到时重找一次： https://www.google.com.hk/#q=dd
	if( 0 > pos)
		pos = hrefstr.indexOf("&");//针对Google出错时的情况，寻找关键字： https://www.google.com.hk/search&q=dd
	if( 0 < pos)
	{
		query = hrefstr.substring(pos+1);
		var pairs=query.split("&");//在逗号处断开   
		for(var i=0;i<pairs.length;i++)   
		{   
			var pos=pairs[i].indexOf('=');//查找name=value   
			if( pos == -1 )   continue;//如果没有找到就跳过   
			var argname=pairs[i].substring(0,pos);//提取name   
			var value=pairs[i].substring(pos+1);//提取value   
			if( args[argname] == undefined )//只保留第一次找到的
				args[argname]=value;//存为属性   
		}
	}
	return args;
}
function GetHost(url)
{
	pos = url.indexOf("//");
	if( -1 < pos )
		host = url.substr(pos+2);
	else
		return 'www.google.com.hk';
	if( host.length > 0 )
	{
		pos = host.indexOf("/");
		if( -1 < pos )
			host = host.substr(0,pos);
	}
	return host.toLowerCase();
}
function getSearch( host )
{
	if(host)
	{
		for( i=0;i<search_array.length;i++)
		{
			if( -1 < host.indexOf( search_array[i] ) )
				return search_array[i];
		}
	}
}