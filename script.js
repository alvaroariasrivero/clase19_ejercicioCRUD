const express = require('express');
const bodyParser = require('body-parser')
const app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const url = "mongodb://localhost:27017/";
    
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
    
app.post('/nuevadb', urlencodedParser, (req, res) => {
    console.log('Nombre DB:', req.body.db_name, '\Nombre Coleccion: ', req.body.coll_name);
    res.send(req.body); //La página que se me abre con el objeto

    const mydb = req.body.db_name;
    const coleccion = req.body.coll_name;

    // //Creacion de una BD 
    // MongoClient.connect(url+mydb, function(err, db) {
    //     if (err) throw err;
    //     console.log("Base de datos creada");
    //     db.close();
    // });
    //Creacion de una base de datos con una colección
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(mydb);
        dbo.createCollection(coleccion, function(err, res) {
        if (err) throw err;
        console.log("Colección creada");
        db.close();
        });
    });
});

app.post('/nuevacoll', urlencodedParser, (req, res) => {
    console.log('Nueva colección: ', req.body.new_coll_name);
    res.send(req.body); //La página que se me abre con el objeto
    const coleccion2 = req.body.new_coll_name;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PruebaDB");
        dbo.createCollection(coleccion2, function(err, res) {
        if (err) throw err;
        console.log("Colección creada");
        db.close();
        });
    });
});

app.post('/nuevonombre', urlencodedParser, (req, res) => {
    console.log('Nombre:', req.body.name_doc_data, 'Dirección:', req.body.dir_doc_data);
    res.send(req.body); //La página que se me abre con el objeto

    const myobj = {
        nombre: req.body.name_doc_data,
        direccion: req.body.dir_doc_data
    };

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PruebaDB");
        
        dbo.collection("PruebaColl").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("Documento insertado");
          db.close();
        });
      });
});

app.post('/busca', urlencodedParser, (req, res) => {
    res.send(req.body)
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PruebaDB");
        var query = { "nombre": req.body.search_name};
        dbo.collection("PruebaColl").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      });
})

app.post('/elimina', urlencodedParser, (req, res) => {
    res.send(req.body)
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PruebaDB");
        var myquery = { "nombre": req.body.del_name };
        dbo.collection("PruebaColl").deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        console.log("Documento borrado");
        db.close();
        });
    });
})

app.post('/actualiza', urlencodedParser, (req, res) => {
    res.send(req.body)
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("PruebaDB");
        var myquery = { "nombre": req.body.old_name_doc_data };
        var newvalues = { $set: {"nombre": req.body.new_name_doc_data, "direccion": req.body.new_dir_doc_data } };
        dbo.collection("PruebaColl").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
        });
    });
})

app.listen(3000);



