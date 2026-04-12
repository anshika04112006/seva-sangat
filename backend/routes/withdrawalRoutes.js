const express = require('express');
const router = express.Router();
const { 
    requestWithdrawal, 
    getWithdrawals, 
    getMyWithdrawals, 
    updateWithdrawalStatus 
} = require('../controllers/withdrawalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, requestWithdrawal)
    .get(protect, admin, getWithdrawals);

router.route('/my')
    .get(protect, getMyWithdrawals);

router.route('/:id')
    .put(protect, admin, updateWithdrawalStatus);

module.exports = router;
