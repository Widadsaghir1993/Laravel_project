$(document).ready(function(){
    
	
	var desc = document.getElementById("desc");
	desc.addEventListener("keydown", function (e) {
		if (e.keyCode === 13) {
			//validate(e);
			poste(e);
		}
	});


    $(document).on('click', '.post', function(){
        $('.container').fadeTo("slow", 0.5).css('pointer-events','none');
        $('.overlay').fadeTo("slow", 1);
        $('.back').trigger('click');
        var fd = new FormData();    
        fd.append('image', $('#my-file-selector')[0].files[0]);
        fd.append('desc', $('.desc').val());
        fd.append('lat', $('.lat').val());
        fd.append('long', $('.long').val());
        $.ajax({
          url: '/post',
          data: fd,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function(data){
            $('.main-body .timeline').prepend(getDataHtml(data));
            $('.overlay').fadeOut();
            $('.container').fadeTo("slow", 1).css('pointer-events','auto');
            $('#my-file-selector').val("");
            $('.desc').val("");
            $('.fileUpload').removeClass('fileUploaded');
          }, error: function(){
            $('.overlay').fadeOut();
            $('.container').fadeTo("slow", 1).css('pointer-events','auto');;
            $('.addPOst').css({ "position": "relative" });
            for (var x = 1; x <= 3; x++) {
                $('.addPOst').animate(
                    { left: -5 }, 10).animate({ left: 0 }, 50).animate({ left: 5 }, 10)
                .animate({ left: 0 }, 50);
            }
          }
        });
    });
	
	
	function poste(){
        $('.container').fadeTo("slow", 0.5).css('pointer-events','none');
        $('.overlay').fadeTo("slow", 1);
        $('.back').trigger('click');
        var fd = new FormData();    
        fd.append('image', $('#my-file-selector')[0].files[0]);
        fd.append('desc', $('.desc').val());
        fd.append('lat', $('.lat').val());
        fd.append('long', $('.long').val());
        $.ajax({
          url: '/post',
          data: fd,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function(data){
            $('.main-body .timeline').prepend(getDataHtml(data));
            $('.overlay').fadeOut();
            $('.container').fadeTo("slow", 1).css('pointer-events','auto');
            $('#my-file-selector').val("");
            $('.desc').val("");
            $('.fileUpload').removeClass('fileUploaded');
          }, error: function(){
            $('.overlay').fadeOut();
            $('.container').fadeTo("slow", 1).css('pointer-events','auto');;
            $('.addPOst').css({ "position": "relative" });
            for (var x = 1; x <= 3; x++) {
                $('.addPOst').animate(
                    { left: -5 }, 10).animate({ left: 0 }, 50).animate({ left: 5 }, 10)
                .animate({ left: 0 }, 50);
            }
          }
        });
    }
	

    $(document).on('click', '.fileUpload', function(){
        $('#my-file-selector').trigger('click');
    });


    $(document).on('change', '#my-file-selector', function(){
        $('.fileUpload').addClass('fileUploaded');
    });


    $(document).on('click', '.submitPost', function(){
        $('.postForm').submit();
    });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
	
	
	/*testing the location*/
	/*
	var lat = '';
	var lon = '';
		
		var div = document.getElementById('latlng');

div.innerHTML += 'Extra stuff';

	navigator.geolocation.getCurrentPosition(
    function(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		
         div.innerHTML += " "+lat +", " + lon;
        // alert("Lat: " + lat + "\nLon: " + lon);
    },
    function(error){
         alert(error.message);
    }, {
         enableHighAccuracy: true
              ,timeout : 5000
    }
	
);
*/

    function successFunction(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        
        $('.lat').val(lat);
        $('.long').val(long);


        $.get('/get-post?lat=' + lat + '&lon=' + long, function(data){
            if(data.length > 0) {
                $('.main-body').html('');
                html = '<ul class="timeline">';
                $.each(data, function(key, index){
                    html = html + getDataHtml(index);
                });

                
                html += '</ul>';
                $('.main-body').append(html);
            } else {
                $('.main-body').html(getNoDataHtml());
            }
        });
    }

    function errorFunction() {
        $.get('/get-post?ip=1', function(data){
            if(data.length > 0) {
                $('.main-body').html('');
                html = '<ul class="timeline">';
                
                $.each(data, function(key, index){
                    html =    html + getDataHtml(index,html);
                });
                
                html = html + '</ul>';
                $('.main-body').append(html);
            } else {
                $('.main-body').html(getNoDataHtml());
            }
        });
    }


    function getNoDataHtml()
    {
        return    `
            <div align="center" >
                    <h1 align="center" class="white-font"><i class="fa fa-info-circle"></i></h1>
                 <h4 align="center" class="white-font">No one had said someting here. Be first to say</h4> 
             </div>

             <ul class="timeline">
             </ul>
        `;
    }

    function getDataHtml(index)
    {
        var icon = '';
        var image = '';

        if (index.image){
            icon = '';
            image = '<div class="thumbnail imageList col-sm-1"><img src="/'+index.image+'"/></div>';
        }

        html = '';
        html = html +
                `<li >`+icon+`
                <div class="timeline-item">
                <input type="hidden" class="post_id" value="`+ index.id +`"/>
          <h3 class="timeline-header">
              <span class="timeSpan"><i class="fa fa-clock-o"></i></span>
              <span class="timeSec">`+ index.time_formated +`</span> 
              <a  class="head-link">`+ index.place +`</a> 
              <span class="timeSpanMap pull-right">
                <span class="mapMarker bounce"><i class="fa fa-map-marker"></span></i> 
                <span class="markerText">`+ index.distance +` Mi</span>
               </span>
            </h3>

          <div class="timeline-body">

            `+ image + index.desc +`
            <div class="clearfix"></div>
          <div >
            <span class=" pull-right commentHide">
                <span class="badge data-comment-`+index.id+`" >`+index.comment_count+`</span>
                <span class="commentsFlag"> <i class="fa fa-comments"></i></span>
            </span>
            </div>
          </div>
          <div class="clearfix">&nbsp;</div>
        </div></li>`;

        return html;
                    
    }

    $(document).on('click', '.main-body .timeline-item', function(){
        $('.main-body').addClass('hide');
        $('.desc-dev').removeClass('hide');
        $('.desc-time').html($(this).find('.timeSec').html());
        $('.desc-place').html($(this).find('.head-link').html());
        $('.desc-distance').html($(this).find('.markerText').html());
        $('.desc-body').append($(this).find('.timeline-body').html());
        $('.desc-body').find('.col-sm-1').removeClass('col-sm-1').addClass('col-sm-12 col-lg-6');
        $('.desc-id').val($(this).find('.post_id').val());
        $('.desc-dev').find('.commentHide').hide();

        $.get('/comment/' + $('.desc-id').val(), function(data){
            $.each(data, function(key,index){
                $('.commentsTag').append(makeComentHtml(index));
            });
        });
    });

    $(document).on('click', '.back', function(){
        $('.desc-dev').addClass('hide');
        $('.main-body').removeClass('hide');
        $('.data-comment-' + $('.desc-id').val()).html($('.commentText').length);
        $('.desc-body').html('');
        $('.commentsTag').html('');
        $('.sidebar-form').removeClass('hide');
    });

    $(document).on('click', '.commentBtn', function(){
         $.ajax({
          url: '/comment',  
          data: {comment: $('.comment').val(), post_id:  + $('.desc-id').val()},
          type: 'POST',
          success: function(data){
                $('.comment').val('');
                $('.commentsTag').prepend(makeComentHtml(data));            
          }, error: function(){
                $('.addcomment').css({ "position": "relative" });
                for (var x = 1; x <= 3; x++) {
                    $('.addcomment').animate(
                        { left: -5 }, 10).animate({ left: 0 }, 50).animate({ left: 5 }, 10)
                    .animate({ left: 0 }, 50);
                }
          }
        });
    });

    function makeComentHtml(data) {
        var html = '';
        html  =  html + `
        <div class="commentText">
        <span class="timeSpanNew"><i class="fa fa-clock-o"></i> `+data.time_formated+`</span>
            <i>"`+data.comment+`"</i>
            <i class="fa fa-comment"></i>
        </div>
        `;

        return html;
    }
	
	
});


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-104759082-1', 'auto');
ga('send', 'pageview');


var _Hasync= _Hasync|| [];
_Hasync.push(['Histats.start', '1,3879551,4,6,200,40,00000001']);
_Hasync.push(['Histats.fasi', '1']);
_Hasync.push(['Histats.track_hits', '']);
(function() {
var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
hs.src = ('//s10.histats.com/js15_as.js');
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
})();