(function (win, document) {
	'use strict';

	function DOM(element) {
		this.element = document.querySelectorAll(element);this.element = document.querySelectorAll(element);
		
		this.on = (ev, func) => {
			Array.prototype.forEach.call(this.element, (element) => {   
				element.addEventListener(ev, func, false);
			})
		}
		
		this.get = () => {
			var elements = this.element;
			return elements;
		}

		this.forEach = (item) => {
			return Array.prototype.forEach.call(this.element, item);
		}

		DOM.prototype.map = function (item) {
			return Array.prototype.map.call(this.element, item);
		}
	}

	win.DOM = DOM;

})(window, document)