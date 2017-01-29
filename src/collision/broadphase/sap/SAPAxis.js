import { _Math } from '../../../math/Math';

/**
 * A projection axis for sweep and prune broad-phase.
 * @author saharan
 */

function SAPAxis (){

    this.numElements = 0;
    this.bufferSize = 256;
    this.elements = [];
    this.elements.length = this.bufferSize;
    this.stack = new Float32Array( 64 );

}

Object.assign( SAPAxis.prototype, {

    SAPAxis: true,

    addElements: function ( min, max ) {

        if(this.numElements+2>=this.bufferSize){
            //this.bufferSize<<=1;
            this.bufferSize*=2;
            var newElements=[];
            var i = this.numElements;
            while(i--){
            //for(var i=0, l=this.numElements; i<l; i++){
                newElements[i] = this.elements[i];
            }
        }
        this.elements[this.numElements++] = min;
        this.elements[this.numElements++] = max;

    },

    removeElements: function ( min, max ) {

        var minIndex=-1;
        var maxIndex=-1;
        for(var i=0, l=this.numElements; i<l; i++){
            var e=this.elements[i];
            if(e==min||e==max){
                if(minIndex==-1){
                    minIndex=i;
                }else{
                    maxIndex=i;
                break;
                }
            }
        }
        for(i = minIndex+1, l = maxIndex; i < l; i++){
            this.elements[i-1] = this.elements[i];
        }
        for(i = maxIndex+1, l = this.numElements; i < l; i++){
            this.elements[i-2] = this.elements[i];
        }

        this.elements[--this.numElements] = null;
        this.elements[--this.numElements] = null;

    },

    sort: function () {

        var count = 0;
        var threshold = 1;
        while((this.numElements >> threshold) != 0 ) threshold++;
        threshold = threshold * this.numElements >> 2;
        count = 0;

        var giveup = false;
        var elements = this.elements;
        for( var i = 1, l = this.numElements; i < l; i++){ // try insertion sort
            var tmp=elements[i];
            var pivot=tmp.value;
            var tmp2=elements[i-1];
            if(tmp2.value>pivot){
                var j=i;
                do{
                    elements[j]=tmp2;
                    if(--j==0)break;
                    tmp2=elements[j-1];
                }while(tmp2.value>pivot);
                elements[j]=tmp;
                count+=i-j;
                if(count>threshold){
                    giveup=true; // stop and use quick sort
                    break;
                }
            }
        }
        if(!giveup)return;
        count=2;var stack=this.stack;
        stack[0]=0;
        stack[1]=this.numElements-1;
        while(count>0){
            var right=stack[--count];
            var left=stack[--count];
            var diff=right-left;
            if(diff>16){  // quick sort
                //var mid=left+(diff>>1);
                var mid = left + (_Math.floor(diff*0.5));
                tmp = elements[mid];
                elements[mid] = elements[right];
                elements[right] = tmp;
                pivot = tmp.value;
                i = left-1;
                j = right;
                while( true ){
                    var ei;
                    var ej;
                    do{ ei = elements[++i]; } while( ei.value < pivot);
                    do{ ej = elements[--j]; } while( pivot < ej.value && j != left );
                    if( i >= j ) break;
                    elements[i] = ej;
                    elements[j] = ei;
                }

                elements[right] = elements[i];
                elements[i] = tmp;
                if( i - left > right - i ) {
                    stack[count++] = left;
                    stack[count++] = i - 1;
                    stack[count++] = i + 1;
                    stack[count++] = right;
                }else{
                    stack[count++] = i + 1;
                    stack[count++] = right;
                    stack[count++] = left;
                    stack[count++] = i - 1;
                }
            }else{
                for( i = left + 1; i <= right; i++ ) {
                    tmp = elements[i];
                    pivot = tmp.value;
                    tmp2 = elements[i-1];
                    if( tmp2.value > pivot ) {
                        j = i;
                        do{
                            elements[j] = tmp2;
                            if( --j == 0 ) break;
                            tmp2 = elements[j-1];
                        }while( tmp2.value > pivot );
                        elements[j] = tmp;
                    }
                }
            }
        }
        
    },

    calculateTestCount: function () {

        var num = 1;
        var sum = 0;
        for(var i = 1, l = this.numElements; i<l; i++){
            if(this.elements[i].max){
                num--;
            }else{
                sum += num;
                num++;
            }
        }
        return sum;

    }

});

export { SAPAxis };