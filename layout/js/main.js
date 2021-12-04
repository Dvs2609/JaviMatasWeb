(function($) {
	
	"use strict";
	
	/* Default Variables */
	var JasonOptions = {
		loader:true	
	};
	
	if (typeof Jason!=="undefined") {
		$.extend(JasonOptions, Jason);
	}
	
	$.JasonTheme = {
	
		//Initialize
		init:function() {
			this.menu();
			this.intro();
			this.textSlider();
			this.portfolio();
		},
	
		
		//Menu
		menu:function() {
			//Open menu
			$(".menu-btn-open").on("click", function(e) {
				e.preventDefault();
				
				$(".menu-lightbox").fadeIn("normal", function() {
					$(this).addClass("active");
				});
				
				$(".menu-btn-close").addClass("loaded");
			});
			
			//Close menu
			$(".menu-btn-close").on("click", function(e) {
				e.preventDefault();
				
				$(".menu-lightbox").delay(100).removeClass("active").delay(200).fadeOut("slow");
				$(".menu-btn-close").removeClass("loaded");
			});
			
			//Menu item
			$(".menu li a").on("click", function() {
				$(".menu-btn-close").trigger("click");
			});
		},
		
		//Intro
		intro:function() 
		{
			if ($(".intro").length===0) {return;}
			
			//Image background
			if ($(".intro.image-bg").length>0) 
			{
				$(".intro.image-bg").backstretch("images/image/bg.jpg");

			}

		},
		
		//Text slider
		textSlider:function() {
			if ($(".intro-text").length===0) {return;}
			
			var animationDelay = 2500,
				revealDuration = 1000,
				revealAnimationDelay = 1500;	
			
			var hideWord = function($word) {
				var nextWord = takeNext($word);
				
				$word.parents(".words-wrapper").animate({width:"2px"}, revealDuration, 
					function() {
						switchWord($word, nextWord);
						showWord(nextWord);
					}
				);
			};
		
			var showWord = function($word) {
				$word.parents(".words-wrapper").animate({"width":$word.width()+10}, revealDuration, 
					function() {
						setTimeout(function() { 
							hideWord($word); 
						}, revealAnimationDelay);
					}
				);
			};
			
			var switchWord = function($oldWord, $newWord) {
				$oldWord.removeClass("is-visible").addClass("is-hidden");
				$newWord.removeClass("is-hidden").addClass("is-visible");
			};
			
			var takeNext = function($word) {
				return (!$word.is(":last-child")) ? $word.next() : $word.parent().children().eq(0);
			};
			
			$(".intro-text").each(function() {
				var headline = $(this);
				var spanWrapper = headline.find(".words-wrapper");
				var newWidth = spanWrapper.width()+10;
					
				spanWrapper.css("width", newWidth);
				   
				//Trigger animation
				setTimeout(function() {
					hideWord(headline.find(".is-visible").eq(0));
				}, animationDelay);
			});
		},
		
		//Portfolio
		portfolio:function() {
			//Filters
			if ($(".works-filters").length>0) {
				$(".works-filters li").on("click", function(e) {
					e.preventDefault();
					
					var $that = $(this);
					
					$(".works-filters li").removeClass("active");
					$that.addClass("active");	
				});
			}
			
			//Mixitup
			if ($(".works").length>0) {
				var $works = document.querySelector(".works");
				var mixer = mixitup($works, {
					selectors:{
						control:"[data-mixitup-control]"
					}
				});
			}
			
			$(document.body).on("click", "#portfolio-details .icon.close i", function() {
				closeProject();
			});
			
			//Anchor Links for Projects
			var dh = document.location.hash;
	
			if (/#view-/i.test(dh)) {
				var $item = $('[rel="'+dh.substr(6)+'"]');
				
				if ($item.length>0) {
					$(document).scrollTo("#portfolio", 0, {offset:{top:0, left:0}});
					
					$(window).on("jason.complete", function() {
						$item.trigger("click");
					});
				}
			}
		}		
	};

	/*IMAGENES GALERIA ZOOM*/
	$('img[data-enlargeable]').addClass('img-enlargeable').click(function(){
    var src = $(this).attr('src');
    var modal;
    function removeModal(){ modal.remove(); $('body').off('keyup.modal-close'); }
    modal = $('<div>').css({
        background: 'RGBA(0,0,0,0.8) url('+src+') no-repeat center',
        backgroundSize: 'auto 60%',
        width:'100%', height:'100%',
        position:'fixed',
        zIndex:'10000',
        top:'0', left:'0',
        cursor: 'zoom-out'
    }).click(function(){
        removeModal();
    }).appendTo('body');
	
    //handling ESC
    $('body').on('keyup.modal-close', function(e){
      if(e.key==='Escape'){ removeModal(); } 
    });
});
	/*FIN DEL ZOOM*/


	//Initialize
	$.JasonTheme.init();

})(jQuery);




/**/
(function(){
	$(document).ready(function(){
		$(".btn-menu").click(function(e){
			e.preventDefault();
			var filtro = $(this).attr("data-filter");

			if (filtro == "todos") {
				$(".box-img").show(500);
			} else {
				$(".box-img").not("."+filtro).hide(500);
				$(".box-img").filter("."+filtro).show(500);
			}
		});

		$("nav ul li").click(function(){
			$(this).addClass("bo").siblings().removeClass("bo");
		});
	});
}())