/* Author:Zeshan Amjad */

(function($) {

	var obj = {
		form: {
			DOM: {
				el: $('.paymentForm'),
				submit: $('.submit'),
				errorPanel: $('.errors')
			},
			values: {
				name: function(){
					console.log(obj);
					return obj.form.DOM.el.find('input[name=name]').val();
				},
				amount: function(){
					return parseFloat(obj.form.DOM.el.find('input[name=amount]').val()) * 100;
				},
				currency: function(){
					return obj.form.DOM.el.find('input[name=currency]').val();
				}
			},
			logic: {
				stripeToken: {
					request: function() {
						Stripe.setPublishableKey('pk_test_sRjxiUTTITIte6y7uYKjkiv8');
						Stripe.createToken(obj.form.DOM.el, obj.form.logic.stripeToken.responseHandler);
					},
					responseHandler: function(status, response) {
						//console.log("Token Object: ");
						//console.log(response);

						if(response.error) {
							obj.form.logic.errorHandler(response.error);
						} else {
							obj.form.logic.serverPost.postHandler(response.id);
						}
					},
					getToken: function() {
						obj.form.logic.stripeToken.request();
					}
				},
				serverPost: {
					postHandler: function(token) {
						$.ajax({
							url: 'http://localhost:3000/pay/stripe',
							crossDomain: true,
							type: 'POST',
							data: {
								name: obj.form.values.name(),
								amount: obj.form.values.amount(),
								currency: obj.form.values.currency(),
								stripeToken: token
							},
							dateType: 'json',
							success: function(data) {
								obj.form.logic.serverPost.successHandler(data);
							},
							error: function(error) {
								obj.form.logic.errorHandler(error);
							}
						});
					},
					successHandler: function(data) {
						console.log(data);
					}
				},
				createCharge: function() {
					obj.form.logic.stripeToken.request();
				},
				errorHandler: function(error) {
					console.error(error.message);
				}
			},
			bind: function() {
				obj.form.DOM.submit.click(function() {
					obj.form.logic.createCharge();
				});
			}
		},
		init: function() {
			obj.form.bind();
		}
	};

	obj.init();

})(jQuery);
