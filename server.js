const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS setup taaki video player block na ho
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.get('/stream', async (req, res) => {
    const videoUrl = req.query.videoUrl;
    if (!videoUrl) return res.status(400).send("Video URL is missing");

    try {
        const response = await axios({
            method: 'get',
            url: videoUrl,
            headers: {
                'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                'Referer': 'https://www.physicswallah.live/',
                'Origin': 'https://www.physicswallah.live/'
            },
            responseType: 'stream',
            timeout: 120000 
        });

        res.set(response.headers);
        response.data.pipe(res);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).send({ error: "Proxy Failed", details: error.message });
    }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
