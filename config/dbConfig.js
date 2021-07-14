const mongoose = require('mongoose');

mongoose
.connect("mongodb+srv://Rayene:tfg@cluster0.odqre.mongodb.net/Cluster0?retryWrites=true&w=majority", {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log('DB Connection Error: ${err.message}'+err.message);
});
mongoose.set('useCreateIndex', true);
module.exports={mongoose};