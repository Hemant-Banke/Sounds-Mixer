
<?php function extra_head(){ ?>

    <link rel="preload" href="<?php echo STATIC_DIR."css/style-main.css"; ?>" type="text/css" media="screen" as="style" />
    <link rel="stylesheet" href="<?php echo STATIC_DIR."css/style-main.css"; ?>" type="text/css" media="screen" />

<?php } ?>


<?php function content(){ ?>

    <div class="d-flex">
        <div class="sidebar">
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

                            <button class="btn btn-primary float-right" data-path="<?php echo $path; ?>">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    <?php endforeach ?>
                <?php endif ?>

            </div>
        </div>


        <div class="main">
            <h4 class="font-weight-bold">Play Area</h4>
        </div>
    </div>

<?php } ?>


<?php function extra_body(){ ?>

    <script async src="<?php echo STATIC_DIR."js/tkd_script.js"; ?>"></script>
    <script async src="<?php echo STATIC_DIR."js/main.js"; ?>"></script>

<?php } ?>