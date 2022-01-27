let start_button, stop_button, reload_button, anim, square, canvas
//
let started = false
//
let angle = 90
let step = 20
let speed = 500
let canvas_rendering = false
//
let x = 0, y = 0
//
let fade_duration = 1000

$(document).ready(async function () {
    let work = $('#work').hide()
    anim = $('#anim')
    canvas = $('#canvas')
    start_button = $('#start_button')
    stop_button = $('#stop_button').hide()
    reload_button = $('#reload_button').hide()
    square = $('#square')

    await get_properties()

    work.show()
    move_square_to_start()
    animate()
    work.hide()

    $('#play_button').click(function () {
        localStorage.setItem('animation_log', JSON.stringify([]));
        message_handler('Animation window opened.')
        work.fadeIn(fade_duration)
    })

    $('#close_button').click(function () {
        if (started) {
            stop_button.click()
        }

        message_handler('Animation window closed.')
        work.fadeOut(fade_duration)

        let animation_log = $('#animation_log')
        animation_log.innerHTML = ''

        JSON.parse(localStorage.getItem('animation_log')).forEach(function (message) {
            animation_log.append(`<p>${message}</p>`)
        })
    })

    start_button.click(function () {
        message_handler(`Animation started. Angle: ${round_two(angle)}.`)
        start_button.hide()
        stop_button.show()
        started = true
    })

    stop_button.click(function () {
        message_handler('Animation stopped.')
        stop_button.hide()
        start_button.show()
        started = false
    })

    reload_button.click(function () {
        message_handler('Animation reloaded.')
        reload_button.hide()
        start_button.show()
        started = false
        move_square_to_start()
    })
});

function update_canvas() {
    canvas.attr('width', anim[0].clientWidth)
    canvas.attr('height', anim[0].clientHeight)

    canvas.animateLayer('square', {
        x: x, y: y
    }, speed / 2);
}

function update_square() {
    square.animate({left: `${x}px`, top: `${y}px`}, speed / 2);
}

function move_square_to_start() {
    angle = Math.random() * 180
    x = Math.random() * (anim[0].clientWidth - parseFloat(square.css('width')))
    y = 0

    if (canvas_rendering) {
        canvas.show()
        square.hide()

        canvas.clearCanvas().drawRect({
            layer: true,
            name: 'square',
            fillStyle: 'red',
            x: 0, y: 0,
            width: 10,
            height: 10,
            fromCenter: false
        });

        update_canvas()
    } else {
        canvas.hide()
        square.show()
        update_square()
    }
}

function animate() {
    let id = setInterval(frame, speed);

    async function frame() {
        let fade_out = false
        if (!started) {
            return
        }

        let max_x = anim[0].clientWidth - parseFloat(square.css('width'))
        let max_y = anim[0].clientHeight - parseFloat(square.css('height'))

        x = (Math.cos(angle * Math.PI / 180) * step) + x;
        y = (Math.sin(angle * Math.PI / 180) * step) + y;

        if (x <= 0) {
            angle -= 90
            message_handler(`Left vertical border reached. New angle: ${round_two(angle)}.`)
            x = 0
        } else if (x >= max_x) {
            angle += 90
            message_handler(`Right vertical border reached. New angle: ${round_two(angle)}.`)
            x = max_x
        }

        if (y >= max_y) {
            message_handler('Animation ended')
            fade_out = true
            started = false

            stop_button.hide()
            reload_button.show()
        }

        if (canvas_rendering) {
            update_canvas()
        } else {
            update_square()
        }

        if (fade_out) {
            if (canvas_rendering) {
                canvas.fadeOut(fade_duration * 3)
            } else {
                square.fadeOut(fade_duration * 3)
            }
        }

        console.log(x + '  ' + y)
    }
}

function message_handler(message) {
    message = new Date().toLocaleTimeString() + '  ' + message
    console.log(message)
    $('#message').html(message)

    let log = JSON.parse(localStorage.getItem('animation_log'))
    log.push(message)
    localStorage.setItem('animation_log', JSON.stringify(log))
}

function round_two(num) {
    return Math.round(num * 100) / 100
}

async function get_properties() {
    await $.get("api/animation", function (properties) {
        if (properties.hasOwnProperty('error')) {
            alert("GET animation properties error. Will be used default properties. Received message: " + properties['error'])
        } else {
            $('#buttons').css('background-color', properties.buttons_color)
            $('#messages').css('background-color', properties.messages_color)
            fade_duration = parseInt(properties.fade)
            anim.css('background', properties.background)
            anim.css('background-size', '32px 32px')
            speed = parseInt(properties.speed)
            step = parseInt(properties.step)
            if (properties.rendering === 'canvas') {
                canvas_rendering = true
            }
        }
    });
}


