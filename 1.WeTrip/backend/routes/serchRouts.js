const express = require("express");
const router = express.Router();

const { searchDestino } = require("../controllers/searchController");

router.post("/", searchDestino);

module.exports = router;