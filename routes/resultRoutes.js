const express = require("express");
const { getResumes } = require("../controllers/resultController");
const router = express.Router();

const axios = require("axios");



router.get("/get-resumes", async (req, res) => {
    res.json({ message: "This is a test response." });
});

router.get("", async (req, res) => {
    res.json({ message: "This is a inside /api/results" });
});

router.post("/get-resumes", getResumes);


module.exports = router;
