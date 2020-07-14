/*
    Draws Audio into Canvas
*/
// Number of seconds displayed in initial zoom
var scale100 = 5*60;

var drawAudio = function(){

    // Hardcoded value to convert from blocksize to seconds
    const block_to_seconds = 0.001585;
    // Hardcoded value to convert from raw length to seconds
    const raw_to_seconds = block_to_seconds/70;

    var height = 75;
    var last_sample = null;

    /**
     * Filters the AudioBuffer retrieved from an external source
     * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
     * @returns {Array} an array of floating point numbers
     */
    const filterData = audioBuffer => {
        const rawData = audioBuffer.getChannelData(0);
        const samples = Math.floor(rawData.length * raw_to_seconds) * 2; // Sample every 0.5s
        const blockSize = Math.floor(rawData.length / samples);

        const filteredData = [];
        for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i;
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum = sum + Math.abs(rawData[blockStart + j]);
            }
            filteredData.push(sum / blockSize);
        }
        last_sample = samples;
        return filteredData;
    };


    /**
     * Normalizes the audio data to make a cleaner illustration
     * @param {Array} filteredData the data from filterData()
     * @returns {Array} an normalized array of floating point numbers
     */
    const normalizeData = filteredData => {
        const multiplier = Math.pow(Math.max(...filteredData), -1);
        return filteredData.map(n => n * multiplier);
    }


    /**
     * Draws the audio file into a canvas element.
     * @param {Array} normalizedData The filtered array returned from filterData()
     * @returns {Array} a normalized array of data
     */
    const draw = (normalizedData, canvas) => {
        // set up the canvas
        const dpr = window.devicePixelRatio || 1;
        const padding = 5;
        const width100 = document.getElementById('canvas-wrapper').offsetWidth;

        // Display scale100 seconds in initial zoom
        const cwidth = width100 * (last_sample/2) / scale100;

        canvas.width = cwidth * dpr;
        canvas.height = height * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.translate(0, canvas.offsetHeight / 2); // set Y = 0 to be in the middle of the canvas

        // draw the line segments
        const width = canvas.offsetWidth / normalizedData.length;
        for (let i = 0; i < normalizedData.length; i++) {
            const x = width * i;
            let height = Math.round(normalizedData[i] * (canvas.offsetHeight - 2*padding) * 100) / 200;
            if (height < 0) {
                height = 0;
            }
            else if (height > canvas.offsetHeight/2 - padding) {
                height = canvas.offsetHeight/2 - padding;
            }
            drawLineSegment(ctx, x, height, width);
        }
    };


    /**
     * A utility function for drawing our line segments
     * @param {AudioContext} ctx the audio context
     * @param {number} x  the x coordinate of the beginning of the line segment
     * @param {number} height the desired height of the line segment
     * @param {number} width the desired width of the line segment
     * @param {boolean} isEven whether or not the segmented is even-numbered
     */
    const drawLineSegment = (ctx, x, height, width) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, -height);
        ctx.stroke();
    };

    return {
        audio: function(url, canvas){
            /**
             * Retrieves audio from an external source, the initializes the drawing function
             * @param {String} url the url of the audio we'd like to fetch
             */

            Loader.start();

            // Set up audio context
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();

            fetch(url)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    Loader.end();
                    draw(normalizeData(filterData(audioBuffer)), canvas)
                });
        },
    }
}();


/*
    Handles Tiles
*/
var Tiles = function(){

    /*
        Add Event to play indivisual tracks
    */
    var play_track_event = function(){
        var play_btns = document.querySelectorAll(`.tile-wrapper .btn-tile-play`);
        Array.prototype.slice.call(play_btns).forEach((btn) => {
            btn.addEventListener('click', function(){
                var path = btn.getAttribute('data-path')
                var name = btn.getAttribute('data-name')

                Player.play_track(path, name);
            });
        });

        /*
            Add Event to adjust volume
        */
        var vol_btns = document.querySelectorAll(`.tile-wrapper .btn-tile-vol`);
        Array.prototype.slice.call(vol_btns).forEach((inp) => {
            inp.addEventListener('click', function(){
                var tile_len = inp.getAttribute('data-tile-len')
                var vol = inp.value;

                Player.change_vol(tile_len, vol);
            });
        });
    }

    /*
        Add Event to remove indivisual tracks
    */
    var remove_event = function(){
        var rm_btns = document.querySelectorAll(`.tile-wrapper .btn-main-move`);
        Array.prototype.slice.call(rm_btns).forEach((btn) => {
            btn.addEventListener('click', function(){
                var tile_len = btn.getAttribute('data-tile-len')
                Tiles.remove(tile_len);
            });
        });
    }


    return {
        add: function(name, path, start_time = 0, vol=1){
            var tile_len = document.getElementsByClassName('tile-wrapper').length + 1;
            var tile_id = 'tile-' + tile_len.toString();
            var canvas_id = 'canvas-' + tile_len.toString();

            // Add Tile
            var tile = document.createElement('div');
            tile.setAttribute('id', tile_id);
            tile.setAttribute('class', 'tile-wrapper');
            tile.innerHTML += `
                <button class="btn btn-primary btn-main-move" data-tile-len="${tile_len}" name="btn-main-move">
                    <i class="fas fa-minus"></i>
                </button>

                <div class="text-wrap">
                    <span class="text-truncate elem-title">${name}</span>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-rounded btn-secondary btn-tile-play"
                            data-path="${path}"
                            data-name="${name}"
                            name="btn-tile-play" title="Play Track">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn btn-rounded btn-secondary ml-2" title="Adjust Volume">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <input type="range" class="form-range btn-tile-vol ml-2"
                            title="Adjust Volume" min="0" max="1" step="0.01" value="${vol}" data-tile-len="${tile_len}">
                    </div>
                </div>
            `;
            document.getElementById('tiles-wrapper')
            .appendChild(tile);

            // Play Track
            play_track_event();
            Player.add_track(tile_len, name, path, start_time, vol);

            // Add Canvas
            var canvas = document.createElement('canvas');
            canvas.setAttribute('id', canvas_id);
            canvas.setAttribute('class', 'audio-visualize');

            // ctx wrapper
            var ctx_wrap = document.createElement('div');
            ctx_wrap.setAttribute('class', 'ctx-wrapper');

            document.getElementById('canvas-wrapper')
            .appendChild(ctx_wrap)
            .appendChild(canvas);

            var wpx = document.getElementById('canvas-wrapper').offsetWidth;
            var x1 = (start_time * wpx)/scale100;
            canvas.style.left = x1.toString()+'px';

            drawAudio.audio(path, canvas);

            // Remove Event
            remove_event();

            // Drag Event
            Drag.handle(scale100);
            document.querySelector('.main-audio .empty-wrap').style.display = 'none';
            document.querySelector('#player-line').style.display = 'block';
            document.querySelector('.ruler').style.display = 'flex';
            ruler();
        },

        remove: function(tile_len){
            // Remove corresponding tile and canvas
            var tile = document.getElementById('tile-'+tile_len.toString());
            var canvas = document.getElementById('canvas-'+tile_len.toString()).parentElement;
            if (tile){ tile.remove(); }
            if (canvas){ canvas.remove(); }

            Player.rm_track(tile_len);

            if (document.getElementsByClassName('tile-wrapper').length == 0){
                document.querySelector('.main-audio .empty-wrap').style.display = 'flex';
                document.querySelector('#player-line').style.display = 'none';
                document.querySelector('.ruler').style.display = 'none';
            }
        },

        empty: function(){
            // Remove all tile and canvas
            document.getElementById('tiles-wrapper').innerHTML = '';
            document.getElementById('canvas-wrapper').innerHTML = `
                <div id="player-line"><i class="fas fa-sort-down"></i></div>

                <div class="ruler">
                    <div class="ruler-main" id="ruler-main">
                        <canvas id="canv-1" width="2555.9" height="16"></canvas>
                        <canvas class="ruler-inner" id="canv-2" height="15" width="2555.9"></canvas>
                    </div>
                </div>
            `;

            Player.empty();

            if (document.getElementsByClassName('tile-wrapper').length == 0){
                document.querySelector('.main-audio .empty-wrap').style.display = 'flex';
                document.querySelector('#player-line').style.display = 'none';
                document.querySelector('.ruler').style.display = 'none';
            }
        },
    }
}();



window.addEventListener('load', (event) => {

    var btn_play = document.getElementById('btn-play');
    var btn_play_curr = document.getElementById('btn-play-curr');
    var btn_stop = document.getElementById('btn-stop');
    var btn_record = document.getElementById('btn-record');
    var btn_save = document.getElementById('btn-save');
    var btn_load = document.getElementById('btn-load');
    var btn_new = document.getElementById('btn-new');

    var m_save = new bootstrap.Modal(document.getElementById('modal-save'));
    var m_load = new bootstrap.Modal(document.getElementById('modal-load'));

    // Player Buttons Event
    btn_play.addEventListener('click', function(){
        Player.play(scale100);
    });

    btn_play_curr.addEventListener('click', function(){
        var line = document.getElementById('player-line');
        var init_per = 0;
        if (line){
            init_per = parseFloat(line.style.left.replace('%', ''));
        }

        Player.play(scale100, init_per);
    });

    btn_stop.addEventListener('click', function(){
        Player.stop();
    });

    btn_new.addEventListener('click', function(){
        Tiles.empty();
    });

    /*
        Saving
    */
    btn_save.addEventListener('click', function(){
        Player.stop();

        if (Player.get_save_status()){
            Player.save(Player.get_save_status);
        }
        else{
            m_save.show();
        }
    });

    document.getElementById('mbtn-save')
    .addEventListener('click', function(){
        Player.save(document.getElementById('msave_name').value);
        m_save.hide();
    });


    /*
        Loading
    */
    btn_load.addEventListener('click', function(){
        Player.stop();
        m_load.show();

        Fetch.post(
            basepath+'controller/actions.php',
            {
                action: 'save_names',
            },
            function(data){
                var saves_wrap = document.getElementById('mload-saves');
                saves_wrap.innerHTML = '';

                data.saves.forEach((save) => {
                    var save_elem = document.createElement('div');
                    save_elem.setAttribute('class', 'card shadow-sm border cursor-pointer mbtn-load-save mb-2');
                    save_elem.setAttribute('data-name', save.save_name);
                    save_elem.innerHTML = `
                        <div class="card-body">
                            <div class="w-100 text-truncate font-weight-bold">${save.save_name}</div>
                            <small>${save.lastedited}</small>
                        </div>
                    `;

                    saves_wrap.appendChild(save_elem);

                    save_elem.addEventListener('click', function(){
                        Player.load(save.save_name, Tiles);
                        m_load.hide();
                    });
                });

                if (data.saves == false){
                    saves_wrap.innerHTML = `
                        <div class="card-body">
                            <h6 class="text-center">Nothing Found :(</h6>
                        </div>
                    `;
                }
            }
        );
    });


    // Pointer Line Drag Event
    Tiles.empty();
    Drag.handle_line();


    // Add Audio to main
    var btn_move = document.getElementsByClassName('btn-sidebar-move');
    Array.prototype.slice.call(btn_move).forEach((btn) => {
        btn.addEventListener('click', (e) => {
            var path = btn.getAttribute('data-path');
            var name = btn.getAttribute('data-name');
            Tiles.add(name, path);
        });
    });

});


// ruler
function ruler(){
    var canv_1 = document.getElementById('canv-1');
    var ctx_1 = canv_1.getContext("2d");

    var canv_2 = document.getElementById('canv-2');
    var ctx_2 = canv_2.getContext("2d");
    ctx_2.moveTo(0, 14);
    ctx_2.lineTo(2540, 14);
    ctx_2.stroke();

    ctx_1.fillStyle = "white";
    ctx_1.font = "15px Arial";
    var k=0;
    var n =0;
    for(var i=0;i<canv_2.width;i+=41.9){
        if (k%6 == 0 || k==0){
            var y=0;
            ctx_1.fillText(n+"min", i,14 );
            n++
        }
        else{
            var y=7;
        }
        ctx_2.moveTo(i,y);
        ctx_2.lineTo(i,15);
        k++;
    }
    ctx_2.stroke();
}