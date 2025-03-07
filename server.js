const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const sensorRoutes = require('./routes/sensors.routes');
const readingRoutes = require('./routes/readings.routes');

const app = express();
const port = 3000;

// Conectar a la base de datos
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Rutas
app.use('/sensors', sensorRoutes);
app.use('/readings', readingRoutes);

// Ruta de prueba
app.get('/test', (req, res) => res.json({ msg: 'El API REST funciona!' }));

// Iniciar servidor
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));

/*
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); // Importamos mongoose
var app = express();
var Sensor = require('./models/sensor');
var Reading = require('./models/reading'); //////////////////////////////////////////////NUEVO
const moment = require('moment');
var port = 3000;
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// Conexión a la base de datos MongoDB
const MONGO_URI = 'mongodb://localhost:27017/sensores';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Conexión a MongoDB establecida'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));
// Ruta de prueba
app.get('/test', function (req, res) {
    res.json({
        msg: 'El API REST funciona!'
    });
});

// Ruta para obtener todos los sensores 
app.get('/sensors', async function (req, res) {
    try {
        const sensors = await Sensor.find(); // Busca todos los sensores en la BD
        res.status(200).json(sensors);
    } catch (err) {
        res.status(500).json({
            msg: 'Error al obtener los sensores',
            error: err
        });
    }
});

app.get('/sensors/:id', async function (req, res) {
    try {
        const sensor = await Sensor.findById(req.params.id); // Busca por ID
        if (!sensor) {
            return res.status(404).json({ msg: 'Sensor no encontrado' });
        }
        res.status(200).json(sensor);
    } catch (err) {
        res.status(500).json({
            msg: 'Error al obtener el sensor',
            error: err
        });
    }
});

//METEMOS EL GET READINGS
app.get('/readings/:sensorId', async function (req, res) { /////////NUEVO
    try {
        const reading = await Reading.findById(req.params.sensorId); // Busca por ID
        if (!reading) {
            return res.status(404).json({ msg: 'Lectura no encontrada' });
        }
        res.status(200).json(reading);
    } catch (err) {
        res.status(500).json({
            msg: 'Error al obtener la lectura',
            error: err
        });
    }
});

app.post('/sensors', async function (req, res) {
    try {
        // Creamos un nuevo sensor con los datos recibidos
        var sensor = new Sensor(req.body);
        // Guardamos el sensor en la base de datos
        await sensor.save();
        console.log("Sensor guardado:");
        console.log(sensor);
        res.status(200).json({
            msg: 'Sensor guardado correctamente',
            sensor: sensor
        });
    } catch (err) {
        res.status(500).json({
            msg: 'Error al guardar el sensor',
            error: err
        });
    }
});

////METEMOS EL POST READINGS
app.post('/readings', async function (req, res) { //////////////////////////////////NUEVO
    try {
        // Creamos un nuevo reading con los datos recibidos
        var reading = new Reading(req.body);
        // Guardamos el reading en la base de datos
        await reading.save();
        console.log("Lectura guardada:");
        console.log(reading);
        res.status(200).json({
            msg: 'Lectura guardada correctamente',
            reading: reading
        });
    } catch (err) {
        res.status(500).json({
            msg: 'Error al guardar la lectura',
            error: err
        });
    }
});
//RE

app.put('/sensors/:id', async (req, res) => { ////el put combina un poco todos los métodos pq tiene get y post (manda algo por parámetros y algo por body)
    try {
        // Busca el sensor por ID y actualiza los datos enviados en req.body
        const sensor = await Sensor.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        if (!sensor) {
            return res.status(404).json({ msg: 'Sensor no encontrado' });
        }
        res.json({
            msg: 'Sensor actualizado correctamente',
            sensor: sensor
        });
    } catch (err) {
        res.status(500).json({
            msg: 'Error al actualizar el sensor',
            error: err
        });
    }
});

app.delete('/sensors/:id', async (req, res) => {
    try {
        console.log("Intentando eliminar el sensor con ID:", req.params.id);
        // Busca el sensor por ID y lo elimina
        const sensor = await Sensor.findByIdAndDelete(req.params.id);
        if (!sensor) {
            return res.status(404).json({ msg: 'Sensor no encontrado' });
        }
        res.json({
            msg: 'Sensor borrado correctamente',
            sensor: sensor
        });
    } catch (err) {
        res.status(500).json({
            msg: 'Error al borrar el sensor',
            error: err
        });
    }
});

//////METEMOS EL DELETE READINGS SENSOR ID
app.delete('/readings/:sensorId', async (req, res) => {
    try {
        console.log("Intentando eliminar la lectura con ID:", req.params.sensorId);
        // Busca el sensor por ID y lo elimina
        const reading = await Reading.findByIdAndDelete(req.params.sensorId);
        if (!reading) {
            return res.status(404).json({ msg: 'Lectura no encontrada' });
        }
        res.json({
            msg: 'Lectura borrada correctamente',
            reading: reading
        });
    } catch (err) {
        res.status(500).json({
            msg: 'Error al borrar la lectura',
            error: err
        });
    }
});



///////CÓDIGO DE LA ÚLTIMA PARTE
app.get('/readingsTime/:sensorId', async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { start, end } = req.query;

        console.log("Start recibido:", start);
        console.log("End recibido:", end);

        if (!start || !end) {
            return res.status(400).json({ msg: "steart y endformato DD-MM-YYYY" });
        }
        const startDate = moment(start, "DD-MM-YYYY").startOf('day').toDate();
        const endDate = moment(end, "DD-MM-YYYY").endOf('day').toDate();

        console.log("Start convertido:", startDate);
        console.log("End convertido:", endDate);

        const filter = {
            sensorId: sensorId,
            timestamp: { $gte: startDate, $lte: endDate }
        };

        console.log("Filtro aplicado:", filter);

        const readings = await Reading.find(filter);

        if (readings.length === 0) {
            return res.status(404).json({ msg: "No se encontraron lecturas" });
        }

        res.status(200).json(readings);
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ msg: "Error ", error: err.message });
    }
}); 




// Iniciar servidor
app.listen(port, function () {
    console.log('Servidor node.js corriendo en el puerto ' + port);
});

*/