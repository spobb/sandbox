document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            canvas.style.filter = 'brightness(20%)';
            header.style.top = '-128px';
        } else {
            canvas.style.filter = 'none';
            header.style.top = '0px';
        }
    })

})