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
	mAPI.modules.commercial.load('commercial');
});

$(window).resize(function(){
	mAPI.modules.commercial.fit();
});

mAPI = {
	modules : {
		getModule : function(module){
			var response = new Promise(function(resolve, reject){
				$.ajax({
					url : location.origin + '/ajax/getModule/' + module,
					type : 'post',
					dataType : 'json',
					success : function(re){
						resolve(re);
					},
					error : function(re){
						reject(re);
					}
				});
			});
			
			return response;
		},
		commercial : {
			load : function(){
				var response = mAPI.modules.getModule('commercial');
				
				response.then(function(result){
					if(result.status == 'ok'){
						var data = result.data;
						
						$.each(data, function(index, value){
							if(value.image && value.active){
								var settings = JSON.parse(value.content);
								var chunk = mAPI.modules.commercial.render(value, settings);
								
								$('#bs-alert').before(chunk);
								
								var time = 1;
								var cookie_name = 'commercial-' + value.id;
								var expires = 31536000;
								var path = '/';
								
								if(settings.repeat == 'day') expires = 86400;
								
								var cookie_obj = {
									expires : expires,
									path : path
								}
								
								var cookie_check = mAPI.cookie.getCookie(cookie_name);
								
								if(cookie_check != 'feedback'){
									if(cookie_check != settings.repeat || cookie_check == 'page') mAPI.cookie.deleteCookie(cookie_name);
								}
								
								$('body').delegate('#commercial-button-' + value.id, 'click', function(){
									var id = $(this).attr('data-id');
									var hash = $(this).attr('data-hash');
									mAPI.modules.commercial.feedback(id, hash);
								});
								
								if(settings.action == 'leave'){
									setTimeout(function(){
										$(document).mousemove(function(e){
											if(e.pageY - $(document).scrollTop() <= 5){
												if(!mAPI.cookie.getCookie(cookie_name)){
													mAPI.modules.commercial.align(value.id);
													$('#commercial-' + value.id).modal('show');
													mAPI.cookie.setCookie(cookie_name, settings.repeat, cookie_obj);
												}
											}
										});
									}, time*1000);
								} else if(settings.action == 'time'){
									time = settings.time;
									
									setTimeout(function(){
										if(!mAPI.cookie.getCookie(cookie_name)){
											mAPI.modules.commercial.align(value.id);
											$('#commercial-' + value.id).modal('show');
											mAPI.cookie.setCookie(cookie_name, settings.repeat, cookie_obj);
										}
									}, time*1000);
								}
							}
						});
						
						mAPI.modules.commercial.fit();
					} else{
						console.log('Модуль "Активная реклама" отключен');
					}
				}, function(reason){
					console.log('Ошибка загрузки модуля "Активная реклама". Причина:\r\n' + reason.statusText);
				});
			},
			render : function(data, settings){
				var content = '';
				var width_1 = settings['commercial-field-width-1'].replace('%', '');
				var width_2 = settings['commercial-field-width-2'].replace('%', '');
				
				var contacts = '';
				
				if(settings.contacts){
					contacts = '\
						<div style="width: 100%; position: absolute; bottom: 0; display: flex; align-items: center;">\
							<input data-name="' + settings['commercial-field-1'] + '" class="' + (data.css.input!='0'?'se__'+data.css.input:'') + ' commercial-field-' + data.id + '" type="text" value="" placeholder="' + settings['commercial-field-1'] + '" style="width: ' + (width_1/100)*77 + '%;' + (width_1=='0'?'display: none;':'') + '">\
							<input data-name="' + settings['commercial-field-2'] + '" class="' + (data.css.input!='0'?'se__'+data.css.input:'') + ' commercial-field-' + data.id + '" type="text" value="" placeholder="' + settings['commercial-field-2'] + '" style="width: ' + (width_2/100)*77 + '%;' + (width_2=='0'?'display: none;':'') + '">\
							<button data-id="' + data.id + '" data-hash="' + data.hash + '" id="commercial-button-' + data.id + '" class="' + (data.css.button!='0'?'se__'+data.css.button:'') + ' commercial-button" style="width: 33%;">' + (data.css.button_text!='0'?data.css.button_text:'Отправить') + '</button>\
						</div>\
					';
				}
				
				content = '\
					<div id="commercial-' + data.id + '" class="commercial-modal modal fade" data-width="' + settings.width + '" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">\
						<div class="modal-dialog modal-md" role="document" style="width: ' + settings.width + ';">\
							<div class="modal-content" style="width: ' + settings.width + '; border-radius: ' + settings['border-radius'] + '; overflow: hidden;">\
								<div>\
									<img class="commercial-image" src="' + data.image +'" style="width: ' + settings.width + ';">\
									' + contacts + '\
								</div>\
							</div>\
						</div>\
					</div>\
				';
				
				return content;
			},
			feedback : function(id, hash){
				var fields = [];
				
				$.each($('.commercial-field-' + id), function(index, value){
					if($(value).css('display') != 'none'){
						var arr = {
							name : $(value).attr('data-name'),
							value : $(value).val()
						}
						fields.push(arr);
					}
				});
				
				$.ajax({
					url : 'ajax/feedbackCommercial',
					type : 'post',
					dataType : 'json',
					data : {
						id : id,
						fields : fields,
						hash : hash
					},
					success : function(json){
						$('#text-alert').html(json.message);
						if(json.status == 'ok'){
							$('#bs-alert').unbind('hidden.bs.modal').bind('hidden.bs.modal', function(){
								$('#commercial-' + id).modal('hide');
								$('.commercial-field-' + id).val('');
							});
							mAPI.cookie.deleteCookie('commercial-' + id);
							mAPI.cookie.setCookie('commercial-' + id, 'feedback', {expires : 31536000, path : '/'});
						} else{
							if(json.error.length > 0){
								$('#text-alert').append("<br>Не заполнены поля:<br>");
								$.each(json.error, function(index, value){
									$('#text-alert').append(' - ' + value + "<br>");
								});
							}
						}
						$('#bs-alert').modal('show');
					},
					error : function(re){
						console.log(re);
					}
				});
			},
			align : function(id){
				var offset = '';
				$('#commercial-' + id).show();
				var height = $('#commercial-' + id + ' .modal-dialog').height();
				$('#commercial-' + id).hide();
				if(document.documentElement.clientHeight > height){
					offset = (document.documentElement.clientHeight - height) / 2 - 30;
				}
				$('#commercial-' + id + ' .modal-dialog').css('top', offset);
			},
			fit : function(){
				$.each($('.commercial-modal'), function(index, value){
					if(document.documentElement.clientHeight > $(value).find('.modal-dialog').height()){
						$(value).find('.modal-dialog').css('top', (document.documentElement.clientHeight - $(value).find('.modal-dialog').height()) / 2 - 30);
					} else{
						$(value).find('.modal-dialog').css('top', '');
					}
					
					if(window.innerWidth < 768){
						$(value).find('.modal-dialog').css({
							'width' : '98%',
							'margin-left' : '1%',
							'margin-right' : '1%'
						});
						$(value).find('.modal-content').css('width', '100%');
						$(value).find('.commercial-image').css('width', '100%');
					} else{
						var width = $(value).attr('data-width');
						$(value).find('.modal-dialog').css({
							'width' : width,
							'margin' : '0 auto'
						});
						$(value).find('.modal-content').css('width', width);
						$(value).find('.commercial-image').css('width', width);
					}
				});
			}
		}
	},
	cookie : {
		setCookie : function(name, value, options){
			options = options || {};

			var expires = options.expires;

			if (typeof expires == "number" && expires) {
				var d = new Date();
				d.setTime(d.getTime() + expires * 1000);
				expires = options.expires = d;
			}
			if (expires && expires.toUTCString) {
				options.expires = expires.toUTCString();
			}

			value = encodeURIComponent(value);

			var updatedCookie = name + "=" + value;

			for (var propName in options) {
				updatedCookie += "; " + propName;
				var propValue = options[propName];
				if (propValue !== true) {
					updatedCookie += "=" + propValue;
				}
			}

			document.cookie = updatedCookie;
		},
		getCookie : function(name){
			var matches = document.cookie.match(new RegExp(
				"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
			));
			return matches ? decodeURIComponent(matches[1]) : null;
		},
		deleteCookie : function(name){
			mAPI.cookie.setCookie(name, "", {
				expires: -1,
				path: '/'
			});
		}
	}
}

}
/*
     FILE ARCHIVED ON 19:00:08 Apr 01, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 21:22:30 Jun 08, 2022.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 93.533
  exclusion.robots: 0.101
  exclusion.robots.policy: 0.093
  RedisCDXSource: 0.582
  esindex: 0.007
  LoadShardBlock: 73.879 (3)
  PetaboxLoader3.datanode: 60.382 (5)
  CDXLines.iter: 16.093 (3)
  load_resource: 65.478
  PetaboxLoader3.resolve: 24.612
  loaddict: 33.236
*/