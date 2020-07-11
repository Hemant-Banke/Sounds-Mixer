/*
    Draws Audio into Canvas
*/
var drawAudio = function(){

    /**
     * Filters the AudioBuffer retrieved from an external source
     * @param {AudioBuffer} audioBuffer the AudioBuffer from drawAudio()
     * @returns {Array} an array of floating point numbers
     */
    const filterData = audioBuffer => {
        const rawData = audioBuffer.getChannelData(0);
        const samples = 70;
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
        const padding = 20;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.translate(0, canvas.offsetHeight / 2 + padding); // set Y = 0 to be in the middle of the canvas

        // draw the line segments
        const width = canvas.offsetWidth / normalizedData.length;
        for (let i = 0; i < normalizedData.length; i++) {
            const x = width * i;
            let height = normalizedData[i] * canvas.offsetHeight - padding;
            if (height < 0) {
                height = 0;
            }
            else if (height > canvas.offsetHeight / 2) {
                height = height > canvas.offsetHeight / 2;
            }
            drawLineSegment(ctx, x, height, width, (i + 1) % 2);
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
    const drawLineSegment = (ctx, x, height, width, isEven) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        height = isEven ? height : -height;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
        ctx.lineTo(x + width, 0);
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
        add: function(name, path){
            var tile_len = document.getElementsByClassName('tile-wrapper').length + 1;
            var tile_id = 'tile-' + tile_len.toString();
            var canvas_id = 'canvas-' + tile_len.toString();

            // Add Tile
            document.getElementById('tiles-wrapper').innerHTML += `
                <div class="tile-wrapper" id="${tile_id}">
                    <button class="btn btn-primary btn-main-move" data-tile-len="${tile_len}" name="btn-main-move">
                        <i class="fas fa-chevron-left"></i>
                    </button>

                    <div class="text-wrap">
                        <span class="text-truncate elem-title">${name}</span>
                        <button class="btn btn-rounded btn-secondary btn-tile-play"
                            data-path="${path}"
                            data-name="${name}"
                            name="btn-tile-play" title="Play Track">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
            `;

            // Play Track
            play_track_event();

            // Add Canvas
            var canvas = document.createElement('canvas');
            canvas.setAttribute('id', canvas_id);
            canvas.setAttribute('class', 'audio-visualize');
            document.getElementById('canvas-wrapper').appendChild(canvas);

            drawAudio.audio(path, canvas);

            // Remove Event
            remove_event();
            document.querySelector('.main-audio .empty-wrap').style.display = 'none';
        },

        remove: function(tile_len){
            // Remove corresponding tile and canvas
            var tile = document.getElementById('tile-'+tile_len.toString());
            var canvas = document.getElementById('canvas-'+tile_len.toString());
            if (tile){ tile.remove(); }
            if (canvas){ canvas.remove(); }

            if (document.getElementsByClassName('tile-wrapper').length == 0){
                document.querySelector('.main-audio .empty-wrap').style.display = 'flex';
            }
        },
    }
}();



window.addEventListener('load', (event) => {

    var btn_play = document.getElementById('btn-play');
    var btn_stop = document.getElementById('btn-stop');
    var btn_record = document.getElementById('btn-record');

    // Player Buttons Event
    btn_play.addEventListener('click', function(){
        Player.play()
    });

    btn_stop.addEventListener('click', function(){
        Player.stop()
    });


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
