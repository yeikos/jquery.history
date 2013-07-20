<!DOCTYPE html><html>

    <head>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

		<script src="http://files.yeikos.com/jquery.history.js"></script>

		<script>
			
			$(function() {

				var type;

				$.history.on('load change', function(event, url, type) {

					if (event.type === 'change' || (event.type === 'load' && type === 'hash'))

						request(url);

				}).listen();

				type = $.history.type();

				if (type === 'hash' && location.pathname.length > 1) {

					// /pathname -> /#/pathname

					location.href = '/#' + location.pathname;

				} else if (type === 'pathname' && location.hash.substr(1, 1) === '/') {

					// /#/pathname -> /pathname

					location.href = location.hash.substr(1);

				}

				// dom listener

				$('body').on('click', 'a', function(event) {

					var url = $(this).attr('href');

					$.history.push(url);

					request(url);

					event.preventDefault();

				});

				// request

				function request(url) {

					$('#output').text(url);

				}

			});

		</script>

	</head>

	<body>

		<div>time: <?php echo time(); ?></div>

		<ul>

			<li><a href="/one">one</a></li>

			<li><a href="/two">two</a></li>

			<li><a href="/three">three</a></li>

			<li><a href="/four">four</a></li>

		</ul>

		<div id="output">

			<?php 

				echo isset($_GET['section']) ? htmlspecialchars('/' . $_GET['section']) : ''; 

			?>

		</div>

	</body>

</html>