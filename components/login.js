document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault()

        var email = document.getElementById('email').value.trim()
        var password = document.getElementById('password').value

        sessionStorage.setItem('zonix_email', email)

        if (email === 'admin@admin' && password === 'admin') {
            sessionStorage.setItem('zonix_user', 'admin')
            window.location.href = 'admin-productos.html'
        } else {
            sessionStorage.setItem('zonix_user', 'user')
            window.location.href = 'index.html'
        }
    })
})
