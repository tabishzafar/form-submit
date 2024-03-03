const express = require('express');
const bodyParser = require('body-parser'); 
const app = express();
const cors = require('cors');
const PORT = 4000;
const fs = require('fs')
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const uri = "mongodb+srv://tabishzafar44:UuIEjkoxp55lQrVL@cluster0.0nzfysx.mongodb.net/";
// const uri = 'mongodb://localhost:27017/'
const path = require('path')



app.use(express.static(path.join(__dirname, 'font-end')));
mongoose.connect(uri).then(()=>{
console.log("connected");
}).catch((error)=>{
    console.log(error);
})

app.use(bodyParser.json()); //  middleware for parsing JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodie
app.use(cors());
app.set('view engine','ejs')
app.set("show",path.resolve("./show"))

 //app.use(bodyParser.json()); // middleware for parsing JSON data
// app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

//DEFINEING SCHEMA
const UserSchema = new mongoose.Schema(
    {
        FIRST_NAME: String,
        LAST_NAME : String,
        CONTACT : Number,
        EMAIL : String,
        AGE : Number,
        CITY: String,
        STATE: String,
        COUNTRY: String,
        LOGIN: String,
        PASSWORD: String,
        time_data: Date
    })

// CREATING DATA MODEL
const UserModel = mongoose.model('test', UserSchema);


// SIGN UP PAGE GET
app.get('/sign-up-validation', (req, res) => {

    const filePath = path.join(__dirname, './font-end/index.html');

    // Read the HTML file and send it as the response
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).type('text/html').send(data);
        }
    });
    
})

app.post ('/sign-up', (req, res) => {
   

    const data= req.body;
    // console.log(data)
//ADDING DATE AND TIME 
    const now = new Date();
    const formattedDate = now.toISOString(); 
    const time_data = {
    currentTime: formattedDate,
  };


data.time_data = formattedDate;
  



 //SENDING DATA TO DB
    const newUser = new UserModel(data);
    newUser.save()
      .then(() => {console.log("data inserted ", data)
    console.log('whooo')
    res.setHeader('Content-Type', 'text/html');
    
    })
      
      .catch(err => console.error('Error inserting document:', err));
});

//post form data

app.post("/form-data",async(req,res)=> {
    try {
        console.log(req.body);
        const data = await UserModel.create(req.body)
        console.log(data)
        res.status(200).json(data)
    } catch (error) {
        console.log(error.message)
    }
})
// LOGIN PAGE 
app.get('/login-page',(req,res)=>
{
    const filePath = path.join(__dirname, 'font-end/login.html');

    // Read the HTML file and send it as the response
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(200).type('text/html').send(data);
        }
    });
})


// LOGIN PAGE FOR OUTPUT 
app.post('/login-page', (req, res) => {
    const data = req.body;

    UserModel.find({ LOGIN: data.id })
        .then(users => {
            if (users.length === 0) {
                console.log("No user found with the specified ID");
                res.status(404).json({ error: "No user found with the specified ID" });
            } else {
                const user = users.find(user => user.PASSWORD === data.password);
                if (user) {
                    console.log("Valid password");
                    console.log(user);
                    res.status(200).json(user);
                } else {
                    console.log("Invalid password");
                    res.status(401).json({ error: "Invalid password" });
                }
            }
        })
        
});



app.listen(PORT, () => console.log("Server is started on 4000"));
