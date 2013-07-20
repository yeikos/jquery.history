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

test('$.history.ieCondition', function() {

	var x;

	for(x=6;x<=10;++x)

		ok(true, 'You are' + ($.history.ieCondition('IE ' + x) ? ' ' : ' not ') + 'over IE ' + x);

});

test('$.history.unlisten', 2, function() {

	$(window).on('popstate.history hashchange.history', function() {

		ok();

	});

	$.history.unlisten();

	$(window).trigger('popstate.history hashchange.history');

	ok(!$('#jQueryHistory').length);

	ok($.history.type() === null);

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


function handler(_type, _start, _finish) {

	$.history.on('load', function(event, url, type) {

		ok(url === '/example1?var=1#bottom');
		ok(type === _type);

		ok(url === $.history.url());
		ok(type === $.history.type());

	}).on('change', function(event, url, type) {

		ok(url === '/example2#top');
		ok(type === _type);

		ok(url === $.history.url());
		ok(type === $.history.type());

		$.history.push('/example3');
		$.history.push('/example4');

	}).on('push', function(event, url, type) {

		if (url === '/example3')

			return event.preventDefault();

		ok(url === '/example4');
		ok(type === _type);

		ok($.history.url() === '/example2#top');
		ok(type === $.history.type());

	}).on('pushed', function(event, url, type) {

		ok(url === '/example4');
		ok(type === _type);

		ok(url === $.history.url());
		ok(type === $.history.type());

		$.history.off().unlisten();

		_finish();

		ok($.history.type() === null);

		start();

	});

	_start();

	ok($.history.url() === '/example1?var=1#bottom');
	ok($.history.type() === _type);

}

asyncTest('$.history.listen("hash", [interval])', function() {

	location.hash = '/example1?var=1#bottom';

	handler('hash', function() {

		$.history.listen('hash', true);

	}, function() {

		location.hash = '';

	});

	location.hash = '/example2#top';

});

asyncTest('$.history.listen("hash")', 19, function() {

	location.hash = '/example1?var=1#bottom';

	handler('hash', function() {

		$.history.listen('hash');

	}, function() {

		location.hash = '';

	});

	location.hash = '/example2#top';

});

if (location.protocol === 'file:') {

	(function() {

		var message = '$.history.listen("pathname") can not run over FILE protocol.';

		if (typeof console === 'object' && typeof console.log === 'function')

			return console.log(message);

		alert(message);

	})();

} else {

	asyncTest('$.history.listen("pathname")', 19, function() {

		window.history.pushState({}, null, '/example1?var=1#bottom');

		handler('pathname', function() {

			$.history.listen('pathname');

		}, function() {

			window.history.pushState({}, null, pathname);

		});

		window.history.pushState({}, null, '/example2#top');

		var event = $.Event('popstate.history');

		event.originalEvent = { state: true };

		$(window).trigger(event);

	});

}