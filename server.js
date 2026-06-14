const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/stream', async (req, res) => {
    const videoUrl = req.query.videoUrl;
    
    if (!videoUrl) {
        return res.status(400).send("Video URL is missing");
    }

    try {
        const decodedUrl = decodeURIComponent(videoUrl);

        const response = await axios({
            method: 'get',
            url: decodedUrl,
            headers: {
                'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
                'Range': req.headers.range || 'bytes=0-',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                'Referer': 'https://www.physicswallah.live/',
                'Origin': 'https://www.physicswallah.live/',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Connection': 'keep-alive'
            },
            responseType: 'stream',
            maxRedirects: 5
        });

        res.status(response.status);
        res.set(response.headers);
        response.data.pipe(res);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
