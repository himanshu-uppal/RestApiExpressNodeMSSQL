const {Router} = require('express')

const router = Router()

router.use('/',require('./users'))

module.exports = router