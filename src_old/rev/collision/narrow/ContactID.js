OIMO.ContactID = function(){
    this.data1=0;
    this.data2=0;
    this.flip=false;
}
OIMO.ContactID.prototype = {
    constructor: OIMO.ContactID,

    equals:function(id){
        return this.flip==id.flip?this.data1==id.data1&&this.data2==id.data2:this.data2==id.data1&&this.data1==id.data2;
    }
}