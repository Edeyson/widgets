
;( function($) {
	'use strict';
	
	var animStart = 'webkitAnimationStart oanimationstart MSAnimationStart animationstart',
		animEnd = 'webkitAnimationEnd oanimationend MSAnimationEnd animationend',
	
		growlTemplate = '<div class="igrowl animated" role="alert"><div class="igrowl-text"></div><button class="igrowl-dismiss i-times"></button></div>';


	var iGrowl = function(options){
		options = $.extend(true, {}, $.iGrowl.prototype.defaults, options);
		this.options = options;
		
		this.template = setContent(options);

		render.call(this);
		return this;
	},

	// builds notification (title, message, icon)
	setContent = function(options){
		// if no title or message, throw error
		if ( !options.title && !options.message ) throw new Error('You must enter at least a title or message.');

		var template = $(growlTemplate);

		// small
		if ( options.small ) { template.addClass('igrowl-small'); }

		// type
		template.addClass('igrowl-'+options.type);


		// image / icon
		if ( options.image.src ) {
			template.prepend('<div class="igrowl-img '+ options.image.class +'"><img src="'+ options.image.src +'"</div>');
		} else if (options.icon) {
			template.prepend('<div class="igrowl-icon i-'+ options.icon + '"></div>');
		}

		// title + message
		if ( options.title ) template.find('.igrowl-text').prepend('<div class="igrowl-title">' + options.title + '</div>');
		if ( options.message ) template.find('.igrowl-text').append('<div class="igrowl-message">' + options.message + '</div>');

		// link
		if ( options.link ){ template.addClass('igrowl-link').children('.igrowl-icon, .igrowl-text').wrapAll('<a href="' + options.link +'" target="_' + options.target + '" />'); }

		template.attr('alert-placement', options.placement.x + ' ' + options.placement.y );
		return template;
	},

	// sets css position and appends to body
	render = function(){
		var options = this.options,
			template = this.template;

		var last = $('.igrowl[alert-placement="' + options.placement.x + ' ' + options.placement.y +'"]').last(),
			y = options.offset.y,
			growl = this;

		// vertical alignment - place after last element of type (if it exists)
		if ( last.length ) {
			y = parseInt( last.css( options.placement.y ), 10) + last.outerHeight() + options.spacing;
		}
		template.css( options.placement.y, y );


		// horizontal alignment
		if ( options.placement.x === "center" ) { 
			template.addClass('igrowl-center'); 
		}  else { 
			template.css( options.placement.x, options.offset.x ); 
		}

		$('body').append(template);

		// add animation class - if enabled
		if ( options.animation ) {
			// if animation isn't supported, ensure dismiss controls are activated
			var noAnimFallback = setTimeout(function(){
				controls.call(growl);
			}, 1001);

			template
				.addClass( options.animShow )
				.one(animStart, function(e){
					if ( typeof options.onShow === 'function' ) options.onShow();
				})
				.one(animEnd, function(e) {
					controls.call(growl);

					// cancel no-animation fallback
					clearTimeout(noAnimFallback);
				});

		} else {
			controls.call(growl);
		}
	},

	// sets up auto-dismiss after delay, and dismiss button
	controls = function(){
		var options = this.options,
			template = this.template;

		// callback once alert is visible/animation complete
		if ( typeof options.onShown === 'function' ) options.onShown();
		
		var growl = this;
		
		// after delay, dismiss alert
		if ( options.delay > 0 ){
			setTimeout( function(){
				growl.dismiss();
			}, options.delay);
		}

		// set up dismiss button
		template.find('.igrowl-dismiss').on('click', function(){
			growl.dismiss();
		});
	},

	updatePosition = function(){
		var options = this.options,
			template = $(this.template);

		template.nextAll('.igrowl[alert-placement="' + options.placement.x + ' ' + options.placement.y +'"]').each(function(i, alert){
			// sets y as: 	current - ( alert to be dismissed height + alert to be dismissed spacing)
			var y = parseInt( $(this).css( options.placement.y ), 10) - template.outerHeight() - options.spacing;
			$(alert).css(options.placement.y, y);
		});
		template.remove();
	};


	iGrowl.prototype = {
		// hides alert
		dismiss: function(){
			var options = this.options,
				template = this.template,
				growl = this;

			if ( options.animation ) {
				this.template
					.removeClass( options.animShow )
					.addClass( options.animHide )
					.one(animStart, function(e){
						if ( typeof options.onHide === 'function' ) options.onHide();
					})
					.one(animEnd, function(e){
						if ( typeof options.onHidden === 'function' ) options.onHidden();
						updatePosition.call(growl);
					});

				// fallback in case animation event listener fails
				setTimeout( function(){
					template.hide();
					updatePosition.call(growl);
				}, 1500 );

			} else {
				template.hide();
				if ( typeof options.onHidden === 'function' ) options.onHidden();
				updatePosition.call(growl);
			}

		}
	};


	// initiate growl
	$.iGrowl = function(settings){
		// generate alert
		var growl = new iGrowl (settings);
		return growl;
	};

	// dismiss all alerts
	$.iGrowl.prototype.dismissAll = function(placement){
		if ( placement === 'all' ) { $('.igrowl button').trigger('click'); } 
		else { $('.igrowl[alert-placement="'+placement+'"] button').trigger('click'); }
	};

	// default settings
	$.iGrowl.prototype.defaults = {
		type : 			'info',
		title : 		null,
		message : 		null,
		link : 			null,
		target : 		'self',
		
		icon : 			null,
		image : {
			src : null,
			class : null
		},
		
		small : 		false,
		delay : 		2500,
		spacing :  		30,
		placement : {
			x : 	'right',
			y :		'top'
		},
		offset : {
			x : 	20,
			y : 	20
		},

		animation : 	true,
		animShow : 		'bounceIn',
		animHide : 		'bounceOut',
		onShow : 		null,
		onShown : 		null,
		onHide : 		null,
		onHidden : 		null,

	};


})( jQuery );;
function Fluentd() {
    this.pushError = function (message) {
        var dt = { "cts": new Date().toISOString(), src: "CMS", msj: JSON.stringify(message), Iserror: true };

        this.push(dt);
    };

    this.pushAjaxResponse = function (d, tabId) {
        try {

            var message = {
                category: 'ErrorSearch',
                tabId: tabId,
                AjaxResponse: {
                    d: d
                }
            };
            var dt = { "cts": new Date().toISOString(), src: "CMS", msj: JSON.stringify(message), Iserror: true };

            this.push(dt);
        } catch (e) {
            this.pushException(e, 'ErrorSearchCatch');
        }
    };

    this.pushException = function (exception, category, tabId) {

        var message = {
            category: category,
            tabId: tabId,
            exception: {
                message: exception.message,
                location: window.location.href
            }
        };

        var dt = { "cts": new Date().toISOString(), src: "CMS", msj: JSON.stringify(message), Iserror: true };

        this.push(dt);
    };

    this.pushMessage = function (message, category) {

        var objectMessage = {
            category: category,
            message: message
        };

        var dt = { "cts": new Date().toISOString(), src: "CMS", msj: JSON.stringify(objectMessage), Iserror: false };

        this.push(dt);
    };

    this.push = function (dt) {
        try {
            //creating an asynchronous XMLHttpRequest
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open('POST', "https://matabares.com/nsfluentdlogs/", true); //true for asynchronous request
            xmlHttp.setRequestHeader('Content-Type', 'application/json');
            xmlHttp.send(JSON.stringify(dt));
        } catch (ex) {
            if (window && window.console && typeof window.console.log === 'function') {
                console.log("Failed to log to Fluentd because of this exception:\n" + ex);
                console.log("Failed log data:", data);
            }
        }
    };

}
$fluentd = new Fluentd();

var _onerror = window.onerror;
//send console error messages to Fluentd			
window.onerror = function (msg, url, line, col, err) {

    if (url != null && !url.includes("localhost")) {  //&& !url.includes("netactica.net")

        //Solamente hacemos push de los errores si es produccion
        $fluentd.pushError({
            category: 'BrowserJsException',
            exception: {
                message: msg,
                url: url,
                lineno: line,
                colno: col,
                stack: err ? err.stack : 'n/a',
                location: window.location.href
            }
        });

        if (_onerror && typeof _onerror === 'function') {
            _onerror.apply(window, arguments);
        }
    }
};;
/*
 * jQuery bValidator plugin
 *
 * http://code.google.com/p/bvalidator/
 *
 * Copyright (c) 2011 Bojan Mauser
 *
 * $Id: jquery.bvalidator.js 38 2011-01-14 00:48:14Z bmauser $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Ultima modificación: Ronnye Rodriguez - Netactica 28/02/2018
 *
 */

(function($) {
	
	// constructor
	$.fn.bValidator = function(overrideOptions) {
		return new bValidator(this, overrideOptions);
	};
	
	// bValidator class
	bValidator = function(mainElement, overrideOptions){
		
		// default options
		var options = {
			
			singleError:         false,		// validate all inputs at once
			offset:              {x:0, y:-3},	// offset position for error message tooltip
			position:            {x:'left', y:'top'}, // error message placement x:left|center|right  y:top|center|bottom
			template:            '<div class="{errMsgClass}"><em/>{message}</div>', // template for error message
			showCloseIcon:       true,	// put close icon on error message
			showErrMsgSpeed:    'normal',	// message's fade-in speed 'fast', 'normal', 'slow' or number of miliseconds
			// css class names
			closeIconClass:      'bvalidator_close_icon',	// close error message icon class
			errMsgClass:         'bvalidator_errmsg',	// error message class
			errorClass:          'bvalidator_invalid',	// input field class name in case of validation error
			validClass:          '',			// input field class name in case of valid value
			
			lang: 'en', 				// default language for error messages 
			errorMessageAttr:    'data-bvalidator-msg',// name of the attribute for overridden error message
			validateActionsAttr: 'data-bvalidator', // name of the attribute which stores info what validation actions to do
			paramsDelimiter:     ':',		// delimiter for validator options inside []
			validatorsDelimiter: ',',		// delimiter for validators
			
			// when to validate
			validateOn:          null,		// null, 'change', 'blur', 'keyup'
			errorValidateOn:    'change',		// null, 'change', 'blur', 'keyup'
			
			// callback functions
			onBeforeValidate:    null,
			onAfterValidate:     null,
			onValidateFail:      null,
			onValidateSuccess:   null,
			
			// default error messages
			errorMessages: {
			    en: {
			        'default':          'Please correct this value.',
			        'equalto':          'Please enter the same value again.',
			        'differs':          'Please enter a different value.',
			        'minlength':        'The length must be at least {0} characters',
			        'maxlength':        'The length must be at max {0} characters',
			        'rangelength':      'The length must be between {0} and {1}',
			        'min':              'Please enter a number greater than or equal to {0}.',
			        'max':              'Please enter a number less than or equal to {0}.',
			        'between':          'Please enter a number between {0} and {1}.',
			        'required':         'This field is required.',
			        'alpha':            'Please enter alphabetic characters only.',
			        'alphanum':         'Please enter alphanumeric characters only.',
			        'digit':            'Please enter only digits.',
			        'number':           'Please enter a valid number.',
			        'email':            'Please enter a valid email address.',
			        'image':            'This field should only contain image types',
			        'url':              'Please enter a valid URL.',
			        'ip4':              'Please enter a valid IP address.',
			        'date':             'Please enter a valid date in format {0}.',
			        'mindate':          'Please enter a date greater than or equal to {0}.',
			        'mindatefield':     'Please enter a date greater than or equal to field.',
			        'mindatefield2':    'Please enter a date greater than to field',
			        'maxdate':          'Please enter a date less than or equal to {0}.',
			        'maxdatefield':     'Please enter a date less than or equal to field.',
			        'autocomplete':     'Please correct value.'
			    }
			},
			
			// regular expressions used by validator methods
			regex: {
				alpha:    /^[a-z ._-]+$/i,
				alphanum: /^[a-z0-9 ._-]+$/i,
				digit:    /^\d+$/,
				number:   /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
				email:    /^([a-zA-Z0-9_\.\-\+%])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
				image:    /\.(jpg|jpeg|png|gif|bmp)$/i,
				url:      /^(http|https|ftp)\:\/\/[a-z0-9\-\.]+\.[a-z]{2,3}(:[a-z0-9]*)?\/?([a-z0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~])*$/i,
				autocomplete: /.*\(.*\)$/i
			}
		};
		
		// validator instance
		var instance = this;
		
		// global options
		if(window['bValidatorOptions']){
			$.extend(true, options, window['bValidatorOptions']);
		}
		
		// passed options
		if(overrideOptions)
			$.extend(true, options, overrideOptions);
		
		// return existing instance
		if(mainElement.data("bValidator"))
			return mainElement.data("bValidator");
		
		mainElement.data("bValidator", this);
		
		// if selector is a form
		if (mainElement.is('form')) {
			// bind validation on form submit
			mainElement.bind('submit.bV', function(event){
				if(instance.validate())
					return true;
				else{
					event.stopImmediatePropagation();
					return false;
				}
			});
			
			// bind reset on form reset
			mainElement.bind("reset.bV", function()  {
				instance.reset();			
			});
		}
		
		// returns all inputs
		var _getElementsForValidation = function(element){
		
			if(element.is(':input'))
				var elements = element;
			else{
				//skip hidden and input fields witch we do not want to validate
				var elements = element.find(':input').not(":button, :image, :reset, :submit, :hidden, :disabled");
			}
			
			return elements;
		}
		
		// binds validateOn event
		var _bindValidateOn = function(elements){
			elements.bind(options.validateOn + '.bV', {'bValidatorInstance': instance}, function(event) {
				event.data.bValidatorInstance.validate(false, $(this));
			});
		}
		
		// displays error message
		var _showErrMsg = function(element, messages){
			
			// if error msg already exists remove it from DOM
			_removeErrMsg(element);
			
			msg_container = $('<div class="bVErrMsgContainer"></div>').css('position','absolute');
			element.data("errMsg.bV", msg_container);
			msg_container.insertAfter(element);
			
			var messagesHtml = '';
			
			for (i = 0; i <= messages.length - 1; i++) {
				messagesHtml += '<div>' + messages[i] + '</div>\n';
			}
			
			if(options.showCloseIcon){
				var closeiconTpl = '<div style="display:table"><div style="display:table-cell">{message}</div><div style="display:table-cell"><div class="'+options.closeIconClass+'" onclick="$(this).closest(\'.'+ options.errMsgClass +'\').css(\'visibility\', \'hidden\');">x</div></div></div>';
				messagesHtml = closeiconTpl.replace('{message}', messagesHtml);
			}
			
			var template = options.template.replace('{errMsgClass}', options.errMsgClass).replace('{message}', messagesHtml);
			
			var errmsg = $(template);
			errmsg.appendTo(msg_container);
			
			var pos = _getErrMsgPosition(element, errmsg); 
			
			errmsg.css({ visibility: 'visible', position: 'absolute', top: pos.top, left: pos.left }).fadeIn(options.showErrMsgSpeed);
		}
		
		// removes error message from DOM
		var _removeErrMsg = function(element){
			var existingMsg = element.data("errMsg.bV")
			if(existingMsg){
				existingMsg.remove();
			}
		}
		
		// calculates error message position
		var _getErrMsgPosition = function(input, tooltip) {
		        
		        var tooltipContainer = input.data("errMsg.bV");
		        var top  = - ((tooltipContainer.offset().top - input.offset().top) + tooltip.outerHeight() - options.offset.y);
		        var left = (input.offset().left + input.outerWidth()) - tooltipContainer.offset().left + options.offset.x;
			
			var x = options.position.x;
			var y = options.position.y;
			
			// adjust Y
			if(y == 'center' || y == 'bottom'){
				var height = tooltip.outerHeight() + input.outerHeight();
				if (y == 'center') 	{ top += height / 2; }
				if (y == 'bottom') 	{ top += height; }
			}
			
			// adjust X
			if(x == 'center' || x == 'left'){
				var width = input.outerWidth();
				if (x == 'center') 	{ left -= width / 2; }
				if (x == 'left')  	{ left -= width; }
			}
			
			return {top: top, left: left};
		}
		
		// calls callback functions
		var _callBack = function(type, param1, param2, param3) {
		        if($.isFunction(options[type])){
		        	return options[type](param1, param2, param3);
		        }
		}
		
		// gets element value	
		var _getValue = function(element) {
			
			var ret = {};
	
			// checkbox
			if(element.is('input:checkbox')){
				if(element.attr('name'))
					ret['selectedInGroup'] = $('input:checkbox[name=' + element.attr('name') + ']:checked').length;				
				ret['value'] = element.is(":checked");
			}
			else if(element.is('input:radio')){
				if(element.attr('name'))
					ret['value'] = $('input:radio[name=' + element.attr('name') + ']:checked').length;
				else
					ret['value'] = element.val();
			}
			else if(element.is('select')){
				ret['selectedInGroup'] =  $("option:selected", element).length;
				ret['value'] = element.val();
			}
			else if(element.is(':input')){
				ret['value'] = element.val();
			}
			
			return ret;
		}
	
		// object with validator functions
		var validator = {
		
            equalto: function (v, elementId) {
                return v.value == $('#' + elementId).val();
            },
			
            differs: function (v, elementId) {
                return v.value != $('#' + elementId).val();
            },
			
            minlength: function (v, minlength) {
                return (v.value.length >= minlength);
            },
			
            maxlength: function (v, maxlength) {
                return (v.value.length <= maxlength);
            },
			
            rangelength: function (v, minlength, maxlength) {
                return (v.value.length >= minlength && v.value.length <= maxlength);
            },
			
            min: function(v, min) {		
                if (v.selectedInGroup) {
                    return v.selectedInGroup >= min;
                } else {

                    if (typeof (min) == "string")
                        min = eval(min);

                    if (!this.number(v))
                        return false;

                    return (parseFloat(v.value) >= parseFloat(min));
                }
            },
			
            max: function (v, max) {
                if (v.selectedInGroup) {
                    return v.selectedInGroup <= max;
                } else {
                    if(!this.number(v))
                        return false;

                    return (parseFloat(v.value) <= parseFloat(max));
                }
            },
			
			between: function(v, min, max){
			   	if(!this.number(v))
			 		return false;
				var va = parseFloat(v.value);
				return (va >= parseFloat(min) && va <= parseFloat(max));
			},
			
			required: function(v){
			    if (!v.value || !$.trim(v.value))
			        return false;
			    return true;
			},
			
			alpha: function(v){
				return this.regex(v, options.regex.alpha);
			},

			autocomplete: function (v, type) {
		
				if (type === 'neighborhood') {
					//Airports
					if ($.inArray(v.value, external_file_Airports) >= 0) {
						return true;
					}

					//Cities
					if (($.inArray(v.value, external_file_Cities) >= 0)
						|| (typeof (external_file_cities_duplicate) != "undefined" && $.inArray(v.value, external_file_cities_duplicate) >= 0)) {
						return true;
					}

					//Neighborhood
					var foundNeighborhood = Enumerable.from(external_file_Neighborhood).firstOrDefault(function (n) { return n.Desc === v.value });
					if (foundNeighborhood) {
						return true;
					}

					return false;
				}

			    if (this.regex(v, options.regex.autocomplete)) {
			        switch (type) {
			            case 'city':
                            if (($.inArray(v.value, external_file_Cities) >= 0) || (typeof (external_file_cities_duplicate) != "undefined" && $.inArray(v.value, external_file_cities_duplicate) >= 0))
			                    return true;
			                break;
			            case 'country':
			                if ($.inArray(v.value, external_file_Countries) >= 0)
			                    return true;
			                break;
			            case 'airport':
			                if ($.inArray(v.value, external_file_Airports) >= 0)
			                    return true;
                            break;
                        case 'airportscity':

                            var arr = external_file_AirportsCities;
                            arr.forEach(function (part, index) {
                                if (arr[index].substring(arr[index].indexOf('(') + 1, arr[index].indexOf(')') + 1).indexOf('-') < 0) {
                                    arr[index] = arr[index].substring(arr[index].indexOf("|") + 1, arr[index].length);
                                }
                                else {
                                    arr[index] = arr[index].substring(arr[index].indexOf("|") + 1, arr[index].length);
                                    arr[index] = arr[index].substring(0, arr[index].indexOf("(") + 1) + arr[index].substring(arr[index].indexOf("-") + 1, arr[index].length);
                                }
                            });

                            if (($.inArray(v.value, arr) >= 0) ||
                                ($.inArray(v.value + "|E", arr) >= 0))
                                return true;
                            break;
			            case 'airline':
			                if ($.inArray(v.value, external_file_Airlines) >= 0)
			                    return true;
			                break;
			            default:
			                return true;
			        }
			    } else if (type == 'expedia') {
			        if (external_file_expedia_cities.filter(function (item) { return item.label == v.value }).length >= 0)
			            return true;
			    }

			    return false;
			},
			
			alphanum: function(v){
				return this.regex(v, options.regex.alphanum);
			},
			
			digit: function(v){
				return this.regex(v, options.regex.digit);
			},
			
			number: function(v){
				return this.regex(v, options.regex.number);
			},
			
			email: function(v){
				return this.regex(v, options.regex.email);
			},
			
			image: function(v){
				return this.regex(v, options.regex.image);
			},
			
			url: function(v){
				return this.regex(v, options.regex.url);
			},
			
			regex: function(v, regex, mod) {
				if(typeof regex === "string")
					regex = new RegExp(regex, mod);
				
				return regex.test(v.value);
			},
			
			ip4: function(v){
				var r = /^(([01]?\d\d?|2[0-4]\d|25[0-5])\.){3}([01]?\d\d?|25[0-5]|2[0-4]\d)$/;
				if (!r.test(v.value) || v.value == "0.0.0.0" || v.value == "255.255.255.255")
				    return false;
				return true;
			},
			
			date: function(v, format){ // format can be any combination of mm,dd,yyyy with separator between. Example: 'mm.dd.yyyy' or 'yyyy-mm-dd'
				if(v.value.length == 10 && format.length == 10){
					var s = format.match(/[^mdy]+/g);
					if(s.length == 2 && s[0].length == 1 && s[0] == s[1]){
						
						var d = v.value.split(s[0]);
						var f = format.split(s[0]);
						
						for(var i=0; i<3; i++){
							if(f[i] == 'dd') var day = d[i];
							else if(f[i] == 'mm') var month = d[i];
							else if(f[i] == 'yyyy') var year = d[i];
						}
						
						var dobj = new Date(year, month - 1, day);
						if ((dobj.getMonth() + 1 != month) || (dobj.getDate() != day) || (dobj.getFullYear() != year))
						    return false;
						
						return true;
					}
				}
				return false;
			},

			mindate: function (v, min, format) {
			    if (v.value == "" || min == "" || format == "")
			        return true;

			    return (GetFormatedDate(v.value, format) >= GetFormatedDate(min, format));
			},

			mindatefield: function (v, elementId, format) {
			    if (v.value == "" || $('#' + elementId).val() == "" || format == "")
			        return true;

			    return (GetFormatedDate(v.value, format) >= GetFormatedDate($('#' + elementId).val(), format));
			},

			mindatefield2: function (v, elementId, format) {
			    if (v.value == "" || $('#' + elementId).val() == "" || format == "")
			        return true;

			    return (GetFormatedDate(v.value, format) > GetFormatedDate($('#' + elementId).val(), format));
			},

			maxdate: function (v, max, format) {
			    if (v.value == "" || max == "" || format == "")
			        return true;

			    return (GetFormatedDate(v.value, format) <= GetFormatedDate(max, format));
			},

			maxdatefield: function (v, elementId, format) {
			    if (v.value == "" || $('#' + elementId).val() == "" || format == "")
			        return true;

			    return (GetFormatedDate(v.value, format) >= GetFormatedDate($('#' + elementId).val(), format));
			},
			
			extension: function(){
				var v = arguments[0];
				var r = '';
				if(!arguments[1])
					return false
				for(var i=1; i<arguments.length; i++){
					r += arguments[i];
					if(i != arguments.length-1)
						r += '|';
				}
				return this.regex(v, '\\.(' +  r  + ')$', 'i');
			}
		};
		
		// bind validateOn event
		if(options.validateOn)
			_bindValidateOn(_getElementsForValidation(mainElement));
		
		
		// API functinon:
		
		
		// validation function
		this.validate = function(doNotshowMessages, elementsOverride) {
			
			if(elementsOverride)
				var elementsl = elementsOverride;
			else
				var elementsl = _getElementsForValidation(mainElement);
			
			// return value
			var ret = true;
			
			// validate each element
			elementsl.each(function() {
				
				// value of validateActionsAttr input attribute
				var actionsStr = $.trim($(this).attr(options.validateActionsAttr));
				var is_valid = 0;
				
				if(!actionsStr)
					return true;
				
				// get all validation actions
				var actions = actionsStr.split(options.validatorsDelimiter);
				
				// value of input field for validation
				var inputValue = _getValue($(this));
				
				// if value is not required and is empty
				//if(jQuery.inArray('required',actions) == -1 && !validator.required(inputValue)){
				//	is_valid = 1;
				//}
				
				var errorMessages = [];
				
				if(!is_valid){
					
				    // get error messsage from attribute
				    var errMsg = $(this).attr(options.errorMessageAttr);

					var skip_messages = 0;
					
					// for each validation action
					for (i = 0; i <= actions.length - 1; i++) {
						
						actions[i] = $.trim(actions[i]);
						
						if(!actions[i])
							continue;
						
						if(_callBack('onBeforeValidate', $(this), actions[i]) === false)
							continue;
						
						// check if we have some parameters for validator
						var validatorParams = actions[i].match(/^(.*?)\[(.*?)\]/);
						
						if(validatorParams && validatorParams.length == 3){
							var validatorName = $.trim(validatorParams[1]);
							validatorParams = validatorParams[2].split(options.paramsDelimiter);
						}
						else{
							validatorParams = [];
							var validatorName = actions[i];
						}
						
						// if validator exists
						if(typeof validator[validatorName] == 'function'){
							validatorParams.unshift(inputValue); // add input value to beginning of validatorParams
							var validationResult = validator[validatorName].apply(validator, validatorParams); // call validator function
						}
						// call custom user dafined function
						else if(typeof window[validatorName] == 'function'){
							validatorParams.unshift(inputValue.value);
							var validationResult = window[validatorName].apply(validator, validatorParams);
						}
						
						if(_callBack('onAfterValidate', $(this), actions[i], validationResult) === false)
							continue;
						
						if(!validationResult){
							
							if(!doNotshowMessages){
								
								if(!skip_messages){
									
								    var customMsg = $(this).attr(options.errorMessageAttr + "-" + validatorName);

								    if (customMsg != null)
								        errMsg = customMsg;

									if(!errMsg){
										
										if(options.errorMessages[options.lang] && options.errorMessages[options.lang][validatorName])
											errMsg = options.errorMessages[options.lang][validatorName];
										else if(options.errorMessages.en[validatorName])
											errMsg = options.errorMessages.en[validatorName];
										else if(options.errorMessages[options.lang] && options.errorMessages[options.lang]['default'])
											errMsg = options.errorMessages[options.lang]['default'];
										else
											errMsg = options.errorMessages.en['default'];
									}
									else{
										skip_messages = 1;
									}


									
									// replace values in braces
									if(errMsg.indexOf('{')){
										for(var i=0; i<validatorParams.length-1; i++)
											errMsg = errMsg.replace(new RegExp("\\{" + i + "\\}", "g"), validatorParams[i+1]);
									}
									
									if(!(errorMessages.length && validatorName == 'required'))
										errorMessages[errorMessages.length] = errMsg;
									
									errMsg = null;
								}
							}
							else
								errorMessages[errorMessages.length] = '';
							
							ret = false;
							
							if(_callBack('onValidateFail', $(this), actions[i], errorMessages) === false)
								continue;
						}
						else{
							if(_callBack('onValidateSuccess', $(this), actions[i]) === false)
								continue;
						}
					}
				}
				
				if(!doNotshowMessages){
					// if validation failed
					if(errorMessages.length){
						
						_showErrMsg($(this), errorMessages)
						
						if(!$(this).is('input:checkbox,input:radio')){
							$(this).removeClass(options.validClass);
							if(options.errorClass)
								$(this).addClass(options.errorClass);
						}
								
						// input validation event             
						if (options.errorValidateOn){
							if(options.validateOn)
								$(this).unbind(options.validateOn + '.bV');
							
							var evt = options.errorValidateOn;
							
						    //si es un autocomplete entonces validamos con el evento blur
							if ($(this).hasClass("ui-autocomplete-input")) {
							    evt = 'blur';
							}
							else if ($(this).is('input:checkbox,input:radio,select,input:file')) {
							    evt = 'change';
							}


							
							$(this).unbind(evt + '.bVerror');
							$(this).bind(evt + '.bVerror', {'bValidatorInstance': instance}, function(event) {
								event.data.bValidatorInstance.validate(false, $(this));
							});
						}
						
						if (options.singleError)
							return false;
					}
					else{
						_removeErrMsg($(this));
						
						if(!$(this).is('input:checkbox,input:radio')){
							$(this).removeClass(options.errorClass);
							if(options.validClass)
								$(this).addClass(options.validClass);
						}
						
						//if (options.errorValidateOn)
						//	$(this).unbind('.bVerror');
						if (options.validateOn){
							$(this).unbind(options.validateOn + '.bV');
							_bindValidateOn($(this));
						}
					}
				}
			});
			
			return ret;
		}
		
		// returns options object
		this.getOptions = function() {
			return options;
		}
		
		// chechs validity
		this.isValid = function() {
			return this.validate(true);
		}
		
		// deletes error message
		this.removeErrMsg = function(element){
			_removeErrMsg(element);
		}
		
		// returns all inputs
		this.getInputs = function(){
			return _getElementsForValidation(mainElement);
		}
		
		// binds validateOn event
		this.bindValidateOn = function(element){
			_bindValidateOn(element);
		}
		
		// resets validation
		this.reset = function() {
			elements = _getElementsForValidation(mainElement);
			if (options.validateOn)
				_bindValidateOn(elements);
			elements.each(function(){
				_removeErrMsg($(this));
				$(this).unbind('.bVerror');
				$(this).removeClass(options.errorClass);
				$(this).removeClass(options.validClass);
			});
		}
		
		this.destroy = function() {
			if (mainElement.is('form'))
				mainElement.unbind('.bV');
			
			this.reset();
			
			mainElement.removeData("bValidator");
		}
		
	}
	
})(jQuery);
;
/*--------------------------------------------------------------------------
 * linq.js - LINQ for JavaScript
 * ver 3.0.4-Beta5 (Jun. 20th, 2013)
 *
 * created and maintained by neuecc <ils@neue.cc>
 * licensed under MIT License
 * http://linqjs.codeplex.com/
 *------------------------------------------------------------------------*/
(function (x, j) { var l = "enumerator is disposed", q = "single:sequence contains more than one element.", a = false, b = null, e = true, g = { Identity: function (a) { return a }, True: function () { return e }, Blank: function () { } }, i = { Boolean: typeof e, Number: typeof 0, String: typeof "", Object: typeof {}, Undefined: typeof j, Function: typeof function () { } }, t = { "": g.Identity }, d = { createLambda: function (a) { if (a == b) return g.Identity; if (typeof a === i.String) { var c = t[a]; if (c != b) return c; if (a.indexOf("=>") === -1) { var n = new RegExp("[$]+", "g"), d = 0, k; while ((k = n.exec(a)) != b) { var f = k[0].length; if (f > d) d = f } for (var h = [], e = 1; e <= d; e++) { for (var j = "", m = 0; m < e; m++)j += "$"; h.push(j) } var o = Array.prototype.join.call(h, ","); c = new Function(o, "return " + a); t[a] = c; return c } else { var l = a.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/); c = new Function(l[1], "return " + l[2]); t[a] = c; return c } } return a }, isIEnumerable: function (b) { if (typeof Enumerator !== i.Undefined) try { new Enumerator(b); return e } catch (c) { } return a }, defineProperty: Object.defineProperties != b ? function (c, b, d) { Object.defineProperty(c, b, { enumerable: a, configurable: e, writable: e, value: d }) } : function (b, a, c) { b[a] = c }, compare: function (a, b) { return a === b ? 0 : a > b ? 1 : -1 }, dispose: function (a) { a != b && a.dispose() } }, o = { Before: 0, Running: 1, After: 2 }, f = function (d, f, g) { var c = new v, b = o.Before; this.current = c.current; this.moveNext = function () { try { switch (b) { case o.Before: b = o.Running; d(); case o.Running: if (f.apply(c)) return e; else { this.dispose(); return a } case o.After: return a } } catch (g) { this.dispose(); throw g; } }; this.dispose = function () { if (b != o.Running) return; try { g() } finally { b = o.After } } }, v = function () { var c = b; this.current = function () { return c }; this.yieldReturn = function (a) { c = a; return e }; this.yieldBreak = function () { return a } }, c = function (a) { this.getEnumerator = a }; c.Utils = {}; c.Utils.createLambda = function (a) { return d.createLambda(a) }; c.Utils.createEnumerable = function (a) { return new c(a) }; c.Utils.createEnumerator = function (a, b, c) { return new f(a, b, c) }; c.Utils.extendTo = function (i) { var e = i.prototype, f; if (i === Array) { f = h.prototype; d.defineProperty(e, "getSource", function () { return this }) } else { f = c.prototype; d.defineProperty(e, "getEnumerator", function () { return c.from(this).getEnumerator() }) } for (var a in f) { var g = f[a]; if (e[a] == g) continue; if (e[a] != b) { a = a + "ByLinq"; if (e[a] == g) continue } g instanceof Function && d.defineProperty(e, a, g) } }; c.choice = function () { var a = arguments; return new c(function () { return new f(function () { a = a[0] instanceof Array ? a[0] : a[0].getEnumerator != b ? a[0].toArray() : a }, function () { return this.yieldReturn(a[Math.floor(Math.random() * a.length)]) }, g.Blank) }) }; c.cycle = function () { var a = arguments; return new c(function () { var c = 0; return new f(function () { a = a[0] instanceof Array ? a[0] : a[0].getEnumerator != b ? a[0].toArray() : a }, function () { if (c >= a.length) c = 0; return this.yieldReturn(a[c++]) }, g.Blank) }) }; c.empty = function () { return new c(function () { return new f(g.Blank, function () { return a }, g.Blank) }) }; c.from = function (j) { if (j == b) return c.empty(); if (j instanceof c) return j; if (typeof j == i.Number || typeof j == i.Boolean) return c.repeat(j, 1); if (typeof j == i.String) return new c(function () { var b = 0; return new f(g.Blank, function () { return b < j.length ? this.yieldReturn(j.charAt(b++)) : a }, g.Blank) }); if (typeof j != i.Function) { if (typeof j.length == i.Number) return new h(j); if (!(j instanceof Object) && d.isIEnumerable(j)) return new c(function () { var c = e, b; return new f(function () { b = new Enumerator(j) }, function () { if (c) c = a; else b.moveNext(); return b.atEnd() ? a : this.yieldReturn(b.item()) }, g.Blank) }); if (typeof Windows === i.Object && typeof j.first === i.Function) return new c(function () { var c = e, b; return new f(function () { b = j.first() }, function () { if (c) c = a; else b.moveNext(); return b.hasCurrent ? this.yieldReturn(b.current) : this.yieldBreak() }, g.Blank) }) } return new c(function () { var b = [], c = 0; return new f(function () { for (var a in j) { var c = j[a]; !(c instanceof Function) && Object.prototype.hasOwnProperty.call(j, a) && b.push({ key: a, value: c }) } }, function () { return c < b.length ? this.yieldReturn(b[c++]) : a }, g.Blank) }) }, c.make = function (a) { return c.repeat(a, 1) }; c.matches = function (h, e, d) { if (d == b) d = ""; if (e instanceof RegExp) { d += e.ignoreCase ? "i" : ""; d += e.multiline ? "m" : ""; e = e.source } if (d.indexOf("g") === -1) d += "g"; return new c(function () { var b; return new f(function () { b = new RegExp(e, d) }, function () { var c = b.exec(h); return c ? this.yieldReturn(c) : a }, g.Blank) }) }; c.range = function (e, d, a) { if (a == b) a = 1; return new c(function () { var b, c = 0; return new f(function () { b = e - a }, function () { return c++ < d ? this.yieldReturn(b += a) : this.yieldBreak() }, g.Blank) }) }; c.rangeDown = function (e, d, a) { if (a == b) a = 1; return new c(function () { var b, c = 0; return new f(function () { b = e + a }, function () { return c++ < d ? this.yieldReturn(b -= a) : this.yieldBreak() }, g.Blank) }) }; c.rangeTo = function (d, e, a) { if (a == b) a = 1; return d < e ? new c(function () { var b; return new f(function () { b = d - a }, function () { var c = b += a; return c <= e ? this.yieldReturn(c) : this.yieldBreak() }, g.Blank) }) : new c(function () { var b; return new f(function () { b = d + a }, function () { var c = b -= a; return c >= e ? this.yieldReturn(c) : this.yieldBreak() }, g.Blank) }) }; c.repeat = function (a, d) { return d != b ? c.repeat(a).take(d) : new c(function () { return new f(g.Blank, function () { return this.yieldReturn(a) }, g.Blank) }) }; c.repeatWithFinalize = function (a, e) { a = d.createLambda(a); e = d.createLambda(e); return new c(function () { var c; return new f(function () { c = a() }, function () { return this.yieldReturn(c) }, function () { if (c != b) { e(c); c = b } }) }) }; c.generate = function (a, e) { if (e != b) return c.generate(a).take(e); a = d.createLambda(a); return new c(function () { return new f(g.Blank, function () { return this.yieldReturn(a()) }, g.Blank) }) }; c.toInfinity = function (d, a) { if (d == b) d = 0; if (a == b) a = 1; return new c(function () { var b; return new f(function () { b = d - a }, function () { return this.yieldReturn(b += a) }, g.Blank) }) }; c.toNegativeInfinity = function (d, a) { if (d == b) d = 0; if (a == b) a = 1; return new c(function () { var b; return new f(function () { b = d + a }, function () { return this.yieldReturn(b -= a) }, g.Blank) }) }; c.unfold = function (h, b) { b = d.createLambda(b); return new c(function () { var d = e, c; return new f(g.Blank, function () { if (d) { d = a; c = h; return this.yieldReturn(c) } c = b(c); return this.yieldReturn(c) }, g.Blank) }) }; c.defer = function (a) { return new c(function () { var b; return new f(function () { b = c.from(a()).getEnumerator() }, function () { return b.moveNext() ? this.yieldReturn(b.current()) : this.yieldBreak() }, function () { d.dispose(b) }) }) }; c.prototype.traverseBreadthFirst = function (g, b) { var h = this; g = d.createLambda(g); b = d.createLambda(b); return new c(function () { var i, k = 0, j = []; return new f(function () { i = h.getEnumerator() }, function () { while (e) { if (i.moveNext()) { j.push(i.current()); return this.yieldReturn(b(i.current(), k)) } var f = c.from(j).selectMany(function (a) { return g(a) }); if (!f.any()) return a; else { k++; j = []; d.dispose(i); i = f.getEnumerator() } } }, function () { d.dispose(i) }) }) }; c.prototype.traverseDepthFirst = function (g, b) { var h = this; g = d.createLambda(g); b = d.createLambda(b); return new c(function () { var j = [], i; return new f(function () { i = h.getEnumerator() }, function () { while (e) { if (i.moveNext()) { var f = b(i.current(), j.length); j.push(i); i = c.from(g(i.current())).getEnumerator(); return this.yieldReturn(f) } if (j.length <= 0) return a; d.dispose(i); i = j.pop() } }, function () { try { d.dispose(i) } finally { c.from(j).forEach(function (a) { a.dispose() }) } }) }) }; c.prototype.flatten = function () { var h = this; return new c(function () { var j, i = b; return new f(function () { j = h.getEnumerator() }, function () { while (e) { if (i != b) if (i.moveNext()) return this.yieldReturn(i.current()); else i = b; if (j.moveNext()) if (j.current() instanceof Array) { d.dispose(i); i = c.from(j.current()).selectMany(g.Identity).flatten().getEnumerator(); continue } else return this.yieldReturn(j.current()); return a } }, function () { try { d.dispose(j) } finally { d.dispose(i) } }) }) }; c.prototype.pairwise = function (b) { var e = this; b = d.createLambda(b); return new c(function () { var c; return new f(function () { c = e.getEnumerator(); c.moveNext() }, function () { var d = c.current(); return c.moveNext() ? this.yieldReturn(b(d, c.current())) : a }, function () { d.dispose(c) }) }) }; c.prototype.scan = function (i, g) { var h; if (g == b) { g = d.createLambda(i); h = a } else { g = d.createLambda(g); h = e } var j = this; return new c(function () { var b, c, k = e; return new f(function () { b = j.getEnumerator() }, function () { if (k) { k = a; if (!h) { if (b.moveNext()) return this.yieldReturn(c = b.current()) } else return this.yieldReturn(c = i) } return b.moveNext() ? this.yieldReturn(c = g(c, b.current())) : a }, function () { d.dispose(b) }) }) }; c.prototype.select = function (e) { e = d.createLambda(e); if (e.length <= 1) return new m(this, b, e); else { var g = this; return new c(function () { var b, c = 0; return new f(function () { b = g.getEnumerator() }, function () { return b.moveNext() ? this.yieldReturn(e(b.current(), c++)) : a }, function () { d.dispose(b) }) }) } }; c.prototype.selectMany = function (g, e) { var h = this; g = d.createLambda(g); if (e == b) e = function (b, a) { return a }; e = d.createLambda(e); return new c(function () { var k, i = j, l = 0; return new f(function () { k = h.getEnumerator() }, function () { if (i === j) if (!k.moveNext()) return a; do { if (i == b) { var f = g(k.current(), l++); i = c.from(f).getEnumerator() } if (i.moveNext()) return this.yieldReturn(e(k.current(), i.current())); d.dispose(i); i = b } while (k.moveNext()); return a }, function () { try { d.dispose(k) } finally { d.dispose(i) } }) }) }; c.prototype.where = function (b) { b = d.createLambda(b); if (b.length <= 1) return new n(this, b); else { var e = this; return new c(function () { var c, g = 0; return new f(function () { c = e.getEnumerator() }, function () { while (c.moveNext()) if (b(c.current(), g++)) return this.yieldReturn(c.current()); return a }, function () { d.dispose(c) }) }) } }; c.prototype.choose = function (a) { a = d.createLambda(a); var e = this; return new c(function () { var c, g = 0; return new f(function () { c = e.getEnumerator() }, function () { while (c.moveNext()) { var d = a(c.current(), g++); if (d != b) return this.yieldReturn(d) } return this.yieldBreak() }, function () { d.dispose(c) }) }) }; c.prototype.ofType = function (c) { var a; switch (c) { case Number: a = i.Number; break; case String: a = i.String; break; case Boolean: a = i.Boolean; break; case Function: a = i.Function; break; default: a = b }return a === b ? this.where(function (a) { return a instanceof c }) : this.where(function (b) { return typeof b === a }) }; c.prototype.zip = function () { var i = arguments, e = d.createLambda(arguments[arguments.length - 1]), g = this; if (arguments.length == 2) { var h = arguments[0]; return new c(function () { var i, b, j = 0; return new f(function () { i = g.getEnumerator(); b = c.from(h).getEnumerator() }, function () { return i.moveNext() && b.moveNext() ? this.yieldReturn(e(i.current(), b.current(), j++)) : a }, function () { try { d.dispose(i) } finally { d.dispose(b) } }) }) } else return new c(function () { var a, h = 0; return new f(function () { var b = c.make(g).concat(c.from(i).takeExceptLast().select(c.from)).select(function (a) { return a.getEnumerator() }).toArray(); a = c.from(b) }, function () { if (a.all(function (a) { return a.moveNext() })) { var c = a.select(function (a) { return a.current() }).toArray(); c.push(h++); return this.yieldReturn(e.apply(b, c)) } else return this.yieldBreak() }, function () { c.from(a).forEach(d.dispose) }) }) }; c.prototype.merge = function () { var b = arguments, a = this; return new c(function () { var e, g = -1; return new f(function () { e = c.make(a).concat(c.from(b).select(c.from)).select(function (a) { return a.getEnumerator() }).toArray() }, function () { while (e.length > 0) { g = g >= e.length - 1 ? 0 : g + 1; var a = e[g]; if (a.moveNext()) return this.yieldReturn(a.current()); else { a.dispose(); e.splice(g--, 1) } } return this.yieldBreak() }, function () { c.from(e).forEach(d.dispose) }) }) }; c.prototype.join = function (n, i, h, l, k) { i = d.createLambda(i); h = d.createLambda(h); l = d.createLambda(l); k = d.createLambda(k); var m = this; return new c(function () { var o, r, p = b, q = 0; return new f(function () { o = m.getEnumerator(); r = c.from(n).toLookup(h, g.Identity, k) }, function () { while (e) { if (p != b) { var c = p[q++]; if (c !== j) return this.yieldReturn(l(o.current(), c)); c = b; q = 0 } if (o.moveNext()) { var d = i(o.current()); p = r.get(d).toArray() } else return a } }, function () { d.dispose(o) }) }) }; c.prototype.groupJoin = function (l, h, e, j, i) { h = d.createLambda(h); e = d.createLambda(e); j = d.createLambda(j); i = d.createLambda(i); var k = this; return new c(function () { var m = k.getEnumerator(), n = b; return new f(function () { m = k.getEnumerator(); n = c.from(l).toLookup(e, g.Identity, i) }, function () { if (m.moveNext()) { var b = n.get(h(m.current())); return this.yieldReturn(j(m.current(), b)) } return a }, function () { d.dispose(m) }) }) }; c.prototype.all = function (b) { b = d.createLambda(b); var c = e; this.forEach(function (d) { if (!b(d)) { c = a; return a } }); return c }; c.prototype.any = function (c) { c = d.createLambda(c); var b = this.getEnumerator(); try { if (arguments.length == 0) return b.moveNext(); while (b.moveNext()) if (c(b.current())) return e; return a } finally { d.dispose(b) } }; c.prototype.isEmpty = function () { return !this.any() }; c.prototype.concat = function () { var e = this; if (arguments.length == 1) { var g = arguments[0]; return new c(function () { var i, h; return new f(function () { i = e.getEnumerator() }, function () { if (h == b) { if (i.moveNext()) return this.yieldReturn(i.current()); h = c.from(g).getEnumerator() } return h.moveNext() ? this.yieldReturn(h.current()) : a }, function () { try { d.dispose(i) } finally { d.dispose(h) } }) }) } else { var h = arguments; return new c(function () { var a; return new f(function () { a = c.make(e).concat(c.from(h).select(c.from)).select(function (a) { return a.getEnumerator() }).toArray() }, function () { while (a.length > 0) { var b = a[0]; if (b.moveNext()) return this.yieldReturn(b.current()); else { b.dispose(); a.splice(0, 1) } } return this.yieldBreak() }, function () { c.from(a).forEach(d.dispose) }) }) } }; c.prototype.insert = function (h, b) { var g = this; return new c(function () { var j, i, l = 0, k = a; return new f(function () { j = g.getEnumerator(); i = c.from(b).getEnumerator() }, function () { if (l == h && i.moveNext()) { k = e; return this.yieldReturn(i.current()) } if (j.moveNext()) { l++; return this.yieldReturn(j.current()) } return !k && i.moveNext() ? this.yieldReturn(i.current()) : a }, function () { try { d.dispose(j) } finally { d.dispose(i) } }) }) }; c.prototype.alternate = function (a) { var g = this; return new c(function () { var j, i, k, h; return new f(function () { if (a instanceof Array || a.getEnumerator != b) k = c.from(c.from(a).toArray()); else k = c.make(a); i = g.getEnumerator(); if (i.moveNext()) j = i.current() }, function () { while (e) { if (h != b) if (h.moveNext()) return this.yieldReturn(h.current()); else h = b; if (j == b && i.moveNext()) { j = i.current(); h = k.getEnumerator(); continue } else if (j != b) { var a = j; j = b; return this.yieldReturn(a) } return this.yieldBreak() } }, function () { try { d.dispose(i) } finally { d.dispose(h) } }) }) }; c.prototype.contains = function (f, b) { b = d.createLambda(b); var c = this.getEnumerator(); try { while (c.moveNext()) if (b(c.current()) === f) return e; return a } finally { d.dispose(c) } }; c.prototype.defaultIfEmpty = function (g) { var h = this; if (g === j) g = b; return new c(function () { var b, c = e; return new f(function () { b = h.getEnumerator() }, function () { if (b.moveNext()) { c = a; return this.yieldReturn(b.current()) } else if (c) { c = a; return this.yieldReturn(g) } return a }, function () { d.dispose(b) }) }) }; c.prototype.distinct = function (a) { return this.except(c.empty(), a) }; c.prototype.distinctUntilChanged = function (b) { b = d.createLambda(b); var e = this; return new c(function () { var c, g, h; return new f(function () { c = e.getEnumerator() }, function () { while (c.moveNext()) { var d = b(c.current()); if (h) { h = a; g = d; return this.yieldReturn(c.current()) } if (g === d) continue; g = d; return this.yieldReturn(c.current()) } return this.yieldBreak() }, function () { d.dispose(c) }) }) }; c.prototype.except = function (e, b) { b = d.createLambda(b); var g = this; return new c(function () { var h, i; return new f(function () { h = g.getEnumerator(); i = new r(b); c.from(e).forEach(function (a) { i.add(a) }) }, function () { while (h.moveNext()) { var b = h.current(); if (!i.contains(b)) { i.add(b); return this.yieldReturn(b) } } return a }, function () { d.dispose(h) }) }) }; c.prototype.intersect = function (e, b) { b = d.createLambda(b); var g = this; return new c(function () { var h, i, j; return new f(function () { h = g.getEnumerator(); i = new r(b); c.from(e).forEach(function (a) { i.add(a) }); j = new r(b) }, function () { while (h.moveNext()) { var b = h.current(); if (!j.contains(b) && i.contains(b)) { j.add(b); return this.yieldReturn(b) } } return a }, function () { d.dispose(h) }) }) }; c.prototype.sequenceEqual = function (h, f) { f = d.createLambda(f); var g = this.getEnumerator(); try { var b = c.from(h).getEnumerator(); try { while (g.moveNext()) if (!b.moveNext() || f(g.current()) !== f(b.current())) return a; return b.moveNext() ? a : e } finally { d.dispose(b) } } finally { d.dispose(g) } }; c.prototype.union = function (e, b) { b = d.createLambda(b); var g = this; return new c(function () { var k, h, i; return new f(function () { k = g.getEnumerator(); i = new r(b) }, function () { var b; if (h === j) { while (k.moveNext()) { b = k.current(); if (!i.contains(b)) { i.add(b); return this.yieldReturn(b) } } h = c.from(e).getEnumerator() } while (h.moveNext()) { b = h.current(); if (!i.contains(b)) { i.add(b); return this.yieldReturn(b) } } return a }, function () { try { d.dispose(k) } finally { d.dispose(h) } }) }) }; c.prototype.orderBy = function (b) { return new k(this, b, a) }; c.prototype.orderByDescending = function (a) { return new k(this, a, e) }; c.prototype.reverse = function () { var b = this; return new c(function () { var c, d; return new f(function () { c = b.toArray(); d = c.length }, function () { return d > 0 ? this.yieldReturn(c[--d]) : a }, g.Blank) }) }; c.prototype.shuffle = function () { var b = this; return new c(function () { var c; return new f(function () { c = b.toArray() }, function () { if (c.length > 0) { var b = Math.floor(Math.random() * c.length); return this.yieldReturn(c.splice(b, 1)[0]) } return a }, g.Blank) }) }; c.prototype.weightedSample = function (a) { a = d.createLambda(a); var e = this; return new c(function () { var c, d = 0; return new f(function () { c = e.choose(function (e) { var c = a(e); if (c <= 0) return b; d += c; return { value: e, bound: d } }).toArray() }, function () { if (c.length > 0) { var f = Math.floor(Math.random() * d) + 1, e = -1, a = c.length; while (a - e > 1) { var b = Math.floor((e + a) / 2); if (c[b].bound >= f) a = b; else e = b } return this.yieldReturn(c[a].value) } return this.yieldBreak() }, g.Blank) }) }; c.prototype.groupBy = function (i, h, e, g) { var j = this; i = d.createLambda(i); h = d.createLambda(h); if (e != b) e = d.createLambda(e); g = d.createLambda(g); return new c(function () { var c; return new f(function () { c = j.toLookup(i, h, g).toEnumerable().getEnumerator() }, function () { while (c.moveNext()) return e == b ? this.yieldReturn(c.current()) : this.yieldReturn(e(c.current().key(), c.current())); return a }, function () { d.dispose(c) }) }) }; c.prototype.partitionBy = function (j, i, g, h) { var l = this; j = d.createLambda(j); i = d.createLambda(i); h = d.createLambda(h); var k; if (g == b) { k = a; g = function (b, a) { return new u(b, a) } } else { k = e; g = d.createLambda(g) } return new c(function () { var b, n, o, m = []; return new f(function () { b = l.getEnumerator(); if (b.moveNext()) { n = j(b.current()); o = h(n); m.push(i(b.current())) } }, function () { var d; while ((d = b.moveNext()) == e) if (o === h(j(b.current()))) m.push(i(b.current())); else break; if (m.length > 0) { var f = k ? g(n, c.from(m)) : g(n, m); if (d) { n = j(b.current()); o = h(n); m = [i(b.current())] } else m = []; return this.yieldReturn(f) } return a }, function () { d.dispose(b) }) }) }; c.prototype.buffer = function (e) { var b = this; return new c(function () { var c; return new f(function () { c = b.getEnumerator() }, function () { var b = [], d = 0; while (c.moveNext()) { b.push(c.current()); if (++d >= e) return this.yieldReturn(b) } return b.length > 0 ? this.yieldReturn(b) : a }, function () { d.dispose(c) }) }) }; c.prototype.aggregate = function (c, b, a) { a = d.createLambda(a); return a(this.scan(c, b, a).last()) }; c.prototype.average = function (a) { a = d.createLambda(a); var c = 0, b = 0; this.forEach(function (d) { c += a(d); ++b }); return c / b }; c.prototype.count = function (a) { a = a == b ? g.True : d.createLambda(a); var c = 0; this.forEach(function (d, b) { if (a(d, b)) ++c }); return c }; c.prototype.max = function (a) { if (a == b) a = g.Identity; return this.select(a).aggregate(function (a, b) { return a > b ? a : b }) }; c.prototype.min = function (a) { if (a == b) a = g.Identity; return this.select(a).aggregate(function (a, b) { return a < b ? a : b }) }; c.prototype.maxBy = function (a) { a = d.createLambda(a); return this.aggregate(function (b, c) { return a(b) > a(c) ? b : c }) }; c.prototype.minBy = function (a) { a = d.createLambda(a); return this.aggregate(function (b, c) { return a(b) < a(c) ? b : c }) }; c.prototype.sum = function (a) { if (a == b) a = g.Identity; return this.select(a).aggregate(0, function (a, b) { return a + b }) }; c.prototype.elementAt = function (d) { var c, b = a; this.forEach(function (g, f) { if (f == d) { c = g; b = e; return a } }); if (!b) throw new Error("index is less than 0 or greater than or equal to the number of elements in source."); return c }; c.prototype.elementAtOrDefault = function (g, c) { if (c === j) c = b; var f, d = a; this.forEach(function (c, b) { if (b == g) { f = c; d = e; return a } }); return !d ? c : f }; c.prototype.first = function (c) { if (c != b) return this.where(c).first(); var f, d = a; this.forEach(function (b) { f = b; d = e; return a }); if (!d) throw new Error("first:No element satisfies the condition."); return f }; c.prototype.firstOrDefault = function (d, c) { if (c === j) c = b; if (d != b) return this.where(d).firstOrDefault(b, c); var g, f = a; this.forEach(function (b) { g = b; f = e; return a }); return !f ? c : g }; c.prototype.last = function (c) { if (c != b) return this.where(c).last(); var f, d = a; this.forEach(function (a) { d = e; f = a }); if (!d) throw new Error("last:No element satisfies the condition."); return f }; c.prototype.lastOrDefault = function (d, c) { if (c === j) c = b; if (d != b) return this.where(d).lastOrDefault(b, c); var g, f = a; this.forEach(function (a) { f = e; g = a }); return !f ? c : g }; c.prototype.single = function (d) { if (d != b) return this.where(d).single(); var f, c = a; this.forEach(function (a) { if (!c) { c = e; f = a } else throw new Error(q); }); if (!c) throw new Error("single:No element satisfies the condition."); return f }; c.prototype.singleOrDefault = function (f, c) { if (c === j) c = b; if (f != b) return this.where(f).singleOrDefault(b, c); var g, d = a; this.forEach(function (a) { if (!d) { d = e; g = a } else throw new Error(q); }); return !d ? c : g }; c.prototype.skip = function (e) { var b = this; return new c(function () { var c, g = 0; return new f(function () { c = b.getEnumerator(); while (g++ < e && c.moveNext()); }, function () { return c.moveNext() ? this.yieldReturn(c.current()) : a }, function () { d.dispose(c) }) }) }; c.prototype.skipWhile = function (b) { b = d.createLambda(b); var g = this; return new c(function () { var c, i = 0, h = a; return new f(function () { c = g.getEnumerator() }, function () { while (!h) if (c.moveNext()) { if (!b(c.current(), i++)) { h = e; return this.yieldReturn(c.current()) } continue } else return a; return c.moveNext() ? this.yieldReturn(c.current()) : a }, function () { d.dispose(c) }) }) }; c.prototype.take = function (e) { var b = this; return new c(function () { var c, g = 0; return new f(function () { c = b.getEnumerator() }, function () { return g++ < e && c.moveNext() ? this.yieldReturn(c.current()) : a }, function () { d.dispose(c) }) }) }; c.prototype.takeWhile = function (b) { b = d.createLambda(b); var e = this; return new c(function () { var c, g = 0; return new f(function () { c = e.getEnumerator() }, function () { return c.moveNext() && b(c.current(), g++) ? this.yieldReturn(c.current()) : a }, function () { d.dispose(c) }) }) }; c.prototype.takeExceptLast = function (e) { if (e == b) e = 1; var g = this; return new c(function () { if (e <= 0) return g.getEnumerator(); var b, c = []; return new f(function () { b = g.getEnumerator() }, function () { while (b.moveNext()) { if (c.length == e) { c.push(b.current()); return this.yieldReturn(c.shift()) } c.push(b.current()) } return a }, function () { d.dispose(b) }) }) }; c.prototype.takeFromLast = function (e) { if (e <= 0 || e == b) return c.empty(); var g = this; return new c(function () { var j, h, i = []; return new f(function () { j = g.getEnumerator() }, function () { while (j.moveNext()) { i.length == e && i.shift(); i.push(j.current()) } if (h == b) h = c.from(i).getEnumerator(); return h.moveNext() ? this.yieldReturn(h.current()) : a }, function () { d.dispose(h) }) }) }; c.prototype.indexOf = function (d) { var c = b; if (typeof d === i.Function) this.forEach(function (e, b) { if (d(e, b)) { c = b; return a } }); else this.forEach(function (e, b) { if (e === d) { c = b; return a } }); return c !== b ? c : -1 }; c.prototype.lastIndexOf = function (b) { var a = -1; if (typeof b === i.Function) this.forEach(function (d, c) { if (b(d, c)) a = c }); else this.forEach(function (d, c) { if (d === b) a = c }); return a }; c.prototype.cast = function () { return this }; c.prototype.asEnumerable = function () { return c.from(this) }; c.prototype.toArray = function () { var a = []; this.forEach(function (b) { a.push(b) }); return a }; c.prototype.toLookup = function (c, b, a) { c = d.createLambda(c); b = d.createLambda(b); a = d.createLambda(a); var e = new r(a); this.forEach(function (g) { var f = c(g), a = b(g), d = e.get(f); if (d !== j) d.push(a); else e.add(f, [a]) }); return new w(e) }; c.prototype.toObject = function (b, a) { b = d.createLambda(b); a = d.createLambda(a); var c = {}; this.forEach(function (d) { c[b(d)] = a(d) }); return c }; c.prototype.toDictionary = function (c, b, a) { c = d.createLambda(c); b = d.createLambda(b); a = d.createLambda(a); var e = new r(a); this.forEach(function (a) { e.add(c(a), b(a)) }); return e }; c.prototype.toJSONString = function (a, c) { if (typeof JSON === i.Undefined || JSON.stringify == b) throw new Error("toJSONString can't find JSON.stringify. This works native JSON support Browser or include json2.js"); return JSON.stringify(this.toArray(), a, c) }; c.prototype.toJoinedString = function (a, c) { if (a == b) a = ""; if (c == b) c = g.Identity; return this.select(c).toArray().join(a) }; c.prototype.doAction = function (b) { var e = this; b = d.createLambda(b); return new c(function () { var c, g = 0; return new f(function () { c = e.getEnumerator() }, function () { if (c.moveNext()) { b(c.current(), g++); return this.yieldReturn(c.current()) } return a }, function () { d.dispose(c) }) }) }; c.prototype.forEach = function (c) { c = d.createLambda(c); var e = 0, b = this.getEnumerator(); try { while (b.moveNext()) if (c(b.current(), e++) === a) break } finally { d.dispose(b) } }; c.prototype.write = function (c, f) { if (c == b) c = ""; f = d.createLambda(f); var g = e; this.forEach(function (b) { if (g) g = a; else document.write(c); document.write(f(b)) }) }; c.prototype.writeLine = function (a) { a = d.createLambda(a); this.forEach(function (b) { document.writeln(a(b) + "<br />") }) }; c.prototype.force = function () { var a = this.getEnumerator(); try { while (a.moveNext()); } finally { d.dispose(a) } }; c.prototype.letBind = function (b) { b = d.createLambda(b); var e = this; return new c(function () { var g; return new f(function () { g = c.from(b(e)).getEnumerator() }, function () { return g.moveNext() ? this.yieldReturn(g.current()) : a }, function () { d.dispose(g) }) }) }; c.prototype.share = function () { var i = this, c, h = a; return new s(function () { return new f(function () { if (c == b) c = i.getEnumerator() }, function () { if (h) throw new Error(l); return c.moveNext() ? this.yieldReturn(c.current()) : a }, g.Blank) }, function () { h = e; d.dispose(c) }) }; c.prototype.memoize = function () { var j = this, h, c, i = a; return new s(function () { var d = -1; return new f(function () { if (c == b) { c = j.getEnumerator(); h = [] } }, function () { if (i) throw new Error(l); d++; return h.length <= d ? c.moveNext() ? this.yieldReturn(h[d] = c.current()) : a : this.yieldReturn(h[d]) }, g.Blank) }, function () { i = e; d.dispose(c); h = b }) }; c.prototype.catchError = function (b) { b = d.createLambda(b); var e = this; return new c(function () { var c; return new f(function () { c = e.getEnumerator() }, function () { try { return c.moveNext() ? this.yieldReturn(c.current()) : a } catch (d) { b(d); return a } }, function () { d.dispose(c) }) }) }; c.prototype.finallyAction = function (b) { b = d.createLambda(b); var e = this; return new c(function () { var c; return new f(function () { c = e.getEnumerator() }, function () { return c.moveNext() ? this.yieldReturn(c.current()) : a }, function () { try { d.dispose(c) } finally { b() } }) }) }; c.prototype.log = function (a) { a = d.createLambda(a); return this.doAction(function (b) { typeof console !== i.Undefined && console.log(a(b)) }) }; c.prototype.trace = function (c, a) { if (c == b) c = "Trace"; a = d.createLambda(a); return this.doAction(function (b) { typeof console !== i.Undefined && console.log(c, a(b)) }) }; var k = function (f, b, c, e) { var a = this; a.source = f; a.keySelector = d.createLambda(b); a.descending = c; a.parent = e }; k.prototype = new c; k.prototype.createOrderedEnumerable = function (a, b) { return new k(this.source, a, b, this) }; k.prototype.thenBy = function (b) { return this.createOrderedEnumerable(b, a) }; k.prototype.thenByDescending = function (a) { return this.createOrderedEnumerable(a, e) }; k.prototype.getEnumerator = function () { var h = this, d, c, e = 0; return new f(function () { d = []; c = []; h.source.forEach(function (b, a) { d.push(b); c.push(a) }); var a = p.create(h, b); a.GenerateKeys(d); c.sort(function (b, c) { return a.compare(b, c) }) }, function () { return e < c.length ? this.yieldReturn(d[c[e++]]) : a }, g.Blank) }; var p = function (c, d, e) { var a = this; a.keySelector = c; a.descending = d; a.child = e; a.keys = b }; p.create = function (a, d) { var c = new p(a.keySelector, a.descending, d); return a.parent != b ? p.create(a.parent, c) : c }; p.prototype.GenerateKeys = function (d) { var a = this; for (var f = d.length, g = a.keySelector, e = new Array(f), c = 0; c < f; c++)e[c] = g(d[c]); a.keys = e; a.child != b && a.child.GenerateKeys(d) }; p.prototype.compare = function (e, f) { var a = this, c = d.compare(a.keys[e], a.keys[f]); return c == 0 ? a.child != b ? a.child.compare(e, f) : d.compare(e, f) : a.descending ? -c : c }; var s = function (a, b) { this.dispose = b; c.call(this, a) }; s.prototype = new c; var h = function (a) { this.getSource = function () { return a } }; h.prototype = new c; h.prototype.any = function (a) { return a == b ? this.getSource().length > 0 : c.prototype.any.apply(this, arguments) }; h.prototype.count = function (a) { return a == b ? this.getSource().length : c.prototype.count.apply(this, arguments) }; h.prototype.elementAt = function (a) { var b = this.getSource(); return 0 <= a && a < b.length ? b[a] : c.prototype.elementAt.apply(this, arguments) }; h.prototype.elementAtOrDefault = function (c, a) { if (a === j) a = b; var d = this.getSource(); return 0 <= c && c < d.length ? d[c] : a }; h.prototype.first = function (d) { var a = this.getSource(); return d == b && a.length > 0 ? a[0] : c.prototype.first.apply(this, arguments) }; h.prototype.firstOrDefault = function (e, a) { if (a === j) a = b; if (e != b) return c.prototype.firstOrDefault.apply(this, arguments); var d = this.getSource(); return d.length > 0 ? d[0] : a }; h.prototype.last = function (d) { var a = this.getSource(); return d == b && a.length > 0 ? a[a.length - 1] : c.prototype.last.apply(this, arguments) }; h.prototype.lastOrDefault = function (e, a) { if (a === j) a = b; if (e != b) return c.prototype.lastOrDefault.apply(this, arguments); var d = this.getSource(); return d.length > 0 ? d[d.length - 1] : a }; h.prototype.skip = function (d) { var b = this.getSource(); return new c(function () { var c; return new f(function () { c = d < 0 ? 0 : d }, function () { return c < b.length ? this.yieldReturn(b[c++]) : a }, g.Blank) }) }; h.prototype.takeExceptLast = function (a) { if (a == b) a = 1; return this.take(this.getSource().length - a) }; h.prototype.takeFromLast = function (a) { return this.skip(this.getSource().length - a) }; h.prototype.reverse = function () { var b = this.getSource(); return new c(function () { var c; return new f(function () { c = b.length }, function () { return c > 0 ? this.yieldReturn(b[--c]) : a }, g.Blank) }) }; h.prototype.sequenceEqual = function (d, e) { return (d instanceof h || d instanceof Array) && e == b && c.from(d).count() != this.count() ? a : c.prototype.sequenceEqual.apply(this, arguments) }; h.prototype.toJoinedString = function (a, e) { var d = this.getSource(); if (e != b || !(d instanceof Array)) return c.prototype.toJoinedString.apply(this, arguments); if (a == b) a = ""; return d.join(a) }; h.prototype.getEnumerator = function () { var a = this.getSource(), b = -1; return { current: function () { return a[b] }, moveNext: function () { return ++b < a.length }, dispose: g.Blank } }; var n = function (b, a) { this.prevSource = b; this.prevPredicate = a }; n.prototype = new c; n.prototype.where = function (a) { a = d.createLambda(a); if (a.length <= 1) { var e = this.prevPredicate, b = function (b) { return e(b) && a(b) }; return new n(this.prevSource, b) } else return c.prototype.where.call(this, a) }; n.prototype.select = function (a) { a = d.createLambda(a); return a.length <= 1 ? new m(this.prevSource, this.prevPredicate, a) : c.prototype.select.call(this, a) }; n.prototype.getEnumerator = function () { var c = this.prevPredicate, e = this.prevSource, b; return new f(function () { b = e.getEnumerator() }, function () { while (b.moveNext()) if (c(b.current())) return this.yieldReturn(b.current()); return a }, function () { d.dispose(b) }) }; var m = function (c, a, b) { this.prevSource = c; this.prevPredicate = a; this.prevSelector = b }; m.prototype = new c; m.prototype.where = function (a) { a = d.createLambda(a); return a.length <= 1 ? new n(this, a) : c.prototype.where.call(this, a) }; m.prototype.select = function (a) { var b = this; a = d.createLambda(a); if (a.length <= 1) { var f = b.prevSelector, e = function (b) { return a(f(b)) }; return new m(b.prevSource, b.prevPredicate, e) } else return c.prototype.select.call(b, a) }; m.prototype.getEnumerator = function () { var e = this.prevPredicate, g = this.prevSelector, h = this.prevSource, c; return new f(function () { c = h.getEnumerator() }, function () { while (c.moveNext()) if (e == b || e(c.current())) return this.yieldReturn(g(c.current())); return a }, function () { d.dispose(c) }) }; var r = function () { var d = function (a, b) { return Object.prototype.hasOwnProperty.call(a, b) }, h = function (a) { return a === b ? "null" : a === j ? "undefined" : typeof a.toString === i.Function ? a.toString() : Object.prototype.toString.call(a) }, m = function (d, c) { var a = this; a.key = d; a.value = c; a.prev = b; a.next = b }, k = function () { this.first = b; this.last = b }; k.prototype = { addLast: function (c) { var a = this; if (a.last != b) { a.last.next = c; c.prev = a.last; a.last = c } else a.first = a.last = c }, replace: function (c, a) { if (c.prev != b) { c.prev.next = a; a.prev = c.prev } else this.first = a; if (c.next != b) { c.next.prev = a; a.next = c.next } else this.last = a }, remove: function (a) { if (a.prev != b) a.prev.next = a.next; else this.first = a.next; if (a.next != b) a.next.prev = a.prev; else this.last = a.prev } }; var l = function (c) { var a = this; a.countField = 0; a.entryList = new k; a.buckets = {}; a.compareSelector = c == b ? g.Identity : c }; l.prototype = { add: function (i, j) { var a = this, g = a.compareSelector(i), f = h(g), c = new m(i, j); if (d(a.buckets, f)) { for (var b = a.buckets[f], e = 0; e < b.length; e++)if (a.compareSelector(b[e].key) === g) { a.entryList.replace(b[e], c); b[e] = c; return } b.push(c) } else a.buckets[f] = [c]; a.countField++; a.entryList.addLast(c) }, "get": function (i) { var a = this, c = a.compareSelector(i), g = h(c); if (!d(a.buckets, g)) return j; for (var e = a.buckets[g], b = 0; b < e.length; b++) { var f = e[b]; if (a.compareSelector(f.key) === c) return f.value } return j }, "set": function (k, l) { var b = this, g = b.compareSelector(k), j = h(g); if (d(b.buckets, j)) for (var f = b.buckets[j], c = 0; c < f.length; c++)if (b.compareSelector(f[c].key) === g) { var i = new m(k, l); b.entryList.replace(f[c], i); f[c] = i; return e } return a }, contains: function (j) { var b = this, f = b.compareSelector(j), i = h(f); if (!d(b.buckets, i)) return a; for (var g = b.buckets[i], c = 0; c < g.length; c++)if (b.compareSelector(g[c].key) === f) return e; return a }, clear: function () { this.countField = 0; this.buckets = {}; this.entryList = new k }, remove: function (g) { var a = this, f = a.compareSelector(g), e = h(f); if (!d(a.buckets, e)) return; for (var b = a.buckets[e], c = 0; c < b.length; c++)if (a.compareSelector(b[c].key) === f) { a.entryList.remove(b[c]); b.splice(c, 1); if (b.length == 0) delete a.buckets[e]; a.countField--; return } }, count: function () { return this.countField }, toEnumerable: function () { var d = this; return new c(function () { var c; return new f(function () { c = d.entryList.first }, function () { if (c != b) { var d = { key: c.key, value: c.value }; c = c.next; return this.yieldReturn(d) } return a }, g.Blank) }) } }; return l }(), w = function (a) { var b = this; b.count = function () { return a.count() }; b.get = function (b) { return c.from(a.get(b)) }; b.contains = function (b) { return a.contains(b) }; b.toEnumerable = function () { return a.toEnumerable().select(function (a) { return new u(a.key, a.value) }) } }, u = function (b, a) { this.key = function () { return b }; h.call(this, a) }; u.prototype = new h; if (typeof define === i.Function && define.amd) define("linqjs", [], function () { return c }); else if (typeof module !== i.Undefined && module.exports) module.exports = c; else x.Enumerable = c })(this);
/**
* jQuery.AutoComplete - Transforma cualquier input en un AutoComplete.
* Valores posibles: Airlines, Airports, Cities, Countries.
* Copyright (c) 2012 Diego Mantelli - dmantelli(at)gmail(dot)com
* Desarrollado para Netactica S.A.
* Fecha: 10/07/2012
* @author Diego Mantelli
* @version 1.4
* Ultima Modificacion: 18/03/2013
*/

(function ($) {
    var defaultOptions = {
        type: 'Airlines',
        showIcon: false,
        showExcluded: false,
        scrollable: true,
        onSelect: function () { }
    };

    var normalize = function (term) {
        var ret = "";
        for (var i = 0; i < term.length; i++) {
            ret += $accentMap[term.charAt(i)] || term.charAt(i);
        }
        return ret;
    }

    var _getExternalFileKey = function (type, isNormalized, options) {
        if (!options.dataSupplier) {
            return "external_file_" + type + (isNormalized ? "_norm" : "");
        }

        var elementIdSplitted = options.elementId.split('_');
        return 'dataSupplier_' + elementIdSplitted[elementIdSplitted.length - 1] + (isNormalized ? "_norm" : "");
    }

    var _getDataExternalFileWithType = function (type, isNormalized, options) {
        var externalFileKey = _getExternalFileKey(type, isNormalized, options);
        return window[externalFileKey];
    }

    var _setDataExternalFileWithType = function (type, isNormalized, data, options) {
        var externalFileKey = _getExternalFileKey(type, isNormalized, options);
        window[externalFileKey] = data;
        return window[externalFileKey];
    }

    var _isNeighborhood = function (type) {
        return type === "Neighborhood";
    }

    var _createExternalFileWithTypeNormalized = function (type, options) {
        var isNeighborhood = _isNeighborhood(type);
        var items = null;
        var matches_ori = _getDataExternalFileWithType(type, false, options) || [];

        if (type == 'Cities' && typeof (external_file_cities_duplicate) != "undefined") {
            // Add cities duplicates
            try {
                items = $.merge(matches_ori, window["external_file_cities_duplicate"]);
            }
            catch (err) { items = matches_ori; }
        } else {
            items = matches_ori;
        }

        items = items || [];

        if (!isNeighborhood && !_getDataExternalFileWithType(type, true, options)) {
            var arrExternalFileWithTypeNormalized = [];
            for (var i = 0; i < items.length; i++) {
                var tag = items[i];
                var newTag = null;
                var hasExclude = tag.indexOf("|E") !== -1;
                if (hasExclude) {
                    newTag = tag.replace("|E", "");
                }
                else {
                    newTag = tag;
                }

                var code = undefined;

                var indexOfOpenParenthesis = newTag.indexOf('(');
                if (indexOfOpenParenthesis !== -1) {
                    code = normalize(newTag.substring(indexOfOpenParenthesis + 1, newTag.length - 1)).toUpperCase();
                }

                var indexOfComma = newTag.indexOf(",");
                if (indexOfComma !== -1) {
                    newTag = newTag.substring(0, indexOfComma);
                }

                arrExternalFileWithTypeNormalized.push({
                    desc: normalize(newTag).toUpperCase(),
                    code: code,
                    indexOfExternalFile: i,
                    hasExclude
                });
            };

            return _setDataExternalFileWithType(type, true, arrExternalFileWithTypeNormalized, options);
        }

        //Si es de tipo Neighborhood tengo que fijarme que la ciudad NO este excluida
        if (isNeighborhood && !_getDataExternalFileWithType(type, true, options)) {
            var arrExternalFileWithTypeNormalized = [];
            _createExternalFileWithTypeNormalized("Airports", options);
            var citiesEnum = Enumerable.from(_createExternalFileWithTypeNormalized("Cities", options));

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var cityItem = citiesEnum.firstOrDefault(function (city) {
                    return city.code === item.City;
                });

                if (!cityItem) {
                    continue;
                }

                arrExternalFileWithTypeNormalized.push({
                    desc: normalize(item.Desc).toUpperCase(),
                    code: cityItem.code, //Pongo el Codigo de la ciudad
                    id: item.Code,
                    indexOfExternalFile: i,
                    hasExclude: cityItem.hasExclude
                });
            };

            return _setDataExternalFileWithType(type, true, arrExternalFileWithTypeNormalized, options);
        }

        return _getDataExternalFileWithType(type, true, options);
    }

    var _createNetAutocompleteSearchMethod = function (type, options) {
        var isNeighborhood = _isNeighborhood(type);
        //Definicion de funciones de busqueda
        var netAutocompleteSearchMethodCommonKey = "NetAutocompleteSearchMethodCommon";
        if (!isNeighborhood) {
            if (!window[netAutocompleteSearchMethodCommonKey]) {
                //Funcion de busqueda general en el array de datos de autocomplete
                window[netAutocompleteSearchMethodCommonKey] = function (searchOptions) {
                    var normalizedTerm = searchOptions.normalizedTerm;
                    var normalizedTermUpperCase = searchOptions.normalizedTermUpperCase;
                    var type = searchOptions.type;

                    var result = [];
                    var indexOfExistingCode = -1;

                    var findByCode = normalizedTerm.length === 3;
                    var items = _getDataExternalFileWithType(type, false, options);
                    var itemsNormalized = _getDataExternalFileWithType(type, true, options);
                    var showExcluded = (typeof searchOptions.showExcluded !== 'undefined')
                        ? searchOptions.showExcluded : options.showExcluded;
                    for (var i = 0; i < itemsNormalized.length; i++) {
                        var itemNorm = itemsNormalized[i];
                        if (!showExcluded && itemNorm.hasExclude) {
                            continue;
                        }
                        var itemMatch = (findByCode ? (itemNorm.code.indexOf(normalizedTermUpperCase) !== -1) : false);
                        var hasCodeMatch = false;
                        if (itemMatch) {
                            hasCodeMatch = true;
                            indexOfExistingCode++;
                        }
                        else {
                            itemMatch = itemNorm.desc.indexOf(normalizedTermUpperCase) !== -1;
                        }

                        if (itemMatch) {
                            var item = items[itemNorm.indexOfExternalFile];
                            var isItemAnObject = typeof item === 'object';
                            var desc = isItemAnObject ? item.Desc : item;
                            var itemToPush = {
                                desc: itemNorm.hasExclude ? desc.replace("|E", "") : desc,
                                type: type,
                                code: itemNorm.code
                            };

                            if (isItemAnObject) {
                                itemToPush.id = itemNorm.id;
                            }

                            if (hasCodeMatch) {
                                result.splice(indexOfExistingCode, 0, itemToPush);
                            }
                            else {
                                result.push(itemToPush);
                            }
                        }
                    }

                    return result;
                };
            }

            return window[netAutocompleteSearchMethodCommonKey];
        }

        //Funcion de busqueda de Zonas en el array de datos de autocomplete
        var netAutocompleteSearchMethodNeighborhoodKey = "NetAutocompleteSearchMethodNeighborhood";
        if (!window[netAutocompleteSearchMethodNeighborhoodKey]) {
            window[netAutocompleteSearchMethodNeighborhoodKey] = function (searchOptions) {
                var normalizedTerm = searchOptions.normalizedTerm;
                var normalizedTermUpperCase = searchOptions.normalizedTermUpperCase;

                var results = [];

                //Creo el metodo de busqueda comun por las dudas que no se encuentre creado
                var commonSearchMethod = _createNetAutocompleteSearchMethod("ALL", options);
                var searchTypes = ["Airports", "Cities", "Neighborhood"];
                for (var i = 0; i < searchTypes.length; i++) {
                    var searchType = searchTypes[i];
                    var searchResults = commonSearchMethod({
                        normalizedTerm: normalizedTerm,
                        normalizedTermUpperCase: normalizedTermUpperCase,
                        type: searchType,
                        showExcluded: options.showExcluded
                    });

                    if (searchResults) {
                        for (var j = 0; j < searchResults.length; j++) {
                            results.push(searchResults[j]);
                        }
                    }
                }

                return results;
            };
        }

        return window[netAutocompleteSearchMethodNeighborhoodKey];
    }

    var methods = {
        init: function (options) {
            var translationsStr = this.attr('translations');
            var translations = undefined;
            if (translationsStr) {
                translations = JSON.parse(translationsStr);
            }

            if (options && typeof (options) == 'object') {
                options = $.extend({}, defaultOptions, options);
            };

            if ($(this).length > 0) {
                options.elementId = $(this)[0].id;

                _createExternalFileWithTypeNormalized(options.type, options);
                var searchMethod = _createNetAutocompleteSearchMethod(options.type, options);
                var $uiautcomplete = $(this).autocomplete({
                    source: function (request, response) {
                        var self = this;
                        if (self.renderItemsTimeoutId) {
                            clearTimeout(self.renderItemsTimeoutId);
                            delete self.renderItemsTimeoutId;
                        }

                        var normalizedTerm = normalize(request.term);
                        var result = searchMethod({
                            normalizedTerm: normalizedTerm,
                            normalizedTermUpperCase: normalizedTerm.toUpperCase(),
                            type: options.type
                        });

                        response(result);
                    },
                    autoFocus: true,
                    select: function (event, ui) {
                        if (ui.item.label) {
                            ui.item.value = ui.item.label;
                            return;
                        }

                        $(this).netautocomplete('setSelectedInfo', {
                            type: ui.item.type,
                            desc: ui.item.desc,
                            code: ui.item.code,
                            id: ui.item.id
                        });
                        ui.item.value = ui.item.desc;
                    },
                    delay: 0
                }).data("ui-autocomplete");
                
                $uiautcomplete._renderItem = function (ul, item) {
                    var type = options.type;
                    var desc = item.value || item.desc;
                    var code = item.code,
                        isNeighborhood = (type === "Neighborhood");

                    if (!isNeighborhood && !item.label) {
                        item.label = desc;
                    }

                    if (type == "AirportsCities") {
                        // si hay guión (-) es una ciudad
                        if (desc.substring(desc.indexOf('(') + 1, desc.indexOf(')') + 1).indexOf('-') < 0) {
                            item.description = "";
                            if (desc.substring(0, desc.indexOf('|') + 1).length > 0) {
                                item.description = desc.substring(0, desc.indexOf('|'));
                                item.label = item.label.substring(item.label.indexOf("|") + 1, item.label.length);
                            }

                            var urlIcon = window.location.origin + "/img/marker.png";
                            return $("<li></li>")
                                .data("item.autocomplete", item)
                                .append("<a><table style='margin-bottom: 0 !important; border-radius: 1px;'><td width='30px' valign='middle' style='padding: 2px 0 2px 0 !important'><img src='" + urlIcon + "' style='padding:0px 0px 0 2px;'></td><td valign='' align='left' style='padding: 0 !important'>" + item.label + "<br><span class='nts-text-secondary'>" + item.description + "</span></td></tr></table></a>")
                                .appendTo(ul);
                        }
                        else {
                            item.label = item.label.substring(item.label.indexOf("|") + 1, item.label.length);
                            item.label = item.label.substring(0, item.label.indexOf("(") + 1) + item.label.substring(item.label.indexOf("-") + 1, item.label.length);

                            var urlIcon = window.location.origin + "/img/flights.png";
                            return $("<li></li>")
                                .data("item.autocomplete", item)
                                .append("<a><table style='margin-bottom: 0 !important; border-radius: 1px;'><td width='30px' valign='middle' style='padding: 2px 0 2px 0 !important'><img src='" + urlIcon + "' style='padding:0px 0px 0 2px;'></td><td valign='' align='left' style='padding: 0 !important'>" + item.label + "<br><span class='nts-text-secondary'></span></td></tr></table></a>")
                                .appendTo(ul);
                        }
                    }
                    else if (isNeighborhood) {
                        var neighborhoodTypeTranslated = item.type;
                        switch (item.type) {
                            case "Airports":
                                neighborhoodTypeTranslated = translations[0];
                                break;

                            case "Cities":
                                neighborhoodTypeTranslated = translations[1];
                                break;

                            case "Neighborhood":
                                neighborhoodTypeTranslated = translations[2];
                                break;
                        }

                        return $('<li></li>')
                            .data("item.autocomplete", item)
                            .append("<a style='display: flex; flex-direction: row;'><div style='flex: 0 1 350px;'>" + desc + "</div><div style='text-align: center;flex: 1 1 auto;display: flex;'><div style='flex: 0 1 170px;'>" + neighborhoodTypeTranslated + "</div></div></a>")
                            .appendTo(ul);
                    }
                    else {
                        return $("<li></li>")
                            .data("item.autocomplete", item)
                            .append("<a>" + item.label + "</a>")
                            .appendTo(ul);
                    }
                };

                $uiautcomplete._renderMenu = function (ul, items) {
                    var self = this;
                    var itemsChunk = items.splice(0, 100);

                    for (var i = 0; i < itemsChunk.length; i++) {
                        var item = itemsChunk[i];
                        self._renderItemData(ul, item);
                    }

                    if (items.length > 0) {
                        self.renderItemsTimeoutId = setTimeout(function () {
                            self._renderMenu.call(self, ul, items);
                        }, 100);
                    }
                    else {
                        if (self.renderItemsTimeoutId) {
                            delete self.renderItemsTimeoutId;
                        }
                    }
                };

                if (typeof options.onSelect == 'function') {
                    $(this).bind("autocompleteselect", function (event, ui) {
                        setTimeout(function () {
                            options.onSelect();
                        }, 10);
                    });

                }

                if (options.scrollable)
                    $(this).autocomplete("widget").css({ "max-height": "150px", "overflow-y": "auto", "overflow-x": "hidden" });
                
            }
        },

        change: function (options) {
            $(this).autocomplete("destroy");
            $(window).unbind('.netautocomplete');

            if (options && typeof (options) == 'object') {
                options = $.extend({}, defaultOptions, options);
            };

            $(this).netautocomplete(options);
        },

        setSelectedInfo: function (info) {
            var dataId = $(this).attr('data-id');
            if (dataId) {
                $("#" + dataId).data('selectedInfo', info);
            }
            $(this).data('selectedInfo', info);
        },

        getSelectedInfo: function () {
            return $(this).data('selectedInfo');
        },

        getCode: function () {
            var selectedInfo = $(this).netautocomplete("getSelectedInfo");
            if (selectedInfo) {
                return selectedInfo.code;
            }

            if ($(this).val() != "" && $(this).val().indexOf("(") >= 0 && $(this).val().indexOf(")") > 0) {
                return $(this).val().substr($(this).val().indexOf('(') + 1).replace(")", "");
            }

            return "";
        }
    };

    $.fn.netautocomplete = function (method) {

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }

    };
})(jQuery);;
$accentMap = {
    'ẚ': 'a', 'Á': 'a', 'á': 'a', 'À': 'a', 'à': 'a', 'Ă': 'a', 'ă': 'a', 'Ắ': 'a', 'ắ': 'a', 'Ằ': 'a', 'ằ': 'a', 'Ẵ': 'a', 'ẵ': 'a', 'Ẳ': 'a', 'ẳ': 'a', 'Â': 'a',
    'â': 'a', 'Ấ': 'a', 'ấ': 'a', 'Ầ': 'a', 'ầ': 'a', 'Ẫ': 'a', 'ẫ': 'a', 'Ẩ': 'a', 'ẩ': 'a', 'Ǎ': 'a', 'ǎ': 'a', 'Å': 'a', 'å': 'a', 'Ǻ': 'a', 'ǻ': 'a', 'Ä': 'a',
    'ä': 'a', 'Ǟ': 'a', 'ǟ': 'a', 'Ã': 'a', 'ã': 'a', 'Ȧ': 'a', 'ȧ': 'a', 'Ǡ': 'a', 'ǡ': 'a', 'Ą': 'a', 'ą': 'a', 'Ā': 'a', 'ā': 'a', 'Ả': 'a', 'ả': 'a', 'Ȁ': 'a',
    'ȁ': 'a', 'Ȃ': 'a', 'ȃ': 'a', 'Ạ': 'a', 'ạ': 'a', 'Ặ': 'a', 'ặ': 'a', 'Ậ': 'a', 'ậ': 'a', 'Ḁ': 'a', 'ḁ': 'a', 'Ⱥ': 'a', 'ⱥ': 'a', 'Ǽ': 'a', 'ǽ': 'a', 'Ǣ': 'a',
    'ǣ': 'a', 'Ḃ': 'b', 'ḃ': 'b', 'Ḅ': 'b', 'ḅ': 'b', 'Ḇ': 'b', 'ḇ': 'b', 'Ƀ': 'b', 'ƀ': 'b', 'ᵬ': 'b', 'Ɓ': 'b', 'ɓ': 'b', 'Ƃ': 'b', 'ƃ': 'b', 'Ć': 'c', 'ć': 'c',
    'Ĉ': 'c', 'ĉ': 'c', 'Č': 'c', 'č': 'c', 'Ċ': 'c', 'ċ': 'c', 'Ç': 'c', 'ç': 'c', 'Ḉ': 'c', 'ḉ': 'c', 'Ȼ': 'c', 'ȼ': 'c', 'Ƈ': 'c', 'ƈ': 'c', 'ɕ': 'c', 'Ď': 'd',
    'ď': 'd', 'Ḋ': 'd', 'ḋ': 'd', 'Ḑ': 'd', 'ḑ': 'd', 'Ḍ': 'd', 'ḍ': 'd', 'Ḓ': 'd', 'ḓ': 'd', 'Ḏ': 'd', 'ḏ': 'd', 'Đ': 'd', 'đ': 'd', 'ᵭ': 'd', 'Ɖ': 'd', 'ɖ': 'd',
    'Ɗ': 'd', 'ɗ': 'd', 'Ƌ': 'd', 'ƌ': 'd', 'ȡ': 'd', 'ð': 'd', 'É': 'e', 'Ə': 'e', 'Ǝ': 'e', 'ǝ': 'e', 'é': 'e', 'È': 'e', 'è': 'e', 'Ĕ': 'e', 'ĕ': 'e', 'Ê': 'e',
    'ê': 'e', 'Ế': 'e', 'ế': 'e', 'Ề': 'e', 'ề': 'e', 'Ễ': 'e', 'ễ': 'e', 'Ể': 'e', 'ể': 'e', 'Ě': 'e', 'ě': 'e', 'Ë': 'e', 'ë': 'e', 'Ẽ': 'e', 'ẽ': 'e', 'Ė': 'e',
    'ė': 'e', 'Ȩ': 'e', 'ȩ': 'e', 'Ḝ': 'e', 'ḝ': 'e', 'Ę': 'e', 'ę': 'e', 'Ē': 'e', 'ē': 'e', 'Ḗ': 'e', 'ḗ': 'e', 'Ḕ': 'e', 'ḕ': 'e', 'Ẻ': 'e', 'ẻ': 'e', 'Ȅ': 'e',
    'ȅ': 'e', 'Ȇ': 'e', 'ȇ': 'e', 'Ẹ': 'e', 'ẹ': 'e', 'Ệ': 'e', 'ệ': 'e', 'Ḙ': 'e', 'ḙ': 'e', 'Ḛ': 'e', 'ḛ': 'e', 'Ɇ': 'e', 'ɇ': 'e', 'ɚ': 'e', 'ɝ': 'e', 'Ḟ': 'f',
    'ḟ': 'f', 'ᵮ': 'f', 'Ƒ': 'f', 'ƒ': 'f', 'Ǵ': 'g', 'ǵ': 'g', 'Ğ': 'g', 'ğ': 'g', 'Ĝ': 'g', 'ĝ': 'g', 'Ǧ': 'g', 'ǧ': 'g', 'Ġ': 'g', 'ġ': 'g', 'Ģ': 'g', 'ģ': 'g',
    'Ḡ': 'g', 'ḡ': 'g', 'Ǥ': 'g', 'ǥ': 'g', 'Ɠ': 'g', 'ɠ': 'g', 'Ĥ': 'h', 'ĥ': 'h', 'Ȟ': 'h', 'ȟ': 'h', 'Ḧ': 'h', 'ḧ': 'h', 'Ḣ': 'h', 'ḣ': 'h', 'Ḩ': 'h', 'ḩ': 'h',
    'Ḥ': 'h', 'ḥ': 'h', 'Ḫ': 'h', 'ḫ': 'h', 'H': 'h', '̱': 'h', 'ẖ': 'h', 'Ħ': 'h', 'ħ': 'h', 'Ⱨ': 'h', 'ⱨ': 'h', 'Í': 'i', 'í': 'i', 'Ì': 'i', 'ì': 'i', 'Ĭ': 'i',
    'ĭ': 'i', 'Î': 'i', 'î': 'i', 'Ǐ': 'i', 'ǐ': 'i', 'Ï': 'i', 'ï': 'i', 'Ḯ': 'i', 'ḯ': 'i', 'Ĩ': 'i', 'ĩ': 'i', 'İ': 'i', 'i': 'i', 'Į': 'i', 'į': 'i', 'Ī': 'i',
    'ī': 'i', 'Ỉ': 'i', 'ỉ': 'i', 'Ȉ': 'i', 'ȉ': 'i', 'Ȋ': 'i', 'ȋ': 'i', 'Ị': 'i', 'ị': 'i', 'Ḭ': 'i', 'ḭ': 'i', 'I': 'i', 'ı': 'i', 'Ɨ': 'i', 'ɨ': 'i', 'Ĵ': 'j',
    'ĵ': 'j', 'J': 'j', '̌': 'j', 'ǰ': 'j', 'ȷ': 'j', 'Ɉ': 'j', 'ɉ': 'j', 'ʝ': 'j', 'ɟ': 'j', 'ʄ': 'j', 'Ḱ': 'k', 'ḱ': 'k', 'Ǩ': 'k', 'ǩ': 'k', 'Ķ': 'k', 'ķ': 'k',
    'Ḳ': 'k', 'ḳ': 'k', 'Ḵ': 'k', 'ḵ': 'k', 'Ƙ': 'k', 'ƙ': 'k', 'Ⱪ': 'k', 'ⱪ': 'k', 'Ĺ': 'a', 'ĺ': 'l', 'Ľ': 'l', 'ľ': 'l', 'Ļ': 'l', 'ļ': 'l', 'Ḷ': 'l', 'ḷ': 'l',
    'Ḹ': 'l', 'ḹ': 'l', 'Ḽ': 'l', 'ḽ': 'l', 'Ḻ': 'l', 'ḻ': 'l', 'Ł': 'l', 'ł': 'l', 'Ł': 'l', '̣': 'l', 'ł': 'l', '̣': 'l', 'Ŀ': 'l', 'ŀ': 'l', 'Ƚ': 'l', 'ƚ': 'l',
    'Ⱡ': 'l', 'ⱡ': 'l', 'Ɫ': 'l', 'ɫ': 'l', 'ɬ': 'l', 'ɭ': 'l', 'ȴ': 'l', 'Ḿ': 'm', 'ḿ': 'm', 'Ṁ': 'm', 'ṁ': 'm', 'Ṃ': 'm', 'ṃ': 'm', 'ɱ': 'm', 'Ń': 'n', 'ń': 'n',
    'Ǹ': 'n', 'ǹ': 'n', 'Ň': 'n', 'ň': 'n', 'Ñ': 'n', 'ñ': 'n', 'Ṅ': 'n', 'ṅ': 'n', 'Ņ': 'n', 'ņ': 'n', 'Ṇ': 'n', 'ṇ': 'n', 'Ṋ': 'n', 'ṋ': 'n', 'Ṉ': 'n', 'ṉ': 'n',
    'Ɲ': 'n', 'ɲ': 'n', 'Ƞ': 'n', 'ƞ': 'n', 'ɳ': 'n', 'ȵ': 'n', 'N': 'n', '̈': 'n', 'n': 'n', '̈': 'n', 'Ó': 'o', 'ó': 'o', 'Ò': 'o', 'ò': 'o', 'Ŏ': 'o', 'ŏ': 'o',
    'Ô': 'o', 'ô': 'o', 'Ố': 'o', 'ố': 'o', 'Ồ': 'o', 'ồ': 'o', 'Ỗ': 'o', 'ỗ': 'o', 'Ổ': 'o', 'ổ': 'o', 'Ǒ': 'o', 'ǒ': 'o', 'Ö': 'o', 'ö': 'o', 'Ȫ': 'o', 'ȫ': 'o',
    'Ő': 'o', 'ő': 'o', 'Õ': 'o', 'õ': 'o', 'Ṍ': 'o', 'ṍ': 'o', 'Ṏ': 'o', 'ṏ': 'o', 'Ȭ': 'o', 'ȭ': 'o', 'Ȯ': 'o', 'ȯ': 'o', 'Ȱ': 'o', 'ȱ': 'o', 'Ø': 'o', 'ø': 'o',
    'Ǿ': 'o', 'ǿ': 'o', 'Ǫ': 'o', 'ǫ': 'o', 'Ǭ': 'o', 'ǭ': 'o', 'Ō': 'o', 'ō': 'o', 'Ṓ': 'o', 'ṓ': 'o', 'Ṑ': 'o', 'ṑ': 'o', 'Ỏ': 'o', 'ỏ': 'o', 'Ȍ': 'o', 'ȍ': 'o',
    'Ȏ': 'o', 'ȏ': 'o', 'Ơ': 'o', 'ơ': 'o', 'Ớ': 'o', 'ớ': 'o', 'Ờ': 'o', 'ờ': 'o', 'Ỡ': 'o', 'ỡ': 'o', 'Ở': 'o', 'ở': 'o', 'Ợ': 'o', 'ợ': 'o', 'Ọ': 'o', 'ọ': 'o',
    'Ộ': 'o', 'ộ': 'o', 'Ɵ': 'o', 'ɵ': 'o', 'Ṕ': 'p', 'ṕ': 'p', 'Ṗ': 'p', 'ṗ': 'p', 'Ᵽ': 'p', 'Ƥ': 'p', 'ƥ': 'p', 'P': 'p', '̃': 'p', 'p': 'p', '̃': 'p', 'ʠ': 'q',
    'Ɋ': 'q', 'ɋ': 'q', 'Ŕ': 'r', 'ŕ': 'r', 'Ř': 'r', 'ř': 'r', 'Ṙ': 'r', 'ṙ': 'r', 'Ŗ': 'r', 'ŗ': 'r', 'Ȑ': 'r', 'ȑ': 'r', 'Ȓ': 'r', 'ȓ': 'r', 'Ṛ': 'r', 'ṛ': 'r',
    'Ṝ': 'r', 'ṝ': 'r', 'Ṟ': 'r', 'ṟ': 'r', 'Ɍ': 'r', 'ɍ': 'r', 'ᵲ': 'r', 'ɼ': 'r', 'Ɽ': 'r', 'ɽ': 'r', 'ɾ': 'r', 'ᵳ': 'r', 'ß': 's', 'Ś': 's', 'ś': 's', 'Ṥ': 's',
    'ṥ': 's', 'Ŝ': 's', 'ŝ': 's', 'Š': 's', 'š': 's', 'Ṧ': 's', 'ṧ': 's', 'Ṡ': 's', 'ṡ': 's', 'ẛ': 's', 'Ş': 's', 'ş': 's', 'Ṣ': 's', 'ṣ': 's', 'Ṩ': 's', 'ṩ': 's',
    'Ș': 's', 'ș': 's', 'ʂ': 's', 'S': 's', '̩': 's', 's': 's', '̩': 's', 'Þ': 't', 'þ': 't', 'Ť': 't', 'ť': 't', 'T': 't', '̈': 't', 'ẗ': 't', 'Ṫ': 't', 'ṫ': 't',
    'Ţ': 't', 'ţ': 't', 'Ṭ': 't', 'ṭ': 't', 'Ț': 't', 'ț': 't', 'Ṱ': 't', 'ṱ': 't', 'Ṯ': 't', 'ṯ': 't', 'Ŧ': 't', 'ŧ': 't', 'Ⱦ': 't', 'ⱦ': 't', 'ᵵ': 't', 'ƫ': 't',
    'Ƭ': 't', 'ƭ': 't', 'Ʈ': 't', 'ʈ': 't', 'ȶ': 't', 'Ú': 'u', 'ú': 'u', 'Ù': 'u', 'ù': 'u', 'Ŭ': 'u', 'ŭ': 'u', 'Û': 'u', 'û': 'u', 'Ǔ': 'u', 'ǔ': 'u', 'Ů': 'u',
    'ů': 'u', 'Ü': 'u', 'ü': 'u', 'Ǘ': 'u', 'ǘ': 'u', 'Ǜ': 'u', 'ǜ': 'u', 'Ǚ': 'u', 'ǚ': 'u', 'Ǖ': 'u', 'ǖ': 'u', 'Ű': 'u', 'ű': 'u', 'Ũ': 'u', 'ũ': 'u', 'Ṹ': 'u',
    'ṹ': 'u', 'Ų': 'u', 'ų': 'u', 'Ū': 'u', 'ū': 'u', 'Ṻ': 'u', 'ṻ': 'u', 'Ủ': 'u', 'ủ': 'u', 'Ȕ': 'u', 'ȕ': 'u', 'Ȗ': 'u', 'ȗ': 'u', 'Ư': 'u', 'ư': 'u', 'Ứ': 'u',
    'ứ': 'u', 'Ừ': 'u', 'ừ': 'u', 'Ữ': 'u', 'ữ': 'u', 'Ử': 'u', 'ử': 'u', 'Ự': 'u', 'ự': 'u', 'Ụ': 'u', 'ụ': 'u', 'Ṳ': 'u', 'ṳ': 'u', 'Ṷ': 'u', 'ṷ': 'u', 'Ṵ': 'u',
    'ṵ': 'u', 'Ʉ': 'u', 'ʉ': 'u', 'Ṽ': 'v', 'ṽ': 'v', 'Ṿ': 'v', 'ṿ': 'v', 'Ʋ': 'v', 'ʋ': 'v', 'Ẃ': 'w', 'ẃ': 'w', 'Ẁ': 'w', 'ẁ': 'w', 'Ŵ': 'w', 'ŵ': 'w', 'W': 'w',
    '̊': 'w', 'ẘ': 'w', 'Ẅ': 'w', 'ẅ': 'w', 'Ẇ': 'w', 'ẇ': 'w', 'Ẉ': 'w', 'ẉ': 'w', 'Ẍ': 'x', 'ẍ': 'x', 'Ẋ': 'x', 'ẋ': 'x', 'Ý': 'y', 'ý': 'y', 'Ỳ': 'y', 'ỳ': 'y',
    'Ŷ': 'y', 'ŷ': 'y', 'Y': 'y', '̊': 'y', 'ẙ': 'y', 'Ÿ': 'y', 'ÿ': 'y', 'Ỹ': 'y', 'ỹ': 'y', 'Ẏ': 'y', 'ẏ': 'y', 'Ȳ': 'y', 'ȳ': 'y', 'Ỷ': 'y', 'ỷ': 'y', 'Ỵ': 'y',
    'ỵ': 'y', 'ʏ': 'y', 'Ɏ': 'y', 'ɏ': 'y', 'Ƴ': 'y', 'ƴ': 'y', 'Ź': 'z', 'ź': 'z', 'Ẑ': 'z', 'ẑ': 'z', 'Ž': 'z', 'ž': 'z', 'Ż': 'z', 'ż': 'z', 'Ẓ': 'z', 'ẓ': 'z',
    'Ẕ': 'z', 'ẕ': 'z', 'Ƶ': 'z', 'ƶ': 'z', 'Ȥ': 'z', 'ȥ': 'z', 'ʐ': 'z', 'ʑ': 'z', 'Ⱬ': 'z', 'ⱬ': 'z', 'Ǯ': 'z', 'ǯ': 'z', 'ƺ': 'z', '２': '2', '６': '6', 'Ｂ': 'B',
    'Ｆ': 'F', 'Ｊ': 'J', 'Ｎ': 'N', 'Ｒ': 'R', 'Ｖ': 'V', 'Ｚ': 'Z', 'ｂ': 'b', 'ｆ': 'f', 'ｊ': 'j', 'ｎ': 'n', 'ｒ': 'r', 'ｖ': 'v', 'ｚ': 'z', '１': '1', '５': '5',
    '９': '9', 'Ａ': 'A', 'Ｅ': 'E', 'Ｉ': 'I', 'Ｍ': 'M', 'Ｑ': 'Q', 'Ｕ': 'U', 'Ｙ': 'Y', 'ａ': 'a', 'ｅ': 'e', 'ｉ': 'i', 'ｍ': 'm', 'ｑ': 'q', 'ｕ': 'u', 'ｙ': 'y',
    '０': '0', '４': '4', '８': '8', 'Ｄ': 'D', 'Ｈ': 'H', 'Ｌ': 'L', 'Ｐ': 'P', 'Ｔ': 'T', 'Ｘ': 'X', 'ｄ': 'd', 'ｈ': 'h', 'ｌ': 'l', 'ｐ': 'p', 'ｔ': 't', 'ｘ': 'x',
    '３': '3', '７': '7', 'Ｃ': 'C', 'Ｇ': 'G', 'Ｋ': 'K', 'Ｏ': 'O', 'Ｓ': 'S', 'Ｗ': 'W', 'ｃ': 'c', 'ｇ': 'g', 'ｋ': 'k', 'ｏ': 'o', 'ｓ': 's', 'ｗ': 'w'
};

function getIATACode(itemVal) {
    if (itemVal != "" && itemVal.indexOf("(") >= 0 && itemVal.indexOf(")") > 0) {
        return itemVal.substr(itemVal.indexOf('(') + 1).replace(")", "");
    }

    return "";
}

function getResource(key) {
    return window["Resources"][key];
}

function addListCode(arrList, city, productCode, productName, type) {
    if (arrList == undefined) {
        arrList = [];
    }

    arrList.push({ Id: -1, City: city, ProductCode: productCode, ProductName: productName, Type: type, ActionType: "Create" });

    return arrList;
}

function deleteListCode(arrList, city, productCode, type) {
    arrList = arrList.filter(function (e) {
        return !(e.City == city && e.ProductCode == productCode && e.Type == type);
    });

    return arrList;
}

function findIndexInArray(arrList, value) {
    for (var i = 0; i < arrList.length; i += 1) {
        if (arrList[i].id.indexOf(value) != -1) {
            return i;
        }
    }
}

function findInExtrasType(arrList, typeId) {
    return $.grep(arrList, function (e) {
        return e.TypeId == typeId;
    });
}

function findInListCode(arrList, city, productCode, type) {
    return $.grep(arrList, function (e) {
        return e.City == city && e.ProductCode == productCode && e.Type == type;
    });
}

function filterListCode(arrList, product, type) {
    return $.grep(arrList, function (e) {
        return e.Product == product && e.Type == type;
    });
}

function filterList(arrList, product) {
    return $.grep(arrList, function (e) {
        return e.Product == product;
    });
}

function filterArrayByArray(arrList, arrFilter) {
    var arrFilterTemp = [];
    arrFilter.forEach(function (f) {
        var item = $.grep(arrList, function (e) { return e.Code == f.Code; });
        arrFilterTemp.push(item[0]);
    });

    return arrFilterTemp;
}

function existInArray(arrList, value) {
    for (var i = 0; i < arrList.length; i += 1) {
        if (arrList[i] == value) {
            return true;
        }
    }

    return false;
}

function updateExtrasType(arrList, typeId, actionType, checked) {
    var item = $.grep(arrList, function (e) { return e.TypeId == typeId; });

    if (item.length > 0) {
        item[0].ActionType = actionType;
        item[0].Checked = checked;
    }

    return arrList;
}

function updateListCode(arrList, id, actionType) {
    var item = $.grep(arrList, function (e) { return e.Id == id; });

    if (item.length > 0) {
        item[0].ActionType = actionType;
    }

    return arrList;
}

function convertJson2string(strObject) {
    var c, i, l, s = '', v, p;
    switch (typeof strObject) {
        case 'object':
            if (strObject) {
                if (strObject.length && typeof strObject.length == 'number') {
                    for (i = 0; i < strObject.length; ++i) {
                        v = convertJson2string(strObject[i]);
                        if (s) {
                            s += ',';
                        }
                        s += v;
                    }
                    return '[' + s + ']';
                } else if (typeof strObject.toString != 'undefined') {
                    for (i in strObject) {
                        v = strObject[i];
                        if (typeof v != 'undefined' && typeof v != 'function') {
                            v = convertJson2string(v);
                            if (s) {
                                s += ',';
                            }
                            s += convertJson2string(i) + ':' + v;
                        }
                    }
                    return '{' + s + '}';
                }
            }
            return 'null';
        case 'number':
            return isFinite(strObject) ? String(strObject) : 'null';
        case 'string':
            l = strObject.length;
            s = '"';
            for (i = 0; i < l; i += 1) {
                c = strObject.charAt(i);
                if (c >= ' ') {
                    if (c == '\\' || c == '"') {
                        s += '\\';
                    }
                    s += c;
                } else {
                    switch (c) {
                        case '\b':
                            s += '\\b';
                            break;
                        case '\f':
                            s += '\\f';
                            break;
                        case '\n':
                            s += '\\n';
                            break;
                        case '\r':
                            s += '\\r';
                            break;
                        case '\t':
                            s += '\\t';
                            break;
                        default:
                            c = c.charCodeAt();
                            s += '\\u00' + Math.floor(c / 16).toString(16) +
                                (c % 16).toString(16);
                    }
                }
            }
            return s + '"';
        case 'boolean':
            return String(strObject);
        default:
            return 'null';
    }
}

function sortArrayByKey(arrList, key) {
    return arrList.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function convertStringToBool(string) {
    try {
        return eval(string);
    } catch (e) {
        return eval(string.charAt(0).toLowerCase() + string.slice(1));
    }
}

function setGeolocationCity(id, tabwidget) {

    if (typeof $GeoLocationCity === 'undefined') {

        var urlGetLatLon = window.location.protocol === "https:" ? 'https://ipapi.co/json' : 'http://ip-api.com/json';

        $.getJSON(urlGetLatLon)
            .done(function (location) {

                var latitude = window.location.protocol === "https:" ? location.latitude : location.lat;
                var longitude = window.location.protocol === "https:" ? location.longitude : location.lon;
                var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=AIzaSyBlyZ_dGUT2ozwIhTOEhBt33AORjW0DWpg&sensor=false';

                $.getJSON(url)
                    .done(function (data) {
                        if (data.results.length > 0) {
                            $GeoLocationCity = $.grep(data.results[0].address_components, function (e) {
                                return (e.types[0] === "locality");
                            })[0].long_name;

                            var external_file = (id === "txtCarAirportPickup") ? external_file_Airports : external_file_Cities;

                            $GeoLocationCity = $.grep(external_file, function (e) {
                                return (normalizeString(e).toUpperCase().indexOf(normalizeString($GeoLocationCity).toUpperCase()) >= 0);
                            })[0];

                            $("input[id='" + id + "']", $(tabwidget)).val($GeoLocationCity);
                        }
                    }
                    );
            }
            );
    } else {
        $("input[id='" + id + "']", $(tabwidget)).val($GeoLocationCity);
    }
}

function normalizeString(str) {

    var response;

    for (var i = 0; i < str.length; i++) {
        response += $accentMap[str.charAt(i)] || str.charAt(i);
    }

    return response;
};
/*!
 * jQuery Popup Overlay
 *
 * @version 1.7.13
 * @requires jQuery v1.7.1+
 * @link http://vast-engineering.github.com/jquery-popup-overlay/
 */
;(function ($) {

    var $window = $(window);
    var options = {};
    var zindexvalues = [];
    var lastclicked = [];
    var scrollbarwidth;
    var bodymarginright = null;
    var opensuffix = '_open';
    var closesuffix = '_close';
    var visiblePopupsArray = [];
    var transitionsupport = null;
    var opentimer;
    var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

    var methods = {

        _init: function (el) {
            var $el = $(el);
            var options = $el.data('popupoptions');
            lastclicked[el.id] = false;
            zindexvalues[el.id] = 0;

            if (!$el.data('popup-initialized')) {
                $el.attr('data-popup-initialized', 'true');
                methods._initonce(el);
            }

            if (options.autoopen) {
                setTimeout(function() {
                    methods.show(el, 0);
                }, 0);
            }
        },

        _initonce: function (el) {
            var $el = $(el);
            var $body = $('body');
            var $wrapper;
            var options = $el.data('popupoptions');
            var css;
            
                                bodymarginright = parseInt($body.css('margin-right'), 10);
                                transitionsupport = document.body.style.webkitTransition !== undefined ||
                                document.body.style.MozTransition !== undefined ||
                                document.body.style.msTransition !== undefined ||
                                document.body.style.OTransition !== undefined ||
                                document.body.style.transition !== undefined;

            if (options.type == 'tooltip') {
                options.background = false;
                options.scrolllock = false;
            }

            if (options.backgroundactive) {
                options.background = false;
                options.blur = false;
                options.scrolllock = false;
            }

            if (options.scrolllock) {
                // Calculate the browser's scrollbar width dynamically
                var parent;
                var child;
                if (typeof scrollbarwidth === 'undefined') {
                    parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
                    child = parent.children();
                    scrollbarwidth = child.innerWidth() - child.height(99).innerWidth();
                    parent.remove();
                }
            }

            if (!$el.attr('id')) {
                $el.attr('id', 'j-popup-' + parseInt((Math.random() * 100000000), 10));
            }

            $el.addClass('popup_content');

            if ((options.background) && (!$('#' + el.id + '_background').length)) {

                $body.append('<div id="' + el.id + '_background" class="popup_background"></div>');

                var $background = $('#' + el.id + '_background');

                $background.css({
                    opacity: 0,
                    visibility: 'hidden',
                    backgroundColor: options.color,
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                });

                if (options.setzindex && !options.autozindex) {
                    $background.css('z-index', '100000');
                }

                if (options.transition) {
                    $background.css('transition', options.transition);
                }
            }

            $body.append(el);

            $el.wrap('<div id="' + el.id + '_wrapper" class="popup_wrapper" />');

            $wrapper = $('#' + el.id + '_wrapper');

            $wrapper.css({
                opacity: 0,
                visibility: 'hidden',
                position: 'absolute'
            });

            // Make div clickable in iOS
            if (iOS) {
                $wrapper.css('cursor', 'pointer');
            }

            if (options.type == 'overlay') {
                $wrapper.css('overflow','auto');
            }

            $el.css({
                opacity: 0,
                visibility: 'hidden',
                display: 'inline-block'
            });

            if (options.setzindex && !options.autozindex) {
                $wrapper.css('z-index', '100001');
            }

            if (!options.outline) {
                $el.css('outline', 'none');
            }

            if (options.transition) {
                $el.css('transition', options.transition);
                $wrapper.css('transition', options.transition);
            }

            // Hide popup content from screen readers initially
            $el.attr('aria-hidden', true);

            if (options.type == 'overlay') {
                $el.css({
                    textAlign: 'left',
                    position: 'relative',
                    verticalAlign: 'middle'
                });

                css = {
                    position: 'fixed',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    textAlign: 'center'
                };

                if(options.backgroundactive){
                    css.position = 'absolute';
                    css.height = '0';
                    css.overflow = 'visible';
                }

                $wrapper.css(css);

                // CSS vertical align helper
                $wrapper.append('<div class="popup_align" />');

                $('.popup_align').css({
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    height: '100%'
                });
            }

            // Add WAI ARIA role to announce dialog to screen readers
            $el.attr('role', 'dialog');

            var openelement =  (options.openelement) ? options.openelement : ('.' + el.id + opensuffix);

            $(openelement).each(function (i, item) {
                $(item).attr('data-popup-ordinal', i);

                if (!item.id) {
                    $(item).attr('id', 'open_' + parseInt((Math.random() * 100000000), 10));
                }
            });

            // Set aria-labelledby (if aria-label or aria-labelledby is not set in html)
            if (!($el.attr('aria-labelledby') || $el.attr('aria-label'))) {
                $el.attr('aria-labelledby', $(openelement).attr('id'));
            }

            // Show and hide tooltips on hover
            if(options.action == 'hover'){
                options.keepfocus = false;

                // Handler: mouseenter, focusin
                $(openelement).on('mouseenter', function (event) {
                    methods.show(el, $(this).data('popup-ordinal'));
                });

                // Handler: mouseleave, focusout
                $(openelement).on('mouseleave', function (event) {
                    methods.hide(el);
                });

            } else {

                // Handler: Show popup when clicked on `open` element
                $(document).on('click', openelement, function (event) {
                    event.preventDefault();

                    var ord = $(this).data('popup-ordinal');
                    setTimeout(function() { // setTimeout is to allow `close` method to finish (for issues with multiple tooltips)
                        methods.show(el, ord);
                    }, 0);
                });
            }

            if (options.closebutton) {
                methods.addclosebutton(el);
            }

            if (options.detach) {
                $el.hide().detach();
            } else {
                $wrapper.hide();
            }
        },

        /**
         * Show method
         *
         * @param {object} el - popup instance DOM node
         * @param {number} ordinal - order number of an `open` element
         */
        show: function (el, ordinal) {
            var $el = $(el);

            if ($el.data('popup-visible')) return;

            // Initialize if not initialized. Required for: $('#popup').popup('show')
            if (!$el.data('popup-initialized')) {
                methods._init(el);
            }
            $el.attr('data-popup-initialized', 'true');

            var $body = $('body');
            var options = $el.data('popupoptions');
            var $wrapper = $('#' + el.id + '_wrapper');
            var $background = $('#' + el.id + '_background');

            // `beforeopen` callback event
            callback(el, ordinal, options.beforeopen);

            // Remember last clicked place
            lastclicked[el.id] = ordinal;

            // Add popup id to visiblePopupsArray
            setTimeout(function() {
                visiblePopupsArray.push(el.id);
            }, 0);

            // Calculating maximum z-index
            if (options.autozindex) {

                var elements = document.getElementsByTagName('*');
                var len = elements.length;
                var maxzindex = 0;

                for(var i=0; i<len; i++){

                    var elementzindex = $(elements[i]).css('z-index');

                    if(elementzindex !== 'auto'){

                      elementzindex = parseInt(elementzindex, 10);

                      if(maxzindex < elementzindex){
                        maxzindex = elementzindex;
                      }
                    }
                }

                zindexvalues[el.id] = maxzindex;

                // Add z-index to the background
                if (options.background) {
                    if (zindexvalues[el.id] > 0) {
                        $('#' + el.id + '_background').css({
                            zIndex: (zindexvalues[el.id] + 1)
                        });
                    }
                }

                // Add z-index to the wrapper
                if (zindexvalues[el.id] > 0) {
                    $wrapper.css({
                        zIndex: (zindexvalues[el.id] + 2)
                    });
                }
            }

            if (options.detach) {
                $wrapper.prepend(el);
                $el.show();
            } else {
                $wrapper.show();
            }

            opentimer = setTimeout(function() {
                $wrapper.css({
                    visibility: 'visible',
                    opacity: 1
                });

                $('html').addClass('popup_visible').addClass('popup_visible_' + el.id);
                $wrapper.addClass('popup_wrapper_visible');
            }, 20); // 20ms required for opening animation to occur in FF

            // Disable background layer scrolling when popup is opened
            if (options.scrolllock) {
                $body.css('overflow', 'hidden');
                if ($body.height() > $window.height()) {
                    $body.css('margin-right', bodymarginright + scrollbarwidth);
                }
            }

            if(options.backgroundactive){
                //calculates the vertical align
                $el.css({
                    top:(
                        $window.height() - (
                            $el.get(0).offsetHeight +
                            parseInt($el.css('margin-top'), 10) +
                            parseInt($el.css('margin-bottom'), 10)
                        )
                    )/2 +'px'
                });
            }

            $el.css({
                'visibility': 'visible',
                'opacity': 1
            });

            // Show background
            if (options.background) {
                $background.css({
                    'visibility': 'visible',
                    'opacity': options.opacity
                });

                // Fix IE8 issue with background not appearing
                setTimeout(function() {
                    $background.css({
                        'opacity': options.opacity
                    });
                }, 0);
            }

            $el.data('popup-visible', true);

            // Position popup
            methods.reposition(el, ordinal);

            // Remember which element had focus before opening a popup
            $el.data('focusedelementbeforepopup', document.activeElement);

            // Handler: Keep focus inside dialog box
            if (options.keepfocus) {
                // Make holder div focusable
                $el.attr('tabindex', -1);

                // Focus popup or user specified element.
                // Initial timeout of 50ms is set to give some time to popup to show after clicking on
                // `open` element, and after animation is complete to prevent background scrolling.
                setTimeout(function() {
                    if (options.focuselement === 'closebutton') {
                        $('#' + el.id + ' .' + el.id + closesuffix + ':first').focus();
                    } else if (options.focuselement) {
                        $(options.focuselement).focus();
                    } else {
                        $el.focus();
                    }
                }, options.focusdelay);

            }

            // Hide main content from screen readers
            $(options.pagecontainer).attr('aria-hidden', true);

            // Reveal popup content to screen readers
            $el.attr('aria-hidden', false);

            callback(el, ordinal, options.onopen);

            if (transitionsupport) {
                $wrapper.one('transitionend', function() {
                    callback(el, ordinal, options.opentransitionend);
                });
            } else {
                callback(el, ordinal, options.opentransitionend);
            }

            // Handler: Reposition tooltip when window is resized
            if (options.type == 'tooltip') {
                $(window).on('resize.' + el.id, function () {
                    methods.reposition(el, ordinal);
                });
            }
        },

        /**
         * Hide method
         *
         * @param object el - popup instance DOM node
         * @param boolean outerClick - click on the outer content below popup
         */
        hide: function (el, outerClick) {
            // Get index of popup ID inside of visiblePopupsArray
            var popupIdIndex = $.inArray(el.id, visiblePopupsArray);

            // If popup is not opened, ignore the rest of the function
            if (popupIdIndex === -1) {
                return;
            }

            if(opentimer) clearTimeout(opentimer);

            var $body = $('body');
            var $el = $(el);
            var options = $el.data('popupoptions');
            var $wrapper = $('#' + el.id + '_wrapper');
            var $background = $('#' + el.id + '_background');

            $el.data('popup-visible', false);

            if (visiblePopupsArray.length === 1) {
                $('html').removeClass('popup_visible').removeClass('popup_visible_' + el.id);
            } else {
                if($('html').hasClass('popup_visible_' + el.id)) {
                    $('html').removeClass('popup_visible_' + el.id);
                }
            }

            // Remove popup from the visiblePopupsArray
            visiblePopupsArray.splice(popupIdIndex, 1);

            if($wrapper.hasClass('popup_wrapper_visible')) {
                $wrapper.removeClass('popup_wrapper_visible');
            }

            // Focus back on saved element
            if (options.keepfocus && !outerClick) {
                setTimeout(function() {
                    if ($($el.data('focusedelementbeforepopup')).is(':visible')) {
                        $el.data('focusedelementbeforepopup').focus();
                    }
                }, 0);
            }

            // Hide popup
            $wrapper.css({
                'visibility': 'hidden',
                'opacity': 0
            });
            $el.css({
                'visibility': 'hidden',
                'opacity': 0
            });

            // Hide background
            if (options.background) {
                $background.css({
                    'visibility': 'hidden',
                    'opacity': 0
                });
            }

            // Reveal main content to screen readers
            $(options.pagecontainer).attr('aria-hidden', false);

            // Hide popup content from screen readers
            $el.attr('aria-hidden', true);

            // `onclose` callback event
            callback(el, lastclicked[el.id], options.onclose);

            if (transitionsupport && $el.css('transition-duration') !== '0s') {
                $el.one('transitionend', function(e) {

                    if (!($el.data('popup-visible'))) {
                        if (options.detach) {
                            $el.hide().detach();
                        } else {
                            $wrapper.hide();
                        }
                    }

                    // Re-enable scrolling of background layer
                    if (options.scrolllock) {
                        setTimeout(function() {
                            $body.css({
                                overflow: 'visible',
                                'margin-right': bodymarginright
                            });
                        }, 10); // 10ms added for CSS transition in Firefox which doesn't like overflow:auto
                    }

                    callback(el, lastclicked[el.id], options.closetransitionend);
                });
            } else {
                if (options.detach) {
                    $el.hide().detach();
                } else {
                    $wrapper.hide();
                }

                // Re-enable scrolling of background layer
                if (options.scrolllock) {
                    setTimeout(function() {
                        $body.css({
                            overflow: 'visible',
                            'margin-right': bodymarginright
                        });
                    }, 10); // 10ms added for CSS transition in Firefox which doesn't like overflow:auto
                }

                callback(el, lastclicked[el.id], options.closetransitionend);
            }

            if (options.type == 'tooltip') {
                $(window).off('resize.' + el.id);
            }
        },

        /**
         * Toggle method
         *
         * @param {object} el - popup instance DOM node
         * @param {number} ordinal - order number of an `open` element
         */
        toggle: function (el, ordinal) {
            if ($(el).data('popup-visible')) {
                methods.hide(el);
            } else {
                setTimeout(function() {
                    methods.show(el, ordinal);
                }, 0);
            }
        },

        /**
         * Reposition method
         *
         * @param {object} el - popup instance DOM node
         * @param {number} ordinal - order number of an `open` element
         */
        reposition: function (el, ordinal) {
            var $el = $(el);
            var options = $el.data('popupoptions');
            var $wrapper = $('#' + el.id + '_wrapper');
            var $background = $('#' + el.id + '_background');

            ordinal = ordinal || 0;

            // Tooltip type
            if (options.type == 'tooltip') {
                $wrapper.css({
                    'position': 'absolute'
                });

                var $tooltipanchor;
                if (options.tooltipanchor) {
                    $tooltipanchor = $(options.tooltipanchor);
                } else if (options.openelement) {
                    $tooltipanchor = $(options.openelement).filter('[data-popup-ordinal="' + ordinal + '"]');
                } else {
                    $tooltipanchor = $('.' + el.id + opensuffix + '[data-popup-ordinal="' + ordinal + '"]');
                }

                var linkOffset = $tooltipanchor.offset();

                // Horizontal position for tooltip
                if (options.horizontal == 'right') {
                    $wrapper.css('left', linkOffset.left + $tooltipanchor.outerWidth() + options.offsetleft);
                } else if (options.horizontal == 'leftedge') {
                    $wrapper.css('left', linkOffset.left + $tooltipanchor.outerWidth() - $tooltipanchor.outerWidth() +  options.offsetleft);
                } else if (options.horizontal == 'left') {
                    $wrapper.css('right', $window.width() - linkOffset.left  - options.offsetleft);
                } else if (options.horizontal == 'rightedge') {
                    $wrapper.css('right', $window.width()  - linkOffset.left - $tooltipanchor.outerWidth() - options.offsetleft);
                } else {
                    $wrapper.css('left', linkOffset.left + ($tooltipanchor.outerWidth() / 2) - ($el.outerWidth() / 2) - parseFloat($el.css('marginLeft')) + options.offsetleft);
                }

                // Vertical position for tooltip
                if (options.vertical == 'bottom') {
                    $wrapper.css('top', linkOffset.top + $tooltipanchor.outerHeight() + options.offsettop);
                } else if (options.vertical == 'bottomedge') {
                    $wrapper.css('top', linkOffset.top + $tooltipanchor.outerHeight() - $el.outerHeight() + options.offsettop);
                } else if (options.vertical == 'top') {
                    $wrapper.css('bottom', $window.height() - linkOffset.top - options.offsettop);
                } else if (options.vertical == 'topedge') {
                    $wrapper.css('bottom', $window.height() - linkOffset.top - $el.outerHeight() - options.offsettop);
                } else {
                    $wrapper.css('top', linkOffset.top + ($tooltipanchor.outerHeight() / 2) - ($el.outerHeight() / 2) - parseFloat($el.css('marginTop')) + options.offsettop);
                }

            // Overlay type
            } else if (options.type == 'overlay') {

                // Horizontal position for overlay
                if (options.horizontal) {
                    $wrapper.css('text-align', options.horizontal);
                } else {
                    $wrapper.css('text-align', 'center');
                }

                // Vertical position for overlay
                if (options.vertical) {
                    $el.css('vertical-align', options.vertical);
                } else {
                    $el.css('vertical-align', 'middle');
                }
            }
        },

        /**
         * Add-close-button method
         *
         * @param {object} el - popup instance DOM node
         */
        addclosebutton: function (el) {
            var genericCloseButton;

            if ($(el).data('popupoptions').closebuttonmarkup) {
                genericCloseButton = $(options.closebuttonmarkup).addClass(el.id + '_close');
            } else {
                genericCloseButton = '<button class="popup_close ' + el.id + '_close" title="Close" aria-label="Close"><span aria-hidden="true">×</span></button>';
            }

            if ($(el).data('popup-initialized')){
                $(el).append(genericCloseButton);
            }

        }

    };

    /**
     * Callback event calls
     *
     * @param {object} el - popup instance DOM node
     * @param {number} ordinal - order number of an `open` element
     * @param {function} func - callback function
     */
    var callback = function (el, ordinal, func) {
        var options = $(el).data('popupoptions');
        var openelement;
        var elementclicked;
        if (typeof options === 'undefined') return;
        openelement =  options.openelement ? options.openelement : ('.' + el.id + opensuffix);
        elementclicked = $(openelement + '[data-popup-ordinal="' + ordinal + '"]');
        if (typeof func == 'function') {
            func.call($(el), el, elementclicked);
        }
    };

    // Hide popup if ESC key is pressed
    $(document).on('keydown', function (event) {
        if(visiblePopupsArray.length) {
            var elementId = visiblePopupsArray[visiblePopupsArray.length - 1];
            var el = document.getElementById(elementId);

            if ($(el).data('popupoptions').escape && event.keyCode == 27) {
                methods.hide(el);
            }
        }
    });

    // Hide popup on click
    $(document).on('click', function (event) {
        if(visiblePopupsArray.length) {
            var elementId = visiblePopupsArray[visiblePopupsArray.length - 1];
            var el = document.getElementById(elementId);
            var closeButton = ($(el).data('popupoptions').closeelement) ? $(el).data('popupoptions').closeelement : ('.' + el.id + closesuffix);

            // If Close button clicked
            if ($(event.target).closest(closeButton).length) {
                event.preventDefault();
                methods.hide(el);
            }

            // If clicked outside of popup
            if ($(el).data('popupoptions') && $(el).data('popupoptions').blur && !$(event.target).closest('#' + elementId).length && event.which !== 2 && $(event.target).is(':visible')) {

                if ($(el).data('popupoptions').background) {
                    // If clicked on popup cover
                    methods.hide(el);

                    // Older iOS/Safari will trigger a click on the elements below the cover,
                    // when tapping on the cover, so the default action needs to be prevented.
                    event.preventDefault();

                } else {
                    // If clicked on outer content
                    methods.hide(el, true);
                }
            }
        }
    });

    // Keep keyboard focus inside of popup
    $(document).on('keydown', function(event) {
        if(visiblePopupsArray.length && event.which == 9) {

            // If tab or shift-tab pressed
            var elementId = visiblePopupsArray[visiblePopupsArray.length - 1];
            var el = document.getElementById(elementId);

            // Get list of all children elements in given object
            var popupItems = $(el).find('*');

            // Get list of focusable items
            var focusableItems = popupItems.filter(focusableElementsString).filter(':visible');

            // Get currently focused item
            var focusedItem = $(':focus');

            // Get the number of focusable items
            var numberOfFocusableItems = focusableItems.length;

            // Get the index of the currently focused item
            var focusedItemIndex = focusableItems.index(focusedItem);

            // If popup doesn't contain focusable elements, focus popup itself
            if (numberOfFocusableItems === 0) {
                $(el).focus();
                event.preventDefault();
            } else {
                if (event.shiftKey) {
                    // Back tab
                    // If focused on first item and user preses back-tab, go to the last focusable item
                    if (focusedItemIndex === 0) {
                        focusableItems.get(numberOfFocusableItems - 1).focus();
                        event.preventDefault();
                    }

                } else {
                    // Forward tab
                    // If focused on the last item and user preses tab, go to the first focusable item
                    if (focusedItemIndex == numberOfFocusableItems - 1) {
                        focusableItems.get(0).focus();
                        event.preventDefault();
                    }
                }
            }
        }
    });

    /**
     * Plugin API
     */
    $.fn.popup = function (customoptions) {
        return this.each(function () {

            var $el = $(this);

            if (typeof customoptions === 'object') {  // e.g. $('#popup').popup({'color':'blue'})
                var opt = $.extend({}, $.fn.popup.defaults, $el.data('popupoptions'), customoptions);
                $el.data('popupoptions', opt);
                options = $el.data('popupoptions');

                methods._init(this);

            } else if (typeof customoptions === 'string') { // e.g. $('#popup').popup('hide')
                if (!($el.data('popupoptions'))) {
                    $el.data('popupoptions', $.fn.popup.defaults);
                    options = $el.data('popupoptions');
                }

                methods[customoptions].call(this, this);

            } else { // e.g. $('#popup').popup()
                if (!($el.data('popupoptions'))) {
                    $el.data('popupoptions', $.fn.popup.defaults);
                    options = $el.data('popupoptions');
                }

                methods._init(this);

            }

        });
    };

    $.fn.popup.defaults = {
        type: 'overlay',
        autoopen: false,
        background: true,
        backgroundactive: false,
        color: 'black',
        opacity: '0.5',
        horizontal: 'center',
        vertical: 'middle',
        offsettop: 0,
        offsetleft: 0,
        escape: true,
        blur: true,
        setzindex: true,
        autozindex: false,
        scrolllock: false,
        closebutton: false,
        closebuttonmarkup: null,
        keepfocus: true,
        focuselement: null,
        focusdelay: 50,
        outline: false,
        pagecontainer: null,
        detach: false,
        openelement: null,
        closeelement: null,
        transition: null,
        tooltipanchor: null,
        beforeopen: null,
        onclose: null,
        onopen: null,
        opentransitionend: null,
        closetransitionend: null
    };

})(jQuery);
;
var staticContentAutocomplete = (function () {
    $IsMobile = window.innerWidth <= 767;
    $UrlDomainNS = ""

    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
        };
    }

    function split(val) {
        return val.split(/,\s*/);
    }
    function extractLast(term) {
        return split(term).pop();
    }

    function LoadNetsuiteAutocomplete(
        moduleId,
        inputid,
        optionsElementId,
        userservices,
        destinationType,
        destinationId,
        lang,
        options = {}) {      
       
        let ul_preload = document.createElement('ul');
        let li_preload = document.createElement('li');
        ul_preload.setAttribute('class','ul_preload ui-menu ui-widget ui-widget-content ui-front netsuiteautocomplete');
        ul_preload.setAttribute('style','display:none!important');
        li_preload.setAttribute('class','list-group-item li_preload');
        li_preload.innerHTML =
        `<div class="item-img ui-menu-item-wrapper">
        </div>
        <div class="item-info ui-menu-item-wrapper">
            <div class="placeName"><b></b></div>
            <div class="address"></div>
        </div>`;

        ul_preload.appendChild(li_preload);
        document.querySelector(`#${inputid}`).parentElement.appendChild(ul_preload);

        $('#' + inputid,$(moduleId))
            // don't navigate away from the field on tab when selecting an item
            .on("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB &&
                    $(this).autocomplete("instance").menu.active) {
                    event.preventDefault();
                    
                }
                if (document.querySelector(`#${inputid}`).value.length <= 3) {
                    li_preload.querySelector('.placeName b').innerText = 'Ingresa al menos 3 letras, y aguarda los resultados';
                    ul_preload.setAttribute('style','display:block!important;position: fixed; z-index: 10;');
                }
            }
            
            )

        $('#' + inputid,$(moduleId)).autocomplete({
            minLength: 3,
            source: function (request, response) {
                
                $.getJSON($UrlDomainNS + "/NetCoreapi/AutocompleteDestinationStaticContent?searchCriteria=" + request.term + "&userServices=" + userservices + "&lang=" + lang,
                    function (responseData) {
                        var data = [];
                        var autocompleteHotelObjects = responseData.Hotels.filter(h => h.hotel_name)
                            .map((hotel) => {
                                return {
                                    'name': hotel.hotel_name,
                                    'subtitle': (typeof hotel.address == "undefined" ? "" : hotel.address),
                                    'type': 'hotel',
                                    'id': hotel.Id
                                }
                            });

                        var autocompleteLocationItems = responseData.Locations
                            .map((location) => {
                                return {
                                    'name': location.Name,
                                    'subtitle': (typeof location.NameFull == "undefined" ? "" : location.NameFull),
                                    'type': location.Type,
                                    'id': location.Id
                                }
                            });

                        var iconLocation = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="uitk-icon uitk-icon-small"><svg><path fill-rule="evenodd" d="M5 9a7 7 0 1114 0c0 5.25-7 13-7 13S5 14.25 5 9zm4.5 0a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z" clip-rule="evenodd"></path></svg></svg>';
                        var iconHotel = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20"><path d="M21.61 21.41l-.47-1.1a.49.49 0 00-.16-.2.4.4 0 00-.23-.06h-.84V7.4a.4.4 0 00-.12-.28.38.38 0 00-.29-.13h-3.75V2.41a.4.4 0 00-.12-.28.38.38 0 00-.29-.13H4.5a.38.38 0 00-.3.13.4.4 0 00-.11.28v17.64h-.84a.4.4 0 00-.23.07.49.49 0 00-.16.18l-.47 1.11a.44.44 0 00-.03.2c0 .08.03.14.07.2a.38.38 0 00.33.2h18.48a.38.38 0 00.33-.2.36.36 0 00.07-.2c0-.06 0-.13-.03-.2zM9.09 17h-2.5v-2.5h2.5V17zm0-5h-2.5V9.5h2.5V12zm0-5h-2.5V4.5h2.5V7zm4.16 12.77h-2.5V14.5h2.5v5.27zm0-7.77h-2.5V9.5h2.5V12zm0-5h-2.5V4.5h2.5V7zm4.16 10h-2.5v-2.5h2.5V17zm0-5h-2.5V9.5h2.5V12z"></path></svg>';

                        autocompleteObjects = autocompleteLocationItems.concat(autocompleteHotelObjects);
                        autocompleteObjects.map((item) => {
                            var icon = '';
                            if (item.type == 'hotel') {
                                icon = iconHotel;
                            }
                            else {
                                icon = iconLocation;
                            }
                            item.icon=icon;
                            data.push(item);
                        })
                        if (data.length == 0) {
                            li_preload.querySelector('.placeName b').innerText = "No se encontraron resultados que coincidan con "+ document.querySelector(`#${inputid}`).value;
                            ul_preload.setAttribute('style','display:block!important;position: absolute; z-index: 10;');
                        }
                        
                        response(data)
                    });
            },
            focus: function (event, ui) {
                return false;
            },
            search: function () {
                // custom minLength
        
            },
            select: function (event, ui) {
                var itemId =ui.item.id
                var itemName = ui.item.subtitle
                var itemType = ui.item.type
                
                if(itemType == 'hotel'){
                    itemName = ui.item.name
                }

                selectOption(itemName, itemType, itemId, inputid, optionsElementId,moduleId);

                return false;
            },
            
        })
            .autocomplete("instance")._renderItem = function (ul, item) {
                ul_preload.setAttribute('style','display:none!important');

                let listItem = `<li class="list-group-item" item-id="{4}" item-name="{1}" item-type="{3}" input-id="{6}" >
                <div class="item-img">
                    {5}
                </div>
                <div class="item-info">
                    <div class="placeName"><b>{1}</b></div>
                    <div class="address">{2}</div>
                </div>
            </li>`
                .format(item.Id, item.name, item.subtitle, item.type, item.id, item.icon, inputid)
                ul.addClass("netsuiteautocomplete")
                return $(listItem)
                    .appendTo(ul);
            };
            
    }

    function selectOption(name, destinationtype, destinationid, inputid, optionsElementsId,moduleId) {   
        var controlId = inputid
        if($IsMobile){
            controlId = $("#divHotelCityControlMobile",$(moduleId)).attr("data-input-id")
            $('#' + controlId,$(moduleId)).attr("destinationtype", destinationtype == "hotel" ? "hotelid" : "location");
            $('#' + controlId,$(moduleId)).attr("destinationid", destinationid);
            $('#' + controlId,$(moduleId)).val(name);
            var yPos = parseFloat($("input[id='yPos']",$(moduleId)).val());
            $('html, body').scrollTop(yPos - 50.00);
            $("div[id='divAutoCompleteMobileContainer']",$(moduleId)).hide();
        }
        else{
            $('#' + inputid,$(moduleId)).attr("destinationtype", destinationtype == "hotel" ? "hotelid" : "location");
            $('#' + inputid,$(moduleId)).attr("destinationid", destinationid);
            $('#' + inputid,$(moduleId)).val(name);
        }
    }

    return {
        LoadNetsuiteAutocomplete
    }

})();



function initWidget(tabwidget) {
    $ModuleId = tabwidget;
    initAirProduct(tabwidget);
    initHotelProduct(tabwidget);
    initCarProduct(tabwidget);
    initExtraProduct(tabwidget);
    initAirHotelProduct(tabwidget);
    initBusProduct(tabwidget);
    initBusHotelProduct(tabwidget);
    initAirCarProduct(tabwidget);
    // se reordenan los tabs del widget
    $("ul[id='widget-tabs']", $(tabwidget)).each(function () {
        $(this).html($(this).children('li').sort(function (a, b) {
            return ($(b).data('sort')) < ($(a).data('sort')) ? 1 : -1;
        }));
    });

    // se inicializan los popups
    initPopups(tabwidget);

    // se muestra el widget una vez inicializado
    $(tabwidget).show();

    // funionalidad para los tabs en mobile
    // 28 (px) tamaño link, 60 (px) tamaño tab producto
    $maxScrollLeft = ($("div[id='divMobileTabsContent'] li", $(tabwidget)).length - (($("div[id='divMobileTabsContent']", $(tabwidget)).width() - 28) / 60)) * 60;

    if ($maxScrollLeft <= 0) {

        $("a[id='aMobileTabsNav']", $(tabwidget)).hide();
        $("div[id='divMobileTabsContent'] ul[id='widget-tabs']", $(tabwidget)).css("width", function () {
            return $("div[id='divMobileTabsContent'] li", $(tabwidget)).length * 60 + 15;
        });

    } else {

        var addPxls = 38;
        var pixels = ($("div[id='divMobileTabsContent']", $(tabwidget)).width() - ($("div[id='divMobileTabsContent'] li", $(tabwidget)).length * 60))
        if (pixels > 0 && pixels < 28) {
            $("a[id='aMobileTabsNav']", $(tabwidget)).hide();
            addPxls = 15;
        }

        $("a[id='aMobileTabsNav']", $(tabwidget)).click(function () {

            scrollLeft = $("div[id='divMobileTabsContent']", $(tabwidget)).scrollLeft();

            if (scrollLeft >= 0 && scrollLeft <= ($maxScrollLeft / 2)) {
                $("div[id='divMobileTabsContent']", $(tabwidget)).animate({ scrollLeft: $maxScrollLeft }, 400);
            } else {
                $("div[id='divMobileTabsContent']", $(tabwidget)).animate({ scrollLeft: 0 }, 400);
            }

        });

        $("div[id='divMobileTabsContent'] ul[id='widget-tabs']", $(tabwidget)).css("width", function () {
            return ($("div[id='divMobileTabsContent'] li", $(tabwidget)).length * 60) + addPxls;
        });

        $("div[id='divMobileTabsContent']", $(tabwidget)).scroll(function () {

            if ($(this).scrollLeft() >= 0 && $(this).scrollLeft() <= ($maxScrollLeft / 2)) {
                if ($("a[id='aMobileTabsNav']", $(tabwidget)).hasClass("mobile-tabs-prev")) {
                    $("a[id='aMobileTabsNav']", $(tabwidget)).addClass("mobile-tabs-next");
                    $("a[id='aMobileTabsNav']", $(tabwidget)).removeClass("mobile-tabs-prev");
                }
            } else {
                if ($("a[id='aMobileTabsNav']", $(tabwidget)).hasClass("mobile-tabs-next")) {
                    $("a[id='aMobileTabsNav']", $(tabwidget)).addClass("mobile-tabs-prev");
                    $("a[id='aMobileTabsNav']", $(tabwidget)).removeClass("mobile-tabs-next");
                }
            }

        });

    }

    // se inicializa el bValidator
    $(tabwidget).bValidator();

    if ($('.widget-tabs-container').width() < 600 && $(window).width() > 1024) {
        $('#HotelDatesRooms .col-lg-9').addClass('fixColumns100');
        $('#HotelDatesRooms .col-lg-3').addClass('fixColumns50');
        $('#divHotelTogglePromoCode .col-lg-3').addClass('fixColumns50');
    }
}

function initAirProduct(tabwidget) {

    if ($("div[id='air']", $(tabwidget)).length > 0) {

        // Checked Round Trip Type
        $("div[id='divAirMultiDestination']", $(tabwidget)).hide();
        $("input[name='AirTripType']:eq(0)", $(tabwidget)).prop('checked', true);
        changeTripType(tabwidget, 'Air', 'RT');

        // On click events
        $("input[id='rdAirTripTypeRT']", $(tabwidget)).click(function () {
            changeTripType(tabwidget, 'Air', 'RT');
        });
        $("input[id='rdAirTripTypeOW']", $(tabwidget)).click(function () {
            changeTripType(tabwidget, 'Air', 'OW');
        });
        $("input[id='rdAirTripTypeMD']", $(tabwidget)).click(function () {
            changeTripType(tabwidget, 'Air', 'MD');
        });
        $("a[id='addAirFlight2']", $(tabwidget)).click(function () {
            showHideFligth(tabwidget, 'divMDFlight3', 'divAirFlight2Opt');
        });
        $("a[id='addAirFlight3']", $(tabwidget)).click(function () {
            showHideFligth(tabwidget, 'divMDFlight4', 'divAirFlight3Opt');
        });
        $("a[id='addAirFlight4']", $(tabwidget)).click(function () {
            showHideFligth(tabwidget, 'divMDFlight5', 'divAirFlight4Opt');
        });
        $("a[id='addAirFlight5']", $(tabwidget)).click(function () {
            showHideFligth(tabwidget, 'divMDFlight6', 'divAirFlight5Opt');
        });
        $("a[id='delAirFlight3']", $(tabwidget)).click(function () {
            showHideFligth(tabwidget, 'divAirFlight2Opt', 'divMDFlight3');
        });
        $("a[id='delAirFlight4']", $(tabwidget)).click(function () {
            showHideFligth(tabwidget, 'divAirFlight3Opt', 'divMDFlight4');
        });
        $("a[id='delAirFlight5']", $(tabwidget)).click(function () {
            showHideFligth(tabwidget, 'divAirFlight4Opt', 'divMDFlight5');
        });
        $("a[id='delAirFlight6']", $(tabwidget)).click(function () {
            showHideFligth(tabwidget, 'divAirFlight5Opt', 'divMDFlight6');
        });
        $("a[id='airPopUpBtn']", $(tabwidget)).click(function () {
            openPopUp(tabwidget, 'AirPaxPopUp', 'paxPopUp', 'Air');
        });
        $("input[id='txtAirDateFrom']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtAirDateFrom1']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtAirDateFrom2']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtAirDateFrom3']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtAirDateFrom4']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtAirDateFrom5']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtAirDateFrom6']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtAirDateTo']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateArrival"));
        });

        // Data validators
        var maxMessage = $("input[id='txtAirNumberPassenger']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger");
        $("input[id='txtAirNumberPassenger']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger", maxMessage.replace('{0}', $MaxPassengerSearch));
        $("input[id='txtAirNumberPassenger']", $(tabwidget)).attr("data-bvalidator", "validateMaxPassenger[" + tabwidget + ":Air:" + $MaxPassengerSearch + "], validateQuantityInfants[" + tabwidget + ":Air]");

        // Hide elements
        if (!$PromoCodeAllowed) {
            $("div[id='divAirTogglePromoCode']", $(tabwidget)).hide();
        } else {
            $("input[id='txtAirPromoCode']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }

        // Load Airlines

        var arrPreferredAirline = $("input[id='hdPreferredAirlines']", $(tabwidget)).val().split(',');
        var preferedAirlines = external_file_Airlines.sort().filter(function (airline) {
            return (arrPreferredAirline.indexOf(airline.substring(airline.indexOf("("), airline.indexOf(")") + 1)) >= 0);
        });

        var normalAirlines = external_file_Airlines.sort().filter(function (airline) {
            return (arrPreferredAirline.indexOf(airline.substring(airline.indexOf("("), airline.indexOf(")") + 1)) < 0);
        });

        if (preferedAirlines.length > 0) {
            convertArrayToArrayCodeName(preferedAirlines, 'AutoComplete').forEach(function (item) {
                $("select[id='ddlAirline']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name.toLowerCase() + " (" + item.Code + ")"
                }));
            });

            $("select[id='ddlAirline']", $(tabwidget)).append('<option data-divider="true"></option>');
        }
        convertArrayToArrayCodeName(normalAirlines, 'AutoComplete').forEach(function (item) {
            $("select[id='ddlAirline']", $(tabwidget)).append($('<option>', {
                value: item.Code,
                text: item.Name.toLowerCase() + " (" + item.Code + ")"
            }));
        });

        if (preferedAirlines.length > 0) {
            $("select[id='ddlAirline']", $(tabwidget)).selectpicker();
            $("select[id='ddlAirline']", $(tabwidget)).selectpicker('setStyle', 'form-control special-options-input selectpicker', 'add');
        }

        // Change Attributes
        if ($("div[id='divAirAccountCode']", $(tabwidget)).length > 0) {
            $("div[id='divAirDepartureTime']", $(tabwidget)).removeClass("fix-padding-left");
            $("div[id='divAirDepartureTime']", $(tabwidget)).addClass("fix-padding-right");
            $("div[id='divAirReturnTime']", $(tabwidget)).removeClass("fix-padding-right");
            $("div[id='divAirReturnTime']", $(tabwidget)).addClass("fix-padding-left");
        }

        // Load Cities
        var airCitiesFrom = filterListCode($ListCodes, 'AirProduct', 'Departure');
        var airCitiesTo = filterListCode($ListCodes, 'AirProduct', 'Arrival');

        // Load Cities From
        if (airCitiesFrom.length > 0) {

            convertArrayToArrayCodeName(airCitiesFrom, 'ListCodes').forEach(function (item) {

                $("select[id='ddlAirCityFrom']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name
                }));
            });
            $("div[id='divAirCityFromControlMobile']", $(tabwidget)).hide();
            $("select[id='ddlAirCityFrom']", $(tabwidget)).show();
            $("select[id='ddlAirCityFrom']", $(tabwidget)).change(function () {
                setTimeout(function () {
                    if (airCitiesTo.length > 0) {
                        //$("select[id='ddlAirCityTo']", $(tabwidget)).focus();
                    } else {
                        //$("input[id='txtAirCityTo']", $(tabwidget)).focus();
                        //$("div[id='divAirCityToControlMobile']", $(tabwidget)).trigger("click");
                    }
                }, 10);
            });
        } else {

            var airGeo = filterList($GeoLocationProducts, 'AirProduct');
            if (airGeo.length > 0 && airGeo[0].Enabled) {
                setGeolocationCity('txtAirCityFrom', tabwidget);
                setGeolocationCity('txtAirCityFrom1', tabwidget);
            }

            $("input[id='txtAirCityFrom']", $(tabwidget)).show();
        }

        // Load Cities To
        if (airCitiesTo.length > 0) {
            convertArrayToArrayCodeName(airCitiesTo, 'ListCodes').forEach(function (item) {

                $("select[id='ddlAirCityTo']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name
                }));
            });
            $("div[id='divAirCityToControlMobile']", $(tabwidget)).hide();
            $("select[id='ddlAirCityTo']", $(tabwidget)).show();
            $("select[id='ddlAirCityTo']", $(tabwidget)).change(function () {
                setTimeout(function () {
                    //showDatePick(tabwidget, 'txtAirDateFrom', getResource("DateDeparture"));
                }, 10);
            });
        } else {
            $("input[id='txtAirCityTo']", $(tabwidget)).show();
        }

        // Clean elements
        cleanElements($("div[id='air'] input", $(tabwidget)));
        $("input[id='txtAirNumberPassenger']", $(tabwidget)).val("1");
        $("input[id='hdnAirPassengers']", $(tabwidget)).val(JSON.stringify($jsonPax));

        // Init Autocomplete
        initAirAutocomplete(tabwidget, airCitiesTo.length);
        $("input[id*='txtAirCity']", $(tabwidget)).click(function () {
            this.setSelectionRange(0, this.value.length);
        });

        // Pre-autocomplete Cities on Multidestination
        $("input[id='txtAirCityTo1']", $(tabwidget)).change(function () {
            if ($("input[name='AirTripType']:eq(2)", $(tabwidget)).prop('checked'))
                $('input[id$=txtAirCityFrom2]', $(tabwidget)).val($("input[id='txtAirCityTo1']", $(tabwidget)).val());
        });
        $("input[id='txtAirCityTo2']", $(tabwidget)).change(function () {
            if ($("input[name='AirTripType']:eq(2)", $(tabwidget)).prop('checked'))
                $('input[id$=txtAirCityFrom3]', $(tabwidget)).val($("input[id='txtAirCityTo2']", $(tabwidget)).val());
        });
        $("input[id='txtAirCityTo3']", $(tabwidget)).change(function () {
            if ($("input[name='AirTripType']:eq(2)", $(tabwidget)).prop('checked'))
                $('input[id$=txtAirCityFrom4]', $(tabwidget)).val($("input[id='txtAirCityTo3']", $(tabwidget)).val());
        });
        $("input[id='txtAirCityTo4']", $(tabwidget)).change(function () {
            if ($("input[name='AirTripType']:eq(2)", $(tabwidget)).prop('checked'))
                $('input[id$=txtAirCityFrom5]', $(tabwidget)).val($("input[id='txtAirCityTo4']", $(tabwidget)).val());
        });
        $("input[id='txtAirCityTo5']", $(tabwidget)).change(function () {
            if ($("input[name='AirTripType']:eq(2)", $(tabwidget)).prop('checked'))
                $('input[id$=txtAirCityFrom6]', $(tabwidget)).val($("input[id='txtAirCityTo5']", $(tabwidget)).val());
        });

        // Init Datepickers
        var airSalesRestRuleFrom = valSalesRestRules('AirProduct', 'from');
        $("input[id*='txtAirDateFrom']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: $AirAdvancedPurchaseDays,
            maxDate: 355,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {

                if (this.id == "txtAirDateFrom")
                    return getPaintedDates(date, airSalesRestRuleFrom, $("input[id='txtAirDateFrom']", $(tabwidget)), $("input[id='txtAirDateTo']", $(tabwidget)));

                return [true];
            },
            onChangeMonthYear: function () {
                var txtId = this.id;

                setTimeout(function () {
                    addHeaderDatePick(tabwidget, txtId, getResource("DateDeparture"));
                }, 5);
            }
        });
        var airSalesRestRuleTo = valSalesRestRules('AirProduct', 'to');
        $("input[id='txtAirDateTo']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: 0,
            maxDate: 355,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {

                if (this.id == "txtAirDateTo")
                    return getPaintedDates(date, airSalesRestRuleTo, $("input[id='txtAirDateFrom']", $(tabwidget)), $("input[id='txtAirDateTo']", $(tabwidget)));

                return [true];
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtAirDateTo', getResource("DateArrival"));
                }, 5);
            }
        });
        $("input[id='txtAirDateFrom']", $(tabwidget)).change(function () {
            $("input[id='txtAirDateTo']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txtAirDateFrom']", $(tabwidget)).datepicker('getDate'));
        });
        $("input[id='txtAirDateFrom1']", $(tabwidget)).change(function () {
            $("input[id='txtAirDateFrom2']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txtAirDateFrom1']", $(tabwidget)).datepicker('getDate'));
        });
        $("input[id='txtAirDateFrom2']", $(tabwidget)).change(function () {
            $("input[id='txtAirDateFrom3']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txtAirDateFrom2']", $(tabwidget)).datepicker('getDate'));
        });
        $("input[id='txtAirDateFrom3']", $(tabwidget)).change(function () {
            $("input[id='txtAirDateFrom4']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txtAirDateFrom3']", $(tabwidget)).datepicker('getDate'));
        });
        $("input[id='txtAirDateFrom4']", $(tabwidget)).change(function () {
            $("input[id='txtAirDateFrom5']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txtAirDateFrom4']", $(tabwidget)).datepicker('getDate'));
        });
        $("input[id='txtAirDateFrom5']", $(tabwidget)).change(function () {
            $("input[id='txtAirDateFrom6']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txtAirDateFrom5']", $(tabwidget)).datepicker('getDate'));
        });

        // Departure Time On Change
        $("select[id='ddlAirDepartureTime1']", $(tabwidget)).change(function () {
            setTimeout(function () {
                $("input[id='txtAirCityTo2']", $(tabwidget)).focus();
                if ($IsMobile)
                    $("div[id='divAirCityTo2ControlMobile']", $(tabwidget)).trigger('click');
            }, 10);
        });
        $("select[id='ddlAirDepartureTime2']", $(tabwidget)).change(function () {
            setTimeout(function () {
                if ($("input[id='txtAirCityTo3']", $(tabwidget)).is(':visible')) {
                    $("input[id='txtAirCityTo3']", $(tabwidget)).focus();
                    if ($IsMobile)
                        $("div[id='divAirCityTo3ControlMobile']", $(tabwidget)).trigger('click');
                } else {
                    // llamado para abrir el popup de pasajeros
                    openPopUp(tabwidget, 'AirPaxPopUp', 'paxPopUp', 'Air');
                }
            }, 10);
        });
        $("select[id='ddlAirDepartureTime3']", $(tabwidget)).change(function () {
            setTimeout(function () {
                if ($("input[id='txtAirCityTo4']", $(tabwidget)).is(':visible')) {
                    $("input[id='txtAirCityTo4']", $(tabwidget)).focus();
                    if ($IsMobile)
                        $("div[id='divAirCityTo4ControlMobile']", $(tabwidget)).trigger('click');
                } else {
                    // llamado para abrir el popup de pasajeros
                    openPopUp(tabwidget, 'AirPaxPopUp', 'paxPopUp', 'Air');
                }
            }, 10);
        });
        $("select[id='ddlAirDepartureTime4']", $(tabwidget)).change(function () {
            setTimeout(function () {
                if ($("input[id='txtAirCityTo5']", $(tabwidget)).is(':visible')) {
                    $("input[id='txtAirCityTo5']", $(tabwidget)).focus();
                    if ($IsMobile)
                        $("div[id='divAirCityTo5ControlMobile']", $(tabwidget)).trigger('click');
                } else {
                    // llamado para abrir el popup de pasajeros
                    openPopUp(tabwidget, 'AirPaxPopUp', 'paxPopUp', 'Air');
                }
            }, 10);
        });
        $("select[id='ddlAirDepartureTime5']", $(tabwidget)).change(function () {
            setTimeout(function () {
                if ($("input[id='txtAirCityTo6']", $(tabwidget)).is(':visible')) {
                    $("input[id='txtAirCityTo6']", $(tabwidget)).focus();
                    if ($IsMobile)
                        $("div[id='divAirCityTo6ControlMobile']", $(tabwidget)).trigger('click');
                } else {
                    // llamado para abrir el popup de pasajeros
                    openPopUp(tabwidget, 'AirPaxPopUp', 'paxPopUp', 'Air');
                }
            }, 10);
        });
        $("select[id='ddlAirDepartureTime6']", $(tabwidget)).change(function () {
            setTimeout(function () {
                // llamado para abrir el popup de pasajeros
                openPopUp(tabwidget, 'AirPaxPopUp', 'paxPopUp', 'Air');
            }, 10);
        });

        // Button Search On Click
        $("input[id='btnSearchAir']", $(tabwidget)).click(function (e) {

            if (!$(tabwidget).data('bValidator').validate()) {
                e.preventDefault();
            } else {
                if (!$IsLinkGenerator) {
                    $("div[id='divPreload']", $(tabwidget)).show();
                }

                var url = $UrlDomainNS + "/" + $CurrentCulture + "/Air";
                var cityFrom = ($("select[id='ddlAirCityFrom']", $(tabwidget)).is(':visible')) ? $("select[id='ddlAirCityFrom']", $(tabwidget)).val() : getIATACode($("input[id='txtAirCityFrom']", $(tabwidget)).val());
                var cityFrom1 = getIATACode($("input[id='txtAirCityFrom1']", $(tabwidget)).val());
                var cityFrom2 = getIATACode($("input[id='txtAirCityFrom2']", $(tabwidget)).val());
                var cityFrom3 = getIATACode($("input[id='txtAirCityFrom3']", $(tabwidget)).val());
                var cityFrom4 = getIATACode($("input[id='txtAirCityFrom4']", $(tabwidget)).val());
                var cityFrom5 = getIATACode($("input[id='txtAirCityFrom5']", $(tabwidget)).val());
                var cityFrom6 = getIATACode($("input[id='txtAirCityFrom6']", $(tabwidget)).val());
                var cityTo = ($("select[id='ddlAirCityTo']", $(tabwidget)).is(':visible')) ? $("select[id='ddlAirCityTo']", $(tabwidget)).val() : getIATACode($("input[id='txtAirCityTo']", $(tabwidget)).val());
                var cityTo1 = getIATACode($("input[id='txtAirCityTo1']", $(tabwidget)).val());
                var cityTo2 = getIATACode($("input[id='txtAirCityTo2']", $(tabwidget)).val());
                var cityTo3 = getIATACode($("input[id='txtAirCityTo3']", $(tabwidget)).val());
                var cityTo4 = getIATACode($("input[id='txtAirCityTo4']", $(tabwidget)).val());
                var cityTo5 = getIATACode($("input[id='txtAirCityTo5']", $(tabwidget)).val());
                var cityTo6 = getIATACode($("input[id='txtAirCityTo6']", $(tabwidget)).val());
                var dateFrom = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirDateFrom']").datepicker("getDate"));
                var dateFrom1 = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirDateFrom1']").datepicker("getDate"));
                var dateFrom2 = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirDateFrom2']").datepicker("getDate"));
                var dateFrom3 = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirDateFrom3']").datepicker("getDate"));
                var dateFrom4 = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirDateFrom4']").datepicker("getDate"));
                var dateFrom5 = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirDateFrom5']").datepicker("getDate"));
                var dateFrom6 = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirDateFrom6']").datepicker("getDate"));
                var departureTime1 = $("select[id='ddlAirDepartureTime1']", $(tabwidget)).val();
                var departureTime2 = $("select[id='ddlAirDepartureTime2']", $(tabwidget)).val();
                var departureTime3 = $("select[id='ddlAirDepartureTime3']", $(tabwidget)).val();
                var departureTime4 = $("select[id='ddlAirDepartureTime4']", $(tabwidget)).val();
                var departureTime5 = $("select[id='ddlAirDepartureTime5']", $(tabwidget)).val();
                var departureTime6 = $("select[id='ddlAirDepartureTime6']", $(tabwidget)).val();
                var dateTo = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirDateTo']").datepicker("getDate"));
                var pax = JSON.parse($("input[id='hdnAirPassengers']", $(tabwidget)).val());
                var flexDates = ($("input[id='chkdivAirFlexDates']", $(tabwidget)).is(':visible') && $("input[id='chkdivAirFlexDates']", $(tabwidget)).prop('checked')) ? "3" : "NA";
                var airline = ($("select[id='ddlAirline']", $(tabwidget)).val() != "") ? $("select[id='ddlAirline']", $(tabwidget)).val() : "NA";
                var accountCode = ($("input[id='txtAirAccountCode']", $(tabwidget)).is(':visible') && $("input[id='txtAirAccountCode']", $(tabwidget)).val() != "") ? $("input[id='txtAirAccountCode']", $(tabwidget)).val() : "NA";
                var typeCabin = ($("select[id='ddlAirTypeCabin']", $(tabwidget)).val() != "") ? $("select[id='ddlAirTypeCabin']", $(tabwidget)).val() : "NA";
                var timeFrom = ($("select[id='ddlAirDepartureTime']", $(tabwidget)).val() != "") ? $("select[id='ddlAirDepartureTime']", $(tabwidget)).val() : "NA";
                var timeTo = ($("select[id='ddlAirReturnTime']", $(tabwidget)).val() != "") ? $("select[id='ddlAirReturnTime']", $(tabwidget)).val() : "NA";
                var baggageIncluded = ($("input[id='chkAirBaggageIncluded']", $(tabwidget)).is(':visible') && $("input[id='chkAirBaggageIncluded']", $(tabwidget)).prop('checked')) ? "true" : "false";
                var directFLight = ($("input[id='chkAirDirectFlight']", $(tabwidget)).is(':visible') && $("input[id='chkAirDirectFlight']", $(tabwidget)).prop('checked')) ? "true" : "false";
                var promoCode = $("input[id='txtAirPromoCode']", $(tabwidget)).val();

                switch ($("input[name='AirTripType']:checked").val()) {
                    case "OW":

                        url += "/OW";
                        url += "/" + cityFrom;
                        url += "/" + cityTo
                        url += "/" + dateFrom;
                        url += "/" + pax.Adults;
                        url += "/" + pax.Childs;
                        url += "/" + pax.Infants;
                        url += "/" + flexDates;
                        url += "/" + airline;
                        url += "/" + accountCode;
                        url += "/" + typeCabin;
                        url += "/" + timeFrom;

                        break;
                    case "RT":

                        url += "/RT";
                        url += "/" + cityFrom;
                        url += "/" + cityTo
                        url += "/" + dateFrom;
                        url += "/" + dateTo;
                        url += "/" + pax.Adults;
                        url += "/" + pax.Childs;
                        url += "/" + pax.Infants;
                        url += "/" + flexDates;
                        url += "/" + airline;
                        url += "/" + accountCode;
                        url += "/" + typeCabin;

                        if (timeFrom != "NA" && timeTo != "NA") {
                            url += "/" + timeFrom + "," + timeTo;
                        } else if (timeFrom != "NA" && timeTo == "NA") {
                            url += "/" + timeFrom + ",NA";
                        } else if (timeFrom == "NA" && timeTo != "NA") {
                            url += "/NA," + timeTo;
                        } else {
                            url += "/NA";
                        }

                        break;
                    case "MD":

                        url += "/MD";

                        // Cities from
                        url += "/" + cityFrom1 + "," + cityFrom2;
                        if (cityFrom3 != "" && cityTo3 != "")
                            url += "," + cityFrom3;
                        if (cityFrom4 != "" && cityTo4 != "")
                            url += "," + cityFrom4;
                        if (cityFrom5 != "" && cityTo5 != "")
                            url += "," + cityFrom5;
                        if (cityFrom6 != "" && cityTo6 != "")
                            url += "," + cityFrom6;

                        // Cities to
                        url += "/" + cityTo1 + "," + cityTo2;
                        if (cityFrom3 != "" && cityTo3 != "")
                            url += "," + cityTo3;
                        if (cityFrom4 != "" && cityTo4 != "")
                            url += "," + cityTo4;
                        if (cityFrom5 != "" && cityTo5 != "")
                            url += "," + cityTo5;
                        if (cityFrom6 != "" && cityTo6 != "")
                            url += "," + cityTo6;

                        // Departure date
                        url += "/" + dateFrom1 + "," + dateFrom2;
                        if (dateFrom3 != "")
                            url += "," + dateFrom3;
                        if (dateFrom4 != "")
                            url += "," + dateFrom4;
                        if (dateFrom5 != "")
                            url += "," + dateFrom5;
                        if (dateFrom6 != "")
                            url += "," + dateFrom6;

                        url += "/" + pax.Adults;
                        url += "/" + pax.Childs;
                        url += "/" + pax.Infants;

                        break;
                }

                url += "/" + baggageIncluded + "/" + directFLight;

                if ($("input[name='AirTripType']:checked").val() == "MD") {
                    url += "/" + airline + "/" + typeCabin;

                    //Departure Times
                    if (departureTime1 == "" && departureTime2 == "" && departureTime3 == "" &&
                        departureTime4 == "" && departureTime5 == "" && departureTime6 == "") {
                        url += "/NA";
                    } else {
                        url += "/" + departureTime1 + "," + departureTime2;
                        if (dateFrom3 != "")
                            url += "," + departureTime3;
                        if (dateFrom4 != "")
                            url += "," + departureTime4;
                        if (dateFrom5 != "")
                            url += "," + departureTime5;
                        if (dateFrom6 != "")
                            url += "," + departureTime6;
                    }
                }

                url += "/" + $UserService + "-show-" + $BranchCode;

                if ($IsLinkGenerator) {

                    $.iGrowl({
                        type: "info",
                        title: "Search Query String",
                        message: url,
                        icon: 'vicons-search',
                        placement: {
                            x: 'center',
                            y: 'top'
                        },
                        delay: 0
                    });
                } else {

                    // Other Request Settings
                    url += "-" + $SalesChannel + "-" + $ClientId + "-" + $BusinessUnit + "--" + $SessionTokenSSO + "----" + promoCode;
                    $('#Form').attr('action', url);
                    $('#Form').submit();
                    //location.href = url;
                }
            }
        });
    }
}

function initAirAutocomplete(tabwidget, lenCitiesto) {

    // City From

    $("input[id='txtAirCityFrom']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityFrom1']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityFrom2']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityFrom3']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityFrom4']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityFrom5']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityFrom6']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    // City To

    $("input[id='txtAirCityTo']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityTo1']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityTo2']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityTo3']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityTo4']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityTo5']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

    $("input[id='txtAirCityTo6']", $(tabwidget)).netautocomplete('init', {
        type: "AirportsCities",
        showExcluded: false
    });

}

function initHotelProduct(tabwidget) {

    if ($("div[id='hotel']", $(tabwidget)).length > 0) {

        // On click events
        $("a[id='hotelPopUpBtn']", $(tabwidget)).click(function () {
            openPopUp(tabwidget, 'HotelPaxPopUp', 'paxRoomPopUp', 'Hotel');
        });
        $("input[id='txtHotelDateFrom']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateCheckin"));
        });
        $("input[id='txtHotelDateTo']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateCheckout"));
        });

        // Data validators
        var maxMessage = $("input[id='txtHotelNumberRooms']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger");
        $("input[id='txtHotelNumberRooms']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger", maxMessage.replace('{0}', $MaxPassengerSearch));
        $("input[id='txtHotelNumberRooms']", $(tabwidget)).attr("data-bvalidator", "validateMaxPassenger[" + tabwidget + ":Hotel:" + $MaxPassengerSearch + "]");

        // Hide elements
        if (!$PromoCodeAllowed) {
            $("div[id='divHotelTogglePromoCode']", $(tabwidget)).hide();
        } else {
            $("input[id='txtHotelPromoCode']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }

        // Load Cities or Hotel Product
        var hotelList = filterListCode($ListCodes, 'HotelProduct', null);
        if (hotelList.length > 0) {
            var codeItem, nameItem;
            convertArrayToArrayCodeName(hotelList, 'ListCodes').forEach(function (item) {

                codeItem = (item.ProductCode == null) ? item.Code : item.Code + "|" + item.ProductCode;
                nameItem = (item.ProductName == null) ? item.Name : item.ProductName;

                $("select[id='ddlHotelCity']", $(tabwidget)).append($('<option>', {
                    value: codeItem,
                    text: nameItem
                }));
            });
            $("div[id='divHotelCityControlMobile']", $(tabwidget)).hide();
            $("select[id='ddlHotelCity']", $(tabwidget)).show();
            $("select[id='ddlHotelCity']", $(tabwidget)).change(function () {
                setTimeout(function () {
                    showDatePick(tabwidget, 'txtHotelDateFrom', getResource("DateCheckin"));
                }, 10);
            });
        } else {

            var hotelGeo = filterList($GeoLocationProducts, 'HotelProduct');
            if (hotelGeo.length > 0 && hotelGeo[0].Enabled)
                setGeolocationCity('txtHotelCity', tabwidget);

            $("input[id='txtHotelCity']", $(tabwidget)).show();
        }

        // Clean elements
        cleanElements($("div[id='hotel'] input", $(tabwidget)));
        $("input[id='txtHotelNumberRooms']", $(tabwidget)).val("1");
        $("input[id='txtHotelNumberPassenger']", $(tabwidget)).val("1");
        $("input[id='hdnHotelPassengers']", $(tabwidget)).val(JSON.stringify($jsonArrayPaxRoom));

        // Init Autocomplete
        if (hotelList.length == 0) {
            if ($StaticContentEnable) {
                if ($IsMobile) {
                    staticContentAutocomplete.LoadNetsuiteAutocomplete($ModuleId, "txtMobileAutocompleteSc", "", $UserService, '', '', "es")
                }
                else {
                    staticContentAutocomplete.LoadNetsuiteAutocomplete($ModuleId, "txtHotelCity", "", $UserService, '', '', "es")
                }
                $("#txtHotelCity", $(tabwidget)).attr("data-bvalidator", "required,validatesc")
            }
            else {
                $("input[id='txtHotelCity']", $(tabwidget)).netautocomplete('init', {
                    type: "Cities",
                    showExcluded: false
                });
                $("input[id='txtHotelCity']", $(tabwidget)).click(function () {
                    this.setSelectionRange(0, this.value.length);
                });
            }
        }

        // Init Datepickers
        var hotelDaysAvailableOnCalendarToSearch = 548;
        var hotelSalesRestRuleFrom = valSalesRestRules('HotelProduct', 'from')
        $("input[id='txtHotelDateFrom']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: $HotelAdvancedPurchaseDays,
            maxDate: hotelDaysAvailableOnCalendarToSearch - 1,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, hotelSalesRestRuleFrom, $("input[id='txtHotelDateFrom']", $(tabwidget)), $("input[id='txtHotelDateTo']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtHotelDateFrom', getResource("DateCheckin"));
                }, 5);
            }
        });
        var hotelSalesRestRuleTo = valSalesRestRules('HotelProduct', 'to');
        $("input[id='txtHotelDateTo']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: $HotelAdvancedPurchaseDays,
            maxDate: $HotelAdvancedPurchaseDays,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, hotelSalesRestRuleTo, $("input[id='txtHotelDateFrom']", $(tabwidget)), $("input[id='txtHotelDateTo']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtHotelDateTo', getResource("DateCheckout"));
                }, 5);
            }
        });
        $("input[id='txtHotelDateFrom']", $(tabwidget)).change(function () {
            var minDateTo_hotel = new Date(
                $.datepicker.formatDate('yy', $("input[id='txtHotelDateFrom']", $(tabwidget)).datepicker('getDate')),
                $.datepicker.formatDate('mm', $("input[id='txtHotelDateFrom']", $(tabwidget)).datepicker('getDate')) * 1 - 1,
                $.datepicker.formatDate('dd', $("input[id='txtHotelDateFrom']", $(tabwidget)).datepicker('getDate')) * 1
            );

            var maxDateTo_hotel = minDateTo_hotel;
            minDateTo_hotel = addDays(minDateTo_hotel, 1);

            var _maxDaysAllowedSelected = 30;
            var today = new Date();
            var diff = Math.floor((minDateTo_hotel - today) / (1000 * 60 * 60 * 24));
            if (diff >= ((hotelDaysAvailableOnCalendarToSearch) - _maxDaysAllowedSelected)) {
                _maxDaysAllowedSelected = _maxDaysAllowedSelected - (diff - ((hotelDaysAvailableOnCalendarToSearch) - _maxDaysAllowedSelected));
            }

            maxDateTo_hotel = addDays(maxDateTo_hotel, _maxDaysAllowedSelected);

            $("input[id='txtHotelDateTo']", $(tabwidget)).datepicker("option", "minDate", minDateTo_hotel);
            $("input[id='txtHotelDateTo']", $(tabwidget)).datepicker("option", "maxDate", maxDateTo_hotel);

        });


        // Button Search On Click
        $("input[id='btnSearchHotel']", $(tabwidget)).click(function (e) {

            if (!$(tabwidget).data('bValidator').validate()) {
                e.preventDefault();
            } else {
                if (!$IsLinkGenerator) {
                    $("div[id='divPreload']", $(tabwidget)).show();
                }

                if ($IsLinkGenerator) {

                    $.iGrowl({
                        type: "info",
                        title: "Search Query String",
                        message: url,
                        icon: 'vicons-search',
                        placement: {
                            x: 'center',
                            y: 'top'
                        },
                        delay: 0
                    });
                } else {
                    let city = ($("select[id='ddlHotelCity']", $(tabwidget)).is(':visible')) ? $("select[id='ddlHotelCity']", $(tabwidget)).val() : getIATACode($("input[id='txtHotelCity']", $(tabwidget)).val());
                    let paxRoom = getPaxByArray(JSON.parse($("input[id='hdnHotelPassengers']", $(tabwidget)).val()), 'Hotel')
                    let hotelCode = "NA";
                    let promoCode = $("input[id='txtHotelPromoCode']", $(tabwidget)).val();
                    let checkIn = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtHotelDateFrom']").datepicker("getDate"));
                    let checkOut = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtHotelDateTo']").datepicker("getDate"));
                    let destinationType = $("input[id$='txtHotelCity']").attr('destinationtype');
                    let txtDestination = $("input[id$='txtHotelCity']").attr('destinationid') != undefined ? $("input[id$='txtHotelCity']").attr('destinationid') : $("select#ddlHotelCity").val();
                    let url = $UrlDomainNS + "/" + $CurrentCulture + "/Hotel";


                    function addParam() {
                        function separator(params) {
                            return params.includes('?') ? '&' : '?';
                        };
                        let params = "";
                        let promoCode = $("input[id='txtHotelPromoCode']", $(tabwidget)).val();
                        if ($BranchCode != '') params = `?branchCode=${$BranchCode}`
                        if ($SalesChannel != '') params += `${separator(params)}saleChannel=${$SalesChannel}`
                        if ($SessionTokenSSO != '') params += `${separator(params)}sessionToken=${$SessionTokenSSO}`
                        if ($ClientId != '') params += `${separator(params)}clientId=${$ClientId}`
                        if ($BusinessUnit != '') params += `${separator(params)}businessUnit=${$BusinessUnit}`
                        if (promoCode != '') params += `${separator(params)}promoCode=${promoCode}`

                        return params;
                    }
                    // se verifica si es una ciudad(l) o un hotel(h) y se le agrega el codigo de la busqueda. 
                    function locationTypeAndLocationUrl() {
                        let DestinationType = "l";
                        if (destinationType == "hotelid") DestinationType = "h";
                        return DestinationType + txtDestination;
                    }

                    function urlNewFront() {
                        let queryStringNs = () => {
                            let nsHotel = 'netsuite-hotels/'
                            if ($UrlDomainNS.includes('preprod.netactica.com')) nsHotel = '';
                            return nsHotel
                        }
                        url = `${$UrlDomainNS}/${queryStringNs()}results/${$CurrentCulture}/${$UserService}/${locationTypeAndLocationUrl()}/`;
                        url += `${checkIn}/${checkOut}/${paxRoom}${addParam()}`;
                    }
                    function urlStaticContent() {
                        let destType = "/Location"
                        if (destinationType == "hotelid") destType = "/HotelId"
                        url += `${destType}/${txtDestination}/${checkIn}/${checkOut}/${paxRoom}/${hotelCode}`
                        url += "/" + $UserService + "-show-" + $BranchCode;
                    }

                    function oldUrl() {
                        if (city.indexOf("|") > 0) {
                            let arrCity = city.split("|");
                            city = arrCity[0];
                            hotelCode = arrCity[1];
                        }
                        url += `/${city}/${checkIn}/${checkOut}/${paxRoom}/${hotelCode}/${$UserService}-show-${$BranchCode}`;
                    }

                    if ($EnableHotelNewFrontEnd && $StaticContentEnable)
                        urlNewFront()
                    else if ($StaticContentEnable)
                        urlStaticContent()
                    else
                        oldUrl()

                    // Other Request Settings
                    if (!$EnableHotelNewFrontEnd) {
                        url += "-" + $SalesChannel;
                        url += "-" + $ClientId + "-" + $BusinessUnit + "--" + $SessionTokenSSO + "----" + promoCode;
                    }

                    // agregar variable en la url.
                    if (document.querySelector('#inputValueName')) {
                        url = addParamInUrl(url);
                    }
                    const params = document.querySelector('#appendToResult');
                    if (params) {
                        if (params.value != '') {
                            url = url.includes('?') ? `${url}&${params.value}` : `${url}?${params.value}`;
                        }
                    }
                    if ($EnableHotelNewFrontEnd) {
                        window.location.href = url;
                    }else{
                        $('#Form').attr('action', url);
                        $('#Form').submit();
                    }
                }
            }
        });
    }
}

function initCarProduct(tabwidget) {

    if ($("div[id='car']", $(tabwidget)).length > 0) {

        // Checked Return Type
        $("input[id='chkCarChangeReturn']", $(tabwidget)).prop('checked', false);
        changeReturnType(tabwidget, 'Same');

        // On click events
        $("input[id='txtCarDatePickup']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DatePickup"));
        });
        $("input[id='txtCarDateDropoff']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDropoff"));
        });

        // On change events
        $("input[id='chkCarChangeReturn']", $(tabwidget)).change(function () {
            if ($(this).prop('checked')) {
                changeReturnType(tabwidget, 'Distinct');
                $("input[id='txtCarAirportReturn']", $(tabwidget)).focus();

                if ($IsMobile)
                    setMobileFocus(tabwidget, 'txtCarAirportPickup');
            } else {
                changeReturnType(tabwidget, 'Same');
            }
        });

        // Init Inputs
        $("select[id='ddlCarTimePickup'] option[value='1000']", $(tabwidget)).prop('selected', true);
        $("select[id='ddlCarTimeDropoff'] option[value='1000']", $(tabwidget)).prop('selected', true);


        // Hide elements
        $("div[id='divCarAirportReturn']", $(tabwidget)).hide();
        if (!$PromoCodeAllowed) {
            $("div[id='divCarTogglePromoCode']", $(tabwidget)).hide();
        } else {
            $("input[id='txtCarPromoCode']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }

        // Clean elements
        cleanElements($("div[id='car'] input", $(tabwidget)));

        // Init Autocomplete
        $("input[id='txtCarAirportPickup']", $(tabwidget)).netautocomplete('init', {
            type: "Neighborhood",
            showExcluded: false
        });
        $("input[id='txtCarAirportReturn']", $(tabwidget)).netautocomplete('init', {
            type: "Neighborhood",
            showExcluded: false
        });
        $("input[id='txtCarAirportPickup']", $(tabwidget)).click(function () {
            this.setSelectionRange(0, this.value.length);
        });
        $("input[id='txtCarAirportReturn']", $(tabwidget)).click(function () {
            this.setSelectionRange(0, this.value.length);
        });

        // Geolocation
        var carGeo = filterList($GeoLocationProducts, 'CarProduct');
        if (carGeo.length > 0 && carGeo[0].Enabled)
            setGeolocationCity('txtCarAirportPickup', tabwidget);

        // Init Datepickers
        var carSalesRestRuleFrom = valSalesRestRules('CarProduct', 'from');
        $("input[id='txtCarDatePickup']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: $VehicleAdvancedPurchaseDays,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, carSalesRestRuleFrom, $("input[id='txtCarDatePickup']", $(tabwidget)), $("input[id='txtCarDateDropoff']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtCarDatePickup', getResource("DatePickup"));
                }, 5);
            }
        });
        var carSalesRestRuleTo = valSalesRestRules('CarProduct', 'to');
        $("input[id='txtCarDateDropoff']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: $VehicleAdvancedPurchaseDays,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, carSalesRestRuleTo, $("input[id='txtCarDatePickup']", $(tabwidget)), $("input[id='txtCarDateDropoff']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtCarDateDropoff', getResource("DateDropoff"));
                }, 5);
            }
        });
        $("input[id='txtCarDatePickup']", $(tabwidget)).change(function () {
            $("input[id='txtCarDateDropoff']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txtCarDatePickup']", $(tabwidget)).datepicker('getDate'));

        });

        // Button Search On Click
        $("input[id='btnSearchCar']", $(tabwidget)).click(function (e) {
            if (!$(tabwidget).data('bValidator').validate()) {
                e.preventDefault();
            } else {
                if (!$IsLinkGenerator) {
                    $("div[id='divPreload']", $(tabwidget)).show();
                }

                function TranslateDestination(destinationInfo) {
                    if (!destinationInfo) {


                        console.log(destination)
                        return null;
                    }

                    var destinationType,
                        destination;

                    switch (destinationInfo.type) {
                        case "Airports":
                            destinationType = "Airport";
                            destination = destinationInfo.code;
                            break;

                        case "AllCities":
                        case "Cities":
                            destinationType = "City";
                            destination = destinationInfo.code;
                            break;

                        case "Neighborhood":
                            destinationType = "Neighborhood";
                            destination = destinationInfo.id;
                            break;
                    }

                    return {
                        destinationType: destinationType,
                        destination: destination
                    };
                }

                var pickUpSelectedInfo = $("input[id='txtCarAirportPickup']", $(tabwidget)).netautocomplete("getSelectedInfo"),
                    dropOffSelectedInfo = $("input[id='txtCarAirportReturn']", $(tabwidget)).netautocomplete("getSelectedInfo"),
                    differentPlace = $("input[id='txtCarAirportReturn']", $(tabwidget)).is(":visible"),
                    translatedDestinations = {
                        pickUp: TranslateDestination(pickUpSelectedInfo),
                        dropOff: TranslateDestination(dropOffSelectedInfo)
                    };

                if (!differentPlace || !translatedDestinations.dropOff) {
                    translatedDestinations.dropOff = translatedDestinations.pickUp;
                }

                var promoCode = $("input[id='txtCarPromoCode']", $(tabwidget)).val();

                var url = $UrlDomainNS + "/" + $CurrentCulture + "/Car"
                    + "/" + translatedDestinations.pickUp.destinationType //PickUpType
                    + "/" + translatedDestinations.pickUp.destination //Pickup
                    + "/" + $.datepicker.formatDate("yy-mm-dd", $("input[id='txtCarDatePickup']").datepicker("getDate")) //PickupDate
                    + "/" + $("select[id='ddlCarTimePickup']").val() //PickupTime
                    + "/" + translatedDestinations.dropOff.destinationType //DropOffType
                    + "/" + translatedDestinations.dropOff.destination //DropOff
                    + "/" + $.datepicker.formatDate("yy-mm-dd", $("input[id='txtCarDateDropoff']").datepicker("getDate")) //DropOffDate
                    + "/" + $("select[id='ddlCarTimeDropoff']").val() //DropOffTime
                    + ($("input[id='divCarTogglePromoCode']", $(tabwidget)).is(":visible") ? promoCode : "/NA") //DiscountCode
                    + "/NA" //VendorCode
                    + "/NA" //DriveAge
                    + "/" + $UserService //UserService
                    + "-show-" + $BranchCode;

                if ($IsLinkGenerator) {
                    $.iGrowl({
                        type: "info",
                        title: "Search Query String",
                        message: url,
                        icon: 'vicons-search',
                        placement: {
                            x: 'center',
                            y: 'top'
                        },
                        delay: 0
                    });
                } else {
                    // Other Request Settings
                    url += "-" + $SalesChannel + "-" + $ClientId + "-" + $BusinessUnit + "--" + $SessionTokenSSO + "----" + promoCode;
                    $('#Form').attr('action', url);
                    $('#Form').submit();
                    //location.href = url;
                }
            }
        });
    }
}
function initExtraProduct(tabwidget) {

    if ($("div[id='extra']", $(tabwidget)).length > 0) {

        // On click events
        $("input[id='txtExtraDateFrom']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtExtraDateTo']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateArrival"));
        });

        // Hide elements
        if (!$PromoCodeAllowed) {
            $("div[id='divExtraTogglePromoCode']", $(tabwidget)).hide();
        } else {
            $("input[id='txtExtraPromoCode']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }

        // Load Cities
        var extraCities = filterListCode($ListCodes, 'ExtraProduct', null);
        if (extraCities.length > 0) {
            convertArrayToArrayCodeName(extraCities, 'ListCodes').forEach(function (item) {
                $("select[id='ddlExtraCity']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name
                }));
            });
            $("div[id='divExtraCityControlMobile']", $(tabwidget)).hide();
            $("select[id='ddlExtraCity']", $(tabwidget)).show();
            $("select[id='ddlExtraCity']", $(tabwidget)).change(function () {
                setTimeout(function () {
                    showDatePick(tabwidget, 'txtExtraDateFrom', getResource("DateDeparture"));
                }, 10);
            });
        } else {

            var extraGeo = filterList($GeoLocationProducts, 'ExtraProduct');
            if (extraGeo.length > 0 && extraGeo[0].Enabled)
                setGeolocationCity('txtExtraCity', tabwidget);

            $("input[id='txtExtraCity']", $(tabwidget)).show();
        }

        // Load Extra Types
        if ($("div[id='divExtraTypes']", $(tabwidget)).length > 0) {
            var extraTypes = eval($("input[id='ExtraProduct_Types']").val());
            var indexBreak = Math.floor(extraTypes.length / 2);
            var strHtml = "";
            var j = 1;

            for (var i = 0; i < extraTypes.length; i++) {
                strHtml += "<span><input type=\"checkbox\" value=\"" + extraTypes[i].TypeId + "\" id=\"chkExtraType_" + extraTypes[i].TypeId + "\">&nbsp;" + extraTypes[i].Name + "</span><br />"

                if (i == indexBreak) {
                    $("div[id='divExtraTypesCol" + j + "']", $(tabwidget)).html(strHtml);
                    strHtml = "";
                    j++;
                }
            }

            $("div[id='divExtraTypesCol" + j + "']", $(tabwidget)).html(strHtml);
        }

        // Clean elements
        cleanElements($("div[id='extra'] input", $(tabwidget)));

        // Init Autocomplete
        if (extraCities.length == 0) {
            $("input[id='txtExtraCity']", $(tabwidget)).netautocomplete('init', {
                type: "Cities",
                showExcluded: false
            });
            $("input[id='txtExtraCity']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }

        // Init Datepickers
        var extraSalesRestRuleFrom = valSalesRestRules('ExtraProduct', 'from');
        $("input[id='txtExtraDateFrom']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: $TravelExtraAdvancedPurchaseDays,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, extraSalesRestRuleFrom, $("input[id='txtExtraDateFrom']", $(tabwidget)), $("input[id='txtExtraDateTo']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtExtraDateFrom', getResource("DateDeparture"));
                }, 5);
            }
        });
        var extraSalesRestRuleTo = valSalesRestRules('ExtraProduct', 'to');
        $("input[id='txtExtraDateTo']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: 0,
            maxDate: 0,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, extraSalesRestRuleTo, $("input[id='txtExtraDateFrom']", $(tabwidget)), $("input[id='txtExtraDateTo']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtExtraDateTo', getResource("DateArrival"));
                }, 5);
            }
        });
        $("input[id='txtExtraDateFrom']", $(tabwidget)).change(function () {
            var numRangeDays = Math.floor((new Date($("input[id='txtExtraDateFrom']", $(tabwidget)).datepicker('getDate') - new Date())) / 86400000);
            var maxDateTo = numRangeDays + $TravelExtraMaxDaysAllowedSearch;

            $("input[id='txtExtraDateTo']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txtExtraDateFrom']", $(tabwidget)).datepicker('getDate'));
            $("input[id='txtExtraDateTo']", $(tabwidget)).datepicker("option", "maxDate", '+' + maxDateTo + 'd');

        });


        // Button Search On Click
        $("input[id='btnSearchExtra']", $(tabwidget)).click(function (e) {

            if (!$(tabwidget).data('bValidator').validate()) {
                e.preventDefault();
            } else {
                if (!$IsLinkGenerator) {
                    $("div[id='divPreload']", $(tabwidget)).show();
                }

                var url = $UrlDomainNS + "/" + $CurrentCulture + "/Extras";
                var city = ($("select[id='ddlExtraCity']", $(tabwidget)).is(':visible')) ? $("select[id='ddlExtraCity']", $(tabwidget)).val() : getIATACode($("input[id='txtExtraCity']", $(tabwidget)).val());
                var promoCode = $("input[id='txtExtraPromoCode']", $(tabwidget)).val();

                var extrasTypes = "";
                $("div[id='divExtraTypes'] input[type='checkbox']:checked").each(function () {
                    extrasTypes += $(this).attr('value') + ",";
                });
                extrasTypes = (extrasTypes != "") ? extrasTypes.slice(0, -1) : "NA";

                var dateFrom = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtExtraDateFrom']").datepicker("getDate"));
                datefrom = (dateFrom != "") ? dateFrom : "NA";
                var dateTo = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtExtraDateTo']").datepicker("getDate"));
                dateTo = (dateTo != "") ? dateTo : "NA";

                url += "/" + city;
                url += "/" + extrasTypes;
                url += "/" + dateFrom;
                url += "/" + dateTo;
                url += "/" + $UserService + "-show-" + $BranchCode;

                if ($IsLinkGenerator) {

                    $.iGrowl({
                        type: "info",
                        title: "Search Query String",
                        message: url,
                        icon: 'vicons-search',
                        placement: {
                            x: 'center',
                            y: 'top'
                        },
                        delay: 0
                    });
                } else {

                    // Other Request Settings
                    url += "-" + $SalesChannel + "-" + $ClientId + "-" + $BusinessUnit + "--" + $SessionTokenSSO + "----" + promoCode;
                    $('#Form').attr('action', url);
                    $('#Form').submit();
                    //location.href = url;
                }
            }
        });
    }
}

function initAirHotelProduct(tabwidget) {

    if ($("div[id='airhotel']", $(tabwidget)).length > 0) {

        // On click events
        $("a[id='airHotelPopUpBtn']", $(tabwidget)).click(function () {
            openPopUp(tabwidget, 'AirHotelPaxPopUp', 'paxRoomPopUp', 'AirHotel');
        });
        $("input[id='txtAirHotelDateFrom']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtAirHotelDateTo']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateArrival"));
        });

        // Data validators
        var maxMessage = $("input[id='txtAirHotelNumberRooms']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger");
        $("input[id='txtAirHotelNumberRooms']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger", maxMessage.replace('{0}', $MaxPassengerSearch));
        $("input[id='txtAirHotelNumberRooms']", $(tabwidget)).attr("data-bvalidator", "validateMaxPassenger[" + tabwidget + ":AirHotel:" + $MaxPassengerSearch + "], validateQuantityInfants[" + tabwidget + ":AirHotel]");

        // Hide elements
        if (!$PromoCodeAllowed) {
            $("div[id='divAirHotelTogglePromoCode']", $(tabwidget)).hide();
        } else {
            $("input[id='txtAirHotelPromoCode']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }

        // Load Cities
        var airHotelCitiesFrom = filterListCode($ListCodes, 'AirHotelProduct', 'Departure');
        var airHotelCitiesTo = filterListCode($ListCodes, 'AirHotelProduct', 'Arrival');

        // Load Cities From
        if (airHotelCitiesFrom.length > 0) {
            convertArrayToArrayCodeName(airHotelCitiesFrom, 'ListCodes').forEach(function (item) {

                $("select[id='ddlAirHotelCityFrom']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name
                }));
            });
            $("div[id='divAirHotelCityFromControlMobile']", $(tabwidget)).hide();
            $("select[id='ddlAirHotelCityFrom']", $(tabwidget)).show();
            $("select[id='ddlAirHotelCityFrom']", $(tabwidget)).change(function () {
                setTimeout(function () {
                    if (!airHotelCitiesTo.length > 0) {
                        $("div[id='divAirHotelCityToControlMobile']", $(tabwidget)).trigger("click");
                    }
                }, 10);
            });
        } else {

            var airHotelGeo = filterList($GeoLocationProducts, 'AirHotelProduct');
            if (airHotelGeo.length > 0 && airHotelGeo[0].Enabled)
                setGeolocationCity('txtAirHotelCityFrom', tabwidget);

            $("input[id='txtAirHotelCityFrom']", $(tabwidget)).show();
        }

        // Load Cities To
        if (airHotelCitiesTo.length > 0) {
            convertArrayToArrayCodeName(airHotelCitiesTo, 'ListCodes').forEach(function (item) {

                $("select[id='ddlAirHotelCityTo']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name
                }));
            });
            $("div[id='divAirHotelCityToControlMobile']", $(tabwidget)).hide();
            $("select[id='ddlAirHotelCityTo']", $(tabwidget)).show();
        } else {
            $("input[id='txtAirHotelCityTo']", $(tabwidget)).show();
        }

        // Load Airlines

        var arrPreferredAirline = $("input[id='hdAirHotelPreferredAirlines']", $(tabwidget)).val().split(',');
        var preferedAirlines = external_file_Airlines.sort().filter(function (airline) {
            return (arrPreferredAirline.indexOf(airline.substring(airline.indexOf("("), airline.indexOf(")") + 1)) >= 0);
        });

        var normalAirlines = external_file_Airlines.sort().filter(function (airline) {
            return (arrPreferredAirline.indexOf(airline.substring(airline.indexOf("("), airline.indexOf(")") + 1)) < 0);
        });

        if (preferedAirlines.length > 0) {
            convertArrayToArrayCodeName(preferedAirlines, 'AutoComplete').forEach(function (item) {
                $("select[id='ddlAirHotelAirline']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name.toLowerCase() + " (" + item.Code + ")"
                }));
            });

            $("select[id='ddlAirHotelAirline']", $(tabwidget)).append('<option data-divider="true"></option>');
        }
        convertArrayToArrayCodeName(normalAirlines, 'AutoComplete').forEach(function (item) {
            $("select[id='ddlAirHotelAirline']", $(tabwidget)).append($('<option>', {
                value: item.Code,
                text: item.Name.toLowerCase() + " (" + item.Code + ")"
            }));
        });

        if (preferedAirlines.length > 0) {
            $("select[id='ddlAirHotelAirline']", $(tabwidget)).selectpicker();
            $("select[id='ddlAirHotelAirline']", $(tabwidget)).selectpicker('setStyle', 'form-control special-options-input selectpicker', 'add');
        }

        // Clean elements
        cleanElements($("div[id='airhotel'] input", $(tabwidget)));
        $("input[id='txtAirHotelNumberRooms']", $(tabwidget)).val("1");
        $("input[id='txtAirHotelNumberPassenger']", $(tabwidget)).val("1");
        $("input[id='hdnAirHotelPassengers']", $(tabwidget)).val(JSON.stringify($jsonArrayPaxRoom));

        // Init Autocomplete
        if (airHotelCitiesFrom.length == 0) {
            $("input[id='txtAirHotelCityFrom']", $(tabwidget)).netautocomplete('init', {
                type: "AirportsCities",
                showExcluded: false
            });
            $("input[id='txtAirHotelCityFrom']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }
        if (airHotelCitiesTo.length == 0) {
            $("input[id='txtAirHotelCityTo']", $(tabwidget)).netautocomplete('init', {
                type: "AirportsCities",
                showExcluded: false
            });
            $("input[id='txtAirHotelCityTo']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }

        // Init Datepickers
        var airHotelAdvancedPurchaseDays = ($AirAdvancedPurchaseDays > $HotelAdvancedPurchaseDays) ? $AirAdvancedPurchaseDays : $HotelAdvancedPurchaseDays;
        var airHotelDaysAvailableOnCalendarToSearch = 355;
        var airHotelSalesRestRuleFrom = valSalesRestRules('AirHotelProduct', 'from');
        $("input[id='txtAirHotelDateFrom']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: airHotelAdvancedPurchaseDays,
            maxDate: airHotelDaysAvailableOnCalendarToSearch,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, airHotelSalesRestRuleFrom, $("input[id='txtAirHotelDateFrom']", $(tabwidget)), $("input[id='txtAirHotelDateTo']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtAirHotelDateFrom', getResource("DateDeparture"));
                }, 5);
            }
        });
        var airHotelSalesRestRuleTo = valSalesRestRules('AirHotelProduct', 'to');
        $("input[id='txtAirHotelDateTo']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: airHotelAdvancedPurchaseDays,
            maxDate: airHotelAdvancedPurchaseDays + 29,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, airHotelSalesRestRuleTo, $("input[id='txtAirHotelDateFrom']", $(tabwidget)), $("input[id='txtAirHotelDateTo']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtAirHotelDateTo', getResource("DateArrival"));
                }, 5);
            }
        });
        $("input[id='txtAirHotelDateFrom']", $(tabwidget)).change(function () {
            airHotelAdvancedPurchaseDays = new Date(
                $.datepicker.formatDate('yy', $("input[id='txtAirHotelDateFrom']", $(tabwidget)).datepicker('getDate')),
                $.datepicker.formatDate('mm', $("input[id='txtAirHotelDateFrom']", $(tabwidget)).datepicker('getDate')) * 1 - 1,
                $.datepicker.formatDate('dd', $("input[id='txtAirHotelDateFrom']", $(tabwidget)).datepicker('getDate')) * 1 + 1
            );
            $("input[id='txtAirHotelDateTo']", $(tabwidget)).datepicker("option", "minDate", airHotelAdvancedPurchaseDays);
            $("input[id='txtAirHotelDateTo']", $(tabwidget)).datepicker("option", "maxDate", addDays(airHotelAdvancedPurchaseDays, 29));
        });

        // Button Search On Click
        $("input[id='btnSearchAirHotel']", $(tabwidget)).click(function (e) {

            if (!$(tabwidget).data('bValidator').validate()) {
                e.preventDefault();
            } else {
                if (!$IsLinkGenerator) {
                    $("div[id='divPreload']", $(tabwidget)).show();
                }

                var url = $UrlDomainNS + "/" + $CurrentCulture + "/Package";
                var cityFrom = ($("select[id='ddlAirHotelCityFrom']", $(tabwidget)).is(':visible')) ? $("select[id='ddlAirHotelCityFrom']", $(tabwidget)).val() : getIATACode($("input[id='txtAirHotelCityFrom']", $(tabwidget)).val());
                var cityTo = ($("select[id='ddlAirHotelCityTo']", $(tabwidget)).is(':visible')) ? $("select[id='ddlAirHotelCityTo']", $(tabwidget)).val() : getIATACode($("input[id='txtAirHotelCityTo']", $(tabwidget)).val());
                var dateFrom = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirHotelDateFrom']", $(tabwidget)).datepicker("getDate"));
                var dateTo = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirHotelDateTo']").datepicker("getDate"));
                var airPax = getPaxByArray(JSON.parse($("input[id='hdnAirHotelPassengers']", $(tabwidget)).val()), 'Air')
                var hotelPax = getPaxByArray(JSON.parse($("input[id='hdnAirHotelPassengers']", $(tabwidget)).val()), 'Hotel')
                var baggageIncluded = ($("input[id='chkAirHotelBaggageIncluded']", $(tabwidget)).is(':visible') && $("input[id='chkAirHotelBaggageIncluded']", $(tabwidget)).prop('checked')) ? "true" : "false";
                var directFlight = ($("input[id='chkAirHotelDirectFlight']", $(tabwidget)).is(':visible') && $("input[id='chkAirHotelDirectFlight']", $(tabwidget)).prop('checked')) ? "true" : "false";
                var promoCode = $("input[id='txtAirHotelPromoCode']", $(tabwidget)).val();
                var airline = ($("select[id='ddlAirHotelAirline']", $(tabwidget)).val() != "") ? $("select[id='ddlAirHotelAirline']", $(tabwidget)).val() : "NA";
                var typeCabin = ($("select[id='ddlAirHotelTypeCabin']", $(tabwidget)).val() != "") ? $("select[id='ddlAirHotelTypeCabin']", $(tabwidget)).val() : "Economy";
                var timeFrom = ($("select[id='ddlAirHotelDepartureTime']", $(tabwidget)).val() != "") ? $("select[id='ddlAirHotelDepartureTime']", $(tabwidget)).val() : "NA";
                var timeTo = ($("select[id='ddlAirHotelReturnTime']", $(tabwidget)).val() != "") ? $("select[id='ddlAirHotelReturnTime']", $(tabwidget)).val() : "NA";

                url += "/" + cityFrom;
                url += "/" + cityTo;

                // Bus parameters
                url += "/" + dateFrom;
                url += "/" + dateTo;
                url += "/" + airPax;

                // Hotel parameters
                url += "/" + dateFrom;
                url += "/" + dateTo;
                url += "/" + hotelPax;

                url += "/" + baggageIncluded;
                url += "/" + directFlight;
                url += "/" + airline;
                url += "/" + typeCabin;

                if (timeFrom == "NA" && timeTo == "NA")
                    url += "/NA";
                else
                    url += "/" + timeFrom + "," + timeTo;

                url += "/" + $UserService + "-show-" + $BranchCode;

                if ($IsLinkGenerator) {

                    $.iGrowl({
                        type: "info",
                        title: "Search Query String",
                        message: url,
                        icon: 'vicons-search',
                        placement: {
                            x: 'center',
                            y: 'top'
                        },
                        delay: 0
                    });
                } else {

                    // Other Request Settings
                    url += "-" + $SalesChannel + "-" + $ClientId + "-" + $BusinessUnit + "--" + $SessionTokenSSO + "----" + promoCode;
                    $('#Form').attr('action', url);
                    $('#Form').submit();
                    //location.href = url;
                }
            }
        });
    }
}

function initBusProduct(tabwidget) {

    if ($("div[id='bus']", $(tabwidget)).length > 0) {

        // Checked Round Trip Type
        $("input[name='BusTripType']:eq(0)", $(tabwidget)).prop('checked', true);
        changeTripType(tabwidget, 'Bus', 'RT');

        // On click events
        $("input[id='rdBusTripTypeRT']", $(tabwidget)).click(function () {
            changeTripType(tabwidget, 'Bus', 'RT');
        });
        $("input[id='rdBusTripTypeOW']", $(tabwidget)).click(function () {
            changeTripType(tabwidget, 'Bus', 'OW');
        });
        $("a[id='busPopUpBtn']", $(tabwidget)).click(function () {
            openPopUp(tabwidget, 'BusPaxPopUp', 'paxPopUp', 'Bus');
        });
        $("input[id='txtBusDateFrom']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtBusDateTo']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateArrival"));
        });

        // Data validators
        var maxMessage = $("input[id='txtBusNumberPassenger']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger");
        $("input[id='txtBusNumberPassenger']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger", maxMessage.replace('{0}', $MaxPassengerSearch));
        $("input[id='txtBusNumberPassenger']", $(tabwidget)).attr("data-bvalidator", "validateMaxPassenger[" + tabwidget + ":Bus:" + $MaxPassengerSearch + "], validateQuantityInfants[" + tabwidget + ":Bus]");

        // Hide elements
        if (!$PromoCodeAllowed) {
            $("div[id='divBusTogglePromoCode']", $(tabwidget)).hide();
        } else {
            $("input[id='txtBusPromoCode']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }

        // Load Bus Companies
        convertArrayToArrayCodeName(external_file_BusCompanies, 'AutoComplete').forEach(function (item) {
            $("select[id='ddlBusCompany']", $(tabwidget)).append($('<option>', {
                value: item.Code,
                text: item.Name
            }));
        });

        // Clean elements
        cleanElements($("div[id='bus'] input", $(tabwidget)));
        $("input[id='txtBusNumberPassenger']", $(tabwidget)).val("1");
        $("input[id='hdnBusPassengers']", $(tabwidget)).val(JSON.stringify($jsonPax));

        // Init Autocomplete
        $("input[id='txtBusCityFrom']", $(tabwidget)).netautocomplete('init', {
            type: "Cities",
            showExcluded: false
        });
        $("input[id='txtBusCityTo']", $(tabwidget)).netautocomplete('init', {
            type: "Cities",
            showExcluded: false
        });
        $("input[id='txtBusCityFrom']", $(tabwidget)).click(function () {
            this.setSelectionRange(0, this.value.length);
        });
        $("input[id='txtBusCityTo']", $(tabwidget)).click(function () {
            this.setSelectionRange(0, this.value.length);
        });

        var busGeo = filterList($GeoLocationProducts, 'BusProduct');
        if (busGeo.length > 0 && busGeo[0].Enabled)
            setGeolocationCity('txtBusCityFrom', tabwidget);

        // Init Datepickers
        var busSalesRestRuleFrom = valSalesRestRules('BusProduct', 'from');
        $("input[id='txtBusDateFrom']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: $AirAdvancedPurchaseDays,
            maxDate: 355,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, busSalesRestRuleFrom, $("input[id='txtBusDateFrom']", $(tabwidget)), $("input[id='txtBusDateTo']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtBusDateFrom', getResource("DateDeparture"));
                }, 5);
            }
        });
        var busSalesRestRuleTo = valSalesRestRules('BusProduct', 'to');
        $("input[id='txtBusDateTo']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: 0,
            maxDate: 355,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, busSalesRestRuleTo, $("input[id='txtBusDateFrom']", $(tabwidget)), $("input[id='txtBusDateTo']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtBusDateTo', getResource("DateArrival"));
                }, 5);
            }
        });
        $("input[id='txtBusDateFrom']", $(tabwidget)).change(function () {
            $("input[id='txtBusDateTo']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txtBusDateFrom']", $(tabwidget)).datepicker('getDate'));

        });


        // Button Search On Click
        $("input[id='btnSearchBus']", $(tabwidget)).click(function (e) {

            if (!$(tabwidget).data('bValidator').validate()) {
                e.preventDefault();
            } else {
                if (!$IsLinkGenerator) {
                    $("div[id='divPreload']", $(tabwidget)).show();
                }

                var url = $UrlDomainNS + "/" + $CurrentCulture + "/Bus";
                var cityFrom = getIATACode($("input[id='txtBusCityFrom']", $(tabwidget)).val());
                var cityTo = getIATACode($("input[id='txtBusCityTo']", $(tabwidget)).val());
                var dateFrom = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtBusDateFrom']").datepicker("getDate"));
                var dateTo = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtBusDateTo']").datepicker("getDate"));
                var pax = JSON.parse($("input[id='hdnBusPassengers']").val());
                var busCompany = ($("select[id='ddlBusCompany']", $(tabwidget)).val() != "") ? $("select[id='ddlBusCompany']", $(tabwidget)).val() : "NA";
                var timeFrom = ($("select[id='ddlBusDepartureTime']", $(tabwidget)).val() != "") ? $("select[id='ddlBusDepartureTime']", $(tabwidget)).val() : "NA";
                var timeTo = ($("select[id='ddlBusReturnTime']", $(tabwidget)).val() != "") ? $("select[id='ddlBusReturnTime']", $(tabwidget)).val() : "NA";
                var promoCode = $("input[id='txtBusPromoCode']", $(tabwidget)).val();

                switch ($("input[name='BusTripType']:checked").val()) {
                    case "OW":

                        url += "/OW";
                        url += "/" + cityFrom;
                        url += "/" + cityTo
                        url += "/" + dateFrom;
                        url += "/" + pax.Adults;
                        url += "/" + pax.Childs;
                        url += "/" + pax.Infants;
                        url += "/" + busCompany;
                        url += "/" + timeFrom;

                        break;
                    case "RT":

                        url += "/RT";
                        url += "/" + cityFrom;
                        url += "/" + cityTo
                        url += "/" + dateFrom;
                        url += "/" + dateTo;
                        url += "/" + pax.Adults;
                        url += "/" + pax.Childs;
                        url += "/" + pax.Infants;
                        url += "/" + busCompany;

                        if (timeFrom != "NA" && timeTo != "NA") {
                            url += "/" + timeFrom + "," + timeTo;
                        } else if (timeFrom != "NA" && timeTo == "NA") {
                            url += "/" + timeFrom + ",NA";
                        } else if (timeFrom == "NA" && timeTo != "NA") {
                            url += "/NA," + timeTo;
                        } else {
                            url += "/NA";
                        }

                        break;
                }

                url += "/" + $UserService + "-show-" + $BranchCode;

                if ($IsLinkGenerator) {

                    $.iGrowl({
                        type: "info",
                        title: "Search Query String",
                        message: url,
                        icon: 'vicons-search',
                        placement: {
                            x: 'center',
                            y: 'top'
                        },
                        delay: 0
                    });
                } else {

                    // Other Request Settings
                    url += "-" + $SalesChannel + "-" + $ClientId + "-" + $BusinessUnit + "--" + $SessionTokenSSO + "----" + promoCode;
                    $('#Form').attr('action', url);
                    $('#Form').submit();
                    //location.href = url;
                }
            }
        });
    }
}

function initBusHotelProduct(tabwidget) {

    if ($("div[id='bushotel']", $(tabwidget)).length > 0) {

        // On click events
        $("a[id='busHotelPopUpBtn']", $(tabwidget)).click(function () {
            openPopUp(tabwidget, 'BusHotelPaxPopUp', 'paxRoomPopUp', 'BusHotel');
        });
        $("input[id='txtBusHotelDateFrom']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtBusHotelDateTo']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateArrival"));
        });

        // Data validators
        var maxMessage = $("input[id='txtBusHotelNumberRooms']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger");
        $("input[id='txtBusHotelNumberRooms']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger", maxMessage.replace('{0}', $MaxPassengerSearch));
        $("input[id='txtBusHotelNumberRooms']", $(tabwidget)).attr("data-bvalidator", "validateMaxPassenger[" + tabwidget + ":BusHotel:" + $MaxPassengerSearch + "]");

        // Hide elements
        if (!$PromoCodeAllowed) {
            $("div[id='divBusHotelTogglePromoCode']", $(tabwidget)).hide();
        } else {
            $("input[id='txtBusHotelPromoCode']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }

        // Load Cities
        var busHotelCitiesFrom = filterListCode($ListCodes, 'BusHotelProduct', 'Departure');
        var busHotelCitiesTo = filterListCode($ListCodes, 'BusHotelProduct', 'Arrival');

        // Load Cities From
        if (busHotelCitiesFrom.length > 0) {
            convertArrayToArrayCodeName(busHotelCitiesFrom, 'ListCodes').forEach(function (item) {

                $("select[id='ddlBusHotelCityFrom']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name
                }));
            });
            $("div[id='divBusHotelCityFromControlMobile']", $(tabwidget)).hide();
            $("select[id='ddlBusHotelCityFrom']", $(tabwidget)).show();
            $("select[id='ddlBusHotelCityFrom']", $(tabwidget)).change(function () {
                setTimeout(function () {
                    if (busHotelCitiesTo.length > 0) {
                        $("select[id='ddlBusHotelCityTo']", $(tabwidget)).focus();
                    } else {
                        $("input[id='txtBusHotelCityTo']", $(tabwidget)).focus();
                        $("div[id='divBusHotelCityToControlMobile']", $(tabwidget)).trigger("click");
                    }
                }, 10);
            });
        } else {

            var busHotelGeo = filterList($GeoLocationProducts, 'BusHotelProduct');
            if (busHotelGeo.length > 0 && busHotelGeo[0].Enabled)
                setGeolocationCity('txtBusHotelCityFrom', tabwidget);

            $("input[id='txtBusHotelCityFrom']", $(tabwidget)).show();
        }

        // Load Cities To
        if (busHotelCitiesTo.length > 0) {
            convertArrayToArrayCodeName(busHotelCitiesTo, 'ListCodes').forEach(function (item) {

                $("select[id='ddlBusHotelCityTo']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name
                }));
            });
            $("div[id='divBusHotelCityToControlMobile']", $(tabwidget)).hide();
            $("select[id='ddlBusHotelCityTo']", $(tabwidget)).show();
        } else {
            $("input[id='txtBusHotelCityTo']", $(tabwidget)).show();
        }

        // Clean elements
        cleanElements($("div[id='bushotel'] input", $(tabwidget)));
        $("input[id='txtBusHotelNumberRooms']", $(tabwidget)).val("1");
        $("input[id='txtBusHotelNumberPassenger']", $(tabwidget)).val("1");
        $("input[id='hdnBusHotelPassengers']", $(tabwidget)).val(JSON.stringify($jsonArrayPaxRoom));

        // Init Autocomplete
        if (busHotelCitiesFrom.length == 0) {
            $("input[id='txtBusHotelCityFrom']", $(tabwidget)).netautocomplete('init', {
                type: "Cities",
                showExcluded: false
            });
            $("input[id='txtBusHotelCityFrom']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }
        if (busHotelCitiesTo.length == 0) {
            $("input[id='txtBusHotelCityTo']", $(tabwidget)).netautocomplete('init', {
                type: "Cities",
                showExcluded: false
            });
            $("input[id='txtBusHotelCityTo']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }

        // Init Datepickers
        var busHotelAdvancedPurchaseDays = ($AirAdvancedPurchaseDays > $HotelAdvancedPurchaseDays) ? $AirAdvancedPurchaseDays : $HotelAdvancedPurchaseDays;
        var busHotelSalesRestRuleFrom = valSalesRestRules('BusHotelProduct', 'from');
        $("input[id='txtBusHotelDateFrom']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: busHotelAdvancedPurchaseDays,
            maxDate: 312,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, busHotelSalesRestRuleFrom, $("input[id='txtBusHotelDateFrom']", $(tabwidget)), $("input[id='txtBusHotelDateTo']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtBusHotelDateFrom', getResource("DateDeparture"));
                }, 5);
            }
        });
        var busHotelSalesRestRuleTo = valSalesRestRules('BusHotelProduct', 'to');
        $("input[id='txtBusHotelDateTo']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: busHotelAdvancedPurchaseDays,
            maxDate: busHotelAdvancedPurchaseDays + 29,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {
                return getPaintedDates(date, busHotelSalesRestRuleTo, $("input[id='txtBusHotelDateFrom']", $(tabwidget)), $("input[id='txtBusHotelDateTo']", $(tabwidget)));
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtBusHotelDateTo', getResource("DateArrival"));
                }, 5);
            }
        });
        $("input[id='txtBusHotelDateFrom']", $(tabwidget)).change(function () {
            busHotelAdvancedPurchaseDays = new Date(
                $.datepicker.formatDate('yy', $("input[id='txtBusHotelDateFrom']", $(tabwidget)).datepicker('getDate')),
                $.datepicker.formatDate('mm', $("input[id='txtBusHotelDateFrom']", $(tabwidget)).datepicker('getDate')) * 1 - 1,
                $.datepicker.formatDate('dd', $("input[id='txtBusHotelDateFrom']", $(tabwidget)).datepicker('getDate')) * 1 + 1
            );
            $("input[id='txtBusHotelDateTo']", $(tabwidget)).datepicker("option", "minDate", busHotelAdvancedPurchaseDays);
            $("input[id='txtBusHotelDateTo']", $(tabwidget)).datepicker("option", "maxDate", addDays(busHotelAdvancedPurchaseDays, 29));
        });

        // Button Search On Click
        $("input[id='btnSearchBusHotel']", $(tabwidget)).click(function (e) {

            if (!$(tabwidget).data('bValidator').validate()) {
                e.preventDefault();
            } else {
                if (!$IsLinkGenerator) {
                    $("div[id='divPreload']", $(tabwidget)).show();
                }

                var url = $UrlDomainNS + "/" + $CurrentCulture + "/PackageBus";
                var cityFrom = ($("select[id='ddlBusHotelCityFrom']", $(tabwidget)).is(':visible')) ? $("select[id='ddlBusHotelCityFrom']", $(tabwidget)).val() : getIATACode($("input[id='txtBusHotelCityFrom']", $(tabwidget)).val());
                var cityTo = ($("select[id='ddlBusHotelCityTo']", $(tabwidget)).is(':visible')) ? $("select[id='ddlBusHotelCityTo']", $(tabwidget)).val() : getIATACode($("input[id='txtBusHotelCityTo']", $(tabwidget)).val());
                var dateFrom = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtBusHotelDateFrom']", $(tabwidget)).datepicker("getDate"));
                var dateTo = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtBusHotelDateTo']", $(tabwidget)).datepicker("getDate"));
                var busPax = getPaxByArray(JSON.parse($("input[id='hdnBusHotelPassengers']", $(tabwidget)).val()), 'Bus')
                var hotelPax = getPaxByArray(JSON.parse($("input[id='hdnBusHotelPassengers']", $(tabwidget)).val()), 'Hotel')
                var promoCode = $("input[id='txtBusHotelPromoCode']", $(tabwidget)).val();

                url += "/" + cityFrom;
                url += "/" + cityTo;

                // Bus parameters
                url += "/" + dateFrom;
                url += "/" + dateTo;
                url += "/" + busPax;

                // Hotel parameters
                url += "/" + dateFrom;
                url += "/" + dateTo;
                url += "/" + hotelPax;

                url += "/" + $UserService + "-show-" + $BranchCode;

                if ($IsLinkGenerator) {

                    $.iGrowl({
                        type: "info",
                        title: "Search Query String",
                        message: url,
                        icon: 'vicons-search',
                        placement: {
                            x: 'center',
                            y: 'top'
                        },
                        delay: 0
                    });
                } else {

                    // Other Request Settings
                    url += "-" + $SalesChannel + "-" + $ClientId + "-" + $BusinessUnit + "--" + $SessionTokenSSO + "----" + promoCode;
                    $('#Form').attr('action', url);
                    $('#Form').submit();
                    //location.href = url;
                }
            }
        });
    }
}

function initAirCarProduct(tabwidget) {

    if ($("div[id='aircar']", $(tabwidget)).length > 0) {

        // On click events
        $("a[id='airCarPopUpBtn']", $(tabwidget)).click(function () {
            openPopUp(tabwidget, 'AirCarPaxPopUp', 'paxPopUp', 'AirCar');
        });
        $("input[id='txtAirCarDateFrom']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateDeparture"));
        });
        $("input[id='txtAirCarDateTo']", $(tabwidget)).click(function () {
            showDatePick(tabwidget, this.id, getResource("DateArrival"));
        });

        // Data validators
        var maxMessage = $("input[id='txtAirCarNumberPassenger']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger");
        $("input[id='txtAirCarNumberPassenger']", $(tabwidget)).attr("data-bvalidator-msg-validateMaxPassenger", maxMessage.replace('{0}', $MaxPassengerSearch));
        $("input[id='txtAirCarNumberPassenger']", $(tabwidget)).attr("data-bvalidator", "validateMaxPassenger[" + tabwidget + ":AirCar:" + $MaxPassengerSearch + "], validateQuantityInfants[" + tabwidget + ":AirCar]");

        // Hide elements
        if (!$PromoCodeAllowed) {
            $("div[id='divAirCarTogglePromoCode']", $(tabwidget)).hide();
        } else {
            $("input[id='txtAirCarPromoCode']", $(tabwidget)).click(function () {
                this.setSelectionRange(0, this.value.length);
            });
        }
        if (!$AirFlexDateEnabled) {
            $("div[id='divAirCarFlexDates']", $(tabwidget)).hide();
            $("div[id='divAirCarBaggageIncluded']", $(tabwidget)).removeClass('col-sm-6 col-md-6 col-lg-6');
            $("div[id='divAirCarBaggageIncluded']", $(tabwidget)).addClass('col-sm-12 col-md-12 col-lg-12');
        }

        // Load Airlines

        var arrPreferredAirline = $("input[id='hdAirCarPreferredAirlines']", $(tabwidget)).val().split(',');
        var preferedAirlines = external_file_Airlines.sort().filter(function (airline) {
            return (arrPreferredAirline.indexOf(airline.substring(airline.indexOf("("), airline.indexOf(")") + 1)) >= 0);
        });

        var normalAirlines = external_file_Airlines.sort().filter(function (airline) {
            return (arrPreferredAirline.indexOf(airline.substring(airline.indexOf("("), airline.indexOf(")") + 1)) < 0);
        });

        if (preferedAirlines.length > 0) {
            convertArrayToArrayCodeName(preferedAirlines, 'AutoComplete').forEach(function (item) {
                $("select[id='ddlAirCarAirline']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name.toLowerCase() + " (" + item.Code + ")"
                }));
            });

            $("select[id='ddlAirCarAirline']", $(tabwidget)).append('<option data-divider="true"></option>');
        }
        convertArrayToArrayCodeName(normalAirlines, 'AutoComplete').forEach(function (item) {
            $("select[id='ddlAirCarAirline']", $(tabwidget)).append($('<option>', {
                value: item.Code,
                text: item.Name.toLowerCase() + " (" + item.Code + ")"
            }));
        });

        if (preferedAirlines.length > 0) {
            $("select[id='ddlAirCarAirline']", $(tabwidget)).selectpicker();
            $("select[id='ddlAirCarAirline']", $(tabwidget)).selectpicker('setStyle', 'form-control special-options-input selectpicker', 'add');
        }

        // Change Attributes
        if ($("div[id='divAirCarAccountCode']", $(tabwidget)).length > 0) {
            $("div[id='divAirCarDepartureTime']", $(tabwidget)).removeClass("fix-padding-left");
            $("div[id='divAirCarDepartureTime']", $(tabwidget)).addClass("fix-padding-right");
            $("div[id='divAirCarReturnTime']", $(tabwidget)).removeClass("fix-padding-right");
            $("div[id='divAirCarReturnTime']", $(tabwidget)).addClass("fix-padding-left");
        }

        // Load Cities
        var airCitiesFrom = filterListCode($ListCodes, 'AirCarProduct', 'Departure');
        var airCitiesTo = filterListCode($ListCodes, 'AirCarProduct', 'Arrival');

        // Init Autocomplete
        $("input[id='txtAirCarCityFrom']", $(tabwidget)).netautocomplete('init', {
            type: "AirportsCities",
            showExcluded: false
        });

        $("input[id='txtAirCarCityTo']", $(tabwidget)).netautocomplete('init', {
            type: "AirportsCities",
            showExcluded: false
        });

        // Load Cities From
        if (airCitiesFrom.length > 0) {

            convertArrayToArrayCodeName(airCitiesFrom, 'ListCodes').forEach(function (item) {

                $("select[id='ddlAirCarCityFrom']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name
                }));
            });
            $("div[id='divAirCarCityFromControlMobile']", $(tabwidget)).hide();
            $("select[id='ddlAirCarCityFrom']", $(tabwidget)).show();
            $("select[id='ddlAirCarCityFrom']", $(tabwidget)).change(function () {
                setTimeout(function () {
                    if (airCitiesTo.length > 0) {
                        $("select[id='ddlAirCarCityTo']", $(tabwidget)).focus();
                    } else {
                        $("input[id='txtAirCarCityTo']", $(tabwidget)).focus();
                        $("div[id='divAirCarCityToControlMobile']", $(tabwidget)).trigger("click");
                    }
                }, 10);
            });
        } else {

            var airGeo = filterList($GeoLocationProducts, 'AirCarProduct');
            if (airGeo.length > 0 && airGeo[0].Enabled) {
                setGeolocationCity('txtAirCarCityFrom', tabwidget);
            }

            $("input[id='txtAirCarCityFrom']", $(tabwidget)).show();
        }

        // Load Cities To
        if (airCitiesTo.length > 0) {
            convertArrayToArrayCodeName(airCitiesTo, 'ListCodes').forEach(function (item) {

                $("select[id='ddlAirCarCityTo']", $(tabwidget)).append($('<option>', {
                    value: item.Code,
                    text: item.Name
                }));
            });
            $("div[id='divAirCarCityToControlMobile']", $(tabwidget)).hide();
            $("select[id='ddlAirCarCityTo']", $(tabwidget)).show();
        } else {
            $("input[id='txtAirCarCityTo']", $(tabwidget)).show();
        }

        // Clean elements
        cleanElements($("div[id='aircar'] input", $(tabwidget)));
        $("input[id='txtAirCarNumberPassenger']", $(tabwidget)).val("1");
        $("input[id='hdnAirCarPassengers']", $(tabwidget)).val(JSON.stringify($jsonPax));

        // Init Autocomplete
        initAirAutocomplete(tabwidget, airCitiesTo.length);
        $("input[id*='txtAirCarCity']", $(tabwidget)).click(function () {
            this.setSelectionRange(0, this.value.length);
        });

        // Init Datepickers
        var airSalesRestRuleFrom = valSalesRestRules('AirCarProduct', 'from');
        $("input[id*='txtAirCarDateFrom']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: $AirAdvancedPurchaseDays,
            maxDate: 355,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {

                if (this.id == "txtAirCarDateFrom")
                    return getPaintedDates(date, airSalesRestRuleFrom, $("input[id='txtAirCarDateFrom']", $(tabwidget)), $("input[id='txtAirCarDateTo']", $(tabwidget)));

                return [true];
            },
            onChangeMonthYear: function () {
                var txtId = this.id;

                setTimeout(function () {
                    addHeaderDatePick(tabwidget, txtId, getResource("DateDeparture"));
                }, 5);
            }
        });
        var airSalesRestRuleTo = valSalesRestRules('AirCarProduct', 'to');
        $("input[id='txtAirCarDateTo']", $(tabwidget)).datepicker({
            showOn: "none",
            minDate: 0,
            maxDate: 355,
            numberOfMonths: [1, 2],
            beforeShowDay: function (date) {

                if (this.id == "txtAirCarDateTo")
                    return getPaintedDates(date, airSalesRestRuleTo, $("input[id='txtAirCarDateFrom']", $(tabwidget)), $("input[id='txtAirCarDateTo']", $(tabwidget)));

                return [true];
            },
            onChangeMonthYear: function () {
                setTimeout(function () {
                    addHeaderDatePick(tabwidget, 'txtAirCarDateTo', getResource("DateArrival"));
                }, 5);
            }
        });
        $("input[id='txtAirCarDateFrom']", $(tabwidget)).change(function () {
            $("input[id='txtAirCarDateTo']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txtAirCarDateFrom']", $(tabwidget)).datepicker('getDate'));

        });


        // Button Search On Click
        $("input[id='btnSearchAirCar']", $(tabwidget)).click(function (e) {

            if (!$(tabwidget).data('bValidator').validate()) {
                e.preventDefault();
            } else {
                if (!$IsLinkGenerator) {
                    $("div[id='divPreload']", $(tabwidget)).show();
                }

                var url = $UrlDomainNS + "/" + $CurrentCulture + "/AirCar";
                var cityFrom = ($("select[id='ddlAirCarCityFrom']", $(tabwidget)).is(':visible')) ? $("select[id='ddlAirCarCityFrom']", $(tabwidget)).val() : getIATACode($("input[id='txtAirCarCityFrom']", $(tabwidget)).val());
                var cityTo = ($("select[id='ddlAirCarCityTo']", $(tabwidget)).is(':visible')) ? $("select[id='ddlAirCarCityTo']", $(tabwidget)).val() : getIATACode($("input[id='txtAirCarCityTo']", $(tabwidget)).val());
                var dateFrom = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirCarDateFrom']").datepicker("getDate"));
                var dateTo = $.datepicker.formatDate("yy-mm-dd", $("input[id='txtAirCarDateTo']").datepicker("getDate"));
                var pax = JSON.parse($("input[id='hdnAirCarPassengers']", $(tabwidget)).val());
                var flexDates = ($("input[id='chkdivAirCarFlexDates']", $(tabwidget)).is(':visible') && $("input[id='chkdivAirCarFlexDates']", $(tabwidget)).prop('checked')) ? "3" : "NA";
                var airline = ($("select[id='ddlAirCarAirline']", $(tabwidget)).val() != "") ? $("select[id='ddlAirCarAirline']", $(tabwidget)).val() : "NA";
                var accountCode = ($("input[id='txtAirCarAccountCode']", $(tabwidget)).is(':visible') && $("input[id='txtAirCarAccountCode']", $(tabwidget)).val() != "") ? $("input[id='txtAirAccountCode']", $(tabwidget)).val() : "NA";
                var typeCabin = ($("select[id='ddlAirCarTypeCabin']", $(tabwidget)).val() != "") ? $("select[id='ddlAirCarTypeCabin']", $(tabwidget)).val() : "NA";
                var timeFrom = ($("select[id='ddlAirCarDepartureTime']", $(tabwidget)).val() != "") ? $("select[id='ddlAirCarDepartureTime']", $(tabwidget)).val() : "NA";
                var timeTo = ($("select[id='ddlAirCarReturnTime']", $(tabwidget)).val() != "") ? $("select[id='ddlAirCarReturnTime']", $(tabwidget)).val() : "NA";
                var baggageIncluded = ($("input[id='chkAirCarBaggageIncluded']", $(tabwidget)).is(':visible') && $("input[id='chkAirCarBaggageIncluded']", $(tabwidget)).prop('checked')) ? "true" : "false";
                var directFlight = ($("input[id='chkAirCarDirectFlight']", $(tabwidget)).is(':visible') && $("input[id='chkAirCarDirectFlight']", $(tabwidget)).prop('checked')) ? "true" : "false";
                var promoCode = $("input[id='txtAirCarPromoCode']", $(tabwidget)).val();

                url += "/" + cityFrom;
                url += "/" + cityTo
                url += "/" + dateFrom;
                url += "/" + dateTo;
                url += "/" + pax.Adults;
                url += "/" + pax.Childs;
                url += "/" + pax.Infants;
                url += "/" + flexDates;
                url += "/" + airline;
                url += "/" + accountCode;
                url += "/" + typeCabin;

                if (timeFrom != "NA" && timeTo != "NA") {
                    url += "/" + timeFrom + "," + timeTo;
                } else if (timeFrom != "NA" && timeTo == "NA") {
                    url += "/" + timeFrom + ",NA";
                } else if (timeFrom == "NA" && timeTo != "NA") {
                    url += "/NA," + timeTo;
                } else {
                    url += "/NA";
                }

                url += "/" + baggageIncluded;
                url += "/" + directFlight;
                url += "/" + $UserService + "-show-" + $BranchCode;

                if ($IsLinkGenerator) {

                    $.iGrowl({
                        type: "info",
                        title: "Search Query String",
                        message: url,
                        icon: 'vicons-search',
                        placement: {
                            x: 'center',
                            y: 'top'
                        },
                        delay: 0
                    });
                } else {

                    // Other Request Settings
                    url += "-" + $SalesChannel + "-" + $ClientId + "-" + $BusinessUnit + "--" + $SessionTokenSSO + "----" + promoCode;
                    $('#Form').attr('action', url);
                    $('#Form').submit();
                    //location.href = url;
                }
            }
        });
    }
}

function removeSelectOptionsByFilter($jQuerySelect, filterCallback) {
    $("option", $jQuerySelect).each(function () {
        if (filterCallback(this)) {
            $(this).remove();
        }
    });
}


function GetCircuitWidget() {
    var tabwidget = $ModuleId;

    if ($("#CircuitProduct_Regions", $(tabwidget)).val() != "")
        return;

    $("div[id$='divCircuitFilter']", $(tabwidget)).css("display", "none");
    $("div[id$='divCircuitError']", $(tabwidget)).css("display", "none");
    $("div[id$='divCircuitLoading']", $(tabwidget)).css("display", "block");
    // Muestro dialog

    var data = { Url: $("#CircuitProduct_Url", $(tabwidget)).val(), Token: $("#CircuitProduct_Token", $(tabwidget)).val(), Resource: "regions" };


    var ajaxRegions = $.ajax({
        type: "POST",
        url: "/DesktopModules/NetacticaServices/API/SearchFormService/GetCircuitWidget",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        async: true,
    });
    data["Resource"] = "countries";
    var ajaxCountries = $.ajax({
        type: "POST",
        url: "/DesktopModules/NetacticaServices/API/SearchFormService/GetCircuitWidget",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        async: true,
    });
    data["Resource"] = "cities"
    var ajaxCities = $.ajax({
        type: "POST",
        url: "/DesktopModules/NetacticaServices/API/SearchFormService/GetCircuitWidget",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        async: true,
    });

    $.when(ajaxRegions, ajaxCountries, ajaxCities).done(function (data1, data2, data3) {
        try {
            debugger;

            $("#CircuitProduct_Regions", $(tabwidget)).val(JSON.stringify(JSON.parse(data1[0])["data"]));
            $("#CircuitProduct_Countries", $(tabwidget)).val(JSON.stringify(JSON.parse(data2[0])["data"]));
            $("#CircuitProduct_Cities", $(tabwidget)).val(data3[0]);

            initCircuitProduct(tabwidget);
            
        } catch {
            $("div[id$='divCircuitError']", $(tabwidget)).css("display", "block");
        }
        $("div[id$='divCircuitLoading']", $(tabwidget)).css("display", "none");
        $("div[id$='divCircuitFilter']", $(tabwidget)).css("display", "block");
        

    }).fail(function () {
        $("div[id$='divCircuitError']", $(tabwidget)).css("display", "block");
        $("div[id$='divCircuitLoading']", $(tabwidget)).css("display", "none");
    });
}

function initCircuitProduct(tabwidget) {

    if ($("div[id='circuit']", $(tabwidget)).length > 0) {

        // Load Regions
        var $ddlCircuitRegion = $("select[id='ddlCircuitRegion']", $(tabwidget));
        removeSelectOptionsByFilter($ddlCircuitRegion, function (opt) {
            return opt.value;
        });

        var arrayRegions = eval($("#CircuitProduct_Regions", $(tabwidget)).val());
        sortArrayByKey(arrayRegions, 'sort').forEach(function (item) {
            $ddlCircuitRegion.append($('<option>', {
                value: item.id,
                text: item.name
            }).attr('data-region', item.id));
        });

        // Load Countries
        var $ddlCircuitCountries = $("select[id='ddlCircuitCountries']", $(tabwidget));
        var arrayCountries = eval($("#CircuitProduct_Countries", $(tabwidget)).val());
        sortArrayByKey(arrayCountries, 'name').forEach(function (item) {
            $ddlCircuitCountries.append($('<option>', {
                value: item.id,
                text: item.name
            }));
        });

        // Load Cities
        var $ddlCircuitCities = $("select[id='ddlCircuitCities']", $(tabwidget));
        var arrayCities = eval($("#CircuitProduct_Cities", $(tabwidget)).val());
        sortArrayByKey(arrayCities, 'name').forEach(function (item) {
            if (item.name != "") {
                $ddlCircuitCities.append($('<option>', {
                    value: item.id,
                    text: item.name
                }));
            }
        });

        // Load Duration
        var circuitDuration,
            $ddlCircuitDuration = $("select[id='ddlCircuitDuration']", $(tabwidget)),
            a = 0,
            b = 0;

        removeSelectOptionsByFilter($ddlCircuitDuration, function (opt) {
            return opt.value;
        });

        for (var i = 1; i <= 4; i++) {
            a = (i == 1) ? i : a + 5;
            b = a + 4;
            circuitDuration = getResource("CircuitDuration").replace("{0}", a.toString()).replace("{1}", b.toString());

            $ddlCircuitDuration.append($('<option>', {
                value: a.toString() + "-" + b.toString(),
                text: circuitDuration
            }));
        }

        $ddlCircuitDuration.append($('<option>', {
            value: "20-100",
            text: getResource("CircuitDurationMore")
        }));

        // Init Select 2
        $(".circuit-container .select2-single").select2({ allowClear: true, width: "100%", dropdownAutoWidth: true });
        $(".circuit-container .select2-multi").select2({
            dropdownAutoWidth: true,
            width: "100%",
            'margin-left': '30px'
        });

        // Change methods
        $("select[id='ddlCircuitRegion']", $(tabwidget)).change(function () {
            populateCircuitCountries(tabwidget);
            setTimeout(function () {
                if ($("select[id='ddlCircuitRegion']", $(tabwidget)).val() != "")
                    $("select[id='ddlCircuitCountries']", $(tabwidget)).select2('open');
                else
                    populateCircuitCities();
            }, 10);
        });

        $("select[id='ddlCircuitCountries']", $(tabwidget)).change(function () {
            populateCircuitCities(tabwidget);
        });

        // Button Search On Click
        $("input[id='btnSearchCircuit']", $(tabwidget)).click(function (e) {

            if (!$(tabwidget).data('bValidator').validate()) {
                e.preventDefault();
            } else {
                if (!$IsLinkGenerator) {
                    $("div[id='divPreload']", $(tabwidget)).show();
                }

                var url = $("input[id='CircuitProduct_Url']", $(tabwidget)).val();
                var token = $("input[id='CircuitProduct_Token']", $(tabwidget)).val();
                var region = $("select[id='ddlCircuitRegion']", $(tabwidget)).val();
                var countries = $("select[id='ddlCircuitCountries']", $(tabwidget)).find(':selected');
                var cities = $("select[id='ddlCircuitCities']", $(tabwidget)).find(':selected');
                var starCity = $("select[id='ddlCircuitStartCity']", $(tabwidget)).val();
                var duration = $("select[id='ddlCircuitDuration']", $(tabwidget)).val();
                var programName = $("input[id='txtCircuitProgramName']", $(tabwidget)).val();
                var departureMonth = $("select[id='ddlCircuitMonth']", $(tabwidget)).val();

                var initialParams = {
                    UserService: $UserService,
                    SessionToken: $SessionTokenSSO,
                    ContextApp: "CMS",
                    PaymentRequired: true,
                    ReservationCreated: true,
                    Culture: $CurrentCulture,
                    Url: $UrlDomainNS.slice(-1) === "/" ? $UrlDomainNS.substring(0, $UrlDomainNS.length - 1) : $UrlDomainNS
                };

                if ($BranchCode != "")
                    initialParams.BranchCode = $BranchCode;

                if (url.slice(-1) != "/")
                    url += "/";

                url += "circuitos?region=" + region;

                if (countries.length > 0) {
                    countries.each(function (index, item) {
                        url += "&countries[]=" + item.value;
                    });
                }

                if (cities.length > 0) {
                    cities.each(function (index, item) {
                        url += "&cities[]=" + item.value;
                    });
                }

                url += "&start_city=" + starCity;
                url += "&duration=" + duration;

                if (programName != "")
                    url += "&name=" + programName;

                if (departureMonth != "") {
                    var d = new Date();
                    var monthNow = d.getMonth() + 1;
                    var yearNow = d.getFullYear();
                    var ideparture = parseInt(departureMonth);
                    var sdeparture = "";
                    if (ideparture < monthNow) {
                        yearNow++;
                        sdeparture = yearNow.toString() + "-" + departureMonth.toString();
                    } else {
                        sdeparture = yearNow.toString() + "-" + departureMonth.toString();
                    }

                    url += "&departureMonth=" + sdeparture;
                }

                if (token != "")
                    url += "&token=" + token;

                if (initialParams != "")
                    url += "&initial_params=" + encodeURI(JSON.stringify(initialParams));

                if ($IsLinkGenerator) {

                    $.iGrowl({
                        type: "info",
                        title: "Search Query String",
                        message: url,
                        icon: 'vicons-search',
                        placement: {
                            x: 'center',
                            y: 'top'
                        },
                        delay: 0
                    });

                } else {

                    location.href = url;

                }
            }
        });
    }
}

function GetCruiseWidget() {
    debugger;
    var tabwidget = $ModuleId;

    if ($("#CruiseProduct_Url", $(tabwidget)).val() != "")
        return;

    $("div[id$='divCruiseFilter']", $(tabwidget)).css("display", "none");
    $("div[id$='divCruiseError']", $(tabwidget)).css("display", "none");
    
    // Muestro dialog

    var myData = { UrlDomainNS: $UrlDomainNS, SessionTokenNS: $("#CruiseProduct_SessionToken", $(tabwidget)).val(), BranchCode: $BranchCode };

    setTimeout(function () {
        $.ajax({
            url: "/DesktopModules/NetacticaServices/API/SearchFormService/GetCruiseWidget/istcruise",
            data: JSON.stringify(myData),
            contentType: 'application/json',
            type: 'POST',
            async: false,
            success: function (data, textStatus, xhr) {
                debugger;
                if (data != "") {
                    var obj = JSON.parse(data);

                    $("#CruiseProduct_Destinations", $(tabwidget)).val(JSON.stringify(obj.DestinationGroups.DestinationGroup));
                    $("#CruiseProduct_CruiseLines", $(tabwidget)).val(JSON.stringify(obj.CruiseLines.CruiseLine));
                    $("#CruiseProduct_DeparturePorts", $(tabwidget)).val(JSON.stringify(obj.DeparturePorts.DeparturePort));
                    $("#CruiseProduct_Durations", $(tabwidget)).val(JSON.stringify(obj.Durations.Duration));
                    $("#CruiseProduct_Sailings", $(tabwidget)).val(JSON.stringify(obj.Sailings.Sailing));
                    $("#CruiseProduct_AutoLoginEncrypt", $(tabwidget)).val(JSON.stringify(obj.AutoLoginEncrypt));
                    $("#CruiseProduct_CredentialId", $(tabwidget)).val(JSON.stringify(obj.CredentialId));
                    $("#CruiseProduct_Url", $(tabwidget)).val(JSON.stringify(obj.CruiseBrowserIstNetAdminUrl));

                    //Inicializo los controles para Cruceros
                    initCruiseProduct(tabwidget);


                    $("div[id$='divCruiseLoading']", $(tabwidget)).css("display", "none");
                    $("div[id$='divCruiseFilter']", $(tabwidget)).css("display", "block");
                } else {

                    $("div[id$='divCruiseLoading']", $(tabwidget)).css("display", "none");
                    $("div[id$='divCruiseError']", $(tabwidget)).css("display", "block");
                }
            },
            error: function (msg) {

                $("div[id$='divCruiseLoading']", $(tabwidget)).css("display", "none");
                $("div[id$='divCruiseError']", $(tabwidget)).css("display", "block");
            }
        });
    }, 600);

}

function initCruiseProduct(tabwidget) {

    if ($("div[id='cruise']", $(tabwidget)).length > 0) {

        // Load Destinations
        var ddlCruiseDestination = $("select[id='ddlCruiseDestination']", $(tabwidget));
        $arrayDestination = eval($("#CruiseProduct_Destinations", $(tabwidget)).val());
        loadCruiseDestination(ddlCruiseDestination);

        // Load Departure Ports
        var ddlCruiseDeparturePort = $("select[id='ddlCruiseDeparturePort']", $(tabwidget));
        var arrayTmpDeparturePorts = eval($("#CruiseProduct_DeparturePorts", $(tabwidget)).val());
        $arrayDeparturePorts = sortArrayByKey(arrayTmpDeparturePorts, 'Name');
        loadCruiseDeparturePort(ddlCruiseDeparturePort);

        // Load Departure Months
        var ddlCruiseDepartureMonth = $("select[id='ddlCruiseDepartureMonth']", $(tabwidget));
        $arraySailings = eval($("#CruiseProduct_Sailings", $(tabwidget)).val());
        $arrayDepartureMonths = Enumerable.from($arraySailings)
                                    .groupBy(function (e) { return e.DepartureMonth; },
                                        null,
                                        function (DepartureMonth, g) { return { 'DepartureMonth': DepartureMonth } }).toArray();
        loadCruiseDepartureMonth(ddlCruiseDepartureMonth);
        
        // Load Duration
        var ddlCruiseDuration = $("select[id='ddlCruiseDuration']", $(tabwidget));
        $arrayDurations = eval($("#CruiseProduct_Durations", $(tabwidget)).val());
        loadCruiseDuration(ddlCruiseDuration);
        
        // Load Cruise Lines
        var ddlCruiseLine = $("select[id='ddlCruiseLine']", $(tabwidget));
        var arrayTmpCruiseLines = eval($("#CruiseProduct_CruiseLines", $(tabwidget)).val());
        $arrayCruiseLines = sortArrayByKey(arrayTmpCruiseLines, 'Name');
        loadCruiseLine(ddlCruiseLine);

        // Load Cruise Ships
        var ddlCruiseShip = $("select[id='ddlCruiseShip']", $(tabwidget));
        $arrayCruiseShips = sortArrayByKey($arrayTmpCruiseShips, 'Name');
        loadCruiseShip(ddlCruiseShip);
                
        // Change methods
        $arraySailingsFilter = [];
        ddlCruiseDestination.change(function () {
            
            var destinationCode = $(this).val();
            if (destinationCode != null && destinationCode != "") {
                
                if ($arraySailingsFilter.length == 0)
                    $arraySailingsFilter = $arraySailings

                var filterSailings = $.grep($arraySailingsFilter, function (e) {
                    return e.DestinationCode == destinationCode;
                });
                
                if (filterSailings.length > 0) {

                    $arraySailingsFilter = filterSailings;

                    if (ddlCruiseDeparturePort.val() == null || ddlCruiseDeparturePort.val() == "") {
                        var filterDeparturePort = Enumerable.from(filterSailings).groupBy(function (e) { return e.DeparturePort; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDeparturePort(ddlCruiseDeparturePort, filterDeparturePort);
                    }

                    if (ddlCruiseDepartureMonth.val() == null || ddlCruiseDepartureMonth.val() == "") {
                        var filterDepartureMonth = Enumerable.from(filterSailings).groupBy(function (e) { return e.DepartureMonth; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDepartureMonth(ddlCruiseDepartureMonth, filterDepartureMonth);
                    }

                    if (ddlCruiseDuration.val() == null || ddlCruiseDuration.val() == "") {
                        var filterDuration = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLenght; }, null,
                            function (code, g) { return { Code: code, Days: parseInt(code) } }).toArray();
                        loadCruiseDuration(ddlCruiseDuration, sortArrayByKey(filterDuration, "Days"));
                    }

                    if (ddlCruiseLine.val() == null || ddlCruiseLine.val() == "" ||
                        (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length == 0)) {
                        var filterCruiseLine = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLineCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseLine(ddlCruiseLine, filterCruiseLine);
                    }

                    if (ddlCruiseShip.val() == null || ddlCruiseShip.val() == "") {
                        var filterCruiseShip = Enumerable.from(filterSailings).groupBy(function (e) { return e.ShipCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseShip(ddlCruiseShip, filterCruiseShip);
                    }
                }
            }
        });

        ddlCruiseDeparturePort.change(function () {
            
            var departurePort = $(this).val();
            if (departurePort != null && departurePort != "") {
                
                if ($arraySailingsFilter.length == 0)
                    $arraySailingsFilter = $arraySailings

                var filterSailings = $.grep($arraySailingsFilter, function (e) {
                    return e.DeparturePort == departurePort;
                });

                if (filterSailings.length > 0) {

                    $arraySailingsFilter = filterSailings;

                    if (ddlCruiseDestination.val() == null || ddlCruiseDestination.val() == "") {
                        var filterDestination = Enumerable.from(filterSailings).groupBy(function (e) { return e.DestinationCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDestination(ddlCruiseDestination, filterDestination);
                    }

                    if (ddlCruiseDepartureMonth.val() == null || ddlCruiseDepartureMonth.val() == "") {
                        var filterDepartureMonth = Enumerable.from(filterSailings).groupBy(function (e) { return e.DepartureMonth; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDepartureMonth(ddlCruiseDepartureMonth, filterDepartureMonth);
                    }

                    if (ddlCruiseDuration.val() == null || ddlCruiseDuration.val() == "") {
                        var filterDuration = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLenght; }, null,
                            function (code, g) { return { Code: code, Days: parseInt(code) } }).toArray();
                        loadCruiseDuration(ddlCruiseDuration, sortArrayByKey(filterDuration, "Days"));
                    }

                    if (ddlCruiseLine.val() == null || ddlCruiseLine.val() == "" ||
                        (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length == 0)) {
                        var filterCruiseLine = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLineCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseLine(ddlCruiseLine, filterCruiseLine);
                    }

                    if (ddlCruiseShip.val() == null || ddlCruiseShip.val() == "") {
                        var filterCruiseShip = Enumerable.from(filterSailings).groupBy(function (e) { return e.ShipCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseShip(ddlCruiseShip, filterCruiseShip);
                    }
                }
            }

        });

        ddlCruiseDepartureMonth.change(function () {

            var departureMonth = $(this).val();
            if (departureMonth != null && departureMonth != "") {

                if ($arraySailingsFilter.length == 0)
                    $arraySailingsFilter = $arraySailings

                var filterSailings = $.grep($arraySailingsFilter, function (e) {
                    return e.DepartureMonth == departureMonth;
                });

                if (filterSailings.length > 0) {

                    $arraySailingsFilter = filterSailings;

                    if (ddlCruiseDestination.val() == null || ddlCruiseDestination.val() == "") {
                        var filterDestination = Enumerable.from(filterSailings).groupBy(function (e) { return e.DestinationCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDestination(ddlCruiseDestination, filterDestination);
                    }

                    if (ddlCruiseDeparturePort.val() == null || ddlCruiseDeparturePort.val() == "") {
                        var filterDeparturePort = Enumerable.from(filterSailings).groupBy(function (e) { return e.DeparturePort; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDeparturePort(ddlCruiseDeparturePort, filterDeparturePort);
                    }

                    if (ddlCruiseDuration.val() == null || ddlCruiseDuration.val() == "") {
                        var filterDuration = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLenght; }, null,
                            function (code, g) { return { Code: code, Days: parseInt(code) } }).toArray();
                        loadCruiseDuration(ddlCruiseDuration, sortArrayByKey(filterDuration, "Days"));
                    }

                    if (ddlCruiseLine.val() == null || ddlCruiseLine.val() == "" ||
                        (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length == 0)) {
                        var filterCruiseLine = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLineCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseLine(ddlCruiseLine, filterCruiseLine);
                    }

                    if (ddlCruiseShip.val() == null || ddlCruiseShip.val() == "") {
                        var filterCruiseShip = Enumerable.from(filterSailings).groupBy(function (e) { return e.ShipCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseShip(ddlCruiseShip, filterCruiseShip);
                    }
                }
            }

        });

        ddlCruiseDuration.change(function () {
            
            var duration = $(this).val();
            if (duration != null && duration != "") {
                if ($arraySailingsFilter.length == 0)
                    $arraySailingsFilter = $arraySailings

                var durationMin = $arrayDurations.find(e => e.Code.replace('\\', '') == duration.replace('\\', '')).MinDays;
                var durationMax = $arrayDurations.find(e => e.Code.replace('\\', '') == duration.replace('\\', '')).MaxDays;
                var filterSailings = $.grep($arraySailingsFilter, function (e) {
                    return parseInt(e.CruiseLenght) >= durationMin && parseInt(e.CruiseLenght) <= durationMax;
                });

                if (filterSailings.length > 0) {

                    $arraySailingsFilter = filterSailings;

                    if (ddlCruiseDestination.val() == null || ddlCruiseDestination.val() == "") {
                        var filterDestination = Enumerable.from(filterSailings).groupBy(function (e) { return e.DestinationCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDestination(ddlCruiseDestination, filterDestination);
                    }

                    if (ddlCruiseDeparturePort.val() == null || ddlCruiseDeparturePort.val() == "") {
                        var filterDeparturePort = Enumerable.from(filterSailings).groupBy(function (e) { return e.DeparturePort; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDeparturePort(ddlCruiseDeparturePort, filterDeparturePort);
                    }

                    if (ddlCruiseDepartureMonth.val() == null || ddlCruiseDepartureMonth.val() == "") {
                        var filterDepartureMonth = Enumerable.from(filterSailings).groupBy(function (e) { return e.DepartureMonth; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDepartureMonth(ddlCruiseDepartureMonth, filterDepartureMonth);
                    }

                    if (ddlCruiseLine.val() == null || ddlCruiseLine.val() == "" ||
                        (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length == 0)) {
                        var filterCruiseLine = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLineCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseLine(ddlCruiseLine, filterCruiseLine);
                    }

                    if (ddlCruiseShip.val() == null || ddlCruiseShip.val() == "") {
                        var filterCruiseShip = Enumerable.from(filterSailings).groupBy(function (e) { return e.ShipCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseShip(ddlCruiseShip, filterCruiseShip);
                    }
                }
            }

        });

        ddlCruiseLine.change(function () {
            
            var cruiseLineCode = $(this).val();
            if (cruiseLineCode != null && cruiseLineCode.length > 0) {

                var filterSailings = [];
                if ($arraySailingsFilter.length == 0) {
                    $arraySailingsFilter = $arraySailings
                } else {

                    if (ddlCruiseDestination.val() != null && ddlCruiseDestination.val() != "")
                        filterSailings = $.grep($arraySailings, function (e) {
                            return e.DestinationCode == ddlCruiseDestination.val();
                        });

                    if (ddlCruiseDeparturePort.val() != null && ddlCruiseDeparturePort.val() != "")
                        filterSailings = $.grep(filterSailings, function (e) {
                            return e.DestinationCode == ddlCruiseDestination.val();
                        });

                    if (ddlCruiseDepartureMonth.val() != null && ddlCruiseDepartureMonth.val() != "")
                        filterSailings = $.grep(filterSailings, function (e) {
                            return e.DepartureMonth == ddlCruiseDepartureMonth.val();
                        });

                    if (ddlCruiseDuration.val() != null && ddlCruiseDuration.val() != "") {
                        var durationMin = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MinDays;
                        var durationMax = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MaxDays;
                        filterSailings = $.grep(filterSailings, function (e) {
                            return parseInt(e.CruiseLenght) >= durationMin && parseInt(e.CruiseLenght) <= durationMax;
                        });
                    }
                }
                
                var filterSailingsTmp = [];
                cruiseLineCode.forEach(function (item) {
                    var filterSailingsItems = (filterSailings.length > 0) ? $.grep(filterSailings, function (f) { return f.CruiseLineCode == item; }) :
                        $.grep($arraySailings, function (f) { return f.CruiseLineCode == item; });
                    filterSailingsTmp = filterSailingsTmp.concat(filterSailingsItems);
                });
                filterSailings = filterSailingsTmp;

                if (filterSailings.length > 0) {

                    $arraySailingsFilter = filterSailings;

                    if (ddlCruiseDestination.val() == null || ddlCruiseDestination.val() == "") {
                        var filterDestination = Enumerable.from(filterSailings).groupBy(function (e) { return e.DestinationCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDestination(ddlCruiseDestination, filterDestination);
                    }

                    if (ddlCruiseDepartureMonth.val() == null || ddlCruiseDepartureMonth.val() == "") {
                        var filterDepartureMonth = Enumerable.from(filterSailings).groupBy(function (e) { return e.DepartureMonth; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDepartureMonth(ddlCruiseDepartureMonth, filterDepartureMonth);
                    }

                    if (ddlCruiseDeparturePort.val() == null || ddlCruiseDeparturePort.val() == "") {
                        var filterDeparturePort = Enumerable.from(filterSailings).groupBy(function (e) { return e.DeparturePort; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDeparturePort(ddlCruiseDeparturePort, filterDeparturePort);
                    }

                    if (ddlCruiseDuration.val() == null || ddlCruiseDuration.val() == "") {
                        var filterDuration = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLenght; }, null,
                            function (code, g) { return { Code: code, Days: parseInt(code) } }).toArray();
                        loadCruiseDuration(ddlCruiseDuration, sortArrayByKey(filterDuration, "Days"));
                    }

                    if (ddlCruiseShip.val() == null || ddlCruiseShip.val() == "") {
                        var filterCruiseShip = Enumerable.from(filterSailings).groupBy(function (e) { return e.ShipCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseShip(ddlCruiseShip, filterCruiseShip);
                    }
                }
            } else {
                ddlCruiseLine.trigger("select2:clear");
            }

        });

        ddlCruiseShip.change(function () {

            var shipCode = $(this).val();
            if (shipCode != null && shipCode != "") {

                if ($arraySailingsFilter.length == 0)
                    $arraySailingsFilter = $arraySailings

                var filterSailings = $.grep($arraySailingsFilter, function (e) {
                    return e.ShipCode == shipCode;
                });

                if (filterSailings.length > 0) {

                    $arraySailingsFilter = filterSailings;

                    if (ddlCruiseDestination.val() == null || ddlCruiseDestination.val() == "") {
                        var filterDestination = Enumerable.from(filterSailings).groupBy(function (e) { return e.DestinationCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDestination(ddlCruiseDestination, filterDestination);
                    }

                    if (ddlCruiseDeparturePort.val() == null || ddlCruiseDeparturePort.val() == "") {
                        var filterDeparturePort = Enumerable.from(filterSailings).groupBy(function (e) { return e.DeparturePort; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDeparturePort(ddlCruiseDeparturePort, filterDeparturePort);
                    }

                    if (ddlCruiseDepartureMonth.val() == null || ddlCruiseDepartureMonth.val() == "") {
                        var filterDepartureMonth = Enumerable.from(filterSailings).groupBy(function (e) { return e.DepartureMonth; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseDepartureMonth(ddlCruiseDepartureMonth, filterDepartureMonth);
                    }

                    if (ddlCruiseDuration.val() == null || ddlCruiseDuration.val() == "") {
                        var filterDuration = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLenght; }, null,
                            function (code, g) { return { Code: code, Days: parseInt(code) } }).toArray();
                        loadCruiseDuration(ddlCruiseDuration, sortArrayByKey(filterDuration, "Days"));
                    }

                    if (ddlCruiseLine.val() == null || ddlCruiseLine.val() == "" ||
                        (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length == 0)) {
                        var filterCruiseLine = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLineCode; }, null,
                            function (Code, g) { return { Code } }).toArray();
                        loadCruiseLine(ddlCruiseLine, filterCruiseLine);
                    }
                }
            }

        });

        // Clear events
        ddlCruiseDestination.on('select2:clear', function (e) {
            
            $arraySailingsFilter = [];
            var filterSailings = $arraySailings;

            if (ddlCruiseDeparturePort.val() != null && ddlCruiseDeparturePort.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.DeparturePort == ddlCruiseDeparturePort.val();
                });

            if (ddlCruiseDepartureMonth.val() != null && ddlCruiseDepartureMonth.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.DepartureMonth == ddlCruiseDepartureMonth.val();
                });

            if (ddlCruiseDuration.val() != null && ddlCruiseDuration.val() != "") {
                var durationMin = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MinDays;
                var durationMax = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MaxDays;
                filterSailings = $.grep(filterSailings, function (e) {
                    return parseInt(e.CruiseLenght) >= durationMin && parseInt(e.CruiseLenght) <= durationMax;
                });
            }

            if (ddlCruiseShip.val() != null && ddlCruiseShip.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.ShipCode == ddlCruiseShip.val();
                });

            if (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length > 0) {
                var filterSailingsTmp = [];
                ddlCruiseLine.val().forEach(function (item) {
                    if (item != null && item != "") {
                        var filterSailingsItems = $.grep(filterSailings, function (f) {
                            return f.CruiseLineCode == item;
                        });
                    }
                    filterSailingsTmp = filterSailingsTmp.concat(filterSailingsItems);
                });
                filterSailings = filterSailingsTmp;
            }

            $arraySailingsFilter = filterSailings;

            if ($arraySailingsFilter.length == $arraySailings.length) {
                $arraySailingsFilter = [];
                loadCruiseDeparturePort(ddlCruiseDeparturePort);
                loadCruiseDepartureMonth(ddlCruiseDepartureMonth);
                loadCruiseDuration(ddlCruiseDuration);
                loadCruiseLine(ddlCruiseLine);
                loadCruiseShip(ddlCruiseShip);
            } else {
                if (ddlCruiseDeparturePort.val() == null || ddlCruiseDeparturePort.val() == "") {
                    var filterDeparturePort = Enumerable.from(filterSailings).groupBy(function (e) { return e.DeparturePort; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDeparturePort(ddlCruiseDeparturePort, filterDeparturePort);
                }

                if (ddlCruiseDepartureMonth.val() == null || ddlCruiseDepartureMonth.val() == "") {
                    var filterDepartureMonth = Enumerable.from(filterSailings).groupBy(function (e) { return e.DepartureMonth; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDepartureMonth(ddlCruiseDepartureMonth, filterDepartureMonth);
                }

                if (ddlCruiseDuration.val() == null || ddlCruiseDuration.val() == "") {
                    var filterDuration = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLenght; }, null,
                        function (code, g) { return { Code: code, Days: parseInt(code) } }).toArray();
                    loadCruiseDuration(ddlCruiseDuration, sortArrayByKey(filterDuration, "Days"));
                }

                if (ddlCruiseLine.val() == null || ddlCruiseLine.val() == "" ||
                    (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length == 0)) {
                    var filterCruiseLine = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLineCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseLine(ddlCruiseLine, filterCruiseLine);
                }

                if (ddlCruiseShip.val() == null || ddlCruiseShip.val() == "") {
                    var filterCruiseShip = Enumerable.from(filterSailings).groupBy(function (e) { return e.ShipCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseShip(ddlCruiseShip, filterCruiseShip);
                }
            }
        });

        ddlCruiseDeparturePort.on('select2:clear', function (e) {
            
            $arraySailingsFilter = [];
            var filterSailings = $arraySailings;

            if (ddlCruiseDestination.val() != null && ddlCruiseDestination.val() != "")
                var filterSailings = $.grep(filterSailings, function (e) {
                    return e.DestinationCode == ddlCruiseDestination.val();
                });

            if (ddlCruiseDepartureMonth.val() != null && ddlCruiseDepartureMonth.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.DepartureMonth == ddlCruiseDepartureMonth.val();
                });

            if (ddlCruiseDuration.val() != null && ddlCruiseDuration.val() != "") {
                var durationMin = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MinDays;
                var durationMax = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MaxDays;
                filterSailings = $.grep(filterSailings, function (e) {
                    return parseInt(e.CruiseLenght) >= durationMin && parseInt(e.CruiseLenght) <= durationMax;
                });
            }

            if (ddlCruiseShip.val() != null && ddlCruiseShip.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.ShipCode == ddlCruiseShip.val();
                });

            if (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length > 0) {
                var filterSailingsTmp = [];
                ddlCruiseLine.val().forEach(function (item) {
                    if (item != null && item != "") {
                        var filterSailingsItems = $.grep(filterSailings, function (f) {
                            return f.CruiseLineCode == item;
                        });
                    }
                    filterSailingsTmp = filterSailingsTmp.concat(filterSailingsItems);
                });
                filterSailings = filterSailingsTmp;
            }

            $arraySailingsFilter = filterSailings;

            if ($arraySailingsFilter.length == $arraySailings.length) {
                $arraySailingsFilter = [];
                loadCruiseDestination(ddlCruiseDestination);
                loadCruiseDepartureMonth(ddlCruiseDepartureMonth);
                loadCruiseDuration(ddlCruiseDuration);
                loadCruiseLine(ddlCruiseLine);
                loadCruiseShip(ddlCruiseShip);
            } else {
                if (ddlCruiseDestination.val() == null || ddlCruiseDestination.val() == "") {
                    var filterDestination = Enumerable.from(filterSailings).groupBy(function (e) { return e.DestinationCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDestination(ddlCruiseDestination, filterDestination);
                }

                if (ddlCruiseDepartureMonth.val() == null || ddlCruiseDepartureMonth.val() == "") {
                    var filterDepartureMonth = Enumerable.from(filterSailings).groupBy(function (e) { return e.DepartureMonth; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDepartureMonth(ddlCruiseDepartureMonth, filterDepartureMonth);
                }

                if (ddlCruiseDuration.val() == null || ddlCruiseDuration.val() == "") {
                    var filterDuration = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLenght; }, null,
                        function (code, g) { return { Code: code, Days: parseInt(code) } }).toArray();
                    loadCruiseDuration(ddlCruiseDuration, sortArrayByKey(filterDuration, "Days"));
                }

                if (ddlCruiseLine.val() == null || ddlCruiseLine.val() == "" ||
                    (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length == 0)) {
                    var filterCruiseLine = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLineCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseLine(ddlCruiseLine, filterCruiseLine);
                }

                if (ddlCruiseShip.val() == null || ddlCruiseShip.val() == "") {
                    var filterCruiseShip = Enumerable.from(filterSailings).groupBy(function (e) { return e.ShipCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseShip(ddlCruiseShip, filterCruiseShip);
                }
            }
        });

        ddlCruiseDepartureMonth.on('select2:clear', function (e) {
            
            $arraySailingsFilter = [];
            var filterSailings = $arraySailings;

            if (ddlCruiseDestination.val() != null && ddlCruiseDestination.val() != "")
                var filterSailings = $.grep(filterSailings, function (e) {
                    return e.DestinationCode == ddlCruiseDestination.val();
                });

            if (ddlCruiseDeparturePort.val() != null && ddlCruiseDeparturePort.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.DeparturePort == ddlCruiseDeparturePort.val();
                });

            if (ddlCruiseDuration.val() != null && ddlCruiseDuration.val() != "") {
                var durationMin = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MinDays;
                var durationMax = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MaxDays;
                filterSailings = $.grep(filterSailings, function (e) {
                    return parseInt(e.CruiseLenght) >= durationMin && parseInt(e.CruiseLenght) <= durationMax;
                });
            }

            if (ddlCruiseShip.val() != null && ddlCruiseShip.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.ShipCode == ddlCruiseShip.val();
                });

            if (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length > 0) {
                var filterSailingsTmp = [];
                ddlCruiseLine.val().forEach(function (item) {
                    if (item != null && item != "") {
                        var filterSailingsItems = $.grep(filterSailings, function (f) {
                            return f.CruiseLineCode == item;
                        });
                    }
                    filterSailingsTmp = filterSailingsTmp.concat(filterSailingsItems);
                });
                filterSailings = filterSailingsTmp;
            }

            $arraySailingsFilter = filterSailings;

            if ($arraySailingsFilter.length == $arraySailings.length) {
                $arraySailingsFilter = [];
                loadCruiseDestination(ddlCruiseDestination);
                loadCruiseDeparturePort(ddlCruiseDeparturePort);
                loadCruiseDuration(ddlCruiseDuration);
                loadCruiseLine(ddlCruiseLine);
                loadCruiseShip(ddlCruiseShip);
            } else {
                if (ddlCruiseDestination.val() == null || ddlCruiseDestination.val() == "") {
                    var filterDestination = Enumerable.from(filterSailings).groupBy(function (e) { return e.DestinationCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDestination(ddlCruiseDestination, filterDestination);
                }

                if (ddlCruiseDeparturePort.val() == null || ddlCruiseDeparturePort.val() == "") {
                    var filterDeparturePort = Enumerable.from(filterSailings).groupBy(function (e) { return e.DeparturePort; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDeparturePort(ddlCruiseDeparturePort, filterDeparturePort);
                }

                if (ddlCruiseDuration.val() == null || ddlCruiseDuration.val() == "") {
                    var filterDuration = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLenght; }, null,
                        function (code, g) { return { Code: code, Days: parseInt(code) } }).toArray();
                    loadCruiseDuration(ddlCruiseDuration, sortArrayByKey(filterDuration, "Days"));
                }

                if (ddlCruiseLine.val() == null || ddlCruiseLine.val() == "" ||
                    (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length == 0)) {
                    var filterCruiseLine = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLineCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseLine(ddlCruiseLine, filterCruiseLine);
                }

                if (ddlCruiseShip.val() == null || ddlCruiseShip.val() == "") {
                    var filterCruiseShip = Enumerable.from(filterSailings).groupBy(function (e) { return e.ShipCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseShip(ddlCruiseShip, filterCruiseShip);
                }
            }
        });

        ddlCruiseDuration.on('select2:clear', function (e) {
            
            $arraySailingsFilter = [];
            var filterSailings = $arraySailings;

            if (ddlCruiseDestination.val() != null && ddlCruiseDestination.val() != "")
                var filterSailings = $.grep(filterSailings, function (e) {
                    return e.DestinationCode == ddlCruiseDestination.val();
                });

            if (ddlCruiseDepartureMonth.val() != null && ddlCruiseDepartureMonth.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.DepartureMonth == ddlCruiseDepartureMonth.val();
                });

            if (ddlCruiseDeparturePort.val() != null && ddlCruiseDeparturePort.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.DeparturePort == ddlCruiseDeparturePort.val();
                });

            if (ddlCruiseShip.val() != null && ddlCruiseShip.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.ShipCode == ddlCruiseShip.val();
                });

            if (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length > 0) {
                var filterSailingsTmp = [];
                ddlCruiseLine.val().forEach(function (item) {
                    if (item != null && item != "") {
                        var filterSailingsItems = $.grep(filterSailings, function (f) {
                            return f.CruiseLineCode == item;
                        });
                    }
                    filterSailingsTmp = filterSailingsTmp.concat(filterSailingsItems);
                });
                filterSailings = filterSailingsTmp;
            }

            $arraySailingsFilter = filterSailings;

            if ($arraySailingsFilter.length == $arraySailings.length) {
                $arraySailingsFilter = [];
                loadCruiseDestination(ddlCruiseDestination);
                loadCruiseDeparturePort(ddlCruiseDeparturePort);
                loadCruiseDepartureMonth(ddlCruiseDepartureMonth);
                loadCruiseLine(ddlCruiseLine);
                loadCruiseShip(ddlCruiseShip);
            } else {
                if (ddlCruiseDestination.val() == null || ddlCruiseDestination.val() == "") {
                    var filterDestination = Enumerable.from(filterSailings).groupBy(function (e) { return e.DestinationCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDestination(ddlCruiseDestination, filterDestination);
                }

                if (ddlCruiseDeparturePort.val() == null || ddlCruiseDeparturePort.val() == "") {
                    var filterDeparturePort = Enumerable.from(filterSailings).groupBy(function (e) { return e.DeparturePort; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDeparturePort(ddlCruiseDeparturePort, filterDeparturePort);
                }

                if (ddlCruiseDepartureMonth.val() == null || ddlCruiseDepartureMonth.val() == "") {
                    var filterDepartureMonth = Enumerable.from(filterSailings).groupBy(function (e) { return e.DepartureMonth; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDepartureMonth(ddlCruiseDepartureMonth, filterDepartureMonth);
                }

                if (ddlCruiseLine.val() == null || ddlCruiseLine.val() == "" ||
                    (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length == 0)) {
                    var filterCruiseLine = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLineCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseLine(ddlCruiseLine, filterCruiseLine);
                }

                if (ddlCruiseShip.val() == null || ddlCruiseShip.val() == "") {
                    var filterCruiseShip = Enumerable.from(filterSailings).groupBy(function (e) { return e.ShipCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseShip(ddlCruiseShip, filterCruiseShip);
                }
            }
        });

        ddlCruiseLine.on('select2:clear', function (e) {
            
            $arraySailingsFilter = [];
            var filterSailings = $arraySailings;

            if (ddlCruiseDestination.val() != null && ddlCruiseDestination.val() != "")
                var filterSailings = $.grep(filterSailings, function (e) {
                    return e.DestinationCode == ddlCruiseDestination.val();
                });

            if (ddlCruiseDepartureMonth.val() != null && ddlCruiseDepartureMonth.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.DepartureMonth == ddlCruiseDepartureMonth.val();
                });

            if (ddlCruiseDeparturePort.val() != null && ddlCruiseDeparturePort.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.DeparturePort == ddlCruiseDeparturePort.val();
                });

            if (ddlCruiseDuration.val() != null && ddlCruiseDuration.val() != "") {
                var durationMin = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MinDays;
                var durationMax = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MaxDays;
                filterSailings = $.grep(filterSailings, function (e) {
                    return parseInt(e.CruiseLenght) >= durationMin && parseInt(e.CruiseLenght) <= durationMax;
                });
            }

            if (ddlCruiseShip.val() != null && ddlCruiseShip.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.ShipCode == ddlCruiseShip.val();
                });

            $arraySailingsFilter = filterSailings;

            if ($arraySailingsFilter.length == $arraySailings.length) {
                $arraySailingsFilter = [];
                loadCruiseDestination(ddlCruiseDestination);
                loadCruiseDeparturePort(ddlCruiseDeparturePort);
                loadCruiseDepartureMonth(ddlCruiseDepartureMonth);
                loadCruiseDuration(ddlCruiseDuration);
                loadCruiseShip(ddlCruiseShip);
            } else {
                if (ddlCruiseDestination.val() == null || ddlCruiseDestination.val() == "") {
                    var filterDestination = Enumerable.from(filterSailings).groupBy(function (e) { return e.DestinationCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDestination(ddlCruiseDestination, filterDestination);
                }

                if (ddlCruiseDepartureMonth.val() == null || ddlCruiseDepartureMonth.val() == "") {
                    var filterDepartureMonth = Enumerable.from(filterSailings).groupBy(function (e) { return e.DepartureMonth; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDepartureMonth(ddlCruiseDepartureMonth, filterDepartureMonth);
                }

                if (ddlCruiseDeparturePort.val() == null || ddlCruiseDeparturePort.val() == "") {
                    var filterDeparturePort = Enumerable.from(filterSailings).groupBy(function (e) { return e.DeparturePort; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDeparturePort(ddlCruiseDeparturePort, filterDeparturePort);
                }

                if (ddlCruiseDuration.val() == null || ddlCruiseDuration.val() == "") {
                    var filterDuration = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLenght; }, null,
                        function (code, g) { return { Code: code, Days: parseInt(code) } }).toArray();
                    loadCruiseDuration(ddlCruiseDuration, sortArrayByKey(filterDuration, "Days"));
                }

                if (ddlCruiseShip.val() == null || ddlCruiseShip.val() == "") {
                    var filterCruiseShip = Enumerable.from(filterSailings).groupBy(function (e) { return e.ShipCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseShip(ddlCruiseShip, filterCruiseShip);
                }
            }
        });

        ddlCruiseShip.on('select2:clear', function (e) {
            
            $arraySailingsFilter = [];
            var filterSailings = $arraySailings;

            if (ddlCruiseDestination.val() != null && ddlCruiseDestination.val() != "")
                var filterSailings = $.grep(filterSailings, function (e) {
                    return e.DestinationCode == ddlCruiseDestination.val();
                });

            if (ddlCruiseDepartureMonth.val() != null && ddlCruiseDepartureMonth.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.DepartureMonth == ddlCruiseDepartureMonth.val();
                });

            if (ddlCruiseDeparturePort.val() != null && ddlCruiseDeparturePort.val() != "")
                filterSailings = $.grep(filterSailings, function (e) {
                    return e.DeparturePort == ddlCruiseDeparturePort.val();
                });

            if (ddlCruiseDuration.val() != null && ddlCruiseDuration.val() != "") {
                var durationMin = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MinDays;
                var durationMax = $arrayDurations.find(e => e.Code.replace('\\', '') == ddlCruiseDuration.val().replace('\\', '')).MaxDays;
                filterSailings = $.grep(filterSailings, function (e) {
                    return parseInt(e.CruiseLenght) >= durationMin && parseInt(e.CruiseLenght) <= durationMax;
                });
            }

            if (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length > 0) {
                var filterSailingsTmp = [];
                ddlCruiseLine.val().forEach(function (item) {
                    if (item != null && item != "") {
                        var filterSailingsItems = $.grep(filterSailings, function (f) {
                            return f.CruiseLineCode == item;
                        });
                    }
                    filterSailingsTmp = filterSailingsTmp.concat(filterSailingsItems);
                });
                filterSailings = filterSailingsTmp;
            }

            $arraySailingsFilter = filterSailings;

            if ($arraySailingsFilter.length == $arraySailings.length) {
                $arraySailingsFilter = [];
                loadCruiseDestination(ddlCruiseDestination);
                loadCruiseDeparturePort(ddlCruiseDeparturePort);
                loadCruiseDepartureMonth(ddlCruiseDepartureMonth);
                loadCruiseDuration(ddlCruiseDuration);
                loadCruiseLine(ddlCruiseLine);
            } else {
                if (ddlCruiseDestination.val() == null || ddlCruiseDestination.val() == "") {
                    var filterDestination = Enumerable.from(filterSailings).groupBy(function (e) { return e.DestinationCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDestination(ddlCruiseDestination, filterDestination);
                }

                if (ddlCruiseDeparturePort.val() == null || ddlCruiseDeparturePort.val() == "") {
                    var filterDeparturePort = Enumerable.from(filterSailings).groupBy(function (e) { return e.DeparturePort; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDeparturePort(ddlCruiseDeparturePort, filterDeparturePort);
                }

                if (ddlCruiseDepartureMonth.val() == null || ddlCruiseDepartureMonth.val() == "") {
                    var filterDepartureMonth = Enumerable.from(filterSailings).groupBy(function (e) { return e.DepartureMonth; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseDepartureMonth(ddlCruiseDepartureMonth, filterDepartureMonth);
                }

                if (ddlCruiseDuration.val() == null || ddlCruiseDuration.val() == "") {
                    var filterDuration = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLenght; }, null,
                        function (code, g) { return { Code: code, Days: parseInt(code) } }).toArray();
                    loadCruiseDuration(ddlCruiseDuration, sortArrayByKey(filterDuration, "Days"));
                }

                if (ddlCruiseLine.val() == null || ddlCruiseLine.val() == "" ||
                    (ddlCruiseLine.val() != null && ddlCruiseLine.val() != "" && ddlCruiseLine.val().length == 0)) {
                    var filterCruiseLine = Enumerable.from(filterSailings).groupBy(function (e) { return e.CruiseLineCode; }, null,
                        function (Code, g) { return { Code } }).toArray();
                    loadCruiseLine(ddlCruiseLine, filterCruiseLine);
                }
            }
        });

        // Button Search On Click
        $("input[id='btnSearchCruise']", $(tabwidget)).click(function (e) {
            
            if (!$(tabwidget).data('bValidator').validate()) {
                e.preventDefault();
            } else {
                if (!$IsLinkGenerator) {
                    $("div[id='divPreload']", $(tabwidget)).show();
                }

                var url = $("input[id='CruiseProduct_Url']", $(tabwidget)).val();
                var sessionToken = $("input[id='CruiseProduct_SessionToken']", $(tabwidget)).val();
                var credentialId = $("input[id='CruiseProduct_CredentialId']", $(tabwidget)).val();
                var destination = $("select[id='ddlCruiseDestination']", $(tabwidget)).val();
                var port = $("select[id='ddlCruiseDeparturePort']", $(tabwidget)).val();
                var month = $("select[id='ddlCruiseDepartureMonth']", $(tabwidget)).val();
                var duration = $("select[id='ddlCruiseDuration']", $(tabwidget)).val();
                var company = $("select[id='ddlCruiseLine']", $(tabwidget)).val();
                var ship = $("select[id='ddlCruiseShip']", $(tabwidget)).val();

                var CustomParam = {
                    SessionToken: sessionToken,
                    CredentialId: credentialId,
                    ContextApp: "CMS",
                    Culture: $CurrentCulture
                };

                if ($BranchCode != "") {
                    CustomParam.BranchCode = $BranchCode;
                }

                url += "?UsrPassEncrypt=" + $("input[id='CruiseProduct_AutoLoginEncrypt']", $(tabwidget)).val();

                if (destination != null && destination != "")
                    url += "&destination=" + destination;

                if (port != null && port != "")
                    url += "&port=" + port;

                if (month != null && month != "") {
                    url += "&dateIni=" + $arraySailingsFilter[0].DepartureInitialDate + "&dateFin=" + $arraySailingsFilter[0].DepartureFinalDate;
                }

                if (duration != null && duration != "") {
                    url += "&duration=" + duration;
                }
                
                if (company.length > 0) {
                    url += "&company=";

                    if (company.length == 1) {
                        url += company[0];
                    } else {
                        company.forEach(function (c) { url += "|" + c; });
                    }
                }

                if (ship != null && ship != "")
                    url += "&ship=" + Enumerable.from($arrayCruiseShips).first("$.Code == '" + ship + "'").SearchCode;

                if (CustomParam != "")
                    url += "&cbCustomParam=" + encodeURIComponent(JSON.stringify(CustomParam)).replace(/'/g, "%27").replace(/"/g, "%22");

                if ($IsLinkGenerator) {

                    $.iGrowl({
                        type: "info",
                        title: "Search Query String",
                        message: url,
                        icon: 'vicons-search',
                        placement: {
                            x: 'center',
                            y: 'top'
                        },
                        delay: 0
                    });

                } else {

                    location.href = url;

                }
            }
        });
    }
}

function loadCruiseDestination(ddlCruiseDestination, arrFilter) {
    
    ddlCruiseDestination.empty();
    var arrayTemp = $arrayDestination;

    if (arrFilter != undefined) {
        var arrayFilterGroup = [];

        arrFilter.forEach(function (f) {
            $arrayDestination.forEach(function (group) {
                var item = $.grep(group.Destinations.Destination, function (e) { return e.Code == f.Code; });
                if (item.length > 0) {
                    var groupTmpExist = $.grep(arrayFilterGroup, function (e) { return e.Code == group.Code; });

                    if (groupTmpExist.length > 0) {
                        // existe, solo se agrega el destination
                        groupTmpExist[0].Destinations.Destination.push(item[0]);
                    } else {
                        var groupTmp = { Code: group.Code, Name: group.Name, Order: group.Order, Destinations: { Destination: [] }};

                        groupTmp.Destinations.Destination.push(item[0]);
                        arrayFilterGroup.push(groupTmp);
                    }
                }
            });
        });

        // sort destination
        arrayFilterGroup.forEach(function (f) {
            f.Destinations.Destination = sortArrayByKey(f.Destinations.Destination, 'OrderIndex');
        });

        arrayTemp = arrayFilterGroup;
    }

    arrayTemp.forEach(function (group) {
        ddlCruiseDestination.append($('<optgroup>', {
            label: group.Name
        }));

        group.Destinations.Destination.forEach(function (dest) {
            ddlCruiseDestination.find('optgroup').last().append($('<option>', {
                value: dest.Code,
                text: dest.Name
            }));
        });
    });

    // Init Select 2
    ddlCruiseDestination.select2({ allowClear: true, width: "100%", dropdownAutoWidth: true });
    ddlCruiseDestination.val(null).trigger('change');

}

function loadCruiseDeparturePort(ddlCruiseDeparturePort, arrFilter) {
    
    ddlCruiseDeparturePort.empty();
    var arrayTemp = $arrayDeparturePorts;

    if (arrFilter != undefined)
        arrayTemp = sortArrayByKey(filterArrayByArray($arrayDeparturePorts, arrFilter), 'Name');
    
    arrayTemp.forEach(function (item) {
        ddlCruiseDeparturePort.append($('<option>', {
            value: item.Code,
            text: item.Name
        }));
    });

    // Init Select 2
    ddlCruiseDeparturePort.select2({ allowClear: true, width: "100%", dropdownAutoWidth: true });
    ddlCruiseDeparturePort.val(null).trigger('change');

}

function loadCruiseDepartureMonth(ddlCruiseDepartureMonth, arrFilter) {
    
    ddlCruiseDepartureMonth.empty();
    var arrayTemp = $arrayDepartureMonths;


    if (arrFilter != undefined) {
        var arrFilterTemp = [];
        arrFilter.forEach(function (f) {
            var item = $.grep($arrayDepartureMonths, function (e) { return e.DepartureMonth == f.Code; });
            arrFilterTemp.push(item[0]);
        });

        arrayTemp = arrFilterTemp;
    }

    arrayTemp.forEach(function (item) {
        ddlCruiseDepartureMonth.append($('<option>', {
            value: item.DepartureMonth,
            text: item.DepartureMonth
        }));
    });

    // Init Select 2
    ddlCruiseDepartureMonth.select2({ allowClear: true, width: "100%", dropdownAutoWidth: true });
    ddlCruiseDepartureMonth.val(null).trigger('change');

}

function loadCruiseDuration(ddlCruiseDuration, arrFilter) {
    
    ddlCruiseDuration.empty();
    var arrayTemp = $arrayDurations;

    if (arrFilter != undefined) {
        var arrFilterTemp = [];

        $arrayDurations.forEach(function (d) {
            for (var i = 0; i < arrFilter.length; i++) {
                var item = $.grep(arrFilterTemp, function (e) { return e.Code == d.Code; });

                if (parseInt(arrFilter[i].Days) >= d.MinDays && parseInt(arrFilter[i].Days) <= d.MaxDays && item.length == 0) {
                    arrFilterTemp.push(d);
                    break;
                }
            }
        });

        arrayTemp = arrFilterTemp;
    }

    arrayTemp.forEach(function (item) {
        ddlCruiseDuration.append($('<option>', {
            value: item.Code,
            text: item.Code.replace('\\&gt;', '>')
        }));
    });

    // Init Select 2
    ddlCruiseDuration.select2({ allowClear: true, width: "100%", dropdownAutoWidth: true });
    ddlCruiseDuration.val(null).trigger('change');
    
}

function loadCruiseLine(ddlCruiseLine, arrFilter) {
    
    ddlCruiseLine.empty();
    $arrayTmpCruiseShips = [];
    var arrayTemp = $arrayCruiseLines;

    if (arrFilter != undefined)
        arrayTemp = sortArrayByKey(filterArrayByArray($arrayCruiseLines, arrFilter), 'Name');

    arrayTemp.forEach(function (item) {
        ddlCruiseLine.append($('<option>', {
            value: item.Code,
            text: item.Name
        }));

        item.Ships.Ship.forEach(function (ship) { $arrayTmpCruiseShips.push(ship); });
    });

    // Init Select 2
    ddlCruiseLine.select2({  dropdownAutoWidth: true,  width: "100%", 'margin-left': '30px' });

}

function loadCruiseShip(ddlCruiseShip, arrFilter) {
    
    ddlCruiseShip.empty();
    var arrayTemp = $arrayCruiseShips;

    if (arrFilter != undefined)
        arrayTemp = sortArrayByKey(filterArrayByArray($arrayCruiseShips, arrFilter), 'Name');

    arrayTemp.forEach(function (item) {
        ddlCruiseShip.append($('<option>', {
            value: item.Code,
            text: item.Name
        }));
    });

    // Init Select 2
    ddlCruiseShip.select2({ allowClear: true, width: "100%", dropdownAutoWidth: true });
    ddlCruiseShip.val(null).trigger('change');
    
}

function initPopups(tabwidget) {

    var lenMaxAgeChild = ($HotelsMaxAgeChild != 0) ? $HotelsMaxAgeChild : 17;
    for (var i = 0; i < lenMaxAgeChild + 1; i++) {
        console.log(lenMaxAgeChild);
        
        $("div[id='divPaxRoomPopup'] select").append("<option value=\"" + i.toString() + "\">" + i.toString() + "</option>");
    }

    $("div.input-mobile-control", $(tabwidget)).click(function () {
        var inputId = $(this).attr("data-input-id");
        if($StaticContentEnable && inputId=='txtHotelCity'){
            $("#txtMobileAutocompleteSc",$(tabwidget)).show();
            setTimeout(() => {
                $("#txtMobileAutocompleteSc",$(tabwidget)).focus();
            }, 200);
            $("#txtMobileAutocomplete",$(tabwidget)).hide();
        }
        else{
            $("#txtMobileAutocompleteSc",$(tabwidget)).hide();
            $("#txtMobileAutocomplete",$(tabwidget)).show();
        }

        var labelText = $("input[id='" + inputId + "']", $(tabwidget)).prev().prev().text();

        if ($(this).attr("data-label") != undefined)
            labelText = $(this).attr("data-label");

        var $txtMobileAutocomplete = $("input[id='txtMobileAutocomplete']", $(tabwidget));

        $("label[id='lblMobileAutocomplete']", $(tabwidget)).text(labelText);
        $txtMobileAutocomplete.attr("data-id", inputId);

        var placeHolderMobileAutocompleteText,
            translations = undefined;
        switch ($(this).attr("data-input-type")) {
            case "Cities":
                placeHolderMobileAutocompleteText = getResource("EnterCity");
                break;

            case "Neighborhood":
                placeHolderMobileAutocompleteText = getResource("EnterNeighborhood");
                translations = [getResource("AirportText"), getResource("CityText"), getResource("ZoneText")];
                break;

            default:
                placeHolderMobileAutocompleteText = getResource("EnterAirport");
                break;
        }

        if (translations) {
            $txtMobileAutocomplete.attr("translations", JSON.stringify(translations));
        }

        $txtMobileAutocomplete.attr("placeholder", placeHolderMobileAutocompleteText);
        $txtMobileAutocomplete.netautocomplete('init', {
            type: $(this).attr("data-input-type"),
            onSelect: function () {

                if ($txtMobileAutocomplete.val() != "") {

                    inputId = $txtMobileAutocomplete.attr("data-id");

                    $("input[id='" + inputId + "']", $(tabwidget)).val($txtMobileAutocomplete.val());
                    $txtMobileAutocomplete.val("");
                    $("div[id='divAutoCompleteMobileContainer']", $(tabwidget)).hide();

                    if ($("body").hasClass("no-scroll")) {
                        $("body").removeClass("no-scroll");
                    }

                    var yPos = parseFloat($("input[id='yPos']", $(tabwidget)).val());
                    $('html, body').scrollTop(yPos - 50.00);

                    $txtMobileAutocomplete.autocomplete("destroy");
                    $(window).unbind('.netautocomplete');

                    setMobileFocus(tabwidget, inputId);

                }
            },
            showExcluded: false
        });

        $("#labelTitle").text($(this).attr("data-input-label"));

        if (!$("body").hasClass("no-scroll")) {
            $("body").addClass("no-scroll");
        }

        $("input[id='yPos']", $(tabwidget)).val($("input[id='" + inputId + "']", $(tabwidget)).offset().top);
        $("input[id='" + inputId + "']", $(tabwidget)).blur();
        $('html, body').scrollTop(0);

        $("div[id='divAutoCompleteMobileContainer']", $(tabwidget)).show();
        $txtMobileAutocomplete.focus();

    });

    $("a[class='aMobileAutocompleteCancel']", $(tabwidget)).click(function () {
        var $txtMobileAutocomplete = $("input[id='txtMobileAutocomplete']", $(tabwidget));
        if ($("body").hasClass("no-scroll")) {
            $("body").removeClass("no-scroll");
        }

        var yPos = parseFloat($("input[id='yPos']", $(tabwidget)).val());
        $('html, body').scrollTop(yPos - 50.00);

        $("div[id='divAutoCompleteMobileContainer']", $(tabwidget)).hide();
        $txtMobileAutocomplete.val("");
        $txtMobileAutocomplete.autocomplete("destroy");
        $(window).unbind('.netautocomplete');

    });

    $("div[id='divPaxRoomPopup'] .pax-number-block span[data-type='adt']").each(function () {
        $(this)[0].innerText = $(this)[0].innerText.replace("{0}", (lenMaxAgeChild + 1).toString());
    });

    $("div[id='divPaxRoomPopup'] .pax-number-block span[data-type='chd']").each(function () {
        $(this)[0].innerText = $(this)[0].innerText.replace("{0}", lenMaxAgeChild.toString());
    });

    $('.btn-number').click(function (e) {

        e.preventDefault();

        fieldName = $(this).attr('data-field');
        type = $(this).attr('data-type');
        input = $("input[id='" + fieldName + "']");
        currentVal = parseInt(input.val());

        if (!isNaN(currentVal)) {
            if (type == 'minus') {

                if (currentVal > input.attr('min')) {
                    input.val(currentVal - 1).change();
                }
                if (parseInt(input.val()) == input.attr('min')) {
                    $(this).attr('disabled', true);
                }

            } else if (type == 'plus') {

                if (currentVal < input.attr('max')) {
                    input.val(currentVal + 1).change();
                }
                if (parseInt(input.val()) == input.attr('max')) {
                    $(this).attr('disabled', true);
                }

            }
        } else {
            input.val(0);
        }
    });

    $('.input-number').focusin(function () {
        $(this).data('oldValue', $(this).val());
    });

    $('.input-number').change(function () {

        prod = $("div[id='" + $(this).parents()[5].id + "']").attr('data-prod');
        roomId = "";
        if (prod == undefined) {
            prod = $("div[id='" + $(this).parents()[8].id + "']").attr('data-prod');
            roomId = $("div[id='" + $(this).parents()[4].id + "']").attr('data-roomid');
        }

        minValue = parseInt($(this).attr('min'));
        maxValue = parseInt($(this).attr('max'));
        valueCurrent = parseInt($(this).val());
        name = $(this).attr('name');
        id = $(this).attr('id');

        if (valueCurrent >= minValue) {
            $(".btn-number[data-type='minus'][data-field='" + id + "']").removeAttr('disabled')
        } else {
            $(this).val($(this).data('oldValue'));
        }

        if (valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='" + id + "']").removeAttr('disabled')
        } else {
            $(this).val($(this).data('oldValue'));
        }

        setTotalPaxPopup(tabwidget, prod, roomId, name, valueCurrent);
    });

    $("div[id='divPaxRoomPopup'] a[id='addRoomPaxRoomPopup']", $(tabwidget)).click(function () {

        prod = $("div[id='divPaxRoomPopup']").attr('data-prod');
        pax = JSON.parse($("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val());
        roomIdHide = parseInt($("div[id='divPaxRoomPopup']").attr('data-qty-rooms'));
        roomIdShow = roomIdHide + 1;
        tmpPaxRoom = JSON.parse(JSON.stringify($jsonPaxRoom));
        tmpPaxRoom.Room = roomIdShow.toString();
        pax.push(tmpPaxRoom)

        $("input[id='txt" + prod + "NumberRooms']", $(tabwidget)).val(roomIdShow.toString());
        $("input[id='txt" + prod + "NumberPassenger']", $(tabwidget)).val(getQtyPaxByArray(pax));
        $("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val(JSON.stringify(pax));

        $("div[id='divPaxRoomPopup']").attr('data-qty-rooms', roomIdShow.toString());

        if ($("div[id='divPaxRoomPopup'] div[id='room" + roomIdHide.toString() + "'] a[id='delRoom" + roomIdHide.toString() + "PaxRoomPopup']").length > 0) {
            $("div[id='divPaxRoomPopup'] div[id='room" + roomIdHide.toString() + "'] a[id='delRoom" + roomIdHide.toString() + "PaxRoomPopup']").hide();
        }

        if ($("div[id='divPaxRoomPopup'] div[id='room" + roomIdShow.toString() + "'] a[id='delRoom" + roomIdShow.toString() + "PaxRoomPopup']").length > 0) {
            $("div[id='divPaxRoomPopup'] div[id='room" + roomIdShow.toString() + "'] a[id='delRoom" + roomIdShow.toString() + "PaxRoomPopup']").show();
        }

        if (roomIdShow == 4) {
            $("a[id='addRoomPaxRoomPopup']").hide();
        }

        $("div[id='divPaxRoomPopup'] div[id='room" + roomIdShow.toString() + "'] input[id='paxRoom" + roomIdShow.toString() + "AdtQuantity']").val("1");
        $("div[id='divPaxRoomPopup'] div[id='room" + roomIdShow.toString() + "'] input[id='paxRoom" + roomIdShow.toString() + "ChdQuantity']").val("0");
        $("div[id='divPaxRoomPopup'] div[id='room" + roomIdShow.toString() + "'] div[id*='Age']").hide();
        $("div[id='divPaxRoomPopup'] div[id='room" + roomIdShow.toString() + "']").show();

        $("div[id='divPaxRoomPopup'] div[class='pop-up-content']").animate({ scrollTop: $("div[id='divPaxRoomPopup'] div[id='divPaxRoomControl']").innerHeight() }, 400);
    });

    $("div[id='divPaxRoomPopup'] a[id='delRoom2PaxRoomPopup']", $(tabwidget)).click(function () {
        prod = $("div[id='divPaxRoomPopup']").attr('data-prod');
        pax = JSON.parse($("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val());
        pax.pop();

        $("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val(JSON.stringify(pax));
        $("input[id='txt" + prod + "NumberRooms']", $(tabwidget)).val("1");
        $("input[id='txt" + prod + "NumberPassenger']", $(tabwidget)).val(getQtyPaxByArray(pax));

        $("div[id='divPaxRoomPopup']").attr('data-qty-rooms', "1");
        $("div[id='divPaxRoomPopup'] div[id='room2']").hide();
    });

    $("div[id='divPaxRoomPopup'] a[id='delRoom3PaxRoomPopup']", $(tabwidget)).click(function () {
        prod = $("div[id='divPaxRoomPopup']").attr('data-prod');
        pax = JSON.parse($("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val());
        pax.pop();

        $("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val(JSON.stringify(pax));
        $("input[id='txt" + prod + "NumberRooms']", $(tabwidget)).val("2");
        $("input[id='txt" + prod + "NumberPassenger']", $(tabwidget)).val(getQtyPaxByArray(pax));

        $("div[id='divPaxRoomPopup']").attr('data-qty-rooms', "2");
        $("div[id='divPaxRoomPopup'] div[id='room3']").hide();
        $("a[id='delRoom2PaxRoomPopup']").show();
    });

    $("div[id='divPaxRoomPopup'] a[id='delRoom4PaxRoomPopup']", $(tabwidget)).click(function () {
        prod = $("div[id='divPaxRoomPopup']").attr('data-prod');
        pax = JSON.parse($("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val());
        pax.pop();

        $("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val(JSON.stringify(pax));
        $("input[id='txt" + prod + "NumberRooms']", $(tabwidget)).val("3");
        $("input[id='txt" + prod + "NumberPassenger']", $(tabwidget)).val(getQtyPaxByArray(pax));

        $("div[id='divPaxRoomPopup']").attr('data-qty-rooms', "3");
        $("div[id='divPaxRoomPopup'] div[id='room4']").hide();
        $("a[id='delRoom3PaxRoomPopup']").show();
        $("a[id='addRoomPaxRoomPopup']").show();
    });

    $("div[id='divPaxRoomPopup'] select[id*='ddlRoom']", $(tabwidget)).change(function () {

        prod = $("div[id='divPaxRoomPopup']").attr('data-prod');
        pax = JSON.parse($("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val());
        roomId = $("div[id='" + $(this).parents()[5].id + "']").attr('data-roomid');
        index = $("select[id='" + $(this).attr("id") + "']").attr('data-index');

        paxRoom = $.grep(pax, function (e) {
            return e.Room == roomId;
        })[0];

        if (paxRoom != undefined) {
            ageChilds = paxRoom.AgeChilds.split("-");
            ageChilds[index] = $(this).val();
            paxRoom.AgeChilds = ageChilds.toString().replace(/,/g, "-");

            $("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val(JSON.stringify(pax));
        }
    });

    $("button[id='btbClosePaxPopup']", $(tabwidget)).click(function () {
        closePopup(tabwidget, 'paxPopUp');
    });

    $("button[id='btnClosePaxRoomPopup']", $(tabwidget)).click(function () {
        closePopup(tabwidget, 'paxRoomPopUp');
    });

    $("a[id='aClosePaxPopup']", $(tabwidget)).click(function () {
        closePopup(tabwidget, 'paxPopUp');
    });

    $("a[id='aClosePaxRoomPopup']", $(tabwidget)).click(function () {
        closePopup(tabwidget, 'paxRoomPopUp');
    });
}

function valSalesRestRules(prod, type) {

    if (typeof ($jsonSalesRestRules) == "undefined") {
        return [];
    }

    var rules = [];
    var rulesWithApplies = [];
    var rulesTmp = filterList($jsonSalesRestRules, prod);
    var today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    rulesTmp.forEach(function (item) {

        if (item.ApplyTo != null && getDateDiff('d', today, new Date(item.ApplyTo)) <= 0) {
            return;
        }

        rules.push({
            ApplyFrom: item.ApplyFrom,
            ApplyTo: item.ApplyTo,
            Monday: (type == "from") ? item.DaysByFromDate.Monday : item.DaysByToDate.Monday,
            Tuesday: (type == "from") ? item.DaysByFromDate.Tuesday : item.DaysByToDate.Tuesday,
            Wednesday: (type == "from") ? item.DaysByFromDate.Wednesday : item.DaysByToDate.Wednesday,
            Thursday: (type == "from") ? item.DaysByFromDate.Thursday : item.DaysByToDate.Thursday,
            Friday: (type == "from") ? item.DaysByFromDate.Friday : item.DaysByToDate.Friday,
            Saturday: (type == "from") ? item.DaysByFromDate.Saturday : item.DaysByToDate.Saturday,
            Sunday: (type == "from") ? item.DaysByFromDate.Sunday : item.DaysByToDate.Sunday
        });
    });

    // Esta regla se antepone a cualquier otra, si existe las otras no aplican
    rulesWithApplies = $.grep(rules, function (e) {
        return e.ApplyFrom == null && e.ApplyTo == null;
    });

    return (rulesWithApplies.length > 0) ? rulesWithApplies : rules;
}
/**
 * /
 * @param {any} tabwidget
 * @param {any} id
 * Es funcion controla el focus en la presentacion mobile.
 * En este momento no se esa usando, pero no se elimina. 
 * Por si, se considera usarla despues.
 */
function setMobileFocus(tabwidget, id) {

    //switch (id) {
    //    case "txtAirCityFrom":
    //        if ($('input[id=txtAirCityTo]', $(tabwidget)).is(':visible')) {
    //            $("div[id='divAirCityToControlMobile']", $(tabwidget)).trigger('click');
    //        } else {
    //            $("select[id='ddlAirCityTo']", $(tabwidget)).focus();
    //        }
    //        break;
    //    case "txtAirCityFrom1":
    //        $("div[id='divAirCityTo1ControlMobile']", $(tabwidget)).trigger('click');
    //        break;
    //    case "txtAirCityFrom2":
    //        $("div[id='divAirCityTo2ControlMobile']", $(tabwidget)).trigger('click');
    //        break;
    //    case "txtAirCityFrom3":
    //        $("div[id='divAirCityTo3ControlMobile']", $(tabwidget)).trigger('click');
    //        break;
    //    case "txtAirCityFrom4":
    //        $("div[id='divAirCityTo4ControlMobile']", $(tabwidget)).trigger('click');
    //        break;
    //    case "txtAirCityFrom5":
    //        $("div[id='divAirCityTo5ControlMobile']", $(tabwidget)).trigger('click');
    //        break;
    //    case "txtAirCityFrom6":
    //        $("div[id='divAirCityTo6ControlMobile']", $(tabwidget)).trigger('click');
    //        break;
    //    case "txtAirCityTo":
    //        showDatePick(tabwidget, 'txtAirDateFrom', getResource("DateDeparture"));
    //        break;
    //    case "txtAirCityTo1":
    //        $('input[id$=txtAirCityFrom2]', $(tabwidget)).val($("input[id='txtAirCityTo1']", $(tabwidget)).val());
    //        showDatePick(tabwidget, 'txtAirDateFrom1', getResource("DateDeparture"));
    //        break;
    //    case "txtAirCityTo2":
    //        $('input[id$=txtAirCityFrom3]', $(tabwidget)).val($("input[id='txtAirCityTo2']", $(tabwidget)).val());
    //        showDatePick(tabwidget, 'txtAirDateFrom2', getResource("DateDeparture"));
    //        break;
    //    case "txtAirCityTo3":
    //        $('input[id$=txtAirCityFrom4]', $(tabwidget)).val($("input[id='txtAirCityTo3']", $(tabwidget)).val());
    //        showDatePick(tabwidget, 'txtAirDateFrom3', getResource("DateDeparture"));
    //        break;
    //    case "txtAirCityTo4":
    //        $('input[id$=txtAirCityFrom5]', $(tabwidget)).val($("input[id='txtAirCityTo4']", $(tabwidget)).val());
    //        showDatePick(tabwidget, 'txtAirDateFrom4', getResource("DateDeparture"));
    //        break;
    //    case "txtAirCityTo5":
    //        $('input[id$=txtAirCityFrom6]', $(tabwidget)).val($("input[id='txtAirCityTo5']", $(tabwidget)).val());
    //        showDatePick(tabwidget, 'txtAirDateFrom5', getResource("DateDeparture"));
    //        break;
    //    case "txtAirCityTo6":
    //        showDatePick(tabwidget, 'txtAirDateFrom6', getResource("DateDeparture"));
    //        break;
    //    case "txtHotelCity":
    //        showDatePick(tabwidget, 'txtHotelDateFrom', getResource("DateCheckin"));
    //        break;
    //    case "txtCarAirportPickup":
    //        if ($("input[id='txtCarAirportReturn']", $(tabwidget)).is(':visible')) {
    //            $("div[id='divCarAirportReturnControlMobile']", $(tabwidget)).trigger('click');
    //        } else {
    //            showDatePick(tabwidget, 'txtCarDatePickup', getResource("DatePickup"));
    //        }
    //        break;
    //    case "txtCarAirportReturn":
    //        if ($("input[id='txtCarDatePickup']", $(tabwidget)).val() == "") {
    //            showDatePick(tabwidget, 'txtCarDatePickup', getResource("DatePickup"));
    //        } else {
    //            showDatePick(tabwidget, 'txtCarDateDropoff', getResource("DateDropoff"));
    //        }
    //        break;
    //    case "txtExtraCity":
    //        showDatePick(tabwidget, 'txtExtraDateFrom', getResource("DateDeparture"));
    //        break;
    //    case "txtAirHotelCityFrom":
    //        if ($('input[id=txtAirHotelCityTo]', $(tabwidget)).is(':visible')) {
    //            $("div[id='divAirHotelCityToControlMobile']", $(tabwidget)).trigger('click');
    //        } else {
    //            $("select[id='ddlAirHotelCityTo']", $(tabwidget)).focus();
    //        }
    //        break;
    //    case "txtAirHotelCityTo":
    //        showDatePick(tabwidget, 'txtAirHotelDateFrom', getResource("DateDeparture"));
    //        break;
    //    case "txtBusCityFrom":
    //        $("div[id='divBusCityToControlMobile']", $(tabwidget)).trigger('click');
    //        break;
    //    case "txtBusCityTo":
    //        showDatePick(tabwidget, 'txtBusDateFrom', getResource("DateDeparture"));
    //        break;
    //    case "txtBusHotelCityFrom":
    //        if ($('input[id=txtBusHotelCityTo]', $(tabwidget)).is(':visible')) {
    //            $("div[id='divBusHotelCityToControlMobile']", $(tabwidget)).trigger('click');
    //        } else {
    //            $("select[id='ddlBusHotelCityTo']", $(tabwidget)).focus();
    //        }
    //        break;
    //    case "txtBusHotelCityTo":
    //        showDatePick(tabwidget, 'txtBusHotelDateFrom', getResource("DateDeparture"));
    //        break;
    //    case "txtAirCarCityFrom":
    //        if ($('input[id=txtAirCarCityTo]', $(tabwidget)).is(':visible')) {
    //            $("div[id='divAirCarCityToControlMobile']", $(tabwidget)).trigger('click');
    //        } else {
    //            $("select[id='ddlAirCarCityTo']", $(tabwidget)).focus();
    //        }
    //        break;
    //    case "txtAirCarCityTo":
    //        showDatePick(tabwidget, 'txtAirCarDateFrom', getResource("DateDeparture"));
    //        break;
    //}

}

function getPaintedDates(date, rules, objFrom, objTo) {

    if (objFrom.datepicker('getDate') != null && getDateDiff('d', objFrom.datepicker('getDate'), date) == 0) {
        return [true, 'ui-state-active-from'];
    }

    if (objTo.datepicker('getDate') != null && getDateDiff('d', objTo.datepicker('getDate'), date) == 0) {
        return [true, 'ui-state-active-to', 'n dias'];
    }

    if (objFrom.datepicker('getDate') != null && objTo.datepicker('getDate') != null &&
        (getDateDiff('d', objFrom.datepicker('getDate'), date) > 0 && getDateDiff('d', date, objTo.datepicker('getDate')) > 0)) {
        return [true, 'ui-state-active-from-to'];
    }

    var rulesTmp = [];

    if (rules.length == 1) {

        if (rules[0].ApplyFrom == null || (rules[0].ApplyFrom == null && rules[0].ApplyTo == null)) {

            if (!valRulesDates(date, rules[0]))
                return [false];

        } else if (rules[0].ApplyFrom != null) {

            rulesTmp = $.grep(rules, function (e) {
                return getDateDiff('d', new Date(e.ApplyFrom), date) >= 0;
            });

            if (!valRulesDates(date, rulesTmp[0]))
                return [false];

        }

    } else if (rules.length > 1) {

        // Recorremos las reglas para determinar cual debe aplicar
        rules.forEach(function (item) {

            if (item.ApplyFrom != null && getDateDiff('d', new Date(item.ApplyFrom), date) <= 0) {
                return;
            }

            if (item.ApplyTo != null && getDateDiff('d', date, new Date(item.ApplyTo)) <= 0) {
                return;
            }

            rulesTmp.push(item);
        });

        if (!valRulesDates(date, rulesTmp[0]))
            return [false];
    }

    return [true];

}

function valRulesDates(date, rule) {

    if (rule == null)
        return true;

    switch (date.getDay()) {
        case 0: // Sunday
            if (!rule.Sunday)
                return false;
            break;
        case 1: // Monday
            if (!rule.Monday)
                return false;
            break;
        case 2: // Tuesday
            if (!rule.Tuesday)
                return false;
            break;
        case 3: // Wednesday
            if (!rule.Wednesday)
                return false;
            break;
        case 4: // Thursday
            if (!rule.Thursday)
                return false;
            break;
        case 5: // Friday
            if (!rule.Friday)
                return false;
            break;
        case 6: // Saturday
            if (!rule.Saturday)
                return false;
            break;
    }

    return true
}

function getDateDiff(datepart, fromdate, todate) {
    var diff = 0;
    var date1_ms = fromdate.getTime();
    var date2_ms = todate.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    //take out milliseconds
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);

    switch (datepart) {
        case 's':
            diff = seconds;
            break;
        case 'm':
            diff = minutes;
            break;
        case 'h':
            diff = hours;
            break;
        case 'd':
            diff = days;
            break;
    }

    return diff;
}

function changeTripType(tabwidget, prod, tripType) {

    switch (tripType) {
        case 'OW':
            // One Way
            if (!$("input[id='txt" + prod + "DateTo']", $(tabwidget)).hasClass("disabled")) {
                $("input[id='txt" + prod + "DateTo']", $(tabwidget)).addClass("disabled");
                $("input[id='txt" + prod + "DateTo']", $(tabwidget)).prop("disabled", true);
                $("input[id='txt" + prod + "DateTo']", $(tabwidget)).removeAttr("data-bvalidator");

                $("select[id='ddl" + prod + "ReturnTime']", $(tabwidget)).addClass("disabled");
                $("select[id='ddl" + prod + "ReturnTime']", $(tabwidget)).prop("disabled", true);
                if ($("input[id='txt" + prod + "DateTo']", $(tabwidget)).hasClass("bvalidator_invalid")) {
                    $("input[id='txt" + prod + "DateTo']", $(tabwidget)).removeClass('bvalidator_invalid');
                    $("input[id='txt" + prod + "DateTo']", $(tabwidget)).next().remove();
                }
            }

            if ($("div[id='divAirAccountCode']", $(tabwidget)).length > 0) {
                $("div[id='divAirDepartureTime']", $(tabwidget)).removeClass("fix-padding-left");
                $("div[id='divAirDepartureTime']", $(tabwidget)).addClass("fix-padding-right");
                $("div[id='divAirReturnTime']", $(tabwidget)).removeClass("fix-padding-right");
                $("div[id='divAirReturnTime']", $(tabwidget)).addClass("fix-padding-left");
            }

            if (prod == "Air" && $("div[id='divAirMultiDestination']", $(tabwidget)).is(":visible")) {

                $("div[id='divAirMultiDestination']", $(tabwidget)).hide();
                $("div[id='divAirCities']", $(tabwidget)).show();
                $("div[id='divAirDates']", $(tabwidget)).show();
                $("div[id='divAirDepartureTime']", $(tabwidget)).show();
                $("div[id='divAirReturnTime']", $(tabwidget)).show();

                if ($AirFlexDateEnabled && !$("div[id='divAirFlexDates']", $(tabwidget)).is(":visible")) {
                    $("div[id='divAirFlexDates']", $(tabwidget)).show();
                }

                if ($("div[id='divAirPassengers']", $(tabwidget)).hasClass("col-sm-12 col-md-12 col-lg-12")) {
                    $("div[id='divAirPassengersGuests']", $(tabwidget)).removeClass("col-sm-4 col-md-4 col-lg-4");
                    $("div[id='divAirPassengersGuests']", $(tabwidget)).addClass("col-sm-12 col-md-12 col-lg-12");
                    $("div[id='divAirPassengers']", $(tabwidget)).removeClass("col-sm-12 col-md-12 col-lg-12");
                    $("div[id='divAirPassengers']", $(tabwidget)).addClass("col-sm-4 col-md-4 col-lg-4");
                }
            }

            break;
        case 'RT':
            // Round Trip
            if ($("input[id='txt" + prod + "DateTo']", $(tabwidget)).hasClass("disabled")) {
                $("input[id='txt" + prod + "DateTo']", $(tabwidget)).removeClass('disabled');
                $("input[id='txt" + prod + "DateTo']", $(tabwidget)).removeProp('disabled');
                $("input[id='txt" + prod + "DateTo']", $(tabwidget)).attr("data-bvalidator", "required");
                document.querySelector("input[id='txt" + prod + "DateTo']").removeAttribute('disabled');
            }

            if ($("select[id='ddl" + prod + "ReturnTime']", $(tabwidget)).hasClass("disabled")) {
                $("select[id='ddl" + prod + "ReturnTime']", $(tabwidget)).removeClass('disabled');
                $("select[id='ddl" + prod + "ReturnTime']", $(tabwidget)).removeProp('disabled');
            }

            if (prod == "Air" && $("div[id='divAirMultiDestination']", $(tabwidget)).is(":visible")) {

                $("div[id='divAirMultiDestination']", $(tabwidget)).hide();
                $("div[id='divAirCities']", $(tabwidget)).show();
                $("div[id='divAirDates']", $(tabwidget)).show();
                $("div[id='divAirDepartureTime']", $(tabwidget)).show();
                $("div[id='divAirReturnTime']", $(tabwidget)).show();

                if ($AirFlexDateEnabled && !$("div[id='divAirFlexDates']", $(tabwidget)).is(":visible")) {
                    $("div[id='divAirFlexDates']", $(tabwidget)).show();
                }

                if ($("div[id='divAirPassengers']", $(tabwidget)).hasClass("col-sm-12 col-md-12 col-lg-12")) {
                    $("div[id='divAirPassengersGuests']", $(tabwidget)).removeClass("col-sm-4 col-md-4 col-lg-4");
                    $("div[id='divAirPassengersGuests']", $(tabwidget)).addClass("col-sm-12 col-md-12 col-lg-12");
                    $("div[id='divAirPassengers']", $(tabwidget)).removeClass("col-sm-12 col-md-12 col-lg-12");
                    $("div[id='divAirPassengers']", $(tabwidget)).addClass("col-sm-4 col-md-4 col-lg-4");
                }


            }

            // Datepickers
            $("input[id='txt" + prod + "DateFrom']", $(tabwidget)).change(function () {
                $("input[id='txt" + prod + "DateTo']", $(tabwidget)).datepicker("option", "minDate", $("input[id='txt" + prod + "DateFrom']", $(tabwidget)).datepicker('getDate'));
            });
            break;
        case 'MD':

            $("div[id='divAirMultiDestination']", $(tabwidget)).show();
            $("div[id='divAirCities']", $(tabwidget)).hide();
            $("div[id='divAirDates']", $(tabwidget)).hide();
            $("div[id='divAirDepartureTime']", $(tabwidget)).hide();
            $("div[id='divAirReturnTime']", $(tabwidget)).hide();

            if ($AirFlexDateEnabled && $("div[id='divAirFlexDates']", $(tabwidget)).is(":visible")) {
                $("div[id='divAirFlexDates']", $(tabwidget)).hide();
            }

            if ($("div[id='divAirPassengers']", $(tabwidget)).hasClass("col-sm-4 col-md-4 col-lg-4")) {
                $("div[id='divAirPassengersGuests']", $(tabwidget)).removeClass("col-sm-12 col-md-12 col-lg-12");
                $("div[id='divAirPassengersGuests']", $(tabwidget)).addClass("col-sm-4 col-md-4 col-lg-4");
                $("div[id='divAirPassengers']", $(tabwidget)).removeClass("col-sm-4 col-md-4 col-lg-4");
                $("div[id='divAirPassengers']", $(tabwidget)).addClass("col-sm-12 col-md-12 col-lg-12");
            }



            if (!$IsMobile) {

                var lblNbsp = "<label>&nbsp;</label>";

                if ($("div[id='divAirDepartureTime2']", $(tabwidget)).attr("style") == "display:none;" && $("div[id='divAirFlight2Opt'] label", $(tabwidget)).length == 0) {
                    var html = $("div[id='divAirFlight2Opt']", $(tabwidget)).html();
                    $("div[id='divAirFlight2Opt']", $(tabwidget)).html(lblNbsp + html);

                    $("a[id='addAirFlight2']", $(tabwidget)).click(function () {
                        showHideFligth(tabwidget, 'divMDFlight3', 'divAirFlight2Opt');
                    });
                }
                if ($("div[id='divAirDepartureTime3']", $(tabwidget)).attr("style") == "display:none;" && $("div[id='divAirFlight3Opt'] label", $(tabwidget)).length == 0) {
                    var html = $("div[id='divAirFlight3Opt']", $(tabwidget)).html();
                    $("div[id='divAirFlight3Opt']", $(tabwidget)).html(lblNbsp + html);

                    $("a[id='addAirFlight3']", $(tabwidget)).click(function () {
                        showHideFligth(tabwidget, 'divMDFlight4', 'divAirFlight3Opt');
                    });
                    $("a[id='delAirFlight3']", $(tabwidget)).click(function () {
                        showHideFligth(tabwidget, 'divAirFlight2Opt', 'divMDFlight3');
                    });
                }
                if ($("div[id='divAirDepartureTime4']", $(tabwidget)).attr("style") == "display:none;" && $("div[id='divAirFlight4Opt'] label", $(tabwidget)).length == 0) {
                    var html = $("div[id='divAirFlight4Opt']", $(tabwidget)).html();
                    $("div[id='divAirFlight4Opt']", $(tabwidget)).html(lblNbsp + html);

                    $("a[id='addAirFlight4']", $(tabwidget)).click(function () {
                        showHideFligth(tabwidget, 'divMDFlight5', 'divAirFlight4Opt');
                    });
                    $("a[id='delAirFlight4']", $(tabwidget)).click(function () {
                        showHideFligth(tabwidget, 'divAirFlight3Opt', 'divMDFlight4');
                    });
                }
                if ($("div[id='divAirDepartureTime5']", $(tabwidget)).attr("style") == "display:none;" && $("div[id='divAirFlight5Opt'] label", $(tabwidget)).length == 0) {
                    var html = $("div[id='divAirFlight5Opt']", $(tabwidget)).html();
                    $("div[id='divAirFlight5Opt']", $(tabwidget)).html(lblNbsp + html);

                    $("a[id='addAirFlight5']", $(tabwidget)).click(function () {
                        showHideFligth(tabwidget, 'divMDFlight6', 'divAirFlight5Opt');
                    });
                    $("a[id='delAirFlight5']", $(tabwidget)).click(function () {
                        showHideFligth(tabwidget, 'divAirFlight4Opt', 'divMDFlight5');
                    });
                }
                if ($("div[id='divAirDepartureTime6']", $(tabwidget)).attr("style") == "display:none;" && $("div[id='divAirFlight6Opt'] label", $(tabwidget)).length == 0) {
                    var html = $("div[id='divAirFlight6Opt']", $(tabwidget)).html();
                    $("div[id='divAirFlight6Opt']", $(tabwidget)).html(lblNbsp + html);

                    $("a[id='delAirFlight6']", $(tabwidget)).click(function () {
                        showHideFligth(tabwidget, 'divAirFlight5Opt', 'divMDFlight6');
                    });
                }
            }

            break;
    }
}

function changeReturnType(tabwidget, type) {

    if (type == "Distinct") {
        $("div[id='divCarAirportPickup']", $(tabwidget)).removeClass('col-sm-12 col-md-12 col-lg-12 fix-padding-right');
        $("div[id='divCarAirportPickup']", $(tabwidget)).addClass('col-sm-6 col-md-6 col-lg-6');
        $("div[id='divCarAirportReturn']", $(tabwidget)).show();
    } else {
        $("div[id='divCarAirportReturn']", $(tabwidget)).hide();
        $("div[id='divCarAirportPickup']", $(tabwidget)).removeClass('col-sm-6 col-md-6 col-lg-6');
        $("div[id='divCarAirportPickup']", $(tabwidget)).addClass('col-sm-12 col-md-12 col-lg-12 fix-padding-right');
    }

}

function convertArrayToArrayCodeName(array, type) {

    var arrCodeName = [];
    var isHotelList = false;
    var elem;

    array.forEach(function (item) {

        switch (type) {
            case "AutoComplete":
                elem = item;
                break;
            case "ListCodes":
                if (item.ProductCode)
                    isHotelList = true;

                elem = item.City;
                break;
        }

        arrCodeName.push({
            Code: getIATACode(elem),
            Name: elem.substring(0, elem.indexOf("(") - 1),
            ProductCode: item.ProductCode,
            ProductName: item.ProductName
        });
    });

    return (isHotelList) ? sortArrayByKey(arrCodeName, "ProductName") : sortArrayByKey(arrCodeName, "Name");
}

function cleanElements(div) {

    div.each(function () {

        switch (this.type) {
            case "text":
                this.value = "";
                break;
            case "checkbox":
                this.checked = false;
                break;
        }
    });
}

function addDays(myDate, days) {
    var today = new Date();

    if (myDate != null)
        return new Date(myDate.getTime() + days * 24 * 60 * 60 * 1000);

    return new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
}

function showHideFligth(tabwidget, divShow, divHide) {

    $("div[id='" + divShow + "']", $(tabwidget)).show();
    $("div[id='" + divHide + "']", $(tabwidget)).hide();

}

function getPaxByArray(array, prod) {

    var strPax = "";

    if (prod == "Hotel") {

        array.forEach(function (item) {

            strPax += ((strPax !== "") ? "!" : "") + item.Adults;

            if (item.AgeChilds != "")
                strPax += "-" + item.AgeChilds;
        });

    } else { // Air or Bus

        var adt = 0;
        var chd = 0;
        var inf = 0;

        array.forEach(function (item) {

            adt += parseInt(item.Adults);

            item.AgeChilds.split('-').forEach(function (age) {

                if (parseInt(age) <= 2)
                    inf += 1;
                else
                    chd += 1;
            });

        });

        strPax = adt.toString() + "/" + chd.toString() + "/" + inf.toString();
    }

    return strPax;
}

function getQtyPaxByArray(array) {

    var totalPax = 0;

    array.forEach(function (item) {

        totalPax += parseInt(item.Adults) + parseInt(item.Childs);

    });

    return totalPax.toString();
}

function populateCircuitCountries(tabwidget) {

    if (!$("select[id='ddlCircuitCountries']").length) {
        return;
    }

    // Retrieve selected region
    var $target = $("select[id='ddlCircuitCountries']"),
        countries = sortArrayByKey(JSON.parse($("#CircuitProduct_Countries", $(tabwidget)).val()), 'name'),
        data = [],
        regions = [],
        _regions = $("select[id='ddlCircuitRegion']", $(tabwidget)).find(':selected');

    // Get all selected regions
    _regions.each(function (index, item) {
        if ($(item).val() != "" && $(item).val() != null)
            regions.push(parseInt($(item).val()));
    });

    // Populate countries filtering selected regions
    if (!regions.length) {
        $.each(countries, function (index, item) {
            data.push({ id: item.id, text: item.name });
        });
    } else {
        $.each(countries, function (index, item) {
            if (regions.indexOf(item.region_id) !== -1) {
                data.push({ id: item.id, text: item.name });
            }
        });
    }

    // Empty options and set new data
    $target.html('').select2({
        data: data,
        dropdownAutoWidth: true
    });
    return;
}

function populateCircuitCities(tabwidget) {

    if (!$("select[id='ddlCircuitCities']").length) {
        return;
    }

    // Retrieve selected country
    var $target = $("select[id='ddlCircuitCities']"),
        cities = sortArrayByKey(JSON.parse($("#CircuitProduct_Cities", $(tabwidget)).val()), 'name'),
        data = [],
        countries = [],
        _countries = $("select[id='ddlCircuitCountries']", $(tabwidget)).find(':selected');

    // Get all selected countries
    _countries.each(function (index, item) {
        if ($(item).val() != "" && $(item).val() != null)
            countries.push(parseInt($(item).val()));
    });

    // Populate countries filtering selected countries
    if (!countries.length) {
        $.each(cities, function (index, item) {
            data.push({ id: item.id, text: item.name });
        });
    } else {
        $.each(cities, function (index, item) {
            if (existInArray(countries, item.country_id)) {
                data.push({ id: item.id, text: item.name });
            }
        });
    }

    // Empty options and set new data
    $target.html('').select2({ data: data, dropdownAutoWidth: true });
    return;
}

// Date Picker Mobile functions

//Mostrar-mover  el calendario en toppage en versiones mobile
function showDatePick(tabwidget, id, text) {

    $("input[id='" + id + "']", $(tabwidget)).datepicker("show");

    if ($IsMobile) {

        addHeaderDatePick(tabwidget, id, text);

        if (!$("body").hasClass("no-scroll")) {
            $("body").addClass("no-scroll");
        }

        $("input[id='yPos']", $(tabwidget)).val($("input[id='" + id + "']", $(tabwidget)).offset().top);
        $("input[id='" + id + "']", $(tabwidget)).blur();
        $('html, body').scrollTop(0);

    }

}

function addHeaderDatePick(tabwidget, id, text) {

    if ($IsMobile) {

        if ($("div[id='ui-datepicker-div'] div[id='divTitleDatePicker']").length > 0) {
            $("div[id='ui-datepicker-div'] div[id='divTitleDatePicker']").remove();
        }

        if ($("div[id='ui-datepicker-div'] a[class='ui-datepicker-close']").length > 0) {
            $("div[id='ui-datepicker-div'] a[class='ui-datepicker-close']").remove();
        }

        htmladd = "<div id=\"divTitleDatePicker\" class=\"divTitleDatePicker\"><div class=\"row\"><h2 class=\"center\">" + text + "</h2></div></div>";
        $("div[id='ui-datepicker-div']").append(htmladd);

        $("div[id='divTitleDatePicker']").append("<a onclick=\"closeCA('" + tabwidget + "','" + id + "')\" class=\"ui-datepicker-close\"><i class=\"fa fa-times fa-x\"></i></a>");
        $(".ui-datepicker-calendar tbody tr td a.ui-state-default").each(function (index) { $(this).attr("onclick", "closeCA('" + tabwidget + "','" + id + "')"); });

    }

}

//Cerrar calendario y volver al ipunt desde donde se abrio
function closeCA(tabwidget, id) {

    var yPos = parseFloat($("input[id='yPos']", $(tabwidget)).val());
    $("input[id='" + id + "']", $(tabwidget)).datepicker("hide");
    $('html, body').scrollTop(yPos - 50.00);

    if ($("body").hasClass("no-scroll")) {
        $("body").removeClass("no-scroll");
    }

}

// PopUps functions

function openPopUp(tabwidget, popup, popType, prod) {

    var tooltipanchor = $("a[data-tooltipanchor='" + popup + "']", $(tabwidget));
    var yPos = $(tooltipanchor).offset();

    $("input[id='yPos']", $(tabwidget)).val(yPos.top);

    switch (popType) {
        case 'paxPopUp':

            $("div[id='divPaxPopup']").popup({
                type: 'tooltip',
                offsettop: 0,
                offsetleft: 16,
                horizontal: 'center',
                vertical: 'bottom',
                transition: '0.3s all 0.1s',
                //escape: false,
                //blur: false,
                tooltipanchor: tooltipanchor,
                onclose: function () {
                    var divPax = "#div" + prod + "PassengersGuests";

                    // se inicializa el bValidator solo para el div
                    if ($(divPax).data('bValidator') == null) {
                        $(divPax).bValidator();
                    }

                    if ($(divPax).data('bValidator') != null) {
                        $(divPax).data('bValidator').validate();
                    }
                }
            });

            $("div[id='divPaxPopup']").attr('data-prod', prod);

            var pax = JSON.parse($("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val());
            $("div[id='divPaxPopup'] input[id='paxAdtQuantity']").val(pax.Adults);
            $("div[id='divPaxPopup'] input[id='paxChdQuantity']").val(pax.Childs);
            $("div[id='divPaxPopup'] input[id='paxInfQuantity']").val(pax.Infants);

            if (pax.Adults == $("div[id='divPaxPopup'] input[id='paxAdtQuantity']").attr('min'))
                $(".btn-number[data-type='minus'][data-field='paxAdtQuantity']").attr('disabled', true);
            else
                $(".btn-number[data-type='minus'][data-field='paxAdtQuantity']").removeAttr('disabled');

            if (pax.Childs == $("div[id='divPaxPopup'] input[id='paxChdQuantity']").attr('min'))
                $(".btn-number[data-type='minus'][data-field='paxChdQuantity']").attr('disabled', true);
            else
                $(".btn-number[data-type='minus'][data-field='paxChdQuantity']").removeAttr('disabled');

            if (pax.Infants == $("div[id='divPaxPopup'] input[id='paxInfQuantity']").attr('min'))
                $(".btn-number[data-type='minus'][data-field='paxInfQuantity']").attr('disabled', true);
            else
                $(".btn-number[data-type='minus'][data-field='paxInfQuantity']").removeAttr('disabled');

            if (pax.Adults == $("div[id='divPaxPopup'] input[id='paxAdtQuantity']").attr('max'))
                $(".btn-number[data-type='plus'][data-field='paxAdtQuantity']").attr('disabled', true);
            else
                $(".btn-number[data-type='plus'][data-field='paxAdtQuantity']").removeAttr('disabled');

            if (pax.Childs == $("div[id='divPaxPopup'] input[id='paxChdQuantity']").attr('max'))
                $(".btn-number[data-type='plus'][data-field='paxChdQuantity']").attr('disabled', true);
            else
                $(".btn-number[data-type='plus'][data-field='paxChdQuantity']").removeAttr('disabled');

            if (pax.Infants == $("div[id='divPaxPopup'] input[id='paxInfQuantity']").attr('max'))
                $(".btn-number[data-type='plus'][data-field='paxInfQuantity']").attr('disabled', true);
            else
                $(".btn-number[data-type='plus'][data-field='paxInfQuantity']").removeAttr('disabled');

            if (!$("body").hasClass("no-scroll")) {
                $("body").addClass("no-scroll");
            }
            //$('html, body').scrollTop(0);
            setTimeout(function () { $("div[id='divPaxPopup']").popup('show'); }, 10);

            break;

        case 'paxRoomPopUp':

            $("div[id='divPaxRoomPopup']").popup({
                type: 'tooltip',
                offsettop: 0,
                offsetleft: 20,
                horizontal: 'center',
                vertical: 'bottom',
                transition: '0.3s all 0.1s',
                //escape: false,
                //blur: false,
                tooltipanchor: tooltipanchor,
                onclose: function () {
                    var divPax = "#div" + prod + "RoomsGuests";

                    // se inicializa el bValidator solo para el div
                    if ($(divPax).data('bValidator') == null) {
                        $(divPax).bValidator();
                    }

                    if ($(divPax).data('bValidator') != null) {
                        $(divPax).data('bValidator').validate();
                    }
                }
            });

            if (prod == "Hotel") {
                $("div[id='divPaxRoomPopup'] input[name='paxRoomAdtQuantity']").attr('max', $MaxPassengerSearch);
            } else {
                $("div[id='divPaxRoomPopup'] input[name='paxRoomAdtQuantity']").attr('max', 7);
            }

            var roomPaxes = JSON.parse($("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val());

            $("div[id='divPaxRoomPopup']").attr('data-prod', prod);
            $("div[id='divPaxRoomPopup']").attr('data-qty-rooms', roomPaxes.length.toString());
            $("div[id='divPaxRoomPopup'] div[id*='room']").hide()

            if (roomPaxes.length == 4) {
                $("a[id='addRoomPaxRoomPopup']").hide();
            } else {
                $("a[id='addRoomPaxRoomPopup']").show();
            }

            for (var i = 1; i <= 4; i++) {
                if ($("div[id='divPaxRoomPopup'] div[id='room" + i.toString() + "'] a[id='delRoom" + i.toString() + "PaxRoomPopup']").length > 0)
                    $("div[id='divPaxRoomPopup'] div[id='room" + i.toString() + "'] a[id='delRoom" + i.toString() + "PaxRoomPopup']").hide();
            }

            if (roomPaxes.length > 1) {
                $("div[id='divPaxRoomPopup'] div[id='room" + roomPaxes.length.toString() + "'] a[id='delRoom" + roomPaxes.length.toString() + "PaxRoomPopup']").show();
            }

            roomPaxes.forEach(function (item) {
                $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "']").show()
                $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "'] input[id='paxRoom" + item.Room + "AdtQuantity']").val(item.Adults);
                $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "'] input[id='paxRoom" + item.Room + "ChdQuantity']").val(item.Childs);

                $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "'] div[id*='Age']").hide();
                if (parseInt(item.Childs) > 0) {

                    $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "'] div[id*='ChildrensAge']").show();

                    ageChilds = item.AgeChilds.split('-');
                    for (var i = 0; i < parseInt(item.Childs); i++) {
                        $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "'] div[id='divRoom" + item.Room + "ChildAge" + (i + 1).toString() + "']").show();
                        $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "'] select[id='ddlRoom" + item.Room + "ChildAge" + (i + 1).toString() + "']").val(ageChilds[i]);
                    }
                }

                if (item.Adults == $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "'] input[id='paxRoom" + item.Room + "AdtQuantity']").attr('min'))
                    $("div[id='room" + item.Room + "'] .btn-number[data-type='minus'][data-field='paxRoom" + item.Room + "AdtQuantity']").attr('disabled', true);
                else
                    $("div[id='room" + item.Room + "'] .btn-number[data-type='minus'][data-field='paxRoom" + item.Room + "AdtQuantity']").removeAttr('disabled');

                if (item.Childs == $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "'] input[id='paxRoom" + item.Room + "ChdQuantity']").attr('min'))
                    $("div[id='room" + item.Room + "'] .btn-number[data-type='minus'][data-field='paxRoom" + item.Room + "ChdQuantity']").attr('disabled', true);
                else
                    $("div[id='room" + item.Room + "'] .btn-number[data-type='minus'][data-field='paxRoom" + item.Room + "ChdQuantity']").removeAttr('disabled');

                if (item.Adults == $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "'] input[id='paxRoom" + item.Room + "AdtQuantity']").attr('max'))
                    $("div[id='room" + item.Room + "'] .btn-number[data-type='plus'][data-field='paxRoom" + item.Room + "AdtQuantity']").attr('disabled', true);
                else
                    $("div[id='room" + item.Room + "'] .btn-number[data-type='plus'][data-field='paxRoom" + item.Room + "AdtQuantity']").removeAttr('disabled');

                if (item.Childs == $("div[id='divPaxRoomPopup'] div[id='room" + item.Room + "'] input[id='paxRoom" + item.Room + "ChdQuantity']").attr('max'))
                    $("div[id='room" + item.Room + "'] .btn-number[data-type='plus'][data-field='paxRoom" + item.Room + "ChdQuantity']").attr('disabled', true);
                else
                    $("div[id='room" + item.Room + "'] .btn-number[data-type='plus'][data-field='paxRoom" + item.Room + "ChdQuantity']").removeAttr('disabled');
            });

            if (!$("body").hasClass("no-scroll")) {
                $("body").addClass("no-scroll");
            }
            //$('html, body').scrollTop(0);
            setTimeout(function () { $("div[id='divPaxRoomPopup']").popup('show'); }, 10);

            break;

        default:
            break;
    }
}

function closePopup(tabwidget, popType) {

    var divPax;
    var yPos = parseFloat($("input[id='yPos']", $(tabwidget)).val());

    switch (popType) {
        case 'paxPopUp':

            prod = $("div[id='divPaxPopup']").attr('data-prod');
            divPax = "#div" + prod + "PassengersGuests";

            $("div[id='divPaxPopup']").popup('hide');
            // $('html, body').scrollTop(yPos - 50.00);

            break;

        case 'paxRoomPopUp':

            prod = $("div[id='divPaxRoomPopup']").attr('data-prod');
            divPax = "#div" + prod + "RoomsGuests";

            $("div[id='divPaxRoomPopup']").popup('hide');
            //$('html, body').scrollTop(yPos - 50.00);

            break;

        default:
            break;
    }

    if ($("body").hasClass("no-scroll")) {
        $("body").removeClass("no-scroll");
    }

    // se inicializa el bValidator solo para el div
    if ($(divPax).data('bValidator') == null) {
        $(divPax).bValidator();
    }

    if ($(divPax).data('bValidator') != null) {
        $(divPax).data('bValidator').validate();
    }

}

function setTotalPaxPopup(tabwidget, prod, roomId, paxType, valueCurrent) {

    pax = JSON.parse($("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val());

    if (prod == "Air" || prod == "Bus" || prod == "AirCar") {

        switch (paxType) {
            case 'paxAdtQuantity':
                pax.Adults = valueCurrent.toString();
                break;
            case 'paxChdQuantity':
                pax.Childs = valueCurrent.toString();
                break;
            case 'paxInfQuantity':
                pax.Infants = valueCurrent.toString();
                break;
        }

        $("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val(JSON.stringify(pax));

        paxTotal = parseInt(pax.Adults) + parseInt(pax.Childs) + parseInt(pax.Infants);
        $("input[id='txt" + prod + "NumberPassenger']", $(tabwidget)).val(paxTotal.toString());

    } else {

        paxRoom = $.grep(pax, function (e) {
            return e.Room == roomId;
        })[0];

        if (paxRoom != undefined) {
            if (paxType == "paxRoomAdtQuantity") {
                paxRoom.Adults = valueCurrent.toString();
            } else {
                isForShow = (valueCurrent > parseInt(paxRoom.Childs)) ? true : false;
                paxRoom.Childs = valueCurrent.toString();

                if (valueCurrent == 0) {
                    $("div[id='divPaxRoomPopup'] div[id='room" + roomId + "'] div[id*='Age']").hide();
                    paxRoom.AgeChilds = "";
                } else {
                    $("div[id='divPaxRoomPopup'] div[id='room" + roomId + "'] select[id='ddlRoom" + roomId + "ChildAge" + valueCurrent.toString() + "']").val("0");
                    $("div[id='divPaxRoomPopup'] div[id='room" + roomId + "'] div[id*='ChildrensAge']").show();
                    ageChilds = (paxRoom.AgeChilds != "") ? paxRoom.AgeChilds.split("-") : [];
                    if (isForShow) {
                        $("div[id='divPaxRoomPopup'] div[id='room" + roomId + "'] div[id*='divRoom" + roomId + "ChildAge" + valueCurrent.toString() + "']").show();
                        ageChilds.push("0");
                    } else {
                        $("div[id='divPaxRoomPopup'] div[id='room" + roomId + "'] div[id*='divRoom" + roomId + "ChildAge" + (valueCurrent + 1).toString() + "']").hide();
                        ageChilds.pop();
                    }
                    paxRoom.AgeChilds = ageChilds.toString().replace(/,/g, "-");
                }
            }

            if ($("div[id='divPaxRoomPopup']").attr('data-qty-rooms') == roomId) {
                $("div[id='divPaxRoomPopup'] div[class='pop-up-content']").animate({ scrollTop: $("div[id='divPaxRoomPopup'] div[id='divPaxRoomControl']").innerHeight() }, 400);
            }
        }

        $("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val(JSON.stringify(pax));
        $("input[id='txt" + prod + "NumberPassenger']", $(tabwidget)).val(getQtyPaxByArray(pax).toString());
    }
}

// Validators functions

function validateQuantityInfants(v, tabwidget, prod) {

    var pax = JSON.parse($("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val());
    var boolReturn = true;

    if (prod === "Air" || prod === "Bus" || prod == "AirCar") {

        boolReturn = parseInt(pax.Adults) >= parseInt(pax.Infants);

    } else {

        pax.forEach(function (room) {

            var qtyPassengersInf = 0;

            if (parseInt(room.Childs) > 0) {

                room.AgeChilds.split("-").forEach(function (age) {

                    if (parseInt(age) <= 2) {
                        qtyPassengersInf += 1;
                    }

                });
            }

            if (boolReturn === true && parseInt(room.Adults) < qtyPassengersInf) {
                boolReturn = false;
            }
        });

    }

    return boolReturn;
}

function validatesc(){
    var txtDestination = $("input[id$='txtHotelCity']",$ModuleId).attr('destinationid');
    if(txtDestination == undefined){
        return false;
    }
   return true;
}

function validateMaxPassenger(v, tabwidget, prod, max) {

    var pax = JSON.parse($("input[id='hdn" + prod + "Passengers']", $(tabwidget)).val());
    var boolReturn = false;

    if (prod == "Air" || prod == "Bus" || prod == "AirCar") {

        boolReturn = ((parseInt(pax.Adults) + parseInt(pax.Childs) + parseInt(pax.Infants)) <= max);

    } else {

        var qtyPassengers = 0;
        pax.forEach(function (item) {
            qtyPassengers += parseInt(item.Adults) + parseInt(item.Childs);
        });

        boolReturn = (qtyPassengers <= max);

        if (boolReturn) {
            if ($("input[id='txt" + prod + "NumberPassenger']", $(tabwidget)).hasClass("bvalidator_invalid")) {
                $("input[id='txt" + prod + "NumberPassenger']", $(tabwidget)).removeClass('bvalidator_invalid');
            }
        } else {
            $("input[id='txt" + prod + "NumberPassenger']", $(tabwidget)).addClass('bvalidator_invalid');
        }
    }

    return boolReturn;
};

window.onload = function () {

    
    let container_multidest = document.querySelector('#divAirMultiDestination');
    if (container_multidest) for (let i = 1; i < 7; i++) {
        
        let itemsMultidest = 
        `
        <div id="divMDFlight${i}" class="divMDFlight${i}" style="display:none">
        <span class="multidest-flight">Tramo ${i}</span>
        <div class="row">
            <div class="divAirCityFrom${i} col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <div class="form-group air-destination destination-group">
                    <label class="air-dest-label dest-label" for="txtAirCityFrom${i}">Origen:</label>
                    <div class="icon-input-group">
                        <div id="divAirCityFrom${i}ControlMobile" class="input-mobile-control hidden-lg hidden-sm hidden-md" data-input-id="txtAirCityFrom${i}" data-input-label="Ciudad de Origen" data-input-type="AirportsCities" data-label="Origen Tramo ${i}:"></div>
                        <input type="text" id="txtAirCityFrom${i}" name="txtAirCityFrom${i}" class="txtAirCity ac_input form-control air-dest-input dest-input " placeholder="Ingrese una ciudad" data-bvalidator="required, autocomplete[airportscity]" data-bvalidator-msg-required="La ciudad es requerida"
                            data-bvalidator-msg-autocomplete="Debe seleccionar una ciudad desde el autocomplete">
                        <i class="fa fa-map-marker input-icon input-icon-left" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div class="divAirCityTo${i} col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <div class="form-group air-destination destination-group">
                    <label class="air-dest-label dest-label" for="txtAirCityTo${i}">Destino:</label>
                    <div class="icon-input-group">
                        <div id="divAirCityTo${i}ControlMobile" class="input-mobile-control hidden-lg hidden-sm hidden-md" data-input-id="txtAirCityTo${i}" data-input-label="Ciudad de Destino" data-input-type="AirportsCities" data-label="Destino Tramo ${i}:"></div>
                        <input type="text" id="txtAirCityTo${i}" name="txtAirCityTo${i}" class="txtAirCity ac_input form-control air-dest-input dest-input " placeholder="Ingrese una ciudad" data-bvalidator="required, autocomplete[airportscity]" data-bvalidator-msg-required="La ciudad es requerida"
                            data-bvalidator-msg-autocomplete="Debe seleccionar una ciudad desde el autocomplete">
                        <i class="fa fa-map-marker input-icon input-icon-left" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div class="divAirDateFrom${i} col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <div class="form-group air-checkindate destination-group">
                    <label class="lblDates" for="txtAirDateFrom${i}">Fecha:</label>
                    <div class="icon-input-group">
                        <input type="text" id="txtAirDateFrom${i}" name="txtAirDateFrom${i}" class="txtAirDateFrom form-control air-checkindate-input checkindate-input " readonly="readonly" placeholder="Partida" data-bvalidator="required" data-bvalidator-msg-required="Seleccione una fecha">
                        <i class="fa fa-calendar input-icon input-icon-left" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div class="divAirDepartureTime${i} col-xs-12 col-sm-6 col-md-4 col-lg-4" style="display:none;">
                <div class="form-group air-checkindate destination-group">
                    <label class="lblAirDepartureTime${i}">Hora de salida:</label>
                    <div class="icon-input-group">
                        <select id="ddlAirDepartureTime${i}" class="ddlAirDepartureTime${i} form-control dest-input special-options-input">
                            <option value="">Cualquiera</option>
                            <option value="6">Por la mañana</option>
                            <option value="13">Por la tarde</option>
                            <option value="19">Por la noche</option>
                            <option value="1">1:00 AM</option>
                            <option value="2">2:00 AM</option>
                            <option value="3">3:00 AM</option>
                            <option value="4">4:00 AM</option>
                            <option value="5">5:00 AM</option>
                            <option value="6">6:00 AM</option>
                            <option value="7">7:00 AM</option>
                            <option value="8">8:00 AM</option>
                            <option value="9">9:00 AM</option>
                            <option value="10">10:00 AM</option>
                            <option value="11">11:00 AM</option>
                            <option value="12">12:00 PM</option>
                            <option value="13">1:00 PM</option>
                            <option value="14">2:00 PM</option>
                            <option value="15">3:00 PM</option>
                            <option value="16">4:00 PM</option>
                            <option value="17">5:00 PM</option>
                            <option value="18">6:00 PM</option>
                            <option value="19">7:00 PM</option>
                            <option value="20">8:00 PM</option>
                            <option value="21">9:00 PM</option>
                            <option value="22">10:00 PM</option>
                            <option value="23">11:00 PM</option>
                            <option value="0">12 AM</option>
                            </select>
                        <i class="fa fa-clock-o input-icon input-icon-left" aria-hidden="true"></i>
                    </div>
                </div>
                </div>
                <div id="divAirFlight${i}Opt" class="divAirFlight${i}Opt col-xs-12 col-sm-6 col-md-4 col-lg-4"><label>&nbsp;</label>
                    <div class="air-multiple-opt">
                        <a id="delAirFlight${i}" class="air-remove-flight" href="javascript:void(0);">- Eliminar tramo</a>
                        <a id="addAirFlight${i}" class="air-add-flight" href="javascript:void(0);">+ Agregar tramo</a>
                    </div>
                </div>
        </div>
     </div>
        `
        container_multidest.innerHTML = container_multidest.innerHTML + itemsMultidest;
        if (i == 1 || i == 2) {
            if (i == 1) document.querySelector(`#divAirMultiDestination > div:nth-child(${i}) div#divAirFlight1Opt `).remove();
            if (i == 2) document.querySelector(`#divAirMultiDestination > div:nth-child(${i}) a#delAirFlight${i} `).remove();
            document.querySelector(`#divAirMultiDestination > div:nth-child(${i})`).style.display = "block";

        }
    }

    let selectTime = document.querySelectorAll('select[id*="Time"]');

    if(selectTime) selectTime?.forEach(select =>{

        let selectStamp = `
            <option value="">Cualquiera</option>
            <option value="6">Por la mañana</option>
            <option value="13">Por la tarde</option>
            <option value="19">Por la noche</option>
            <option value="1">1:00 AM</option>
            <option value="2">2:00 AM</option>
            <option value="3">3:00 AM</option>
            <option value="4">4:00 AM</option>
            <option value="5">5:00 AM</option>
            <option value="6">6:00 AM</option>
            <option value="7">7:00 AM</option>
            <option value="8">8:00 AM</option>
            <option value="9">9:00 AM</option>
            <option value="10">10:00 AM</option>
            <option value="11">11:00 AM</option>
            <option value="12">12:00 PM</option>
            <option value="13">1:00 PM</option>
            <option value="14">2:00 PM</option>
            <option value="15">3:00 PM</option>
            <option value="16">4:00 PM</option>
            <option value="17">5:00 PM</option>
            <option value="18">6:00 PM</option>
            <option value="19">7:00 PM</option>
            <option value="20">8:00 PM</option>
            <option value="21">9:00 PM</option>
            <option value="22">10:00 PM</option>
            <option value="23">11:00 PM</option>
            <option value="0">12 AM</option>
        `
        select.innerHTML = selectStamp;
    })

    let selectTimeCar = document.querySelectorAll('#CarDates select[id*="Time"]');

    if(selectTimeCar) selectTimeCar?.forEach(select =>{

        let selectStamp = `
        <option value="0600">Por la mañana</option>
        <option value="1300">Por la tarde</option>
        <option value="1900">Por la noche</option>
        <option value="0100">1:00 AM</option>
        <option value="0200">2:00 AM</option>
        <option value="0300">3:00 AM</option>
        <option value="0400">4:00 AM</option>
        <option value="0500">5:00 AM</option>
        <option value="0600">6:00 AM</option>
        <option value="0700">7:00 AM</option>
        <option value="0800">8:00 AM</option>
        <option value="0900">9:00 AM</option>
        <option value="1000">10:00 AM</option>
        <option value="1100">11:00 AM</option>
        <option value="1200">12:00 PM</option>
        <option value="1300">1:00 PM</option>
        <option value="1400">2:00 PM</option>
        <option value="1500">3:00 PM</option>
        <option value="1600">4:00 PM</option>
        <option value="1700">5:00 PM</option>
        <option value="1800">6:00 PM</option>
        <option value="1900">7:00 PM</option>
        <option value="2000">8:00 PM</option>
        <option value="2100">9:00 PM</option>
        <option value="2200">10:00 PM</option>
        <option value="2300">11:00 PM</option>
        <option value="0000">12 AM</option>
        `
        select.innerHTML = selectStamp;
    })


    let tabUL = document.querySelector("#widget-tabs")
    
    tabs.forEach((tab,index) =>{
        let liStamp = 
        `<li role="presentation" data-sort="${index}" >
                    <a href="#${tab.tab}" aria-controls="${tab.tab}" role="tab" data-toggle="tab">
                        <i class="fa ${tab.icon}" aria-hidden="true"></i>
                        <span>${tab.text}</span>
                    </a>
        </li>`;

        tabUL.innerHTML = tabUL.innerHTML + liStamp;
    })
    tabUL.querySelector('li').classList.add('active');

}


// widgetSearchForm2

$(document).ready(function() {
    function changeFormat() {
    if (window.innerWidth >= 1024) {
            let widget = '.widget_search';
            if ($('input:radio[name=AirTripType]:checked').val() != "MD") {
                $(`${widget} #divAirCities`).removeClass("row").removeClass("col-md-100").addClass("col-md-50");
                $(`${widget} #divAirCarCities`).removeClass("row").removeClass("col-md-100").addClass("col-md-50");
                $(`${widget} #AireDatesPassengers`).removeClass("row").removeClass("col-md-100").addClass("col-md-50");
                $(`${widget} #AirCarDatesPassengers`).removeClass("row").removeClass("col-md-100").addClass("col-md-50");
                $(`${widget} #divAirSpecialOptionsControl`).removeClass("row").addClass("col-md-80");
                if (window.innerWidth >= 1024) {
                    $(`${widget} #divBusCities`).removeClass("row").removeClass("col-md-100").addClass("col-md-50");
                    $(`${widget} #divBusDatesPassengers`).removeClass("row").removeClass("col-md-100").addClass("col-md-50");                
                }
            } else {
                $(`${widget} #divAirCities`).removeClass("row").removeClass("col-md-50").addClass("col-md-100");
                $(`${widget} #AirCarDatesPassengers`).removeClass("row").removeClass("col-md-50").addClass("col-md-100");
                $(`${widget} #AireDatesPassengers`).removeClass("row").removeClass("col-md-50").addClass("col-md-100");
                $(`${widget} #divBusDatesPassengers`).removeClass("row").removeClass("col-md-50").addClass("col-md-100");
                $(`${widget} #divAirSpecialOptionsControl`).removeClass("row").removeClass("col-md-80").addClass("col-md-100");
                if (window.innerWidth >= 1024) {
                    $(`${widget} #divBusCities`).removeClass("row").removeClass("col-md-100").addClass("col-md-50");
                    $(`${widget} #divBusDatesPassengers`).removeClass("row").removeClass("col-md-100").addClass("col-md-50");                
                }
            }
        }
    }
    if(document.querySelector('fieldset.fdsAirTripType.upTripType'))
    document.querySelector('fieldset.fdsAirTripType.upTripType').addEventListener('click',target =>{    
        changeFormat();        
    })

    function widgetEstructure(widget) {
    
            changeFormat();
            $(`${widget} #divAirHotelCities`).removeClass("row").addClass("col-md-40");
            $(`${widget} #divBusHotelCities`).removeClass("row").addClass("col-md-40");
            $(`${widget} #BusHotelDatesPassengers`).removeClass("row").addClass("col-md-60");
            $(`${widget} #BusHotelDatesPassengers .col-lg-9`).removeClass("row").addClass("col-md-60");
            $(`${widget} #BusHotelDatesPassengers .col-lg-3`).removeClass("row").addClass("col-md-40");
            $(`${widget} #AirHotelDatesRooms`).removeClass("row").addClass("col-md-60");
            $(`${widget} #AirHotelDatesRooms .col-lg-9`).removeClass("row").addClass("col-md-60");
            $(`${widget} #AirHotelDatesRooms .col-lg-3`).removeClass("row").addClass("col-md-40");
            $(`${widget} #divAirHotelTogglePromoCode`).removeClass("row").addClass("col-md-50");
            $(`${widget} #divAirHotelTogglePromoCode .col-lg-4`).addClass("col-md-100");
            $(`${widget} #BtnAirHotel`).removeClass("row").addClass("col-md-100");
            $(`${widget} #divAirHotelSpecialOptionsControl`).removeClass("row");
            $(`${widget} #divAirHotelSpecialOptionsControl`).detach().appendTo('#divAirHotelTogglePromoCode');    
    
            $(`${widget} #divExtraDestination`).removeClass("row").addClass("col-md-30");
            $(`${widget} #divExtraDates`).removeClass("row").addClass("col-md-70");
            $(`${widget} #divExtraTogglePromoCode`).removeClass("row").addClass("col-md-50");
            $(`${widget} #divExtraTogglePromoCode .col-lg-4`).addClass("col-md-100");
            $(`${widget} #BtnExtras`).removeClass("row").addClass("col-md-100");
         
    }
    if ($('.widget_search')) {
        widgetEstructure('.widget_search');
    }


    setTimeout(() => {
        if (window.innerWidth >= 1024) {
            if(document.querySelector('.fdsAirTripType')){
            document.querySelector('.fdsAirTripType').addEventListener('click',(check)=>{

                if((check.target.tagName == "INPUT"  && check.target.checked == true && check.target.id == "rdAirTripTypeMD") || check.target.classList.value.includes("divAirTripTypeMD")){
                        document.querySelector('#NetacticaAir').style.display = "block"
                }
                else{ 
                        document.querySelector('#NetacticaAir').style.display = "grid"
                }
                
            })
        }
        }
    }, 1000);


    function mobileIcon(){

        if (window.innerWidth <= 1024) {
            // air
            if (document.querySelector('a[href="#air"]')) {
                document.querySelector('input#txtAirCityFrom').placeholder = "Volando desde";
                document.querySelector('input#txtAirCityTo').placeholder = "Volando hacia";        
                document.querySelector('div#divAirPassengersGuests i').outerHTML = `<div class="img-input-search"><img src="https://netactica.com/Portals/0/Images/icons/passenger.svg"/></div>`;
                document.querySelectorAll('.air-destination.destination-group i').forEach(i => {
                    
                    i.outerHTML = `<div class="img-input-search"><img src="https://netactica.com/Portals/0/Images/icons/plane.svg"></div>`;
                    
                })
            }
    
            // hoteles     
            if (document.querySelector('a[href="#hotel"]')) {
                document.querySelector('input#txtHotelDateFrom').placeholder = `Check-in`; 
                document.querySelector('input#txtHotelDateTo').placeholder = `Check-out`;            
            }            
            
            // extras 
            if (document.querySelector('a[href="#extra"]')) {
                document.querySelector('input#txtExtraDateFrom').placeholder = `Desde`; 
                document.querySelector('input#txtExtraDateTo').placeholder = `Hasta`;            
            }      
            // autos
            if (document.querySelector('a[href="#car"]')) {
                document.querySelector('.divCarTimePickup i').outerHTML = `<div class="img-input-search"><img src="https://netactica.com/Portals/0/Images/icons/clock--v1.png"/></div>`;
                document.querySelector('.divCarTimeDropoff i').outerHTML = `<div class="img-input-search"><img src="https://netactica.com/Portals/0/Images/icons/clock--v1.png"/></div>`;           
            }      
    
            // global                
            document.querySelectorAll('.widget-tab-container i.fa.fa-calendar').forEach(icon =>{
                icon.outerHTML = `<div class="img-input-search"><img src="https://netactica.com/Portals/0/Images/icons/datepicker.svg"></div>`;
            }) 
            document.querySelectorAll('div.tab-content.widget-tab-container i.fa.fa-user.input-icon.input-icon-left').forEach(icon =>{
                icon.outerHTML = `<div class="img-input-search"><img src="https://netactica.com/Portals/0/Images/icons/ic-people.svg"></div>`; 
            }) 
            document.querySelectorAll('div.tab-content.widget-tab-container i.fa.fa-bed.input-icon.input-icon-left').forEach(icon =>{
                icon.outerHTML = `<div class="img-input-search"><img width="22px" src="https://netactica.com/Portals/0/Images/icons/external-bed-furniture-dreamstale-lineal-dreamstale-3.png"/></div>`; 
            }) 
            
            document.querySelectorAll('div.tab-content.widget-tab-container div:not(.air-destination.destination-group) i.fa.fa-map-marker.input-icon.input-icon-left').forEach(icon =>{
                icon.outerHTML = `<div class="img-input-search"><img width="22px" src="https://netactica.com/Portals/0/Images/icons/ic-search.svg"/></div>`; 
            }) 
        }
        
    }
    setTimeout(() => {
        mobileIcon()
    }, 1000);
});