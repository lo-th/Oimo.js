/**
* The Dictionary class for testing
* @author lo-th
*/
OIMO.Dictionary = function () {

    this.data = {};
    this.keys = [];

};

OIMO.Dictionary.prototype = {

    constructor: OIMO.Dictionary,

    set: function ( value ) {

        var key = value.id;
        if(!this.get[key]) this.keys.push(key);

        this.data[key] = value;
        
    },

    get: function ( id ) {

        return this.data[ id ];

    },

    del: function ( value ) {
        var k = this.keys;

        var n = k.indexOf( value.id );
         if ( n > -1 ){
            delete this.data[k[n]];
            k.splice( n, 1 );
        }

    },

    reset: function () {

        var data = this.data, keys = this.keys, key;
        while(keys.length > 0){
            key = keys.pop();
            delete data[key];
        }

    }
};