const express = require('express')
const router = express.Router()
const categorieController = require('../controllers/categorieController')
const requireAuth = require('../middleware/RequireAuth')

router.use(requireAuth)
router.get('/',categorieController.ShowUserCategories)

router.post('/',categorieController.AddCategorie)

module.exports=router 