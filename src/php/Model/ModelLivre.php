<?php

require_once "Model.php";
require_once "ModelAdherent.php";
require_once "ModelEmprunt.php";

class ModelLivre extends Model {
    static $object = "livre";
    static $primary = "idLivre";

}