if( input_wd )
	word = input_wd[0].value;
else
	word = '';
chrome.extension.sendRequest({"search":word}, function(response) {});