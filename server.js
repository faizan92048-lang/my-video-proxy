const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/stream', async (req, res) => {
    const videoUrl = req.query.videoUrl;
    if (!videoUrl) return res.status(400).send("URL missing");

    try {
        const response = await axios({
            method: 'get',
            url: videoUrl,
            headers: {
                'Authorization': `Bearer ${process.env.AUTH_TOKEN}`,
                'Range': req.headers.range || 'bytes=0-',
                'User-Agent': 'Mozilla/5.0'
            },
            responseType: 'stream'
        });

        res.status(response.status);
        res.set(response.headers);
        response.data.pipe(res);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

app.listen(PORT, () => console.log(`Server running`));
