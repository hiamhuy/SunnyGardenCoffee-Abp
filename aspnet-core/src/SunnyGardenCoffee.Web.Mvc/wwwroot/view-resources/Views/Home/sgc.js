
$(document).ready(function () {
    $(".navbar .nav-link").on('click', function (event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function () {
                window.location.hash = hash;
            });
        }
    });
});

new WOW().init();

let mybutton = document.getElementById("btnToTop");
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    var body = $("html,body")
    body.stop().animate({ scrollTop: 0 }, 500, 'swing', function () {

    });
}

function scrollToElement() {
    var element = document.getElementById("anh").offsetTop;
    var body = $("html,body")
    body.stop().animate({ scrollTop: element }, 500, 'swing', function () {

    });
    //element.scrollIntoView();
}


function showNavbarMobi() {
    var menu = document.querySelector(".navbar__links");
    menu.classList.toggle("navbar__open");
}

function showOrder() {
    var orderContainer = document.querySelector(".order__food");
    orderContainer.classList.toggle("order__open");
}
function hiddenOrder() {
    var orderContainer = document.querySelector(".order__food");
    orderContainer.classList.remove("order__open");
}

function openCartOrder() {
    var cartOrder = document.querySelector(".cart__order");
    cartOrder.classList.toggle("isActive");
    var order_modal_content = document.querySelector(".order_modal_content");
    order_modal_content.classList.remove('isActive')
    order_modal_content.classList.toggle("isHidden");

}

function closeCart() {
    var cartOrder = document.querySelector('.cart__order');
    cartOrder.classList.remove('isActive');

    var order_modal_content = document.querySelector(".order_modal_content");
    order_modal_content.classList.remove('isHidden')
    order_modal_content.classList.toggle("isActive");
}
