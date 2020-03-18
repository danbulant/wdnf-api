const express = require("express");
const router = new express.Router();

const routes = {
    login: require("./discord/login")
};

for(var route in routes){
    router.use(routes[route]);
}

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