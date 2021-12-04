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
		
		//Page Loader
		loader:function() {
			if (JasonOptions.loader) {
				$(window).on("load", function() {
					$(".page-loader").fadeOut();
					$(window).trigger("jason.complete");
				});
			} else {
				$(document).ready(function() {
					$(window).trigger("jason.complete");
				});
				
				$(window).on("load", function() {
					$(window).trigger("jason.complete");
				});
			}
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
			
			//Portfolio item
			$(".portfolio-item a").on("click", function(e) {
				e.preventDefault();
				
				var $that = $(this);				
				
				if ($that.parent().find(".loading").length===0) {
					$("<div />").addClass("loading").appendTo($that.parent());
					$that.parent().addClass("active");
		
					var $loading = $(this).parent().find(".loading"),
						$container = $("#portfolio-details"), 
						timer = 1;
		
					if ($container.is(":visible")) {
						closeProject();
						timer = 800;
						$loading.animate({width:"70%"}, {duration:2000, queue:false});
					}
					
					setTimeout(function() {
						$loading.stop(true, false).animate({width:"70%"}, {duration:6000, queue:false});
						
						$.get($that.attr("href")).done(function(response) {
							$container.html(response);
							
							$container.imagesLoaded(function() {
								$loading.stop(true, false).animate({width:"100%"}, {duration:500, queue:true});
								
								$loading.animate({opacity:0}, {duration:200, queue:true, complete:function() {
									$that.parent().removeClass('active');
									$(this).remove();
		
									$container.show().css({opacity:0});
									$container.animate({opacity:1}, {duration:600, queue:false});
									
									$(document).scrollTo($container, 600, {offset:{top:0, left:0}});
									
									$container.attr("data-current", $that.attr("rel"));
								}});
							});
						}).fail(function() {
							$that.parent().removeClass("active");
							$loading.remove();
						});
					}, timer);
				}
			});
		
			//Close project
			var closeProject = function() {
				$("#portfolio-details").animate({opacity:0}, {duration:600, queue:false, complete:function() {
					$(this).hide().html("").removeAttr("data-current");
				}});
			};
			
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
	
			$('a[href^="#view-"]').on("click", function() {
				var $item = $('[rel="'+$(this).attr('href').substr(6)+'"]');
				
				if ($item.length>0) {
					$(document).scrollTo("#portfolio", JasonOptions.scrollSpeed, {offset:{top:-85, left:0}, onAfter:function() {
						$item.trigger("click");
					}});
				}
			});
		},
		
		//Share functions
		share:function(network, title, image, url) {
			//Window size
			var w = 650, h = 350, params = "width="+w+", height="+h+", resizable=1";
	
			//Title
			if (typeof title==="undefined") {
				title = $("title").text();
			} else if (typeof title==="string") {
				if ($(title).length>0) {title = $(title).text();}
			}
			
			//Image
			if (typeof image==="undefined") {
				image = "";
			} else if (typeof image==="string") {
				if (!/http/i.test(image)) {
					if ($(image).length>0) {
						if ($(image).is("img")) {
							image = $(image).attr("src");
						} else {
							image = $(image).find('img').eq(0).attr("src");
						}
					} else {
						image = "";
					}
				}
			}
			
			//Url
			if (typeof url==="undefined") {
				url = document.location.href;
			} else {
				url = document.location.protocol+"//"+document.location.host+document.location.pathname+url;
			}
			
			//Share
			if (network==="twitter") {
				return window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(title+" "+url), "share", params);
			} else if (network==="facebook") {
				return window.open("https://www.facebook.com/sharer/sharer.php?s=100&p[url]="+encodeURIComponent(url)+"&p[title]="+encodeURIComponent(title)+"&p[images][0]="+encodeURIComponent(image), "share", params);
			} else if (network==="pinterest") {
				return window.open("https://pinterest.com/pin/create/bookmarklet/?media="+image+"&description="+title+" "+encodeURIComponent(url), "share", params);
			} else if (network==="google") {
				return window.open("https://plus.google.com/share?url="+encodeURIComponent(url), "share", params);
			} else if (network==="linkedin") {
				return window.open("https://www.linkedin.com/shareArticle?mini=true&url="+encodeURIComponent(url)+"&title="+title, "share", params);
			}
			
			return;
		}	
		
	};

	/*IMAGENES GALERIA ZOOM*/
	$('img[data-enlargeable]').addClass('img-enlargeable').click(function(){
    var src = $(this).attr('src');
    var modal;
    function removeModal(){ modal.remove(); $('body').off('keyup.modal-close'); }
    modal = $('<div>').css({
        background: 'RGBA(0,0,0,0.8) url('+src+') no-repeat center',
        backgroundSize: 'contain',
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

//Share Functions
function shareTo(network, title, image, url) {
	return $.JasonTheme.share(network, title, image, url);
}

//Scroll
$(document).ready(function(){ 
    $(window).scroll(function(){ 
        if ($(this).scrollTop() > 100) { 
            $('#scroll').fadeIn(); 
        } else { 
            $('#scroll').fadeOut(); 
        } 
    }); 
    $('#scroll').click(function(){ 
        $("html, body").animate({ scrollTop: 0 }, 600); 
        return false; 
    }); 
});

$(document).ready(function() {
  $('a[href^="*"]').click(function() {
    var destino = $(this.hash);
    if (destino.length == 0) {
      destino = $('a[name="' + this.hash.substr(1) + '"]');
    }
    if (destino.length == 0) {
      destino = $('html');
    }
    $('html, body').animate({ scrollTop: destino.offset().top }, 600);
    return false;
  });
});



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