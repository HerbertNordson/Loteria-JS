(function (window, document) {
	'use strict';


	const app = (() => {
		
		let $numbers = document.querySelector('[data-js="game-numbers"]');
		let $listCart = document.querySelector('[data-js="items-cart"]');
		let $addCart = document.querySelector('[data-js="add-cart"]');
		let $clearGame = document.querySelector('[data-js="clear-game"]');
		let $descption = document.querySelector('[data-js="game-info"]');
		let $finalPrice = document.querySelector('[data-js="final-price"]');
		let $randomGame = document.querySelector('[data-js="complete-game"]');
		let $type;
		let $maxNumber;
		let $price;
		let $numButtons;
		let $color;

		let price;
		let finalPrice = 0;
		let lastPrice;
		let countMaxNumber = 0;
		let hasNumber = false;
		let numberArr = [];

		var ajax = new XMLHttpRequest();
		ajax.open('GET', '/games.json', true);
		ajax.send();
		ajax.addEventListener('readystatechange', parseData, false);

		$addCart.addEventListener('click', addCart, false);
		$clearGame.addEventListener('click', clearNumbers, false);
		$randomGame.addEventListener('click', randomGame, false);

		function initAction() {
			window.addEventListener('load', (ev) => {
				ev.preventDefault();
				ev = document.querySelector('[data-js="lotofacil"]');
				$type = ev.value;
				ev.click();
			}, false);
		}

		for (let typeGame of document.querySelectorAll('[data-js="game-type"] > button')) {
			typeGame.addEventListener('click', (ev) => {
				ev.preventDefault();
				let element = ev.target.closest('button');
				$type = typeGame.value;
				clearNumbers();
				getData();
				numbers();
				typeGameActive($type, element);
			})
		}

		function numbers() {
			if (countMaxNumber <= $maxNumber) {
				for (let e of document.querySelectorAll('.buttonNumbers')) {
			
					e.addEventListener('click', (ev) => {
						ev.preventDefault();

						for (let i = 0; i < numberArr.length; i++) {
							if (e.value === numberArr[i]) {
								e.setAttribute('style', `background: ${$color}`);
								numberArr.pop(numberArr[i]);
								countMaxNumber--;
								hasNumber = true;
							}
						}
					
						if (!hasNumber) {

							if (countMaxNumber >= $maxNumber) {
								alert('Jogo completo! Finalize a aposta ou exclua um número.');
								return;
							}

							e.setAttribute('style', `background: ${$color}`);
							countMaxNumber++;
							numberArr.push(e.value);
						}
					})
				}
			}
		}
	
		function addCart() {
			if (numberArr.length < $maxNumber) {
				alert('Por favor, insira todos os números!');
				return;
			}

			const nmb = numberArr.reduce((acumulado, atual) => { return acumulado + ',' + atual }, '');
			const li = document.createElement('li');
			price = $price;
			lastPrice = price;
			finalPrice = +finalPrice + +price;
			$listCart.append(li);
			li.innerHTML = `
			<button data-js="del">
				<img src="https://cdn.icon-icons.com/icons2/1489/PNG/512/rubbishbin_102620.png" alt="" />
			</button>
			<div>
				<p>${nmb}</p>
				<p data-js="typegame">${$type}<span data-js="game-price"> R$ ${price}</span></p>
			</div>
		`;

			includePriceFinal();
			removeItemCart();
			return clearNumbers();
		}

		function removeItemCart() {
			for (let remove of document.querySelectorAll('[data-js="del"]')) {
				remove.addEventListener('click', (ev) => {
					ev.preventDefault();
					let element = ev.target.closest('li')
					if (element.parentNode) {
						element.parentNode.removeChild(element);
						finalPrice = +finalPrice - +lastPrice;
						return includePriceFinal();
					}

				}, false);
			}
		}

		function includePriceFinal() {
			return $finalPrice.innerHTML = `${finalPrice.toFixed(2)}`;
		}

		function getData() {
			const type = parseData();
			var description;
			for (let i of type.types) {
				if (i.type === $type) {
					description = i.description;
					$numButtons = i.range;
					$price = i.price;
					$maxNumber = i["max-number"];
					$color = i.color;
				}
			}

			$descption.innerHTML = description;
			createNumbersButton($numButtons);
		}

		function clearNumbers() {
			countMaxNumber = 0;
			for (let e of document.querySelectorAll('.buttonNumbers')) {
				e.removeAttribute('style');
			}

			while (numberArr.length) {
				numberArr.pop();
			}
		}

		function randomGame() {
			for (let i = 0; i < $maxNumber; i++) {
				let random = Math.floor(Math.random() * $numButtons);
				while (numberArr.indexOf(random) >= 0) {
					random = Math.floor(Math.random() * $numButtons);
				}
				numberArr.push(random);
				countMaxNumber++;
			}

			if (numberArr.length === $maxNumber) {
				for (let but of document.querySelectorAll('.buttonNumbers')) {
					let buttonVal = +but.value;
					for (let index = 0; index < numberArr.length; index++) {
						if (buttonVal === numberArr[index])
							but.setAttribute('style', `background:${$color};`)
					
					}
				}
			}
		}

		function createNumbersButton(range) {
			$numbers.innerHTML = '';
			for (let i = 1; i <= range; i++) {
				const button = document.createElement("button");
				$numbers.append(button);
				button.innerHTML = `
			${i}
			`;
				button.classList.add('buttonNumbers');
				button.value = i;
			}
		
			return numbers;
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
				document.querySelector('[data-js="lotofacil"]').removeAttribute('style');
				document.querySelector('[data-js="lotomania"]').removeAttribute('style');
			} else if (ev.value === 'Quina') {
				document.querySelector('[data-js="lotofacil"]').removeAttribute('style');
				document.querySelector('[data-js="mega-sena"]').removeAttribute('style');
			} else {
				document.querySelector('[data-js="mega-sena"]').removeAttribute('style');
				document.querySelector('[data-js="lotomania"]').removeAttribute('style');
			}

			return ev.setAttribute('style', `background: ${$color}; color: #fff;`);

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
		
		initAction();
	})();

	app();

})(window, document)