const express = require("express");
const router = express.Router();

const { searchDestino } = require("../controllers/searchController");
const { optionalProtect } = require("../middlewares/optionalAuthMiddleware");

router.post("/", optionalProtect, searchDestino);

module.exports = router;