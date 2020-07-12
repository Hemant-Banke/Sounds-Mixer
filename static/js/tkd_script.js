
var msg = function () {
    var popup = document.getElementById('popup');

    var alert = function showAlert(text, title, is_success){

        popup.innerHTML = `<h6>${title}</h6>${text}`;
        popup.style.display = 'block';

        popup.className = "";
        if (is_success){
            popup.classList.add('success');
        }
        else{
            popup.classList.add('error');
        }

        setTimeout( function(){
            popup.style.display = 'none';
        }, 2000);
    }

    return {
        success: function (msg , title) {
            alert(msg , title , true);
        },

        error: function (msg , title) {
            alert(msg , title , false);
        },
    };
}();


// Enable/Disable Buttons
var Button = function() {
    return {
        enable: function(button) {
            button.disabled = false;
            button.getElementsByClassName('spinner')[0].style.display = "none";
        },

        disable: function(button) {
            button.disabled = true;
            button.getElementsByClassName('spinner')[0].style.display = "inline-block";
        }
    }
}();


// Loader
var Loader = function() {
    return {
        start: function() {
            document.getElementById('page-loader').style.display = 'flex';
        },

        end: function() {
            document.getElementById('page-loader').style.display = 'none';
        }
    }
}();


// Validate Forms
var FormValidate = function() {
    return {
        validate: function(form) {
            // Validates Form and returns if valid

            form.classList.add('was-validated');
            return form.checkValidity();
        },
    }
}();


// Fetch API
var Fetch = function(){

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    return {
        post: function(url, data, success, btn=null) {
            if (btn){
                Button.disable(btn);
            }

            // Fetch
            fetch(url, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Accept": "application/json",
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(data),
            })
            .then(
                function(response) {
                    if (btn){
                        Button.enable(btn);
                    }

                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                        response.status);

                        msg.error('Looks like there was a problem! Please try again.', 'Error');
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function(data) {
                        if (data.type == 'success'){
                            success(data);
                        }
                        else{
                            msg.error(data.message, 'Error');
                        }
                    });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
                msg.error('Looks like there was a problem! Please try again.', 'Error');

                if (btn){
                    Button.enable(btn);
                }
            });
        },

        post_multipart: function(url, data, success, btn=null) {
            if (btn){
                Button.disable(btn);
            }

            const formData  = new FormData();
            for(const name in data) {
                formData.append(name, data[name]);
            }

            // Fetch
            fetch(url, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Accept": "application/json",
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
            })
            .then(
                function(response) {
                    if (btn){
                        Button.enable(btn);
                    }

                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                        response.status);

                        msg.error('Looks like there was a problem! Please try again.', 'Error');
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function(data) {
                        if (data.type == 'success'){
                            success(data);
                        }
                        else{
                            msg.error(data.message, 'Error');
                        }
                    });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
                msg.error('Looks like there was a problem! Please try again.', 'Error');

                if (btn){
                    Button.enable(btn);
                }
            });
        },

        get_crossorigin: function(url, success, btn=null) {
            if (btn){
                Button.disable(btn);
            }

            // Fetch
            fetch(url)
            .then(
                function(response) {
                    if (btn){
                        Button.enable(btn);
                    }

                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                        response.status);

                        msg.error('Looks like there was a problem! Please try again.', 'Error');
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function(data) {
                        success(data);
                    });
                }
            )
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
                msg.error('Looks like there was a problem! Please try again.', 'Error');

                if (btn){
                    Button.enable(btn);
                }
            });
        },
    }
}();


// Pagination
var Pagination = function(){

    function closest3(n, pos){
        if (pos == 0 || pos == 1){
            return [0,1,2]
        }
        else if (pos == n-1 || pos == n-2){
            return [n-3, n-2, n-1]
        }
        else{
            return [pos-1, pos, pos+1]
        }
    }

    return {
        create: function(page_count, page, page_elem, caller_name){

            var page_html = '';
            for(var i = 0; i < page_count; i++){
                if (page_count > 3 && !closest3(page_count, page).includes(i)){
                    continue;
                }
                page_html += `
                    <li class="page-item ${(page == i) ? 'active' : ''}">
                        <button class="page-link" onclick="${caller_name}(${i});">${i+1}</button>
                    </li>
                `;
            }
            if (page > 0){
                page_html = `
                    <li class="page-item">
                        <button class="page-link" onclick="${caller_name}(${page-1});">Previous</button>
                    </li>
                    <li class="page-item">
                        <button class="page-link" onclick="${caller_name}(0);">First</button>
                    </li>
                ` + page_html;
            }
            if (page < page_count-1){
                page_html += `
                    <li class="page-item">
                        <button class="page-link" onclick="${caller_name}(${page+1});">Next</button>
                    </li>
                `;
            }

            page_elem.innerHTML = `
                <nav aria-label="Page navigation">
                    <ul class="pagination mb-0 text-small">
                        ${page_html}
                    </ul>
                </nav>
            `;
        }
    }
}();



// Audio Player
var Player = function(){
    // Current playing track (null otherwise)
    var playing_track = null;

    // All loaded tracks in play area
    /*
        main_tracks[track_len] = {
            name: name,
            path: path,
            start_time: start_time,
            audio: new Audio(path),
            is_playing: false,
        };
    */
    var main_tracks = [];

    // Is the main play active
    var main_playing = false;

    // Current Playing time in seconds
    var curr_time = 0;

    var play_interval = null;

    return {
        play: function(scale, init_per = 0){
            Player.stop();
            main_playing = true;
            msg.success('', 'Playing');

            var init_time = 0;
            if (init_per > 0){
                init_time = init_per*scale/100;
                init_time = Math.round(init_time*100)/100;

                curr_time = init_time;
            }

            // Check Tracks and move pointer every 0.01s
            play_interval = setInterval(function(){
                if (main_playing){
                    for(key in main_tracks){
                        var track = main_tracks[key];

                        if (!track.is_playing && curr_time >= track.start_time){
                            if (init_time > 0 && (curr_time - track.start_time) > 0){
                                track.audio.currentTime = curr_time - track.start_time;
                            }
                            track.audio.play();
                            track.is_playing = true;
                        }
                    }

                    curr_time += 0.01;
                    Player.move_line(curr_time, scale);
                }
                else{
                    clearInterval(play_interval);
                }
            }, 10);
        },

        move_line: function(time, scale){
            /*
                Moves the player line to desired time(s)
            */

            var line = document.getElementById('player-line');
            if (line){
                var left_per = time*100/scale;
                left_per = Math.round(left_per*100)/100;

                line.style.left = left_per.toString()+'%';
            }
        },

        add_track: function(track_len, name, path, start_time = 0){
            main_tracks[track_len] = {
                name: name,
                path: path,
                start_time: start_time,
                audio: new Audio(path),
                is_playing: false,
            };
        },

        move_track: function(track_len, start_time = 0){
            main_tracks[track_len].start_time = start_time;
        },

        rm_track: function(track_len){
            delete main_tracks[track_len];
        },

        stop: function(){
            if (playing_track){
                playing_track.pause();
                playing_track.currentTime = 0;
                playing_track = null;
            }

            if (main_playing){
                for(key in main_tracks){
                    var track = main_tracks[key];
                    track.audio.pause();
                    track.audio.currentTime = 0;
                    track.is_playing = false;
                }

                if (play_interval){
                    clearInterval(play_interval);
                }

                main_playing = false;
                curr_time = 0;
            }
        },

        play_track: function(path, name){
            if(path){
                Player.stop();
                playing_track = new Audio(path);
                playing_track.play();

                msg.success('Playing ' + name, 'Playing');
            }
        }
    }
}();


// Drag Tracks
var Drag = function(){

    return {
        handle: function(scale){
            /*
                Handles Drag Event for canvas
            */
            // Inner Width in px to initial scale warapper
            const wpx = document.getElementById('canvas-wrapper').offsetWidth;

            interact('.audio-visualize').draggable({
                startAxis: 'x',
                lockAxis: 'x',
                listeners: {
                    move (event) {
                        var x0 = (event.target.style.left) ? event.target.style.left : '0px';
                        x0 = parseInt(x0.replace('px', ''));
                        var diff = event.dx;
                        var x1 = x0 + diff;
                        if (x1 < 0){
                            x1 = 0;
                        }
                        event.target.style.left = x1.toString()+'px';

                        // Stop Player
                        Player.stop();
                        // Move Start time
                        var start_time = (x1 * scale100)/wpx;
                        start_time = Math.round(start_time * 100)/100;

                        var track_len = parseInt(event.target.id.replace('canvas-', ''));
                        Player.move_track(track_len, start_time);

                    },
                }
            });
        },

        handle_line: function(){
            /*
                Handles Drag Event for pointer line
            */
            // Inner Width in px to initial scale warapper
            const wpx = document.getElementById('canvas-wrapper').offsetWidth;

            interact('#player-line').draggable({
                startAxis: 'x',
                lockAxis: 'x',
                listeners: {
                    move (event) {
                        var x0 = (event.target.style.left) ? event.target.style.left : '0%';
                        x0 = parseFloat(x0.replace('%', ''));
                        var diff = event.dx*100/wpx;
                        var x1 = x0 + diff;
                        if (x1 < 0){
                            x1 = 0;
                        }
                        x1 = Math.round(x1*100)/100;
                        event.target.style.left = x1.toString()+'%';

                        // Stop Player
                        Player.stop();
                    },
                }
            });
        },
    }
}();



window.addEventListener('load', (event) => {
    console.log('Sounds App :-)');


    // Msg
    document.getElementById('popup').style.display = 'none';

    // Validation
    var forms = document.getElementsByClassName('needs-validation');

    Array.prototype.slice.call(forms).forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (FormValidate.validate(form)){
                var btn = form.querySelector('input[type="submit"], button[type="submit"]');
                Button.disable(btn);

                form.submit();
            }
        });
    });

});
