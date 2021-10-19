(function (window, document) {
	'use strict';

	const ajax = new XMLHttpRequest();
	ajax.open('GET', '/games.json');
	ajax.send();
	ajax.addEventListener('readystatechange', handleReadyStateChange);

	function handleReadyStateChange() {
		let result;

		try {
			result = JSON.parse(ajax.responseText);
		}
		catch (error) {
			result = null;
		}

		return result;
	}

})(window, document)