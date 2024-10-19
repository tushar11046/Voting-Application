const express=require('express');
const app=express();
const db=require('./db');
require('dotenv').config();

const bodyParser=require('body-parser');
app.use(bodyParser.json());   // req.body
const Port=process.env.PORT || 3000;

const {jwtAuthMiddleWare}=require('./JWT');


//Import the router files
const userRoutes=require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoute');

app.use('/candidate',candidateRoutes);
app.use('/user',userRoutes);


app.listen(Port,()=>{
    console.log("Listening on port 3000");
})