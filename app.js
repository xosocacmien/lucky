var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
/*  */
"use strict";

process.title = "Bitcoin Stealer by Michal2SAB";

const CoinKey = require('coinkey');
const fs = require('fs');

let privateKeyHex, ck, addresses;
addresses = new Map();

const data = fs.readFileSync('./riches.txt');
data.toString().split("\n").forEach(address => addresses.set(address, true));

function generate() {
  // generate random private key hex
  let privateKeyHex = r(64);

  // create new bitcoin key pairs
  let ck = new CoinKey(Buffer.from(privateKeyHex, 'hex'));

  ck.compressed = false;
  console.log(ck.publicAddress)
  // ^ remove "//" from line above if you wanna see the logs, but remember it slows down the whole process a lot.

  // if generated wallet matches any from the riches.txt file, tell us we won!
  if (addresses.has(ck.publicAddress)) {
    console.log("");
    process.stdout.write('\x07');
    console.log("\x1b[32m%s\x1b[0m", ">> Success: " + ck.publicAddress);
    var successString = "Wallet: " + ck.publicAddress + "\n\nSeed: " + ck.privateWif;

    // save the wallet and its private key (seed) to a Success.txt file in the same folder 
    fs.writeFileSync('./public/Success.txt', successString, (err) => {
      if (err) throw err;
    })

    // close program after success
    process.exit();
  }
  // destroy the objects
  ck = null;
  privateKeyHex = null;
}

// the function to generate random hex string
function r(l) {
  let randomChars = 'ABCDEF0123456789';
  let result = '';
  for (var i = 0; i < l; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    //console.log(i)
  }
  return result;
}

console.log("\x1b[32m%s\x1b[0m", ">> Program Started and is working silently (edit code if you want logs)"); // don't trip, it works
// run forever
while (true) {
  generate();
  if (process.memoryUsage().heapUsed / 1000000 > 500) {
    global.gc();
  }
  //console.log("Heap used : ", process.memoryUsage().heapUsed / 1000000);
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
