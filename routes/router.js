const express = require('express');
const router = express.Router();

const lorem_ipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend, orci in vehicula iaculis, nisl\n' +
    '        ligula convallis massa, at venenatis lorem tortor at libero. Vivamus suscipit auctor felis, ac bibendum\n' +
    '        magna venenatis tempor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos\n' +
    '        himenaeos. Nulla tempor lacinia ipsum ut faucibus. Suspendisse placerat et mi eu euismod. Donec non\n' +
    '        scelerisque enim. Donec dictum ullamcorper est non egestas. Aliquam eu quam vel ex lobortis egestas at non\n' +
    '        est. Sed mi nibh, eleifend a tempus id, mattis at turpis. Fusce mi erat, aliquet quis urna ac, tempor\n' +
    '        fermentum odio. Sed vel vulputate dolor. Morbi dolor lorem, aliquam at accumsan et, varius ac turpis. Aenean\n' +
    '        tristique id augue sed tempor. Maecenas vitae semper est.'

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


/* GET home page. */
router.get('/', function (req, res, next) {
    const data = {
        title: 'Лабораторана робота 4',
        lorem_ipsum: lorem_ipsum
    }
    res.render('index', data);
});

/* GET admin page. */
router.get('/admin', function (req, res, next) {
    const data = {
        title: 'Admin page',
        lorem_ipsum: lorem_ipsum,
        default_texture: default_texture
    }
    res.render('admin', data);
});

module.exports = router;
