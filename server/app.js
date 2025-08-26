const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const cache = {};

app.use(morgan('dev'));

app.get('/', async function (req, res) {
  try {
    const key = Object.keys(req.query)[0];   // e.g. "t"
    const value = req.query[key];            // e.g. "Baby Driver"

    if (!key || !value) {
      return res.status(400).send('Missing query parameter');
    }

    if (cache[value]) {
      return res.json(cache[value]);
    }

    const url = `http://www.omdbapi.com/?apikey=8730e0e&${key}=${encodeURIComponent(value)}`;
    const response = await axios.get(url);

    cache[value] = response.data;
    res.json(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

module.exports = app;

      



