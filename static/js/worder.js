onmessage = function(e) {
	console.log('worker js message')
    postMessage('Please write two numbers');
}