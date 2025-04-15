const themeToggler = document.querySelector('.theme-toggler')
console.log(themeToggler)

function toggleTheme (){
    console.log('hello')
    document.body.classList.add('darkmode')
}


themeToggler.addEventListener('click', toggleTheme)