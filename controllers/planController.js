
const mongoose = require('mongoose'),
    Plan = mongoose.model('Plans');
User = mongoose.model('Users');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



exports.newPlan = async (req, res) => {
    p = new Plan();
    p.name = req.body.name;
    p.price = req.body.price;
    p.duration = req.body.duration;
    const price = await stripe.prices.create({
        unit_amount: req.body.price,
        currency: 'chf',
        recurring: { interval: 'month', interval_count: req.body.duration },
        product_data: {
            name: req.body.name
        }
    });
    p.priceId = price.id;
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
exports.allPlans = async (req, res) => {


    Plan.find({is_active:true}, async (err, doc) => {

        if (err) {

            return res.status(500).json(err);
        }
        else {
            return res.status(200).send(doc);
        }
    });

}

exports.archivePlan = async (req, res) => {

    Plan.findOne({ _id: req.body.id },
        async (err, plan) => {
            if (!plan)
                return res.status(404).json({ status: false, message: 'Plan record not found.' });
            else {
                const price = await stripe.prices.update(
                    plan.priceId,
                    {
                        active: false
                    }
                );
                await stripe.products.update(
                    price.product,
                    {
                        active: false
                    }
                );
                plan.is_active = false;
                Plan.updateOne({ _id: req.body.id }, plan).then(
                    () => {
                        res.status(201).json({
                            message: 'Plan archived successfully!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            }
        });
}

exports.unarchivePlan = async (req, res) => {

    Plan.findOne({ _id: req.body.id },
        async (err, plan) => {
            if (!plan)
                return res.status(404).json({ status: false, message: 'Plan record not found.' });
            else {
                const price = await stripe.prices.update(
                    plan.priceId,
                    {
                        active: true
                    }
                );
                await stripe.products.update(
                    price.product,
                    {
                        active: true
                    }
                );
                plan.is_active = true;
                Plan.updateOne({ _id: req.body.id }, plan).then(
                    () => {
                        res.status(201).json({
                            message: 'Plan unarchived successfully!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            }
        });
}

