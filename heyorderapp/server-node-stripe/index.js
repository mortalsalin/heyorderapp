//**************************************************************************************************************
//If you are going to make changes in this file, remember to make the changes into the deploinment file too

//**************************************************************************************************************

var secretKey = "sk_test_f8Afm3wGMNyR92oCEh8YMHxL";//use test key from your account on stripe.com secret key

var stripe = require('stripe')(secretKey);
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

router.post('/processpay', function (request, response) {
    var stripetoken = request.query.stripetoken;
    var amountpayable = request.query.amount;


    var charge = stripe.charges.create({
        amount: parseInt(amountpayable)*100,
        currency: 'usd',
        description: 'Sample transaction',
        source: stripetoken
    }, function (err, charge) {
        if (err){
            console.log(err);
        }else{
            console.log('success');
            response.send({ success: true });
        }
    })
})

app.use(router);
app.listen(3333, function () {
    console.log('Server started');
})
