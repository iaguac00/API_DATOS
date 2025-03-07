/*const mongoose = require('mongoose'); 
 
const ReadingSchema = new mongoose.Schema({ 
    sensorId: mongoose.Schema.Types.ObjectId, //se pone así porque hace referencia al identificador único
    value: Number, 
    unit: String, 
    timestamp: { type: Date, default: Date.now } 
}); 
 
// Exportamos el modelo, el nombre debe estar en singular 
module.exports = mongoose.model('Reading', ReadingSchema);  */

const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
    sensorId: String,
    value: Number,
    unit: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reading', ReadingSchema);
