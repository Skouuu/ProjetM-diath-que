<?php

require_once "Model.php";
require_once "ModelLivre.php";
require_once "ModelEmprunt.php";

class ModelAdherent extends Model {
    static $object = "adherent";
    static $primary = "idAdherent";

}