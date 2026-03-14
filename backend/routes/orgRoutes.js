const express = require('express');
const router = express.Router();
const {
    addOrganization,
    getOrganizations,
    getOrganizationById
} = require('../controllers/orgController');

router.post('/', addOrganization);
router.get('/', getOrganizations);
router.get('/:id', getOrganizationById);

module.exports = router;
