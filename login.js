const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { kStringMaxLength } = require('buffer');
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, { useUnifiedTopology: true });
var url = "mongodb://localhost:27017/";

const datareg = {
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    dob: String,
    phone: String
}

const server = mongoose.model("server", datareg);

app.get("/register", function(req, res) {
    res.sendFile(__dirname + "/register.html");
})

app.post("/register", function(req, res) {
    let newserver = new server({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            dob: req.body.dob,
            phone: req.body.phone
        })
        // res.send(req.body); 
        // console.log(req.body);
    mongoose.connect(url, function(err, db) {

        db.collection("registration").insertOne(newserver, function(err, db) {
            if (err) {
                throw err;
            }
            newserver.save();
            console.log("registration successful");
            // alert("registration successful");
        })





    })
    res.redirect("/login");

})

const data = {

    email: String,
    password: String

}
const Newlogin = mongoose.model("Newlogin", data);
app.get("/login", function(req, res) {
    res.sendFile(__dirname + "/login.html");

})

app.post("/login", function(req, res) {
    let login = new Newlogin({

        email: req.body.email,
        password: req.body.password

    })

    mongoose.connect(url, function(err, db) {
        let query = { email: req.body.email, password: req.body.password };
        db.collection("registration").find(query).toArray(function(err, result) {
            // console.log(result);
            if (err)
                throw err;


            if (result.length > 0) {

                res.redirect("/profile");

            } else {
                console
                res.redirect("/login");


            }
        })

    })

})
app.get("/profile", function(req, res) {
    // console.log("working");
    res.sendFile(__dirname + "/profile.html");

})

const profileData = {

    degree: String,
    designation: String,
    doc: String,
    dou: String,

}
var myDateString = Date();

const profileNote = mongoose.model("profileNote", profileData);


app.post("/profile", function(req, res) {
    let newNote = new profileNote({

        degree: req.body.degree,
        designation: req.body.designation,
        doc: req.body.doc,
        dou: req.body.dou,

    })

    mongoose.connect(url, function(err, db) {

        db.collection("registration").insertOne(newNote, function(err, db) {
            if (err) {
                throw err;
            }
            console.log(res.db);
            newNote.save();
            console.log("registration successful");
            // alert("registration successful");
        })



        res.redirect("/home");


    })

})
app.get("/home", function(req, res) {
    res.sendFile(__dirname + "/home.html");
})

const delschema = {

    email: String

}

const deleted = mongoose.model("delete", delschema);

app.get("/delete", function(req, res) {
    res.sendFile(__dirname + "/delete.html");
})

app.post("/delete", function(req, res) {
    let datadel = new deleted({

            email: req.body.email


        })
        //res.send(req.body);
    mongoose.connect(url, function(err, db) {
        let query = { email: req.body.email };


        db.collection("registration").deleteMany(query, function(err, db) {
            if (err) {
                throw err;
            }
            //query.save();
            console.log("new data deleted");
            res.redirect("/home");
        })





    })


})






const readSchema = {
    email: String,

}

const reade = mongoose.model("read", readSchema);

app.get("/read", function(req, res) {
    res.sendFile(__dirname + "/read.html");
})


app.post("/read", function(req, res) {
    let newread = new reade({
        email: req.body.email,

    })

    mongoose.connect(url, function(err, db) {
        let query = { email: req.body.email };

        db.collection("registration").find(query).toArray(function(err, register) {
            if (err) throw err;

            if (register.length > 0) {
                res.render('index', { registerList: register });
                res.render("/update", update.html);

            } else {
                res.render('index', { registerList: null });
                console.log("no records found:")
                res.redirect("/read");
            }


        })





    })


})





const updateSchema = {

    email: String,
    degree: String,
    designation: String,
    dateC: String,
    dateU: String





}

const update = mongoose.model("update", updateSchema);

app.get("/update", function(req, res) {
    res.sendFile(__dirname + "/update.html");
})

app.post("/update", function(req, res) {



    let newupdate = new update({
            email: String,
            degree: req.body.degree,
            designation: req.body.designation,
            dateC: req.body.doc,
            dateU: req.body.dou

        })
        //res.send(req.body);
    mongoose.connect(url, function(err, db) {
        let upquer = { email: req.body.email };

        var newvalues = {
            $set: {
                designation: req.body.designation,
                degree: req.body.degree,
                dateC: req.body.doc,
                dateU: req.body.dou
            }
        };
        db.collection("registration").updateMany(upquer, newvalues, function(err, res) {
            if (err) throw err;


            console.log("updated successfully");


        })





    })
    res.redirect("/home");

})








app.listen(4000, function() {
    console.log("server running");
})