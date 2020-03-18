const express = require("express");
const app = express();

const v1 = require("./v1");

app.get("/", (req, res)=>{
    res.json({
        type: "version",
        latest: 1
    })
})

app.use("/v1", v1);

app.listen(14453, ()=>{
    console.log("Ready!");
});