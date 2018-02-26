@extends('welcome')
@section('title', 'TEst')

@section('content')
    <div class="main-header">
    	<div class="col-sm-12 col-lg-12">
				<div class="col-lg-2 col-sm-4">
					<a href="/" class="logo">
						<span class="logo-lg"> DRABR 
						<span class="logoSlogan">"Say what you want to Say"</span>
						</span>
					 </a>
				 </div>
				 
			    
		<div class="clearfix"></div>
	</div>

	<div class="main-body">
		<div class='pin bounce'></div>
		<div class='pulse'></div>
		<div class="message">
			<p>Please allow gps to access location!</p>
			
		</div>

	</div>
	<div class="overlay " style="display:none"><span class="wait"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></span></div>
@endsection	