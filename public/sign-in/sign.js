const form = document.querySelector('.form-signin')
const navBar = document.querySelector('.navbar-nav')

const url = 'http://localhost:3000/auth'

window.onload = showEmail

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const options = {
        method: 'POST',
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify(Object.fromEntries(formData))
    }
    const res = await fetch(url + '/login', options)
    const data = await res.json()
    console.log(data)

    if (data.msg === 'User logged in'){
        localStorage.setItem('loggedInUserToken', data.data.token)
        localStorage.setItem('loggedInUserEmail', data.data.user.email)
        showEmail()
    }
})
function showEmail(){
    const email = localStorage.getItem('loggedInUserEmail')
    if (email){
        navBar.innerHTML += `<a class="nav-link" disabled href="">User: ${email}</a>`
    }
}