//Change navBar background on scroll
window.onscroll = function () {
    var navMobile = document.getElementById('nav-mobile');
    var scroll = window.scrollY;
    if (scroll > 200) {
        navMobile.style.backgroundColor = 'black';
        navMobile.style.transition = 'ease-in 0.5s';
    } else {
        navMobile.style.backgroundColor = 'transparent';
    }
} 