<?php

require_once('Conf.php');

class Model
{

    public static $pdo;

    public static function init_pdo()
    {
        $host = Conf::getHostname();
        $dbname = Conf::getDatabase();
        $login = Conf::getLogin();
        $pass = Conf::getPassword();
        try {
            // connexion à la base de données
            // le dernier argument sert à ce que toutes les chaines de charactères
            // en entrée et sortie de MySql soit dans le codage UTF-8
            self::$pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            // on active le mode d'affichage des erreurs, et le lancement d'exception en cas d'erreur
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }

    public static function selectAll()
    {
        try {
            $pdo = self::$pdo;
            $table_name = static::$object;
            $class_name = 'Model' . ucfirst(static::$object);
            $sql = "SELECT * from $table_name";
            $rep = $pdo->query($sql);
            $rep->setFetchMode(PDO::FETCH_CLASS, $class_name);
            return $rep->fetchAll();
        } catch (PDOException $e) {
            echo $e->getMessage(); // affiche un message d'erreur
            die();
        }
    }

    public static function select($primary)
    {
        try {
            $table_name = static::$object;
            $class_name = 'Model' . ucfirst(static::$object);
            $primary_key = static::$primary;
            $sql = "SELECT * from $table_name WHERE $primary_key=:primary";
            // Préparation de la requête
            $req_prep = Model::$pdo->prepare($sql);

            $values = array(
                "primary" => $primary
            );
            // On donne les valeurs et on exécute la requête
            $req_prep->execute($values);

            // On récupère les résultats comme précédemment
            $req_prep->setFetchMode(PDO::FETCH_CLASS, $class_name);
            $tab_results = $req_prep->fetchAll();
            // Attention, si il n'y a pas de résultats, on renvoie false
            if (empty($tab_results))
                return false;
            return $tab_results[0];
        } catch (PDOException $e) {
            echo $e->getMessage(); // affiche un message d'erreur
            die();
        }
    }

    public static function delete($primary)
    {
        try {
            $table_name = static::$object;
            $primary_key = static::$primary;
            $sql = "DELETE FROM $table_name WHERE $primary_key=:primary;";
            // Préparation de la requête
            $req_prep = Model::$pdo->prepare($sql);

            $values = array(
                "primary" => $primary
            );
            // On donne les valeurs et on exécute la requête
            return $req_prep->execute($values);
        } catch (PDOException $e) {
            echo $e->getMessage(); // affiche un message d'erreur
            die();
        }
    }

    public static function update($data)
    {
        try {
            $table_name = static::$object;
            $primary_key = static::$primary;
            $set_parts = array();
            foreach ($data as $key => $value) {
                $set_parts[] = "$key=:$key";
            }
            $set_string = join(',', $set_parts);
            $sql = "UPDATE $table_name SET $set_string WHERE $primary_key=:$primary_key";
            // Préparation de la requête
            $req_prep = Model::$pdo->prepare($sql);

            // On donne les valeurs et on exécute la requête
            return $req_prep->execute($data);
        } catch (PDOException $e) {
            echo $e->getMessage(); // affiche un message d'erreur
            die();
        }
    }

    public static function save($data)
    {
        try {
            $table = static::$object;

            $attributes = array_keys($data);
            $into_string = '(' . join(',', $attributes) . ')';

            //Rajoute ":" avant les attributs
            function my_prepend($s)
            {
                return ":" . $s;
            }

            $values_string = '(' . join(',', array_map("my_prepend", $attributes)) . ')';

            $sql = "INSERT INTO $table $into_string VALUES $values_string";
            // Preparation de la requete
            $req = self::$pdo->prepare($sql);
            // execution de la requete
            // return $req->execute($data);

            // Exécution de la requête avec transaction
            self::$pdo->beginTransaction();
            $req->execute($data);
            $id = self::$pdo->lastInsertId();
            self::$pdo->commit();
            return $id;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de l\'insertion dans la BDD " . static::$table);
        }
    }

}

// on initialise la connexion $pdo
Model::init_pdo();
