import express from 'express'
import gerenciarVendaRestauracaoController from '../controllers/gerenciarVendaRestauracao.controller.js'

const router = express.Router()

router.post('/cadastrarVendaRestauracao', gerenciarVendaRestauracaoController.cadastrarVendaRestauracao)
router.delete('/deletarVendaRestauracao/:inputId', gerenciarVendaRestauracaoController.deletarVendaRestauracao)
router.put('/editarVendaRestauracao/:inputId', gerenciarVendaRestauracaoController.editarVendaRestauracao)
router.get('/visualizarVendasRestauracoes', gerenciarVendaRestauracaoController.visualizarVendasRestauracoes)
router.get('/visualizarVendaRestauracao/:inputId', gerenciarVendaRestauracaoController.visualizarVendaRestauracao)

export default router