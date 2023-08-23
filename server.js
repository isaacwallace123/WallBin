require('dotenv').config()
const express = require('express');
const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const Document = require('./models/Document');

const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGOLOGIN, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

app.get('/', (req,res) => {
    const code =`WALLBIN
    
Hello, and welcome to my "pastebin"!
    
This (Currently Unnamed) pastebin website is literally just here to help developers send and store important code.

This website is only here to simply give a free service to all developers.`;
    
    res.render('code-display', { code, language: 'plaintext' });
});

app.get('/new', (req,res) => {
    res.render("new");
})

app.post('/save', async (req,res) => {
    const value = req.body.value;

    try {
        const document = await Document.create({ value });

        res.redirect(`/${document.id}`);
    } catch(err) {
        res.render("new", { value });
    }
});

app.get('/:id/duplicate', async (req,res) => {
    const id = req.params.id;

    try {
        const document = await Document.findById(id);

        res.render('new', { value: document.value });
    } catch(err) {
        res.redirect(`/${id}`);
    }
});

app.get('/:id', async (req,res) => {
    const id = req.params.id;

    try {
        const document = await Document.findById(id);

        res.render('code-display', { code: document.value, id });
    } catch(err) {
        res.redirect('/');
    }
});

app.listen(process.env.PORT || 5000);