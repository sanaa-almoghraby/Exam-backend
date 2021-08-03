'use strict'
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const server = express();
server.use(cors());
const PORT = 3008;
server.use(express.json());

const mongoose = require('mongoose');



// mongodb://sanaa:<password>@cluster0-shard-00-00.ejhje.mongodb.net:27017,cluster0-shard-00-01.ejhje.mongodb.net:27017,cluster0-shard-00-02.ejhje.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-10qf27-shard-0&authSource=admin&retryWrites=true&w=majority
// mongodb://localhost:27017/color
mongoose.connect('mongodb://sanaa:sanaa#123@cluster0-shard-00-00.ejhje.mongodb.net:27017,cluster0-shard-00-01.ejhje.mongodb.net:27017,cluster0-shard-00-02.ejhje.mongodb.net:27017/color?ssl=true&replicaSet=atlas-10qf27-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

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
    const razan= new user({
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
seedData();



 
// http://localhost:3008/alldata?email=
server.get('/alldata',getdata)

    // http://localhost:3008/delete/index
server.delete('/delete/:id',deletedata)

function deletedata(req,res){
    let id=Number(req.params.id)
    let email=req.query.email
    user.findOne({email:email},(err,deletdata)=>{
        if(err){
            res.send('err')
        }else{
            let newdata=deletdata.color.filter((el,ind)=>{
                if(ind !== id){
                    return el
                }
            })
            deletdata.color=newdata;
            deletdata.save();
            res.send(deletdata.color)
        }
    })
}

// http://localhost:3008/update/index
server.put('/update/:id',updatefun)
function updatefun(req,res){
    const {email,title,imageUrl}=req.body
    let index=Number(req.params.id)
    user.findOne({email:email},(err,updetedata)=>{
        if(err){
            res.send('err')
        }else{
            updetedata.color.splice(index,1,{
                title:title,
                imageUrl:imageUrl,
            })
        }
        updetedata.save();
        res.send(updetedata.color)
    })
}


function getdata(req,res){
    let email=req.query.email;
    console.log(email);
    user.find({email:email},(err,cartdata)=>{
        if(err){
            res.send('not correct')
        }else{
            res.send(cartdata[0].color)
        }
        console.log(cartdata);
    })

}








server.listen(PORT, () => {
    console.log(`listen in ${PORT}`);
})