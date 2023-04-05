class Livre{

    constructor(id,nom) {
        this._id = id;
        this._nom = nom;
    }

    toString(){
        return this._id+" - "+this._nom;
    }

    get id() {
        return this._id;
    }

    get titre() {
        return this._nom;
    }

    equals(id){
        if(this._id===id){
            return true;
        }
        else {
            return false;
        }
    }
}