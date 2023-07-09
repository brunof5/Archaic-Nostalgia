import express from 'express'
import gerenciarConsoleController from '../controllers/gerenciarConsole.controller.js'

const router = express.Router()

router.post('/cadastrarConsole', gerenciarConsoleController.cadastrarConsole)
router.delete('/deletarConsole/:inputId', gerenciarConsoleController.deletarConsole)
router.put('/editarConsole/:inputId', gerenciarConsoleController.editarConsole)
router.get('/visualizarConsoles', gerenciarConsoleController.visualizarConsoles)
router.get('/visualizarConsoles/:inputId', gerenciarConsoleController.visualizarConsole)

export default router