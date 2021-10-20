(function (window, document, DOM) {
	'use strict';

	let $buttonType = document.querySelectorAll('[data-js="game-type"] > button');
	let $type;
	var $descption = new DOM('[data-js="game-info"]');

	var ajax = new XMLHttpRequest();
	ajax.open('GET', '/games.json');
	ajax.send();
	ajax.addEventListener('readystatechange', handleReadyStateChange);

	function handleReadyStateChange() {
		var result;

		try {
			result = JSON.parse(ajax.responseText);
		}
		catch (error) {
			result = null;
		}
		
		return result;
	}

	document.addEventListener('DOMContentLoaded', (ev) => {
		ev.preventDefault();
		ev = document.querySelector('[data-js="lotofacil"]');
		$type = ev.value;
		ev.click();
	}, false);

	for (let typeGame of $buttonType) {
		typeGame.addEventListener('click', (ev) => {
			ev.preventDefault();
			let element = ev.target.closest('button');
			$type = typeGame.value;
			typeGameActive($type, element);
		})
	}

	function typeGameActive(game, target) {
		let type = game;
		let element = target;
		switch (type) {
			case 'Mega-Sena':
				addClass(element);
				break;
			case 'Quina':
				addClass(element);
				break;
			case 'Lotofácil':
				addClass(element);
				break;
		}

	}

	function addClass(ev) {
		if (ev.value === 'Mega-Sena') {
			document.querySelector('[data-js="lotofacil"]').classList.remove('ativo');
    		document.querySelector('[data-js="lotomania"]').classList.remove('ativo');
			getData(ev);
		} else if (ev.value === 'Quina') {
			document.querySelector('[data-js="mega-sena"]').classList.remove('ativo');
			document.querySelector('[data-js="lotofacil"]').classList.remove('ativo');
			getData(ev);
		} else {
			document.querySelector('[data-js="mega-sena"]').classList.remove('ativo');
			document.querySelector('[data-js="lotomania"]').classList.remove('ativo');
			getData(ev);
		}

		return ev.classList.toggle('ativo');

	}

	function getData(string) {
		var data = handleReadyStateChange();
		let types = //minha ideia vai ser utilizar um reduce aqui.;
		console.log(types)
		for (let i = 0; i < types.length; i++) {
			if (types[i].type === string) {
				$descption.get()[i].textContent = types[i].description;
				console.log(types[i].description);
			}
		}
	}
})(window, document, window.DOM)