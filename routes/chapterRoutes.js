const express = require('express');

const {getChapters, getChaptersById, uploadChapters} = require('../controllers/chapterController');

const rateLimiter = require('../middlewares/rateLimiter');
const cache = require('../middlewares/cache');
const auth = require('../middlewares/auth');
const router = express.Router();


router.get('/',rateLimiter,cache, getChapters);

router.get('/:id',rateLimiter, getChaptersById);

router.post('/upload',rateLimiter,auth,uploadChapters);

module.exports = router;