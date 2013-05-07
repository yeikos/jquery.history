var pathname = location.pathname + location.search + location.hash;

test('$.history.context', function() {

	ok($.history.context instanceof jQuery && $.history.context.length === 1);

});

test('$.history.on', 2, function() {

	$.history.on('test', function(event, a, b) {

		ok(event instanceof $.Event);
		ok(a === 'a' && b === 'b');

	});

	$.history.context.trigger('test', ['a', 'b']).off();

});

test('$.history.off', 0, function() {

	$.history.on('test', function() {

		ok();

	}).off();

	$.history.context.trigger('test');

});

test('$.history.trigger', 2, function() {

	$.history.on('test', function(event, a, b) {

		ok(event instanceof $.Event);
		ok(a === 'a' && b === 'b');

	}).trigger('test', ['a', 'b']).off();

});

test('$.history.getSupports', function() {

	var supports = $.history.getSupports();

	ok($.type(supports) === 'object');
	ok($.type(supports.pushState) === 'boolean');
	ok($.type(supports.onhashchange) === 'boolean');

	ok($.type($.history.getSupports('pushState')) === 'boolean');
	ok($.type($.history.getSupports('onhashchange')) === 'boolean');
	ok($.type($.history.getSupports('not-exists')) === 'undefined');

});

test('$.history.supports', function() {

	var supports = $.history.supports;

	ok($.type(supports) === 'object');
	ok($.type(supports.pushState), 'boolean');
	ok($.type(supports.onhashchange), 'boolean');

});

test('$.history.isIE67', function() {

	var ie = $.history.isIE67();

	ok(true, 'You are' + (ie ? ' ' : ' not ') + 'on IE <= 7');

});

test('$.history.unlisten', 2, function() {

	$(window).on('popstate.$.history hashchange.$.history', function() {

		ok();

	});

	$('<div id="jQuery$.history" style="display:none" />').appendTo('body');

	$.history.unlisten();

	$(window).trigger('popstate.$.history hashchange.$.history');

	ok(!$('#jQueryHistory').length);

	ok($.history.getListenType() === null);

});

test('$.history.listen', function() {

	raises(function() {

		$.history.listen('not-exists');

	});

	if (!$.history.supports.pushState)

		raises(function() {

			$.history.listen('pathname');

		});

});

asyncTest('$.history.listen("hash", [interval])', 8, function() {

	location.hash = '/example1?var=1#bottom';

	$.history.on('load', function(event, url, type) {

		ok(url === '/example1?var=1#bottom');
		ok(type === 'hash');

	}).on('push', function(event, url, type) {

		ok(url === '/example3');
		ok(type === 'hash');

		$.history.off().unlisten();

		location.hash = '';

		ok($.history.getListenType() === null);

		start();

	}).on('change', function(event, url, type) {

		ok(url === '/example2');
		ok(type === 'hash');

		$.history.push('/example3');

	}).listen('hash', true);

	ok($.history.getListenType() === 'hash');

	location.hash = '/example2';

});

asyncTest('$.history.listen("hash")', 8, function() {

	location.hash = '/example1?var=1#bottom';

	$.history.on('load', function(event, url, type) {

		ok(url === '/example1?var=1#bottom');
		ok(type === 'hash');

	}).on('push', function(event, url, type) {

		ok(url === '/example3');
		ok(type === 'hash');

		$.history.off().unlisten();

		location.hash = '';

		ok($.history.getListenType() === null);

		start();

	}).on('change', function(event, url, type) {

		ok(url === '/example2');
		ok(type === 'hash');

		$.history.push('/example3');

	}).listen('hash');

	ok($.history.getListenType() === 'hash');

	location.hash = '/example2';

});

asyncTest('$.history.listen("pathname")', 8, function() {

	if (location.protocol === 'file:') {

		ok(false, 'It\'s needed running this script over HTTP protocol to continue testing.');

		start();

		return;

	}

	window.history.pushState({}, null, '/example1?var=1#bottom');

	$.history.on('load', function(event, url, type) {

		ok(url === '/example1?var=1#bottom');
		ok(type === 'pathname');

	}).on('push', function(event, url, type) {

		ok(url === '/example3');
		ok(type === 'pathname');

		$.history.off().unlisten();

		window.history.pushState({}, null, pathname);

		ok($.history.getListenType() === null);

		start();

	}).on('change', function(event, url, type) {

		ok(url === '/example2');
		ok(type === 'pathname');

		$.history.push('/example3');

	}).listen('pathname');

	ok($.history.getListenType() === 'pathname');

	window.history.pushState({}, null, '/example2');

	var event = $.Event('popstate.history');

	event.originalEvent = { state: true };

	$(window).trigger(event);

});