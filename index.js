(function (window, document, DOM) {
	'use strict';

	let $numbers = document.querySelector('[data-js="game-numbers"]');
	let $buttonType = new DOM('[data-js="game-type"] > button').get();
	let $buttonNumbers = new DOM('[data-js="game-numbers"] > button').get();
	let numberArr = [];
	
	let $type = 'Lotofácil';
	let $descption = document.querySelector('[data-js="game-info"]');
	let $maxNumber;
	let $price;
	let $color;
	let countMaxNumber = 1;


	var ajax = new XMLHttpRequest();
	ajax.open('GET', '/games.json');
	ajax.send();
	ajax.addEventListener('readystatechange', parseData);

	for (let typeGame of $buttonType) {
		typeGame.addEventListener('click', (ev) => {
			ev.preventDefault();
			let element = ev.target.closest('button');
			$type = typeGame.value;
			cleanNumbers();
			getData();
			typeGameActive($type, element);
		})
	}

	function getData() {
		const type = parseData();
		var description;
		var numbers;
		for (let i of type.types){
			if (i.type === $type) {
				description = i.description;
				numbers = i.range;
				$price = i.price;
				$maxNumber = i["max-number"];
				$color = i.color;
			}
		}

		$descption.innerHTML = description;
		createNumbersButton(numbers);
	}

	function cleanNumbers() {
		return $numbers.innerHTML = '';
	}

	function createNumbersButton(number) {
		for (let i = 1; i <= number; i++) {
			const button = document.createElement("button");
            $numbers.append(button);
			button.innerHTML = `
				${i}
			`;
		}
	}

	window.addEventListener('load', (ev) => {
		ev.preventDefault();
		ev = document.querySelector('[data-js="lotofacil"]');
		$type = ev.value;
		ev.click();
	}, false);

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
		} else if (ev.value === 'Quina') {
			document.querySelector('[data-js="mega-sena"]').classList.remove('ativo');
			document.querySelector('[data-js="lotofacil"]').classList.remove('ativo');
		} else {
			document.querySelector('[data-js="mega-sena"]').classList.remove('ativo');
			document.querySelector('[data-js="lotomania"]').classList.remove('ativo');
		}

		return ev.classList.add('ativo');

	}

	function parseData() {
		var result;
		
		try {
			result = JSON.parse(ajax.responseText);
		}
		catch (error) {
			result = null;
		}
		
		return result;
	}

})(window, document, window.DOM)