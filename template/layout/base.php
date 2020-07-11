<!DOCTYPE html>

<html lang="en-US">
<head>
    <title>Sounds</title>

	<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <meta name="author" content="Sounds">
    <meta name="description" content="Mixes Sounds I guess">

    <!-- Page Loader -->
    <style>
        .page-loader{
            width: 100%;
            height: 100%;
            background-color: #4d4d4d;
            color: #fff;
            position: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: 'Lucida Sans', 'sans-serif', 'sans';
        }
        .page-loader img.page-loader-img{
            width: 80px;
            height: 80px;
            border-radius: 50%;
            box-shadow: 0px 0.125rem 0.25rem 2px rgba(0, 0, 0, 0.075);
        }
    </style>

	<!-- Bootstrap -->
    <link rel="preload" href="<?php echo STATIC_DIR."css/bootstrap.min.css"; ?>" as="style">
    <link rel="stylesheet" href="<?php echo STATIC_DIR."css/bootstrap.min.css"; ?>">

	<link rel="preload" href="<?php echo STATIC_DIR."css/style.css"; ?>" type="text/css" media="screen" as="style" />
	<link rel="stylesheet" href="<?php echo STATIC_DIR."css/style.css"; ?>" type="text/css" media="screen" />

	<!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

	<!-- Fonts -->
    <link rel="preload" href="<?php echo STATIC_DIR."css/all.css"; ?>" as="style">
    <link rel="stylesheet" href="<?php echo STATIC_DIR."css/all.css"; ?>">

    <link rel="preload" href="<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-regular.woff2"; ?>" as="font" crossorigin>
    <link rel="preload" href="<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-500.woff2"; ?>" as="font" crossorigin>
    <link rel="preload" href="<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-700.woff2"; ?>" as="font" crossorigin>
    <style>
        /* ubuntu-regular - latin */
        @font-face {
            font-family: 'Ubuntu';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-regular.eot"; ?>'); /* IE9 Compat Modes */
            src: local('Ubuntu Regular'), local('Ubuntu-Regular'),
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-regular.eot"; ?>?#iefix') format('embedded-opentype'), /* IE6-IE8 */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-regular.woff2"; ?>') format('woff2'), /* Super Modern Browsers */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-regular.woff"; ?>') format('woff'), /* Modern Browsers */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-regular.ttf"; ?>') format('truetype'), /* Safari, Android, iOS */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-regular.svg"; ?>#Ubuntu') format('svg'); /* Legacy iOS */
        }
        /* ubuntu-500 - latin */
        @font-face {
            font-family: 'Ubuntu';
            font-style: normal;
            font-weight: 500;
            font-display: swap;
            src: url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-500.eot"; ?>'); /* IE9 Compat Modes */
            src: local('Ubuntu Medium'), local('Ubuntu-Medium'),
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-500.eot"; ?>?#iefix') format('embedded-opentype'), /* IE6-IE8 */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-500.woff2"; ?>') format('woff2'), /* Super Modern Browsers */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-500.woff"; ?>') format('woff'), /* Modern Browsers */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-500.ttf"; ?>') format('truetype'), /* Safari, Android, iOS */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-500.svg"; ?>#Ubuntu') format('svg'); /* Legacy iOS */
        }
        /* ubuntu-700 - latin */
        @font-face {
            font-family: 'Ubuntu';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-700.eot"; ?>'); /* IE9 Compat Modes */
            src: local('Ubuntu Bold'), local('Ubuntu-Bold'),
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-700.eot"; ?>?#iefix') format('embedded-opentype'), /* IE6-IE8 */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-700.woff2"; ?>') format('woff2'), /* Super Modern Browsers */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-700.woff"; ?>') format('woff'), /* Modern Browsers */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-700.ttf"; ?>') format('truetype'), /* Safari, Android, iOS */
                url('<?php echo STATIC_DIR."fonts/ubuntu/ubuntu-v14-latin-700.svg"; ?>#Ubuntu') format('svg'); /* Legacy iOS */
        }
    </style>


	<?php if (function_exists('extra_head')){ extra_head(); } ?>
</head>

<body>

    <div class="page-loader" id="page-loader">
        Loading...
    </div>

    <div class="wrapper">
        <!-- Wrapper Start -->

        <?php include TEMPLATE_DIR."layout/header.php"; ?>

        <?php if(function_exists('content')){ content(); } ?>

    </div>

    <?php include TEMPLATE_DIR."layout/footer.php"; ?>

    <div id="popup"></div>

    <script>
        document.addEventListener('DOMContentLoaded', (event) => {
            document.getElementById('page-loader').style.display = 'none';
        });
    </script>

	<?php if(function_exists('extra_body')){ extra_body(); } ?>

	<script async src="<?php echo STATIC_DIR."js/lazysizes.min.js"; ?>"></script>

	<!-- Popper -->
	<script async src="<?php echo STATIC_DIR."js/popper.min.js"; ?>"></script>

	<!-- Bootstrap JS -->
	<script async src="<?php echo STATIC_DIR."js/bootstrap.min.js"; ?>"></script>

</body>

</html>
