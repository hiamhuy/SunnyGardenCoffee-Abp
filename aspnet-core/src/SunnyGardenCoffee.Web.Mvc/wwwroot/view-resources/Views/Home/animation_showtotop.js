let items = document.querySelectorAll(".item_animation");
document.addEventListener('scroll', (event) => {
    items.forEach(i => {
        if (i.offsetTop - window.scrollY < 400) {
            i.classList.add('active_animation')
        }
    })
})