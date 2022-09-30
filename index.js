const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const helpers = require("handlebars-helpers")({
    handlebars:hbs.handlebars,
})

require("dotenv").config();

const app = express()

//static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts")

//enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

async function main(){
app.get('/',(req,res)=>{
    res.send("Its's alive !")
})
}

main()

app.listen(3000, ()=>{
    console.log("Server Started")
})