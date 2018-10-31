const {Router} = require('express')

const router = Router()

router.use('/',require('./users'))
router.use('/articles',require('./articles'))
router.use('/profiles',require('./profiles'))
router.use('/tags',require('./tags'))

module.exports = router