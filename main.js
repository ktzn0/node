const http = require("http");
const fs = require("fs");
const ytdl = require("ytdl-core")

function serveMedia(url)
{

}

function serveFile(path)
{
    if (path == "/") path = "/index.html";
    return fs.readFileSync(__dirname + path);
}

http.createServer(async (req, res) =>
{
    try
    {
        if (req.url.startsWith("/media"))
        {
            var video;
            var audio;

            let url = req.url.substr(7);
            let media = await ytdl.getInfo(url);
            let formats = media.formats;

            let videoFormats = ytdl.filterFormats(formats, "videoonly");
            for (var i = 0; i < videoFormats.length; i++)
            {
                if (videoFormats[i].isDashMPD) continue;
                else 
                {
                    video = videoFormats[i].url;
                    break;
                }
            }

            let audioFormats = ytdl.filterFormats(formats, "audioonly");
            for (var i = 0; i < audioFormats.length; i++)
            {
                if (audioFormats[i].isDashMPD) continue;
                else 
                {
                    audio = audioFormats[i].url;
                    break;
                }
            }

            res.writeHead(200);
            res.end(JSON.stringify({ audio: audio, video: video }));
        }
        else
        {
            res.writeHead(200);
            res.end(serveFile(req.url));
        }
    }
    catch (error)
    {
        res.writeHead(500);
        res.end();
    }
}).listen(80);