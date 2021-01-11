// DARK MODE TOGGLE
// <https://blog.jim-nielsen.com/2018/icon-galleries-dark-mode/>
// <https://medium.com/@dizzyup/adding-a-little-dark-magic-to-the-web-8eb82ce5fd91>
// <https://dev.to/ananyaneogi/create-a-dark-light-mode-switch-with-css-variables-34l8>

document.getElementById('dark-mode-toggle').addEventListener('click', function () {
    var html = document.getElementsByTagName('html')[0];
    if (html.classList.contains('is-dark-mode')) {
        html.classList.remove('is-dark-mode');
        localStorage.setItem('dark-mode', 'false');
    } else {
        html.classList.add('is-dark-mode');
        localStorage.setItem('dark-mode', 'true');
    }
});

// IMAGE LAZY LOADING
// <https://css-tricks.com/a-few-functional-uses-for-intersection-observer-to-know-when-an-element-is-in-view/>

let observer = new IntersectionObserver(
(entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (window.matchMedia('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)').matches === true) {
                entry.target.srcset = entry.target.dataset.srcset;
            } else {
                entry.target.src = entry.target.dataset.src;
            }
            observer.unobserve(entry.target);
        }
    });
}, {rootMargin: "500px 0px"});

document.querySelectorAll('.thumb').forEach(img => { observer.observe(img) });