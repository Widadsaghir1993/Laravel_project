<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
         <meta content="IE=edge" http-equiv=X-UA-Compatible> <meta content="width=device-width,initial-scale=1" name=viewport>
        <title>App Name - @yield('title')</title>
        <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script type="text/javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
        <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
       <link rel="stylesheet" type="text/css" href="{{ '/css/style.css'}}" />
       <!-----<link rel="stylesheet" type="text/css" href="{{ '/css/app.css'}}" />-------->

        <!-- Styles -->
   </head>
    <body class="skin-blue">
         <div >
            @yield('content')
        </div>
		<!-- Histats.com (div with counter) --><!------<div id="histats_counter"></div>----->

     <script src="js/custom.js"></script>
	 <noscript><a href="/" target="_blank"><img src="//sstatic1.histats.com/0.gif?3879551&101" alt="invisible hit counter" border="0"></a></noscript>
    </body>
</html>
