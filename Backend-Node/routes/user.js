const express= require('express');
const { HandleSignup,HandleLogin } = require('../controllers/user.js');

const router= express.Router();

router.post('/signup',HandleSignup);
router.post('/login',HandleLogin);
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('_id');
    res.status(200).json({ message: 'Logged out successfully' });
  });

module.exports = router;