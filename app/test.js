const should = require('should'); 
const assert = require('assert');
const request = require('supertest');  
const session = require('supertest-session');

const app = require('./app');

describe('Undefined App', () => {

    it('it should play a game', () => { 

        let playerSession;

        return startNewGame()
            .then((session) => {
                playerSession = session;

                return getQuestion(session);
            })
            .then((question) => {

                return answerQuestion(
                    playerSession,
                    question.questionNumber,
                    question.images[1].id
                );

            })
            .then((result) => {
                console.log(result);

                return getScore(playerSession)
            })
            .then((score) => {
                console.log(score);
            })

    });


});


function startNewGame() {
 
    let playerSession = session(app);

    const executor = (resolve, reject) => {
        playerSession
            .get('/api/start')
            .end((err, res) => {
                if (err) return reject(err);
                return resolve(playerSession);
            });
    };

    return new Promise(executor);
}


function getQuestion(playerSession) {

    const executor = (resolve, reject) => {
        playerSession
            .get('/api/questions/')
            .end((err, res) => {
                if (err) return reject(err);
                return resolve(res.body);
            });
    };

    return new Promise(executor);

}

function answerQuestion(playerSession, questionGUID, answerID) {

    const executor = (resolve, reject) => {
        playerSession
            .post(`/api/questions/${questionGUID}`)
            .send({ id: answerID })
            .end((err, res) => {
                if (err) return reject(err);
                return resolve(res.body);
            });
    };

    return new Promise(executor);
}

function getScore(playerSession) {

    const executor = (resolve, reject) => {
        playerSession
            .get('/api/score/')
            .end((err, res) => {
                if (err) return reject(err);
                return resolve(res.body);
            });
    };

    return new Promise(executor);
}