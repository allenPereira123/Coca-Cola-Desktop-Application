const register = document.getElementById('register');

register.addEventListener('click', () => {
    window.electronAPI.loadPage('register.html');
})


