let start_button, stop_button, reload_button, anim, square
//
let started = false
//
let angle = 90
let step = 20
let speed = 500
let canvas_rendering = false
//
let fade_duration = 'slow'

$(document).ready(function () {
    let work = $('#work')
    anim = $('#anim')
    start_button = $('#start_button')
    stop_button = $('#stop_button').hide()
    reload_button = $('#reload_button').hide()
    square = $('#square')

    get_properties()

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

function move_square_to_start() {
    angle = Math.random() * 180
    let start_x = Math.random() * (anim[0].clientWidth - parseFloat(square.css('width')))
    console.log(angle + '  ' + anim[0].clientWidth)
    square.animate({'left': start_x + 'px', 'top': 0}, 0).show()

}

function animate() {
    let id = setInterval(frame, speed);

    function frame() {
        let fade_out = false
        if (!started) {
            return
        }

        let max_x = anim[0].clientWidth - parseFloat(square.css('width'))
        let max_y = anim[0].clientHeight - parseFloat(square.css('height'))

        let x = (Math.cos(angle * Math.PI / 180) * step) + parseFloat(square.css('left'));
        let y = (Math.sin(angle * Math.PI / 180) * step) + parseFloat(square.css('top'));

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

        square.animate({left: `${x}px`, top: `${y}px`});
        if (fade_out) {
            square.fadeOut(fade_duration)
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

function get_properties() {
    $.get("api/animation", function (properties) {
        if (properties.hasOwnProperty('error')) {
            alert("GET animation properties error. Will be used default properties. Received message: " + properties['error'])
        } else {
            $('#buttons').css('background-color', properties.buttons_color)
            $('#messages').css('background-color', properties.messages_color)
            fade_duration = properties.fade
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

