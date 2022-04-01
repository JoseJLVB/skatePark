const express = require('express')
const bcrypt = require('bcrypt')
const { get_users, set_estado, get_user, update_user } = require('../db.js')

const router = express.Router()

// Rutas internas
function protected_routes (req, res, next) {
    if (!req.session.user) {
    req.flash('errors', 'Debe ingresar al sistema primero')
    return res.redirect('/login')
    }
    next()
}

router.get('/admin', protected_routes, async (req, res) => {
    const user = req.session.user
  // me traigo a lista de todos los usuarios
    const users = await get_users()

    res.render('admin.html', { user, users })
});

router.get('/', protected_routes, (req, res) => {
    const user = req.session.user

    res.render('index.html', { user })
});

router.get('/datos', protected_routes, async (req, res) => {
    const user = req.session.user
    const users = await get_users()
    res.render('datos.html', { user, users })
})

router.post('/datos', protected_routes, async(req,res) => {
    const email = req.session.user.email
    const name = req.body.name
    const password = req.body.password
    const password_confirm = req.body.password_confirm
    const years = req.body.years
    const speciality = req.body.speciality

    const user = await get_user(email)
    if(!user) {
        req.flash('errors', 'Usuario ya existe o contraseña incorrecta')
        return res.redirect('login')
    }

    if(password != password_confirm) {
        req.flash('errors', 'Las contraseñas no coinciden')
        return res.redirect('login')
    }

    const password_encrypt = await bcrypt.hash(password, 10)

    await update_user(email, name, password_encrypt, parseInt(years), speciality)
    req.session.user = { email, name, password, years, speciality }
    res.redirect('/')
})

router.put('/users/:id', async (req, res) => {
    console.log(req.params);
    console.log(req.body);

    await set_estado(req.params.id, req.body.new_estado)

    res.json({todo: 'ok'})
})



module.exports = router