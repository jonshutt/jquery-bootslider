
// jquery closure
(function ( $ ) {
	
	
 	// plugin definition
	$.fn.bootslider = function(options) {
		
		var defaults = {
			snapToItem: true,
			buttons: false,
			next: false,
			previous: false,
			speed:400	,
			complete: null		
		};
		
		var settings = $.extend( {}, defaults, options );
		var dragging;
		var left;
		var x;
		var top;
		var y;
		var gallery = this;
		var firstItemWidth = gallery.find('>*:first-child').outerWidth(true);			
		
		gallery.addClass('bootslider');
		gallery.find('>').addClass('bootsliderItem');
		gallery.wrap("<div class='bootslider-wrapper'></div>");
		gallerywrap = gallery.parent();
		
		// touch start doesnt prevent default
		
		
		gallery.on("touchstart.bootslider", function (e) {	
			//e.preventDefault();	 // not sure if need this....	
			dragging = true;
			x = pointerEventToXY(e).x;
			left = gallery.scrollLeft();			
			//y = pointerEventToXY(e).y;
			//top = $(window).scrollTop();
		});
		
		// mousedown prevents default, else it starts trying to select the text
		gallery.on("mousedown.bootslider", function (e) {
			e.preventDefault();
			dragging = true;
			x = pointerEventToXY(e).x;
			left = gallery.scrollLeft();
			//y = pointerEventToXY(e).y;
			//top = $(window).scrollTop();
		});
		
		$(window).on("mouseup.bootslider touchend.bootslider", function (e) {
		//this.on("mouseup.bootslider touchend.bootslider", function (e) {
			if(dragging){
				
				dragging = false;
				if (settings.snapToItem) {
					var firstItem = gallery.find('>*:first-child')
					var firstItemWidth = firstItem.outerWidth(true)
					var nearest = Math.round(scrollleft /  firstItemWidth)
					
					var target = nearest * firstItemWidth;		
					
					gallery.animate( { scrollLeft: target }, settings.speed, function(){
					
						if (nearest ==1 ) {
							flipTilesLeft();
							gallery.scrollLeft(0)	
						}
						
						endMove();
					
					});
				}
				
				
			}
		});
		
		$(window).on("touchmove.bootslider mousemove", function(e){
			
			if(dragging){
				
				var newX = pointerEventToXY(e).x;				
				scrollleft = left - newX + x;
				
				//var newY = pointerEventToXY(e).y;				
				//scrolltop = top - newY + y;
				
				if (scrollleft <= 0) {
					flipTilesRight();	
				}
				
				if (scrollleft >= firstItemWidth) {					
					flipTilesLeft();					
				}
				
				gallery.scrollLeft(scrollleft)				

			};
		});
		
		if (settings.buttons) {
			
			gallerywrap.append("<a class='previous'>Previous</a><a class='next'>Next</a>");			
			settings.previous = '.previous';
			settings.next = '.next';
		}
		
		if (settings.next) {
			$(settings.next).on("click", function(e){
				e.preventDefault();
				var firstItem = gallery.find('>*:first-child')
				var firstItemWidth = firstItem.outerWidth(true)
				scrollleft = gallery.scrollLeft() ;
				gallery.animate( { scrollLeft: scrollleft + firstItemWidth }, settings.speed, function(){
					flipTilesLeft();
					gallery.scrollLeft(scrollleft)
					endMove();
				});
				
			});
		}
		
		if (settings.previous) {
			$(settings.previous).on("click", function(e){
				e.preventDefault();
				var firstItem = gallery.find('>*:first-child')
				var firstItemWidth = firstItem.outerWidth(true)
				
								
				scrollleft = gallery.scrollLeft();
				flipTilesRight();
				gallery.scrollLeft(scrollleft)
				
				gallery.animate( { scrollLeft: scrollleft - firstItemWidth }, settings.speed, function(){
					endMove();
				});
				
			});
		}
	   
   		
   		
   		function flipTilesLeft(){
   			// move first  item to the end
			gallery.find('>*:first-child').appendTo(gallery);			
			// reset widths and postions
			firstItemWidth = gallery.find('>*:first-child').outerWidth(true);						
			scrollleft -= firstItemWidth;
			left -= firstItemWidth;
			
			
   		}
   		
   		function flipTilesRight(){
   			// move last item to the front
			gallery.find('>*:last-child').prependTo(gallery);			
			firstItemWidth = gallery.find('>*:first-child').outerWidth(true);	
			
			scrollleft += firstItemWidth;
			left += firstItemWidth;
			
			
   		}
   		
		function endMove(){
			if ( $.isFunction( settings.complete ) ) {
				
				settings.complete( {
					firstChild: gallery.find('>*').eq(0)
				} );
			}
		}
   		
		
		// private function
		function pointerEventToXY(e){
			var out = {x:0, y:0};
			if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				out.x = touch.pageX;
				out.y = touch.pageY;
			} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
				out.x = e.pageX;
				out.y = e.pageY;
			}
			return out;
		};
		
		
		endMove();
		
		
	};
	
	
 
}( jQuery ));