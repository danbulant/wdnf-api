const express = require("express");
const router = new express.Router();
const config = require("./config");
const ClientOAuth2 = require("client-oauth2");
const got = require("got");

const client = new ClientOAuth2(config);

router.get("/discord/login", (req, res) => {
    var uri = client.code.getUri()

    res.redirect(uri)
});

router.get("/discord/redirect", (req, res) => {
    client.code.getToken(req.originalUrl)
        .then(async function (user) {
            const signed = user.sign({
                method: 'get',
                url: 'https://discordapp.com/api/v6/users/@me'
            });

            var dUser = await got(signed.url, {
                headers: signed.headers,
                resolveBodyOnly: true,
                timeout: 1500
            });

            res.send(dUser);
            res.end();
        }).catch(e=>{
            res.status(401).json({
                type: "e_unauthorized"
            })
        })
});

module.exports = router;