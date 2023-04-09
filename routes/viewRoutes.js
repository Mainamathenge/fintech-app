const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getOverview);

router.get('/favicon.ico', (req, res) => res.status(204));

module.exports = router;
