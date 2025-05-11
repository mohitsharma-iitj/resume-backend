const axios = require("axios");
const https = require("https");

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const MAX_CONCURRENCY = 8;

const getResumes = async (req, res) =>{
    const { firstName, lastName, rollNumber } = req.body;
    const pdfLinks = [];
    const baseUrl = "http://osp.iitj.ac.in/media/resume";
    console.log(`Searching for resumes of: ${firstName} ${lastName}, Roll No: ${rollNumber}`);


    const urls = [];
    for (let i = 3700; i <= 4100; i++) {
        const number = i.toString().padStart(4, "0");
        const pdfUrl = `${baseUrl}/${firstName}_${lastName}_${rollNumber}_${number}_IITJodhpur.pdf`;
        urls.push(pdfUrl);
    }

    const fetchPdf = async (url) => {
        try {
        const response = await axiosInstance.get(url, { responseType: "arraybuffer" });
        if (response.status === 200) {
            console.log(`Found PDF at: ${url}`);
            return url;
        }
        } catch (error) {
        if (error.response?.status !== 404) {
            console.error(`Error for ${url}:`, error.message);
        }
        }
        return null;
    };

    const runInBatches = async (allUrls, concurrency) => {
        const results = [];
        for (let i = 0; i < allUrls.length; i += concurrency) {
            const batch = allUrls.slice(i, i + concurrency);
            const batchResults = await Promise.allSettled(batch.map(fetchPdf));
            for (const result of batchResults) {
                if (result.status === "fulfilled" && result.value) {
                results.push(result.value);
                break; // Exit if one PDF found
                }
            }
            // if (results.length > 0) break; // Stop all batches once one PDF is found
        }
        return results;
    };

    const foundLinks = await runInBatches(urls, MAX_CONCURRENCY);

    if (foundLinks.length === 0) {
        console.log("No PDFs found in the range.");
    }

    res.json({ pdfLinks: foundLinks });
};

module.exports = { getResumes };
