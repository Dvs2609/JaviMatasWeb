var parameters =  new Array();

var settings_block = '<div class="block-settings-wrapper">\
		<div id="block_settings" class="block-settings">\
			<section>\
				<span class="orange" 	title="Orange" 	data-color="#ff5744" />\
				<span class="green" 	title="Green" 	data-color="#24b7a4" />\
				<span class="blue" 		title="Blue" 	data-color="#16b6ea" />\
				<span class="purple" 	title="Purple" 	data-color="#ca3378" />\
				<span class="yellow" 	title="Yellow" 	data-color="#ffbe00" />\
				<span class="grey" 		title="Grey" 	data-color="#656d78" />\
			</section>\
			<a href="#" id="settings_close">Close</a>\
		</div>\
	</div>';

//Init color buttons
function initColor() {
	$('.block-settings-wrapper section span').click(function() {	
		var cls = $(this).attr('class');
		var color = $(this).data("color");
		
		//CSS
		$("link.colors").attr('href', 'layout/colors/'+cls+'.css');
	});
}

//Init open/close button	
function initClose() {
	parameters.push('opened');
	
	$('#settings_close').click(function(e) {
		$('body').toggleClass('opened-settings');
		
		if(!$.cookies.get('opened')) {
			$.cookies.set('opened', 'opened-settings');
		} else {
			$.cookies.del('opened');
		}
		
		e.preventDefault();	
	});
}

//Init cookies
function initCookies() {
	for(key in parameters) {
		var name = parameters[key];
		var parameter = $.cookies.get(name);
		if(parameter) {
			$('body').addClass(parameter);
		}
	}
}

$(document).ready(function() {
	$('body').prepend(settings_block);
	initColor();	
	initClose();
	initCookies();
});