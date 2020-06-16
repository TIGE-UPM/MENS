//Parte del codigo se basa en el proporcionado por Lintang Wisesa (https://github.com/LintangWisesa/React_RNative_Express_MongoDB/tree/master/Express_Backend)
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());

//He tenido que aumentar el limite para poder enviar la foto en base64
//Se podria poner tambien un limite mayor como de 50mb, pero con 10mb funciona bien
app.use(bodyParser.json({
  limit: '10mb'
}));
app.use(bodyParser.urlencoded({
  limit: '10mb',
  //parameterLimit: 100000,
  extended: true 
}));

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/TFG';

mongo.connect(url, (err)=>{
    console.log('Connected with the database!')
})

app.post('/data', (req, res)=>{
    mongo.connect(url, (err, db)=>{
        var collection = db.collection('CapturedData');
        var data = {
            fotoBase64: req.body.fotoEnBase64,
            coordenadasGeolocalizacion: req.body.coordenadasGeolocalizacion,
            repuestasEncuesta: req.body.repuestasEncuesta
        }
        //necesita el res.send para poder enviar a la app la confirmacion de todo correcto
        collection.insert(data, (x, response)=>{
            res.send(response);
        })
    })
})

app.listen(3210, ()=>{
    console.log('Server Ready!! @port 3210');
})
