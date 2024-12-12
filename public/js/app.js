const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            (entry.target).classList.add('animation-end');
            (entry.target).classList.remove('animation-start');
        } else {
            (entry.target).classList.remove('animation-end');
        }
    });
});

const waves = document.querySelectorAll('.animation-start');
waves.forEach((el) => {
    observer.observe(el);
});

const canvas = document.querySelector('canvas');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        canvas.style.filter = 'blur(4px) brightness(50%)';
    } else {
        canvas.style.filter = 'blur(1px) brightness(100%)';
    }
})