/*
  ScrollbarReloaded v1.0.0
  (c) 2016 Depth Development. http://depthdev.com
  License: MIT
*/

(function(window) {
 	'use strict';

 	if (window.ScrollbarReloaded){return false;}

 	window.ScrollbarReloaded = function(devObj) {

 		let $$bootstrappedInstances = {
 			default: []
 		};
 		const $$o = devObj || {};
 		const $$minTrainLength = $$o.minHandleLength || 10;
 		const $$ns = 'scrollbar-reloaded';
 		const $$prefix = $$ns + '-';
 		const $$resizeDelay = $$o.resizeDelay || 17;

 		function $$scrollbarReloaded(instance, masterNamespace) {

 			const $this = {
 				content: undefined,
 				instance: instance,
 				master: masterNamespace,
 				mouse: {
 					dirX: false,
 					dirY: false,
 					pageX: 0,
 					pageXRange: [0,0],
 					pageY: 0,
 					pageYRange: [0,0]
 				},
 				resize: undefined,
 				scroll: function(){},
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
 				trainMinLength: $$minTrainLength,
 				x: {
 					ignore: false,
 					rail: undefined,
 					scrollPercent: 0,
 					track: undefined,
 					train: undefined,
 					trainWidth: 0
 				},
 				y: {
 					ignore: false,
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
	 			// NOTE: This gets replaced later when listeners are created and ready.
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
				// Ignore tracks?
				$this.x.ignore = $this.instance.getAttribute('scrollbar-reloaded-x') === 'false' ? true : false;
				$this.y.ignore = $this.instance.getAttribute('scrollbar-reloaded-y') === 'false' ? true : false;
	 		} // _reset();


	 		// RESIZE
	 		function _resize() {
	 			clearTimeout($this.resize);
	 			$this.resize = setTimeout(_reset, $$resizeDelay);
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
				$this.scroll($this.x.ignore ? 0 : $this.styles.left, $this.y.ignore ? 0 : $this.styles.top);
				// Move trains to associated positions
				const xPercentageMoved = 1 - (($this.styles.widthAvailable + $this.styles.left) / $this.styles.widthAvailable);
				const xPercentageMovedPixels = $this.styles.width * xPercentageMoved;
				const xTrainPercentageMovedPixels = $this.x.trainWidth * xPercentageMoved;
				$this.x.train.style.left = (xPercentageMovedPixels - xTrainPercentageMovedPixels) + 'px';

				const yPercentageMoved = 1 - (($this.styles.heightAvailable + $this.styles.top) / $this.styles.heightAvailable);
				const yPercentageMovedPixels = $this.styles.height * yPercentageMoved;
				const yTrainPercentageMovedPixels = $this.y.trainHeight * yPercentageMoved;
				$this.y.train.style.top = (yPercentageMovedPixels - yTrainPercentageMovedPixels) + 'px';
				if ($this.master) {
					// Same but scoped version of $$update, scrolls associated slaves
					for (let i=0,l=$$bootstrappedInstances[$this.master].length;i<l;i++) {
						$$bootstrappedInstances[$this.master][i].update($this.x.scrollPercent || 0, $this.y.scrollPercent || 0);
					}
				}
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
					e.preventDefault();
					e.stopPropagation();
					if (e.wheelDeltaX || e.wheelDeltaY) {
						_scroll(e.wheelDeltaX, e.wheelDeltaY);
					} else {
						_scroll(e.deltaMode ? -e.deltaX * 16 : -e.deltaX, e.deltaMode ? -e.deltaY * 16 : -e.deltaY);
					}
				});

				// Train mouse drag events
				$this.x.train.addEventListener('mousedown', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.mouse.pageXRange = [-e.target.offsetLeft + e.pageX, $this.styles.width - e.target.offsetLeft + e.pageX - $this.x.trainWidth];
					$this.mouse.pageX = e.pageX;
					$this.mouse.dirX = true;
					$this.x.track.style.opacity = 1;
					$this.x.track.setAttribute('scrollbar-reloaded-x-track', 'active');
					$this.y.track.style.opacity = 0;
				});
				$this.y.train.addEventListener('mousedown', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.mouse.pageYRange = [-e.target.offsetTop + e.pageY, $this.styles.height - e.target.offsetTop + e.pageY - $this.y.trainHeight];
					$this.mouse.pageY = e.pageY;
					$this.mouse.dirY = true;
					$this.x.track.style.opacity = 0;
					$this.y.track.style.opacity = 1;
					$this.y.track.setAttribute('scrollbar-reloaded-y-track', 'active');
				});
				$listenerClosures.mousemove = function(e) {
					e.preventDefault();
					e.stopPropagation();
					if ($this.mouse.pageX) {
						_scroll($this.mouse.dirX && e.pageX >= $this.mouse.pageXRange[0] && e.pageX <= $this.mouse.pageXRange[1] ? ($this.mouse.pageX - e.pageX) * $this.styles.widthMultiplier : e.pageX < $this.mouse.pageXRange[0] ? -$this.styles.left : -($this.styles.widthAvailable + $this.styles.left), 0);
						$this.mouse.pageX = e.pageX;
					} else if ($this.mouse.pageY) {
						_scroll(0, $this.mouse.dirY && e.pageY >= $this.mouse.pageYRange[0] && e.pageY <= $this.mouse.pageYRange[1] ? ($this.mouse.pageY - e.pageY) * $this.styles.heightMultiplier : e.pageY < $this.mouse.pageYRange[0] ? -$this.styles.top : -($this.styles.heightAvailable + $this.styles.top));
						$this.mouse.pageY = e.pageY;
					}
				};
				document.addEventListener('mousemove', $listenerClosures.mousemove);
				$listenerClosures.mouseup = function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.mouse.pageX = 0;
					$this.mouse.pageY = 0;
					$this.mouse.dirX = false;
					$this.mouse.dirY = false;
					$this.x.track.style.removeProperty('opacity');
					$this.y.track.style.removeProperty('opacity');
					$this.x.track.setAttribute('scrollbar-reloaded-x-track', '');
					$this.y.track.setAttribute('scrollbar-reloaded-y-track', '');
				};
				document.addEventListener('mouseup', $listenerClosures.mouseup);

				// Touch events
				$this.x.train.addEventListener('touchstart', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.mouse.pageXRange = [-e.target.offsetLeft + e.touches[0].pageX, $this.styles.width - e.target.offsetLeft + e.touches[0].pageX - $this.x.trainWidth];
					$this.mouse.pageX = e.touches[0].pageX;
					$this.mouse.dirX = true;
					$this.x.track.style.opacity = 1;
					$this.x.track.setAttribute('scrollbar-reloaded-x-track', 'active');
					$this.y.track.style.opacity = 0;
				});
				$this.y.train.addEventListener('touchstart', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.mouse.pageYRange = [-e.target.offsetTop + e.touches[0].pageY, $this.styles.height - e.target.offsetTop + e.touches[0].pageY - $this.y.trainHeight];
					$this.mouse.pageY = e.touches[0].pageY;
					$this.mouse.dirY = true;
					$this.x.track.style.opacity = 0;
					$this.y.track.style.opacity = 1;
					$this.y.track.setAttribute('scrollbar-reloaded-y-track', 'active');
				});
				$this.content.addEventListener('touchstart', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.mouse.pageX = e.touches[0].pageX;
					$this.mouse.pageY = e.touches[0].pageY;
					$this.mouse.dirX = true;
					$this.mouse.dirY = true;
					$this.x.track.style.opacity = 1;
					$this.y.track.style.opacity = 1;
				});
				$this.x.train.addEventListener('touchmove', function(e) {
					e.preventDefault();
					e.stopPropagation();
					if ($this.mouse.pageX) {
						_scroll(($this.mouse.pageX - e.touches[0].pageX) * $this.styles.widthMultiplier, 0);
						$this.mouse.pageX = e.touches[0].pageX;
					}
				});
				$this.y.train.addEventListener('touchmove', function(e) {
					e.preventDefault();
					e.stopPropagation();
					if ($this.mouse.pageY) {
						_scroll(0, ($this.mouse.pageY - e.touches[0].pageY) * $this.styles.heightMultiplier);
						$this.mouse.pageY = e.touches[0].pageY;
					}
				});
				$this.content.addEventListener('touchmove', function(e) {
					e.preventDefault();
					e.stopPropagation();
					if ($this.mouse.pageX || $this.mouse.pageY) {
						_scroll(e.touches[0].pageX - $this.mouse.pageX, e.touches[0].pageY - $this.mouse.pageY);
						$this.mouse.pageX = e.touches[0].pageX;
						$this.mouse.pageY = e.touches[0].pageY;
					}
				});
				$this.x.train.addEventListener('touchend', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.x.track.setAttribute('scrollbar-reloaded-x-track', '');
					$this.y.track.setAttribute('scrollbar-reloaded-y-track', '');
				});
				$this.y.train.addEventListener('touchend', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.x.track.setAttribute('scrollbar-reloaded-x-track', '');
					$this.y.track.setAttribute('scrollbar-reloaded-y-track', '');
				});

				// Rail mouseover
				$this.x.rail.addEventListener('mouseover', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.y.track.setAttribute($$prefix + 'y-track', 'hide');
				});
				$this.x.rail.addEventListener('mouseleave', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.y.track.setAttribute($$prefix + 'y-track', '');
				});
				$this.y.rail.addEventListener('mouseover', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.x.track.setAttribute($$prefix + 'x-track', 'hide');
				});
				$this.y.rail.addEventListener('mouseleave', function(e) {
					e.preventDefault();
					e.stopPropagation();
					$this.x.track.setAttribute($$prefix + 'x-track', '');
				});

				// X rail click
				$this.x.rail.addEventListener('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
					if (e.target === $this.x.rail) {
						const left = e.offsetX < window.getComputedStyle($this.x.train,null).getPropertyValue('left').replace(/px/,'') ? $this.styles.height - 20 : -$this.styles.height + 20;
						_scroll(left, 0);
					}
				});
				// Y rail click
				$this.y.rail.addEventListener('click', function(e) {
					e.preventDefault();
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
				$this.x.trainWidth = $this.x.trainWidth < $this.trainMinLength ? $this.trainMinLength : $this.x.trainWidth;
				if ($this.x.trainWidth >= $this.styles.width) {
					$this.instance.overflowX = 'auto';
					$this.x.track.style.display = 'none';
				} else {
					$this.x.track.style.display = 'block';
					$this.x.train.style.width = $this.x.trainWidth + 'px';
				}
				// Y train height
				$this.y.trainHeight = $this.styles.height * ($this.styles.height / $this.styles.heightScroll);
				$this.y.trainHeight = $this.y.trainHeight < $this.trainMinLength ? $this.trainMinLength : $this.y.trainHeight;
				if ($this.y.trainHeight >= $this.styles.height) {
					$this.instance.overflowY = 'auto';
					$this.y.track.style.display = 'none';
				} else {
					$this.y.track.style.display = 'block';
					$this.y.train.style.height = $this.y.trainHeight + 'px';
				}
			} // _setTrainLengths();


			// UPDATE
			function _update(xPercent, yPercent) {
				_scroll((xPercent * -$this.styles.widthAvailable) - $this.styles.left, (yPercent * -$this.styles.heightAvailable) - $this.styles.top);
			} // _update();


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
				$this.instance.appendChild($this.x.track);

				// Create Y
				$this.y.track = document.createElement('DIV');
				$this.y.track.setAttribute($$prefix + 'y-track','');
				$this.y.rail = document.createElement('DIV');
				$this.y.rail.setAttribute($$prefix + 'y-rail','');
				$this.y.train = document.createElement('DIV');
				$this.y.train.setAttribute($$prefix + 'y-train','');
				$this.y.rail.appendChild($this.y.train);
				$this.y.track.appendChild($this.y.rail);
				$this.instance.appendChild($this.y.track);

	      	// Scroll type
	      	(function() {
	      		const scrollType = $this.instance.getAttribute('scrollbar-reloaded-type');
		      	if (scrollType === 'scroll') {
		      		$this.scroll = function(x,y) {
		      			$this.instance.scrollLeft = -x;
		      			$this.instance.scrollTop = -y;
		      			$this.instance.style.position = 'static';
		      			$this.instance.parentElement.style.position = 'relative';
		      		};
		      	} else if (scrollType === 'margin') {
		      		$this.scroll = function(x,y) {
		      			$this.content.style.marginLeft = x + 'px';
		      			$this.content.style.marginTop = y + 'px';
		      		};
		      	} else {
		      		$this.scroll = function(x,y) {
		      			$this.content.style.left = x + 'px';
		      			$this.content.style.top = y + 'px';
		      		};		      		
		      		$this.content.style.position = 'relative';
		      	}
	      	})();

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
	 			reset: _reset,
	 			update: _update
	 		}

	 	} // $$scrollbarReloaded();


	 	// $$ALL: Loop through all instances and run the provided method against them.
	 	function $$all(method, param1, param2) {
	 		for (let p in $$bootstrappedInstances) {
	 			for (let i=0,l=$$bootstrappedInstances[p].length;i<l;i++) {
	 				$$bootstrappedInstances[p][i][method](param1, param2);
	 			}
	 		}
	 	} // $all();


	 	// $$BOOTSTRAP: Bootstrap all instances, and identify master/slave instances as well.
	 	function $$bootstrap() {
	 		Array.prototype.slice.call(document.querySelectorAll('[' + $$ns + ']:not([' + $$prefix + 'bootstrapped])')).forEach(function(e) {
	 			const namespace = e.getAttribute('scrollbar-reloaded');
	 			if (namespace.length) {
	 				const label = namespace.replace(/[^\-]+\-/,'');
	 				if (!$$bootstrappedInstances[label]) {
	 					$$bootstrappedInstances[label] = [];
	 				}
	 				if (/master/.test(namespace)) {
	 					$$bootstrappedInstances.default.push(new $$scrollbarReloaded(e, label));
	 				} else {
	 					$$bootstrappedInstances[label].push(new $$scrollbarReloaded(e));
	 				}
	 			} else {
	 				$$bootstrappedInstances.default.push(new $$scrollbarReloaded(e));
	 			}
	 		});
	 	} // $$bootstrap;


	 	// $$DESTROY: Destroy all window/document listeners
	 	function $$destroy() {
	 		$$all('destroy');
	 	} // $$destroy();


	 	// $$RESET: Reset all heights/widths.
	 	function $$reset() {
	 		$$all('reset');
	 	} // $$reset();


	 	// $$UPDATE: Updates all instances scroll points.
	 	function $$update(xPercent, yPercent) {
	 		$$all('update', xPercent, yPercent);
	 	} // $$update();


	 	return {
	 		bootstrap: $$bootstrap,
	 		bootstrapped: $$bootstrappedInstances,
	 		destroy: $$destroy,
	 		reset: $$reset,
	 		update: $$update
	 	}

  } // window.ScrollbarReloaded();
  
})(window);
