const {Router} = require('express')

const router = Router()

router.use('/',require('./users'))
router.use('/articles',require('./articles'))

module.exports = router