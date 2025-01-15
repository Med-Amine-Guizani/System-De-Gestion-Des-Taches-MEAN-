const express = require('express')
const router = express.Router()
const TaskController = require('../controllers/taskController')
const requireAuth = require('../middleware/RequireAuth')

router.use(requireAuth)
router.get('/',TaskController.ShowTasks)

router.get('/:title',TaskController.ShowTask)

router.post('/',TaskController.AddTask)

router.delete('/:id',TaskController.DeleteTask)

router.patch('/:id',TaskController.ModifieTask)













module.exports=router 