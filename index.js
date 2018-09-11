const express = require('express')
var request = require('request-promise');
const cheerio = require('cheerio')
var Config = require('./config');


const app = express();
var port = normalizePort(process.env.PORT || '3000');

app.get('/', async function (req, res) {
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
    const options = {
        uri: url,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    const $ = await request(options);
    console.log($);
    return $;
}
