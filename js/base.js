function $(objStr){return document.getElementById(objStr);}
search_array =['google', 'aol', 'baidu','bing','yahoo','sogou','haosou'];
//var host_array=['www.google.com','www.baidu.com','cn.bing.com','www.yahoo.cn','www.sogou.com','www.so.com'];

// var qstr_array={};
// qstr_array['google'] = 'q';
// qstr_array['baidu'] = 'wd';
// qstr_array['bing'] = 'q';
// qstr_array['yahoo'] = 'p';
// qstr_array['sogou'] = 'query';
// qstr_array['haosou'] = 'q';

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
	if (null == localStorage.getItem('custom_search'))
		return;
	if( search_array.length > 7 )	// 判断是否需要删除尾部追加的自定义搜索
	{
		search_array.pop();
		searchhost_array.pop();
		searchselect_array.pop();
	}
	var insert_array = 'custom';
	var custom_search = localStorage['custom_search'];	
	search_array.push(insert_array);
	insert_array = [GetHost(custom_search), 7];
	searchhost_array.push(insert_array);
	var qstr_array = 'q';
	var regexp = /[#?&]\w{1,7}=$|[#?&]\w{1,7}=&/g;	// q=    search=    keyword=
	qstr_array = custom_search.toLowerCase().match(regexp);
	if( qstr_array != null )
	{
		qstr_array = qstr_array[qstr_array.length-1];
		qstr_array = qstr_array.substr(1, qstr_array.length-2);
	}
	insert_array = [localStorage['custom_name'], custom_search, qstr_array, 'http://'+GetHost(custom_search)];
	searchselect_array.push(insert_array);
}
function inHostArray(host)
{
	for(i=0;i<searchhost_array.length;i++)
	{
		if( host == searchhost_array[i][0] )
			return i;
	}
	return -1;
}
function GetUrlParms(hrefstr)    
{
	var args=new Object();
	pos = hrefstr.indexOf("?");
	if( 0 > pos)
		pos = hrefstr.indexOf("#");//针对Google的情况，没找到时重找一次： https://www.google.com.hk/#q=dd
	if( 0 < pos)
	{
		query = hrefstr.substring(pos+1);
		var pairs=query.split("&");//在逗号处断开   
		for(var i=0;i<pairs.length;i++)   
		{   
			var pos=pairs[i].indexOf('=');//查找name=value   
				if(pos==-1)   continue;//如果没有找到就跳过   
				var argname=pairs[i].substring(0,pos);//提取name   
				var value=pairs[i].substring(pos+1);//提取value   
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