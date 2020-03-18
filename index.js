const express = require("express");
const morgan = require("morgan");
const app = express();

const v1 = require("./v1");

app.get("/", (req, res)=>{
    res.json({
        type: "version",
        latest: 1
    })
})


app.use(morgan());
app.use("/v1", v1);

app.listen(14453, ()=>{
    console.log("Ready!");
});