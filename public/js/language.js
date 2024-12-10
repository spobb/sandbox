const en = document.querySelectorAll('[lang="en"]:not(html)');
const fr = document.querySelectorAll('[lang="fr"]');

const lang = document.querySelector < HTMLInputElement > ('[name="lang"]');

document.addEventListener('DOMContentLoaded', () => {
    const langPicker = document.getElementById('lang-picker');
    if (!langPicker) return;

    langPicker.addEventListener('change', (e) => {
        const target = e.target;
        const langValue = target.value;
        if (langValue === 'en') {
            delete document.documentElement.dataset['lang'];
            en.forEach(el => el.style.display = 'initial');
            fr.forEach(el => el.style.display = 'none');
        } else {
            document.documentElement.dataset['lang'] = langValue;
            fr.forEach(el => el.style.display = 'initial');
            en.forEach(el => el.style.display = 'none');
        }
    });
});

