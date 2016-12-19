import express from 'express'
import shortid from 'shortid'

let router = express.Router()

router.post('/enter', (req, res) => {
	if (!req.session.user) req.session.user = shortid.generate()
	res.sendStatus(200)

})

export default router