$(document).ready(function () {
    var owl = $('.owl-carousel');
    owl.owlCarousel({
        items: 4,
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsiveClass: true,
        dots: true,
        nav: false,
        responsive: {
            0: {
                items: 1,
                nav: false,
                loop: true
            },
            600: {
                items: 2,
                nav: false,
                loop: true
            },
            1000: {
                items: 4,
                loop: true
            }
        }
    });

});

