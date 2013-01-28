<!DOCTYPE html><html>

    <head>

		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>

		<script type="text/javascript" src="https://raw.github.com/yeikos/jquery.history/master/jquery.history.js"></script>

		<script type="text/javascript">
			
			$(function() {

				if (!$.history.supports.pushState && location.pathname.length > 1) {

					// /pathname -> /#/pathname

					location.href = '/#' + location.pathname;

				} else if ($.history.supports.pushState && location.hash.substr(1, 1) === '/') {

					// /#/pathname -> /pathname

					location.href = location.hash.substr(1);

				}

				// history

				$.history.on('load change', function(event, url, type) {

					if (event.type === 'change' || (event.type === 'load' && type === 'hash'))

						request(url);

				}).listen();

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

				echo isset($_GET['section']) ? htmlspecialchars($_GET['section']) : ''; 

			?>

		</div>

	</body>

</html>