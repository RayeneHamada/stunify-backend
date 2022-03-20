  
const mongoose  = require('mongoose'),
Plan = mongoose.model('Plans');
User = mongoose.model('Users');
const stripe = require('stripe')('sk_test_51KP08pLMtIUZpRLREAa8uysOP9BeHwZuOX88GEO99T5kXcOKjkKoVc4b3kuqRNdwhUH1PhRxIgAWlTNkkUoWhqe500boZr5U3p');



exports.newPlan = async (req, res) => {
    p = new Plan();
    p.name = req.body.name;
    p.price = req.body.price;
    p.duration = req.body.duration;
    const price = await stripe.prices.create({
        unit_amount: req.body.price,
        currency: 'chf',
        recurring: { interval: 'month',interval_count: req.body.duration},
        product_data:{
            name:req.body.name
        }
    });
    p.stripe_id = price.id;
    console.log(price)
    p.save((err, doc) => {
        if (err) {

            if (err.code === 11000)
                return res.status(500).json({ message: "Plan already exits" });
        }
        else {
            return res.status(200).send(doc);
        }
    });
}
exports.allPlans = async(req,res)=>
{


    Plan.find({}, function(err, doc) {
    
    if (err) {

      return res.status(500).json(err);
    }
    else{
        return res.status(200).send(doc);
    }
  });
  
}

