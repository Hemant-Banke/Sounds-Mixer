<?php

    // Base Directory
    $base_dir = dirname(__FILE__).'/';

    /*
        Environment
    */
    $site_host = $_SERVER['HTTP_HOST'] ;
    if($site_host == "localhost")
    {
        define('ENVIRONMENT', 'development');
        // LAMP
        $base_dir = str_replace('/var/www/html', '', $base_dir);
        // XAMPP
        $base_dir = str_replace('file:///C:/xampp/htdocs', '', $base_dir);
        // $base_dir = '/projects/Sounds-Mixer/';
    }
    elseif(strstr($site_host,"demo-")){
        define('ENVIRONMENT' , 'testing');
    }
    else{
        define('ENVIRONMENT', 'production');
    }

    /*
        Setting Directories after Environment
    */
    define('BASE_DIR', dirname(__FILE__).'/');

    define('BASEPATH', $base_dir);
    define('STATIC_DIR', $base_dir.'static/');
    define('TEMPLATE_DIR', BASE_DIR.'template/');


    /*
        Error Reporting
    */
    switch (ENVIRONMENT)
    {
        case 'development':
            //error_reporting(-1);
            error_reporting(E_ALL ^ E_NOTICE  | E_WARNING | E_PARSE  );
            ini_set('display_errors', 1);
        break;

        case 'testing':
        case 'production':
            ini_set('display_errors', 0);
            if (version_compare(PHP_VERSION, '5.3', '>=')){
                error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT & ~E_USER_NOTICE & ~E_USER_DEPRECATED);
            }
            else{
                error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_USER_NOTICE);
            }
        break;

        default:
            header('HTTP/1.1 503 Service Unavailable.', TRUE, 503);
            echo 'The application environment is not set correctly.';
            exit(1); // EXIT_ERROR
    }


    /*
        Load Helpers
    */
    include BASE_DIR.'helpers/functions.php';


    /*
        Load Index SPA
    */
    include TEMPLATE_DIR.'main/index.php';
    include TEMPLATE_DIR.'layout/base.php';

?>