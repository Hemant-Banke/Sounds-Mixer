<?php
ini_set('display_errors', 1);

/*
    Load DB Config
*/
include '../helpers/config.php';


/*
    Load Saves
*/
function load_save($load_name){
    global $link;

    $load_name = htmlentities($load_name);

    $stmt = $link->prepare("SELECT save_tracks FROM ".DB_TABLE." WHERE save_name = ?");
    $stmt->bind_param('s', $name);
    $name = $load_name;

    /* execute prepared statement */
    $res = $stmt->execute();
    $tr_res = $stmt->get_result();

    $row = $tr_res->fetch_assoc();

    if ($res){
        echo json_encode([
            'type'=> 'success',
            'tracks' => $row,
        ]);
    }
    else{
        echo json_encode([
            'type'=> 'error',
            'message'=>'Error in loading',
        ]);
    }
}

/*
    Save Tracks
*/
function save_tracks($save_name, $saved, $tracks){
    global $link;

    $save_name = htmlentities($save_name);

    if ($saved){
        $stmt = $link->prepare("UPDATE ".DB_TABLE." SET save_tracks = ?, lastedited = ? WHERE save_name = ?");
        $stmt->bind_param('sss', $tr ,$date, $name);
        $tr = json_encode($tracks);
        $date = date('Y-m-d H:i:s');
        $name = $save_name;

        /* execute prepared statement */
        $res = $stmt->execute();

        if ($res){
            echo json_encode([
                'type'=> 'success',
            ]);
        }
        else{
            echo json_encode([
                'type'=> 'error',
                'message'=>'Error in saving',
            ]);
        }
    }
    else{
        $stmt = $link->prepare("INSERT INTO ".DB_TABLE." (save_name, save_tracks, lastedited) VALUES (?, ?, ?)");
        $stmt->bind_param('sss', $name, $tr, $date);
        $name = $save_name;
        $tr = json_encode($tracks);
        $date = date('Y-m-d H:i:s');

        /* execute prepared statement */
        $res = $stmt->execute();

        if ($res){
            echo json_encode([
                'type'=> 'success',
            ]);
        }
        else{
            echo json_encode([
                'type'=> 'error',
                'message'=>'Error in saving',
            ]);
        }
    }

}

/*
    Save Names
*/
function save_names(){
    global $link;

    $stmt = $link->prepare("SELECT save_name, lastedited FROM ".DB_TABLE." ORDER BY lastedited DESC");
    /* execute prepared statement */
    $stmt->execute();
    $saves_res = $stmt->get_result();
    $saves = array();

    while ($row = $saves_res->fetch_assoc()) {
        $row['lastedited'] = date( 'F j, Y, g:i a', strtotime($row['lastedited']));
        array_push($saves, $row);
    }

    echo json_encode([
        'type'=> 'success',
        'saves'=> $saves,
    ]);

}


$_POST = json_decode(file_get_contents('php://input'), true);
if (isset($_POST['action'])){
    if ($_POST['action'] == 'save'){
        save_tracks($_POST['new_name'], $_POST['saved'], $_POST['tracks']);
    }
    elseif ($_POST['action'] == 'load'){
        load_save($_POST['load_name']);
    }
    elseif ($_POST['action'] == 'save_names'){
        save_names();
    }
}


?>