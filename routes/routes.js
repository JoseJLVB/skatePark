const express = require('express')
const { get_users, set_auth } = require('../db.js')

const router = express.Router()

// Rutas internas
function protected_routes (req, res, next) {
    if(!req.session.user) {
        req.flash('errors', 'Debe ingresar al sistema primero')
        return  res.redirect('login')
    }
    next()
}

router.get('/admin' , protected_routes, async (req, res) => {
    const user = req.session.user

    const users = await get_users()

    res.render('admin.html')
})

router.get('/', protected_routes, (req, res) => {
    const user = req.session.user

    res.render('evidencias.html', { user })
});

router.put('/users/:id', async (req, res) => {
    console.log(req.params);
    console.log(req.body);

    await set_auth(req.params.id, req.body.new_auth)

    res.json({todo: 'ok'})
})

module.exports = router