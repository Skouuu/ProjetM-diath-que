<?php

require_once "../Model/ModelAdherent.php";

$action = $_GET["action"] ?? "read";
$actions = get_class_methods("ControlleurAdherent");
if (in_array($action, $actions))
    ControlleurAdherent::$action();

class ControlleurAdherent
{

    static function readAll()
    {
        $adherents = ModelAdherent::selectAll();
        echo json_encode($adherents);
    }

    static function create()
    {
        $adherent = [
            "nomAdherent" => $_POST["nom"]
        ];
        $id = ModelAdherent::save($adherent);
        echo json_encode($id);
    }

    static function delete()
    {
        $id = $_GET["id"];
        ModelAdherent::delete($id);
    }

}