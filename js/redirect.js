document.getElementById('a_0').addEventListener('click',CheckRedirect);		//谷歌
document.getElementById('a_1').addEventListener('click',CheckRedirect);		//AOL Search
document.getElementById('a_2').addEventListener('click',CheckRedirect);		//百度
document.getElementById('a_3').addEventListener('click',CheckRedirect);		//必应
document.getElementById('a_4').addEventListener('click',CheckRedirect);		//雅虎
document.getElementById('a_5').addEventListener('click',CheckRedirect);		//搜狗
document.getElementById('a_6').addEventListener('click',CheckRedirect);		//360搜索
document.getElementById('a_7').addEventListener('click',CheckRedirect);		//自定义搜索1
document.getElementById('a_8').addEventListener('click',CheckRedirect);		//自定义搜索2
document.getElementById('a_9').addEventListener('click',CheckRedirect);		//自定义搜索3
document.getElementById('a_10').addEventListener('click',CheckRedirect);	//自定义搜索4
document.getElementById('a_11').addEventListener('click',CheckRedirect);	//自定义搜索5
document.getElementById('a_12').addEventListener('click',CheckRedirect);	//自定义搜索6

function CheckRedirect( )
{
	index = this.id.substr('a_'.length);
	redirect(index);
}

function redirect( index )
{
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs){ 
		tab = tabs[0];
		q ='';
		if( localStorage["word"] )
			q = localStorage["word"] ;
		else
		{
			insertCustomArray();
			host = GetHost(tab.url);
			i_host = inHostArray(host) ;
			args = GetUrlParms(tab.url);
			if( -1 < i_host )
			{
				q = args[ searchselect_array[ searchhost_array[i_host][1] ][2] ];
				$('in_q').value = q;
			}
		}
		if(q)
			newurl = searchselect_array[index][1] + q;
		else
			newurl = searchselect_array[index][3];

		chrome.tabs.update( tab.id, {url:newurl}, function(tab){});//*/
	});
	chrome.runtime.sendMessage({"tosearch": searchselect_array[index][0] }, function(response) {});
	SetNowLink( index );
}