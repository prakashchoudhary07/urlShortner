const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrls');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true, useUnifiedTopology: true
})


app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', {shortUrls});
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ fullUrl: req.body.fullUrl });
    res.redirect('/');
})

app.get('/:shortUrl', async (req, res) => {
    const url = await ShortUrl.findOne({shortUrl: req.params.shortUrl});
    if(url == null) return res.sendStatus(404);
    url.visits++;
    
    url.save();

    res.redirect(url.fullUrl);
})

app.listen(process.env.PORT || 5000);
