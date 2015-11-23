if( input_wd )
	word = input_wd[0].value;
else
	word = '';
chrome.runtime.sendMessage({"search":word}, function(response) {});