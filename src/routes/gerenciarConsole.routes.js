import express from 'express'
import gerenciarConsoleController from '../controllers/gerenciarConsole.controller.js'

const router = express.Router()

router.post('/cadastrarConsole', gerenciarConsoleController.verificaCampos)

export default router