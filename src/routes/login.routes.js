import express from 'express'
import loginController from '../controllers/login.controller.js'

const router = express.Router()

router.get('/:nomeLogin/:senhaLogin', loginController.verificaCampos)

export default router