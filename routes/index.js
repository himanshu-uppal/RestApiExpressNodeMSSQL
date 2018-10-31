const {Router} = require('express')

const router = Router()

router.use('/',require('./users'))
router.use('/articles',require('./articles'))
router.use('/profiles',require('./profiles'))

module.exports = router