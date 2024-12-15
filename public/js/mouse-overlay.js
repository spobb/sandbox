const el = document.querySelector('.mouse-overlay');
document.addEventListener('mousemove', event => {
    const x = event.clientX - 128;
    const y = event.clientY - 128;

    document.documentElement.style.setProperty('--x', `${x}px`)
    document.documentElement.style.setProperty('--y', `${y}px`)
    // document.documentElement.style.setProperty('--color', `hsl(${((((x + y) / (window.innerWidth + window.innerHeight)) * 255))}, 70%, 70%)`)
});