function pageslider(item) {

	var $this = item,
		$body = document.body,
		$page = $this.children,
		winH = window.innerHeight || document.documentElement.clientHeight,
		winW = window.innerWidth || document.documentElement.clientWidth,
		nowWheel,
		nowHandle,
		lastCallWhile = 0,
		lastCallHandle = 0,
		pageActive = 0,
		pageCount = $page.length - 1,
		pageLength = $this.children.length,
		delta,
		touchStartPoint = {},
		touchNowPoint,
		yAbs,

		animationTime = 700,
		delayTime = animationTime,
		$navLi = document.getElementById('pageslider__nav').children,  // id of main nav > li
		$textBlock = document.getElementById('pageslider__for-text'),
		prevNav = true,
		$prev = document.getElementById('b-navkey__prev'),
		nextNav = true,
		$next = document.getElementById('b-navkey__next'),
		$navKeyloop = true,
		textArray = ['Ты можешь...', '... вставить текст ...', '... в зависимости ...', '... от слайда ...', 'Bye!'];



	$page[pageActive].classList.add('active');
	$body.setAttribute( 'data-pageslider-progress', Math.round(100 / (pageLength - 1) * pageActive) );
	$body.setAttribute( 'data-pageslider-number', pageActive + 1 );
	$navLi[pageActive].classList.add('active');

	if (textArray) {
		$textBlock.innerHTML = textArray[0];
	}


	// Wheel
	if (window.addEventListener) {

		if ('onwheel' in document) {
			// IE9+, FF17+, Ch31+
			window.addEventListener("wheel", onWheel);
		} else if ('onmousewheel' in document) {
			// old event variant
			window.addEventListener("mousewheel", onWheel);
		} else {
			// Firefox < 17
			window.addEventListener("MozMousePixelScroll", onWheel);
		}

	} else { // IE8-

		window.attachEvent("onmousewheel", onWheel);

	}


	// Touch
	document.addEventListener('touchstart', function(event) {

		event.preventDefault();
		event.stopPropagation();

		touchStartPoint.y = event.changedTouches[0].pageY;

	}, false);



	document.addEventListener('touchend', function(event) {

		touchNowPoint = event.changedTouches[0];

		yAbs = Math.abs(touchStartPoint.y - touchNowPoint.pageY);

		if (yAbs > 20) {

			if (touchNowPoint.pageY < touchStartPoint.y) {
				delta = 1;
			}
			else {
				delta = -1;
			}

			handle(delta, delayTime, false);

		}
	}, false);


	//Keybord
	document.addEventListener('keydown', function(event) {

		var keyCode = event.keyCode;

		keyNav(keyCode);

	}, false);


	if (prevNav) {

		$prev.addEventListener('click', function(event) {
			fnPrevNav();
		}, false);

		$prev.addEventListener('touchend', function(event) {
			fnPrevNav();
		}, false);

	}

	if (nextNav) {

		$next.addEventListener('click', function(event) {
			fnNextNav();
		}, false);

		$next.addEventListener('touchend', function(event) {
			fnNextNav();
		}, false);

	}

	function fnPrevNav() {

		if ( pageActive == 0 ) {

			if ($navKeyloop) {

				delta = 1;

				handle(delta, animationTime, true, pageCount, pageActive);
			}

		} else {

			delta = -1;
			
			handle(delta, animationTime);
		}
	}

	function fnNextNav() {

		if ( pageActive == pageCount ) {

			if ($navKeyloop) {

				delta = -1;

				handle(delta, animationTime, true, 0, pageActive);
			}

		} else {

			delta = 1;
			
			handle(delta, animationTime);
		}

	}



	for (var i = 0; i < $navLi.length; i++) {

		$navLi[i].num = i;

		$navLi[i].addEventListener('click', function(event) {
			clickNav(this);
		}, false);

		$navLi[i].addEventListener('touchend', function(event) {
			clickNav(this);
		}, false);

	};



	function clickNav(item) {

		var i = item.num;

		if (pageActive > i) {
			delta = -1;

			noActivePage = pageActive;
			
			handle(delta, animationTime, true, i, noActivePage);

		} else if (pageActive < i) {
			delta = 1;

			noActivePage = pageActive;

			handle(delta, animationTime, true, i, noActivePage);
		}
	}

	function keyNav(keyCode) {

		if ( keyCode == 87 || keyCode == 38 ) {
			// 87 - is arrow top
			// 38 - is arrow bottom
			delta = -1;

			noActivePage = pageActive;
			
			handle(delta, animationTime);

		} else if ( keyCode == 83 || keyCode == 40 ) {
			// 83 - is letter 'W'
			// 38 - is letter 'S'
			delta = 1;

			noActivePage = pageActive;

			handle(delta, animationTime);
		}
	}
	

	function onWheel(event) {

		nowWheel = Date.now();

		event = event || window.event;

		delta = event.deltaY || event.detail || event.wheelDelta;

		event.preventDefault ? event.preventDefault() : (event.returnValue = false);

		console.log(nowWheel - lastCallWhile);
		
		if (nowWheel - lastCallWhile > 100) { // 100 is number from practic
			handle(delta, delayTime);
		}

		lastCallWhile = nowWheel;
	}


	// delete all class active
	function classClean() {

		for (var i = pageCount; i >= 0; i--) {
			$page[i].classList.remove('active');
			$navLi[i].classList.remove('active');
		};

	}

	function handle(delta, delay, nav, i, noActivePage) {

		nowHandle = Date.now();

		if (nowHandle - lastCallHandle > delay) {

			if ( delta > 0 ) {

				if (nav) {
					
					pageActive = i;

					classClean();

					$page[pageActive].classList.add('active', 'pt-page-moveFromBottom');
					$page[noActivePage].classList.add('active', 'pt-page-moveToTopEasing', 'pt-page-ontop');
				
				} else {

					if( !( pageActive == pageCount ) ) {

						classClean();

						pageActive++;

						$page[pageActive].classList.add('active', 'pt-page-moveFromBottom');
						$page[pageActive].previousElementSibling.classList.add('active', 'pt-page-moveToTopEasing', 'pt-page-ontop');
					}
				}

			} else if ( delta < 0 ) {

				if (nav) {
					
					pageActive = i;

					classClean();

					$page[pageActive].classList.add('active', 'pt-page-moveFromTop', 'pt-page-ontop');
					$page[noActivePage].classList.add('active', 'pt-page-moveToBottomEasing');
				
				} else {

					if( !(pageActive == 0) ) {

						classClean();

						pageActive--;

						$page[pageActive].classList.add('active', 'pt-page-moveFromTop', 'pt-page-ontop');
						$page[pageActive].nextElementSibling.classList.add('active', 'pt-page-moveToBottomEasing');
					}
				}
			}

			$body.setAttribute( 'data-pageslider-progress', Math.round(100 / (pageLength - 1) * pageActive) );
			$body.setAttribute( 'data-pageslider-number', pageActive + 1 );
			$navLi[pageActive].classList.add('active');

			if (textArray) {
				$textBlock.innerHTML = textArray[pageActive];
			}

			setTimeout(func, animationTime);

			lastCallHandle = nowHandle;
		}

	}



	function func() { // add class for animation and
	//add active class for new slider

		for (var i = pageCount; i >= 0; i--) {
			$page[i].classList.remove('active', 'pt-page-ontop', 'pt-page-moveFromBottom', 'pt-page-moveToTopEasing', 'pt-page-moveToBottomEasing', 'pt-page-moveFromTop');
		};

		$page[pageActive].classList.add('active');
	}

};