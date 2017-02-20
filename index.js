$(document).ready(function() {
    $(".navbar a, a[href='#about']").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {
                window.location.hash = hash;
            });
        }
    });
})
$(window).scroll(function() {
    $(".slideanim").each(function() {
        var pos = $(this).offset().top;

        var winTop = $(window).scrollTop();
        if (pos < winTop + 500) {
            $(this).addClass("slide");
        }
    });
});

function onVideoClick(theLink) {
    document.getElementById("video_pop").innerHTML = "<video autoplay muted loop id=\"the_Video\"><source src=\"" + theLink + "\" type=\"video/webm\"></video>";
    document.getElementById("video_pop").style.display = "block";
}

function onPopClick() {
    document.getElementById("video_pop").style.display = "none";
    document.getElementById("video_pop").innerHTML = "";
}

function myFunction() {
    var navbar = document.getElementById("aNavbar");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        navbar.className += " w3-animate-top";
        navbar.className = navbar.className.replace("w3-opacity", "");
    } else {
        navbar.className += " w3-opacity";
        navbar.className = navbar.className.replace("w3-animate-top", "");
    }
}
$(document).ready(function() {
        // Transition effect for navbar
        $(window).scroll(function() {
          // checks if window is scrolled more than 500px, adds/removes solid class
          if($(this).scrollTop() > 500) {
              $('.navbar').addClass('solid');
          } else {
              $('.navbar').removeClass('solid');
          }
        });
});
