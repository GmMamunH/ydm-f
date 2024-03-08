const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const PORT = 300;
// ===============================

app.use(express.static("public"))
// code=======================================
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.get("/video", (req, res) => {
    res.sendFile(__dirname + "/video.html");
});
app.get("/thum", (req, res) => {
    res.sendFile(__dirname + "/thum.html");
});
app.get("/audio", (req, res) => {
    res.sendFile(__dirname + "/audio.html");
});
// code ==========================================

// ytdl server================================================================
app.get('/thumbnail', async (req, res) => {
    const videoUrl = req.query.url;

    try {
        const info = await ytdl.getInfo(videoUrl);
        let video = '';
        let audio = '';
        info.formats.forEach((format) => {
            if(format.mimeType.includes('video/mp4') && format.qualityLabel === '720p'){
                video = format.url;
            }

            if(format.mimeType.includes('audio/mp4')){
                audio = format.url;
            }
        });
        //console.log(info.formats);
        const thumbnails = info.videoDetails.thumbnails;
        thumbnails.reverse();
        // only take first two items in the array
        thumbnails.length = 1;
        const thumbnailUrl = thumbnails[0].url;
        res.json({ thumbnailUrl, video, audio});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Unable to fetch thumbnail' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});