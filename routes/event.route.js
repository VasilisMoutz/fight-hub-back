const router = require('express').Router();
const eventController = require('../controllers/event.controller');

router.get('/', eventController.findAll)
router.get('/:eventId', eventController.findOne)
router.post('/', eventController.register)


module.exports = router;