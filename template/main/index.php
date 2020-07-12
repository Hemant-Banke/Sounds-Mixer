
<?php function extra_head(){ ?>

    <link rel="preload" href="<?php echo STATIC_DIR."css/style-main.css"; ?>" type="text/css" media="screen" as="style" />
    <link rel="stylesheet" href="<?php echo STATIC_DIR."css/style-main.css"; ?>" type="text/css" media="screen" />

<?php } ?>


<?php function content(){ ?>

    <div class="d-flex">
        <div class="sidebar custom-scroll">
            <h4 class="font-weight-bold">Audio Files</h4>

            <div class="elem-list mt-3">

                <?php
                    $imgdir = BASE_DIR.'static/audio/';
                    $col = FALSE;

                    if(realpath($imgdir)){
                        $col = glob( $imgdir . '{*.wav,*.mp3}', GLOB_BRACE );
                    }

                ?>

                <?php if ($col): ?>
                    <?php foreach($col as $file): ?>
                        <?php
                            $filename = pathinfo( $file, PATHINFO_BASENAME );
                            $path = STATIC_DIR.str_replace( BASE_DIR.'static/', '', $file );
                            $filesize = human_filesize( filesize( $file ) );
                        ?>

                        <div class="elem">
                            <div class="elem-img-wrap">
                                <img class="lazyload" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
                                    data-src="<?php echo STATIC_DIR.'img/headphone.svg'; ?>" alt="Audio">
                            </div>

                            <div class="text-wrap">
                                <span class="text-truncate elem-title"><?php echo $filename; ?></span>
                                <span class="text-truncate"><?php echo $filesize; ?></span>
                            </div>

                            <button class="btn btn-primary btn-sidebar-move"
                                data-path="<?php echo $path; ?>"
                                data-name="<?php echo $filename; ?>"
                                name="btn-sidebar-move">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    <?php endforeach ?>
                <?php endif ?>

            </div>
        </div>


        <div class="main custom-scroll">
            <h4 class="font-weight-bold">Play Area</h4>

            <div class="play-btn-wrapper my-3">
                <button class="btn btn-rounded btn-secondary btn-play" id="btn-play" name="btn-play" title="Play">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn btn-rounded btn-secondary btn-play-curr" id="btn-play-curr" name="btn-play-curr" title="Play from selected">
                    <i class="fas fa-arrow-right"></i>
                </button>
                <button class="btn btn-rounded btn-secondary btn-stop" id="btn-stop" name="btn-stop" title="Stop">
                    <i class="fas fa-stop"></i>
                </button>
                <button class="btn btn-rounded btn-secondary btn-record" id="btn-record" name="btn-record" title="Record">
                    <i class="fas fa-dot-circle"></i>
                </button>
            </div>


            <div class="d-flex main-audio custom-scroll">

                <div class="empty-wrap">
                    <img class="lazyload" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
                        data-src="<?php echo STATIC_DIR.'img/ghost.svg'; ?>" alt="Nothing added to play area">

                    <div class="text-light">
                        Add tracks to Play Area
                    </div>
                </div>

                <div class="tiles-wrapper" id="tiles-wrapper"></div>

                <div class="canvas-wrapper custom-scroll" id="canvas-wrapper">
                    <div id="player-line"><i class="fas fa-sort-down"></i></div>

                    <div class="ruler">
                        <div class="ruler-main" id="ruler-main">
                            <canvas id="canv-1" width="2555.9" height="16"></canvas>
                            <canvas class="ruler-inner" id="canv-2" height="15" width="2555.9"></canvas>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

<?php } ?>


<?php function extra_body(){ ?>

    <script async src="<?php echo STATIC_DIR."js/interact.js"; ?>"></script>
    <script async src="<?php echo STATIC_DIR."js/tkd_script.js"; ?>"></script>
    <script async src="<?php echo STATIC_DIR."js/main.js"; ?>"></script>

<?php } ?>