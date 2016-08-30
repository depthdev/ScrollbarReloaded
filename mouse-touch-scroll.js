/*
MouseTouchScroll v0.1.0b
(c) 2016 Depth Development. http://depthdev.com
License: MIT
*/

(function(window) {
	'use strict';

	if (window.MouseTouchScroll){return false;}

	window.MouseTouchScroll = function() {

		let $$bootstrappedInstances = [];
		const $$ns = 'mouse-touch-scroll';
		const $$prefix = $$ns + '-';

		function $$mouseTouchScroll(instance) {

			const $this = {
				content: undefined,
				instance: instance,
				mouse: {
				dirX: false,
				dirY: false,
				pageX: 0,
				pageXRange: [0,0],
				pageY: 0,
				pageYRange: [0,0]
				},
				resize: undefined,
				styles: {
					height: 0,
					heightScroll: 0,
					heightAvailable: 0,
					heightMultiplier: 0,
					width: 0,
					widthScroll: 0,
					widthAvailable: 0,
					widthMultiplier: 0,
					top: 0,
					left: 0
				},
				trainMinLength: 10,
				x: {
					rail: undefined,
					scrollPercent: 0,
					track: undefined,
					train: undefined,
					trainWidth: 0
				},
				y: {
					rail: undefined,
					scrollPercent: 0,
					track: undefined,
					train: undefined,
					trainHeight: 0
				}
			};
			const $listenerClosures = {};


 		// DESTROY
 		function _destroy() {

 		} // _destroy();


 		// RESET
 		function _reset() {
 			_setInstanceStyles();
 			_setTrainLengths();
 			// Set positions
 			$this.styles.left = -($this.styles.widthAvailable * $this.x.scrollPercent);
 			$this.content.style.left = $this.styles.left + 'px';
 			$this.styles.top = -($this.styles.heightAvailable * $this.y.scrollPercent);
 			$this.content.style.top = $this.styles.top + 'px';
			$this.x.train.style.left = (($this.styles.width * $this.x.scrollPercent) - ($this.x.trainWidth * $this.x.scrollPercent)) + 'px';
			$this.y.train.style.top = (($this.styles.height * $this.y.scrollPercent) - ($this.y.trainHeight * $this.y.scrollPercent)) + 'px';
 		} // _reset();


 		// RESIZE
 		function _resize() {
 			clearTimeout($this.resize);
 			$this.resize = setTimeout(_reset, 0);
 		} // _reset();


		// SCROLL
		function _scroll(x,y) {
			// Set scroll distances
			$this.styles.left += x;
			$this.styles.left = $this.styles.left < -$this.styles.widthAvailable ? -$this.styles.widthAvailable : $this.styles.left > 0 ? 0 : $this.styles.left;
			$this.x.scrollPercent = $this.styles.left / -$this.styles.widthAvailable;
			$this.styles.top += y;
			$this.styles.top = $this.styles.top < -$this.styles.heightAvailable ? -$this.styles.heightAvailable : $this.styles.top > 0 ? 0 : $this.styles.top;
			$this.y.scrollPercent = $this.styles.top / -$this.styles.heightAvailable;
			// Apply scroll distances
			$this.content.style.left = $this.styles.left + 'px';
			$this.content.style.top = $this.styles.top + 'px';
			// Move trains to associated positions
			const xPercentageMoved = 1 - (($this.styles.widthAvailable + $this.styles.left) / $this.styles.widthAvailable);
			const xPercentageMovedPixels = $this.styles.width * xPercentageMoved;
			const xTrainPercentageMovedPixels = $this.x.trainWidth * xPercentageMoved;
			$this.x.train.style.left = (xPercentageMovedPixels - xTrainPercentageMovedPixels) + 'px';

			const yPercentageMoved = 1 - (($this.styles.heightAvailable + $this.styles.top) / $this.styles.heightAvailable);
			const yPercentageMovedPixels = $this.styles.height * yPercentageMoved;
			const yTrainPercentageMovedPixels = $this.y.trainHeight * yPercentageMoved;
			$this.y.train.style.top = (yPercentageMovedPixels - yTrainPercentageMovedPixels) + 'px';
		} // _scroll();


 		// SET INSTANCE STYLES
 		function _setInstanceStyles() {

 			$this.styles.height = $this.instance.offsetHeight;
 			$this.styles.heightScroll = $this.instance.scrollHeight;
 			$this.styles.heightAvailable = $this.styles.heightScroll - $this.styles.height;
 			$this.styles.heightMultiplier = $this.styles.heightScroll / $this.styles.height;
 			$this.styles.width = $this.instance.offsetWidth;
 			$this.styles.widthScroll = $this.instance.scrollWidth;
 			$this.styles.widthAvailable = $this.styles.widthScroll - $this.styles.width;
 			$this.styles.widthMultiplier = $this.styles.widthScroll / $this.styles.width;

 		} // _setInstanceStyles();


		// SET LISTENERS
		function _setListeners() {

			// Wheel event
			$this.instance.addEventListener('wheel', function(e) {
				_scroll(e.wheelDeltaX || -e.deltaX, e.wheelDeltaY || -e.deltaY);
			});

			// Train mouse drag events
			$this.x.train.addEventListener('mousedown', function(e) {
				e.preventDefault();
				$this.mouse.pageXRange = [-e.target.offsetLeft + e.pageX, $this.styles.width - e.target.offsetLeft + e.pageX - $this.x.trainWidth];
				$this.mouse.pageX = e.pageX;
				$this.mouse.dirX = true;
				$this.x.track.style.opacity = 1;
				$this.y.track.style.opacity = 0;
			});
			$this.y.train.addEventListener('mousedown', function(e) {
				e.preventDefault();
				$this.mouse.pageYRange = [-e.target.offsetTop + e.pageY, $this.styles.height - e.target.offsetTop + e.pageY - $this.y.trainHeight];
				$this.mouse.pageY = e.pageY;
				$this.mouse.dirY = true;
				$this.x.track.style.opacity = 0;
				$this.y.track.style.opacity = 1;
			});
			$listenerClosures.mousemove = function(e) {
				e.preventDefault();
				if ($this.mouse.pageX || $this.mouse.pageY) {
					_scroll($this.mouse.dirX && e.pageX >= $this.mouse.pageXRange[0] && e.pageX <= $this.mouse.pageXRange[1] ? ($this.mouse.pageX - e.pageX) * $this.styles.widthMultiplier : 0, $this.mouse.dirY && e.pageY >= $this.mouse.pageYRange[0] && e.pageY <= $this.mouse.pageYRange[1] ? ($this.mouse.pageY - e.pageY) * $this.styles.heightMultiplier : 0);
					$this.mouse.pageX = e.pageX;
					$this.mouse.pageY = e.pageY;
				}
			};
			document.addEventListener('mousemove', $listenerClosures.mousemove);
			$listenerClosures.mouseup = function(e) {
				$this.mouse.pageX = 0;
				$this.mouse.pageY = 0;
				$this.mouse.dirX = false;
				$this.mouse.dirY = false;
				$this.x.track.style.removeProperty('opacity');
				$this.y.track.style.removeProperty('opacity');
			};
			document.addEventListener('mouseup', $listenerClosures.mouseup);

			// Touch events
			$this.x.train.addEventListener('touchstart', function(e) {
				e.preventDefault();
				$this.mouse.pageXRange = [-e.target.offsetLeft + e.touches[0].pageX, $this.styles.width - e.target.offsetLeft + e.touches[0].pageX - $this.x.trainWidth];
				$this.mouse.pageX = e.touches[0].pageX;
				$this.mouse.dirX = true;
				$this.x.track.style.opacity = 1;
				$this.y.track.style.opacity = 0;
			});
			$this.y.train.addEventListener('touchstart', function(e) {
				e.preventDefault();
				$this.mouse.pageYRange = [-e.target.offsetTop + e.touches[0].pageY, $this.styles.height - e.target.offsetTop + e.touches[0].pageY - $this.y.trainHeight];
				$this.mouse.pageY = e.touches[0].pageY;
				$this.mouse.dirY = true;
				$this.x.track.style.opacity = 0;
				$this.y.track.style.opacity = 1;
			});
			$this.content.addEventListener('touchstart', function(e) {
				e.preventDefault();
				$this.mouse.pageX = e.touches[0].pageX;
				$this.mouse.pageY = e.touches[0].pageY;
				$this.mouse.dirX = true;
				$this.mouse.dirY = true;
				$this.x.track.style.opacity = 1;
				$this.y.track.style.opacity = 1;
			});
			$this.x.train.addEventListener('touchmove', function(e) {
				e.preventDefault();
				if ($this.mouse.pageX) {
					_scroll(($this.mouse.pageX - e.touches[0].pageX) * $this.styles.widthMultiplier, 0);
					$this.mouse.pageX = e.touches[0].pageX;
				}
			});
			$this.y.train.addEventListener('touchmove', function(e) {
				e.preventDefault();
				if ($this.mouse.pageY) {
					_scroll(0, ($this.mouse.pageY - e.touches[0].pageY) * $this.styles.heightMultiplier);
					$this.mouse.pageY = e.touches[0].pageY;
				}
			});
			$this.content.addEventListener('touchmove', function(e) {
				e.preventDefault();
				if ($this.mouse.pageX || $this.mouse.pageY) {
					_scroll(e.touches[0].pageX - $this.mouse.pageX, e.touches[0].pageY - $this.mouse.pageY);
					$this.mouse.pageX = e.touches[0].pageX;
					$this.mouse.pageY = e.touches[0].pageY;
				}
			});

			// Rail mouseover
			$this.x.rail.addEventListener('mouseover', function(e) {
				$this.y.track.setAttribute($$prefix + 'y-track', 'hide');
			});
			$this.x.rail.addEventListener('mouseleave', function(e) {
				$this.y.track.setAttribute($$prefix + 'y-track', '');
			});
			$this.y.rail.addEventListener('mouseover', function(e) {
				$this.x.track.setAttribute($$prefix + 'x-track', 'hide');
			});
			$this.y.rail.addEventListener('mouseleave', function(e) {
				$this.x.track.setAttribute($$prefix + 'x-track', '');
			});

			// X rail click
			$this.x.rail.addEventListener('click', function(e) {
				e.stopPropagation();
				if (e.target === $this.x.rail) {
					const left = e.offsetX < window.getComputedStyle($this.x.train,null).getPropertyValue('left').replace(/px/,'') ? $this.styles.height - 20 : -$this.styles.height + 20;
					_scroll(left, 0);
				}
			});
			// Y rail click
			$this.y.rail.addEventListener('click', function(e) {
				e.stopPropagation();
				if (e.target === $this.y.rail) {
					const top = e.offsetY < window.getComputedStyle($this.y.train,null).getPropertyValue('top').replace(/px/,'') ? $this.styles.height - 20 : -$this.styles.height + 20;
					_scroll(0, top);
				}
			});

			// Resize
			window.addEventListener('resize', _resize);

		} // _setListeners();


		// SET TRAIN LENGTHS
		function _setTrainLengths() {
			// X train width
			$this.x.trainWidth = $this.styles.width * ($this.styles.width / $this.styles.widthScroll);
			if ($this.x.trainWidth >= $this.styles.width) {
				$this.instance.overflowX = 'auto';
				$this.x.track.style.display = 'none';
			} else {
				$this.x.track.style.display = 'block';
				$this.x.train.style.width = $this.x.trainWidth + 'px';
			}
			// Y train height
			$this.y.trainHeight = $this.styles.height * ($this.styles.height / $this.styles.heightScroll);
			if ($this.y.trainHeight >= $this.styles.height) {
				$this.instance.overflowY = 'auto';
				$this.y.track.style.display = 'none';
			} else {
				$this.y.track.style.display = 'block';
				$this.y.train.style.height = $this.y.trainHeight + 'px';
			}
		} // _setTrainLengths();


      // INIT
      (function() {

			// Wrap content
			$this.content = document.createElement('DIV');
			$this.content.setAttribute($$prefix + 'content','');
			while ($this.instance.firstChild) {
				$this.content.appendChild($this.instance.firstChild);
			}
			$this.instance.appendChild($this.content);

			// Create X
			$this.x.track = document.createElement('DIV');
			$this.x.track.setAttribute($$prefix + 'x-track','');
			$this.x.rail = document.createElement('DIV');
			$this.x.rail.setAttribute($$prefix + 'x-rail','');
			$this.x.train = document.createElement('DIV');
			$this.x.train.setAttribute($$prefix + 'x-train','');
			$this.x.rail.appendChild($this.x.train);
			$this.x.track.appendChild($this.x.rail);
			instance.appendChild($this.x.track);

			// Create Y
			$this.y.track = document.createElement('DIV');
			$this.y.track.setAttribute($$prefix + 'y-track','');
			$this.y.rail = document.createElement('DIV');
			$this.y.rail.setAttribute($$prefix + 'y-rail','');
			$this.y.train = document.createElement('DIV');
			$this.y.train.setAttribute($$prefix + 'y-train','');
			$this.y.rail.appendChild($this.y.train);
			$this.y.track.appendChild($this.y.rail);
			instance.appendChild($this.y.track);

			// Set listeners
			_setListeners();

			// Reset destroy now that listeners functions have been created
			_destroy = function() {
 				window.removeEventListener('resize', _resize);
 				document.removeEventListener('mousemove', $listenerClosures.mousemove);
				document.removeEventListener('mouseup', $listenerClosures.mouseup);
 			};

 			// Set as bootstrapped
 			$this.instance.setAttribute($$prefix + 'bootstrapped', 'true');

			// Reset();
			setTimeout(_reset,17);

 		})(); // init();

 		return {
 			destroy: _destroy,
 			reset: _reset
 		}

 	} // $$mouseTouchScroll();


 	function $$bootstrap() {
 		Array.prototype.slice.call(document.querySelectorAll('[' + $$ns + ']:not([' + $$prefix + 'bootstrapped])')).forEach(function(e) {
 			$$bootstrappedInstances.push(new $$mouseTouchScroll(e));
 		});
 	} // $$bootstrap;
 	$$bootstrap();

 	function $$destroy() {
 		for (let i=0,l=$$bootstrappedInstances.length;i<l;i++) {
 			$$bootstrappedInstances[i].destroy();
 		}
 	} // $$destroy();

 	function $$reset() {
 		for (let i=0,l=$$bootstrappedInstances.length;i<l;i++) {
 			$$bootstrappedInstances[i].reset();
 		}
 	} // $$reset();


 	return {
 		bootstrap: $$bootstrap,
 		destroy: $$destroy,
 		reset: $$reset
 	}

 } // window.MouseTouchScroll();
 
})(window);
