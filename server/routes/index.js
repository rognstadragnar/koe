import express from 'express'
import api from './api'

let router = express.Router()



router.use('/api', api)
router.get('*', (req, res) => {
	res.render('index')
})

export default router