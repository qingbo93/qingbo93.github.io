$(document).ready(function(){
  $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
  if (this.hash !== "") {
    event.preventDefault();
    var hash = this.hash;
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 800, function(){
      window.location.hash = hash;
      });
    }
  });
})
	$(window).scroll(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
        if (pos < winTop + 500) {
          $(this).addClass("slide");
        }
    });
  });

	function onVideoClick(theLink) {
	    document.getElementById("video_pop").innerHTML = "<video autoplay muted loop id=\"the_Video\"><source src=\""+theLink+"\" type=\"video/webm\"></video>";
	    document.getElementById("video_pop").style.display="block";
	}

	function onPopClick() {
	    document.getElementById("video_pop").style.display="none";
	    document.getElementById("video_pop").innerHTML = "";
	}
