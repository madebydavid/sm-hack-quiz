const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const fetch = require('node-fetch');
const morgan = require('morgan');

const getRandomGUID = require('./lib/getRandomGUID');
const getSimpleItem = require('./lib/getSimpleItem');

// bootstrapping
var app = express();

// allow decoding json from a text-plain so we can avoid cors issues
app.use(bodyParser.json({ type: '*/*' })); 
app.use(bodyParser.urlencoded({ extended: false }));

// logging
app.use(morgan('combined'));

// cors
const corsOptions = { credentials: true, origin: true };
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// session handling
app.use(session({
    secret: 'some secret thing',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: (365 * 24 * 3600 * 1000) } // sessions last 365 days
}));


/**
 * Starts / restarts a session
 */
app.get('/api/start', (req, res, next) => {

    if (req.session) {
        req.session.destroy();

        res.status(200).json({'status': 'ok'});
        return next();
    }

});

/**
 * Returns a collection of random questions
 */
app.get('/api/questions', (req, res, next) => {

    const randomQuestionsURL = 'http://collection.sciencemuseum.org.uk/search?filter%5Bhas_image%5D=true&filter%5Bmuseum%5D=Science%20Museum&page%5Bsize%5D=50&page%5Btype%5D=search&random=3';

    // get three random items
    fetch(randomQuestionsURL, {
        headers: {
            Accept: 'application/vnd.api+json'
        }
    }).then((res) => {
        return res.json();
    }).then((json) => {

        // simplify the data from the api to id, image and description
        let simpleItems = json.data.map(getSimpleItem);

        // pick one randomly to be correct
        let correctItem = simpleItems[
            Math.floor(Math.random() * simpleItems.length)
        ];

        // random guid for this question - used to save the correct answer in
        // the session
        let questionGUID = getRandomGUID();

        // save the correct answer in the session
        req.session.correctAnswers = req.session.correctAnswers || {};
        req.session.correctAnswers[questionGUID] = correctItem.id; 

        // return in the format discussed
        res.status(200).json({
            questionNumber: questionGUID,
            images: simpleItems.map((item) => ({
                id: item.id,
                image: item.image
            })),
            text: correctItem.description,
            title: 'Not sure what goes here'
        });
        return next();

    }).catch((error) => {
        res.status(500).json(error.toString());
        return next();
    })

});

/**
 * For answering a question
 */
app.post('/api/questions/:questionGUID', (req, res, next) => {



});

module.exports = app;