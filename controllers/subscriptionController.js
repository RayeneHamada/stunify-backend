
const mongoose = require('mongoose'),
  Subscription = mongoose.model('Subscriptions');
User = mongoose.model('Users');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



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

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });

  } catch (error){
    return res.status(400).send({ error: { message: error.message } });

  }

}
exports.mySubs = async (req, res) => {
  const sub = await Subscription.find({ owner: req._id });

  Subscription.find({ owner: req._id },
    async (err, sub) => {
      if (!sub)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else {
        /*const subscription = await stripe.subscriptions.retrieve(
          sub.subscriptionId
        );*/
        res.send(sub);
      }
    });
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
