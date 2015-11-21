function $(objStr){return document.getElementById(objStr);}
search_array =['google','baidu','bing','yahoo','sogou','youdao'];
//var host_array=['www.google.com','www.baidu.com','cn.bing.com','www.yahoo.cn','www.sogou.com','www.youdao.com'];

// var qstr_array={};
// qstr_array['google'] = 'q';
// qstr_array['baidu'] = 'wd';
// qstr_array['bing'] = 'q';
// qstr_array['yahoo'] = 'q';
// qstr_array['sogou'] = 'query';
// qstr_array['youdao'] = 'q';

var searchselect_array = 
[
	['Google','http://www.google.com.hk/search?hl=zh-CN&newwindow=1&q=','q','http://www.google.com.hk'],
	['Im Google','http://search.myrevery.com/search?hl=zh-CN&newwindow=1&q=','q','http://www.google.com.im'],
	['百度','http://www.baidu.com/s?wd=','wd','http://www.baidu.com'],
	['必应','http://cn.bing.com/search?q=','q','http://cn.bing.com'],
	['雅虎','http://www.yahoo.cn/s?q=','q','http://www.yahoo.cn'],
	['搜狗','http://www.sogou.com/web?query=','query','http://www.sogou.com'],
	['有道','http://www.youdao.com/search?q=','q','http://www.youdao.com'],
];
var searchhost_array =
[
	['www.google.com',0],
	['www.google.com.hk',0],
	['www.google.com.im',1],
	['search.myrevery.com',1],
	['myrevery.com',1],
	['www.baidu.com',2],
	['cn.bing.com',3],
	['www.yahoo.cn',4],
	['www.sogou.com',5],
	['www.youdao.com',6]
];
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