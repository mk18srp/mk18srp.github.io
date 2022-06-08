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
	sAPI.tpl.settings.bg = {
		parallax : $('body').attr('data-parallax'),
		image : $('body').attr('data-bg-image')
	}
	
	sAPI.tpl.version = $('#__se_version').attr('data-version');
	
	sAPI.tpl.settings.page = JSON.parse($('.smart-tpl--page').val());
	sAPI.tpl.settings.modal.backdrop = $('#mbackdrop').val();
	sAPI.tpl.settings.modal.shadow = $('#mshadow').val();
	
	sAPI.tpl.render.parallax();
	sAPI.tpl.render.header();
	sAPI.tpl.render.anchor();
	sAPI.tpl.setter.anchor();
	sAPI.tpl.setter.radio();
	sAPI.tpl.menu.binders();
	sAPI.tpl.menu.activeAnchor();
	sAPI.tpl.menu.fixLastItem();
	sAPI.tpl.parallax.scroll();
	sAPI.tpl.feedback.binders();
	sAPI.tpl.cart.binders();
	sAPI.tpl.modal.binders();
	sAPI.tpl.modal.styler();
	
	sAPI.tpl.toTop.binders();
	sAPI.tpl.toTop.check();
	
	sAPI.element.fitHeight();
	
	sAPI.tpl.animation.apply();
});

window.onload = function(){
	sAPI.youtube.load();
	sAPI.tpl.render.video();
	
	sAPI.element.fitHeight();
	
	sAPI.tpl.animation.text();
	sAPI.tpl.animation.video();
	sAPI.tpl.animation.scroll();
	
	sAPI.tpl.feedback.init();
	sAPI.tpl.cart.init();
	
	sAPI.load.preloaderStop();
}

resizeTimeout = false;
		
$(window).resize(function(e){
	if(e.target === window){
		if(!sAPI.resize.start){
			sAPI.element.resetTranslate();
			sAPI.resize.start = true;
		}
		
		if(resizeTimeout){
			clearTimeout(resizeTimeout);
		}
		
		resizeTimeout = setTimeout(function(){
			resizeEnd();
		}, 99);
	}
});

function resizeEnd(){
	sAPI.element.fitHeight();
	sAPI.resize.start = false;
	resizeTimeout = false;
}

$(window).scroll(function(){
	sAPI.tpl.animation.text();
	sAPI.tpl.animation.video();
	sAPI.tpl.animation.scroll();
	sAPI.tpl.parallax.scroll();
	
	if(!sAPI.tpl.animation.anchor){
		sAPI.tpl.menu.refreshAnchor();
	}
	
	sAPI.tpl.toTop.check();
});

sAPI = {
	tpl : {
		version : '4.1.0',
		vl_type : $('body').hasClass('mobile') ? 'mobile' : 'desktop',
		settings : {
			bg : {},
			page : {},
			modal : {}
		},
		render : {
			parallax : function(){
				if(sAPI.tpl.vl_type == 'desktop' && sAPI.tpl.settings.bg.parallax == 'true'){
					//$('.layout-wrapper').parallax('destroy');
					$('.layout-wrapper').parallax({imageSrc : sAPI.tpl.settings.bg.image});
				}
			},
			header : function(){
				if(sAPI.tpl.settings.page['fixed-header']){
					$('.smart-header').addClass('smart-header--fixed');
					
					if(sAPI.tpl.settings.page['fixed-header-margin']){
						$('.smart-content').css('margin-top', $('.smart-header').outerHeight() + 'px');
					}
				}
				
				if(sAPI.tpl.settings.page['absolute-header']){
					$('.smart-header').addClass('smart-header--absolute');
				}
			},
			video : function(){
				var videoJSON = $('.smart-transfer--video');
				
				$.each(videoJSON, function(index, value){
					var videoData = JSON.parse($(value).html());
					
					$.each(videoData, function(key, val){
						$('.smart-object--vid[data-hash="' + key + '"]').html(atob(val));
					});
				});
				
				videoJSON.remove();
				
				var videoObject = $('.smart-object--vid[data-type!="youtube"]');
				
				$.each(videoObject, function(index, value){
					var isBackground = $(value).attr('data-bg') ? true : false;
					var isPlayHover = $(value).attr('data-ph') ? true : false;
					var video = $(value).find('video');
					var videoDOM = video.get(0);
					
					if(!isBackground && isPlayHover){
						if(sAPI.tpl.vl_type == 'desktop'){
							video.bind('mouseover', function(){
								var isPlaying = videoDOM.currentTime > 0 && !videoDOM.paused && !videoDOM.ended && videoDOM.readyState > 2;
								
								if(!isPlaying) videoDOM.play();
							});
							
							video.bind('mouseout', function(){
								var isPlaying = videoDOM.currentTime > 0 && !videoDOM.paused && !videoDOM.ended && videoDOM.readyState > 2;
								
								if(isPlaying) videoDOM.pause();
							});
						}
					}
					
					if(sAPI.helpers.isIE() && isBackground){
						var isPlaying = videoDOM.currentTime > 0 && !videoDOM.paused && !videoDOM.ended && videoDOM.readyState > 2;
						
						if(!isPlaying) videoDOM.play();
					}
					
					if($(value).hasClass('smart-object--embedded')){
						var dataBind = $(value).attr('data-bind');
						
						$('.modal-modal[data-bind="' + dataBind + '"]').bind('hidden.bs.modal', function(){
							var isPlaying = videoDOM.currentTime > 0 && !videoDOM.paused && !videoDOM.ended && videoDOM.readyState > 2;
							
							if(isPlaying) videoDOM.pause();
						});
					}
				});
			},
			anchor : function(){
				if(sAPI.tpl.settings.page['fixed-header']){
					var anchorObject = $('.smart-object--anchor');
					
					$.each(anchorObject, function(index, value){
						var prevStyle = value.style.top;
						var prevTop = Number(prevStyle.match(/(-?[\d]+?)px/i)[1]);
						
						if(!isNaN(prevTop)){
							var newTop = prevTop - $('.smart-header').outerHeight();
							var newStyle = prevStyle.replace(/(.*?)(-?[\d]+?)px(.*?)/ig, '$1' + newTop + 'px$3');
							
							$(value).css('top', newStyle);
						}
					});
				}
			}
		},
		setter : {
			anchor : function(){
				if(typeof(sAPI.helpers.animateAnchor) === 'function'){
					var anchorObject = $('.smart-object[data-linktype="anchor"], .smart-object--group[data-linktype="anchor"]');
					
					$.each(anchorObject, function(index, value){
						var url = $(value).attr('data-linkurl').replace(location.pathname, '');
						var id = url.replace(/^#/ig, '');
						var target = $(value).attr('data-linktarget');
						var time = $(value).attr('data-linktime');
						var callback = $(value).attr('data-linkcallback');
						var modal = $(value).attr('data-toggle') ? ( $(value).attr('data-toggle') == 'modal' ? true : false ) : false;
						
						if(!time) time = 500;
						
						if(id && !id.match(/\//ig) && $('#' + id).length && !modal){
							if(target == 'self'){
								$(value).bind('click', function(e){
									e.preventDefault();
									sAPI.helpers.animateAnchor(id, 0, time, false, callback);
								});
							}
						}
					});
					
					var anchorObjectExtended = $('a:not(.carousel-control)');
					
					$.each(anchorObjectExtended, function(index, value){
						var href = $(value).attr('href');
						
						if(href){
							var url = href.replace(location.pathname, '');
							var target = $(value).attr('target');
							var modal = $(value).attr('data-toggle') ? ( $(value).attr('data-toggle') == 'modal' ? true : false ) : false;
							
							if(url.match(/^#/ig) && target != '_blank' && !modal){
								var id = url.replace(/^#/ig, '');
								
								$(value).bind('click', function(e){
									e.preventDefault();
									
									var closeMenu = false;
									
									if(sAPI.tpl.vl_type == 'mobile'){
										var mobileMenu = $(value).parents('.mobile-menu');
										
										if(mobileMenu.length){
											sAPI.tpl.menu.close(mobileMenu.find('.mobile-menu--close').get(0), id);
											closeMenu = true;
										}
									}
									
									if(!closeMenu) sAPI.helpers.animateAnchor(id, 0, 500, false);
								});
							}
						}
					});
				} else{
					console.log('Системный javascript отключен');
				}
			},
			radio : function(){
				var radioObject = $('.smart-object--radio, .smart-object[data-render-type="radio"]');
				
				$.each(radioObject, function(index, value){
					$.each($('.smart-object--radio-option'), function(key, val){
						var label = $(val).find('.smart-object--radio-label');
						var input = $(val).find('.smart-object__form-field');
						var inputID = input.attr('name') + '__' + key;
						
						label.attr('for', inputID);
						input.attr('id', inputID);
					});
				});
			}
		},
		fit : {
			text : function(){
				var textArray = ['smart-object--title', 'smart-object--txt', 'smart-object--date', 'smart-object--cont', 'smart-object--head'];
				
				$.each($('.smart-object'), function(index, value){
					var hasClass = false;
					
					$.each(textArray, function(key, val){
						if($(value).hasClass(val)){
							hasClass = true;
							return false;
						}
					});
					
					if(hasClass){
						var prevHeight = $(value).outerHeight();
						var underneath = sAPI.element.fitTextPre($(value));
						
						sAPI.element.fitHeight($(value));
						
						var diffHeight = $(value).outerHeight() - prevHeight;
						
						sAPI.element.fitTextInit($(value), underneath, diffHeight);
					}
				});
			}
		},
		menu : {
			binders :function(){
				$('.smart-object--menu[data-mobile="1"]').bind('click', function(){
					var menu = $('.mobile-menu[data-menu="' + $(this).attr('data-hash') + '"]');
					var menuList = menu.find('.mobile-menu--list');
					var addClass = 'active-menu';
					
					if(menu.parent().hasClass('smart-header')) addClass = 'active-menu--header';
					if(menu.parent().hasClass('smart-footer')) addClass = 'active-menu--footer';
					
					$('body').addClass(addClass);
					menu.fadeIn();
					menuList.show('slide', {direction : 'left'}, 500);
					
					menu.find('.mobile-menu--close__line--top').css('transform', 'translate(-50%, -50%) rotate(45deg)');
					menu.find('.mobile-menu--close__line--bottom').css('transform', 'translate(-50%, -50%) rotate(-45deg)');
					
					$('._show_1e.wrap_mW').css('z-index', 0);
					$('#toTop, #to-top').css('z-index', 0);
				});
				
				$('.mobile-menu--link').bind('click', function(e){
					var menuInner = $(this).siblings('.mobile-menu--list--inner');
					var menuList = $(this).parent('.mobile-menu--item');
					var menuFont = $(this).attr('data-fnt');
					var menuFontActive = $(this).attr('data-fnta');
					var isActive = $(this).hasClass('active');
					var toggle = isActive ? 'slideUp' : 'slideDown';
					
					if(menuInner.length){
						e.preventDefault();
						
						$.each(menuList.siblings('.mobile-menu--item'), function(index, value){
							var currLink = $(value).find(' > .mobile-menu--link');
							var currInner = $(value).find(' > .mobile-menu--list--inner');
							var currFont = currLink.attr('data-fnt');
							var currFontActive = currLink.attr('data-fnta');
							
							if(currInner.length && currLink.hasClass('active')){
								currLink.removeClass('active ' + currFontActive).addClass(currFont);
								
								setTimeout(function(){
									currInner.slideUp();
								}, 99);
							}
						});
						
						if(!isActive) $(this).removeClass(menuFont).addClass('active ' + menuFontActive);
						
						var self = this;
						
						menuInner[toggle](function(){
							if(isActive) $(self).removeClass('active ' + menuFontActive).addClass(menuFont);
						});
					}
				});
				
				$('.mobile-menu--close').bind('click', function(){
					sAPI.tpl.menu.close(this);
				});
				
				$('.mobile-menu').bind('click', function(e){
					var closeButton = $(this).find('.mobile-menu--close').get(0);
					var target = $(e.target);
					var menuEvent = false;
					
					if(target.hasClass('mobile-menu--list') || target.parents().hasClass('mobile-menu--list')) menuEvent = true;
					
					if(!menuEvent) sAPI.tpl.menu.close(closeButton);
				});
				
				$('.smart-object--menu__item').bind('mouseover', function(){
					var menu = $(this).parents('.smart-object--menu');
					var menuList = menu.find('.smart-object--menu__list');
					var menuInner = $(this).find(' > .smart-object--menu__list--inner');
					var type = menu.attr('data-type');
					var eq = Number($(this).attr('data-eq'));
					
					if(menuInner.length){
						if(type == 'horizontal'){
							if(!isNaN(eq) && eq == 1){
								menu.attr({
									'data-btlr' : menuList.css('border-top-left-radius'),
									'data-bblr' : menuList.css('border-bottom-left-radius')
								});
								
								menuList.css({
									'border-top-left-radius' : 0,
									'border-bottom-left-radius' : 0
								});
							}
							
							if(!isNaN(eq) && eq == menu.find(' > ul > li').length){
								menu.attr({
									'data-btrr' : menuList.css('border-top-right-radius'),
									'data-bbrr' : menuList.css('border-bottom-right-radius')
								});
								
								menuList.css({
									'border-top-right-radius' : 0,
									'border-bottom-right-radius' : 0
								});
							}
						} else if(type == 'vertical'){
							if(!isNaN(eq) && eq == 1){
								menu.attr({
									'data-btlr' : menuList.css('border-top-left-radius'),
									'data-btrr' : menuList.css('border-top-right-radius')
								});
								
								menuList.css({
									'border-top-left-radius' : 0,
									'border-top-right-radius' : 0
								});
							}
							
							if(!isNaN(eq) && eq == menu.find(' > ul > li').length){
								menu.attr({
									'data-bblr' : menuList.css('border-bottom-left-radius'),
									'data-bbrr' : menuList.css('border-bottom-right-radius')
								});
								
								menuList.css({
									'border-bottom-left-radius' : 0,
									'border-bottom-right-radius' : 0
								});
							}
						}
						
						menuInner.show();
					}
				});
				
				$('.smart-object--menu__item').bind('mouseout', function(){
					var menu = $(this).parents('.smart-object--menu');
					var menuList = menu.find('.smart-object--menu__list');
					var menuInner = $(this).find(' > .smart-object--menu__list--inner');
					var type = menu.attr('data-type');
					var eq = Number($(this).attr('data-eq'));
					
					if(menuInner.length){
						if(type == 'horizontal'){
							if(!isNaN(eq) && eq == 1){
								menuList.css({
									'border-top-left-radius' : menu.attr('data-btlr'),
									'border-bottom-left-radius' : menu.attr('data-bblr')
								});
							}
							
							if(!isNaN(eq) && eq == menu.find(' > ul > li').length){
								menuList.css({
									'border-top-right-radius' : menu.attr('data-btrr'),
									'border-bottom-right-radius' : menu.attr('data-bbrr')
								});
							}
						} else if(type == 'vertical'){
							if(!isNaN(eq) && eq == 1){
								menuList.css({
									'border-top-left-radius' : menu.attr('data-btlr'),
									'border-top-right-radius' : menu.attr('data-btrr')
								});
							}
							
							if(!isNaN(eq) && eq == menu.find(' > ul > li').length){
								menuList.css({
									'border-bottom-left-radius' : menu.attr('data-bblr'),
									'border-bottom-right-radius' : menu.attr('data-bbrr')
								});
							}
						}
						
						menuInner.hide();
					}
				});
			},
			close : function(self, anchor){
				var menu = $(self).parent('.mobile-menu');
				var menuList = menu.find('.mobile-menu--list');
				var removeClass = 'active-menu';
				
				if(menu.parent().hasClass('smart-header')) removeClass = 'active-menu--header';
				if(menu.parent().hasClass('smart-footer')) removeClass = 'active-menu--footer';
				
				$(self).find('.mobile-menu--close__line').css('transform', 'translate(-50%, -50%) rotate(0deg)');
				
				$('body').removeClass(removeClass);
				
				menuList.hide('slide', {direction : 'left'}, 500, function(){
					if(anchor) sAPI.helpers.animateAnchor(anchor, 0, 500, false);
				});
				
				menu.fadeOut();
				
				$('._show_1e.wrap_mW').css('z-index', 2147483647);
				$('#toTop, #to-top').css('z-index', 999);
			},
			activeAnchor : function(){
				var menuObject = $('.smart-object--menu');
				
				$.each(menuObject, function(index, value){
					var menuElements = $(value).find('.smart-object--menu__item--link[data-type="anchor"]');
					var fontClass = $(value).attr('data-menu-fnt');
					var fontActiveClass = $(value).attr('data-menu-fnta');
					
					$.each(menuElements, function(key, val){
						$(val).bind('click', function(){
							menuElements.removeClass('active ' + fontActiveClass).addClass(fontClass);
							$(this).removeClass(fontClass).addClass('active ' + fontActiveClass);
						});
					});
				});
			},
			refreshAnchor : function(){
				var menuObject = $('.smart-object--menu');
				
				$.each(menuObject, function(index, value){
					var menuElements = $(value).find('.smart-object--menu__item--link[data-type="anchor"]');
					var fontClass = $(value).attr('data-menu-fnt');
					var fontActiveClass = $(value).attr('data-menu-fnta');
					
					menuElements.removeClass('active ' + fontActiveClass).addClass(fontClass);
				});
			},
			fixLastItem : function(){
				var menuObject = $('.smart-object--menu');
				
				$.each(menuObject, function(index, value){
					if($(value).attr('data-type') == 'horizontal'){
						var mainRow = $(value).find('.smart-object--menu__list > .smart-object--menu__item');
						
						if(mainRow.length){
							var lastItem = mainRow.eq(mainRow.length - 1);
							
							if(lastItem.length){
								var subRow = lastItem.find(' > .smart-object--menu__list--inner');
								
								if(subRow.length){
									var subItems = subRow.find(' > .smart-object--menu__item');
									
									if(subItems.css('min-width').match('%')) subItems.css('min-width', Math.round( lastItem.outerWidth() * ( Number( subItems.css('min-width').replace('%', '') ) / 100 ) ));
								}
							}
						}
						
						
						
					}
				});
			}
		},
		feedback : {
			sent : false,
			success : false,
			binders : function(){
				$('.modal').on('show.bs.modal', function(){
					$('body').bind('touchmove', function(e){
						var target = $(e.target);
						var modalEvent = false;
						
						if(target.hasClass('modal') || target.parents().hasClass('modal')) modalEvent = true;
						
						if(!modalEvent) e.preventDefault();
					});
				});
				
				$('.modal').on('hidden.bs.modal', function(){
					if($(this).hasClass('modal-feedback')){
						if(sAPI.tpl.feedback.sent && sAPI.tpl.feedback.success){
							var success = sAPI.tpl.feedback.success != -1 ? $('#modal-modal-' + sAPI.tpl.feedback.success) : $('#fb-success');
							
							success.modal('show');
							
							setTimeout(function(){
								success.modal('hide');
							}, 3500);
							
							sAPI.tpl.feedback.sent = false;
							sAPI.tpl.feedback.success = false;
						}
						
						sAPI.tpl.feedback.clear($(this).attr('data-bind'));
					}
					
					$('body').unbind('touchmove');
				});

				$('.smart-object--input input.smart-object__form-field, .smart-object--textarea textarea.smart-object__form-field').bind('input propertychange', function(){
					$(this).removeClass('smart-object__form-field--error');
				});

				$('.smart-object--select select.smart-object__form-field, .smart-object--checkbox input.smart-object__form-field').bind('change', function(){
					$(this).removeClass('smart-object__form-field--error');
				});
				
				$('.smart-object--radio input.smart-object__form-field').bind('change', function(){
					$(this).parents('.smart-object--radio-option')
						.removeClass('smart-object__form-field--error')
							.siblings('.smart-object--radio-option')
								.removeClass('smart-object__form-field--error');
				});
				
				$('.smart-object--input[data-type="phone"] .smart-object__form-field').mask('+9 (999) 999-99-99', {
					completed : function(){
						$(this).removeClass('smart-object__form-field--error');
					}
				});
				
				$('.smart-object--btn[data-linktype="feedback"]').bind('click', function(){
					var caller = $(this).attr('data-linkurl');
					var fbind = $(this).attr('data-fbind') ? $(this).attr('data-fbind') : false;
					
					if(fbind){
						$('#modal-feedback-' + fbind + ' .modal-feedback-caller').val(caller);
					}
				});
				
				$('[data-toggle="modal"]').bind('click', function(){
					var feedbackID = $(this).attr('data-target');
					
					if(feedbackID.match(/#modal\-feedback\-/ig)){
						var attrHTML = '';
						var node = $(this).find('.smart-object--btn').length ? $(this).find('.smart-object--btn').get(0) : this;
						var dataset = sAPI.helpers.getDataset(node);
						
						$.each(dataset, function(index, value){
							if(value.key.match(/^data\-se\-/ig)){
								var attrKey = value.key.replace(/^data\-se\-/ig, '');
								
								if(attrKey) attrHTML += ( '<br>' + attrKey + ': ' + value.value );
							}
						});
						
						if(!$(feedbackID).find('.modal-feedback-extra').length) $(feedbackID).find('.modal-feedback-caller').after('<input class="modal-feedback-extra" type="hidden" value="">');
						
						$(feedbackID).find('.modal-feedback-extra').val(attrHTML);
					}
				});
			},
			init : function(){
				var gactive = $('#gactive').val();
				var gkey = $('#gkey').val();
				
				$.each($('.smart-object--btn.smart-object--embedded'), function(index, value){
					var gbind = $(value).attr('data-bind');
					var fbind = $(value).attr('data-fbind');
					
					$(value).bind('click', function(){
						sAPI.tpl.feedback.send(gbind, fbind);
					});
				});
				
				if(gkey && gactive){
					$.each($('.smart-object--captcha'), function(index, value){
						var id = $(value).attr('id');
						var gbind = $(value).attr('data-gbind');
						var fbind = $(value).attr('data-fbind');
						
						var gcaptcha = grecaptcha.render(id, {
							'sitekey' : gkey,
							'callback' : function(code){
								sAPI.tpl.feedback.send(gbind, fbind, code, gcaptcha);
							},
							'size' : 'invisible',
							'badge' : 'inline'
						});
						
						$('.smart-object--btn[data-bind="' + gbind + '"]').unbind().bind('click', function(){
							grecaptcha.execute(gcaptcha);
						});
					});
				}
			},
			send : function(bind, id, code, gcaptcha){
				var data = {};
				var formFieldArray = ['input', 'select', 'textarea', 'checkbox', 'radio'];
				
				$.each($('.smart-object--embedded[data-bind="' + bind + '"]'), function(index, value){
					var type = 'void';
					var hash = $(value).attr('data-hash');
					
					if($(value).hasClass('smart-object--input')) 	type = 'input';
					if($(value).hasClass('smart-object--select')) 	type = 'select';
					if($(value).hasClass('smart-object--textarea')) type = 'textarea';
					if($(value).hasClass('smart-object--checkbox')) type = 'checkbox';
					if($(value).hasClass('smart-object--radio')) 	type = 'radio';
					
					var formField = type == 'radio' ? $(value).find('.smart-object__form-field:checked') : $(value).find('.smart-object__form-field');
					
					if($.inArray(type, formFieldArray) != -1){
						data[hash] = {
							type : type,
							field : false,
							required : $(value).attr('data-required') ? 1 : 0,
							name : $(value).attr('data-name') ? $(value).attr('data-name') : '',
							value : type == 'checkbox' ? ( formField.prop('checked') ? 1 : 0 ) : ( formField.val() ? formField.val() : '' )
						}
						
						if(type == 'input') data[hash].field = $(value).attr('data-type');
					}
				});
				
				$.extend(data, {
					id : id,
					caller : 0,
					href : location.href,
					gcaptcha : 0,
					code : '',
					extra : ''
				});
				
				if($('#modal-feedback-' + id).length){
					data.caller = $('#modal-feedback-' + id + ' .modal-feedback-caller').val();
					
					if($('#modal-feedback-' + id + ' .modal-feedback-extra').length){
						data.extra = $('#modal-feedback-' + id + ' .modal-feedback-extra').val();
					}
				}
				
				var gactive = $('#gactive').val();
				var gkey = $('#gkey').val();
				
				if(gcaptcha !== null && gcaptcha !== undefined){
					data.gcaptcha = 1;
					data.code = code;
				}
				
				$.ajax({
					url : location.origin + '/ajax/feedbackVL',
					type : 'post',
					dataType : 'json',
					data : data,
					success : function(json){
						if(json.status == 'ok'){
							var modal = $('.modal[data-bind="' + bind + '"]');
							var success = json.modal != -1 ? $('#modal-modal-' + json.modal) : $('#fb-success');
							
							sAPI.tpl.feedback.success = json.modal;
							
							if(sAPI.tpl.feedback.success == -1) success.find('.fb-success__inner--text').text(json.response);
							
							if(modal.length){
								sAPI.tpl.feedback.sent = true;
								
								modal.modal('hide');
							} else{
								success.modal('show');
								
								setTimeout(function(){
									success.modal('hide');
								}, 3500);
								
								sAPI.tpl.feedback.success = false;
							}
							
							sAPI.tpl.feedback.clear(bind);
						} else{
							if(json.error.length){
								$.each(json.error, function(index, value){
									var errorField = $('.smart-object--embedded[data-bind="' + bind + '"][data-hash="' + value + '"]');
									
									if(errorField.hasClass('smart-object--radio')){
										errorField.find('.smart-object--radio-option').addClass('smart-object__form-field--error');
									} else{
										errorField.find('.smart-object__form-field').addClass('smart-object__form-field--error');
									}
								});
							}
						}
						
						if(gcaptcha !== null && gcaptcha !== undefined){
							grecaptcha.reset(gcaptcha);
						}
					},
					error : function(){
						if(gcaptcha !== null && gcaptcha !== undefined){
							grecaptcha.reset(gcaptcha);
						}
					}
				});
			},
			clear : function(bind){
				$.each($('.smart-object--select[data-bind="' + bind + '"]'), function(index, value){
					var defaultOption = $(value).find('select.smart-object__form-field > option').eq(0);
					var defaultOptionName = defaultOption.text();
					var defaultOptionValue = defaultOption.val();
					
					$(value).find('select.smart-object__form-field')
						.val(defaultOptionValue)
						.removeClass('smart-object__form-field--error');
				});
				
				$('.smart-object--input[data-bind="' + bind + '"] input.smart-object__form-field').val('').removeClass('smart-object__form-field--error');
				$('.smart-object--textarea[data-bind="' + bind + '"] textarea.smart-object__form-field').val('').removeClass('smart-object__form-field--error');
				$('.smart-object--checkbox[data-bind="' + bind + '"] input.smart-object__form-field').prop('checked', false).removeClass('smart-object__form-field--error');
				$('.smart-object--radio[data-bind="' + bind + '"] .smart-object--radio-option').removeClass('smart-object__form-field--error').find('input.smart-object__form-field').prop('checked', false);
			}
		},
		modal : {
			binders : function(){
				$('.modal-feedback, .modal-modal').on('show.bs.modal', function(){
					$(this).css('display', 'flex');
				});
				
				$('.modal-feedback, .modal-modal').bind('click', function(e){
					if(sAPI.helpers.isIE()){
						if($(e.target).hasClass('modal-dialog')) $(this).modal('hide');
					}
				});
			},
			styler : function(){
				if(sAPI.tpl.settings.modal.backdrop) $('body').append('<style>.modal-backdrop {background-color: ' + sAPI.tpl.settings.modal.backdrop + ';} .modal-backdrop.in {opacity: 1;}</style>');
				if(!sAPI.tpl.settings.modal.shadow) $('.modal-content').css('box-shadow', 'none');
			}
		},
		cart : {
			success : false,
			binders : function(){
				$('.modal').on('hidden.bs.modal', function(){
					if($(this).hasClass('modal-modal') && sAPI.tpl.cart.success){
						sAPI.tpl.cart.success = false;
						
						location.href = '/';
					}
				});
				
				$('.smart-object--payment select').bind('change', function(){
					$(this).removeClass('smart-object__form-field--error');
				});
				
				$('.smart-object--delivery select').bind('change', function(){
					var delivery = $(this).val();
					
					sAPI.tpl.cart.delivery.update(delivery);
					
					$(this).removeClass('smart-object__form-field--error');
				});
				
				$('.smart-object--payment input').bind('change', function(){
					$(this).parents('.smart-object--radio-option')
						.removeClass('smart-object__form-field--error')
							.siblings('.smart-object--radio-option')
								.removeClass('smart-object__form-field--error');
				});
				
				$('.smart-object--delivery input').bind('change', function(){
					var name = $(this).attr('name');
					var delivery = $('.smart-object--delivery input[name="' + name + '"]:checked').val();
					
					sAPI.tpl.cart.delivery.update(delivery);
					
					$(this).parents('.smart-object--radio-option')
						.removeClass('smart-object__form-field--error')
							.siblings('.smart-object--radio-option')
								.removeClass('smart-object__form-field--error');
				});
			},
			init : function(){
				$.each($('.smart-object--btn.smart-object--cart-item'), function(index, value){
					$(value).bind('click', function(){
						sAPI.tpl.cart.send();
					});
				});
			},
			delivery : {
				update : function(id_delivery){
					$.ajax({
						url : '/ajax/add_cart_delivery',
						type : 'post',
						dataType : 'json',
						data : {
							id_delivery : id_delivery
						},
						success : function(cart){},
						error : function(error){}
					});
				}
			},
			send : function(){
				var data = {};
				var formFieldArray = ['input', 'select', 'textarea', 'checkbox', 'radio', 'payment', 'delivery'];
				
				$.each($('.smart-object--cart-item'), function(index, value){
					var type = 'void';
					var hash = $(value).attr('data-hash');
					
					if($(value).hasClass('smart-object--input')) 	type = 'input';
					if($(value).hasClass('smart-object--select')) 	type = 'select';
					if($(value).hasClass('smart-object--textarea')) type = 'textarea';
					if($(value).hasClass('smart-object--checkbox')) type = 'checkbox';
					if($(value).hasClass('smart-object--radio')) 	type = 'radio';
					if($(value).hasClass('smart-object--payment')) 	type = 'payment';
					if($(value).hasClass('smart-object--delivery')) type = 'delivery';
					
					var formField = $(value).find('.smart-object__form-field');
					
					if(type == 'radio') formField = $(value).find('.smart-object__form-field:checked');
					
					if((type == 'payment' || type == 'delivery') && $(value).attr('data-render-type') == 'radio'){
						formField = $(value).find('.smart-object__form-field:checked');
					}
					
					if($.inArray(type, formFieldArray) != -1){
						data[hash] = {
							type : type,
							field : false,
							required : $(value).attr('data-required') ? 1 : 0,
							name : $(value).attr('data-name') ? $(value).attr('data-name') : '',
							value : type == 'checkbox' ? ( formField.prop('checked') ? 1 : 0 ) : ( formField.val() ? formField.val() : '' )
						}
						
						if(type == 'input') data[hash].field = $(value).attr('data-type');
					}
				});
				
				$.ajax({
					url : location.origin + '/ajax/feedbackCart',
					type : 'post',
					dataType : 'json',
					data : data,
					success : function(json){
						if(json.status == 'ok'){
							var success = json.modal != -1 ? $('#modal-modal-' + json.modal) : $('#fb-success');
							
							sAPI.tpl.cart.success = json.modal;
							
							if(sAPI.tpl.cart.success != 0){
								if(sAPI.tpl.cart.success == -1) success.find('.fb-success__inner--text').text(json.response);
								
								success.modal('show');
								
								setTimeout(function(){
									success.modal('hide');
								}, 3500);
							} else{
								location.href = '/shop/cart/finish';
							}
							
							//console.log(json.payment);
							//console.log(json.delivery);
							
							sAPI.tpl.cart.clear();
						} else{
							if(json.error.length){
								$.each(json.error, function(index, value){
									var errorField = $('.smart-object--cart-item[data-hash="' + value + '"]');
									
									if(errorField.hasClass('smart-object--radio') || errorField.attr('data-render-type') == 'radio'){
										errorField.find('.smart-object--radio-option').addClass('smart-object__form-field--error');
									} else{
										errorField.find('.smart-object__form-field').addClass('smart-object__form-field--error');
									}
								});
							}
						}
					},
					error : function(error){
						console.error(error);
					}
				});
			},
			clear : function(){
				$.each($('.smart-object--select.smart-object--cart-item, .smart-object--payment[data-render-type="select"], .smart-object--delivery[data-render-type="select"]'), function(index, value){
					var defaultOption = $(value).find('select.smart-object__form-field > option').eq(0);
					var defaultOptionName = defaultOption.text();
					var defaultOptionValue = defaultOption.val();
					
					$(value).find('select.smart-object__form-field')
						.val(defaultOptionValue)
						.removeClass('smart-object__form-field--error');
				});
				
				$('.smart-object--input.smart-object--cart-item input.smart-object__form-field').val('').removeClass('smart-object__form-field--error');
				$('.smart-object--textarea.smart-object--cart-item textarea.smart-object__form-field').val('').removeClass('smart-object__form-field--error');
				$('.smart-object--checkbox.smart-object--cart-item input.smart-object__form-field').prop('checked', false).removeClass('smart-object__form-field--error');
				$('.smart-object--radio.smart-object--cart-item .smart-object--radio-option, .smart-object--payment[data-render-type="radio"].smart-object--cart-item .smart-object--radio-option,  .smart-object--delivery[data-render-type="radio"].smart-object--cart-item .smart-object--radio-option').removeClass('smart-object__form-field--error').find('input.smart-object__form-field').prop('checked', false);
			}
		},
		animation : {
			timeout : false,
			anchor : false,
			apply : function(smartObject, animationCompleteGroup){
				if(!smartObject) smartObject = $('.smart-object--head, .smart-object--date, .smart-object--cont, .smart-object--vcode, .smart-object--price, .smart-object--btn, .smart-object--overlay, .smart-object--img, .smart-object--vid, smart-object--group');
				
				$.each(smartObject, function(index, value){
					var animationEvent = $(value).attr('data-animation-event') ? $(value).attr('data-animation-event') : 'none';
					var animationType = $(value).attr('data-animation-type') ? $(value).attr('data-animation-type') : 'none';
					var animationEventScreen = $(value).attr('data-animation-event-screen') ? $(value).attr('data-animation-event-screen') : 'none';
					var animationTypeScreen = $(value).attr('data-animation-type-screen') ? $(value).attr('data-animation-type-screen') : 'none';
					var animationComplete = $(value).attr('data-animation-complete') ? true : false;
					var hasGroupAllow = true;
					
					var animationReady = animationEventScreen == 'none' || animationTypeScreen == 'none' || animationComplete;
					
					if($(value).hasClass('has-group') && !animationCompleteGroup){
						var group = $('.smart-object--group[data-hash="' + $(value).attr('data-group') + '"]');
						var animationEventGroup = group.attr('data-animation-event-screen') ? group.attr('data-animation-event-screen') : 'none';
						var animationTypeGroup = group.attr('data-animation-type-screen') ? group.attr('data-animation-type-screen') : 'none';
						
						if(animationEventGroup == 'scroll' && animationTypeGroup != 'none'){
							hasGroupAllow = false;
						}
					}
					
					if(animationEvent != 'none' && animationType != 'none' && animationReady && hasGroupAllow){
						var animationSpeed = $(value).attr('data-animation-speed') ? Number($(value).attr('data-animation-speed')) : 1;
						var animationDelay = $(value).attr('data-animation-delay') ? Number($(value).attr('data-animation-delay')) : 0;
						var animationScale = $(value).attr('data-animation-scale') ? Number($(value).attr('data-animation-scale')) : 1.2;
						var animationInfinite = $(value).attr('data-animation-infinite') ? ( $(value).attr('data-animation-infinite') == '1' ? true : false ) : false;
						var animationCallback = $(value).attr('data-animation-callback') ? $(value).attr('data-animation-callback') : '';
						var animationCallbackEnd = $(value).attr('data-animation-callback-end') ? $(value).attr('data-animation-callback-end') : '';
						
						var eventStart = 'mouseover';
						var eventEnd = 'mouseout';
						
						if(animationEvent == 'click'){
							eventStart = 'click';
							eventEnd = false;
						}
						
						var align = $(value).attr('data-align') ? $(value).attr('data-align') : 'left top';
						var left = $(value).get(0).style.left;
						var top = $(value).get(0).style.top;
						
						var animation_v1 = ['zoom_in', 'zoom_in_border', 'zoom_out', 'overlay_in', 'overlay_out'];
						
						if($(value).hasClass('smart-object--img') && $.inArray(animationType, animation_v1) != -1){
							var imageID = $(value).attr('data-hash');
							var imageOverlay = $(value).find('.smart-overlay--img');
							var imageImg = $(value).find('.smart-object--img__img');
							var imageBg = $(value).find('.smart-object--img__bg');
							var image = imageImg.length ? imageImg : imageBg;
							
							var scaleStart = 1;
							var scaleEnd = animationScale;
							var overlayStart = 'rgba(255, 255, 255, 0)';
							var overlayEnd = imageOverlay.attr('data-bg-color') ? imageOverlay.attr('data-bg-color') : 'rgba(255, 255, 255, 0)';
							
							if(animationType == 'zoom_out'){
								scaleStart = animationScale;
								scaleEnd = 1;
							}
							
							if(animationType == 'overlay_out'){
								overlayStart = imageOverlay.css('background-color');
								overlayEnd = 'rgba(255, 255, 255, 0)';
							}
							
							var cssObject = image;
							var cssProperty = 'transform';
							var cssValueStart = 'scale(' + scaleStart + ')';
							var cssValueEnd = 'scale(' + scaleEnd + ')';
							
							if(animationType.match(/overlay/ig)){
								cssObject = imageOverlay;
								cssProperty = 'background-color';
								cssValueStart = overlayStart;
								cssValueEnd = overlayEnd;
							}
							
							if(animationType == 'zoom_in'){
								$('.smart-object--img[data-hash="' + imageID + '"] .smart-overlay--img, .smart-object--img[data-hash="' + imageID + '"] .smart-object--img__img, .smart-object--img[data-hash="' + imageID + '"] .smart-object--img__bg').wrapAll('<div class="smart-object--img__wrapper" style="width: 100%; height: 100%;"></div>');
								
								cssObject = $('.smart-object--img[data-hash="' + imageID + '"] .smart-object--img__wrapper');
							}
							
							cssObject.css('transition', 'all ' + animationSpeed + 's');
							
							var hasGroup = $(value).hasClass('has-group');
							var singleImage = true;
							
							if(hasGroup){
								$.each($('.smart-object[data-group="' + $(value).attr('data-group') + '"][data-hash!="' + $(value).attr('data-hash') + '"]'), function(key, val){
									if($(val).hasClass('smart-object--img')){
										var siblingAnimationEvent = $(val).attr('data-animation-event') ? $(val).attr('data-animation-event') : 'none';
										var siblingAnimationType = $(val).attr('data-animation-type') ? $(val).attr('data-animation-type') : 'none';
										
										if(siblingAnimationEvent != 'none' && siblingAnimationType != 'none'){
											singleImage = false;
											return false;
										}
									}
								});
							}
							
							var eventStartFunction = function(){
								setTimeout(function(){
									if(animationEvent == 'click'){
										if(cssObject.attr('data-animation-complete')){
											cssObject.removeAttr('data-animation-complete');
											cssValue = cssValueStart;
										} else{
											cssObject.attr('data-animation-complete', true);
											cssValue = cssValueEnd;
										}
									} else{
										cssValue = cssValueEnd;
									}
									
									cssObject.css(cssProperty, cssValue);
								}, animationDelay*1000);
							}
							
							if(hasGroup && singleImage){
								$('.smart-object--group[data-hash="' + $(value).attr('data-group') + '"]').bind(eventStart, eventStartFunction);
							} else{
								$(value).bind(eventStart, eventStartFunction);
							}
							
							if(eventEnd){
								var eventEndFunction = function(){
									setTimeout(function(){
										cssObject.css(cssProperty, cssValueStart);
									}, animationDelay*1000);
								}
								
								if(hasGroup && singleImage){
									$('.smart-object--group[data-hash="' + $(value).attr('data-group') + '"]').bind(eventEnd, eventEndFunction);
								} else{
									$(value).bind(eventEnd, eventEndFunction);
								}
							}
						}
						
						if($.inArray(animationType, animation_v1) == -1 && animationType != 'custom'){
							$(value).addClass('animated' + ( animationInfinite ? ' infinite' : '' )).css({
								'animation-duration' : animationSpeed + 's',
								'animation-delay' : animationDelay + 's'
							});
						}
						
						var animationTimeout = false;
						
						$(value).bind(eventStart, function(){
							if(animationType == 'custom'){
								if(animationCallback){
									var self = this;
									eval(animationCallback);
								}
							} else{
								if(animationInfinite && animationEvent == 'hover'){
									if(align != 'left top') sAPI.element.alignAdaptive($(value), 'left top');
									
									$(value).addClass(animationType);
								} else{
									if(!$(value).hasClass(animationType) && !animationTimeout){
										if(align != 'left top') sAPI.element.alignAdaptive($(value), 'left top');
										
										$(value).addClass(animationType);
										
										animationTimeout = setTimeout(function(){
											$(value).removeClass(animationType);
											
											if(align != 'left top') $(value).css({'left' : left, 'top' : top}).attr('data-align', align);
											
											animationTimeout = false;
										}, animationSpeed*1000 + animationDelay*1000 + 100);
									}
								}
							}
						});
						
						if(eventEnd){
							$(value).bind(eventEnd, function(){
								if(animationType == 'custom'){
									if(animationCallbackEnd){
										var self = this;
										eval(animationCallbackEnd);
									}
								} else{
									if(animationInfinite && animationEvent == 'hover'){
										$(value).removeClass(animationType);
										
										if(align != 'left top') $(value).css({'left' : left, 'top' : top}).attr('data-align', align);
									}
								}
							});
						}
					}
				});
			},
			scroll : function(){
				var smartObject = $('.smart-object--head, .smart-object--date, .smart-object--cont, .smart-object--vcode, .smart-object--price, .smart-object--btn, .smart-object--overlay, .smart-object--img, .smart-object--vid, .smart-object--group');
				
				$.each(smartObject, function(index, value){
					var animationEvent = $(value).attr('data-animation-event-screen') ? $(value).attr('data-animation-event-screen') : 'none';
					var animationType = $(value).attr('data-animation-type-screen') ? $(value).attr('data-animation-type-screen') : 'none';
					var hasGroupAllow = true;
					
					if($(value).hasClass('has-group')){
						var group = $('.smart-object--group[data-hash="' + $(value).attr('data-group') + '"]');
						var animationEventGroup = group.attr('data-animation-event-screen') ? group.attr('data-animation-event-screen') : 'none';
						var animationTypeGroup = group.attr('data-animation-type-screen') ? group.attr('data-animation-type-screen') : 'none';
						
						if(animationEventGroup == 'scroll' && animationTypeGroup != 'none'){
							$(value).removeClass('animated-scroll');
							
							hasGroupAllow = false;
						}
					}
					
					if(animationEvent == 'scroll' && animationType != 'none' && hasGroupAllow){
						var animationSpeed = $(value).attr('data-animation-speed-screen') ? Number($(value).attr('data-animation-speed-screen')) : 1;
						var animationDelay = $(value).attr('data-animation-delay-screen') ? Number($(value).attr('data-animation-delay-screen')) : 0.3;
						var animationCallback = $(value).attr('data-animation-callback-screen') ? $(value).attr('data-animation-callback-screen') : '';
						
						var animationAllow = $(window).scrollTop() - ( $(value).outerHeight() / 2 ) >= $(value).offset().top - $(window).outerHeight();
						var animationStart = $(value).attr('data-animation-start') ? true : false;
						
						if(animationAllow && !animationStart){
							var align = $(value).attr('data-align') ? $(value).attr('data-align') : 'left top';
							var left = $(value).get(0).style.left;
							var top = $(value).get(0).style.top;
							
							if(align != 'left top') sAPI.element.alignAdaptive($(value), 'left top');
							
							$(value).addClass('animated').removeClass('animated-scroll').css({
								'animation-duration' : animationSpeed + 's',
								'animation-delay' : animationDelay + 's'
							});
							
							if(!$(value).hasClass(animationType)){
								$(value).addClass(animationType);
								$(value).attr('data-animation-start', true);
								
								setTimeout(function(){
									$(value).removeClass(animationType);
									$(value).attr('data-animation-complete', true);
									
									if(align != 'left top') $(value).css({'left' : left, 'top' : top}).attr('data-align', align);
									
									if($(value).hasClass('smart-object--group')){
										$.each($(value).find('.smart-object.has-group'), function(key, val){
											$(val).attr('data-animation-complete', true);
											
											sAPI.tpl.animation.apply($(val), true);
										});
									} else{
										sAPI.tpl.animation.apply($(value));
									}
								}, animationSpeed*1000 + animationDelay*1000);
							}
						}
					}
				});
			},
			text : function(smartObject){
				if(!smartObject) smartObject = $('.smart-object--txta');
				
				$.each(smartObject, function(index, value){
					var animationAllow = $(window).scrollTop() - $(value).outerHeight()*2 >= $(value).offset().top - $(window).outerHeight();
					var animationReady = $(value).attr('data-complete') ? true : false;
					
					if(animationAllow && !animationReady){
						var type = $(value).attr('data-type').split('_');
						var speed = Number($(value).attr('data-speed'))*1000;
						var infinite = $(value).attr('data-infinite') == '1' ? true : false;
						var hash = $(value).attr('data-hash');
						
						$(value).attr('data-complete', true).find('.smart-object__txt').addClass('smart-class__' + hash);
						
						switch(type[1]){
							case '1' : 
								var timeline = anime.timeline({loop: infinite});
								
								timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 1,
									duration: 0.1,
									delay : 0
								}).add({
									targets: '.smart-class__' + hash + ' .letter',
									scale: [4,1],
									opacity: [0,1],
									translateZ: 0,
									easing: "easeOutExpo",
									duration: speed,
									delay: function(el, i) {
										return 70*i;
									}
								});
									
								if(infinite) timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 0,
									duration: 1000,
									easing: "easeOutExpo",
									delay: 1000
								});
								
								break;
							case '2' : 
								var timeline = anime.timeline({loop: infinite});
								
								timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 1,
									duration: 0.1,
									delay : 0
								}).add({
									targets: '.smart-class__' + hash + ' .letter',
									opacity: [0,1],
									easing: "easeInOutQuad",
									duration: speed,
									delay: function(el, i) {
										return 150 * (i+1)
									}
								});
								
								if(infinite) timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 0,
									duration: 1000,
									easing: "easeOutExpo",
									delay: 1000
								});
								
								break;
							case '3' : 
								var timeline = anime.timeline({loop: infinite});
								
								timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 1,
									duration: 0.1,
									delay : 0
								}).add({
									targets: '.smart-class__' + hash + ' .letter',
									translateY: ["1.1em", 0],
									translateZ: 0,
									duration: speed,
									delay: function(el, i) {
										return 50 * i;
									}
								});
								
								if(infinite) timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 0,
									duration: 1000,
									easing: "easeOutExpo",
									delay: 1000
								});
								
								break;
							case '4' : 
								var timeline = anime.timeline({loop: infinite});
								
								timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 1,
									duration: 0.1,
									delay : 0
								}).add({
									targets: '.smart-class__' + hash + ' .letter',
									translateY: ["1.1em", 0],
									translateX: ["0.55em", 0],
									translateZ: 0,
									rotateZ: [180, 0],
									duration: speed,
									easing: "easeOutExpo",
									delay: function(el, i) {
										return 50 * i;
									}
								});
								
								if(infinite) timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 0,
									duration: 1000,
									easing: "easeOutExpo",
									delay: 1000
								});
								
								break;
							case '5' : 
								var timeline = anime.timeline({loop: infinite});
								
								timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 1,
									duration: 0.1,
									delay : 0
								}).add({
									targets: '.smart-class__' + hash + ' .letter',
									scale: [0, 1],
									duration: speed,
									elasticity: 600,
									delay: function(el, i) {
										return 45 * (i+1)
									}
								});
								
								if(infinite) timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 0,
									duration: 1000,
									easing: "easeOutExpo",
									delay: 1000
								});
								
								break;
							case '6' : 
								var timeline = anime.timeline({loop: infinite});
								
								timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 1,
									duration: 0.1,
									delay : 0
								}).add({
									targets: '.smart-class__' + hash + ' .letter',
									rotateY: [-90, 0],
									duration: speed,
									delay: function(el, i) {
										return 45 * i;
									}
								});
								
								if(infinite) timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 0,
									duration: 1000,
									easing: "easeOutExpo",
									delay: 1000
								});
								
								break;
							case '7' : 
								var timeline = anime.timeline({loop: infinite});
								
								timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 1,
									duration: 0.1,
									delay : 0
								}).add({
									targets: '.smart-class__' + hash + ' .letter',
									translateX: [40,0],
									translateZ: 0,
									opacity: [0,1],
									easing: "easeOutExpo",
									duration: speed,
									delay: function(el, i) {
										return 500 + 30 * i;
									}
								});
								
								if(infinite) timeline.add({
									targets: '.smart-class__' + hash + ' .letter',
									translateX: [0,-30],
									opacity: [1,0],
									easing: "easeInExpo",
									duration: speed - 100,
									delay: function(el, i) {
										return 100 + 30 * i;
									}
								});
								
								break;
							case '8' : 
								var timeline = anime.timeline({loop: infinite});
								
								timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 1,
									duration: 0.1,
									delay : 0
								}).add({
									targets: '.smart-class__' + hash + ' .letter',
									translateY: [100,0],
									translateZ: 0,
									opacity: [0,1],
									easing: "easeOutExpo",
									duration: speed,
									delay: function(el, i) {
										return 300 + 30 * i;
									}
								});
								
								if(infinite) timeline.add({
									targets: '.smart-class__' + hash + ' .letter',
									translateY: [0,-100],
									opacity: [1,0],
									easing: "easeInExpo",
									duration: speed - 200,
									delay: function(el, i) {
										return 100 + 30 * i;
									}
								});
								
								break;
							case '9' : 
								var timeline = anime.timeline({loop: infinite});
								
								timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 1,
									duration: 0.1,
									delay : 0
								}).add({
									targets: '.smart-class__' + hash + ' .letter',
									translateY: [-100,0],
									easing: "easeOutExpo",
									duration: speed,
									delay: function(el, i) {
										return 30 * i;
									}
								});
								
								if(infinite) timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 0,
									duration: 1000,
									easing: "easeOutExpo",
									delay: 1000
								});
								
								break;
							case '10' : 
								var timeline = anime.timeline({loop: infinite});
								
								timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 1,
									duration: 0.1,
									delay : 0
								}).add({
									targets: '.smart-class__' + hash + ' .letter',
									opacity: [0,1],
									easing: 'linear',
									duration: 0.1,
									delay: function(el, i) {
										return speed / 10 * (i+1)
									}
								});
								
								if(infinite) timeline.add({
									targets: '.smart-class__' + hash,
									opacity: 0,
									duration: 1000,
									easing: "easeOutExpo",
									delay: 1000
								});
								
								break;
						}
					}
				});
			},
			video : function(){
				var videoObject = $('.smart-object--vid[data-type!="youtube"]');
				
				$.each(videoObject, function(index, value){
					var isBackground = $(value).attr('data-bg') ? true : false;
					var isPlayHover = $(value).attr('data-ph') ? true : false;
					var video = $(value).find('video');
					var videoDOM = video.get(0);
					
					if(!isBackground && isPlayHover){
						if(sAPI.tpl.vl_type != 'desktop'){
							if($(window).scrollTop() - ( $(value).outerHeight() / 2 ) >= $(value).offset().top - $(window).outerHeight()){
								var isPlaying = videoDOM.currentTime > 0 && !videoDOM.paused && !videoDOM.ended && videoDOM.readyState > 2;
								
								if(!isPlaying){
									if(!video.attr('data-started')) videoDOM.play();
									
									video.attr({
										controls : 'controls',
										controlsList : 'nodownload',
										'data-started' : true
									});
								}
							}
						}
					}
				});
			}
		},
		parallax : {
			scroll : function(parallaxObject){
				if(!parallaxObject) parallaxObject = $('.smart-container.parallax, .smart-container--sub.parallax');
				
				$.each(parallaxObject, function(index, value){
					var settings = JSON.parse($(value).attr('data-settings'));
					var speed = $(value).attr('data-parallax-speed') ? Number($(value).attr('data-parallax-speed')) : 3;
					var coordY = window.pageYOffset / speed;
					
					var percentPositionMatch = {
						'left' : '0%',
						'center' : '50%',
						'right' : '100%'
					}
					
					coordY = -coordY;
					
					var coords = percentPositionMatch[settings['background-position'].split(' ')[0]] + ' ' + coordY + 'px';
					
					value.style.backgroundPosition = coords;
				});
			}
		},
		toTop : {
			check : function(){
				var toTop = $('#to-top');
				
				if(toTop.length){
					if(document.documentElement.scrollTop >= 600) toTop.fadeIn();
					else toTop.fadeOut();
				}
			},
			binders : function(){
				$('#to-top').bind('click', function(){
					sAPI.helpers.animateAnchor(0, 0, 500, false);
				});
			}
		},
		helpers : {
			doObjectsCollide : function(a, b){
				var aTop = a.offset().top;
				var aLeft = a.offset().left;
				var bTop = b.offset().top;
				var bLeft = b.offset().left;
				
				return !(
					((aTop + a.height()) < (bTop)) ||
					(aTop > (bTop + b.height())) ||
					((aLeft + a.width()) < bLeft) ||
					(aLeft > (bLeft + b.width()))
				);
			}
		}
	},
	element : {
		translateToPixel : function(self){
			$.each(self, function(index, value){
				var width = $(value).outerWidth();
				var height = $(value).outerHeight();
				var align = $(value).attr('data-align') ? $(value).attr('data-align') : 'left top';
				var translate = align.split(' ');
				var translateX = translate[0];
				var translateY = translate[1];
				
				if(translateX != 'left' || translateY != 'top'){
					var translateMatchX = {
						'left' : 0,
						'center' : Math.round( width / 2 ),
						'right' : width
					}
					
					var translateMatchY = {
						'top' : 0,
						'middle' : Math.round( height / 2 ),
						'bottom' : height
					}
					
					$(value).css('transform', 'translate(-' + Math.round(translateMatchX[translateX]) + 'px, -' + Math.round(translateMatchY[translateY]) + 'px)');
				}
			});
		},
		rebuildTranslate : function(container){
			var smartObjectGroup = container ? $('.smart-object[data-align!="left top"][data-container="' + container.attr('data-id') + '"], .smart-object--group[data-align!="left top"][data-container="' + container.attr('data-id') + '"]') : $('.smart-object[data-align!="left top"], .smart-object--group[data-align!="left top"]');
			
			$.each(smartObjectGroup, function(index, value){
				if($(value).attr('data-align')){
					var isHidden = $(value).css('display') == 'none';
					var parent = $(value).parents('.smart-container');
					var isHiddenParent = parent.css('display') == 'none';
					
					if(isHidden) $(value).show();
					if(isHiddenParent) parent.show();
					
					sAPI.element.translateToPixel($(value));
					
					if(isHidden) $(value).hide();
					if(isHiddenParent) parent.hide();
				}
			});
		},
		rebuildTranslateElement : function(target){
			$.each(target, function(index, value){
				var isHidden = $(value).css('display') == 'none';
				var parent = $(value).parents('.smart-container');
				var isHiddenParent = parent.css('display') == 'none';
				
				if($(value).attr('data-align') && $(value).attr('data-align') != 'left top'){
					if(isHidden) $(value).show();
					if(isHiddenParent) parent.show();
					
					sAPI.element.translateToPixel($(value));
					
					if(isHidden) $(value).hide();
					if(isHiddenParent) parent.hide();
				}
			});
		},
		resetTranslate : function(container){
			var smartObjectGroup = container ? $('.smart-object[data-align!="left top"][data-container="' + container.attr('data-id') + '"], .smart-object--group[data-align!="left top"][data-container="' + container.attr('data-id') + '"]') : $('.smart-object[data-align!="left top"], .smart-object--group[data-align!="left top"]');
			
			$.each(smartObjectGroup, function(index, value){
				if($(value).attr('data-align')){
					$(value).css({
						'opacity' : '',
						'transform' : ''
					});
				}
			});
		},
		resetTranslateElement : function(target){
			$.each(target, function(index, value){
				if($(value).attr('data-align')){
					$(value).css({
						'opacity' : '',
						'transform' : ''
					});
				}
			});
		},
		fitHeight : function(target){
			var rt = false;
			
			if(!target){
				target = $('.smart-object--head, .smart-object--txta, .smart-object--date, .smart-object--cont, .smart-object--vcode, .smart-object--price, .smart-object--radio, .smart-object--news, .smart-object[data-render-type="radio"]');
				rt = true;
			}
			
			$.each(target, function(index, value){
				var textScale = $(value).attr('data-scale') ? $(value).attr('data-scale') : false;
				var textInner = $(value).find('.smart-object__txt');
				var isHidden = $(value).css('display') == 'none';
				var parent = $(value).parents('.smart-container');
				var isHiddenParent = parent.css('display') == 'none';
				
				if(isHidden) $(value).show();
				if(isHiddenParent) parent.show();
				
				var prevAlign = false;
				var prevOpacity = false;
				
				if(textInner.attr('style') && textInner.attr('style').match(/text-align/ig)) prevAlign = textInner.css('text-align');
				if(textInner.attr('style') && textInner.attr('style').match(/opacity/ig)) prevOpacity = textInner.css('opacity');
				
				textInner.removeAttr('style');
				
				if(prevAlign) textInner.css('text-align', prevAlign);
				if(prevOpacity) textInner.css('opacity', prevOpacity);
				
				if(!textScale){
					$(value).css('height', '').css('height', $(value).css('height'));
				} else{
					textInner.css({
						'transform' : 'scale(' + textScale + ')',
						'transform-origin' : 'left top',
						'width' : sAPI.helpers.getScaleWidth(textScale) + '%'
					});
					
					$(value).css('height', Math.round( textInner.outerHeight() * textScale ));
				}
				
				if(isHidden) $(value).hide();
				if(isHiddenParent) parent.hide();
				
				if(!rt) sAPI.element.rebuildTranslateElement($(value));
			});
			
			if(rt) sAPI.element.rebuildTranslate();
		},
		fitTextPre : function(target){
			var targetID = target.attr('data-hash');
			var cellID = target.attr('data-cell');
			var smartObjectGroup = $('.smart-object[data-cell="' + cellID + '"][data-hash!="' + targetID + '"]:not(.has-group), .smart-object--group[data-cell="' + cellID + '"][data-hash!="' + targetID + '"]');
			var smartObjectUnderneath = [];
			var targetBottom = target.offset().top + target.outerHeight();
			
			$.each(smartObjectGroup, function(index, value){
				if(sAPI.element.checkUnderneath(target, $(value), true)){
					smartObjectUnderneath.push($(value));
				}
			});
			
			return smartObjectUnderneath;
		},
		fitTextInit : function(target, underneathArray, fitValue){
			var containerID = target.attr('data-container');
			var container = $('.smart-container[data-id="' + containerID + '"]');
			var cell = container.find('.smart-cell');
			
			var data = {
				exclude : {
					hash : [],
					underneath : [
						target.attr('data-hash')
					]
				}
			}
			
			if(underneathArray.length) data = sAPI.element.fitContent(target, underneathArray, fitValue, data);
			
			var targetBottom = target.offset().top + target.outerHeight();
			var cellBottom = cell.offset().top + cell.outerHeight();
			
			if(underneathArray.length || targetBottom > cellBottom){
				var cellPrevHeight = Number( cell.css('height').replace('px', '') );
				var cellNewHeight = cellPrevHeight + fitValue;
				
				cell.css('height', cellNewHeight);
			}
		},
		fitContent : function(target, underneathArray, fitValue, data){
			if(!underneathArray.length){
				var targetID = target.attr('data-hash');
				var cellID = target.attr('data-cell');
				var smartObjectGroup = $('.smart-object[data-cell="' + cellID + '"][data-hash!="' + targetID + '"]:not(.has-group), .smart-object--group[data-cell="' + cellID + '"][data-hash!="' + targetID + '"]');
				
				data.exclude.underneath.push(targetID);
				
				$.each(smartObjectGroup, function(index, value){
					if(sAPI.element.checkUnderneath(target, $(value))){
						underneathArray.push($(value));
					}
				});
			}
			
			$.each(underneathArray, function(index, value){
				var currentID = $(value).attr('data-hash');
				var changeHeight = false;
				
				if($.inArray(currentID, data.exclude.hash) == -1){
					data.exclude.hash.push(currentID);
					changeHeight = true;
				}
				
				if($.inArray(currentID, data.exclude.underneath) == -1){
					data = sAPI.element.fitContent($(value), [], fitValue, data);
				}
				
				if(changeHeight){
					var align = $(value).attr('data-align') ? $(value).attr('data-align') : 'left top';
					var translate = align.split(' ');
					var translateY = translate[1];
					
					if(translateY != 'bottom'){
						var currentTopStyle = $(value).get(0).style.top;
						var currentTop = Number(currentTopStyle.match(/(-?[\d\.]+?)px/i)[1]);
						var newTop = currentTopStyle.replace(/(-?[\d\.]+?)px/i, ( currentTop + fitValue ) + 'px');
						
						$(value).css('top', newTop);
					}
					
					$(value).attr('data-fit-text', 1);
				}
			});
				
			return data;
		},
		checkUnderneath : function(target, compare, init){
			var targetLeft = target.offset().left;
			var targetTop = target.offset().top;
			var targetBottom = targetTop + target.outerHeight();
			var targetWidth = target.outerWidth();
			var targetRight = targetLeft + targetWidth;
			var compareLeft = compare.offset().left;
			var compareTop = compare.offset().top;
			var compareBottom = compareTop + compare.outerHeight();
			var compareWidth = compare.outerWidth();
			var compareRight = compareLeft + compareWidth;
			
			if(init){
				return (compareTop > targetBottom && ( ( ( targetLeft >= compareLeft && targetLeft <= compareRight ) || ( targetRight >= compareLeft && targetRight <= compareRight ) ) || ( ( compareLeft >= targetLeft && compareLeft <= targetRight ) || ( compareRight >= targetLeft && compareRight <= targetRight ) ) ));
			} else{
				return (compareTop > targetTop && ( ( ( targetLeft >= compareLeft && targetLeft <= compareRight ) || ( targetRight >= compareLeft && targetRight <= compareRight ) ) || ( ( compareLeft >= targetLeft && compareLeft <= targetRight ) || ( compareRight >= targetLeft && compareRight <= targetRight ) ) ));
			}
		},
		calcTop : function(top, cellHeight, translateY){
			var calcMatchY = {
				'top' : '0',
				'middle' : cellHeight / 2,
				'bottom' : cellHeight
			}
			
			var translatePercentY = {
				'top' : '0%',
				'middle' : '50%',
				'bottom' : '100%'
			}
			
			return 'calc(' + translatePercentY[translateY] + ' + ' + ( Math.round( top - Math.round(calcMatchY[translateY]) ) ) + 'px)';
		},
		calcLeft : function(left, cellWidth, translateX){
			var calcMatchX = {
				'left' : '0',
				'center' : cellWidth / 2,
				'right' : cellWidth
			}
			
			var translatePercentX = {
				'left' : '0%',
				'center' : '50%',
				'right' : '100%'
			}
			
			return 'calc(' + translatePercentX[translateX] + ' + ' + ( Math.round( left - Math.round(calcMatchX[translateX]) ) ) + 'px)';
		},
		alignAdaptive : function(target, align){
			var hasGroup = target.hasClass('has-group');
			var translate = align.split(' ');
			var translateX = translate[0];
			var translateY = translate[1];
			
			var wrapper = hasGroup ? target.parent('.smart-object--group') : $('.smart-cell[data-id="' + target.attr('data-cell') + '"]');
			var wrapperWidth = wrapper.outerWidth();
			var wrapperHeight = wrapper.outerHeight();
			
			target.css('opacity', 1);
			
			var unitX = target.get(0).style.left.match(/px/i) ? 'px' : '%';
			
			var translateMatchX = {
				'left' : 0,
				'center' : target.outerWidth() / 2,
				'right' : target.outerWidth()
			}
			
			var translateMatchY = {
				'top' : 0,
				'middle' : target.outerHeight() / 2,
				'bottom' : target.outerHeight()
			}
			
			var offsetLeft = target.offset().left - wrapper.offset().left + translateMatchX[translateX];
			var offsetTop = target.offset().top - wrapper.offset().top + translateMatchY[translateY];
			
			if(unitX == 'px'){
				var newLeft = sAPI.element.calcLeft(offsetLeft, wrapperWidth, translateX);
			} else{
				var newLeft = ( Math.round( ( ( 100 * offsetLeft ) / wrapperWidth ) * 10 ) / 10 ) + '%';
			}
			
			var newTop = sAPI.element.calcTop(offsetTop, wrapperHeight, translateY);
			
			target.css({
				'left' : newLeft,
				'top' : newTop,
				'opacity' : '',
				'transform' : ''
			}).attr('data-align', align);
			
			sAPI.element.translateToPixel(target);
		}
	},
	blocks : {
		drag : {
			dropItem : function(){
				return false;
			},
			dragOver : function(){
				return false;
			},
			dragEnter : function(){
				return false;
			},
			dragLeave : function(){
				return false;
			}
		}
	},
	youtube : {
		load : function(){
			var youtubeObject = $('.smart-object--vid.smart-object--embedded[data-type="youtube"]');
			
			if(youtubeObject.length){
				var tag = document.createElement('script');
				tag.src = "https://web.archive.org/web/20220401190234/https://www.youtube.com/iframe_api";
				
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				
				window.onYouTubePlayerAPIReady = function(){
					$.each(youtubeObject, function(index, value){
						var dataHash = $(value).attr('data-hash');
						var dataBind = $(value).attr('data-bind');
						var iframe = $(value).find('iframe');
						var iframeURL = iframe.attr('src');
						var iframeID = 'youtube-video__' + dataHash + '__' + dataBind;
						
						iframeURL += ( iframeURL.match(/\?/ig) ? '&' : '?' ) + 'version=3&enablejsapi=1';
						
						iframe.attr({
							id : iframeID,
							src : iframeURL
						});
						
						var player = new YT.Player(iframeID);
						
						$('.modal-modal[data-bind="' + dataBind + '"]').bind('hidden.bs.modal', function(){
							player.pauseVideo();
						});
					});
				}
			}
		}
	},
	resize: {
		start : false
	},
	load : {
		preloaderStart : function(){
			$('#preloader').show();
		},
		preloaderStop : function(){
			$('body').removeClass('active-preloader');
			$('#preloader').fadeOut();
		}
	},
	helpers : {
		animateAnchor : function(top, safeTop, time, effect, callback){
			var body = $('html, body');
			var locationHash = false;
			
			sAPI.tpl.animation.anchor = true;
			
			if(sAPI.tpl.animation.timeout) clearTimeout(sAPI.tpl.animation.timeout);
			
			if(!top) top = 0;
			if(!safeTop) safeTop = 0;
			
			if(typeof(top) === 'string'){
				locationHash = top.replace(/#/ig, '');
				
				if($('#' + locationHash).length){
					top = $('#' + locationHash).offset().top - safeTop;
				} else{
					top = 0;
				}
			}
			
			if(!time) time = 500;
			if(!effect) effect = 'swing';
			
			body.stop().animate({scrollTop : top}, time, effect).promise().then(function(){
				if(typeof(callback) === 'function') callback();
				if(locationHash) location.hash = locationHash;
			});
			
			sAPI.tpl.animation.timeout = setTimeout(function(){
				sAPI.tpl.animation.anchor = false;
			}, time + 200);
		},
		getScaleWidth : function(scale){
			return Math.round( ( 1 / scale ) * 1000 ) / 10;
		},
		getDataset : function(element){
			attrArray = [];

			$.each(element.dataset, function(dataKey, dataVal){
				dataKey = 'data-' + dataKey.replace(/[A-Z]/g, function(upper){
					return '-' + upper.toLowerCase();
				});
				
				attrArray.push({
					key : dataKey,
					value : dataVal
				});
			});
			
			return attrArray;
		},
		numberFormat : function(number, decimals, decPoint, delimiter){
			number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
			
			var n = !isFinite(+number) ? 0 : +number;
			var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
			var sep = (typeof delimiter === 'undefined') ? ',' : delimiter;
			var dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
			var s = '';
			
			var toFixedFix = function(n, prec){
				if(('' + n).indexOf('e') === -1){
					return +(Math.round(n + 'e+' + prec) + 'e-' + prec);
				} else{
					var arr = ('' + n).split('e');
					var sig = '';
					
					if(+arr[1] + prec > 0){
						sig = '+';
					}
					
					return (+(Math.round(+arr[0] + 'e' + sig + (+arr[1] + prec)) + 'e-' + prec)).toFixed(prec);
				}
			}
			
			s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.');
			
			if(s[0].length > 3){
				s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
			}
			
			if((s[1] || '').length < prec){
				s[1] = s[1] || '';
				s[1] += new Array(prec - s[1].length + 1).join('0');
			}

			return s.join(dec);
		},
		isIE : function(){
			var ua = window.navigator.userAgent;
			var msie = ua.indexOf("MSIE ");
			var result = false;
			
			if(msie > 0 || ua.match(/Trident.*rv\:11\./)) result = true;
			
			return result;
		}
	}
}

}
/*
     FILE ARCHIVED ON 19:02:34 Apr 01, 2022 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 21:22:30 Jun 08, 2022.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 180.021
  exclusion.robots: 0.135
  exclusion.robots.policy: 0.125
  cdx.remote: 0.083
  esindex: 0.011
  LoadShardBlock: 147.713 (3)
  PetaboxLoader3.resolve: 154.246 (4)
  PetaboxLoader3.datanode: 33.273 (5)
  CDXLines.iter: 18.696 (3)
  load_resource: 54.426
  loaddict: 7.842
*/