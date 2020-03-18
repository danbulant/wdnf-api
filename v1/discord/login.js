const express = require("express");
const router = new express.Router();
const config = require("./config");
const ClientOAuth2 = require("client-oauth2");
const got = require("got");
const URL = require('url');
const crypto = require('./crypto');

const client = new ClientOAuth2(config);

var users = {};

router.get("/discord/login", (req, res) => {
    var uri = client.code.getUri();

    res.cookie("redirect", req.query.redirect);

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    res.cookie("user", uuid);

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
            dUser = JSON.parse(dUser);

            res.cookie("discord", crypto.encrypt(JSON.stringify(dUser), dUser.id));

            var url = new URL.URL(req.cookies.redirect);
            var params = new URL.URLSearchParams(url.searchParams);
            params.set("id", dUser.id);
            url.search = params.toString();

            res.redirect(url);
            res.end();
        }).catch(e=>{
            res.status(401).json({
                type: "e_unauthorized"
            })
        })
});

router.get("/discord/user", (req, res)=>{
    if(!req.query.id) return res.status(400).json({
        type: "e_missing_id"
    });

    try {
        var user = crypto.decrypt(req.cookies.discord, req.query.id);
        user = JSON.parse(user);

        res.json(user);
    } catch(e){
        res.status(400).json({
            type: "e_unauthorized"
        });
    }
});

module.exports = router;