
// jquery closure
(function ( $ ) {
	
	
 	// plugin definition
	$.fn.bootslider = function(options) {
		
		var defaults = {
			snapToItem: true,
			next: false,
			previous: false
		};
		
		var settings = $.extend( {}, defaults, options );
		var dragging;
		var left;
		var x;
		var gallery = this;
		var firstItemWidth = gallery.find('>*:first-child').outerWidth(true);			
		
	
		// touch start doesnt prevent default
		this.on("touchstart.bootslider", function (e) {			
			dragging = true;
			x = pointerEventToXY(e).x;
			left = gallery.scrollLeft();
		});
		
		// mousedown prevents default, else it starts trying to select the text
		this.on("mousedown.bootslider", function (e) {
			e.preventDefault();
			dragging = true;
			x = pointerEventToXY(e).x;
			left = gallery.scrollLeft();
		});
		
		$(window).on("mouseup.bootslider touchend.bootslider", function (e) {
		//this.on("mouseup.bootslider touchend.bootslider", function (e) {
			if(dragging){
				dragging = false;
				if (settings.snapToItem) {
					var firstItem = gallery.find('.col:first-child')
					var firstItemWidth = firstItem.outerWidth(true)
					var nearest = Math.round(scrollleft /  firstItemWidth)
					var target = nearest * firstItemWidth;		
					gallery.animate( { scrollLeft: target }, 300);
				}
			}
		});
		
		this.on("touchmove.bootslider mousemove", function(e){
			
			if(dragging){
				
				var newX = pointerEventToXY(e).x;				
				scrollleft = left - newX + x;
				
				if (scrollleft <= 0) {
					flipTilesRight();	
				}
				
				if (scrollleft >= firstItemWidth) {					
					flipTilesLeft();					
				}
				
				gallery.scrollLeft(scrollleft)
			};
		});
		
		
		if (settings.next) {
			$(next).on("click", function(e){
				e.preventDefault();
				var firstItem = gallery.find('>*:first-child')
				var firstItemWidth = firstItem.outerWidth(true)
				scrollleft = gallery.scrollLeft() ;
				gallery.animate( { scrollLeft: scrollleft + firstItemWidth }, 300, function(){
					flipTilesLeft();
					gallery.scrollLeft(scrollleft)
				});
				
			});
		}
		
		if (settings.previous) {
			$(previous).on("click", function(e){
				e.preventDefault();
				var firstItem = gallery.find('>*:first-child')
				var firstItemWidth = firstItem.outerWidth(true)
				
								
				scrollleft = gallery.scrollLeft();
				flipTilesRight();
				gallery.scrollLeft(scrollleft)
				
				gallery.animate( { scrollLeft: scrollleft - firstItemWidth }, 300, function(){
					
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
		
	};
	
	
 
}( jQuery ));