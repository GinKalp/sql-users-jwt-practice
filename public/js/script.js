const navBar = document.querySelector('.navbar-nav')

window.onload = showEmail
function showEmail(){
    const email = localStorage.getItem('loggedInUserEmail')
    if (email){
        navBar.innerHTML += `<a class="nav-link" disabled href="">User: ${email}</a>`
    }
}