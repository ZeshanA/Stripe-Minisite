// Modules
var express = require('express'),
	http = require('http'),
	sanitizer = require('sanitizer');

// App-specific
var app = express(),
	apikey = 'sk_test_gevmV80YwHTDADleyqPRrGs1',
	stripe = require('stripe')(apikey);

// Server Configuration
app.configure(function(){
	// Port
	app.set('port', process.env.PORT || 3000);

	app.use(express.bodyParser());
});

app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.post('/pay/stripe', function(req, res) {
	console.log(req.body);
	var charge = stripe.charges.create({
		amount: sanitizer.sanitize(req.body.amount),
		currency: sanitizer.sanitize(req.body.currency),
		card: sanitizer.sanitize(req.body.stripeToken)
	}, function(err, charge) {
		if(err) {
			console.log(err);
		}
		else {
			res.json('Nice one');
			console.log('Success');
		}
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});