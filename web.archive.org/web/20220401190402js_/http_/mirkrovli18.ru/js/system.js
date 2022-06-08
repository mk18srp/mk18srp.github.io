var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

$(document).ready(function(){
    
    $('#send-order').bind('click', function(){
    	clearForm();
    });
    
    $('#send-feedback').bind('click', function(){
    	$('#fname').val($('#name').val());
        $('#fmail').val($('#mail').val());
    });
	
	$('#myfeed').on('hidden.bs.modal', function(){
		clearForm();
	});
	
	var gtype = $('#gtype').val();
	
	if(gtype == '2.0'){
		$('#fsend').bind('click', function(e){
			e.preventDefault();
			sendFeedback();
		});
	}
    
    $('.feedmod').bind('keyup', function(){
    	$(this).css('border', '1px solid #b0b0b0');
    });
    
    $('body').bind('keyup', function(e){
    	if(e.which == 13){
        	if($('#myfeed').css('display') != 'none') $('#fsend').click();
        }
    });
	
	$('.modal').on('hidden.bs.modal', function(){
		if(checkModal()) $('body').addClass('modal-open');
	});
	
});

function checkModal(){
	var modal = $('.modal');
	var modalOpen = false;
	
	$.each(modal, function(index, value){
		if($(value).css('display') != 'none'){
			modalOpen = true;
		}
	});
	
	return modalOpen;
}

function animateAnchor(top, safeTop, time, effect, callback){
	var body = $('html, body');
	
	if(!top) top = 0;
	if(!safeTop) safeTop = 0;
	
	if(typeof(top) === 'string'){
		if($('#' + top.replace(/#/ig, '')).length){
			top = $('#' + top.replace(/#/ig, '')).offset().top - safeTop;
		} else{
			top = 0;
		}
	}
	
	if(!time) time = 500;
	if(!effect) effect = 'swing';
	
	body.stop().animate({scrollTop : top}, time, effect).promise().then(function(){
		if(typeof(callback) === 'function') callback();
	});
}

function sendFeedback(icode){
	$.ajax({
        url : location.origin + '/ajax/feedback',
        type : 'post',
        dataType : 'json',
        data : {
            fname : $('#fname').val(),
            fmail : $('#fmail').val(),
            fmessage : $('#fmessage').val(),
			agree : $('#agree').prop('checked')?1:0,
            fcode : icode?icode:$("#g-recaptcha-response").val()
        },
        success : function(json){
            if(json.status == 'ok'){
                $('.alert').removeClass('alert-danger').addClass('alert-success').show().html(json.message);
                $('#formTable').hide();
                setTimeout(function(){
                    $('#myfeed').modal('hide');
                }, 2500);
            } else{
				if(json.error.length > 0){
					$.each(json.error, function(index, value){
						$('#' + value).css('border', '1px solid red');
					});
				}
				$('.alert').removeClass('alert-success').addClass('alert-danger').show().html(json.message);
			}
            grecaptcha.reset();
        },
        error : function(){
            grecaptcha.reset();
        }
    });
}

function clearForm(){
    $('#fname').val('');
    $('#fmail').val('');
    $('#fmessage').val('');
    $('#formTable').show();
    $('.feedmod').css('border', '1px solid #b0b0b0');
    $('.alert').hide();
}

}
/*
     FILE ARCHIVED ON 19:04:02 Apr 01, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 21:22:30 Jun 08, 2022.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 62.346
  exclusion.robots: 0.163
  exclusion.robots.policy: 0.151
  RedisCDXSource: 0.772
  esindex: 0.01
  LoadShardBlock: 38.356 (3)
  PetaboxLoader3.datanode: 42.482 (5)
  CDXLines.iter: 19.339 (3)
  load_resource: 103.818
  PetaboxLoader3.resolve: 26.715
  loaddict: 71.062
*/