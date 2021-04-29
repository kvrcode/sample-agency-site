function navEventHandler() {
    this.classList.toggle('is-active');
    const nav = this.parentElement.childNodes[3]; //can do this since html isnt changing at all
    nav.classList.toggle('nav-active');
}

export const navEventListener = () => {
    const btn = document.querySelector('.hamburger');
    btn.addEventListener('click', navEventHandler);
}