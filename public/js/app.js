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

