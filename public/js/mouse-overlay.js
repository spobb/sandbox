const el = document.querySelector('.mouse-overlay');

document.addEventListener('mousemove', event => {
    const x = event.clientX - el.offsetLeft ?? 0;
    const y = event.clientY - el.offsetTop ?? 0;

    document.documentElement.style.setProperty('--x', `${x}px`)
    document.documentElement.style.setProperty('--y', `${y}px`)
}); 