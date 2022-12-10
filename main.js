const http = require("http");
const fs = require("fs");
const ytdl = require("ytdl-core")
const ytpl = require("ytpl")

function serveFile(path)
{
    if (path == "/") path = "/index.html";
    return fs.readFileSync(__dirname + path);
}

http.createServer(async (req, res) =>
{
    try
    {
        if (req.url.startsWith("/song"))
        {
            var video;
            var audio;

            let url = req.url.substring(6);
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
                if (audioFormats[i].isDashMPD || audioFormats[i].container != "mp4") continue;
                else 
                {
                    audio = audioFormats[i].url;
                    break;
                }
            }

            res.writeHead(200);
            res.end(JSON.stringify({ audio: audio, video: video }));
        }
        else if (req.url.startsWith("/playlist"))
        {
            try 
            {
                let url = req.url.substring(10);
                let playlist = await ytpl(url);
                res.writeHead(200);
                res.end(JSON.stringify(playlist));
            }
            catch (err)
            {
                console.log(err);
            }
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