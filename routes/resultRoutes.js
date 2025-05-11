const express = require("express");
const { getResumes } = require("../controllers/resultController");
const router = express.Router();

const axios = require("axios");


router.get("/health", async (req, res) => {
    res.json({ message: "This is a inside v1 health" });
});

router.post("/get-resumes", getResumes);


module.exports = router;
