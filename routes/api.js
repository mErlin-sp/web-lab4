const express = require('express');
const bodyParser = require("express");
const router = express.Router();
const fs = require("fs");

router.use(express.json());
router.use(express.urlencoded({extended: false}));
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const default_texture = 'conic-gradient(\n' +
    '            from 45deg,\n' +
    '            #020681 0,\n' +
    '            #020681 90deg,\n' +
    '            #000337 90deg,\n' +
    '            #000337 180deg,\n' +
    '            #0818ff 180deg,\n' +
    '            #0818ff 270deg,\n' +
    '            #0f9bfe 270deg,\n' +
    '            #0f9bfe 360deg\n' +
    '    )'

const properties_file = 'animation_properties.json'

if (!fs.existsSync(properties_file)) {
    let default_properties = {
        buttons_color: 'pink',
        messages_color: 'yellow',
        fade: 1000,
        background: default_texture,
        speed: 500,
        step: 20,
        rendering: 'non_canvas'
    }
    fs.writeFile(properties_file, JSON.stringify(default_properties), function (err) {
        if (err) throw err;
        console.log('Animation properties file created.');
    });
}

// GET current animation properties
router.get('/animation', function (req, res) {
    fs.readFile(properties_file, function (err, data) {
        if (err) {
            res.json({
                error: 'File reading error: ' + err.toString()
            })
        } else {
            res.json(JSON.parse(data.toString()))
        }
    });
});

// POST update animation properties
router.post('/update-animation', function (req, res) {
    let errors = []

    if (!req.body.buttons_color) {
        errors.push("No buttons color specified");
    }
    if (!req.body.messages_color) {
        errors.push("No messages color specified");
    }
    if (!req.body.fade) {
        errors.push("No fade specified");
    }
    if (!req.body.background) {
        errors.push("No animation background specified");
    }
    if (!req.body.speed) {
        errors.push("No speed specified");
    }
    if (!req.body.step) {
        errors.push("No step specified");
    }
    if (!req.body.rendering) {
        errors.push("No rendering type specified");
    } else {
        if (req.body.rendering !== 'non_canvas' && req.body.rendering !== 'canvas') {
            errors.push('Unknown rendering type')
        }
    }

    if (errors.length) {
        res.status(400).json({"error": errors.join(",")});
        return;
    }

    let properties = {
        buttons_color: req.body.buttons_color,
        messages_color: req.body.messages_color,
        fade: parseInt(req.body.fade),
        background: req.body.background,
        speed: parseInt(req.body.speed),
        step: parseInt(req.body.step),
        rendering: req.body.rendering
    }

    fs.writeFile(properties_file, JSON.stringify(properties), function (err) {
        if (err) {
            res.json({
                error: err.toString()
            })
        } else {
            console.log('Animation properties file updated.');
            res.status(200)
            res.end()
        }
    });

});


module.exports = router;
