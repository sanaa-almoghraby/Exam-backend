'use strict'
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const server = express();
server.use(cors());
const PORT = 3008;
server.use(express.json());

const mongoose = require('mongoose');
const { default: axios } = require('axios');



// mongodb://sanaa:<password>@cluster0-shard-00-00.ejhje.mongodb.net:27017,cluster0-shard-00-01.ejhje.mongodb.net:27017,cluster0-shard-00-02.ejhje.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-10qf27-shard-0&authSource=admin&retryWrites=true&w=majority
// mongodb://localhost:27017/color
mongoose.connect('mongodb://localhost:27017/color', { useNewUrlParser: true, useUnifiedTopology: true });

const colorSchema = new mongoose.Schema({
    title: String,
    imageUrl: String
});
const userSchema = new mongoose.Schema({
    email: String,
    color: [colorSchema]
});

const user = mongoose.model('users', userSchema);


function seedData() {
    const sanaa = new user({
        email: 'sanaa.almoghraby@gmail.com',
        color: [{
            "title": "Black",
            "imageUrl": "http://www.colourlovers.com/img/000000/100/100/Black.png",
        },
        {
            "title": "dutch teal",
            "imageUrl": "http://www.colourlovers.com/img/1693A5/100/100/dutch_teal.png",
        },
        ]

    })
    const razan = new user({
        email: 'quraanrazan282@gmail.com',
        color: [{
            "title": "Black",
            "imageUrl": "http://www.colourlovers.com/img/000000/100/100/Black.png",
        },
        {
            "title": "dutch teal",
            "imageUrl": "http://www.colourlovers.com/img/1693A5/100/100/dutch_teal.png",
        },
        ]

    })
    sanaa.save();
    razan.save();

}
// seedData();
// -------------

// ------------------------------------------------------------------------------------


// http://localhost:3008/alldata?email=
server.get('/alldata', getdata)

// http://localhost:3008/delete/index
server.delete('/delete/:id', deletedata)

function deletedata(req, res) {
    let id = Number(req.params.id)
    let email = req.query.email
    user.findOne({ email: email }, (err, deletdata) => {
        if (err) {
            res.send('err')
        } else {
            let newdata = deletdata.color.filter((el, ind) => {
                if (ind !== id) {
                    return el
                }
            })
            deletdata.color = newdata;
            deletdata.save();
            res.send(deletdata.color)
        }
    })
}

// http://localhost:3008/update/index
server.put('/update/:id', updatefun)
function updatefun(req, res) {
    const { email, title, imageUrl } = req.body
    let index = Number(req.params.id)
    user.findOne({ email: email }, (err, updetedata) => {
        if (err) {
            res.send('err')
        } else {
            updetedata.color.splice(index, 1, {
                title: title,
                imageUrl: imageUrl,
            })
        }
        updetedata.save();
        res.send(updetedata.color)
    })
}


function getdata(req, res) {
    let email = req.query.email;
    console.log(email);
    user.find({ email: email }, (err, cartdata) => {
        if (err) {
            res.send('not correct')
        } else {
            res.send(cartdata[0].color)
        }
        console.log(cartdata);
    })

}
// --------------------------------------------------------------------------------------------
// https://ltuc-asac-api.herokuapp.com/allColorData
server.get('/allColorData', gitApidata)


// http://localhost:3008/addtoFavart

server.post('/addtoFavart', addtoFavartfun)

function addtoFavartfun(req, res) {
    const { email, title, imageUrl } = req.body;
    user.find({ email: email }, (err, favData) => {
        if (err) {
            res.send('error')
        } else {
            const newfav = {

                title: title,
                imageUrl: imageUrl
            }
            favData[0].color.push(newfav)

        }
        favData[0].save();
        res.send(favData[0].bokemon)
    })

}

async function gitApidata(req, res) {
    let apiData = await axios.get('https://ltuc-asac-api.herokuapp.com/allColorData')
    let allData = apiData.data.map(ele => {
        return new Getformapi(ele)
    })
    res.send(allData)
}





class Getformapi {
    constructor(data) {
        this.title = data.title,
            this.imageUrl = data.imageUrl
    }
}







server.listen(PORT, () => {
    console.log(`listen in ${PORT}`);
})