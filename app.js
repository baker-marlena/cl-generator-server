const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const items = require('./routes/items')
const users = require('./routes/users')

app.use(cors());
app.use(bodyParser.json());

app.use('/user', users)
app.use('/items', items)
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: req.app.get("env") === "development" ? err.stack : {}
    });
});

app.listen(process.env.PORT || 3000);
