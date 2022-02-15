const mongoose = require('mongoose');

mongoose
.connect("mongodb+srv://Rayene:tfg@cluster0.odqre.mongodb.net/stunify?retryWrites=true&w=majority", {
useUnifiedTopology: true,
useNewUrlParser: true,
});
mongoose.connection.on('connected', () => {
    console.log('Mongo has connected succesfully')
});
mongoose.connection.on('reconnected', () => {
    console.log('Mongo has reconnected')
});
mongoose.connection.on('error', error => {
    console.log('Mongo connection has an error', error)
    mongoose.disconnect()
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongo connection is disconnected')
});
mongoose.set('useCreateIndex', true);
module.exports={mongoose};