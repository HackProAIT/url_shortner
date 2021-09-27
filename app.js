const express = require('express')
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortner',{
    useNewUrlParser : true
})
const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended : false}))

app.get('/', async (req,res)=>{
    const shortUrls = await shortUrl.find()
    res.render('index', {shortUrls : shortUrls})
})

app.post('/shortUrls', async(req, res)=>{
    await ShortUrl.create({full : req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async(req,res)=>{
    const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl})
    if(!shortUrl)
        res.sendStatus(404)
    await shortUrl.clicks++
    await shortUrl.save()

    res.redirect(shortUrl.full)
})

const port = process.env.PORT || 3000
app.listen(port)
 
console.log('listening on port', port, '.........')