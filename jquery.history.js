/*!
 * @name jQuery.history v1.1.0
 * @author yeikos
 * @repository https://github.com/yeikos/jquery.history
 * @dependencies jQuery 1.7.0+

 * Copyright 2013 yeikos - MIT license
 * https://raw.github.com/yeikos/js.merge/master/LICENSE
 */

;(function($, undefined) {

	var Public = function(url) {

		var event = $.Event('push');

		Public.context.trigger(event, [url, _type]);

		if (event.isDefaultPrevented())

			return Public;

		// Establecemos la nueva dirección siempre y cuando haya cambiado

		if (_type === 'pathname') {

			if (_last !== url)

				window.history.pushState({}, null, _last = url);

		} else if (_type === 'hash') {

			if (_last !== url) {

				location.hash = _last = url;

				// Si se trata de IE6/IE7

				if (_ie67) {

					// El `iframe` ha de encontrarse en el documento

					if (!$('#jQueryHistory').length)

						throw new Error('jQuery.' + publicName + '.push: iframe not found.');

					// Si es la primera vez

					if (_firstTime) {

						_firstTime = 0;

						// Añadimos primero al historial una entrada vacía para que el usuario
						// pueda volver al inicio de página, de lo contrario saldrá fuera de ella

						_iframe.contentWindow.document.open().close();
						_iframe.contentWindow.location.hash = '/';

					}

					// Cambiamos la dirección del `iframe` para simular el historial

					_iframe.contentWindow.document.open().close();

					_iframe.contentWindow.location.hash = url;

				}

			}

		} else {

			// Es necesario que se haya iniciado una escucha activa para establecer una dirección

			throw new Error('jQuery.' + publicName + '.push: the listening is not active.');

		}

		Public.context.trigger('pushed', [url, _type]);

		return Public;

	}, publicName = 'history';

	// Contexto donde se centralizan los eventos (`load`, `change`, `push`, `pushed`)

	Public.context = $({});

	// Accesos directos a los métodos `on`, `off` y `trigger`

	$.each(['on', 'off', 'trigger'], function(index, method) {

		Public[method] = function() {

			Public.context[method].apply(Public.context, arguments);

			return Public;

		};

	});

	// Acceso directo a la función principal

	Public.push = Public;

	// Obtiene el tipo de escucha actual (`pathname`, `hash`, `null`)

	Public.type = function() {

		return _type;

	};

	// Obtiene la dirección actual según el tipo de escucha

	Public.url = function(_location) {

		_location = _location || location;

		if (_type === null)

			throw new Error ('jQuery.' + publicName + '.url: the listening has not started.');

		if (_type === 'pathname')

			return _location.pathname + _location.search + _location.hash;

		if (_location.hash.length > 1) {

			spl = _location.href.split('#');

			spl.shift();

			spl = spl.join('#');

			return spl;

		}

		return '';

	};

	// Inicializa una escucha en el documento para intervenir los cambios del historial y poder establecer direcciones

	Public.listen = function(type, interval) {

		// Desactivamos posibles escuchas anteriores

		Public.unlisten();

		var size = arguments.length;

		// Detección automática del modo de escucha

		if (!size || type === 'auto') {

			type = _pushState ? 'pathname' : 'hash';

			size = 1;

		} else if (type !== 'pathname' && type !== 'hash') {

			throw new Error('jQuery.' + publicName + '.listen: type is not valid.');

		}

		// Si el modo de escucha es `hash`

		if (type === 'hash') {

			// Si no hay soporte para `onhaschange` y no se especificó un intervalo, o el intervalo es `true`

			if ((!_onhashchange && size === 1) || interval === true) {

				// Establecemos el intervalo de la configuración

				interval = Public.config.interval;

				size = 2;

			}

			// Si el intervalo fue fijado comprobamos si su valor es correcto

			if (size === 2 && (isNaN(interval) || interval < 1))

				throw new Error('jQuery.' + publicName + '.listen: interval delay is not valid.');

		}

		// Si el modo de escucha es `pathname`

		if ((_type = type) === 'pathname') {

			// Ha de haber soporte nativo

			if (!_pushState)

				throw new Error('jQuery.' + publicName + '.listen: this browser has not support to pushState.');

			// Cuando haya un cambio en la dirección URL

			$(window).on('popstate.history', function(event) {

				// Si se trata de un evento real originado internamente por el navegador
				// y la dirección ha cambiado emitimos el evento `change`

				if (event.originalEvent && event.originalEvent.state && _last !== location.pathname)

					Public.trigger('change', [_last = Public.url(), 'pathname']);

			});

			if (location.pathname.length > 1)

				Public.trigger('load', [Public.url(), 'pathname']);

		} else {

			// Si hay soporte nativo de `onhashchange` y no se especificó el argumento intervalo

			if (_onhashchange && !interval) {

				// Hacemos uso del evento nativo `hashchange`

				$(window).on('hashchange.history', function(event) {

					var hash = Public.url();

					if (_last !== hash)

						Public.trigger('change', [_last = hash, 'hash']);

				});

			// Si no hay soporte o simplemente se especificó el argumento intervalo

			} else {

				// Si no se ha detecto si el navegador es IE6/IE7

				if (_ie67 === undefined)

					// Realizamos la comprobación una sola vez

					_ie67 = Public.ieCondition('lte IE 7');

				// Si se trata de IE6/IE7

				if (_ie67) {

					// Es necesario que se encuentre disponible `body` (dom ready)

					if (!(size = $('body')).length)

						throw new Error('jQuery.' + publicName + '.listen: document is not ready.');

					// Creamos un `iframe` con el que emular el historial

					_iframe = $('<iframe id="jQueryHistory" style="display:none" src="javascript:void(0);" />').appendTo(size)[0];

					var win = _iframe.contentWindow;

					// Si el documento ya contiene una dirección, la establecemos en el `iframe`

					if (location.hash.length > 1) {

						win.document.open().close();

						win.location.hash = '#' + Public.url();

					}

					// Emulamos el evento `haschange` mediante un intervalo

					_interval = setInterval(function() {

						// Si la dirección actual es diferente a la del `iframe`

						if ((_last = '#' + Public.url()) !== ('#' + Public.url(win.location))) {

							// Actualizamos la dirección del `iframe`

							win.document.open().close();

							win.location.hash = _last;

							Public.trigger('change', [_last.substr(1), 'hash']);

						}

					}, interval);

				} else {

					// Emulamos el evento `haschange` mediante un intervalo

					_last = Public.url();

					_interval = setInterval(function() {

						var hash = Public.url();

						if (_last !== hash)

							Public.trigger('change', [_last = hash, 'hash']);

					}, interval);

				}

			}

			// Si ya se encuentra un `hash` definido en el documento

			if (location.hash.length > 1)  {

				// Emitimos el evento `load`

				Public.trigger('load', [Public.url(), 'hash']);

			}

		}

		return Public;

	};

	// Desactiva cualquier tipo de escucha realizada por `listen`

	Public.unlisten = function() {

		_type = _last = _iframe = null;

		$(window).off('popstate.history hashchange.history');

		$('#jQueryHistory').remove();

		clearInterval(_interval);

		return Public;

	};

	// Obtiene el soporte de ciertas funcionalidades del navegador

	Public.getSupports = function(type) {

		var result = {},

			size = arguments.length,

			docmode;

		if (!size || type === 'pushState')

			result.pushState = ('pushState' in window.history);

		if (!size || type === 'onhashchange')

			result.onhashchange = ('onhashchange' in window && ((docmode = document.documentMode) === undefined || docmode > 7 ));

		if (size)

			return result[type];

		return result;

	};

	// Comprueba si el navegador corresponde con las versiones de IE especificadas

	Public.ieCondition = function(input) {

		var id = Math.random().toString(36).substring(2),
			name = '_ie_condition_' + id,
			$msie, result;

		$msie =	$('<span><!--[if ' + $('<i/>').html(input).text() + ']><script type="text/javascript">window.' + name + '=true;</script><![endif]--></span>').appendTo(document.body);

		result = (window[name] === true);

		try {

			delete window[name];

		} catch(e) {

			window[name] = undefined;

		}

		$msie.remove();

		return result;

	};

	// Soporte de funcionalidades del navegador

	Public.supports = Public.getSupports();

	// Configuración

	Public.config = {

		// Retraso del intervalo en la emulación del evento `haschange`

		interval: 100

	};

	// Accesos directos a los soportes

	var _pushState = Public.supports.pushState,

		_onhashchange = Public.supports.onhashchange,

	// Versión IE6/7

		_ie67 = Public.ieCondition('lte IE 7'),

	// Tipo actual de escucha

		_type = null,

	// Intervalo utilizado por la emulación del evento `hashchange`

		_interval,

	// Iframe utilizado para generar el historial en IE6/IE7

		_iframe,

	// Marcador utilizado por IE6/IE7

		_firstTime = 1,

	// Última dirección establecida

		_last;

	// Acceso desde al exterior

	$[publicName] = Public;

})(jQuery);