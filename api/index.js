const express =require('express');
const bodyParser=require('body-parser');
const routerHandler=require('./routes/handeler.js');
const mongoose=require('mongoose');
require('dotenv/config')



const app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/',routerHandler);

///mongoose connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then( (client) => {
    var shop=client.DB_URI;
    console.log('DB Connected!');
})
.catch( (err) => {
    console.log(err);
});


const PORT= process.env.PORT || 4000;//backend routing port 
app.listen(PORT,()=>{
console.log("server is running on posrt"+PORT);

});
