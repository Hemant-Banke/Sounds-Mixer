
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
    var playing_audio = null;

    return {
        play: function(){
            msg.success('', 'Playing');
        },

        stop: function(){
            if (playing_audio){
                playing_audio.pause();
            }
        },

        play_track: function(path, name){
            if(path){
                Player.stop();
                playing_audio = new Audio(path);
                playing_audio.play();

                msg.success('Playing ' + name, 'Playing');
            }
        }
    }
}();


// Drag Tracks
var Drag = function(){

    return {
        handle: function(){
            /*
                Handles Drag Event for canvas
            */
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
