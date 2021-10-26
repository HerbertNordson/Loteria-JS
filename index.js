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
		let lastItem;
		let novo;
		let lastColor;
		let init = true;
		let price = 0;
		let finalPrice = 0;
		let lastPrice;
		let countMaxNumber = 0;
		let numberArr = [];

		const ajax = new XMLHttpRequest();
		ajax.open('GET', '/games.json', true);
		ajax.send();
		ajax.addEventListener('readystatechange', parseData, false);

		$addCart.addEventListener('click', addCart, false);
		$clearGame.addEventListener('click', clearNumbers, false);
		$randomGame.addEventListener('click', randomGame, false);

		function cartElementNew() {
			if($listCart.childElementCount === 1)
			document.querySelector('.cart-none').classList.add('ativo')
		}

		function cartElementNone() {
			document.querySelector('.cart-none').classList.remove('ativo');
		}


		function titleType() {
			let $titleType = document.querySelector('[data-js="title-type"]');
			return $titleType.innerHTML = `${$type}`;
		}


		window.addEventListener('load', () => {
			const novo = document.querySelector('[data-js="game-type"]');
			getData();
			cartElementNew();
			includePriceFinal();
			buttonGame();
			novo.firstElementChild.click();
		}, false);
			
		function buttonGame() {
			for (let typeGame of document.querySelectorAll('[data-js="game-type"] > button')) {
				typeGame.addEventListener('click', (ev) => {
					ev.preventDefault();
					ev.target.classList.add('ativo');
					$type = typeGame.value;
					clearNumbers();
					titleType();
					cartElementNew();
					getData();
					typeGame.style.backgroundColor = `${$color}`;
					typeGame.style.color = `#fff`;
					removeActiveClass(typeGame);
				})
			}
		}

		function removeActiveClass(ev) {
			lastItem = ev;
			if (!init) {
				novo.style.color = `${lastColor}`;
				novo.style.backgroundColor = `transparent`;
				novo = lastItem;
				lastColor = $color;
			}
			else {
				init = false;
				novo = lastItem;
				lastColor = $color;
			}
		}

		function addCart() {
			if (numberArr.length < $maxNumber) {
				alert('Restam ' + ($maxNumber - numberArr.length) + ' números para completar o jogo da ' + $type );
				return;
			}

			const li = document.createElement('li');
			let nmb = numberArr.sort((a,b) => a - b);
			price = +$price;
			lastPrice = price;
			finalPrice = +finalPrice + +price;
			$listCart.append(li);
			li.innerHTML = `
			<button data-js="del">
				<img src="https://cdn.icon-icons.com/icons2/1489/PNG/512/rubbishbin_102620.png" alt="" />
			</button>
			<div style='border-left: 0.5em solid ${$color}'>
				<p>
				${nmb}
				</p>
				<p data-js="typegame" style='color:${$color}; font-weight: bold;'>${$type}<span data-js="game-price"> R$ ${price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span></p>
			</div>
		`;
			cartElementNone();
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
						includePriceFinal();
						cartElementNew();
					}

				}, false);
			}
			
		}

		function includePriceFinal() {
			return $finalPrice.innerHTML = `${finalPrice.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
		}

		function getData() {
			const type = parseData();
			let description;
			const typesGame = document.querySelector('[data-js="game-type"]');
			for (let i of type.types) {
				if (i.type === $type) {
					description = i.description;
					$numButtons = i.range;
					$price = i.price;
					$maxNumber = i["max-number"];
					$color = i.color;
				}
			}

			if (typesGame.childElementCount < type.types.length){
				for (let index = 0; index < type.types.length; index++) {
					const button = document.createElement('button');
					typesGame.append(button);
					button.innerHTML = `${type.types[index].type} `;
					button.setAttribute('style', `color:${type.types[index].color};`);
					button.setAttribute('value', `${type.types[index].type}`);
				}
			}



			$descption.innerHTML = description;
			createNumbersButton($numButtons);
		}

		function clearNumbers() {
			countMaxNumber = 0;
			while (numberArr.length) {
				numberArr.pop();
			}
			for (let e of document.querySelectorAll('.buttonNumbers')) {
				e.removeAttribute('style');
			}

			return;
		}

		function randomGame() {
			let rd = $maxNumber - numberArr.length;
			for (let i = 0; i < rd; i++) {
				let random = Math.floor((Math.random() * $numButtons) + 1);
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
		
			return numbers();
		}
		
		function numbers() {
			if (countMaxNumber <= $maxNumber) {
				for (let e of document.querySelectorAll('.buttonNumbers')) {
					e.addEventListener('click', (ev) => {
					ev.preventDefault();
						for (let i = 0; i < numberArr.length; i++) {
							if (numberArr[i] === +e.value) {
								e.removeAttribute('style');
								numberArr.splice(numberArr.indexOf(numberArr[i]), 1);
								countMaxNumber--;
								return;
							}
						}
						if (countMaxNumber < $maxNumber) {
							e.setAttribute('style', `background: ${$color}`);
							countMaxNumber++;
							numberArr.push(e.value);
						} else {
							alert('Jogo completo! Por favor exclua um número ou finalize a sua aposta!');
						}
					})
				}
			}
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

	})();

	app;

})(window, document)