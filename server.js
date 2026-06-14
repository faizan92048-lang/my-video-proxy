const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/stream', async (req, res) => {
    const videoUrl = req.query.videoUrl;
    if (!videoUrl) return res.status(400).send("Video URL is missing");

    try {
        const response = await axios({
            method: 'get',
            url: videoUrl,
            headers: {
                'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
                'User-Agent': 'Mozilla/5.0'
            },
            responseType: 'stream',
            timeout: 60000 // Timeout badha diya taaki video load ho sake
        });

        // Headers forward karo taaki browser ko pata chale ki ye video hai
        res.set(response.headers);
        response.data.pipe(res);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).send({ error: "Proxy Failed", details: error.message });
    }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
