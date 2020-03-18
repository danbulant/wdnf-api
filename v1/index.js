const express = require("express");
const router = new express.Router();

router.get("/", (req, res)=>{
    res.json({
        type: "info",
        data: {
            type: "latest",
            release: "alpha"
        }
    })
})

module.exports = router;