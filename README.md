jQuery.history v1.1.0
==================================================

What is it?
--------------------------------------

It's a jQuery plugin that lets manage the browser history using history.pushState (HTML5) and cross-browser compatibility (including IE6).

Demo online
--------------------------------------

http://fiddle.jshell.net/yeikos/rcZWb/show/light

Changelog
--------------------------------------

**v1.1.0 - 20/07/13**

- New methods: `url`, `type`.
- New event: `pushed`.

- Bug fix in `load` event.

**v1.0.1 - 07/05/13**

- Bug fix in `load` event.

**v1.0.0 - 28/01/13**

- Initial version.

Example
--------------------------------------

	<!DOCTYPE html><html>

		<head>

			<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

			<script src="http://files.yeikos.com/jquery.history.js"></script>

			<script>

				$(function() {

					$.history.on('load change push pushed', function(event, url, type) {

						alert(event.type + ': ' + url);

					}).listen('hash');

					$('body').on('click', 'a', function(event) {

						$.history.push($(this).attr('href'));

						event.preventDefault();

					});

					$('button').click(function() {

						location.reload();

					});

				});

			</script>

		</head>

		<body>

			<ul>

				<li><a href="/one">one</a></li>

				<li><a href="/two">two</a></li>

				<li><a href="/three">three</a></li>

				<li><a href="/four">four</a></li>

			</ul>

			<button>refresh</button>

		</body>

	</html>

Events
--------------------------------------

**load**

> Fired when the listen is started.

**push**

> Fired before `jQuery.history.push` is called (it can be prevented).

**pushed**

> Fired after `jQuery.history.push` is called.

**change**

> Fired when it happens a change in browser history (back, forward, go).

All events are trigger passing two arguments (address, listen type).

API Methods
--------------------------------------

**jQuery.history.push(address)**

_address: string._

> Add a new address to history (first it is needed call to `listen`).

returns `jQuery.history`.

***

**jQuery.history.listen()**

> Starts a automatic listening in base to browser support and in this order: pathname, hash or hash interval.

returns `jQuery.history`.

**jQuery.history.listen('pathname')**

> Starts a listening using `pathname` (pushState).

returns `jQuery.history`.

**jQuery.history.listen('hash')**

> Starts a listening using `hash` (onhaschange). If browser doesn't supports it, then it will use a emulation (hash interval).

returns `jQuery.history`.

**jQuery.history.listen('hash', interval)**

_interval: interval delay (number). If interval is `true`, it will convert to jQuery.history.config.interval._

> Starts a listening using an emulation (hash interval).

returns `jQuery.history`.

***

**jQuery.history.unlisten()**

> Undoes all changes done by `jQuery.history.listen`.

returns `jQuery.history`.

***

**jQuery.history.url()**

> Get the current URL.

returns `string`.

***

**jQuery.history.type()**

> Get the current listening type (hash, pathname or null).

returns `string` or `null`.

***

**jQuery.history.on**

> http://api.jquery.com/on/

returns `jQuery.history`.

***

**jQuery.history.off**

> http://api.jquery.com/off/

returns `jQuery.history`.

***

**jQuery.history.trigger**

> http://api.jquery.com/trigger/

returns `jQuery.history`.