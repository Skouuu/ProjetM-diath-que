class Adherent{


    constructor(id,nom) {
        this._id = id;
        this._nom = nom;
        this._livres=[];
        this.nbLivre=0;
    }


    toString(){
        return this._id+" - "+this._nom;
    }


    get id() {
        return this._id;
    }

    get nom() {
        return this._nom;
    }

    livre(){
        return this._livres;
    }

    nbLivres(){
        console.log(this._livres);
        for (const livres of this._livres) {
            this.nbLivre++;
        }
        return this.nbLivre;
    }


    addLivres(value) {
        this._livres=value;
    }
}