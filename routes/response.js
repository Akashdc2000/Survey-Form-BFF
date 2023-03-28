const express = require('express');
const { saveResponse, getResponses, getResponseByResponseId } = require('../controllers/response_api');
const router = new express.Router();

router.post('/:survey_id',saveResponse)
router.get("/:survey_id",getResponses)

router.get("/id/:response_id",getResponseByResponseId)

module.exports = router;