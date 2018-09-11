const express = require('express')
var request = require('request-promise');
const cheerio = require('cheerio')
var Config = require('./config');


const app = express();
var port = normalizePort(process.env.PORT || '3000');

app.get('/', async function (req, res) {
    res.send("Hello");
})

app.get('/f', async function (req, res) {
    var body = await getPage(1);
    res.send(body);
})

app.listen(port, () => console.log('Example app listening on port 3000!'))

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

async function getPage(page) {
    var url = Config.urlHome + "&order=desc&page=" + page;
    url = "https://stackoverflow.com/questions/6968448/where-is-body-in-a-nodejs-http-get-response"
    const options = {
        uri: url,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    const $ = await request(options);
    var text = "";
    $('.voz-post-message').each(function(i, element) {
        var qoute = $(this).find(".voz-bbcode-quote");
        if(qoute != undefined) {
            text += "//" + removeSpec($(qoute).text());
            $(this).find(".voz-bbcode-quote").remove();
            text += "##" + removeSpec($(this).text());
        } else {
            text += "##" + removeSpec($(this).text());
        }
    });
    $('div').each(function(i, element) {
        text += "##" + removeSpec($(this).text());
    })
    return text;
}

function removeSpec(text){
    return text.trim()
    .replace(/\r?\n|\r/g,'')
    .replace(/\t/g, '')
}
