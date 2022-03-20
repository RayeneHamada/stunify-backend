
const mongoose = require('mongoose'),
  Subscription = mongoose.model('Subscriptions');
User = mongoose.model('Users');
const stripe = require('stripe')('sk_test_51KP08pLMtIUZpRLREAa8uysOP9BeHwZuOX88GEO99T5kXcOKjkKoVc4b3kuqRNdwhUH1PhRxIgAWlTNkkUoWhqe500boZr5U3p');



exports.create = async (req, res) => {
  const customerId = req.customerId;

  // Create the subscription
  const priceId = req.body.priceId;

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    sub = new Subscription();
    sub.owner = req._id;
    sub.plan = req.body.plan;
    sub.subscriptionId = subscription.id;
    sub.save((err, doc) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      else {
        res.send({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
      }
    })


  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }

}
exports.confirmSubscriptionPayment = function(req,res){
  console.log(req.body);
}

exports.cancel = async (req, res) => {
  try {
    const deletedSubscription = await stripe.subscriptions.del(
      req.body.subscriptionId
    );

    res.send({ subscription: deletedSubscription });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }

}
