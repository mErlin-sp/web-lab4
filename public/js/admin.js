$(document).ready(function () {
    $('#save_button').click(function () {
        $.post("api/update-animation",
            {
                buttons_color: $('#buttons_color').val(),
                messages_color: $('#messages_color').val(),
                fade: $('#fade').val(),
                background: $('#background').val(),
                speed: parseInt($('#speed').val()),
                step: parseInt($('#step').val()),
                rendering: $('#rendering').val()
            },
            function (data) {
                if (data.hasOwnProperty('error')) {
                    alert('POST properties update error. Received message: ' + data['error']);
                } else {
                    alert('Animation properties successfully updated')
                }
            });
    })
})