const express = require("express");

const routes = express();
routes.use(express.json());

const Cmc7Controller = require('./controllers/Cmc7Controller');

routes.get('/cmc7', Cmc7Controller.generate);

module.exports = routes;