const router = require('express').Router();
const promoterController = require('../controllers/promoter.controller');

router.post('/signup', promoterController.signup);
router.get('/logout', promoterController.logout);
router.get('/login', promoterController.login);
router.get('/auth', promoterController.auth);

module.exports = router;