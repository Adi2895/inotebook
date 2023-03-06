const connectToMongo = require('./db');

const express = require('express'); 

const app = express(); 

const port = 5000;
app.use(express.json());
// available routes
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))

app.get("/" , (req , res)=>{
    res.send("Hello world"); 
})

app.listen(port , ()=>{
    console.log(`our notebook is running successfully on ${port}`); 
})

connectToMongo(); 