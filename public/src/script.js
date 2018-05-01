$(document).ready(function(){
	
	if($(window).width()<800){
		$('.menu').css('display','none');
	}else{
		$('.menu').css('display','block');
	}
	$('.exit').hide();
	$('.open').show();
	$('.mobile-button').click(function(){
		$('.menu').toggle();
		$('.open').toggle();
		$('.exit').toggle();
	});
	
	var mn = $('.stick');
	$(window).scroll(function(){
		if($(this).scrollTop()>100){
			mn.addClass('stick-top');
		}else{
			mn.removeClass('stick-top');
		}
	});
	
	$(document).scroll(function(){
		if ($(document).scrollTop()>=200){
			$('#up').css('display','block');
		}else{
			$('#up').css('display','none');
		}
	});
	
});