// class com.element.oimo.math.Mat33
joo.classLoader.prepare(
"package com.element.oimo.math",
"public class Mat33",1,function($$private){;return[
"public var",{e00:NaN},
"public var",{e01:NaN},
"public var",{e02:NaN},
"public var",{e10:NaN},
"public var",{e11:NaN},
"public var",{e12:NaN},
"public var",{e20:NaN},
"public var",{e21:NaN},
"public var",{e22:NaN},
"public function Mat33",function(
e00,e01,e02,
e10,e11,e12,
e20,e21,e22
){if(arguments.length<9){if(arguments.length<8){if(arguments.length<7){if(arguments.length<6){if(arguments.length<5){if(arguments.length<4){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){e00=1;}e01=0;}e02=0;}e10=0;}e11=1;}e12=0;}e20=0;}e21=0;}e22=1;}
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e20=e20;
this.e21=e21;
this.e22=e22;
},
"public function init",function(
e00,e01,e02,
e10,e11,e12,
e20,e21,e22
){if(arguments.length<9){if(arguments.length<8){if(arguments.length<7){if(arguments.length<6){if(arguments.length<5){if(arguments.length<4){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){e00=1;}e01=0;}e02=0;}e10=0;}e11=1;}e12=0;}e20=0;}e21=0;}e22=1;}
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e20=e20;
this.e21=e21;
this.e22=e22;
return this;
},
"public function add",function(m1,m2){
this.e00=m1.e00+m2.e00;
this.e01=m1.e01+m2.e01;
this.e02=m1.e02+m2.e02;
this.e10=m1.e10+m2.e10;
this.e11=m1.e11+m2.e11;
this.e12=m1.e12+m2.e12;
this.e20=m1.e20+m2.e20;
this.e21=m1.e21+m2.e21;
this.e22=m1.e22+m2.e22;
return this;
},
"public function sub",function(m1,m2){
this.e00=m1.e00-m2.e00;
this.e01=m1.e01-m2.e01;
this.e02=m1.e02-m2.e02;
this.e10=m1.e10-m2.e10;
this.e11=m1.e11-m2.e11;
this.e12=m1.e12-m2.e12;
this.e20=m1.e20-m2.e20;
this.e21=m1.e21-m2.e21;
this.e22=m1.e22-m2.e22;
return this;
},
"public function scale",function(m,s){
this.e00=m.e00*s;
this.e01=m.e01*s;
this.e02=m.e02*s;
this.e10=m.e10*s;
this.e11=m.e11*s;
this.e12=m.e12*s;
this.e20=m.e20*s;
this.e21=m.e21*s;
this.e22=m.e22*s;
return this;
},
"public function mul",function(m1,m2){
var e00=m1.e00*m2.e00+m1.e01*m2.e10+m1.e02*m2.e20;
var e01=m1.e00*m2.e01+m1.e01*m2.e11+m1.e02*m2.e21;
var e02=m1.e00*m2.e02+m1.e01*m2.e12+m1.e02*m2.e22;
var e10=m1.e10*m2.e00+m1.e11*m2.e10+m1.e12*m2.e20;
var e11=m1.e10*m2.e01+m1.e11*m2.e11+m1.e12*m2.e21;
var e12=m1.e10*m2.e02+m1.e11*m2.e12+m1.e12*m2.e22;
var e20=m1.e20*m2.e00+m1.e21*m2.e10+m1.e22*m2.e20;
var e21=m1.e20*m2.e01+m1.e21*m2.e11+m1.e22*m2.e21;
var e22=m1.e20*m2.e02+m1.e21*m2.e12+m1.e22*m2.e22;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e20=e20;
this.e21=e21;
this.e22=e22;
return this;
},
"public function mulScale",function(m,sx,sy,sz,prepend){if(arguments.length<5){prepend=false;}
var e00;
var e01;
var e02;
var e10;
var e11;
var e12;
var e20;
var e21;
var e22;
if(prepend){
e00=sx*m.e00;
e01=sx*m.e01;
e02=sx*m.e02;
e10=sy*m.e10;
e11=sy*m.e11;
e12=sy*m.e12;
e20=sz*m.e20;
e21=sz*m.e21;
e22=sz*m.e22;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e20=e20;
this.e21=e21;
this.e22=e22;
}else{
e00=m.e00*sx;
e01=m.e01*sy;
e02=m.e02*sz;
e10=m.e10*sx;
e11=m.e11*sy;
e12=m.e12*sz;
e20=m.e20*sx;
e21=m.e21*sy;
e22=m.e22*sz;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e20=e20;
this.e21=e21;
this.e22=e22;
}
return this;
},
"public function mulRotate",function(m,rad,ax,ay,az,prepend){if(arguments.length<6){prepend=false;}
var s=Math.sin(rad);
var c=Math.cos(rad);
var c1=1-c;
var r00=ax*ax*c1+c;
var r01=ax*ay*c1-az*s;
var r02=ax*az*c1+ay*s;
var r10=ay*ax*c1+az*s;
var r11=ay*ay*c1+c;
var r12=ay*az*c1-ax*s;
var r20=az*ax*c1-ay*s;
var r21=az*ay*c1+ax*s;
var r22=az*az*c1+c;
var e00;
var e01;
var e02;
var e10;
var e11;
var e12;
var e20;
var e21;
var e22;
if(prepend){
e00=r00*m.e00+r01*m.e10+r02*m.e20;
e01=r00*m.e01+r01*m.e11+r02*m.e21;
e02=r00*m.e02+r01*m.e12+r02*m.e22;
e10=r10*m.e00+r11*m.e10+r12*m.e20;
e11=r10*m.e01+r11*m.e11+r12*m.e21;
e12=r10*m.e02+r11*m.e12+r12*m.e22;
e20=r20*m.e00+r21*m.e10+r22*m.e20;
e21=r20*m.e01+r21*m.e11+r22*m.e21;
e22=r20*m.e02+r21*m.e12+r22*m.e22;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e20=e20;
this.e21=e21;
this.e22=e22;
}else{
e00=m.e00*r00+m.e01*r10+m.e02*r20;
e01=m.e00*r01+m.e01*r11+m.e02*r21;
e02=m.e00*r02+m.e01*r12+m.e02*r22;
e10=m.e10*r00+m.e11*r10+m.e12*r20;
e11=m.e10*r01+m.e11*r11+m.e12*r21;
e12=m.e10*r02+m.e11*r12+m.e12*r22;
e20=m.e20*r00+m.e21*r10+m.e22*r20;
e21=m.e20*r01+m.e21*r11+m.e22*r21;
e22=m.e20*r02+m.e21*r12+m.e22*r22;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e20=e20;
this.e21=e21;
this.e22=e22;
}
return this;
},
"public function transpose",function(m){
var e01=m.e10;
var e02=m.e20;
var e10=m.e01;
var e12=m.e21;
var e20=m.e02;
var e21=m.e12;
this.e00=m.e00;
this.e01=e01;
this.e02=e02;
this.e10=e10;
this.e11=m.e11;
this.e12=e12;
this.e20=e20;
this.e21=e21;
this.e22=m.e22;
return this;
},
"public function setQuat",function(q){
var x2=2*q.x;
var y2=2*q.y;
var z2=2*q.z;
var xx=q.x*x2;
var yy=q.y*y2;
var zz=q.z*z2;
var xy=q.x*y2;
var yz=q.y*z2;
var xz=q.x*z2;
var sx=q.s*x2;
var sy=q.s*y2;
var sz=q.s*z2;
this.e00=1-yy-zz;
this.e01=xy-sz;
this.e02=xz+sy;
this.e10=xy+sz;
this.e11=1-xx-zz;
this.e12=yz-sx;
this.e20=xz-sy;
this.e21=yz+sx;
this.e22=1-xx-yy;
return this;
},
"public function invert",function(m){
var det=
m.e00*(m.e11*m.e22-m.e21*m.e12)+
m.e10*(m.e21*m.e02-m.e01*m.e22)+
m.e20*(m.e01*m.e12-m.e11*m.e02)
;
if(det!=0)det=1/det;
var t00=m.e11*m.e22-m.e12*m.e21;
var t01=m.e02*m.e21-m.e01*m.e22;
var t02=m.e01*m.e12-m.e02*m.e11;
var t10=m.e12*m.e20-m.e10*m.e22;
var t11=m.e00*m.e22-m.e02*m.e20;
var t12=m.e02*m.e10-m.e00*m.e12;
var t20=m.e10*m.e21-m.e11*m.e20;
var t21=m.e01*m.e20-m.e00*m.e21;
var t22=m.e00*m.e11-m.e01*m.e10;
this.e00=det*t00;
this.e01=det*t01;
this.e02=det*t02;
this.e10=det*t10;
this.e11=det*t11;
this.e12=det*t12;
this.e20=det*t20;
this.e21=det*t21;
this.e22=det*t22;
return this;
},
"public function copy",function(m){
this.e00=m.e00;
this.e01=m.e01;
this.e02=m.e02;
this.e10=m.e10;
this.e11=m.e11;
this.e12=m.e12;
this.e20=m.e20;
this.e21=m.e21;
this.e22=m.e22;
return this;
},
"public function copyMat44",function(m){
this.e00=m.e00;
this.e01=m.e01;
this.e02=m.e02;
this.e10=m.e10;
this.e11=m.e11;
this.e12=m.e12;
this.e20=m.e20;
this.e21=m.e21;
this.e22=m.e22;
return this;
},
"public function clone",function(){
return new com.element.oimo.math.Mat33(this.e00,this.e01,this.e02,this.e10,this.e11,this.e12,this.e20,this.e21,this.e22);
},
"public function toString",function(){
var text=
"Mat33|"+this.e00.toFixed(4)+", "+this.e01.toFixed(4)+", "+this.e02.toFixed(4)+"|\n"+
"     |"+this.e10.toFixed(4)+", "+this.e11.toFixed(4)+", "+this.e12.toFixed(4)+"|\n"+
"     |"+this.e20.toFixed(4)+", "+this.e21.toFixed(4)+", "+this.e22.toFixed(4)+"|"
;
return text;
},
];},[],["Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.math.Mat44
joo.classLoader.prepare(
"package com.element.oimo.math",
"public class Mat44",1,function($$private){;return[
"public var",{e00:NaN},
"public var",{e01:NaN},
"public var",{e02:NaN},
"public var",{e03:NaN},
"public var",{e10:NaN},
"public var",{e11:NaN},
"public var",{e12:NaN},
"public var",{e13:NaN},
"public var",{e20:NaN},
"public var",{e21:NaN},
"public var",{e22:NaN},
"public var",{e23:NaN},
"public var",{e30:NaN},
"public var",{e31:NaN},
"public var",{e32:NaN},
"public var",{e33:NaN},
"public function Mat44",function(
e00,e01,e02,e03,
e10,e11,e12,e13,
e20,e21,e22,e23,
e30,e31,e32,e33
){if(arguments.length<16){if(arguments.length<15){if(arguments.length<14){if(arguments.length<13){if(arguments.length<12){if(arguments.length<11){if(arguments.length<10){if(arguments.length<9){if(arguments.length<8){if(arguments.length<7){if(arguments.length<6){if(arguments.length<5){if(arguments.length<4){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){e00=1;}e01=0;}e02=0;}e03=0;}e10=0;}e11=1;}e12=0;}e13=0;}e20=0;}e21=0;}e22=1;}e23=0;}e30=0;}e31=0;}e32=0;}e33=1;}
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e03=e03;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e13=e13;
this.e20=e20;
this.e21=e21;
this.e22=e22;
this.e23=e23;
this.e30=e30;
this.e31=e31;
this.e32=e32;
this.e33=e33;
},
"public function init",function(
e00,e01,e02,e03,
e10,e11,e12,e13,
e20,e21,e22,e23,
e30,e31,e32,e33
){if(arguments.length<16){if(arguments.length<15){if(arguments.length<14){if(arguments.length<13){if(arguments.length<12){if(arguments.length<11){if(arguments.length<10){if(arguments.length<9){if(arguments.length<8){if(arguments.length<7){if(arguments.length<6){if(arguments.length<5){if(arguments.length<4){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){e00=1;}e01=0;}e02=0;}e03=0;}e10=0;}e11=1;}e12=0;}e13=0;}e20=0;}e21=0;}e22=1;}e23=0;}e30=0;}e31=0;}e32=0;}e33=1;}
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e03=e03;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e13=e13;
this.e20=e20;
this.e21=e21;
this.e22=e22;
this.e23=e23;
this.e30=e30;
this.e31=e31;
this.e32=e32;
this.e33=e33;
return this;
},
"public function add",function(m1,m2){
this.e00=m1.e00+m2.e00;
this.e01=m1.e01+m2.e01;
this.e02=m1.e02+m2.e02;
this.e03=m1.e03+m2.e03;
this.e10=m1.e10+m2.e10;
this.e11=m1.e11+m2.e11;
this.e12=m1.e12+m2.e12;
this.e13=m1.e13+m2.e13;
this.e20=m1.e20+m2.e20;
this.e21=m1.e21+m2.e21;
this.e22=m1.e22+m2.e22;
this.e23=m1.e23+m2.e23;
this.e30=m1.e30+m2.e30;
this.e31=m1.e31+m2.e31;
this.e32=m1.e32+m2.e32;
this.e33=m1.e33+m2.e33;
return this;
},
"public function sub",function(m1,m2){
this.e00=m1.e00-m2.e00;
this.e01=m1.e01-m2.e01;
this.e02=m1.e02-m2.e02;
this.e03=m1.e03-m2.e03;
this.e10=m1.e10-m2.e10;
this.e11=m1.e11-m2.e11;
this.e12=m1.e12-m2.e12;
this.e13=m1.e13-m2.e13;
this.e20=m1.e20-m2.e20;
this.e21=m1.e21-m2.e21;
this.e22=m1.e22-m2.e22;
this.e23=m1.e23-m2.e23;
this.e30=m1.e30-m2.e30;
this.e31=m1.e31-m2.e31;
this.e32=m1.e32-m2.e32;
this.e33=m1.e33-m2.e33;
return this;
},
"public function scale",function(m,s){
this.e00=m.e00*s;
this.e01=m.e01*s;
this.e02=m.e02*s;
this.e03=m.e03*s;
this.e10=m.e10*s;
this.e11=m.e11*s;
this.e12=m.e12*s;
this.e13=m.e13*s;
this.e20=m.e20*s;
this.e21=m.e21*s;
this.e22=m.e22*s;
this.e23=m.e23*s;
this.e30=m.e30*s;
this.e31=m.e31*s;
this.e32=m.e32*s;
this.e33=m.e33*s;
return this;
},
"public function mul",function(m1,m2){
var e00=m1.e00*m2.e00+m1.e01*m2.e10+m1.e02*m2.e20+m1.e03*m2.e30;
var e01=m1.e00*m2.e01+m1.e01*m2.e11+m1.e02*m2.e21+m1.e03*m2.e31;
var e02=m1.e00*m2.e02+m1.e01*m2.e12+m1.e02*m2.e22+m1.e03*m2.e32;
var e03=m1.e00*m2.e03+m1.e01*m2.e13+m1.e02*m2.e23+m1.e03*m2.e33;
var e10=m1.e10*m2.e00+m1.e11*m2.e10+m1.e12*m2.e20+m1.e13*m2.e30;
var e11=m1.e10*m2.e01+m1.e11*m2.e11+m1.e12*m2.e21+m1.e13*m2.e31;
var e12=m1.e10*m2.e02+m1.e11*m2.e12+m1.e12*m2.e22+m1.e13*m2.e32;
var e13=m1.e10*m2.e03+m1.e11*m2.e13+m1.e12*m2.e23+m1.e13*m2.e33;
var e20=m1.e20*m2.e00+m1.e21*m2.e10+m1.e22*m2.e20+m1.e23*m2.e30;
var e21=m1.e20*m2.e01+m1.e21*m2.e11+m1.e22*m2.e21+m1.e23*m2.e31;
var e22=m1.e20*m2.e02+m1.e21*m2.e12+m1.e22*m2.e22+m1.e23*m2.e32;
var e23=m1.e20*m2.e03+m1.e21*m2.e13+m1.e22*m2.e23+m1.e23*m2.e33;
var e30=m1.e30*m2.e00+m1.e31*m2.e10+m1.e32*m2.e20+m1.e33*m2.e30;
var e31=m1.e30*m2.e01+m1.e31*m2.e11+m1.e32*m2.e21+m1.e33*m2.e31;
var e32=m1.e30*m2.e02+m1.e31*m2.e12+m1.e32*m2.e22+m1.e33*m2.e32;
var e33=m1.e30*m2.e03+m1.e31*m2.e13+m1.e32*m2.e23+m1.e33*m2.e33;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e03=e03;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e13=e13;
this.e20=e20;
this.e21=e21;
this.e22=e22;
this.e23=e23;
this.e30=e30;
this.e31=e31;
this.e32=e32;
this.e33=e33;
return this;
},
"public function mulScale",function(m,sx,sy,sz,prepend){if(arguments.length<5){prepend=false;}
var e00;
var e01;
var e02;
var e03;
var e10;
var e11;
var e12;
var e13;
var e20;
var e21;
var e22;
var e23;
var e30;
var e31;
var e32;
var e33;
if(prepend){
e00=sx*m.e00;
e01=sx*m.e01;
e02=sx*m.e02;
e03=sx*m.e03;
e10=sy*m.e10;
e11=sy*m.e11;
e12=sy*m.e12;
e13=sy*m.e13;
e20=sz*m.e20;
e21=sz*m.e21;
e22=sz*m.e22;
e23=sz*m.e23;
e30=m.e30;
e31=m.e31;
e32=m.e32;
e33=m.e33;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e03=e03;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e13=e13;
this.e20=e20;
this.e21=e21;
this.e22=e22;
this.e23=e23;
this.e30=e30;
this.e31=e31;
this.e32=e32;
this.e33=e33;
}else{
e00=m.e00*sx;
e01=m.e01*sy;
e02=m.e02*sz;
e03=m.e03;
e10=m.e10*sx;
e11=m.e11*sy;
e12=m.e12*sz;
e13=m.e13;
e20=m.e20*sx;
e21=m.e21*sy;
e22=m.e22*sz;
e23=m.e23;
e30=m.e30*sx;
e31=m.e31*sy;
e32=m.e32*sz;
e33=m.e33;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e03=e03;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e13=e13;
this.e20=e20;
this.e21=e21;
this.e22=e22;
this.e23=e23;
this.e30=e30;
this.e31=e31;
this.e32=e32;
this.e33=e33;
}
return this;
},
"public function mulRotate",function(m,rad,ax,ay,az,prepend){if(arguments.length<6){prepend=false;}
var s=Math.sin(rad);
var c=Math.cos(rad);
var c1=1-c;
var r00=ax*ax*c1+c;
var r01=ax*ay*c1-az*s;
var r02=ax*az*c1+ay*s;
var r10=ay*ax*c1+az*s;
var r11=ay*ay*c1+c;
var r12=ay*az*c1-ax*s;
var r20=az*ax*c1-ay*s;
var r21=az*ay*c1+ax*s;
var r22=az*az*c1+c;
var e00;
var e01;
var e02;
var e03;
var e10;
var e11;
var e12;
var e13;
var e20;
var e21;
var e22;
var e23;
var e30;
var e31;
var e32;
var e33;
if(prepend){
e00=r00*m.e00+r01*m.e10+r02*m.e20;
e01=r00*m.e01+r01*m.e11+r02*m.e21;
e02=r00*m.e02+r01*m.e12+r02*m.e22;
e03=r00*m.e03+r01*m.e13+r02*m.e23;
e10=r10*m.e00+r11*m.e10+r12*m.e20;
e11=r10*m.e01+r11*m.e11+r12*m.e21;
e12=r10*m.e02+r11*m.e12+r12*m.e22;
e13=r10*m.e03+r11*m.e13+r12*m.e23;
e20=r20*m.e00+r21*m.e10+r22*m.e20;
e21=r20*m.e01+r21*m.e11+r22*m.e21;
e22=r20*m.e02+r21*m.e12+r22*m.e22;
e23=r20*m.e03+r21*m.e13+r22*m.e23;
e30=m.e30;
e31=m.e31;
e32=m.e32;
e33=m.e33;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e03=e03;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e13=e13;
this.e20=e20;
this.e21=e21;
this.e22=e22;
this.e23=e23;
this.e30=e30;
this.e31=e31;
this.e32=e32;
this.e33=e33;
}else{
e00=m.e00*r00+m.e01*r10+m.e02*r20;
e01=m.e00*r01+m.e01*r11+m.e02*r21;
e02=m.e00*r02+m.e01*r12+m.e02*r22;
e03=m.e03;
e10=m.e10*r00+m.e11*r10+m.e12*r20;
e11=m.e10*r01+m.e11*r11+m.e12*r21;
e12=m.e10*r02+m.e11*r12+m.e12*r22;
e13=m.e13;
e20=m.e20*r00+m.e21*r10+m.e22*r20;
e21=m.e20*r01+m.e21*r11+m.e22*r21;
e22=m.e20*r02+m.e21*r12+m.e22*r22;
e23=m.e23;
e30=m.e30*r00+m.e31*r10+m.e32*r20;
e31=m.e30*r01+m.e31*r11+m.e32*r21;
e32=m.e30*r02+m.e31*r12+m.e32*r22;
e33=m.e33;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e03=e03;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e13=e13;
this.e20=e20;
this.e21=e21;
this.e22=e22;
this.e23=e23;
this.e30=e30;
this.e31=e31;
this.e32=e32;
this.e33=e33;
}
return this;
},
"public function mulTranslate",function(m,tx,ty,tz,prepend){if(arguments.length<5){prepend=false;}
var e00;
var e01;
var e02;
var e03;
var e10;
var e11;
var e12;
var e13;
var e20;
var e21;
var e22;
var e23;
var e30;
var e31;
var e32;
var e33;
if(prepend){
e00=m.e00+tx*m.e30;
e01=m.e01+tx*m.e31;
e02=m.e02+tx*m.e32;
e03=m.e03+tx*m.e33;
e10=m.e10+ty*m.e30;
e11=m.e11+ty*m.e31;
e12=m.e12+ty*m.e32;
e13=m.e13+ty*m.e33;
e20=m.e20+tz*m.e30;
e21=m.e21+tz*m.e31;
e22=m.e22+tz*m.e32;
e23=m.e23+tz*m.e33;
e30=m.e30;
e31=m.e31;
e32=m.e32;
e33=m.e33;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e03=e03;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e13=e13;
this.e20=e20;
this.e21=e21;
this.e22=e22;
this.e23=e23;
this.e30=e30;
this.e31=e31;
this.e32=e32;
this.e33=e33;
}else{
e00=m.e00;
e01=m.e01;
e02=m.e02;
e03=m.e00*tx+m.e01*ty+m.e02*tz+m.e03;
e10=m.e10;
e11=m.e11;
e12=m.e12;
e13=m.e10*tx+m.e11*ty+m.e12*tz+m.e13;
e20=m.e20;
e21=m.e21;
e22=m.e22;
e23=m.e20*tx+m.e21*ty+m.e22*tz+m.e23;
e30=m.e30;
e31=m.e31;
e32=m.e32;
e33=m.e30*tx+m.e31*ty+m.e32*tz+m.e33;
this.e00=e00;
this.e01=e01;
this.e02=e02;
this.e03=e03;
this.e10=e10;
this.e11=e11;
this.e12=e12;
this.e13=e13;
this.e20=e20;
this.e21=e21;
this.e22=e22;
this.e23=e23;
this.e30=e30;
this.e31=e31;
this.e32=e32;
this.e33=e33;
}
return this;
},
"public function transpose",function(m){
var e01=m.e10;
var e02=m.e20;
var e03=m.e30;
var e10=m.e01;
var e12=m.e21;
var e13=m.e31;
var e20=m.e02;
var e21=m.e12;
var e23=m.e32;
var e30=m.e03;
var e31=m.e13;
var e32=m.e23;
this.e00=m.e00;
this.e01=e01;
this.e02=e02;
this.e03=e03;
this.e10=e10;
this.e11=m.e11;
this.e12=e12;
this.e13=e13;
this.e20=e20;
this.e21=e21;
this.e22=m.e22;
this.e23=e23;
this.e30=e30;
this.e31=e31;
this.e32=e32;
this.e33=m.e33;
return this;
},
"public function setQuat",function(q){
var x2=2*q.x;
var y2=2*q.y;
var z2=2*q.z;
var xx=q.x*x2;
var yy=q.y*y2;
var zz=q.z*z2;
var xy=q.x*y2;
var yz=q.y*z2;
var xz=q.x*z2;
var sx=q.s*x2;
var sy=q.s*y2;
var sz=q.s*z2;
this.e00=1-yy-zz;
this.e01=xy-sz;
this.e02=xz+sy;
this.e03=0;
this.e10=xy+sz;
this.e11=1-xx-zz;
this.e12=yz-sx;
this.e13=0;
this.e20=xz-sy;
this.e21=yz+sx;
this.e22=1-xx-yy;
this.e23=0;
this.e30=0;
this.e31=0;
this.e32=0;
this.e33=1;
return this;
},
"public function invert",function(m){
var e1021_1120=m.e10*m.e21-m.e11*m.e20;
var e1022_1220=m.e10*m.e22-m.e12*m.e20;
var e1023_1320=m.e10*m.e23-m.e13*m.e20;
var e1031_1130=m.e10*m.e31-m.e11*m.e30;
var e1032_1230=m.e10*m.e32-m.e12*m.e30;
var e1033_1330=m.e10*m.e33-m.e13*m.e30;
var e1122_1221=m.e11*m.e22-m.e12*m.e21;
var e1123_1321=m.e11*m.e23-m.e13*m.e21;
var e1132_1231=m.e11*m.e32-m.e12*m.e31;
var e1133_1331=m.e11*m.e33-m.e13*m.e31;
var e1220_2022=m.e12*m.e20-m.e20*m.e22;
var e1223_1322=m.e12*m.e23-m.e13*m.e22;
var e1223_2223=m.e12*m.e33-m.e22*m.e23;
var e1233_1332=m.e12*m.e33-m.e13*m.e32;
var e2031_2130=m.e20*m.e31-m.e21*m.e30;
var e2032_2033=m.e20*m.e32-m.e20*m.e33;
var e2032_2230=m.e20*m.e32-m.e22*m.e30;
var e2033_2330=m.e20*m.e33-m.e23*m.e30;
var e2132_2231=m.e21*m.e32-m.e22*m.e31;
var e2133_2331=m.e21*m.e33-m.e23*m.e31;
var e2230_2330=m.e22*m.e30-m.e23*m.e30;
var e2233_2332=m.e22*m.e33-m.e23*m.e32;
var det=
m.e00*(m.e11*e2233_2332-m.e12*e2133_2331+m.e13*e2132_2231)+
m.e01*(-m.e10*e2233_2332-m.e12*e2032_2033+m.e13*e2230_2330)+
m.e02*(m.e10*e2133_2331-m.e11*e2033_2330+m.e13*e2031_2130)+
m.e03*(-m.e10*e2132_2231+m.e11*e2032_2230-m.e12*e2031_2130)
;
if(det!=0)det=1/det;
var t00=m.e11*e2233_2332-m.e12*e2133_2331+m.e13*e2132_2231;
var t01=-m.e01*e2233_2332+m.e02*e2133_2331-m.e03*e2132_2231;
var t02=m.e01*e1233_1332-m.e02*e1133_1331+m.e03*e1132_1231;
var t03=-m.e01*e1223_2223+m.e02*e1123_1321-m.e03*e1122_1221;
var t10=-m.e10*e2233_2332+m.e12*e2033_2330-m.e13*e2032_2230;
var t11=m.e00*e2233_2332-m.e02*e2033_2330+m.e03*e2032_2230;
var t12=-m.e00*e1233_1332+m.e02*e1033_1330-m.e03*e1032_1230;
var t13=m.e00*e1223_1322-m.e02*e1023_1320-m.e03*e1220_2022;
var t20=m.e10*e2133_2331-m.e11*e2033_2330+m.e13*e2031_2130;
var t21=-m.e00*e2133_2331+m.e01*e2033_2330-m.e03*e2031_2130;
var t22=m.e00*e1133_1331-m.e01*e1033_1330+m.e03*e1031_1130;
var t23=-m.e00*e1123_1321+m.e01*e1023_1320-m.e03*e1021_1120;
var t30=-m.e10*e2132_2231+m.e11*e2032_2230-m.e12*e2031_2130;
var t31=m.e00*e2132_2231-m.e01*e2032_2230+m.e02*e2031_2130;
var t32=-m.e00*e1132_1231+m.e01*e1032_1230-m.e02*e1031_1130;
var t33=m.e00*e1122_1221-m.e01*e1022_1220+m.e02*e1021_1120;
this.e00=det*t00;
this.e01=det*t01;
this.e02=det*t02;
this.e03=det*t03;
this.e10=det*t10;
this.e11=det*t11;
this.e12=det*t12;
this.e13=det*t13;
this.e20=det*t20;
this.e21=det*t21;
this.e22=det*t22;
this.e23=det*t23;
this.e30=det*t30;
this.e31=det*t31;
this.e32=det*t32;
this.e33=det*t33;
return this;
},
"public function lookAt",function(
eyeX,eyeY,eyeZ,
atX,atY,atZ,
upX,upY,upZ
){
var zx=eyeX-atX;
var zy=eyeY-atY;
var zz=eyeZ-atZ;
var tmp=1/Math.sqrt(zx*zx+zy*zy+zz*zz);
zx*=tmp;
zy*=tmp;
zz*=tmp;
var xx=upY*zz-upZ*zy;
var xy=upZ*zx-upX*zz;
var xz=upX*zy-upY*zx;
tmp=1/Math.sqrt(xx*xx+xy*xy+xz*xz);
xx*=tmp;
xy*=tmp;
xz*=tmp;
var yx=zy*xz-zz*xy;
var yy=zz*xx-zx*xz;
var yz=zx*xy-zy*xx;
this.e00=xx;
this.e01=xy;
this.e02=xz;
this.e03=-(xx*eyeX+xy*eyeY+xz*eyeZ);
this.e10=yx;
this.e11=yy;
this.e12=yz;
this.e13=-(yx*eyeX+yy*eyeY+yz*eyeZ);
this.e20=zx;
this.e21=zy;
this.e22=zz;
this.e23=-(zx*eyeX+zy*eyeY+zz*eyeZ);
this.e30=0;
this.e31=0;
this.e32=0;
this.e33=1;
return this;
},
"public function perspective",function(fovY,aspect,near,far){
var h=1/Math.tan(fovY*0.5);
var fnf=far/(near-far);
this.e00=h/aspect;
this.e01=0;
this.e02=0;
this.e03=0;
this.e10=0;
this.e11=h;
this.e12=0;
this.e13=0;
this.e20=0;
this.e21=0;
this.e22=fnf;
this.e23=near*fnf;
this.e30=0;
this.e31=0;
this.e32=-1;
this.e33=0;
return this;
},
"public function ortho",function(width,height,near,far){
var nf=1/(near-far);
this.e00=2/width;
this.e01=0;
this.e02=0;
this.e03=0;
this.e10=0;
this.e11=2/height;
this.e12=0;
this.e13=0;
this.e20=0;
this.e21=0;
this.e22=nf;
this.e23=near*nf;
this.e30=0;
this.e31=0;
this.e32=0;
this.e33=0;
return this;
},
"public function copy",function(m){
this.e00=m.e00;
this.e01=m.e01;
this.e02=m.e02;
this.e03=m.e03;
this.e10=m.e10;
this.e11=m.e11;
this.e12=m.e12;
this.e13=m.e13;
this.e20=m.e20;
this.e21=m.e21;
this.e22=m.e22;
this.e23=m.e23;
this.e30=m.e30;
this.e31=m.e31;
this.e32=m.e32;
this.e33=m.e33;
return this;
},
"public function copyMat33",function(m){
this.e00=m.e00;
this.e01=m.e01;
this.e02=m.e02;
this.e03=0;
this.e10=m.e10;
this.e11=m.e11;
this.e12=m.e12;
this.e13=0;
this.e20=m.e20;
this.e21=m.e21;
this.e22=m.e22;
this.e23=0;
this.e30=0;
this.e31=0;
this.e32=0;
this.e33=1;
return this;
},
"public function clone",function(){
return new com.element.oimo.math.Mat44(
this.e00,this.e01,this.e02,this.e03,
this.e10,this.e11,this.e12,this.e13,
this.e20,this.e21,this.e22,this.e23,
this.e30,this.e31,this.e32,this.e33
);
},
"public function toString",function(){
var text=
"Mat44|"+this.e00.toFixed(4)+", "+this.e01.toFixed(4)+", "+this.e02.toFixed(4)+", "+this.e03.toFixed(4)+"|\n"+
"     |"+this.e10.toFixed(4)+", "+this.e11.toFixed(4)+", "+this.e12.toFixed(4)+", "+this.e13.toFixed(4)+"|\n"+
"     |"+this.e20.toFixed(4)+", "+this.e21.toFixed(4)+", "+this.e22.toFixed(4)+", "+this.e23.toFixed(4)+"|\n"+
"     |"+this.e30.toFixed(4)+", "+this.e31.toFixed(4)+", "+this.e32.toFixed(4)+", "+this.e33.toFixed(4)+"|\n"
;
return text;
},
];},[],["Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.math.Quat
joo.classLoader.prepare(
"package com.element.oimo.math",
"public class Quat",1,function($$private){;return[
"public var",{s:NaN},
"public var",{x:NaN},
"public var",{y:NaN},
"public var",{z:NaN},
"public function Quat",function(s,x,y,z){if(arguments.length<4){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){s=1;}x=0;}y=0;}z=0;}
this.s=s;
this.x=x;
this.y=y;
this.z=z;
},
"public function init",function(s,x,y,z){if(arguments.length<4){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){s=1;}x=0;}y=0;}z=0;}
this.s=s;
this.x=x;
this.y=y;
this.z=z;
return this;
},
"public function add",function(q1,q2){
this.s=q1.s+q2.s;
this.x=q1.x+q2.x;
this.y=q1.y+q2.y;
this.z=q1.z+q2.z;
return this;
},
"public function sub",function(q1,q2){
this.s=q1.s-q2.s;
this.x=q1.x-q2.x;
this.y=q1.y-q2.y;
this.z=q1.z-q2.z;
return this;
},
"public function scale",function(q,s){
this.s=q.s*s;
this.x=q.x*s;
this.y=q.y*s;
this.z=q.z*s;
return this;
},
"public function mul",function(q1,q2){
var s=q1.s*q2.s-q1.x*q2.x-q1.y*q2.y-q1.z*q2.z;
var x=q1.s*q2.x+q1.x*q2.s+q1.y*q2.z-q1.z*q2.y;
var y=q1.s*q2.y-q1.x*q2.z+q1.y*q2.s+q1.z*q2.x;
var z=q1.s*q2.z+q1.x*q2.y-q1.y*q2.x+q1.z*q2.s;
this.s=s;
this.x=x;
this.y=y;
this.z=z;
return this;
},
"public function normalize",function(q){
var len=Math.sqrt(q.s*q.s+q.x*q.x+q.y*q.y+q.z*q.z);
if(len>0)len=1/len;
this.s=q.s*len;
this.x=q.x*len;
this.y=q.y*len;
this.z=q.z*len;
return this;
},
"public function invert",function(q){
this.s=-q.s;
this.x=-q.x;
this.y=-q.y;
this.z=-q.z;
return this;
},
"public function length",function(){
return Math.sqrt(this.s*this.s+this.x*this.x+this.y*this.y+this.z*this.z);
},
"public function copy",function(q){
this.s=q.s;
this.x=q.x;
this.y=q.y;
this.z=q.z;
return this;
},
"public function clone",function(q){
return new com.element.oimo.math.Quat(this.s,this.x,this.y,this.z);
},
"public function toString",function(){
return"Quat["+this.s.toFixed(4)+", ("+this.x.toFixed(4)+", "+this.y.toFixed(4)+", "+this.z.toFixed(4)+")]";
},
];},[],["Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.math.Vec3
joo.classLoader.prepare(
"package com.element.oimo.math",
"public class Vec3",1,function($$private){;return[
"public var",{x:NaN},
"public var",{y:NaN},
"public var",{z:NaN},
"public function Vec3",function(x,y,z){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){x=0;}y=0;}z=0;}
this.x=x;
this.y=y;
this.z=z;
},
"public function init",function(x,y,z){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){x=0;}y=0;}z=0;}
this.x=x;
this.y=y;
this.z=z;
return this;
},
"public function add",function(v1,v2){
this.x=v1.x+v2.x;
this.y=v1.y+v2.y;
this.z=v1.z+v2.z;
return this;
},
"public function sub",function(v1,v2){
this.x=v1.x-v2.x;
this.y=v1.y-v2.y;
this.z=v1.z-v2.z;
return this;
},
"public function scale",function(v,s){
this.x=v.x*s;
this.y=v.y*s;
this.z=v.z*s;
return this;
},
"public function dot",function(v){
return this.x*v.x+this.y*v.y+this.z*v.z;
},
"public function cross",function(v1,v2){
var x=v1.y*v2.z-v1.z*v2.y;
var y=v1.z*v2.x-v1.x*v2.z;
var z=v1.x*v2.y-v1.y*v2.x;
this.x=x;
this.y=y;
this.z=z;
return this;
},
"public function mulMat",function(m,v){
var x=m.e00*v.x+m.e01*v.y+m.e02*v.z;
var y=m.e10*v.x+m.e11*v.y+m.e12*v.z;
var z=m.e20*v.x+m.e21*v.y+m.e22*v.z;
this.x=x;
this.y=y;
this.z=z;
return this;
},
"public function normalize",function(v){
var length=Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);
if(length>0)length=1/length;
this.x=v.x*length;
this.y=v.y*length;
this.z=v.z*length;
return this;
},
"public function invert",function(v){
this.x=-v.x;
this.y=-v.y;
this.z=-v.z;
return this;
},
"public function length",function(){
return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
},
"public function copy",function(v){
this.x=v.x;
this.y=v.y;
this.z=v.z;
return this;
},
"public function clone",function(){
return new com.element.oimo.math.Vec3(this.x,this.y,this.z);
},
"public function toString",function(){
return"Vec3["+this.x.toFixed(4)+", "+this.y.toFixed(4)+", "+this.z.toFixed(4)+"]";
},
];},[],["Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.broad.BroadPhase
joo.classLoader.prepare("package com.element.oimo.physics.collision.broad",
"public class BroadPhase",1,function($$private){;return[function(){joo.classLoader.init(com.element.oimo.physics.dynamics.RigidBody);},
"public var",{pairs:null},
"public var",{numPairs:0},
"public var",{numPairChecks:0},
"private var",{bufferSize:0},
"public function BroadPhase",function(){
this.bufferSize$1=256;
this.pairs=[];
for(var i=0;i<this.bufferSize$1;i++){
this.pairs[i]=new com.element.oimo.physics.collision.broad.Pair();
}
},
"public function addProxy",function(proxy){
throw new Error("addProxy Function is not inherited");
},
"public function removeProxy",function(proxy){
throw new Error("removeProxy Function is not inherited");
},
"public function isAvailablePair",function(s1,s2){
var b1=s1.parent;
var b2=s2.parent;
if(
b1==b2||
(b1.type==com.element.oimo.physics.dynamics.RigidBody.BODY_STATIC||b1.sleeping)&&
(b2.type==com.element.oimo.physics.dynamics.RigidBody.BODY_STATIC||b2.sleeping)
){
return false;
}
var jc;
if(b1.numJoints<b2.numJoints)jc=b1.jointList;
else jc=b2.jointList;
while(jc!=null){
var joint=jc.parent;
if(
!joint.allowCollision&&
(joint.body1==b1&&joint.body2==b2||
joint.body1==b2&&joint.body2==b1)
){
return false;
}
jc=jc.next;
}
return true;
},
"public function detectPairs",function(){
while(this.numPairs>0){
var pair=this.pairs[--this.numPairs];
pair.shape1=null;
pair.shape2=null;
}
this.collectPairs();
},
"protected function collectPairs",function(){
throw new Error("collectPairs Function is not inherited");
},
"protected function addPair",function(s1,s2){
if(this.numPairs==this.bufferSize$1){
var newBufferSize=this.bufferSize$1<<1;
var newPairs=[];
for(var i=0;i<this.bufferSize$1;i++){
newPairs[i]=this.pairs[i];
}
for(i=this.bufferSize$1;i<newBufferSize;i++){
newPairs[i]=new com.element.oimo.physics.collision.broad.Pair();
}
this.pairs=newPairs;
this.bufferSize$1=newBufferSize;
}
var pair=this.pairs[this.numPairs++];
pair.shape1=s1;
pair.shape2=s2;
},
];},[],["com.element.oimo.physics.collision.broad.Pair","Error","com.element.oimo.physics.dynamics.RigidBody"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.broad.BruteForceBroadPhase
joo.classLoader.prepare("package com.element.oimo.physics.collision.broad",
"public class BruteForceBroadPhase extends com.element.oimo.physics.collision.broad.BroadPhase",2,function($$private){;return[
"private var",{proxyPool:null},
"private var",{numProxies:0},
"public function BruteForceBroadPhase",function(){this.super$2();
this.proxyPool$2=[];
},
"override public function addProxy",function(proxy){
this.proxyPool$2[this.numProxies$2]=proxy;
this.numProxies$2++;
},
"override public function removeProxy",function(proxy){
var idx=-1;
for(var i=0;i<this.numProxies$2;i++){
if(this.proxyPool$2[i]==proxy){
idx=i;
break;
}
}
if(idx==-1){
return;
}
for(var j=idx;j<this.numProxies$2-1;j++){
this.proxyPool$2[j]=this.proxyPool$2[j+1];
}
this.proxyPool$2[this.numProxies$2]=null;
this.numProxies$2--;
},
"override protected function collectPairs",function(){
this.numPairChecks=this.numProxies$2*(this.numProxies$2-1)>>1;
for(var i=0;i<this.numProxies$2;i++){
var p1=this.proxyPool$2[i];
var s1=p1.parent;
for(var j=i+1;j<this.numProxies$2;j++){
var p2=this.proxyPool$2[j];
var s2=p2.parent;
if(
p1.maxX<p2.minX||p1.minX>p2.maxX||
p1.maxY<p2.minY||p1.minY>p2.maxY||
p1.maxZ<p2.minZ||p1.minZ>p2.maxZ||
!this.isAvailablePair(s1,s2)
){
continue;
}
this.addPair(s1,s2);
}
}
},
];},[],["com.element.oimo.physics.collision.broad.BroadPhase"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.broad.Pair
joo.classLoader.prepare("package com.element.oimo.physics.collision.broad",
"public class Pair",1,function($$private){;return[
"public var",{shape1:null},
"public var",{shape2:null},
"public function Pair",function(){
},
];},[],[], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.broad.Proxy
joo.classLoader.prepare(
"package com.element.oimo.physics.collision.broad",
"public class Proxy",1,function($$private){;return[
"public var",{minX:NaN},
"public var",{maxX:NaN},
"public var",{minY:NaN},
"public var",{maxY:NaN},
"public var",{minZ:NaN},
"public var",{maxZ:NaN},
"public var",{parent:null},
"public function Proxy",function(
minX,maxX,
minY,maxY,
minZ,maxZ
){if(arguments.length<6){if(arguments.length<5){if(arguments.length<4){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){minX=0;}maxX=0;}minY=0;}maxY=0;}minZ=0;}maxZ=0;}
this.minX=minX;
this.maxX=maxX;
this.minY=minY;
this.maxY=maxY;
this.minZ=minZ;
this.maxZ=maxZ;
},
"public function init",function(
minX,maxX,
minY,maxY,
minZ,maxZ
){if(arguments.length<6){if(arguments.length<5){if(arguments.length<4){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){minX=0;}maxX=0;}minY=0;}maxY=0;}minZ=0;}maxZ=0;}
this.minX=minX;
this.maxX=maxX;
this.minY=minY;
this.maxY=maxY;
this.minZ=minZ;
this.maxZ=maxZ;
},
"public function intersect",function(proxy){
return this.maxX>proxy.minX&&this.minX<proxy.maxX&&this.maxY>proxy.minY&&this.minY<proxy.maxY&&this.maxZ>proxy.minZ&&this.minZ<proxy.maxZ;
},
];},[],[], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.broad.SweepAndPruneBroadPhase
joo.classLoader.prepare("package com.element.oimo.physics.collision.broad",
"public class SweepAndPruneBroadPhase extends com.element.oimo.physics.collision.broad.BroadPhase",2,function($$private){;return[function(){joo.classLoader.init(com.element.oimo.physics.dynamics.RigidBody);},
"private var",{proxyPoolAxis:null},
"private var",{sortAxis:0},
"private var",{numProxies:0},
"public function SweepAndPruneBroadPhase",function(){this.super$2();
this.sortAxis$2=0;
this.proxyPoolAxis$2=[];
this.proxyPoolAxis$2[0]=[];
this.proxyPoolAxis$2[1]=[];
this.proxyPoolAxis$2[2]=[];
},
"override public function addProxy",function(proxy){
this.proxyPoolAxis$2[0][this.numProxies$2]=proxy;
this.proxyPoolAxis$2[1][this.numProxies$2]=proxy;
this.proxyPoolAxis$2[2][this.numProxies$2]=proxy;
this.numProxies$2++;
},
"override public function removeProxy",function(proxy){
this.removeProxyAxis$2(proxy,this.proxyPoolAxis$2[0]);
this.removeProxyAxis$2(proxy,this.proxyPoolAxis$2[1]);
this.removeProxyAxis$2(proxy,this.proxyPoolAxis$2[2]);
this.numProxies$2--;
},
"override protected function collectPairs",function(){
this.numPairChecks=0;
var proxyPool=this.proxyPoolAxis$2[this.sortAxis$2];
var result;
if(this.sortAxis$2==0){
this.insertionSortX$2(proxyPool);
this.sweepX$2(proxyPool);
}else if(this.sortAxis$2==1){
this.insertionSortY$2(proxyPool);
this.sweepY$2(proxyPool);
}else{
this.insertionSortZ$2(proxyPool);
this.sweepZ$2(proxyPool);
}
},
"private function sweepX",function(proxyPool){
var center;
var sumX=0;
var sumX2=0;
var sumY=0;
var sumY2=0;
var sumZ=0;
var sumZ2=0;
var invNum=1/this.numProxies$2;
var bodyStatic=com.element.oimo.physics.dynamics.RigidBody.BODY_STATIC;
for(var i=0;i<this.numProxies$2;i++){
var p1=proxyPool[i];
center=p1.minX+p1.maxX;
sumX+=center;
sumX2+=center*center;
center=p1.minY+p1.maxY;
sumY+=center;
sumY2+=center*center;
center=p1.minZ+p1.maxZ;
sumZ+=center;
sumZ2+=center*center;
var s1=p1.parent;
for(var j=i+1;j<this.numProxies$2;j++){
var p2=proxyPool[j];
this.numPairChecks++;
if(p1.maxX<p2.minX){
break;
}
var s2=p2.parent;
if(
p1.maxY<p2.minY||p1.minY>p2.maxY||
p1.maxZ<p2.minZ||p1.minZ>p2.maxZ||
!this.isAvailablePair(s1,s2)
){
continue;
}
this.addPair(s1,s2);
}
}
sumX=sumX2-sumX*sumX*invNum;
sumY=sumY2-sumY*sumY*invNum;
sumZ=sumZ2-sumZ*sumZ*invNum;
if(sumX>sumY){
if(sumX>sumZ){
this.sortAxis$2=0;
}else{
this.sortAxis$2=2;
}
}else if(sumY>sumZ){
this.sortAxis$2=1;
}else{
this.sortAxis$2=2;
}
},
"private function sweepY",function(proxyPool){
var center;
var sumX=0;
var sumX2=0;
var sumY=0;
var sumY2=0;
var sumZ=0;
var sumZ2=0;
var invNum=1/this.numProxies$2;
var bodyStatic=com.element.oimo.physics.dynamics.RigidBody.BODY_STATIC;
for(var i=0;i<this.numProxies$2;i++){
var p1=proxyPool[i];
center=p1.minX+p1.maxX;
sumX+=center;
sumX2+=center*center;
center=p1.minY+p1.maxY;
sumY+=center;
sumY2+=center*center;
center=p1.minZ+p1.maxZ;
sumZ+=center;
sumZ2+=center*center;
var s1=p1.parent;
for(var j=i+1;j<this.numProxies$2;j++){
var p2=proxyPool[j];
this.numPairChecks++;
if(p1.maxY<p2.minY){
break;
}
var s2=p2.parent;
if(
p1.maxX<p2.minX||p1.minX>p2.maxX||
p1.maxZ<p2.minZ||p1.minZ>p2.maxZ||
!this.isAvailablePair(s1,s2)
){
continue;
}
this.addPair(s1,s2);
}
}
sumX=sumX2-sumX*sumX*invNum;
sumY=sumY2-sumY*sumY*invNum;
sumZ=sumZ2-sumZ*sumZ*invNum;
if(sumX>sumY){
if(sumX>sumZ){
this.sortAxis$2=0;
}else{
this.sortAxis$2=2;
}
}else if(sumY>sumZ){
this.sortAxis$2=1;
}else{
this.sortAxis$2=2;
}
},
"private function sweepZ",function(proxyPool){
var center;
var sumX=0;
var sumX2=0;
var sumY=0;
var sumY2=0;
var sumZ=0;
var sumZ2=0;
var invNum=1/this.numProxies$2;
var bodyStatic=com.element.oimo.physics.dynamics.RigidBody.BODY_STATIC;
for(var i=0;i<this.numProxies$2;i++){
var p1=proxyPool[i];
center=p1.minX+p1.maxX;
sumX+=center;
sumX2+=center*center;
center=p1.minY+p1.maxY;
sumY+=center;
sumY2+=center*center;
center=p1.minZ+p1.maxZ;
sumZ+=center;
sumZ2+=center*center;
var s1=p1.parent;
for(var j=i+1;j<this.numProxies$2;j++){
var p2=proxyPool[j];
this.numPairChecks++;
if(p1.maxZ<p2.minZ){
break;
}
var s2=p2.parent;
if(
p1.maxX<p2.minX||p1.minX>p2.maxX||
p1.maxY<p2.minY||p1.minY>p2.maxY||
!this.isAvailablePair(s1,s2)
){
continue;
}
this.addPair(s1,s2);
}
}
sumX=sumX2-sumX*sumX*invNum;
sumY=sumY2-sumY*sumY*invNum;
sumZ=sumZ2-sumZ*sumZ*invNum;
if(sumX>sumY){
if(sumX>sumZ){
this.sortAxis$2=0;
}else{
this.sortAxis$2=2;
}
}else if(sumY>sumZ){
this.sortAxis$2=1;
}else{
this.sortAxis$2=2;
}
},
"private function removeProxyAxis",function(proxy,proxyPool){
var idx=-1;
for(var i=0;i<this.numProxies$2;i++){
if(proxyPool[i]==proxy){
idx=i;
break;
}
}
if(idx==-1){
return;
}
for(var j=idx;j<this.numProxies$2-1;j++){
proxyPool[j]=proxyPool[j+1];
}
proxyPool[this.numProxies$2]=null;
},
"private function insertionSortX",function(proxyPool){
if(this.numProxies$2==1)
return;
for(var i=1;i<this.numProxies$2;i++){
var insert=proxyPool[i];
if(proxyPool[i-1].minX>insert.minX){
var j=i;
do{
proxyPool[j]=proxyPool[j-1];
j--;
}while(j>0&&proxyPool[j-1].minX>insert.minX);
proxyPool[j]=insert;
}
}
},
"private function insertionSortY",function(proxyPool){
if(this.numProxies$2==1)
return;
for(var i=1;i<this.numProxies$2;i++){
var insert=proxyPool[i];
if(proxyPool[i-1].minY>insert.minY){
var j=i;
do{
proxyPool[j]=proxyPool[j-1];
j--;
}while(j>0&&proxyPool[j-1].minY>insert.minY);
proxyPool[j]=insert;
}
}
},
"private function insertionSortZ",function(proxyPool){
if(this.numProxies$2==1)
return;
for(var i=1;i<this.numProxies$2;i++){
var insert=proxyPool[i];
if(proxyPool[i-1].minZ>insert.minZ){
var j=i;
do{
proxyPool[j]=proxyPool[j-1];
j--;
}while(j>0&&proxyPool[j-1].minZ>insert.minZ);
proxyPool[j]=insert;
}
}
},
];},[],["com.element.oimo.physics.collision.broad.BroadPhase","com.element.oimo.physics.dynamics.RigidBody"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.narrow.BoxBoxCollisionDetector
joo.classLoader.prepare("package com.element.oimo.physics.collision.narrow",
"public class BoxBoxCollisionDetector extends com.element.oimo.physics.collision.narrow.CollisionDetector",2,function($$private){var as=joo.as;return[function(){joo.classLoader.init(Array);},
"private var",{clipVertices1:null},
"private var",{clipVertices2:null},
"private var",{used:null},
"private const",{INF:1/0},
"public function BoxBoxCollisionDetector",function(){this.super$2();
this.clipVertices1$2=Array;
this.clipVertices2$2=Array;
this.used$2=Array;
},
"override public function detectCollision",function(shape1,shape2,result){
var b1;
var b2;
if(shape1.id<shape2.id){
b1=as(shape1,com.element.oimo.physics.collision.shape.BoxShape);
b2=as(shape2,com.element.oimo.physics.collision.shape.BoxShape);
}else{
b1=as(shape2,com.element.oimo.physics.collision.shape.BoxShape);
b2=as(shape1,com.element.oimo.physics.collision.shape.BoxShape);
}
var p1=b1.position;
var p2=b2.position;
var p1x=p1.x;
var p1y=p1.y;
var p1z=p1.z;
var p2x=p2.x;
var p2y=p2.y;
var p2z=p2.z;
var dx=p2x-p1x;
var dy=p2y-p1y;
var dz=p2z-p1z;
var w1=b1.halfWidth;
var h1=b1.halfHeight;
var d1=b1.halfDepth;
var w2=b2.halfWidth;
var h2=b2.halfHeight;
var d2=b2.halfDepth;
var d1x=b1.halfDirectionWidth.x;
var d1y=b1.halfDirectionWidth.y;
var d1z=b1.halfDirectionWidth.z;
var d2x=b1.halfDirectionHeight.x;
var d2y=b1.halfDirectionHeight.y;
var d2z=b1.halfDirectionHeight.z;
var d3x=b1.halfDirectionDepth.x;
var d3y=b1.halfDirectionDepth.y;
var d3z=b1.halfDirectionDepth.z;
var d4x=b2.halfDirectionWidth.x;
var d4y=b2.halfDirectionWidth.y;
var d4z=b2.halfDirectionWidth.z;
var d5x=b2.halfDirectionHeight.x;
var d5y=b2.halfDirectionHeight.y;
var d5z=b2.halfDirectionHeight.z;
var d6x=b2.halfDirectionDepth.x;
var d6y=b2.halfDirectionDepth.y;
var d6z=b2.halfDirectionDepth.z;
var a1x=b1.normalDirectionWidth.x;
var a1y=b1.normalDirectionWidth.y;
var a1z=b1.normalDirectionWidth.z;
var a2x=b1.normalDirectionHeight.x;
var a2y=b1.normalDirectionHeight.y;
var a2z=b1.normalDirectionHeight.z;
var a3x=b1.normalDirectionDepth.x;
var a3y=b1.normalDirectionDepth.y;
var a3z=b1.normalDirectionDepth.z;
var a4x=b2.normalDirectionWidth.x;
var a4y=b2.normalDirectionWidth.y;
var a4z=b2.normalDirectionWidth.z;
var a5x=b2.normalDirectionHeight.x;
var a5y=b2.normalDirectionHeight.y;
var a5z=b2.normalDirectionHeight.z;
var a6x=b2.normalDirectionDepth.x;
var a6y=b2.normalDirectionDepth.y;
var a6z=b2.normalDirectionDepth.z;
var a7x=a1y*a4z-a1z*a4y;
var a7y=a1z*a4x-a1x*a4z;
var a7z=a1x*a4y-a1y*a4x;
var a8x=a1y*a5z-a1z*a5y;
var a8y=a1z*a5x-a1x*a5z;
var a8z=a1x*a5y-a1y*a5x;
var a9x=a1y*a6z-a1z*a6y;
var a9y=a1z*a6x-a1x*a6z;
var a9z=a1x*a6y-a1y*a6x;
var aax=a2y*a4z-a2z*a4y;
var aay=a2z*a4x-a2x*a4z;
var aaz=a2x*a4y-a2y*a4x;
var abx=a2y*a5z-a2z*a5y;
var aby=a2z*a5x-a2x*a5z;
var abz=a2x*a5y-a2y*a5x;
var acx=a2y*a6z-a2z*a6y;
var acy=a2z*a6x-a2x*a6z;
var acz=a2x*a6y-a2y*a6x;
var adx=a3y*a4z-a3z*a4y;
var ady=a3z*a4x-a3x*a4z;
var adz=a3x*a4y-a3y*a4x;
var aex=a3y*a5z-a3z*a5y;
var aey=a3z*a5x-a3x*a5z;
var aez=a3x*a5y-a3y*a5x;
var afx=a3y*a6z-a3z*a6y;
var afy=a3z*a6x-a3x*a6z;
var afz=a3x*a6y-a3y*a6x;
var right1;
var right2;
var right3;
var right4;
var right5;
var right6;
var right7;
var right8;
var right9;
var righta;
var rightb;
var rightc;
var rightd;
var righte;
var rightf;
var overlap1;
var overlap2;
var overlap3;
var overlap4;
var overlap5;
var overlap6;
var overlap7;
var overlap8;
var overlap9;
var overlapa;
var overlapb;
var overlapc;
var overlapd;
var overlape;
var overlapf;
var invalid7=false;
var invalid8=false;
var invalid9=false;
var invalida=false;
var invalidb=false;
var invalidc=false;
var invalidd=false;
var invalide=false;
var invalidf=false;
var len;
var len1;
var len2;
var dot1;
var dot2;
var dot3;
len=a1x*dx+a1y*dy+a1z*dz;
right1=len>0;
if(!right1)len=-len;
len1=w1;
dot1=a1x*a4x+a1y*a4y+a1z*a4z;
dot2=a1x*a5x+a1y*a5y+a1z*a5z;
dot3=a1x*a6x+a1y*a6y+a1z*a6z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
if(dot3<0)dot3=-dot3;
len2=dot1*w2+dot2*h2+dot3*d2;
overlap1=len-len1-len2;
if(overlap1>0)return;
len=a2x*dx+a2y*dy+a2z*dz;
right2=len>0;
if(!right2)len=-len;
len1=h1;
dot1=a2x*a4x+a2y*a4y+a2z*a4z;
dot2=a2x*a5x+a2y*a5y+a2z*a5z;
dot3=a2x*a6x+a2y*a6y+a2z*a6z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
if(dot3<0)dot3=-dot3;
len2=dot1*w2+dot2*h2+dot3*d2;
overlap2=len-len1-len2;
if(overlap2>0)return;
len=a3x*dx+a3y*dy+a3z*dz;
right3=len>0;
if(!right3)len=-len;
len1=d1;
dot1=a3x*a4x+a3y*a4y+a3z*a4z;
dot2=a3x*a5x+a3y*a5y+a3z*a5z;
dot3=a3x*a6x+a3y*a6y+a3z*a6z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
if(dot3<0)dot3=-dot3;
len2=dot1*w2+dot2*h2+dot3*d2;
overlap3=len-len1-len2;
if(overlap3>0)return;
len=a4x*dx+a4y*dy+a4z*dz;
right4=len>0;
if(!right4)len=-len;
dot1=a4x*a1x+a4y*a1y+a4z*a1z;
dot2=a4x*a2x+a4y*a2y+a4z*a2z;
dot3=a4x*a3x+a4y*a3y+a4z*a3z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
if(dot3<0)dot3=-dot3;
len1=dot1*w1+dot2*h1+dot3*d1;
len2=w2;
overlap4=(len-len1-len2)*1.0;
if(overlap4>0)return;
len=a5x*dx+a5y*dy+a5z*dz;
right5=len>0;
if(!right5)len=-len;
dot1=a5x*a1x+a5y*a1y+a5z*a1z;
dot2=a5x*a2x+a5y*a2y+a5z*a2z;
dot3=a5x*a3x+a5y*a3y+a5z*a3z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
if(dot3<0)dot3=-dot3;
len1=dot1*w1+dot2*h1+dot3*d1;
len2=h2;
overlap5=(len-len1-len2)*1.0;
if(overlap5>0)return;
len=a6x*dx+a6y*dy+a6z*dz;
right6=len>0;
if(!right6)len=-len;
dot1=a6x*a1x+a6y*a1y+a6z*a1z;
dot2=a6x*a2x+a6y*a2y+a6z*a2z;
dot3=a6x*a3x+a6y*a3y+a6z*a3z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
if(dot3<0)dot3=-dot3;
len1=dot1*w1+dot2*h1+dot3*d1;
len2=d2;
overlap6=(len-len1-len2)*1.0;
if(overlap6>0)return;
len=a7x*a7x+a7y*a7y+a7z*a7z;
if(len>1e-5){
len=1/Math.sqrt(len);
a7x*=len;
a7y*=len;
a7z*=len;
len=a7x*dx+a7y*dy+a7z*dz;
right7=len>0;
if(!right7)len=-len;
dot1=a7x*a2x+a7y*a2y+a7z*a2z;
dot2=a7x*a3x+a7y*a3y+a7z*a3z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len1=dot1*h1+dot2*d1;
dot1=a7x*a5x+a7y*a5y+a7z*a5z;
dot2=a7x*a6x+a7y*a6y+a7z*a6z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len2=dot1*h2+dot2*d2;
overlap7=len-len1-len2;
if(overlap7>0)return;
}else{
right7=false;
overlap7=0;
invalid7=true;
}
len=a8x*a8x+a8y*a8y+a8z*a8z;
if(len>1e-5){
len=1/Math.sqrt(len);
a8x*=len;
a8y*=len;
a8z*=len;
len=a8x*dx+a8y*dy+a8z*dz;
right8=len>0;
if(!right8)len=-len;
dot1=a8x*a2x+a8y*a2y+a8z*a2z;
dot2=a8x*a3x+a8y*a3y+a8z*a3z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len1=dot1*h1+dot2*d1;
dot1=a8x*a4x+a8y*a4y+a8z*a4z;
dot2=a8x*a6x+a8y*a6y+a8z*a6z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len2=dot1*w2+dot2*d2;
overlap8=len-len1-len2;
if(overlap8>0)return;
}else{
right8=false;
overlap8=0;
invalid8=true;
}
len=a9x*a9x+a9y*a9y+a9z*a9z;
if(len>1e-5){
len=1/Math.sqrt(len);
a9x*=len;
a9y*=len;
a9z*=len;
len=a9x*dx+a9y*dy+a9z*dz;
right9=len>0;
if(!right9)len=-len;
dot1=a9x*a2x+a9y*a2y+a9z*a2z;
dot2=a9x*a3x+a9y*a3y+a9z*a3z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len1=dot1*h1+dot2*d1;
dot1=a9x*a4x+a9y*a4y+a9z*a4z;
dot2=a9x*a5x+a9y*a5y+a9z*a5z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len2=dot1*w2+dot2*h2;
overlap9=len-len1-len2;
if(overlap9>0)return;
}else{
right9=false;
overlap9=0;
invalid9=true;
}
len=aax*aax+aay*aay+aaz*aaz;
if(len>1e-5){
len=1/Math.sqrt(len);
aax*=len;
aay*=len;
aaz*=len;
len=aax*dx+aay*dy+aaz*dz;
righta=len>0;
if(!righta)len=-len;
dot1=aax*a1x+aay*a1y+aaz*a1z;
dot2=aax*a3x+aay*a3y+aaz*a3z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len1=dot1*w1+dot2*d1;
dot1=aax*a5x+aay*a5y+aaz*a5z;
dot2=aax*a6x+aay*a6y+aaz*a6z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len2=dot1*h2+dot2*d2;
overlapa=len-len1-len2;
if(overlapa>0)return;
}else{
righta=false;
overlapa=0;
invalida=true;
}
len=abx*abx+aby*aby+abz*abz;
if(len>1e-5){
len=1/Math.sqrt(len);
abx*=len;
aby*=len;
abz*=len;
len=abx*dx+aby*dy+abz*dz;
rightb=len>0;
if(!rightb)len=-len;
dot1=abx*a1x+aby*a1y+abz*a1z;
dot2=abx*a3x+aby*a3y+abz*a3z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len1=dot1*w1+dot2*d1;
dot1=abx*a4x+aby*a4y+abz*a4z;
dot2=abx*a6x+aby*a6y+abz*a6z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len2=dot1*w2+dot2*d2;
overlapb=len-len1-len2;
if(overlapb>0)return;
}else{
rightb=false;
overlapb=0;
invalidb=true;
}
len=acx*acx+acy*acy+acz*acz;
if(len>1e-5){
len=1/Math.sqrt(len);
acx*=len;
acy*=len;
acz*=len;
len=acx*dx+acy*dy+acz*dz;
rightc=len>0;
if(!rightc)len=-len;
dot1=acx*a1x+acy*a1y+acz*a1z;
dot2=acx*a3x+acy*a3y+acz*a3z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len1=dot1*w1+dot2*d1;
dot1=acx*a4x+acy*a4y+acz*a4z;
dot2=acx*a5x+acy*a5y+acz*a5z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len2=dot1*w2+dot2*h2;
overlapc=len-len1-len2;
if(overlapc>0)return;
}else{
rightc=false;
overlapc=0;
invalidc=true;
}
len=adx*adx+ady*ady+adz*adz;
if(len>1e-5){
len=1/Math.sqrt(len);
adx*=len;
ady*=len;
adz*=len;
len=adx*dx+ady*dy+adz*dz;
rightd=len>0;
if(!rightd)len=-len;
dot1=adx*a1x+ady*a1y+adz*a1z;
dot2=adx*a2x+ady*a2y+adz*a2z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len1=dot1*w1+dot2*h1;
dot1=adx*a5x+ady*a5y+adz*a5z;
dot2=adx*a6x+ady*a6y+adz*a6z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len2=dot1*h2+dot2*d2;
overlapd=len-len1-len2;
if(overlapd>0)return;
}else{
rightd=false;
overlapd=0;
invalidd=true;
}
len=aex*aex+aey*aey+aez*aez;
if(len>1e-5){
len=1/Math.sqrt(len);
aex*=len;
aey*=len;
aez*=len;
len=aex*dx+aey*dy+aez*dz;
righte=len>0;
if(!righte)len=-len;
dot1=aex*a1x+aey*a1y+aez*a1z;
dot2=aex*a2x+aey*a2y+aez*a2z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len1=dot1*w1+dot2*h1;
dot1=aex*a4x+aey*a4y+aez*a4z;
dot2=aex*a6x+aey*a6y+aez*a6z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len2=dot1*w2+dot2*d2;
overlape=len-len1-len2;
if(overlape>0)return;
}else{
righte=false;
overlape=0;
invalide=true;
}
len=afx*afx+afy*afy+afz*afz;
if(len>1e-5){
len=1/Math.sqrt(len);
afx*=len;
afy*=len;
afz*=len;
len=afx*dx+afy*dy+afz*dz;
rightf=len>0;
if(!rightf)len=-len;
dot1=afx*a1x+afy*a1y+afz*a1z;
dot2=afx*a2x+afy*a2y+afz*a2z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len1=dot1*w1+dot2*h1;
dot1=afx*a4x+afy*a4y+afz*a4z;
dot2=afx*a5x+afy*a5y+afz*a5z;
if(dot1<0)dot1=-dot1;
if(dot2<0)dot2=-dot2;
len2=dot1*w2+dot2*h2;
overlapf=len-len1-len2;
if(overlapf>0)return;
}else{
rightf=false;
overlapf=0;
invalidf=true;
}
var depth=overlap1;
var depth2=overlap1;
var minIndex=0;
var right=right1;
if(overlap2>depth2){
depth=overlap2;
depth2=overlap2;
minIndex=1;
right=right2;
}
if(overlap3>depth2){
depth=overlap3;
depth2=overlap3;
minIndex=2;
right=right3;
}
if(overlap4-0.005>depth2){
depth=overlap4;
depth2=overlap4-0.005;
minIndex=3;
right=right4;
}
if(overlap5-0.005>depth2){
depth=overlap5;
depth2=overlap5-0.005;
minIndex=4;
right=right5;
}
if(overlap6-0.005>depth2){
depth=overlap6;
depth2=overlap6-0.005;
minIndex=5;
right=right6;
}
if(overlap7-0.01>depth2&&!invalid7){
depth=overlap7;
depth2=overlap7-0.01;
minIndex=6;
right=right7;
}
if(overlap8-0.01>depth2&&!invalid8){
depth=overlap8;
depth2=overlap8-0.01;
minIndex=7;
right=right8;
}
if(overlap9-0.01>depth2&&!invalid9){
depth=overlap9;
depth2=overlap9-0.01;
minIndex=8;
right=right9;
}
if(overlapa-0.01>depth2&&!invalida){
depth=overlapa;
depth2=overlapa-0.01;
minIndex=9;
right=righta;
}
if(overlapb-0.01>depth2&&!invalidb){
depth=overlapb;
depth2=overlapb-0.01;
minIndex=10;
right=rightb;
}
if(overlapc-0.01>depth2&&!invalidc){
depth=overlapc;
depth2=overlapc-0.01;
minIndex=11;
right=rightc;
}
if(overlapd-0.01>depth2&&!invalidd){
depth=overlapd;
depth2=overlapd-0.01;
minIndex=12;
right=rightd;
}
if(overlape-0.01>depth2&&!invalide){
depth=overlape;
depth2=overlape-0.01;
minIndex=13;
right=righte;
}
if(overlapf-0.01>depth2&&!invalidf){
depth=overlapf;
minIndex=14;
right=rightf;
}
var nx=0;
var ny=0;
var nz=0;
var n1x=0;
var n1y=0;
var n1z=0;
var n2x=0;
var n2y=0;
var n2z=0;
var cx=0;
var cy=0;
var cz=0;
var s1x=0;
var s1y=0;
var s1z=0;
var s2x=0;
var s2y=0;
var s2z=0;
var swap=false;
switch(minIndex){
case 0:
if(right){
cx=p1x+d1x;
cy=p1y+d1y;
cz=p1z+d1z;
nx=a1x;
ny=a1y;
nz=a1z;
}else{
cx=p1x-d1x;
cy=p1y-d1y;
cz=p1z-d1z;
nx=-a1x;
ny=-a1y;
nz=-a1z;
}
s1x=d2x;
s1y=d2y;
s1z=d2z;
n1x=-a2x;
n1y=-a2y;
n1z=-a2z;
s2x=d3x;
s2y=d3y;
s2z=d3z;
n2x=-a3x;
n2y=-a3y;
n2z=-a3z;
break;
case 1:
if(right){
cx=p1x+d2x;
cy=p1y+d2y;
cz=p1z+d2z;
nx=a2x;
ny=a2y;
nz=a2z;
}else{
cx=p1x-d2x;
cy=p1y-d2y;
cz=p1z-d2z;
nx=-a2x;
ny=-a2y;
nz=-a2z;
}
s1x=d1x;
s1y=d1y;
s1z=d1z;
n1x=-a1x;
n1y=-a1y;
n1z=-a1z;
s2x=d3x;
s2y=d3y;
s2z=d3z;
n2x=-a3x;
n2y=-a3y;
n2z=-a3z;
break;
case 2:
if(right){
cx=p1x+d3x;
cy=p1y+d3y;
cz=p1z+d3z;
nx=a3x;
ny=a3y;
nz=a3z;
}else{
cx=p1x-d3x;
cy=p1y-d3y;
cz=p1z-d3z;
nx=-a3x;
ny=-a3y;
nz=-a3z;
}
s1x=d1x;
s1y=d1y;
s1z=d1z;
n1x=-a1x;
n1y=-a1y;
n1z=-a1z;
s2x=d2x;
s2y=d2y;
s2z=d2z;
n2x=-a2x;
n2y=-a2y;
n2z=-a2z;
break;
case 3:
swap=true;
if(!right){
cx=p2x+d4x;
cy=p2y+d4y;
cz=p2z+d4z;
nx=a4x;
ny=a4y;
nz=a4z;
}else{
cx=p2x-d4x;
cy=p2y-d4y;
cz=p2z-d4z;
nx=-a4x;
ny=-a4y;
nz=-a4z;
}
s1x=d5x;
s1y=d5y;
s1z=d5z;
n1x=-a5x;
n1y=-a5y;
n1z=-a5z;
s2x=d6x;
s2y=d6y;
s2z=d6z;
n2x=-a6x;
n2y=-a6y;
n2z=-a6z;
break;
case 4:
swap=true;
if(!right){
cx=p2x+d5x;
cy=p2y+d5y;
cz=p2z+d5z;
nx=a5x;
ny=a5y;
nz=a5z;
}else{
cx=p2x-d5x;
cy=p2y-d5y;
cz=p2z-d5z;
nx=-a5x;
ny=-a5y;
nz=-a5z;
}
s1x=d4x;
s1y=d4y;
s1z=d4z;
n1x=-a4x;
n1y=-a4y;
n1z=-a4z;
s2x=d6x;
s2y=d6y;
s2z=d6z;
n2x=-a6x;
n2y=-a6y;
n2z=-a6z;
break;
case 5:
swap=true;
if(!right){
cx=p2x+d6x;
cy=p2y+d6y;
cz=p2z+d6z;
nx=a6x;
ny=a6y;
nz=a6z;
}else{
cx=p2x-d6x;
cy=p2y-d6y;
cz=p2z-d6z;
nx=-a6x;
ny=-a6y;
nz=-a6z;
}
s1x=d4x;
s1y=d4y;
s1z=d4z;
n1x=-a4x;
n1y=-a4y;
n1z=-a4z;
s2x=d5x;
s2y=d5y;
s2z=d5z;
n2x=-a5x;
n2y=-a5y;
n2z=-a5z;
break;
case 6:
nx=a7x;
ny=a7y;
nz=a7z;
n1x=a1x;
n1y=a1y;
n1z=a1z;
n2x=a4x;
n2y=a4y;
n2z=a4z;
break;
case 7:
nx=a8x;
ny=a8y;
nz=a8z;
n1x=a1x;
n1y=a1y;
n1z=a1z;
n2x=a5x;
n2y=a5y;
n2z=a5z;
break;
case 8:
nx=a9x;
ny=a9y;
nz=a9z;
n1x=a1x;
n1y=a1y;
n1z=a1z;
n2x=a6x;
n2y=a6y;
n2z=a6z;
break;
case 9:
nx=aax;
ny=aay;
nz=aaz;
n1x=a2x;
n1y=a2y;
n1z=a2z;
n2x=a4x;
n2y=a4y;
n2z=a4z;
break;
case 10:
nx=abx;
ny=aby;
nz=abz;
n1x=a2x;
n1y=a2y;
n1z=a2z;
n2x=a5x;
n2y=a5y;
n2z=a5z;
break;
case 11:
nx=acx;
ny=acy;
nz=acz;
n1x=a2x;
n1y=a2y;
n1z=a2z;
n2x=a6x;
n2y=a6y;
n2z=a6z;
break;
case 12:
nx=adx;
ny=ady;
nz=adz;
n1x=a3x;
n1y=a3y;
n1z=a3z;
n2x=a4x;
n2y=a4y;
n2z=a4z;
break;
case 13:
nx=aex;
ny=aey;
nz=aez;
n1x=a3x;
n1y=a3y;
n1z=a3z;
n2x=a5x;
n2y=a5y;
n2z=a5z;
break;
case 14:
nx=afx;
ny=afy;
nz=afz;
n1x=a3x;
n1y=a3y;
n1z=a3z;
n2x=a6x;
n2y=a6y;
n2z=a6z;
break;
}
var v;
if(minIndex>5){
if(!right){
nx=-nx;
ny=-ny;
nz=-nz;
}
var distance;
var maxDistance;
var vx;
var vy;
var vz;
var v1x;
var v1y;
var v1z;
var v2x;
var v2y;
var v2z;
v=b1.vertex1;
v1x=v.x;
v1y=v.y;
v1z=v.z;
maxDistance=nx*v1x+ny*v1y+nz*v1z;
v=b1.vertex2;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance>maxDistance){
maxDistance=distance;
v1x=vx;
v1y=vy;
v1z=vz;
}
v=b1.vertex3;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance>maxDistance){
maxDistance=distance;
v1x=vx;
v1y=vy;
v1z=vz;
}
v=b1.vertex4;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance>maxDistance){
maxDistance=distance;
v1x=vx;
v1y=vy;
v1z=vz;
}
v=b1.vertex5;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance>maxDistance){
maxDistance=distance;
v1x=vx;
v1y=vy;
v1z=vz;
}
v=b1.vertex6;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance>maxDistance){
maxDistance=distance;
v1x=vx;
v1y=vy;
v1z=vz;
}
v=b1.vertex7;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance>maxDistance){
maxDistance=distance;
v1x=vx;
v1y=vy;
v1z=vz;
}
v=b1.vertex8;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance>maxDistance){
maxDistance=distance;
v1x=vx;
v1y=vy;
v1z=vz;
}
v=b2.vertex1;
v2x=v.x;
v2y=v.y;
v2z=v.z;
maxDistance=nx*v2x+ny*v2y+nz*v2z;
v=b2.vertex2;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance<maxDistance){
maxDistance=distance;
v2x=vx;
v2y=vy;
v2z=vz;
}
v=b2.vertex3;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance<maxDistance){
maxDistance=distance;
v2x=vx;
v2y=vy;
v2z=vz;
}
v=b2.vertex4;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance<maxDistance){
maxDistance=distance;
v2x=vx;
v2y=vy;
v2z=vz;
}
v=b2.vertex5;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance<maxDistance){
maxDistance=distance;
v2x=vx;
v2y=vy;
v2z=vz;
}
v=b2.vertex6;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance<maxDistance){
maxDistance=distance;
v2x=vx;
v2y=vy;
v2z=vz;
}
v=b2.vertex7;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance<maxDistance){
maxDistance=distance;
v2x=vx;
v2y=vy;
v2z=vz;
}
v=b2.vertex8;
vx=v.x;
vy=v.y;
vz=v.z;
distance=nx*vx+ny*vy+nz*vz;
if(distance<maxDistance){
maxDistance=distance;
v2x=vx;
v2y=vy;
v2z=vz;
}
vx=v2x-v1x;
vy=v2y-v1y;
vz=v2z-v1z;
dot1=n1x*n2x+n1y*n2y+n1z*n2z;
var t=(vx*(n1x-n2x*dot1)+vy*(n1y-n2y*dot1)+vz*(n1z-n2z*dot1))/(1-dot1*dot1);
result.addContactInfo(v1x+n1x*t+nx*depth*0.5,v1y+n1y*t+ny*depth*0.5,v1z+n1z*t+nz*depth*0.5,nx,ny,nz,depth,b1,b2,0,0,false);
return;
}
var q1x;
var q1y;
var q1z;
var q2x;
var q2y;
var q2z;
var q3x;
var q3y;
var q3z;
var q4x;
var q4y;
var q4z;
var minDot=1;
var dot=0;
var minDotIndex=0;
if(swap){
dot=a1x*nx+a1y*ny+a1z*nz;
if(dot<minDot){
minDot=dot;
minDotIndex=0;
}
if(-dot<minDot){
minDot=-dot;
minDotIndex=1;
}
dot=a2x*nx+a2y*ny+a2z*nz;
if(dot<minDot){
minDot=dot;
minDotIndex=2;
}
if(-dot<minDot){
minDot=-dot;
minDotIndex=3;
}
dot=a3x*nx+a3y*ny+a3z*nz;
if(dot<minDot){
minDot=dot;
minDotIndex=4;
}
if(-dot<minDot){
minDot=-dot;
minDotIndex=5;
}
switch(minDotIndex){
case 0:
v=b1.vertex1;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b1.vertex3;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b1.vertex4;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b1.vertex2;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
case 1:
v=b1.vertex6;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b1.vertex8;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b1.vertex7;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b1.vertex5;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
case 2:
v=b1.vertex5;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b1.vertex1;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b1.vertex2;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b1.vertex6;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
case 3:
v=b1.vertex8;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b1.vertex4;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b1.vertex3;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b1.vertex7;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
case 4:
v=b1.vertex5;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b1.vertex7;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b1.vertex3;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b1.vertex1;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
case 5:
v=b1.vertex2;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b1.vertex4;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b1.vertex8;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b1.vertex6;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
}
}else{
dot=a4x*nx+a4y*ny+a4z*nz;
if(dot<minDot){
minDot=dot;
minDotIndex=0;
}
if(-dot<minDot){
minDot=-dot;
minDotIndex=1;
}
dot=a5x*nx+a5y*ny+a5z*nz;
if(dot<minDot){
minDot=dot;
minDotIndex=2;
}
if(-dot<minDot){
minDot=-dot;
minDotIndex=3;
}
dot=a6x*nx+a6y*ny+a6z*nz;
if(dot<minDot){
minDot=dot;
minDotIndex=4;
}
if(-dot<minDot){
minDot=-dot;
minDotIndex=5;
}
switch(minDotIndex){
case 0:
v=b2.vertex1;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b2.vertex3;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b2.vertex4;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b2.vertex2;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
case 1:
v=b2.vertex6;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b2.vertex8;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b2.vertex7;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b2.vertex5;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
case 2:
v=b2.vertex5;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b2.vertex1;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b2.vertex2;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b2.vertex6;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
case 3:
v=b2.vertex8;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b2.vertex4;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b2.vertex3;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b2.vertex7;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
case 4:
v=b2.vertex5;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b2.vertex7;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b2.vertex3;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b2.vertex1;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
case 5:
v=b2.vertex2;
q1x=v.x;
q1y=v.y;
q1z=v.z;
v=b2.vertex4;
q2x=v.x;
q2y=v.y;
q2z=v.z;
v=b2.vertex8;
q3x=v.x;
q3y=v.y;
q3z=v.z;
v=b2.vertex6;
q4x=v.x;
q4y=v.y;
q4z=v.z;
break;
}
}
var numClipVertices;
var numAddedClipVertices;
var index;
var x1;
var y1;
var z1;
var x2;
var y2;
var z2;
this.clipVertices1$2[0]=q1x;
this.clipVertices1$2[1]=q1y;
this.clipVertices1$2[2]=q1z;
this.clipVertices1$2[3]=q2x;
this.clipVertices1$2[4]=q2y;
this.clipVertices1$2[5]=q2z;
this.clipVertices1$2[6]=q3x;
this.clipVertices1$2[7]=q3y;
this.clipVertices1$2[8]=q3z;
this.clipVertices1$2[9]=q4x;
this.clipVertices1$2[10]=q4y;
this.clipVertices1$2[11]=q4z;
numAddedClipVertices=0;
x1=this.clipVertices1$2[9];
y1=this.clipVertices1$2[10];
z1=this.clipVertices1$2[11];
dot1=(x1-cx-s1x)*n1x+(y1-cy-s1y)*n1y+(z1-cz-s1z)*n1z;
for(var i=0;i<4;i++){
index=i*3;
x2=this.clipVertices1$2[index];
y2=this.clipVertices1$2[index+1];
z2=this.clipVertices1$2[index+2];
dot2=(x2-cx-s1x)*n1x+(y2-cy-s1y)*n1y+(z2-cz-s1z)*n1z;
if(dot1>0){
if(dot2>0){
index=numAddedClipVertices*3;
numAddedClipVertices++;
this.clipVertices2$2[index]=x2;
this.clipVertices2$2[index+1]=y2;
this.clipVertices2$2[index+2]=z2;
}else{
index=numAddedClipVertices*3;
numAddedClipVertices++;
t=dot1/(dot1-dot2);
this.clipVertices2$2[index]=x1+(x2-x1)*t;
this.clipVertices2$2[index+1]=y1+(y2-y1)*t;
this.clipVertices2$2[index+2]=z1+(z2-z1)*t;
}
}else{
if(dot2>0){
index=numAddedClipVertices*3;
numAddedClipVertices++;
t=dot1/(dot1-dot2);
this.clipVertices2$2[index]=x1+(x2-x1)*t;
this.clipVertices2$2[index+1]=y1+(y2-y1)*t;
this.clipVertices2$2[index+2]=z1+(z2-z1)*t;
index=numAddedClipVertices*3;
numAddedClipVertices++;
this.clipVertices2$2[index]=x2;
this.clipVertices2$2[index+1]=y2;
this.clipVertices2$2[index+2]=z2;
}
}
x1=x2;
y1=y2;
z1=z2;
dot1=dot2;
}
numClipVertices=numAddedClipVertices;
if(numClipVertices==0)return;
numAddedClipVertices=0;
index=(numClipVertices-1)*3;
x1=this.clipVertices2$2[index];
y1=this.clipVertices2$2[index+1];
z1=this.clipVertices2$2[index+2];
dot1=(x1-cx-s2x)*n2x+(y1-cy-s2y)*n2y+(z1-cz-s2z)*n2z;
for(i=0;i<numClipVertices;i++){
index=i*3;
x2=this.clipVertices2$2[index];
y2=this.clipVertices2$2[index+1];
z2=this.clipVertices2$2[index+2];
dot2=(x2-cx-s2x)*n2x+(y2-cy-s2y)*n2y+(z2-cz-s2z)*n2z;
if(dot1>0){
if(dot2>0){
index=numAddedClipVertices*3;
numAddedClipVertices++;
this.clipVertices1$2[index]=x2;
this.clipVertices1$2[index+1]=y2;
this.clipVertices1$2[index+2]=z2;
}else{
index=numAddedClipVertices*3;
numAddedClipVertices++;
t=dot1/(dot1-dot2);
this.clipVertices1$2[index]=x1+(x2-x1)*t;
this.clipVertices1$2[index+1]=y1+(y2-y1)*t;
this.clipVertices1$2[index+2]=z1+(z2-z1)*t;
}
}else{
if(dot2>0){
index=numAddedClipVertices*3;
numAddedClipVertices++;
t=dot1/(dot1-dot2);
this.clipVertices1$2[index]=x1+(x2-x1)*t;
this.clipVertices1$2[index+1]=y1+(y2-y1)*t;
this.clipVertices1$2[index+2]=z1+(z2-z1)*t;
index=numAddedClipVertices*3;
numAddedClipVertices++;
this.clipVertices1$2[index]=x2;
this.clipVertices1$2[index+1]=y2;
this.clipVertices1$2[index+2]=z2;
}
}
x1=x2;
y1=y2;
z1=z2;
dot1=dot2;
}
numClipVertices=numAddedClipVertices;
if(numClipVertices==0)return;
numAddedClipVertices=0;
index=(numClipVertices-1)*3;
x1=this.clipVertices1$2[index];
y1=this.clipVertices1$2[index+1];
z1=this.clipVertices1$2[index+2];
dot1=(x1-cx+s1x)*-n1x+(y1-cy+s1y)*-n1y+(z1-cz+s1z)*-n1z;
for(i=0;i<numClipVertices;i++){
index=i*3;
x2=this.clipVertices1$2[index];
y2=this.clipVertices1$2[index+1];
z2=this.clipVertices1$2[index+2];
dot2=(x2-cx+s1x)*-n1x+(y2-cy+s1y)*-n1y+(z2-cz+s1z)*-n1z;
if(dot1>0){
if(dot2>0){
index=numAddedClipVertices*3;
numAddedClipVertices++;
this.clipVertices2$2[index]=x2;
this.clipVertices2$2[index+1]=y2;
this.clipVertices2$2[index+2]=z2;
}else{
index=numAddedClipVertices*3;
numAddedClipVertices++;
t=dot1/(dot1-dot2);
this.clipVertices2$2[index]=x1+(x2-x1)*t;
this.clipVertices2$2[index+1]=y1+(y2-y1)*t;
this.clipVertices2$2[index+2]=z1+(z2-z1)*t;
}
}else{
if(dot2>0){
index=numAddedClipVertices*3;
numAddedClipVertices++;
t=dot1/(dot1-dot2);
this.clipVertices2$2[index]=x1+(x2-x1)*t;
this.clipVertices2$2[index+1]=y1+(y2-y1)*t;
this.clipVertices2$2[index+2]=z1+(z2-z1)*t;
index=numAddedClipVertices*3;
numAddedClipVertices++;
this.clipVertices2$2[index]=x2;
this.clipVertices2$2[index+1]=y2;
this.clipVertices2$2[index+2]=z2;
}
}
x1=x2;
y1=y2;
z1=z2;
dot1=dot2;
}
numClipVertices=numAddedClipVertices;
if(numClipVertices==0)return;
numAddedClipVertices=0;
index=(numClipVertices-1)*3;
x1=this.clipVertices2$2[index];
y1=this.clipVertices2$2[index+1];
z1=this.clipVertices2$2[index+2];
dot1=(x1-cx+s2x)*-n2x+(y1-cy+s2y)*-n2y+(z1-cz+s2z)*-n2z;
for(i=0;i<numClipVertices;i++){
index=i*3;
x2=this.clipVertices2$2[index];
y2=this.clipVertices2$2[index+1];
z2=this.clipVertices2$2[index+2];
dot2=(x2-cx+s2x)*-n2x+(y2-cy+s2y)*-n2y+(z2-cz+s2z)*-n2z;
if(dot1>0){
if(dot2>0){
index=numAddedClipVertices*3;
numAddedClipVertices++;
this.clipVertices1$2[index]=x2;
this.clipVertices1$2[index+1]=y2;
this.clipVertices1$2[index+2]=z2;
}else{
index=numAddedClipVertices*3;
numAddedClipVertices++;
t=dot1/(dot1-dot2);
this.clipVertices1$2[index]=x1+(x2-x1)*t;
this.clipVertices1$2[index+1]=y1+(y2-y1)*t;
this.clipVertices1$2[index+2]=z1+(z2-z1)*t;
}
}else{
if(dot2>0){
index=numAddedClipVertices*3;
numAddedClipVertices++;
t=dot1/(dot1-dot2);
this.clipVertices1$2[index]=x1+(x2-x1)*t;
this.clipVertices1$2[index+1]=y1+(y2-y1)*t;
this.clipVertices1$2[index+2]=z1+(z2-z1)*t;
index=numAddedClipVertices*3;
numAddedClipVertices++;
this.clipVertices1$2[index]=x2;
this.clipVertices1$2[index+1]=y2;
this.clipVertices1$2[index+2]=z2;
}
}
x1=x2;
y1=y2;
z1=z2;
dot1=dot2;
}
numClipVertices=numAddedClipVertices;
if(swap){
var tb=b1;
b1=b2;
b2=tb;
}
if(numClipVertices==0)return;
if(numClipVertices>4){
x1=(q1x+q2x+q3x+q4x)*0.25;
y1=(q1y+q2y+q3y+q4y)*0.25;
z1=(q1z+q2z+q3z+q4z)*0.25;
n1x=q1x-x1;
n1y=q1y-y1;
n1z=q1z-z1;
n2x=q2x-x1;
n2y=q2y-y1;
n2z=q2z-z1;
var index1=0;
var index2=0;
var index3=0;
var index4=0;
var maxDot=-this.INF$2;
minDot=this.INF$2;
for(i=0;i<numClipVertices;i++){
this.used$2[i]=false;
index=i*3;
x1=this.clipVertices1$2[index];
y1=this.clipVertices1$2[index+1];
z1=this.clipVertices1$2[index+2];
dot=x1*n1x+y1*n1y+z1*n1z;
if(dot<minDot){
minDot=dot;
index1=i;
}
if(dot>maxDot){
maxDot=dot;
index3=i;
}
}
this.used$2[index1]=true;
this.used$2[index3]=true;
maxDot=-this.INF$2;
minDot=this.INF$2;
for(i=0;i<numClipVertices;i++){
if(this.used$2[i])continue;
index=i*3;
x1=this.clipVertices1$2[index];
y1=this.clipVertices1$2[index+1];
z1=this.clipVertices1$2[index+2];
dot=x1*n2x+y1*n2y+z1*n2z;
if(dot<minDot){
minDot=dot;
index2=i;
}
if(dot>maxDot){
maxDot=dot;
index4=i;
}
}
index=index1*3;
x1=this.clipVertices1$2[index];
y1=this.clipVertices1$2[index+1];
z1=this.clipVertices1$2[index+2];
dot=(x1-cx)*nx+(y1-cy)*ny+(z1-cz)*nz;
if(dot<0){
result.addContactInfo(x1,y1,z1,nx,ny,nz,dot,b1,b2,0,0,false);
}
index=index2*3;
x1=this.clipVertices1$2[index];
y1=this.clipVertices1$2[index+1];
z1=this.clipVertices1$2[index+2];
dot=(x1-cx)*nx+(y1-cy)*ny+(z1-cz)*nz;
if(dot<0){
result.addContactInfo(x1,y1,z1,nx,ny,nz,dot,b1,b2,1,0,false);
}
index=index3*3;
x1=this.clipVertices1$2[index];
y1=this.clipVertices1$2[index+1];
z1=this.clipVertices1$2[index+2];
dot=(x1-cx)*nx+(y1-cy)*ny+(z1-cz)*nz;
if(dot<0){
result.addContactInfo(x1,y1,z1,nx,ny,nz,dot,b1,b2,2,0,false);
}
index=index4*3;
x1=this.clipVertices1$2[index];
y1=this.clipVertices1$2[index+1];
z1=this.clipVertices1$2[index+2];
dot=(x1-cx)*nx+(y1-cy)*ny+(z1-cz)*nz;
if(dot<0){
result.addContactInfo(x1,y1,z1,nx,ny,nz,dot,b1,b2,3,0,false);
}
}else{
for(i=0;i<numClipVertices;i++){
index=i*3;
x1=this.clipVertices1$2[index];
y1=this.clipVertices1$2[index+1];
z1=this.clipVertices1$2[index+2];
dot=(x1-cx)*nx+(y1-cy)*ny+(z1-cz)*nz;
if(dot<0){
result.addContactInfo(x1,y1,z1,nx,ny,nz,dot,b1,b2,i,0,false);
}
}
}
},
];},[],["com.element.oimo.physics.collision.narrow.CollisionDetector","Array","com.element.oimo.physics.collision.shape.BoxShape","Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.narrow.BoxCylinderCollisionDetector
joo.classLoader.prepare("package com.element.oimo.physics.collision.narrow",
"public class BoxCylinderCollisionDetector extends com.element.oimo.physics.collision.narrow.CollisionDetector",2,function($$private){var as=joo.as;return[
"private function getSep",function(c1,c2,sep,pos,dep){
var t1x;
var t1y;
var t1z;
var t2x;
var t2y;
var t2z;
var sup=new com.element.oimo.math.Vec3();
var len;
var p1x;
var p1y;
var p1z;
var p2x;
var p2y;
var p2z;
var v01x=c1.position.x;
var v01y=c1.position.y;
var v01z=c1.position.z;
var v02x=c2.position.x;
var v02y=c2.position.y;
var v02z=c2.position.z;
var v0x=v02x-v01x;
var v0y=v02y-v01y;
var v0z=v02z-v01z;
if(v0x*v0x+v0y*v0y+v0z*v0z==0)v0y=0.001;
var nx=-v0x;
var ny=-v0y;
var nz=-v0z;
this.supportPointB$2(c1,-nx,-ny,-nz,sup);
var v11x=sup.x;
var v11y=sup.y;
var v11z=sup.z;
this.supportPointC$2(c2,nx,ny,nz,sup);
var v12x=sup.x;
var v12y=sup.y;
var v12z=sup.z;
var v1x=v12x-v11x;
var v1y=v12y-v11y;
var v1z=v12z-v11z;
if(v1x*nx+v1y*ny+v1z*nz<=0){
return false;
}
nx=v1y*v0z-v1z*v0y;
ny=v1z*v0x-v1x*v0z;
nz=v1x*v0y-v1y*v0x;
if(nx*nx+ny*ny+nz*nz==0){
sep.init(v1x-v0x,v1y-v0y,v1z-v0z);
sep.normalize(sep);
pos.init((v11x+v12x)*0.5,(v11y+v12y)*0.5,(v11z+v12z)*0.5);
return true;
}
this.supportPointB$2(c1,-nx,-ny,-nz,sup);
var v21x=sup.x;
var v21y=sup.y;
var v21z=sup.z;
this.supportPointC$2(c2,nx,ny,nz,sup);
var v22x=sup.x;
var v22y=sup.y;
var v22z=sup.z;
var v2x=v22x-v21x;
var v2y=v22y-v21y;
var v2z=v22z-v21z;
if(v2x*nx+v2y*ny+v2z*nz<=0){
return false;
}
t1x=v1x-v0x;
t1y=v1y-v0y;
t1z=v1z-v0z;
t2x=v2x-v0x;
t2y=v2y-v0y;
t2z=v2z-v0z;
nx=t1y*t2z-t1z*t2y;
ny=t1z*t2x-t1x*t2z;
nz=t1x*t2y-t1y*t2x;
if(nx*v0x+ny*v0y+nz*v0z>0){
t1x=v1x;
t1y=v1y;
t1z=v1z;
v1x=v2x;
v1y=v2y;
v1z=v2z;
v2x=t1x;
v2y=t1y;
v2z=t1z;
t1x=v11x;
t1y=v11y;
t1z=v11z;
v11x=v21x;
v11y=v21y;
v11z=v21z;
v21x=t1x;
v21y=t1y;
v21z=t1z;
t1x=v12x;
t1y=v12y;
t1z=v12z;
v12x=v22x;
v12y=v22y;
v12z=v22z;
v22x=t1x;
v22y=t1y;
v22z=t1z;
nx=-nx;
ny=-ny;
nz=-nz;
}
var iterations=0;
while(true){
if(++iterations>100){
return false;
}
this.supportPointB$2(c1,-nx,-ny,-nz,sup);
var v31x=sup.x;
var v31y=sup.y;
var v31z=sup.z;
this.supportPointC$2(c2,nx,ny,nz,sup);
var v32x=sup.x;
var v32y=sup.y;
var v32z=sup.z;
var v3x=v32x-v31x;
var v3y=v32y-v31y;
var v3z=v32z-v31z;
if(v3x*nx+v3y*ny+v3z*nz<=0){
return false;
}
if((v1y*v3z-v1z*v3y)*v0x+(v1z*v3x-v1x*v3z)*v0y+(v1x*v3y-v1y*v3x)*v0z<0){
v2x=v3x;
v2y=v3y;
v2z=v3z;
v21x=v31x;
v21y=v31y;
v21z=v31z;
v22x=v32x;
v22y=v32y;
v22z=v32z;
t1x=v1x-v0x;
t1y=v1y-v0y;
t1z=v1z-v0z;
t2x=v3x-v0x;
t2y=v3y-v0y;
t2z=v3z-v0z;
nx=t1y*t2z-t1z*t2y;
ny=t1z*t2x-t1x*t2z;
nz=t1x*t2y-t1y*t2x;
continue;
}
if((v3y*v2z-v3z*v2y)*v0x+(v3z*v2x-v3x*v2z)*v0y+(v3x*v2y-v3y*v2x)*v0z<0){
v1x=v3x;
v1y=v3y;
v1z=v3z;
v11x=v31x;
v11y=v31y;
v11z=v31z;
v12x=v32x;
v12y=v32y;
v12z=v32z;
t1x=v3x-v0x;
t1y=v3y-v0y;
t1z=v3z-v0z;
t2x=v2x-v0x;
t2y=v2y-v0y;
t2z=v2z-v0z;
nx=t1y*t2z-t1z*t2y;
ny=t1z*t2x-t1x*t2z;
nz=t1x*t2y-t1y*t2x;
continue;
}
var hit=false;
while(true){
t1x=v2x-v1x;
t1y=v2y-v1y;
t1z=v2z-v1z;
t2x=v3x-v1x;
t2y=v3y-v1y;
t2z=v3z-v1z;
nx=t1y*t2z-t1z*t2y;
ny=t1z*t2x-t1x*t2z;
nz=t1x*t2y-t1y*t2x;
len=1/Math.sqrt(nx*nx+ny*ny+nz*nz);
nx*=len;
ny*=len;
nz*=len;
if(nx*v1x+ny*v1y+nz*v1z>=0&&!hit){
var b0=(v1y*v2z-v1z*v2y)*v3x+(v1z*v2x-v1x*v2z)*v3y+(v1x*v2y-v1y*v2x)*v3z;
var b1=(v3y*v2z-v3z*v2y)*v0x+(v3z*v2x-v3x*v2z)*v0y+(v3x*v2y-v3y*v2x)*v0z;
var b2=(v0y*v1z-v0z*v1y)*v3x+(v0z*v1x-v0x*v1z)*v3y+(v0x*v1y-v0y*v1x)*v3z;
var b3=(v2y*v1z-v2z*v1y)*v0x+(v2z*v1x-v2x*v1z)*v0y+(v2x*v1y-v2y*v1x)*v0z;
var sum=b0+b1+b2+b3;
if(sum<=0){
b0=0;
b1=(v2y*v3z-v2z*v3y)*nx+(v2z*v3x-v2x*v3z)*ny+(v2x*v3y-v2y*v3x)*nz;
b2=(v3y*v2z-v3z*v2y)*nx+(v3z*v2x-v3x*v2z)*ny+(v3x*v2y-v3y*v2x)*nz;
b3=(v1y*v2z-v1z*v2y)*nx+(v1z*v2x-v1x*v2z)*ny+(v1x*v2y-v1y*v2x)*nz;
sum=b1+b2+b3;
}
var inv=1/sum;
p1x=(v01x*b0+v11x*b1+v21x*b2+v31x*b3)*inv;
p1y=(v01y*b0+v11y*b1+v21y*b2+v31y*b3)*inv;
p1z=(v01z*b0+v11z*b1+v21z*b2+v31z*b3)*inv;
p2x=(v02x*b0+v12x*b1+v22x*b2+v32x*b3)*inv;
p2y=(v02y*b0+v12y*b1+v22y*b2+v32y*b3)*inv;
p2z=(v02z*b0+v12z*b1+v22z*b2+v32z*b3)*inv;
hit=true;
}
this.supportPointB$2(c1,-nx,-ny,-nz,sup);
var v41x=sup.x;
var v41y=sup.y;
var v41z=sup.z;
this.supportPointC$2(c2,nx,ny,nz,sup);
var v42x=sup.x;
var v42y=sup.y;
var v42z=sup.z;
var v4x=v42x-v41x;
var v4y=v42y-v41y;
var v4z=v42z-v41z;
var separation=-(v4x*nx+v4y*ny+v4z*nz);
if((v4x-v3x)*nx+(v4y-v3y)*ny+(v4z-v3z)*nz<=0.01||separation>=0){
if(hit){
sep.init(-nx,-ny,-nz);
pos.init((p1x+p2x)*0.5,(p1y+p2y)*0.5,(p1z+p2z)*0.5);
dep.x=separation;
return true;
}
return false;
}
if(
(v4y*v1z-v4z*v1y)*v0x+
(v4z*v1x-v4x*v1z)*v0y+
(v4x*v1y-v4y*v1x)*v0z<0
){
if(
(v4y*v2z-v4z*v2y)*v0x+
(v4z*v2x-v4x*v2z)*v0y+
(v4x*v2y-v4y*v2x)*v0z<0
){
v1x=v4x;
v1y=v4y;
v1z=v4z;
v11x=v41x;
v11y=v41y;
v11z=v41z;
v12x=v42x;
v12y=v42y;
v12z=v42z;
}else{
v3x=v4x;
v3y=v4y;
v3z=v4z;
v31x=v41x;
v31y=v41y;
v31z=v41z;
v32x=v42x;
v32y=v42y;
v32z=v42z;
}
}else{
if(
(v4y*v3z-v4z*v3y)*v0x+
(v4z*v3x-v4x*v3z)*v0y+
(v4x*v3y-v4y*v3x)*v0z<0
){
v2x=v4x;
v2y=v4y;
v2z=v4z;
v21x=v41x;
v21y=v41y;
v21z=v41z;
v22x=v42x;
v22y=v42y;
v22z=v42z;
}else{
v1x=v4x;
v1y=v4y;
v1z=v4z;
v11x=v41x;
v11y=v41y;
v11z=v41z;
v12x=v42x;
v12y=v42y;
v12z=v42z;
}
}
}
}
return false;
},
"private function supportPointB",function(c,dx,dy,dz,out){
var rot=c.rotation;
var ldx=rot.e00*dx+rot.e10*dy+rot.e20*dz;
var ldy=rot.e01*dx+rot.e11*dy+rot.e21*dz;
var ldz=rot.e02*dx+rot.e12*dy+rot.e22*dz;
var w=c.halfWidth;
var h=c.halfHeight;
var d=c.halfDepth;
var ox;
var oy;
var oz;
if(ldx<0)ox=-w;
else ox=w;
if(ldy<0)oy=-h;
else oy=h;
if(ldz<0)oz=-d;
else oz=d;
ldx=rot.e00*ox+rot.e01*oy+rot.e02*oz+c.position.x;
ldy=rot.e10*ox+rot.e11*oy+rot.e12*oz+c.position.y;
ldz=rot.e20*ox+rot.e21*oy+rot.e22*oz+c.position.z;
out.init(ldx,ldy,ldz);
},
"private function supportPointC",function(c,dx,dy,dz,out){
var rot=c.rotation;
var ldx=rot.e00*dx+rot.e10*dy+rot.e20*dz;
var ldy=rot.e01*dx+rot.e11*dy+rot.e21*dz;
var ldz=rot.e02*dx+rot.e12*dy+rot.e22*dz;
var radx=ldx;
var radz=ldz;
var len=radx*radx+radz*radz;
var rad=c.radius;
var hh=c.halfHeight;
var ox;
var oy;
var oz;
if(len==0){
if(ldy<0){
ox=rad;
oy=-hh;
oz=0;
}else{
ox=rad;
oy=hh;
oz=0;
}
}else{
len=c.radius/Math.sqrt(len);
if(ldy<0){
ox=radx*len;
oy=-hh;
oz=radz*len;
}else{
ox=radx*len;
oy=hh;
oz=radz*len;
}
}
ldx=rot.e00*ox+rot.e01*oy+rot.e02*oz+c.position.x;
ldy=rot.e10*ox+rot.e11*oy+rot.e12*oz+c.position.y;
ldz=rot.e20*ox+rot.e21*oy+rot.e22*oz+c.position.z;
out.init(ldx,ldy,ldz);
},
"public function BoxCylinderCollisionDetector",function(flip){this.super$2();
this.flip=flip;
},
"override public function detectCollision",function(shape1,shape2,result){
var b;
var c;
if(this.flip){
b=as(shape2,com.element.oimo.physics.collision.shape.BoxShape);
c=as(shape1,com.element.oimo.physics.collision.shape.CylinderShape);
}else{
b=as(shape1,com.element.oimo.physics.collision.shape.BoxShape);
c=as(shape2,com.element.oimo.physics.collision.shape.CylinderShape);
}
var sep=new com.element.oimo.math.Vec3();
var pos=new com.element.oimo.math.Vec3();
var dep=new com.element.oimo.math.Vec3();
var co;
if(!this.getSep$2(b,c,sep,pos,dep))return;
var pbx=b.position.x;
var pby=b.position.y;
var pbz=b.position.z;
var pcx=c.position.x;
var pcy=c.position.y;
var pcz=c.position.z;
var bw=b.halfWidth;
var bh=b.halfHeight;
var bd=b.halfDepth;
var ch=c.halfHeight;
var r=c.radius;
var nwx=b.normalDirectionWidth.x;
var nwy=b.normalDirectionWidth.y;
var nwz=b.normalDirectionWidth.z;
var nhx=b.normalDirectionHeight.x;
var nhy=b.normalDirectionHeight.y;
var nhz=b.normalDirectionHeight.z;
var ndx=b.normalDirectionDepth.x;
var ndy=b.normalDirectionDepth.y;
var ndz=b.normalDirectionDepth.z;
var dwx=b.halfDirectionWidth.x;
var dwy=b.halfDirectionWidth.y;
var dwz=b.halfDirectionWidth.z;
var dhx=b.halfDirectionHeight.x;
var dhy=b.halfDirectionHeight.y;
var dhz=b.halfDirectionHeight.z;
var ddx=b.halfDirectionDepth.x;
var ddy=b.halfDirectionDepth.y;
var ddz=b.halfDirectionDepth.z;
var ncx=c.normalDirection.x;
var ncy=c.normalDirection.y;
var ncz=c.normalDirection.z;
var dcx=c.halfDirection.x;
var dcy=c.halfDirection.y;
var dcz=c.halfDirection.z;
var nx=sep.x;
var ny=sep.y;
var nz=sep.z;
var dotw=nx*nwx+ny*nwy+nz*nwz;
var doth=nx*nhx+ny*nhy+nz*nhz;
var dotd=nx*ndx+ny*ndy+nz*ndz;
var dotc=nx*ncx+ny*ncy+nz*ncz;
var right1=dotw>0;
var right2=doth>0;
var right3=dotd>0;
var right4=dotc>0;
if(!right1)dotw=-dotw;
if(!right2)doth=-doth;
if(!right3)dotd=-dotd;
if(!right4)dotc=-dotc;
var state=0;
if(dotc>0.999){
if(dotw>0.999){
if(dotw>dotc)state=1;
else state=4;
}else if(doth>0.999){
if(doth>dotc)state=2;
else state=4;
}else if(dotd>0.999){
if(dotd>dotc)state=3;
else state=4;
}else state=4;
}else{
if(dotw>0.999)state=1;
else if(doth>0.999)state=2;
else if(dotd>0.999)state=3;
}
var cbx;
var cby;
var cbz;
var ccx;
var ccy;
var ccz;
var r00;
var r01;
var r02;
var r10;
var r11;
var r12;
var r20;
var r21;
var r22;
var px;
var py;
var pz;
var pd;
var dot;
var len;
var tx;
var ty;
var tz;
var td;
var dx;
var dy;
var dz;
var d1x;
var d1y;
var d1z;
var d2x;
var d2y;
var d2z;
var sx;
var sy;
var sz;
var sd;
var ex;
var ey;
var ez;
var ed;
var dot1;
var dot2;
var t1;
var t2;
var dir1x;
var dir1y;
var dir1z;
var dir2x;
var dir2y;
var dir2z;
var dir1l;
var dir2l;
if(state==0){
result.addContactInfo(pos.x,pos.y,pos.z,nx,ny,nz,dep.x,b,c,0,0,false);
}else if(state==4){
if(right4){
ccx=pcx-dcx;
ccy=pcy-dcy;
ccz=pcz-dcz;
nx=-ncx;
ny=-ncy;
nz=-ncz;
}else{
ccx=pcx+dcx;
ccy=pcy+dcy;
ccz=pcz+dcz;
nx=ncx;
ny=ncy;
nz=ncz;
}
var v1x;
var v1y;
var v1z;
var v2x;
var v2y;
var v2z;
var v3x;
var v3y;
var v3z;
var v4x;
var v4y;
var v4z;
var v;
dot=1;
state=0;
dot1=nwx*nx+nwy*ny+nwz*nz;
if(dot1<dot){
dot=dot1;
state=0;
}
if(-dot1<dot){
dot=-dot1;
state=1;
}
dot1=nhx*nx+nhy*ny+nhz*nz;
if(dot1<dot){
dot=dot1;
state=2;
}
if(-dot1<dot){
dot=-dot1;
state=3;
}
dot1=ndx*nx+ndy*ny+ndz*nz;
if(dot1<dot){
dot=dot1;
state=4;
}
if(-dot1<dot){
dot=-dot1;
state=5;
}
switch(state){
case 0:
v=b.vertex1;
v1x=v.x;
v1y=v.y;
v1z=v.z;
v=b.vertex3;
v2x=v.x;
v2y=v.y;
v2z=v.z;
v=b.vertex4;
v3x=v.x;
v3y=v.y;
v3z=v.z;
v=b.vertex2;
v4x=v.x;
v4y=v.y;
v4z=v.z;
break;
case 1:
v=b.vertex6;
v1x=v.x;
v1y=v.y;
v1z=v.z;
v=b.vertex8;
v2x=v.x;
v2y=v.y;
v2z=v.z;
v=b.vertex7;
v3x=v.x;
v3y=v.y;
v3z=v.z;
v=b.vertex5;
v4x=v.x;
v4y=v.y;
v4z=v.z;
break;
case 2:
v=b.vertex5;
v1x=v.x;
v1y=v.y;
v1z=v.z;
v=b.vertex1;
v2x=v.x;
v2y=v.y;
v2z=v.z;
v=b.vertex2;
v3x=v.x;
v3y=v.y;
v3z=v.z;
v=b.vertex6;
v4x=v.x;
v4y=v.y;
v4z=v.z;
break;
case 3:
v=b.vertex8;
v1x=v.x;
v1y=v.y;
v1z=v.z;
v=b.vertex4;
v2x=v.x;
v2y=v.y;
v2z=v.z;
v=b.vertex3;
v3x=v.x;
v3y=v.y;
v3z=v.z;
v=b.vertex7;
v4x=v.x;
v4y=v.y;
v4z=v.z;
break;
case 4:
v=b.vertex5;
v1x=v.x;
v1y=v.y;
v1z=v.z;
v=b.vertex7;
v2x=v.x;
v2y=v.y;
v2z=v.z;
v=b.vertex3;
v3x=v.x;
v3y=v.y;
v3z=v.z;
v=b.vertex1;
v4x=v.x;
v4y=v.y;
v4z=v.z;
break;
case 5:
v=b.vertex2;
v1x=v.x;
v1y=v.y;
v1z=v.z;
v=b.vertex4;
v2x=v.x;
v2y=v.y;
v2z=v.z;
v=b.vertex8;
v3x=v.x;
v3y=v.y;
v3z=v.z;
v=b.vertex6;
v4x=v.x;
v4y=v.y;
v4z=v.z;
break;
}
pd=nx*(v1x-ccx)+ny*(v1y-ccy)+nz*(v1z-ccz);
if(pd<=0)result.addContactInfo(v1x,v1y,v1z,-nx,-ny,-nz,pd,b,c,5,0,false);
pd=nx*(v2x-ccx)+ny*(v2y-ccy)+nz*(v2z-ccz);
if(pd<=0)result.addContactInfo(v2x,v2y,v2z,-nx,-ny,-nz,pd,b,c,6,0,false);
pd=nx*(v3x-ccx)+ny*(v3y-ccy)+nz*(v3z-ccz);
if(pd<=0)result.addContactInfo(v3x,v3y,v3z,-nx,-ny,-nz,pd,b,c,7,0,false);
pd=nx*(v4x-ccx)+ny*(v4y-ccy)+nz*(v4z-ccz);
if(pd<=0)result.addContactInfo(v4x,v4y,v4z,-nx,-ny,-nz,pd,b,c,8,0,false);
}else{
switch(state){
case 1:
if(right1){
cbx=pbx+dwx;
cby=pby+dwy;
cbz=pbz+dwz;
nx=nwx;
ny=nwy;
nz=nwz;
}else{
cbx=pbx-dwx;
cby=pby-dwy;
cbz=pbz-dwz;
nx=-nwx;
ny=-nwy;
nz=-nwz;
}
dir1x=nhx;
dir1y=nhy;
dir1z=nhz;
dir1l=bh;
dir2x=ndx;
dir2y=ndy;
dir2z=ndz;
dir2l=bd;
break;
case 2:
if(right2){
cbx=pbx+dhx;
cby=pby+dhy;
cbz=pbz+dhz;
nx=nhx;
ny=nhy;
nz=nhz;
}else{
cbx=pbx-dhx;
cby=pby-dhy;
cbz=pbz-dhz;
nx=-nhx;
ny=-nhy;
nz=-nhz;
}
dir1x=nwx;
dir1y=nwy;
dir1z=nwz;
dir1l=bw;
dir2x=ndx;
dir2y=ndy;
dir2z=ndz;
dir2l=bd;
break;
case 3:
if(right3){
cbx=pbx+ddx;
cby=pby+ddy;
cbz=pbz+ddz;
nx=ndx;
ny=ndy;
nz=ndz;
}else{
cbx=pbx-ddx;
cby=pby-ddy;
cbz=pbz-ddz;
nx=-ndx;
ny=-ndy;
nz=-ndz;
}
dir1x=nwx;
dir1y=nwy;
dir1z=nwz;
dir1l=bw;
dir2x=nhx;
dir2y=nhy;
dir2z=nhz;
dir2l=bh;
break;
}
dot=nx*ncx+ny*ncy+nz*ncz;
if(dot<0)len=ch;
else len=-ch;
ccx=pcx+len*ncx;
ccy=pcy+len*ncy;
ccz=pcz+len*ncz;
if(dotc>=0.999999){
tx=-ny;
ty=nz;
tz=nx;
}else{
tx=nx;
ty=ny;
tz=nz;
}
len=tx*ncx+ty*ncy+tz*ncz;
dx=len*ncx-tx;
dy=len*ncy-ty;
dz=len*ncz-tz;
len=Math.sqrt(dx*dx+dy*dy+dz*dz);
if(len==0)return;
len=r/len;
dx*=len;
dy*=len;
dz*=len;
tx=ccx+dx;
ty=ccy+dy;
tz=ccz+dz;
if(dot<-0.96||dot>0.96){
r00=ncx*ncx*1.5-0.5;
r01=ncx*ncy*1.5-ncz*0.866025403;
r02=ncx*ncz*1.5+ncy*0.866025403;
r10=ncy*ncx*1.5+ncz*0.866025403;
r11=ncy*ncy*1.5-0.5;
r12=ncy*ncz*1.5-ncx*0.866025403;
r20=ncz*ncx*1.5-ncy*0.866025403;
r21=ncz*ncy*1.5+ncx*0.866025403;
r22=ncz*ncz*1.5-0.5;
px=tx;
py=ty;
pz=tz;
pd=nx*(px-cbx)+ny*(py-cby)+nz*(pz-cbz);
tx=px-pd*nx-cbx;
ty=py-pd*ny-cby;
tz=pz-pd*nz-cbz;
sd=dir1x*tx+dir1y*ty+dir1z*tz;
ed=dir2x*tx+dir2y*ty+dir2z*tz;
if(sd<-dir1l)sd=-dir1l;
else if(sd>dir1l)sd=dir1l;
if(ed<-dir2l)ed=-dir2l;
else if(ed>dir2l)ed=dir2l;
tx=sd*dir1x+ed*dir2x;
ty=sd*dir1y+ed*dir2y;
tz=sd*dir1z+ed*dir2z;
px=cbx+tx;
py=cby+ty;
pz=cbz+tz;
result.addContactInfo(px,py,pz,nx,ny,nz,pd,b,c,1,0,false);
px=dx*r00+dy*r01+dz*r02;
py=dx*r10+dy*r11+dz*r12;
pz=dx*r20+dy*r21+dz*r22;
px=(dx=px)+ccx;
py=(dy=py)+ccy;
pz=(dz=pz)+ccz;
pd=nx*(px-cbx)+ny*(py-cby)+nz*(pz-cbz);
if(pd<=0){
tx=px-pd*nx-cbx;
ty=py-pd*ny-cby;
tz=pz-pd*nz-cbz;
sd=dir1x*tx+dir1y*ty+dir1z*tz;
ed=dir2x*tx+dir2y*ty+dir2z*tz;
if(sd<-dir1l)sd=-dir1l;
else if(sd>dir1l)sd=dir1l;
if(ed<-dir2l)ed=-dir2l;
else if(ed>dir2l)ed=dir2l;
tx=sd*dir1x+ed*dir2x;
ty=sd*dir1y+ed*dir2y;
tz=sd*dir1z+ed*dir2z;
px=cbx+tx;
py=cby+ty;
pz=cbz+tz;
result.addContactInfo(px,py,pz,nx,ny,nz,pd,b,c,2,0,false);
}
px=dx*r00+dy*r01+dz*r02;
py=dx*r10+dy*r11+dz*r12;
pz=dx*r20+dy*r21+dz*r22;
px=(dx=px)+ccx;
py=(dy=py)+ccy;
pz=(dz=pz)+ccz;
pd=nx*(px-cbx)+ny*(py-cby)+nz*(pz-cbz);
if(pd<=0){
tx=px-pd*nx-cbx;
ty=py-pd*ny-cby;
tz=pz-pd*nz-cbz;
sd=dir1x*tx+dir1y*ty+dir1z*tz;
ed=dir2x*tx+dir2y*ty+dir2z*tz;
if(sd<-dir1l)sd=-dir1l;
else if(sd>dir1l)sd=dir1l;
if(ed<-dir2l)ed=-dir2l;
else if(ed>dir2l)ed=dir2l;
tx=sd*dir1x+ed*dir2x;
ty=sd*dir1y+ed*dir2y;
tz=sd*dir1z+ed*dir2z;
px=cbx+tx;
py=cby+ty;
pz=cbz+tz;
result.addContactInfo(px,py,pz,nx,ny,nz,pd,b,c,3,0,false);
}
}else{
sx=tx;
sy=ty;
sz=tz;
sd=nx*(sx-cbx)+ny*(sy-cby)+nz*(sz-cbz);
sx-=sd*nx;
sy-=sd*ny;
sz-=sd*nz;
if(dot>0){
ex=tx+dcx*2;
ey=ty+dcy*2;
ez=tz+dcz*2;
}else{
ex=tx-dcx*2;
ey=ty-dcy*2;
ez=tz-dcz*2;
}
ed=nx*(ex-cbx)+ny*(ey-cby)+nz*(ez-cbz);
ex-=ed*nx;
ey-=ed*ny;
ez-=ed*nz;
d1x=sx-cbx;
d1y=sy-cby;
d1z=sz-cbz;
d2x=ex-cbx;
d2y=ey-cby;
d2z=ez-cbz;
tx=ex-sx;
ty=ey-sy;
tz=ez-sz;
td=ed-sd;
dotw=d1x*dir1x+d1y*dir1y+d1z*dir1z;
doth=d2x*dir1x+d2y*dir1y+d2z*dir1z;
dot1=dotw-dir1l;
dot2=doth-dir1l;
if(dot1>0){
if(dot2>0)return;
t1=dot1/(dot1-dot2);
sx=sx+tx*t1;
sy=sy+ty*t1;
sz=sz+tz*t1;
sd=sd+td*t1;
d1x=sx-cbx;
d1y=sy-cby;
d1z=sz-cbz;
dotw=d1x*dir1x+d1y*dir1y+d1z*dir1z;
tx=ex-sx;
ty=ey-sy;
tz=ez-sz;
td=ed-sd;
}else if(dot2>0){
t1=dot1/(dot1-dot2);
ex=sx+tx*t1;
ey=sy+ty*t1;
ez=sz+tz*t1;
ed=sd+td*t1;
d2x=ex-cbx;
d2y=ey-cby;
d2z=ez-cbz;
doth=d2x*dir1x+d2y*dir1y+d2z*dir1z;
tx=ex-sx;
ty=ey-sy;
tz=ez-sz;
td=ed-sd;
}
dot1=dotw+dir1l;
dot2=doth+dir1l;
if(dot1<0){
if(dot2<0)return;
t1=dot1/(dot1-dot2);
sx=sx+tx*t1;
sy=sy+ty*t1;
sz=sz+tz*t1;
sd=sd+td*t1;
d1x=sx-cbx;
d1y=sy-cby;
d1z=sz-cbz;
tx=ex-sx;
ty=ey-sy;
tz=ez-sz;
td=ed-sd;
}else if(dot2<0){
t1=dot1/(dot1-dot2);
ex=sx+tx*t1;
ey=sy+ty*t1;
ez=sz+tz*t1;
ed=sd+td*t1;
d2x=ex-cbx;
d2y=ey-cby;
d2z=ez-cbz;
tx=ex-sx;
ty=ey-sy;
tz=ez-sz;
td=ed-sd;
}
dotw=d1x*dir2x+d1y*dir2y+d1z*dir2z;
doth=d2x*dir2x+d2y*dir2y+d2z*dir2z;
dot1=dotw-dir2l;
dot2=doth-dir2l;
if(dot1>0){
if(dot2>0)return;
t1=dot1/(dot1-dot2);
sx=sx+tx*t1;
sy=sy+ty*t1;
sz=sz+tz*t1;
sd=sd+td*t1;
d1x=sx-cbx;
d1y=sy-cby;
d1z=sz-cbz;
dotw=d1x*dir2x+d1y*dir2y+d1z*dir2z;
tx=ex-sx;
ty=ey-sy;
tz=ez-sz;
td=ed-sd;
}else if(dot2>0){
t1=dot1/(dot1-dot2);
ex=sx+tx*t1;
ey=sy+ty*t1;
ez=sz+tz*t1;
ed=sd+td*t1;
d2x=ex-cbx;
d2y=ey-cby;
d2z=ez-cbz;
doth=d2x*dir2x+d2y*dir2y+d2z*dir2z;
tx=ex-sx;
ty=ey-sy;
tz=ez-sz;
td=ed-sd;
}
dot1=dotw+dir2l;
dot2=doth+dir2l;
if(dot1<0){
if(dot2<0)return;
t1=dot1/(dot1-dot2);
sx=sx+tx*t1;
sy=sy+ty*t1;
sz=sz+tz*t1;
sd=sd+td*t1;
}else if(dot2<0){
t1=dot1/(dot1-dot2);
ex=sx+tx*t1;
ey=sy+ty*t1;
ez=sz+tz*t1;
ed=sd+td*t1;
}
if(sd<0){
result.addContactInfo(sx,sy,sz,nx,ny,nz,sd,b,c,1,0,false);
}
if(ed<0){
result.addContactInfo(ex,ey,ez,nx,ny,nz,ed,b,c,4,0,false);
}
}
}
},
];},[],["com.element.oimo.physics.collision.narrow.CollisionDetector","com.element.oimo.math.Vec3","Math","com.element.oimo.physics.collision.shape.BoxShape","com.element.oimo.physics.collision.shape.CylinderShape"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.narrow.CollisionDetector
joo.classLoader.prepare("package com.element.oimo.physics.collision.narrow",
"public class CollisionDetector",1,function($$private){;return[
"public var",{flip:false},
"public function CollisionDetector",function(){
},
"public function detectCollision",function(shape1,shape2,result){
throw new Error("detectCollision Function is not inherited");
},
];},[],["Error"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.narrow.CollisionResult
joo.classLoader.prepare("package com.element.oimo.physics.collision.narrow",
"public class CollisionResult",1,function($$private){;return[
"public var",{contactInfos:null},
"public var",{numContactInfos:0},
"private var",{maxContactInfos:0},
"public function CollisionResult",function(maxContactInfos){
this.maxContactInfos$1=maxContactInfos;
this.contactInfos=[];
},
"public function addContactInfo",function(
positionX,positionY,positionZ,
normalX,normalY,normalZ,
overlap,shape1,shape2,data1,data2,flip
){
if(this.numContactInfos==this.maxContactInfos$1)return;
if(!this.contactInfos[this.numContactInfos]){
this.contactInfos[this.numContactInfos]=new com.element.oimo.physics.collision.narrow.ContactInfo();
}
var c=this.contactInfos[this.numContactInfos++];
c.position.x=positionX;
c.position.y=positionY;
c.position.z=positionZ;
c.normal.x=normalX;
c.normal.y=normalY;
c.normal.z=normalZ;
c.overlap=overlap;
c.shape1=shape1;
c.shape2=shape2;
c.id.data1=data1;
c.id.data2=data2;
c.id.flip=flip;
},
];},[],["com.element.oimo.physics.collision.narrow.ContactInfo"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.narrow.ContactID
joo.classLoader.prepare("package com.element.oimo.physics.collision.narrow",
"public class ContactID",1,function($$private){;return[
"public var",{data1:0},
"public var",{data2:0},
"public var",{flip:false},
"public function ContactID",function(){
},
"public function equals",function(id){
return this.flip==id.flip?this.data1==id.data1&&this.data2==id.data2:this.data2==id.data1&&this.data1==id.data2;
},
];},[],[], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.narrow.ContactInfo
joo.classLoader.prepare(
"package com.element.oimo.physics.collision.narrow",
"public class ContactInfo",1,function($$private){;return[
"public var",{position:null},
"public var",{normal:null},
"public var",{overlap:NaN},
"public var",{shape1:null},
"public var",{shape2:null},
"public var",{id:null},
"public function ContactInfo",function(){
this.position=new com.element.oimo.math.Vec3();
this.normal=new com.element.oimo.math.Vec3();
this.id=new com.element.oimo.physics.collision.narrow.ContactID();
},
];},[],["com.element.oimo.math.Vec3","com.element.oimo.physics.collision.narrow.ContactID"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.narrow.CylinderCylinderCollisionDetector
joo.classLoader.prepare("package com.element.oimo.physics.collision.narrow",
"public class CylinderCylinderCollisionDetector extends com.element.oimo.physics.collision.narrow.CollisionDetector",2,function($$private){var as=joo.as;return[
"private function getSep",function(c1,c2,sep,pos,dep){
var t1x;
var t1y;
var t1z;
var t2x;
var t2y;
var t2z;
var sup=new com.element.oimo.math.Vec3();
var len;
var p1x;
var p1y;
var p1z;
var p2x;
var p2y;
var p2z;
var v01x=c1.position.x;
var v01y=c1.position.y;
var v01z=c1.position.z;
var v02x=c2.position.x;
var v02y=c2.position.y;
var v02z=c2.position.z;
var v0x=v02x-v01x;
var v0y=v02y-v01y;
var v0z=v02z-v01z;
if(v0x*v0x+v0y*v0y+v0z*v0z==0)v0y=0.001;
var nx=-v0x;
var ny=-v0y;
var nz=-v0z;
this.supportPoint$2(c1,-nx,-ny,-nz,sup);
var v11x=sup.x;
var v11y=sup.y;
var v11z=sup.z;
this.supportPoint$2(c2,nx,ny,nz,sup);
var v12x=sup.x;
var v12y=sup.y;
var v12z=sup.z;
var v1x=v12x-v11x;
var v1y=v12y-v11y;
var v1z=v12z-v11z;
if(v1x*nx+v1y*ny+v1z*nz<=0){
return false;
}
nx=v1y*v0z-v1z*v0y;
ny=v1z*v0x-v1x*v0z;
nz=v1x*v0y-v1y*v0x;
if(nx*nx+ny*ny+nz*nz==0){
sep.init(v1x-v0x,v1y-v0y,v1z-v0z);
sep.normalize(sep);
pos.init((v11x+v12x)*0.5,(v11y+v12y)*0.5,(v11z+v12z)*0.5);
return true;
}
this.supportPoint$2(c1,-nx,-ny,-nz,sup);
var v21x=sup.x;
var v21y=sup.y;
var v21z=sup.z;
this.supportPoint$2(c2,nx,ny,nz,sup);
var v22x=sup.x;
var v22y=sup.y;
var v22z=sup.z;
var v2x=v22x-v21x;
var v2y=v22y-v21y;
var v2z=v22z-v21z;
if(v2x*nx+v2y*ny+v2z*nz<=0){
return false;
}
t1x=v1x-v0x;
t1y=v1y-v0y;
t1z=v1z-v0z;
t2x=v2x-v0x;
t2y=v2y-v0y;
t2z=v2z-v0z;
nx=t1y*t2z-t1z*t2y;
ny=t1z*t2x-t1x*t2z;
nz=t1x*t2y-t1y*t2x;
if(nx*v0x+ny*v0y+nz*v0z>0){
t1x=v1x;
t1y=v1y;
t1z=v1z;
v1x=v2x;
v1y=v2y;
v1z=v2z;
v2x=t1x;
v2y=t1y;
v2z=t1z;
t1x=v11x;
t1y=v11y;
t1z=v11z;
v11x=v21x;
v11y=v21y;
v11z=v21z;
v21x=t1x;
v21y=t1y;
v21z=t1z;
t1x=v12x;
t1y=v12y;
t1z=v12z;
v12x=v22x;
v12y=v22y;
v12z=v22z;
v22x=t1x;
v22y=t1y;
v22z=t1z;
nx=-nx;
ny=-ny;
nz=-nz;
}
var iterations=0;
while(true){
if(++iterations>100){
return false;
}
this.supportPoint$2(c1,-nx,-ny,-nz,sup);
var v31x=sup.x;
var v31y=sup.y;
var v31z=sup.z;
this.supportPoint$2(c2,nx,ny,nz,sup);
var v32x=sup.x;
var v32y=sup.y;
var v32z=sup.z;
var v3x=v32x-v31x;
var v3y=v32y-v31y;
var v3z=v32z-v31z;
if(v3x*nx+v3y*ny+v3z*nz<=0){
return false;
}
if((v1y*v3z-v1z*v3y)*v0x+(v1z*v3x-v1x*v3z)*v0y+(v1x*v3y-v1y*v3x)*v0z<0){
v2x=v3x;
v2y=v3y;
v2z=v3z;
v21x=v31x;
v21y=v31y;
v21z=v31z;
v22x=v32x;
v22y=v32y;
v22z=v32z;
t1x=v1x-v0x;
t1y=v1y-v0y;
t1z=v1z-v0z;
t2x=v3x-v0x;
t2y=v3y-v0y;
t2z=v3z-v0z;
nx=t1y*t2z-t1z*t2y;
ny=t1z*t2x-t1x*t2z;
nz=t1x*t2y-t1y*t2x;
continue;
}
if((v3y*v2z-v3z*v2y)*v0x+(v3z*v2x-v3x*v2z)*v0y+(v3x*v2y-v3y*v2x)*v0z<0){
v1x=v3x;
v1y=v3y;
v1z=v3z;
v11x=v31x;
v11y=v31y;
v11z=v31z;
v12x=v32x;
v12y=v32y;
v12z=v32z;
t1x=v3x-v0x;
t1y=v3y-v0y;
t1z=v3z-v0z;
t2x=v2x-v0x;
t2y=v2y-v0y;
t2z=v2z-v0z;
nx=t1y*t2z-t1z*t2y;
ny=t1z*t2x-t1x*t2z;
nz=t1x*t2y-t1y*t2x;
continue;
}
var hit=false;
while(true){
t1x=v2x-v1x;
t1y=v2y-v1y;
t1z=v2z-v1z;
t2x=v3x-v1x;
t2y=v3y-v1y;
t2z=v3z-v1z;
nx=t1y*t2z-t1z*t2y;
ny=t1z*t2x-t1x*t2z;
nz=t1x*t2y-t1y*t2x;
len=1/Math.sqrt(nx*nx+ny*ny+nz*nz);
nx*=len;
ny*=len;
nz*=len;
if(nx*v1x+ny*v1y+nz*v1z>=0&&!hit){
var b0=(v1y*v2z-v1z*v2y)*v3x+(v1z*v2x-v1x*v2z)*v3y+(v1x*v2y-v1y*v2x)*v3z;
var b1=(v3y*v2z-v3z*v2y)*v0x+(v3z*v2x-v3x*v2z)*v0y+(v3x*v2y-v3y*v2x)*v0z;
var b2=(v0y*v1z-v0z*v1y)*v3x+(v0z*v1x-v0x*v1z)*v3y+(v0x*v1y-v0y*v1x)*v3z;
var b3=(v2y*v1z-v2z*v1y)*v0x+(v2z*v1x-v2x*v1z)*v0y+(v2x*v1y-v2y*v1x)*v0z;
var sum=b0+b1+b2+b3;
if(sum<=0){
b0=0;
b1=(v2y*v3z-v2z*v3y)*nx+(v2z*v3x-v2x*v3z)*ny+(v2x*v3y-v2y*v3x)*nz;
b2=(v3y*v2z-v3z*v2y)*nx+(v3z*v2x-v3x*v2z)*ny+(v3x*v2y-v3y*v2x)*nz;
b3=(v1y*v2z-v1z*v2y)*nx+(v1z*v2x-v1x*v2z)*ny+(v1x*v2y-v1y*v2x)*nz;
sum=b1+b2+b3;
}
var inv=1/sum;
p1x=(v01x*b0+v11x*b1+v21x*b2+v31x*b3)*inv;
p1y=(v01y*b0+v11y*b1+v21y*b2+v31y*b3)*inv;
p1z=(v01z*b0+v11z*b1+v21z*b2+v31z*b3)*inv;
p2x=(v02x*b0+v12x*b1+v22x*b2+v32x*b3)*inv;
p2y=(v02y*b0+v12y*b1+v22y*b2+v32y*b3)*inv;
p2z=(v02z*b0+v12z*b1+v22z*b2+v32z*b3)*inv;
hit=true;
}
this.supportPoint$2(c1,-nx,-ny,-nz,sup);
var v41x=sup.x;
var v41y=sup.y;
var v41z=sup.z;
this.supportPoint$2(c2,nx,ny,nz,sup);
var v42x=sup.x;
var v42y=sup.y;
var v42z=sup.z;
var v4x=v42x-v41x;
var v4y=v42y-v41y;
var v4z=v42z-v41z;
var separation=-(v4x*nx+v4y*ny+v4z*nz);
if((v4x-v3x)*nx+(v4y-v3y)*ny+(v4z-v3z)*nz<=0.01||separation>=0){
if(hit){
sep.init(-nx,-ny,-nz);
pos.init((p1x+p2x)*0.5,(p1y+p2y)*0.5,(p1z+p2z)*0.5);
dep.x=separation;
return true;
}
return false;
}
if(
(v4y*v1z-v4z*v1y)*v0x+
(v4z*v1x-v4x*v1z)*v0y+
(v4x*v1y-v4y*v1x)*v0z<0
){
if(
(v4y*v2z-v4z*v2y)*v0x+
(v4z*v2x-v4x*v2z)*v0y+
(v4x*v2y-v4y*v2x)*v0z<0
){
v1x=v4x;
v1y=v4y;
v1z=v4z;
v11x=v41x;
v11y=v41y;
v11z=v41z;
v12x=v42x;
v12y=v42y;
v12z=v42z;
}else{
v3x=v4x;
v3y=v4y;
v3z=v4z;
v31x=v41x;
v31y=v41y;
v31z=v41z;
v32x=v42x;
v32y=v42y;
v32z=v42z;
}
}else{
if(
(v4y*v3z-v4z*v3y)*v0x+
(v4z*v3x-v4x*v3z)*v0y+
(v4x*v3y-v4y*v3x)*v0z<0
){
v2x=v4x;
v2y=v4y;
v2z=v4z;
v21x=v41x;
v21y=v41y;
v21z=v41z;
v22x=v42x;
v22y=v42y;
v22z=v42z;
}else{
v1x=v4x;
v1y=v4y;
v1z=v4z;
v11x=v41x;
v11y=v41y;
v11z=v41z;
v12x=v42x;
v12y=v42y;
v12z=v42z;
}
}
}
}
return false;
},
"private function supportPoint",function(c,dx,dy,dz,out){
var rot=c.rotation;
var ldx=rot.e00*dx+rot.e10*dy+rot.e20*dz;
var ldy=rot.e01*dx+rot.e11*dy+rot.e21*dz;
var ldz=rot.e02*dx+rot.e12*dy+rot.e22*dz;
var radx=ldx;
var radz=ldz;
var len=radx*radx+radz*radz;
var rad=c.radius;
var hh=c.halfHeight;
var ox;
var oy;
var oz;
if(len==0){
if(ldy<0){
ox=rad;
oy=-hh;
oz=0;
}else{
ox=rad;
oy=hh;
oz=0;
}
}else{
len=c.radius/Math.sqrt(len);
if(ldy<0){
ox=radx*len;
oy=-hh;
oz=radz*len;
}else{
ox=radx*len;
oy=hh;
oz=radz*len;
}
}
ldx=rot.e00*ox+rot.e01*oy+rot.e02*oz+c.position.x;
ldy=rot.e10*ox+rot.e11*oy+rot.e12*oz+c.position.y;
ldz=rot.e20*ox+rot.e21*oy+rot.e22*oz+c.position.z;
out.init(ldx,ldy,ldz);
},
"public function CylinderCylinderCollisionDetector",function(){this.super$2();
},
"override public function detectCollision",function(shape1,shape2,result){
var c1;
var c2;
if(shape1.id<shape2.id){
c1=as(shape1,com.element.oimo.physics.collision.shape.CylinderShape);
c2=as(shape2,com.element.oimo.physics.collision.shape.CylinderShape);
}else{
c1=as(shape2,com.element.oimo.physics.collision.shape.CylinderShape);
c2=as(shape1,com.element.oimo.physics.collision.shape.CylinderShape);
}
var p1=c1.position;
var p2=c2.position;
var p1x=p1.x;
var p1y=p1.y;
var p1z=p1.z;
var p2x=p2.x;
var p2y=p2.y;
var p2z=p2.z;
var h1=c1.halfHeight;
var h2=c2.halfHeight;
var n1=c1.normalDirection;
var n2=c2.normalDirection;
var d1=c1.halfDirection;
var d2=c2.halfDirection;
var r1=c1.radius;
var r2=c2.radius;
var n1x=n1.x;
var n1y=n1.y;
var n1z=n1.z;
var n2x=n2.x;
var n2y=n2.y;
var n2z=n2.z;
var d1x=d1.x;
var d1y=d1.y;
var d1z=d1.z;
var d2x=d2.x;
var d2y=d2.y;
var d2z=d2.z;
var dx=p1x-p2x;
var dy=p1y-p2y;
var dz=p1z-p2z;
var len;
var len1;
var len2;
var c;
var c1x;
var c1y;
var c1z;
var c2x;
var c2y;
var c2z;
var tx;
var ty;
var tz;
var sx;
var sy;
var sz;
var ex;
var ey;
var ez;
var depth1;
var depth2;
var dot;
var t1;
var t2;
var sep=new com.element.oimo.math.Vec3();
var pos=new com.element.oimo.math.Vec3();
var dep=new com.element.oimo.math.Vec3();
if(!this.getSep$2(c1,c2,sep,pos,dep))return;
var dot1=sep.x*n1x+sep.y*n1y+sep.z*n1z;
var dot2=sep.x*n2x+sep.y*n2y+sep.z*n2z;
var right1=dot1>0;
var right2=dot2>0;
if(!right1)dot1=-dot1;
if(!right2)dot2=-dot2;
var state=0;
if(dot1>0.999||dot2>0.999){
if(dot1>dot2)state=1;
else state=2;
}
var nx;
var ny;
var nz;
var depth=dep.x;
var r00;
var r01;
var r02;
var r10;
var r11;
var r12;
var r20;
var r21;
var r22;
var px;
var py;
var pz;
var pd;
var a;
var b;
var e;
var f;
nx=sep.x;
ny=sep.y;
nz=sep.z;
switch(state){
case 0:
result.addContactInfo(pos.x,pos.y,pos.z,nx,ny,nz,depth,c1,c2,0,0,false);
break;
case 1:
if(right1){
c1x=p1x+d1x;
c1y=p1y+d1y;
c1z=p1z+d1z;
nx=n1x;
ny=n1y;
nz=n1z;
}else{
c1x=p1x-d1x;
c1y=p1y-d1y;
c1z=p1z-d1z;
nx=-n1x;
ny=-n1y;
nz=-n1z;
}
dot=nx*n2x+ny*n2y+nz*n2z;
if(dot<0)len=h2;
else len=-h2;
c2x=p2x+len*n2x;
c2y=p2y+len*n2y;
c2z=p2z+len*n2z;
if(dot2>=0.999999){
tx=-ny;
ty=nz;
tz=nx;
}else{
tx=nx;
ty=ny;
tz=nz;
}
len=tx*n2x+ty*n2y+tz*n2z;
dx=len*n2x-tx;
dy=len*n2y-ty;
dz=len*n2z-tz;
len=Math.sqrt(dx*dx+dy*dy+dz*dz);
if(len==0)break;
len=r2/len;
dx*=len;
dy*=len;
dz*=len;
tx=c2x+dx;
ty=c2y+dy;
tz=c2z+dz;
if(dot<-0.96||dot>0.96){
r00=n2x*n2x*1.5-0.5;
r01=n2x*n2y*1.5-n2z*0.866025403;
r02=n2x*n2z*1.5+n2y*0.866025403;
r10=n2y*n2x*1.5+n2z*0.866025403;
r11=n2y*n2y*1.5-0.5;
r12=n2y*n2z*1.5-n2x*0.866025403;
r20=n2z*n2x*1.5-n2y*0.866025403;
r21=n2z*n2y*1.5+n2x*0.866025403;
r22=n2z*n2z*1.5-0.5;
px=tx;
py=ty;
pz=tz;
pd=nx*(px-c1x)+ny*(py-c1y)+nz*(pz-c1z);
tx=px-pd*nx-c1x;
ty=py-pd*ny-c1y;
tz=pz-pd*nz-c1z;
len=tx*tx+ty*ty+tz*tz;
if(len>r1*r1){
len=r1/Math.sqrt(len);
tx*=len;
ty*=len;
tz*=len;
}
px=c1x+tx;
py=c1y+ty;
pz=c1z+tz;
result.addContactInfo(px,py,pz,nx,ny,nz,pd,c1,c2,1,0,false);
px=dx*r00+dy*r01+dz*r02;
py=dx*r10+dy*r11+dz*r12;
pz=dx*r20+dy*r21+dz*r22;
px=(dx=px)+c2x;
py=(dy=py)+c2y;
pz=(dz=pz)+c2z;
pd=nx*(px-c1x)+ny*(py-c1y)+nz*(pz-c1z);
if(pd<=0){
tx=px-pd*nx-c1x;
ty=py-pd*ny-c1y;
tz=pz-pd*nz-c1z;
len=tx*tx+ty*ty+tz*tz;
if(len>r1*r1){
len=r1/Math.sqrt(len);
tx*=len;
ty*=len;
tz*=len;
}
px=c1x+tx;
py=c1y+ty;
pz=c1z+tz;
result.addContactInfo(px,py,pz,nx,ny,nz,pd,c1,c2,2,0,false);
}
px=dx*r00+dy*r01+dz*r02;
py=dx*r10+dy*r11+dz*r12;
pz=dx*r20+dy*r21+dz*r22;
px=(dx=px)+c2x;
py=(dy=py)+c2y;
pz=(dz=pz)+c2z;
pd=nx*(px-c1x)+ny*(py-c1y)+nz*(pz-c1z);
if(pd<=0){
tx=px-pd*nx-c1x;
ty=py-pd*ny-c1y;
tz=pz-pd*nz-c1z;
len=tx*tx+ty*ty+tz*tz;
if(len>r1*r1){
len=r1/Math.sqrt(len);
tx*=len;
ty*=len;
tz*=len;
}
px=c1x+tx;
py=c1y+ty;
pz=c1z+tz;
result.addContactInfo(px,py,pz,nx,ny,nz,pd,c1,c2,3,0,false);
}
}else{
sx=tx;
sy=ty;
sz=tz;
depth1=nx*(sx-c1x)+ny*(sy-c1y)+nz*(sz-c1z);
sx-=depth1*nx;
sy-=depth1*ny;
sz-=depth1*nz;
if(dot>0){
ex=tx+n2x*h2*2;
ey=ty+n2y*h2*2;
ez=tz+n2z*h2*2;
}else{
ex=tx-n2x*h2*2;
ey=ty-n2y*h2*2;
ez=tz-n2z*h2*2;
}
depth2=nx*(ex-c1x)+ny*(ey-c1y)+nz*(ez-c1z);
ex-=depth2*nx;
ey-=depth2*ny;
ez-=depth2*nz;
dx=c1x-sx;
dy=c1y-sy;
dz=c1z-sz;
tx=ex-sx;
ty=ey-sy;
tz=ez-sz;
a=dx*dx+dy*dy+dz*dz;
b=dx*tx+dy*ty+dz*tz;
e=tx*tx+ty*ty+tz*tz;
f=b*b-e*(a-r1*r1);
if(f<0)break;
f=Math.sqrt(f);
t1=(b+f)/e;
t2=(b-f)/e;
if(t2<t1){
len=t1;
t1=t2;
t2=len;
}
if(t2>1)t2=1;
if(t1<0)t1=0;
tx=sx+(ex-sx)*t1;
ty=sy+(ey-sy)*t1;
tz=sz+(ez-sz)*t1;
ex=sx+(ex-sx)*t2;
ey=sy+(ey-sy)*t2;
ez=sz+(ez-sz)*t2;
sx=tx;
sy=ty;
sz=tz;
len=depth1+(depth2-depth1)*t1;
depth2=depth1+(depth2-depth1)*t2;
depth1=len;
if(depth1<0){
result.addContactInfo(sx,sy,sz,nx,ny,nz,pd,c1,c2,1,0,false);
}
if(depth2<0){
result.addContactInfo(ex,ey,ez,nx,ny,nz,pd,c1,c2,4,0,false);
}
}
break;
case 2:
if(right2){
c2x=p2x-d2x;
c2y=p2y-d2y;
c2z=p2z-d2z;
nx=-n2x;
ny=-n2y;
nz=-n2z;
}else{
c2x=p2x+d2x;
c2y=p2y+d2y;
c2z=p2z+d2z;
nx=n2x;
ny=n2y;
nz=n2z;
}
dot=nx*n1x+ny*n1y+nz*n1z;
if(dot<0)len=h1;
else len=-h1;
c1x=p1x+len*n1x;
c1y=p1y+len*n1y;
c1z=p1z+len*n1z;
if(dot1>=0.999999){
tx=-ny;
ty=nz;
tz=nx;
}else{
tx=nx;
ty=ny;
tz=nz;
}
len=tx*n1x+ty*n1y+tz*n1z;
dx=len*n1x-tx;
dy=len*n1y-ty;
dz=len*n1z-tz;
len=Math.sqrt(dx*dx+dy*dy+dz*dz);
if(len==0)break;
len=r1/len;
dx*=len;
dy*=len;
dz*=len;
tx=c1x+dx;
ty=c1y+dy;
tz=c1z+dz;
if(dot<-0.96||dot>0.96){
r00=n1x*n1x*1.5-0.5;
r01=n1x*n1y*1.5-n1z*0.866025403;
r02=n1x*n1z*1.5+n1y*0.866025403;
r10=n1y*n1x*1.5+n1z*0.866025403;
r11=n1y*n1y*1.5-0.5;
r12=n1y*n1z*1.5-n1x*0.866025403;
r20=n1z*n1x*1.5-n1y*0.866025403;
r21=n1z*n1y*1.5+n1x*0.866025403;
r22=n1z*n1z*1.5-0.5;
px=tx;
py=ty;
pz=tz;
pd=nx*(px-c2x)+ny*(py-c2y)+nz*(pz-c2z);
tx=px-pd*nx-c2x;
ty=py-pd*ny-c2y;
tz=pz-pd*nz-c2z;
len=tx*tx+ty*ty+tz*tz;
if(len>r2*r2){
len=r2/Math.sqrt(len);
tx*=len;
ty*=len;
tz*=len;
}
px=c2x+tx;
py=c2y+ty;
pz=c2z+tz;
result.addContactInfo(px,py,pz,-nx,-ny,-nz,pd,c1,c2,1,0,false);
px=dx*r00+dy*r01+dz*r02;
py=dx*r10+dy*r11+dz*r12;
pz=dx*r20+dy*r21+dz*r22;
px=(dx=px)+c1x;
py=(dy=py)+c1y;
pz=(dz=pz)+c1z;
pd=nx*(px-c2x)+ny*(py-c2y)+nz*(pz-c2z);
if(pd<=0){
tx=px-pd*nx-c2x;
ty=py-pd*ny-c2y;
tz=pz-pd*nz-c2z;
len=tx*tx+ty*ty+tz*tz;
if(len>r2*r2){
len=r2/Math.sqrt(len);
tx*=len;
ty*=len;
tz*=len;
}
px=c2x+tx;
py=c2y+ty;
pz=c2z+tz;
result.addContactInfo(px,py,pz,-nx,-ny,-nz,pd,c1,c2,2,0,false);
}
px=dx*r00+dy*r01+dz*r02;
py=dx*r10+dy*r11+dz*r12;
pz=dx*r20+dy*r21+dz*r22;
px=(dx=px)+c1x;
py=(dy=py)+c1y;
pz=(dz=pz)+c1z;
pd=nx*(px-c2x)+ny*(py-c2y)+nz*(pz-c2z);
if(pd<=0){
tx=px-pd*nx-c2x;
ty=py-pd*ny-c2y;
tz=pz-pd*nz-c2z;
len=tx*tx+ty*ty+tz*tz;
if(len>r2*r2){
len=r2/Math.sqrt(len);
tx*=len;
ty*=len;
tz*=len;
}
px=c2x+tx;
py=c2y+ty;
pz=c2z+tz;
result.addContactInfo(px,py,pz,-nx,-ny,-nz,pd,c1,c2,3,0,false);
}
}else{
sx=tx;
sy=ty;
sz=tz;
depth1=nx*(sx-c2x)+ny*(sy-c2y)+nz*(sz-c2z);
sx-=depth1*nx;
sy-=depth1*ny;
sz-=depth1*nz;
if(dot>0){
ex=tx+n1x*h1*2;
ey=ty+n1y*h1*2;
ez=tz+n1z*h1*2;
}else{
ex=tx-n1x*h1*2;
ey=ty-n1y*h1*2;
ez=tz-n1z*h1*2;
}
depth2=nx*(ex-c2x)+ny*(ey-c2y)+nz*(ez-c2z);
ex-=depth2*nx;
ey-=depth2*ny;
ez-=depth2*nz;
dx=c2x-sx;
dy=c2y-sy;
dz=c2z-sz;
tx=ex-sx;
ty=ey-sy;
tz=ez-sz;
a=dx*dx+dy*dy+dz*dz;
b=dx*tx+dy*ty+dz*tz;
e=tx*tx+ty*ty+tz*tz;
f=b*b-e*(a-r2*r2);
if(f<0)break;
f=Math.sqrt(f);
t1=(b+f)/e;
t2=(b-f)/e;
if(t2<t1){
len=t1;
t1=t2;
t2=len;
}
if(t2>1)t2=1;
if(t1<0)t1=0;
tx=sx+(ex-sx)*t1;
ty=sy+(ey-sy)*t1;
tz=sz+(ez-sz)*t1;
ex=sx+(ex-sx)*t2;
ey=sy+(ey-sy)*t2;
ez=sz+(ez-sz)*t2;
sx=tx;
sy=ty;
sz=tz;
len=depth1+(depth2-depth1)*t1;
depth2=depth1+(depth2-depth1)*t2;
depth1=len;
if(depth1<0){
result.addContactInfo(sx,sy,sz,-nx,-ny,-nz,depth1,c1,c2,1,0,false);
}
if(depth2<0){
result.addContactInfo(ex,ey,ez,-nx,-ny,-nz,depth2,c1,c2,4,0,false);
}
}
break;
}
},
];},[],["com.element.oimo.physics.collision.narrow.CollisionDetector","com.element.oimo.math.Vec3","Math","com.element.oimo.physics.collision.shape.CylinderShape"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.narrow.SphereBoxCollisionDetector
joo.classLoader.prepare("package com.element.oimo.physics.collision.narrow",
"public class SphereBoxCollisionDetector extends com.element.oimo.physics.collision.narrow.CollisionDetector",2,function($$private){var as=joo.as;return[
"public function SphereBoxCollisionDetector",function(flip){this.super$2();
this.flip=flip;
},
"override public function detectCollision",function(shape1,shape2,result){
var s;
var b;
if(this.flip){
s=as(shape2,com.element.oimo.physics.collision.shape.SphereShape);
b=as(shape1,com.element.oimo.physics.collision.shape.BoxShape);
}else{
s=as(shape1,com.element.oimo.physics.collision.shape.SphereShape);
b=as(shape2,com.element.oimo.physics.collision.shape.BoxShape);
}
var ps=s.position;
var psx=ps.x;
var psy=ps.y;
var psz=ps.z;
var pb=b.position;
var pbx=pb.x;
var pby=pb.y;
var pbz=pb.z;
var rad=s.radius;
var nw=b.normalDirectionWidth;
var nh=b.normalDirectionHeight;
var nd=b.normalDirectionDepth;
var hw=b.halfWidth;
var hh=b.halfHeight;
var hd=b.halfDepth;
var dx=psx-pbx;
var dy=psy-pby;
var dz=psz-pbz;
var sx=nw.x*dx+nw.y*dy+nw.z*dz;
var sy=nh.x*dx+nh.y*dy+nh.z*dz;
var sz=nd.x*dx+nd.y*dy+nd.z*dz;
var cx;
var cy;
var cz;
var len;
var invLen;
var c;
var overlap=0;
if(sx>hw){
sx=hw;
}else if(sx<-hw){
sx=-hw;
}else{
overlap=1;
}
if(sy>hh){
sy=hh;
}else if(sy<-hh){
sy=-hh;
}else{
overlap|=2;
}
if(sz>hd){
sz=hd;
}else if(sz<-hd){
sz=-hd;
}else{
overlap|=4;
}
if(overlap==7){
if(sx<0){
dx=hw+sx;
}else{
dx=hw-sx;
}
if(sy<0){
dy=hh+sy;
}else{
dy=hh-sy;
}
if(sz<0){
dz=hd+sz;
}else{
dz=hd-sz;
}
if(dx<dy){
if(dx<dz){
len=dx-hw;
if(sx<0){
sx=-hw;
dx=nw.x;
dy=nw.y;
dz=nw.z;
}else{
sx=hw;
dx=-nw.x;
dy=-nw.y;
dz=-nw.z;
}
}else{
len=dz-hd;
if(sz<0){
sz=-hd;
dx=nd.x;
dy=nd.y;
dz=nd.z;
}else{
sz=hd;
dx=-nd.x;
dy=-nd.y;
dz=-nd.z;
}
}
}else{
if(dy<dz){
len=dy-hh;
if(sy<0){
sy=-hh;
dx=nh.x;
dy=nh.y;
dz=nh.z;
}else{
sy=hh;
dx=-nh.x;
dy=-nh.y;
dz=-nh.z;
}
}else{
len=dz-hd;
if(sz<0){
sz=-hd;
dx=nd.x;
dy=nd.y;
dz=nd.z;
}else{
sz=hd;
dx=-nd.x;
dy=-nd.y;
dz=-nd.z;
}
}
}
cx=pbx+sx*nw.x+sy*nh.x+sz*nd.x;
cy=pby+sx*nw.y+sy*nh.y+sz*nd.y;
cz=pbz+sx*nw.z+sy*nh.z+sz*nd.z;
result.addContactInfo(psx+rad*dx,psy+rad*dy,psz+rad*dz,dx,dy,dz,len,s,b,0,0,false);
}else{
cx=pbx+sx*nw.x+sy*nh.x+sz*nd.x;
cy=pby+sx*nw.y+sy*nh.y+sz*nd.y;
cz=pbz+sx*nw.z+sy*nh.z+sz*nd.z;
dx=cx-ps.x;
dy=cy-ps.y;
dz=cz-ps.z;
len=dx*dx+dy*dy+dz*dz;
if(len>0&&len<rad*rad){
len=Math.sqrt(len);
invLen=1/len;
dx*=invLen;
dy*=invLen;
dz*=invLen;
result.addContactInfo(psx+rad*dx,psy+rad*dy,psz+rad*dz,dx,dy,dz,len,s,b,0,0,false);
}
}
},
];},[],["com.element.oimo.physics.collision.narrow.CollisionDetector","com.element.oimo.physics.collision.shape.SphereShape","com.element.oimo.physics.collision.shape.BoxShape","Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.narrow.SphereCylinderCollisionDetector
joo.classLoader.prepare("package com.element.oimo.physics.collision.narrow",
"public class SphereCylinderCollisionDetector extends com.element.oimo.physics.collision.narrow.CollisionDetector",2,function($$private){var as=joo.as;return[
"public function SphereCylinderCollisionDetector",function(flip){this.super$2();
this.flip=flip;
},
"override public function detectCollision",function(shape1,shape2,result){
var s;
var c;
if(this.flip){
s=as(shape2,com.element.oimo.physics.collision.shape.SphereShape);
c=as(shape1,com.element.oimo.physics.collision.shape.CylinderShape);
}else{
s=as(shape1,com.element.oimo.physics.collision.shape.SphereShape);
c=as(shape2,com.element.oimo.physics.collision.shape.CylinderShape);
}
var ps=s.position;
var psx=ps.x;
var psy=ps.y;
var psz=ps.z;
var pc=c.position;
var pcx=pc.x;
var pcy=pc.y;
var pcz=pc.z;
var dirx=c.normalDirection.x;
var diry=c.normalDirection.y;
var dirz=c.normalDirection.z;
var rads=s.radius;
var radc=c.radius;
var rad2=rads+radc;
var halfh=c.halfHeight;
var dx=psx-pcx;
var dy=psy-pcy;
var dz=psz-pcz;
var dot=dx*dirx+dy*diry+dz*dirz;
if(dot<-halfh-rads||dot>halfh+rads)return;
var cx=pcx+dot*dirx;
var cy=pcy+dot*diry;
var cz=pcz+dot*dirz;
var d2x=psx-cx;
var d2y=psy-cy;
var d2z=psz-cz;
var len=d2x*d2x+d2y*d2y+d2z*d2z;
if(len>rad2*rad2)return;
if(len>radc*radc){
len=radc/Math.sqrt(len);
d2x*=len;
d2y*=len;
d2z*=len;
}
if(dot<-halfh)dot=-halfh;
else if(dot>halfh)dot=halfh;
cx=pcx+dot*dirx+d2x;
cy=pcy+dot*diry+d2y;
cz=pcz+dot*dirz+d2z;
dx=cx-psx;
dy=cy-psy;
dz=cz-psz;
len=dx*dx+dy*dy+dz*dz;
var invLen;
if(len>0&&len<rads*rads){
len=Math.sqrt(len);
invLen=1/len;
dx*=invLen;
dy*=invLen;
dz*=invLen;
result.addContactInfo(psx+dx*rads,psy+dy*rads,psz+dz*rads,dx,dy,dz,len-rads,s,c,0,0,false);
}
},
];},[],["com.element.oimo.physics.collision.narrow.CollisionDetector","com.element.oimo.physics.collision.shape.SphereShape","com.element.oimo.physics.collision.shape.CylinderShape","Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.narrow.SphereSphereCollisionDetector
joo.classLoader.prepare("package com.element.oimo.physics.collision.narrow",
"public class SphereSphereCollisionDetector extends com.element.oimo.physics.collision.narrow.CollisionDetector",2,function($$private){var as=joo.as;return[
"public function SphereSphereCollisionDetector",function(){this.super$2();
},
"override public function detectCollision",function(shape1,shape2,result){
var s1=as(shape1,com.element.oimo.physics.collision.shape.SphereShape);
var s2=as(shape2,com.element.oimo.physics.collision.shape.SphereShape);
var p1=s1.position;
var p2=s2.position;
var dx=p2.x-p1.x;
var dy=p2.y-p1.y;
var dz=p2.z-p1.z;
var len=dx*dx+dy*dy+dz*dz;
var r1=s1.radius;
var r2=s2.radius;
var rad=r1+r2;
if(len>0&&len<rad*rad){
len=Math.sqrt(len);
var invLen=1/len;
dx*=invLen;
dy*=invLen;
dz*=invLen;
result.addContactInfo(p1.x+dx*r1,p1.y+dy*r1,p1.z+dz*r1,dx,dy,dz,len-rad,s1,s2,0,0,false);
}
},
];},[],["com.element.oimo.physics.collision.narrow.CollisionDetector","com.element.oimo.physics.collision.shape.SphereShape","Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.shape.BoxShape
joo.classLoader.prepare("package com.element.oimo.physics.collision.shape",
"public class BoxShape extends com.element.oimo.physics.collision.shape.Shape",2,function($$private){;return[
"public var",{width:NaN},
"public var",{halfWidth:NaN},
"public var",{height:NaN},
"public var",{halfHeight:NaN},
"public var",{depth:NaN},
"public var",{halfDepth:NaN},
"public var",{normalDirectionWidth:null},
"public var",{normalDirectionHeight:null},
"public var",{normalDirectionDepth:null},
"public var",{halfDirectionWidth:null},
"public var",{halfDirectionHeight:null},
"public var",{halfDirectionDepth:null},
"public var",{vertex1:null},
"public var",{vertex2:null},
"public var",{vertex3:null},
"public var",{vertex4:null},
"public var",{vertex5:null},
"public var",{vertex6:null},
"public var",{vertex7:null},
"public var",{vertex8:null},
"public function BoxShape",function(width,height,depth,config){this.super$2();
this.width=width;
this.halfWidth=width*0.5;
this.height=height;
this.halfHeight=height*0.5;
this.depth=depth;
this.halfDepth=depth*0.5;
this.position.copy(config.position);
this.rotation.copy(config.rotation);
this.friction=config.friction;
this.restitution=config.restitution;
this.mass=width*height*depth*config.density;
var inertia=this.mass/12;
this.localInertia.init(
inertia*(height*height+depth*depth),0,0,
0,inertia*(width*width+depth*depth),0,
0,0,inertia*(width*width+height*height)
);
this.normalDirectionWidth=new com.element.oimo.math.Vec3();
this.normalDirectionHeight=new com.element.oimo.math.Vec3();
this.normalDirectionDepth=new com.element.oimo.math.Vec3();
this.halfDirectionWidth=new com.element.oimo.math.Vec3();
this.halfDirectionHeight=new com.element.oimo.math.Vec3();
this.halfDirectionDepth=new com.element.oimo.math.Vec3();
this.vertex1=new com.element.oimo.math.Vec3();
this.vertex2=new com.element.oimo.math.Vec3();
this.vertex3=new com.element.oimo.math.Vec3();
this.vertex4=new com.element.oimo.math.Vec3();
this.vertex5=new com.element.oimo.math.Vec3();
this.vertex6=new com.element.oimo.math.Vec3();
this.vertex7=new com.element.oimo.math.Vec3();
this.vertex8=new com.element.oimo.math.Vec3();
this.type=com.element.oimo.physics.collision.shape.Shape.SHAPE_BOX;
},
"override public function updateProxy",function(){
this.normalDirectionWidth.x=this.rotation.e00;
this.normalDirectionWidth.y=this.rotation.e10;
this.normalDirectionWidth.z=this.rotation.e20;
this.normalDirectionHeight.x=this.rotation.e01;
this.normalDirectionHeight.y=this.rotation.e11;
this.normalDirectionHeight.z=this.rotation.e21;
this.normalDirectionDepth.x=this.rotation.e02;
this.normalDirectionDepth.y=this.rotation.e12;
this.normalDirectionDepth.z=this.rotation.e22;
this.halfDirectionWidth.x=this.rotation.e00*this.halfWidth;
this.halfDirectionWidth.y=this.rotation.e10*this.halfWidth;
this.halfDirectionWidth.z=this.rotation.e20*this.halfWidth;
this.halfDirectionHeight.x=this.rotation.e01*this.halfHeight;
this.halfDirectionHeight.y=this.rotation.e11*this.halfHeight;
this.halfDirectionHeight.z=this.rotation.e21*this.halfHeight;
this.halfDirectionDepth.x=this.rotation.e02*this.halfDepth;
this.halfDirectionDepth.y=this.rotation.e12*this.halfDepth;
this.halfDirectionDepth.z=this.rotation.e22*this.halfDepth;
var wx=this.halfDirectionWidth.x;
var wy=this.halfDirectionWidth.y;
var wz=this.halfDirectionWidth.z;
var hx=this.halfDirectionHeight.x;
var hy=this.halfDirectionHeight.y;
var hz=this.halfDirectionHeight.z;
var dx=this.halfDirectionDepth.x;
var dy=this.halfDirectionDepth.y;
var dz=this.halfDirectionDepth.z;
var x=this.position.x;
var y=this.position.y;
var z=this.position.z;
this.vertex1.x=x+wx+hx+dx;
this.vertex1.y=y+wy+hy+dy;
this.vertex1.z=z+wz+hz+dz;
this.vertex2.x=x+wx+hx-dx;
this.vertex2.y=y+wy+hy-dy;
this.vertex2.z=z+wz+hz-dz;
this.vertex3.x=x+wx-hx+dx;
this.vertex3.y=y+wy-hy+dy;
this.vertex3.z=z+wz-hz+dz;
this.vertex4.x=x+wx-hx-dx;
this.vertex4.y=y+wy-hy-dy;
this.vertex4.z=z+wz-hz-dz;
this.vertex5.x=x-wx+hx+dx;
this.vertex5.y=y-wy+hy+dy;
this.vertex5.z=z-wz+hz+dz;
this.vertex6.x=x-wx+hx-dx;
this.vertex6.y=y-wy+hy-dy;
this.vertex6.z=z-wz+hz-dz;
this.vertex7.x=x-wx-hx+dx;
this.vertex7.y=y-wy-hy+dy;
this.vertex7.z=z-wz-hz+dz;
this.vertex8.x=x-wx-hx-dx;
this.vertex8.y=y-wy-hy-dy;
this.vertex8.z=z-wz-hz-dz;
var w;
var h;
var d;
if(this.halfDirectionWidth.x<0){
w=-this.halfDirectionWidth.x;
}else{
w=this.halfDirectionWidth.x;
}
if(this.halfDirectionWidth.y<0){
h=-this.halfDirectionWidth.y;
}else{
h=this.halfDirectionWidth.y;
}
if(this.halfDirectionWidth.z<0){
d=-this.halfDirectionWidth.z;
}else{
d=this.halfDirectionWidth.z;
}
if(this.halfDirectionHeight.x<0){
w-=this.halfDirectionHeight.x;
}else{
w+=this.halfDirectionHeight.x;
}
if(this.halfDirectionHeight.y<0){
h-=this.halfDirectionHeight.y;
}else{
h+=this.halfDirectionHeight.y;
}
if(this.halfDirectionHeight.z<0){
d-=this.halfDirectionHeight.z;
}else{
d+=this.halfDirectionHeight.z;
}
if(this.halfDirectionDepth.x<0){
w-=this.halfDirectionDepth.x;
}else{
w+=this.halfDirectionDepth.x;
}
if(this.halfDirectionDepth.y<0){
h-=this.halfDirectionDepth.y;
}else{
h+=this.halfDirectionDepth.y;
}
if(this.halfDirectionDepth.z<0){
d-=this.halfDirectionDepth.z;
}else{
d+=this.halfDirectionDepth.z;
}
this.proxy.init(
this.position.x-w,this.position.x+w,
this.position.y-h,this.position.y+h,
this.position.z-d,this.position.z+d
);
},
];},[],["com.element.oimo.physics.collision.shape.Shape","com.element.oimo.math.Vec3"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.shape.CylinderShape
joo.classLoader.prepare("package com.element.oimo.physics.collision.shape",
"public class CylinderShape extends com.element.oimo.physics.collision.shape.Shape",2,function($$private){;return[function(){joo.classLoader.init(Math);},
"public var",{radius:NaN},
"public var",{height:NaN},
"public var",{halfHeight:NaN},
"public var",{normalDirection:null},
"public var",{halfDirection:null},
"public function CylinderShape",function(radius,height,config){this.super$2();
this.radius=radius;
this.height=height;
this.halfHeight=height*0.5;
this.position.copy(config.position);
this.rotation.copy(config.rotation);
this.friction=config.friction;
this.restitution=config.restitution;
this.mass=Math.PI*radius*radius*height*config.density;
var inertiaXZ=(1/4*radius*radius+1/12*height*height)*this.mass;
var inertiaY=1/2*radius*radius;
this.localInertia.init(
inertiaXZ,0,0,
0,inertiaY,0,
0,0,inertiaXZ
);
this.normalDirection=new com.element.oimo.math.Vec3();
this.halfDirection=new com.element.oimo.math.Vec3();
this.type=com.element.oimo.physics.collision.shape.Shape.SHAPE_CYLINDER;
},
"override public function updateProxy",function(){
var len;
var wx;
var hy;
var dz;
var dirX=this.rotation.e01;
var dirY=this.rotation.e11;
var dirZ=this.rotation.e21;
var xx=dirX*dirX;
var yy=dirY*dirY;
var zz=dirZ*dirZ;
this.normalDirection.x=dirX;
this.normalDirection.y=dirY;
this.normalDirection.z=dirZ;
this.halfDirection.x=dirX*this.halfHeight;
this.halfDirection.y=dirY*this.halfHeight;
this.halfDirection.z=dirZ*this.halfHeight;
wx=1-dirX*dirX;
len=Math.sqrt(wx*wx+xx*yy+xx*zz);
if(len>0)len=this.radius/len;
wx*=len;
hy=1-dirY*dirY;
len=Math.sqrt(yy*xx+hy*hy+yy*zz);
if(len>0)len=this.radius/len;
hy*=len;
dz=1-dirZ*dirZ;
len=Math.sqrt(zz*xx+zz*yy+dz*dz);
if(len>0)len=this.radius/len;
dz*=len;
var w;
var h;
var d;
if(this.halfDirection.x<0)w=-this.halfDirection.x;
else w=this.halfDirection.x;
if(this.halfDirection.y<0)h=-this.halfDirection.y;
else h=this.halfDirection.y;
if(this.halfDirection.z<0)d=-this.halfDirection.z;
else d=this.halfDirection.z;
if(wx<0)w-=wx;
else w+=wx;
if(hy<0)h-=hy;
else h+=hy;
if(dz<0)d-=dz;
else d+=dz;
this.proxy.init(
this.position.x-w,this.position.x+w,
this.position.y-h,this.position.y+h,
this.position.z-d,this.position.z+d
);
},
];},[],["com.element.oimo.physics.collision.shape.Shape","Math","com.element.oimo.math.Vec3"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.shape.Shape
joo.classLoader.prepare("package com.element.oimo.physics.collision.shape",
"public class Shape",1,function($$private){;return[
"public static var",{nextID:0},
"public static const",{SHAPE_NULL:0x0},
"public static const",{SHAPE_SPHERE:0x1},
"public static const",{SHAPE_BOX:0x2},
"public static const",{SHAPE_CYLINDER:0x3},
"public var",{id:0},
"public var",{type:0},
"public var",{position:null},
"public var",{relativePosition:null},
"public var",{localRelativePosition:null},
"public var",{rotation:null},
"public var",{relativeRotation:null},
"public var",{mass:NaN},
"public var",{localInertia:null},
"public var",{proxy:null},
"public var",{friction:NaN},
"public var",{restitution:NaN},
"public var",{parent:null},
"public var",{contactList:null},
"public var",{numContacts:0},
"public function Shape",function(){
this.id=++com.element.oimo.physics.collision.shape.Shape.nextID;
this.position=new com.element.oimo.math.Vec3();
this.relativePosition=new com.element.oimo.math.Vec3();
this.localRelativePosition=new com.element.oimo.math.Vec3();
this.rotation=new com.element.oimo.math.Mat33();
this.relativeRotation=new com.element.oimo.math.Mat33();
this.localInertia=new com.element.oimo.math.Mat33();
this.proxy=new com.element.oimo.physics.collision.broad.Proxy();
this.proxy.parent=this;
},
"public function updateProxy",function(){
throw new Error("updateProxy Method is not inherited");
},
];},[],["com.element.oimo.math.Vec3","com.element.oimo.math.Mat33","com.element.oimo.physics.collision.broad.Proxy","Error"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.shape.ShapeConfig
joo.classLoader.prepare("package com.element.oimo.physics.collision.shape",
"public class ShapeConfig",1,function($$private){;return[
"public var",{position:null},
"public var",{rotation:null},
"public var",{friction:NaN},
"public var",{restitution:NaN},
"public var",{density:NaN},
"public function ShapeConfig",function(){
this.position=new com.element.oimo.math.Vec3();
this.rotation=new com.element.oimo.math.Mat33();
this.friction=0.5;
this.restitution=0.5;
this.density=1;
},
];},[],["com.element.oimo.math.Vec3","com.element.oimo.math.Mat33"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.collision.shape.SphereShape
joo.classLoader.prepare("package com.element.oimo.physics.collision.shape",
"public class SphereShape extends com.element.oimo.physics.collision.shape.Shape",2,function($$private){;return[function(){joo.classLoader.init(Math);},
"public var",{radius:NaN},
"public function SphereShape",function(radius,config){this.super$2();
this.radius=radius;
this.position.copy(config.position);
this.rotation.copy(config.rotation);
this.friction=config.friction;
this.restitution=config.restitution;
this.mass=4/3*Math.PI*radius*radius*radius*config.density;
var inertia=2/5*radius*radius*this.mass;
this.localInertia.init(
inertia,0,0,
0,inertia,0,
0,0,inertia
);
this.type=com.element.oimo.physics.collision.shape.Shape.SHAPE_SPHERE;
},
"override public function updateProxy",function(){
this.proxy.init(
this.position.x-this.radius,this.position.x+this.radius,
this.position.y-this.radius,this.position.y+this.radius,
this.position.z-this.radius,this.position.z+this.radius
);
},
];},[],["com.element.oimo.physics.collision.shape.Shape","Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.constraint.Constraint
joo.classLoader.prepare("package com.element.oimo.physics.constraint",
"public class Constraint",1,function($$private){;return[
"public var",{parent:null},
"public var",{body1:null},
"public var",{body2:null},
"public var",{addedToIsland:false},
"public var",{sleeping:false},
"public function Constraint",function(){
},
"public function preSolve",function(timeStep,invTimeStep){
throw new Error("preSolve Method is not inherited");
},
"public function solve",function(){
throw new Error("solve Method is not inherited");
},
"public function postSolve",function(){
throw new Error("postSolve Method is not inherited");
},
];},[],["Error"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.constraint.contact.Contact
joo.classLoader.prepare(
"package com.element.oimo.physics.constraint.contact",
"public class Contact extends com.element.oimo.physics.constraint.Constraint",2,function($$private){;return[
"public var",{position:null},
"public var",{relativePosition1:null},
"public var",{relativePosition2:null},
"public var",{normal:null},
"public var",{tangent:null},
"public var",{binormal:null},
"public var",{overlap:NaN},
"public var",{normalImpulse:NaN},
"public var",{tangentImpulse:NaN},
"public var",{normalDenominator:NaN},
"public var",{tangentDenominator:NaN},
"public var",{binormalDenominator:NaN},
"public var",{binormalImpulse:NaN},
"public var",{shape1:null},
"public var",{shape2:null},
"public var",{shapeConnection1:null},
"public var",{shapeConnection2:null},
"public var",{bodyConnection1:null},
"public var",{bodyConnection2:null},
"public var",{id:null},
"public var",{warmStarted:false},
"private var",{lVel1:null},
"private var",{lVel2:null},
"private var",{aVel1:null},
"private var",{aVel2:null},
"private var",{relPos1X:NaN},
"private var",{relPos1Y:NaN},
"private var",{relPos1Z:NaN},
"private var",{relPos2X:NaN},
"private var",{relPos2Y:NaN},
"private var",{relPos2Z:NaN},
"private var",{relVelX:NaN},
"private var",{relVelY:NaN},
"private var",{relVelZ:NaN},
"private var",{norX:NaN},
"private var",{norY:NaN},
"private var",{norZ:NaN},
"private var",{tanX:NaN},
"private var",{tanY:NaN},
"private var",{tanZ:NaN},
"private var",{binX:NaN},
"private var",{binY:NaN},
"private var",{binZ:NaN},
"private var",{norTorque1X:NaN},
"private var",{norTorque1Y:NaN},
"private var",{norTorque1Z:NaN},
"private var",{norTorque2X:NaN},
"private var",{norTorque2Y:NaN},
"private var",{norTorque2Z:NaN},
"private var",{tanTorque1X:NaN},
"private var",{tanTorque1Y:NaN},
"private var",{tanTorque1Z:NaN},
"private var",{tanTorque2X:NaN},
"private var",{tanTorque2Y:NaN},
"private var",{tanTorque2Z:NaN},
"private var",{binTorque1X:NaN},
"private var",{binTorque1Y:NaN},
"private var",{binTorque1Z:NaN},
"private var",{binTorque2X:NaN},
"private var",{binTorque2Y:NaN},
"private var",{binTorque2Z:NaN},
"private var",{norTorqueUnit1X:NaN},
"private var",{norTorqueUnit1Y:NaN},
"private var",{norTorqueUnit1Z:NaN},
"private var",{norTorqueUnit2X:NaN},
"private var",{norTorqueUnit2Y:NaN},
"private var",{norTorqueUnit2Z:NaN},
"private var",{tanTorqueUnit1X:NaN},
"private var",{tanTorqueUnit1Y:NaN},
"private var",{tanTorqueUnit1Z:NaN},
"private var",{tanTorqueUnit2X:NaN},
"private var",{tanTorqueUnit2Y:NaN},
"private var",{tanTorqueUnit2Z:NaN},
"private var",{binTorqueUnit1X:NaN},
"private var",{binTorqueUnit1Y:NaN},
"private var",{binTorqueUnit1Z:NaN},
"private var",{binTorqueUnit2X:NaN},
"private var",{binTorqueUnit2Y:NaN},
"private var",{binTorqueUnit2Z:NaN},
"private var",{invM1:NaN},
"private var",{invM2:NaN},
"private var",{invI1e00:NaN},
"private var",{invI1e01:NaN},
"private var",{invI1e02:NaN},
"private var",{invI1e10:NaN},
"private var",{invI1e11:NaN},
"private var",{invI1e12:NaN},
"private var",{invI1e20:NaN},
"private var",{invI1e21:NaN},
"private var",{invI1e22:NaN},
"private var",{invI2e00:NaN},
"private var",{invI2e01:NaN},
"private var",{invI2e02:NaN},
"private var",{invI2e10:NaN},
"private var",{invI2e11:NaN},
"private var",{invI2e12:NaN},
"private var",{invI2e20:NaN},
"private var",{invI2e21:NaN},
"private var",{invI2e22:NaN},
"private var",{targetNormalVelocity:NaN},
"private var",{targetSeparateVelocity:NaN},
"private var",{friction:NaN},
"private var",{restitution:NaN},
"public function Contact",function(){this.super$2();
this.position=new com.element.oimo.math.Vec3();
this.relativePosition1=new com.element.oimo.math.Vec3();
this.relativePosition2=new com.element.oimo.math.Vec3();
this.normal=new com.element.oimo.math.Vec3();
this.tangent=new com.element.oimo.math.Vec3();
this.binormal=new com.element.oimo.math.Vec3();
this.shapeConnection1=new com.element.oimo.physics.constraint.contact.ContactConnection(this);
this.shapeConnection2=new com.element.oimo.physics.constraint.contact.ContactConnection(this);
this.bodyConnection1=new com.element.oimo.physics.constraint.contact.ContactConnection(this);
this.bodyConnection2=new com.element.oimo.physics.constraint.contact.ContactConnection(this);
this.id=new com.element.oimo.physics.collision.narrow.ContactID();
this.normalImpulse=0;
this.tangentImpulse=0;
this.binormalImpulse=0;
},
"public function setupFromContactInfo",function(contactInfo){
this.position.x=contactInfo.position.x;
this.position.y=contactInfo.position.y;
this.position.z=contactInfo.position.z;
this.norX$2=contactInfo.normal.x;
this.norY$2=contactInfo.normal.y;
this.norZ$2=contactInfo.normal.z;
this.overlap=contactInfo.overlap;
this.shape1=contactInfo.shape1;
this.shape2=contactInfo.shape2;
this.body1=this.shape1.parent;
this.body2=this.shape2.parent;
this.bodyConnection1.connectedBody=this.body2;
this.bodyConnection1.connectedShape=this.shape2;
this.shapeConnection1.connectedBody=this.body2;
this.shapeConnection1.connectedShape=this.shape2;
this.bodyConnection2.connectedBody=this.body1;
this.bodyConnection2.connectedShape=this.shape1;
this.shapeConnection2.connectedBody=this.body1;
this.shapeConnection2.connectedShape=this.shape1;
this.relPos1X$2=this.position.x-this.body1.position.x;
this.relPos1Y$2=this.position.y-this.body1.position.y;
this.relPos1Z$2=this.position.z-this.body1.position.z;
this.relPos2X$2=this.position.x-this.body2.position.x;
this.relPos2Y$2=this.position.y-this.body2.position.y;
this.relPos2Z$2=this.position.z-this.body2.position.z;
this.lVel1$2=this.body1.linearVelocity;
this.lVel2$2=this.body2.linearVelocity;
this.aVel1$2=this.body1.angularVelocity;
this.aVel2$2=this.body2.angularVelocity;
this.invM1$2=this.body1.invertMass;
this.invM2$2=this.body2.invertMass;
var tmpI;
tmpI=this.body1.invertInertia;
this.invI1e00$2=tmpI.e00;
this.invI1e01$2=tmpI.e01;
this.invI1e02$2=tmpI.e02;
this.invI1e10$2=tmpI.e10;
this.invI1e11$2=tmpI.e11;
this.invI1e12$2=tmpI.e12;
this.invI1e20$2=tmpI.e20;
this.invI1e21$2=tmpI.e21;
this.invI1e22$2=tmpI.e22;
tmpI=this.body2.invertInertia;
this.invI2e00$2=tmpI.e00;
this.invI2e01$2=tmpI.e01;
this.invI2e02$2=tmpI.e02;
this.invI2e10$2=tmpI.e10;
this.invI2e11$2=tmpI.e11;
this.invI2e12$2=tmpI.e12;
this.invI2e20$2=tmpI.e20;
this.invI2e21$2=tmpI.e21;
this.invI2e22$2=tmpI.e22;
this.id.data1=contactInfo.id.data1;
this.id.data2=contactInfo.id.data2;
this.id.flip=contactInfo.id.flip;
this.friction$2=this.shape1.friction*this.shape2.friction;
this.restitution$2=this.shape1.restitution*this.shape2.restitution;
this.overlap=contactInfo.overlap;
this.normalImpulse=0;
this.tangentImpulse=0;
this.binormalImpulse=0;
this.warmStarted=false;
},
"public function removeReferences",function(){
this.shape1=null;
this.shape2=null;
this.body1=null;
this.body2=null;
this.bodyConnection1.connectedBody=null;
this.bodyConnection1.connectedShape=null;
this.shapeConnection1.connectedBody=null;
this.shapeConnection1.connectedShape=null;
this.bodyConnection2.connectedBody=null;
this.bodyConnection2.connectedShape=null;
this.shapeConnection2.connectedBody=null;
this.shapeConnection2.connectedShape=null;
},
"override public function preSolve",function(timeStep,invTimeStep){
this.relVelX$2=(this.lVel2$2.x+this.aVel2$2.y*this.relPos2Z$2-this.aVel2$2.z*this.relPos2Y$2)-(this.lVel1$2.x+this.aVel1$2.y*this.relPos1Z$2-this.aVel1$2.z*this.relPos1Y$2);
this.relVelY$2=(this.lVel2$2.y+this.aVel2$2.z*this.relPos2X$2-this.aVel2$2.x*this.relPos2Z$2)-(this.lVel1$2.y+this.aVel1$2.z*this.relPos1X$2-this.aVel1$2.x*this.relPos1Z$2);
this.relVelZ$2=(this.lVel2$2.z+this.aVel2$2.x*this.relPos2Y$2-this.aVel2$2.y*this.relPos2X$2)-(this.lVel1$2.z+this.aVel1$2.x*this.relPos1Y$2-this.aVel1$2.y*this.relPos1X$2);
var rvn=this.norX$2*this.relVelX$2+this.norY$2*this.relVelY$2+this.norZ$2*this.relVelZ$2;
this.tanX$2=this.relVelX$2-rvn*this.norX$2;
this.tanY$2=this.relVelY$2-rvn*this.norY$2;
this.tanZ$2=this.relVelZ$2-rvn*this.norZ$2;
var len=this.tanX$2*this.tanX$2+this.tanY$2*this.tanY$2+this.tanZ$2*this.tanZ$2;
if(len>1e-2){
len=1/Math.sqrt(len);
}else{
this.tanX$2=this.norY$2*this.norX$2-this.norZ$2*this.norZ$2;
this.tanY$2=-this.norZ$2*this.norY$2-this.norX$2*this.norX$2;
this.tanZ$2=this.norX$2*this.norZ$2+this.norY$2*this.norY$2;
len=1/Math.sqrt(this.tanX$2*this.tanX$2+this.tanY$2*this.tanY$2+this.tanZ$2*this.tanZ$2);
}
this.tanX$2*=len;
this.tanY$2*=len;
this.tanZ$2*=len;
this.binX$2=this.norY$2*this.tanZ$2-this.norZ$2*this.tanY$2;
this.binY$2=this.norZ$2*this.tanX$2-this.norX$2*this.tanZ$2;
this.binZ$2=this.norX$2*this.tanY$2-this.norY$2*this.tanX$2;
this.norTorque1X$2=this.relPos1Y$2*this.norZ$2-this.relPos1Z$2*this.norY$2;
this.norTorque1Y$2=this.relPos1Z$2*this.norX$2-this.relPos1X$2*this.norZ$2;
this.norTorque1Z$2=this.relPos1X$2*this.norY$2-this.relPos1Y$2*this.norX$2;
this.norTorque2X$2=this.relPos2Y$2*this.norZ$2-this.relPos2Z$2*this.norY$2;
this.norTorque2Y$2=this.relPos2Z$2*this.norX$2-this.relPos2X$2*this.norZ$2;
this.norTorque2Z$2=this.relPos2X$2*this.norY$2-this.relPos2Y$2*this.norX$2;
this.tanTorque1X$2=this.relPos1Y$2*this.tanZ$2-this.relPos1Z$2*this.tanY$2;
this.tanTorque1Y$2=this.relPos1Z$2*this.tanX$2-this.relPos1X$2*this.tanZ$2;
this.tanTorque1Z$2=this.relPos1X$2*this.tanY$2-this.relPos1Y$2*this.tanX$2;
this.tanTorque2X$2=this.relPos2Y$2*this.tanZ$2-this.relPos2Z$2*this.tanY$2;
this.tanTorque2Y$2=this.relPos2Z$2*this.tanX$2-this.relPos2X$2*this.tanZ$2;
this.tanTorque2Z$2=this.relPos2X$2*this.tanY$2-this.relPos2Y$2*this.tanX$2;
this.binTorque1X$2=this.relPos1Y$2*this.binZ$2-this.relPos1Z$2*this.binY$2;
this.binTorque1Y$2=this.relPos1Z$2*this.binX$2-this.relPos1X$2*this.binZ$2;
this.binTorque1Z$2=this.relPos1X$2*this.binY$2-this.relPos1Y$2*this.binX$2;
this.binTorque2X$2=this.relPos2Y$2*this.binZ$2-this.relPos2Z$2*this.binY$2;
this.binTorque2Y$2=this.relPos2Z$2*this.binX$2-this.relPos2X$2*this.binZ$2;
this.binTorque2Z$2=this.relPos2X$2*this.binY$2-this.relPos2Y$2*this.binX$2;
this.norTorqueUnit1X$2=this.norTorque1X$2*this.invI1e00$2+this.norTorque1Y$2*this.invI1e01$2+this.norTorque1Z$2*this.invI1e02$2;
this.norTorqueUnit1Y$2=this.norTorque1X$2*this.invI1e10$2+this.norTorque1Y$2*this.invI1e11$2+this.norTorque1Z$2*this.invI1e12$2;
this.norTorqueUnit1Z$2=this.norTorque1X$2*this.invI1e20$2+this.norTorque1Y$2*this.invI1e21$2+this.norTorque1Z$2*this.invI1e22$2;
this.norTorqueUnit2X$2=this.norTorque2X$2*this.invI2e00$2+this.norTorque2Y$2*this.invI2e01$2+this.norTorque2Z$2*this.invI2e02$2;
this.norTorqueUnit2Y$2=this.norTorque2X$2*this.invI2e10$2+this.norTorque2Y$2*this.invI2e11$2+this.norTorque2Z$2*this.invI2e12$2;
this.norTorqueUnit2Z$2=this.norTorque2X$2*this.invI2e20$2+this.norTorque2Y$2*this.invI2e21$2+this.norTorque2Z$2*this.invI2e22$2;
this.tanTorqueUnit1X$2=this.tanTorque1X$2*this.invI1e00$2+this.tanTorque1Y$2*this.invI1e01$2+this.tanTorque1Z$2*this.invI1e02$2;
this.tanTorqueUnit1Y$2=this.tanTorque1X$2*this.invI1e10$2+this.tanTorque1Y$2*this.invI1e11$2+this.tanTorque1Z$2*this.invI1e12$2;
this.tanTorqueUnit1Z$2=this.tanTorque1X$2*this.invI1e20$2+this.tanTorque1Y$2*this.invI1e21$2+this.tanTorque1Z$2*this.invI1e22$2;
this.tanTorqueUnit2X$2=this.tanTorque2X$2*this.invI2e00$2+this.tanTorque2Y$2*this.invI2e01$2+this.tanTorque2Z$2*this.invI2e02$2;
this.tanTorqueUnit2Y$2=this.tanTorque2X$2*this.invI2e10$2+this.tanTorque2Y$2*this.invI2e11$2+this.tanTorque2Z$2*this.invI2e12$2;
this.tanTorqueUnit2Z$2=this.tanTorque2X$2*this.invI2e20$2+this.tanTorque2Y$2*this.invI2e21$2+this.tanTorque2Z$2*this.invI2e22$2;
this.binTorqueUnit1X$2=this.binTorque1X$2*this.invI1e00$2+this.binTorque1Y$2*this.invI1e01$2+this.binTorque1Z$2*this.invI1e02$2;
this.binTorqueUnit1Y$2=this.binTorque1X$2*this.invI1e10$2+this.binTorque1Y$2*this.invI1e11$2+this.binTorque1Z$2*this.invI1e12$2;
this.binTorqueUnit1Z$2=this.binTorque1X$2*this.invI1e20$2+this.binTorque1Y$2*this.invI1e21$2+this.binTorque1Z$2*this.invI1e22$2;
this.binTorqueUnit2X$2=this.binTorque2X$2*this.invI2e00$2+this.binTorque2Y$2*this.invI2e01$2+this.binTorque2Z$2*this.invI2e02$2;
this.binTorqueUnit2Y$2=this.binTorque2X$2*this.invI2e10$2+this.binTorque2Y$2*this.invI2e11$2+this.binTorque2Z$2*this.invI2e12$2;
this.binTorqueUnit2Z$2=this.binTorque2X$2*this.invI2e20$2+this.binTorque2Y$2*this.invI2e21$2+this.binTorque2Z$2*this.invI2e22$2;
var tmp1X;
var tmp1Y;
var tmp1Z;
var tmp2X;
var tmp2Y;
var tmp2Z;
tmp1X=this.norTorque1X$2*this.invI1e00$2+this.norTorque1Y$2*this.invI1e01$2+this.norTorque1Z$2*this.invI1e02$2;
tmp1Y=this.norTorque1X$2*this.invI1e10$2+this.norTorque1Y$2*this.invI1e11$2+this.norTorque1Z$2*this.invI1e12$2;
tmp1Z=this.norTorque1X$2*this.invI1e20$2+this.norTorque1Y$2*this.invI1e21$2+this.norTorque1Z$2*this.invI1e22$2;
tmp2X=tmp1Y*this.relPos1Z$2-tmp1Z*this.relPos1Y$2;
tmp2Y=tmp1Z*this.relPos1X$2-tmp1X*this.relPos1Z$2;
tmp2Z=tmp1X*this.relPos1Y$2-tmp1Y*this.relPos1X$2;
tmp1X=this.norTorque2X$2*this.invI2e00$2+this.norTorque2Y$2*this.invI2e01$2+this.norTorque2Z$2*this.invI2e02$2;
tmp1Y=this.norTorque2X$2*this.invI2e10$2+this.norTorque2Y$2*this.invI2e11$2+this.norTorque2Z$2*this.invI2e12$2;
tmp1Z=this.norTorque2X$2*this.invI2e20$2+this.norTorque2Y$2*this.invI2e21$2+this.norTorque2Z$2*this.invI2e22$2;
tmp2X+=tmp1Y*this.relPos2Z$2-tmp1Z*this.relPos2Y$2;
tmp2Y+=tmp1Z*this.relPos2X$2-tmp1X*this.relPos2Z$2;
tmp2Z+=tmp1X*this.relPos2Y$2-tmp1Y*this.relPos2X$2;
this.normalDenominator=1/(this.invM1$2+this.invM2$2+this.norX$2*tmp2X+this.norY$2*tmp2Y+this.norZ$2*tmp2Z);
tmp1X=this.tanTorque1X$2*this.invI1e00$2+this.tanTorque1Y$2*this.invI1e01$2+this.tanTorque1Z$2*this.invI1e02$2;
tmp1Y=this.tanTorque1X$2*this.invI1e10$2+this.tanTorque1Y$2*this.invI1e11$2+this.tanTorque1Z$2*this.invI1e12$2;
tmp1Z=this.tanTorque1X$2*this.invI1e20$2+this.tanTorque1Y$2*this.invI1e21$2+this.tanTorque1Z$2*this.invI1e22$2;
tmp2X=tmp1Y*this.relPos1Z$2-tmp1Z*this.relPos1Y$2;
tmp2Y=tmp1Z*this.relPos1X$2-tmp1X*this.relPos1Z$2;
tmp2Z=tmp1X*this.relPos1Y$2-tmp1Y*this.relPos1X$2;
tmp1X=this.tanTorque2X$2*this.invI2e00$2+this.tanTorque2Y$2*this.invI2e01$2+this.tanTorque2Z$2*this.invI2e02$2;
tmp1Y=this.tanTorque2X$2*this.invI2e10$2+this.tanTorque2Y$2*this.invI2e11$2+this.tanTorque2Z$2*this.invI2e12$2;
tmp1Z=this.tanTorque2X$2*this.invI2e20$2+this.tanTorque2Y$2*this.invI2e21$2+this.tanTorque2Z$2*this.invI2e22$2;
tmp2X+=tmp1Y*this.relPos2Z$2-tmp1Z*this.relPos2Y$2;
tmp2Y+=tmp1Z*this.relPos2X$2-tmp1X*this.relPos2Z$2;
tmp2Z+=tmp1X*this.relPos2Y$2-tmp1Y*this.relPos2X$2;
this.tangentDenominator=1/(this.invM1$2+this.invM2$2+this.tanX$2*tmp2X+this.tanY$2*tmp2Y+this.tanZ$2*tmp2Z);
tmp1X=this.binTorque1X$2*this.invI1e00$2+this.binTorque1Y$2*this.invI1e01$2+this.binTorque1Z$2*this.invI1e02$2;
tmp1Y=this.binTorque1X$2*this.invI1e10$2+this.binTorque1Y$2*this.invI1e11$2+this.binTorque1Z$2*this.invI1e12$2;
tmp1Z=this.binTorque1X$2*this.invI1e20$2+this.binTorque1Y$2*this.invI1e21$2+this.binTorque1Z$2*this.invI1e22$2;
tmp2X=tmp1Y*this.relPos1Z$2-tmp1Z*this.relPos1Y$2;
tmp2Y=tmp1Z*this.relPos1X$2-tmp1X*this.relPos1Z$2;
tmp2Z=tmp1X*this.relPos1Y$2-tmp1Y*this.relPos1X$2;
tmp1X=this.binTorque2X$2*this.invI2e00$2+this.binTorque2Y$2*this.invI2e01$2+this.binTorque2Z$2*this.invI2e02$2;
tmp1Y=this.binTorque2X$2*this.invI2e10$2+this.binTorque2Y$2*this.invI2e11$2+this.binTorque2Z$2*this.invI2e12$2;
tmp1Z=this.binTorque2X$2*this.invI2e20$2+this.binTorque2Y$2*this.invI2e21$2+this.binTorque2Z$2*this.invI2e22$2;
tmp2X+=tmp1Y*this.relPos2Z$2-tmp1Z*this.relPos2Y$2;
tmp2Y+=tmp1Z*this.relPos2X$2-tmp1X*this.relPos2Z$2;
tmp2Z+=tmp1X*this.relPos2Y$2-tmp1Y*this.relPos2X$2;
this.binormalDenominator=1/(this.invM1$2+this.invM2$2+this.binX$2*tmp2X+this.binY$2*tmp2Y+this.binZ$2*tmp2Z);
if(this.warmStarted){
this.tangentImpulse*=0.95;
this.binormalImpulse*=0.95;
tmp1X=this.norX$2*this.normalImpulse+this.tanX$2*this.tangentImpulse+this.binX$2*this.binormalImpulse;
tmp1Y=this.norY$2*this.normalImpulse+this.tanY$2*this.tangentImpulse+this.binY$2*this.binormalImpulse;
tmp1Z=this.norZ$2*this.normalImpulse+this.tanZ$2*this.tangentImpulse+this.binZ$2*this.binormalImpulse;
this.lVel1$2.x+=tmp1X*this.invM1$2;
this.lVel1$2.y+=tmp1Y*this.invM1$2;
this.lVel1$2.z+=tmp1Z*this.invM1$2;
this.aVel1$2.x+=this.norTorqueUnit1X$2*this.normalImpulse+this.tanTorqueUnit1X$2*this.tangentImpulse+this.binTorqueUnit1X$2*this.binormalImpulse;
this.aVel1$2.y+=this.norTorqueUnit1Y$2*this.normalImpulse+this.tanTorqueUnit1Y$2*this.tangentImpulse+this.binTorqueUnit1Y$2*this.binormalImpulse;
this.aVel1$2.z+=this.norTorqueUnit1Z$2*this.normalImpulse+this.tanTorqueUnit1Z$2*this.tangentImpulse+this.binTorqueUnit1Z$2*this.binormalImpulse;
this.lVel2$2.x-=tmp1X*this.invM2$2;
this.lVel2$2.y-=tmp1Y*this.invM2$2;
this.lVel2$2.z-=tmp1Z*this.invM2$2;
this.aVel2$2.x-=this.norTorqueUnit2X$2*this.normalImpulse+this.tanTorqueUnit2X$2*this.tangentImpulse+this.binTorqueUnit2X$2*this.binormalImpulse;
this.aVel2$2.y-=this.norTorqueUnit2Y$2*this.normalImpulse+this.tanTorqueUnit2Y$2*this.tangentImpulse+this.binTorqueUnit2Y$2*this.binormalImpulse;
this.aVel2$2.z-=this.norTorqueUnit2Z$2*this.normalImpulse+this.tanTorqueUnit2Z$2*this.tangentImpulse+this.binTorqueUnit2Z$2*this.binormalImpulse;
rvn=0;
}
if(rvn>-1){
rvn=0;
}
this.targetNormalVelocity$2=this.restitution$2*-rvn;
var separationalVelocity=-this.overlap-0.005;
if(separationalVelocity>0){
separationalVelocity*=invTimeStep*0.05;
if(this.targetNormalVelocity$2<separationalVelocity){
this.targetNormalVelocity$2=separationalVelocity;
}
}
},
"override public function solve",function(){
var error;
var oldImpulse1;
var newImpulse1;
var oldImpulse2;
var newImpulse2;
var rvn;
var forceX;
var forceY;
var forceZ;
var tmpX;
var tmpY;
var tmpZ;
rvn=
(this.lVel2$2.x-this.lVel1$2.x)*this.norX$2+(this.lVel2$2.y-this.lVel1$2.y)*this.norY$2+(this.lVel2$2.z-this.lVel1$2.z)*this.norZ$2+
this.aVel2$2.x*this.norTorque2X$2+this.aVel2$2.y*this.norTorque2Y$2+this.aVel2$2.z*this.norTorque2Z$2-
this.aVel1$2.x*this.norTorque1X$2-this.aVel1$2.y*this.norTorque1Y$2-this.aVel1$2.z*this.norTorque1Z$2
;
oldImpulse1=this.normalImpulse;
newImpulse1=(rvn-this.targetNormalVelocity$2)*this.normalDenominator*1.4;
this.normalImpulse+=newImpulse1;
if(this.normalImpulse>0)this.normalImpulse=0;
newImpulse1=this.normalImpulse-oldImpulse1;
forceX=this.norX$2*newImpulse1;
forceY=this.norY$2*newImpulse1;
forceZ=this.norZ$2*newImpulse1;
this.lVel1$2.x+=forceX*this.invM1$2;
this.lVel1$2.y+=forceY*this.invM1$2;
this.lVel1$2.z+=forceZ*this.invM1$2;
this.aVel1$2.x+=this.norTorqueUnit1X$2*newImpulse1;
this.aVel1$2.y+=this.norTorqueUnit1Y$2*newImpulse1;
this.aVel1$2.z+=this.norTorqueUnit1Z$2*newImpulse1;
this.lVel2$2.x-=forceX*this.invM2$2;
this.lVel2$2.y-=forceY*this.invM2$2;
this.lVel2$2.z-=forceZ*this.invM2$2;
this.aVel2$2.x-=this.norTorqueUnit2X$2*newImpulse1;
this.aVel2$2.y-=this.norTorqueUnit2Y$2*newImpulse1;
this.aVel2$2.z-=this.norTorqueUnit2Z$2*newImpulse1;
var max=-this.normalImpulse*this.friction$2;
this.relVelX$2=this.lVel2$2.x-this.lVel1$2.x;
this.relVelY$2=this.lVel2$2.y-this.lVel1$2.y;
this.relVelZ$2=this.lVel2$2.z-this.lVel1$2.z;
rvn=
this.relVelX$2*this.tanX$2+this.relVelY$2*this.tanY$2+this.relVelZ$2*this.tanZ$2+
this.aVel2$2.x*this.tanTorque2X$2+this.aVel2$2.y*this.tanTorque2Y$2+this.aVel2$2.z*this.tanTorque2Z$2-
this.aVel1$2.x*this.tanTorque1X$2-this.aVel1$2.y*this.tanTorque1Y$2-this.aVel1$2.z*this.tanTorque1Z$2
;
oldImpulse1=this.tangentImpulse;
newImpulse1=rvn*this.tangentDenominator;
this.tangentImpulse+=newImpulse1;
rvn=
this.relVelX$2*this.binX$2+this.relVelY$2*this.binY$2+this.relVelZ$2*this.binZ$2+
this.aVel2$2.x*this.binTorque2X$2+this.aVel2$2.y*this.binTorque2Y$2+this.aVel2$2.z*this.binTorque2Z$2-
this.aVel1$2.x*this.binTorque1X$2-this.aVel1$2.y*this.binTorque1Y$2-this.aVel1$2.z*this.binTorque1Z$2
;
oldImpulse2=this.binormalImpulse;
newImpulse2=rvn*this.binormalDenominator;
this.binormalImpulse+=newImpulse2;
var len=this.tangentImpulse*this.tangentImpulse+this.binormalImpulse*this.binormalImpulse;
if(len>max*max){
len=max/Math.sqrt(len);
this.tangentImpulse*=len;
this.binormalImpulse*=len;
}
newImpulse1=this.tangentImpulse-oldImpulse1;
newImpulse2=this.binormalImpulse-oldImpulse2;
forceX=this.tanX$2*newImpulse1+this.binX$2*newImpulse2;
forceY=this.tanY$2*newImpulse1+this.binY$2*newImpulse2;
forceZ=this.tanZ$2*newImpulse1+this.binZ$2*newImpulse2;
this.lVel1$2.x+=forceX*this.invM1$2;
this.lVel1$2.y+=forceY*this.invM1$2;
this.lVel1$2.z+=forceZ*this.invM1$2;
this.aVel1$2.x+=this.tanTorqueUnit1X$2*newImpulse1+this.binTorqueUnit1X$2*newImpulse2;
this.aVel1$2.y+=this.tanTorqueUnit1Y$2*newImpulse1+this.binTorqueUnit1Y$2*newImpulse2;
this.aVel1$2.z+=this.tanTorqueUnit1Z$2*newImpulse1+this.binTorqueUnit1Z$2*newImpulse2;
this.lVel2$2.x-=forceX*this.invM2$2;
this.lVel2$2.y-=forceY*this.invM2$2;
this.lVel2$2.z-=forceZ*this.invM2$2;
this.aVel2$2.x-=this.tanTorqueUnit2X$2*newImpulse1+this.binTorqueUnit2X$2*newImpulse2;
this.aVel2$2.y-=this.tanTorqueUnit2Y$2*newImpulse1+this.binTorqueUnit2Y$2*newImpulse2;
this.aVel2$2.z-=this.tanTorqueUnit2Z$2*newImpulse1+this.binTorqueUnit2Z$2*newImpulse2;
},
"override public function postSolve",function(){
this.relativePosition1.x=this.relPos1X$2;
this.relativePosition1.y=this.relPos1Y$2;
this.relativePosition1.z=this.relPos1Z$2;
this.relativePosition2.x=this.relPos2X$2;
this.relativePosition2.y=this.relPos2Y$2;
this.relativePosition2.z=this.relPos2Z$2;
this.normal.x=this.norX$2;
this.normal.y=this.norY$2;
this.normal.z=this.norZ$2;
this.tangent.x=this.tanX$2;
this.tangent.y=this.tanY$2;
this.tangent.z=this.tanZ$2;
this.binormal.x=this.binX$2;
this.binormal.y=this.binY$2;
this.binormal.z=this.binZ$2;
},
];},[],["com.element.oimo.physics.constraint.Constraint","com.element.oimo.math.Vec3","com.element.oimo.physics.constraint.contact.ContactConnection","com.element.oimo.physics.collision.narrow.ContactID","Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.constraint.contact.ContactConnection
joo.classLoader.prepare("package com.element.oimo.physics.constraint.contact",
"public class ContactConnection",1,function($$private){;return[
"public var",{prev:null},
"public var",{next:null},
"public var",{connectedShape:null},
"public var",{connectedBody:null},
"public var",{parent:null},
"public function ContactConnection",function(parent){
this.parent=parent;
},
];},[],[], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.constraint.joint.BallJoint
joo.classLoader.prepare(
"package com.element.oimo.physics.constraint.joint",
"public class BallJoint extends com.element.oimo.physics.constraint.joint.Joint",3,function($$private){;return[
"public var",{impulse:null},
"private var",{impulseX:NaN},
"private var",{impulseY:NaN},
"private var",{impulseZ:NaN},
"private var",{lVel1:null},
"private var",{lVel2:null},
"private var",{aVel1:null},
"private var",{aVel2:null},
"private var",{relPos1X:NaN},
"private var",{relPos1Y:NaN},
"private var",{relPos1Z:NaN},
"private var",{relPos2X:NaN},
"private var",{relPos2Y:NaN},
"private var",{relPos2Z:NaN},
"private var",{xTorqueUnit1X:NaN},
"private var",{xTorqueUnit1Y:NaN},
"private var",{xTorqueUnit1Z:NaN},
"private var",{xTorqueUnit2X:NaN},
"private var",{xTorqueUnit2Y:NaN},
"private var",{xTorqueUnit2Z:NaN},
"private var",{yTorqueUnit1X:NaN},
"private var",{yTorqueUnit1Y:NaN},
"private var",{yTorqueUnit1Z:NaN},
"private var",{yTorqueUnit2X:NaN},
"private var",{yTorqueUnit2Y:NaN},
"private var",{yTorqueUnit2Z:NaN},
"private var",{zTorqueUnit1X:NaN},
"private var",{zTorqueUnit1Y:NaN},
"private var",{zTorqueUnit1Z:NaN},
"private var",{zTorqueUnit2X:NaN},
"private var",{zTorqueUnit2Y:NaN},
"private var",{zTorqueUnit2Z:NaN},
"private var",{invM1:NaN},
"private var",{invM2:NaN},
"private var",{invI1e00:NaN},
"private var",{invI1e01:NaN},
"private var",{invI1e02:NaN},
"private var",{invI1e10:NaN},
"private var",{invI1e11:NaN},
"private var",{invI1e12:NaN},
"private var",{invI1e20:NaN},
"private var",{invI1e21:NaN},
"private var",{invI1e22:NaN},
"private var",{invI2e00:NaN},
"private var",{invI2e01:NaN},
"private var",{invI2e02:NaN},
"private var",{invI2e10:NaN},
"private var",{invI2e11:NaN},
"private var",{invI2e12:NaN},
"private var",{invI2e20:NaN},
"private var",{invI2e21:NaN},
"private var",{invI2e22:NaN},
"private var",{d00:NaN},
"private var",{d01:NaN},
"private var",{d02:NaN},
"private var",{d10:NaN},
"private var",{d11:NaN},
"private var",{d12:NaN},
"private var",{d20:NaN},
"private var",{d21:NaN},
"private var",{d22:NaN},
"private var",{targetVelX:NaN},
"private var",{targetVelY:NaN},
"private var",{targetVelZ:NaN},
"public function BallJoint",function(rigid1,rigid2,config){this.super$3();
this.body1=rigid1;
this.body2=rigid2;
this.connection1.connected=rigid2;
this.connection2.connected=rigid1;
this.allowCollision=config.allowCollision;
this.localRelativeAnchorPosition1.copy(config.localRelativeAnchorPosition1);
this.localRelativeAnchorPosition2.copy(config.localRelativeAnchorPosition2);
this.type=com.element.oimo.physics.constraint.joint.Joint.JOINT_BALL;
this.lVel1$3=this.body1.linearVelocity;
this.lVel2$3=this.body2.linearVelocity;
this.aVel1$3=this.body1.angularVelocity;
this.aVel2$3=this.body2.angularVelocity;
this.invM1$3=this.body1.invertMass;
this.invM2$3=this.body2.invertMass;
this.impulse=new com.element.oimo.math.Vec3();
this.impulseX$3=0;
this.impulseY$3=0;
this.impulseZ$3=0;
},
"override public function preSolve",function(timeStep,invTimeStep){
var tmpM;
var tmp1X;
var tmp1Y;
var tmp1Z;
var tmp2X;
var tmp2Y;
var tmp2Z;
var t00;
var t01;
var t02;
var t10;
var t11;
var t12;
var t20;
var t21;
var t22;
var u00;
var u01;
var u02;
var u10;
var u11;
var u12;
var u20;
var u21;
var u22;
tmpM=this.body1.rotation;
tmp1X=this.localRelativeAnchorPosition1.x;
tmp1Y=this.localRelativeAnchorPosition1.y;
tmp1Z=this.localRelativeAnchorPosition1.z;
this.relPos1X$3=this.relativeAnchorPosition1.x=tmp1X*tmpM.e00+tmp1Y*tmpM.e01+tmp1Z*tmpM.e02;
this.relPos1Y$3=this.relativeAnchorPosition1.y=tmp1X*tmpM.e10+tmp1Y*tmpM.e11+tmp1Z*tmpM.e12;
this.relPos1Z$3=this.relativeAnchorPosition1.z=tmp1X*tmpM.e20+tmp1Y*tmpM.e21+tmp1Z*tmpM.e22;
tmpM=this.body2.rotation;
tmp1X=this.localRelativeAnchorPosition2.x;
tmp1Y=this.localRelativeAnchorPosition2.y;
tmp1Z=this.localRelativeAnchorPosition2.z;
this.relPos2X$3=this.relativeAnchorPosition2.x=tmp1X*tmpM.e00+tmp1Y*tmpM.e01+tmp1Z*tmpM.e02;
this.relPos2Y$3=this.relativeAnchorPosition2.y=tmp1X*tmpM.e10+tmp1Y*tmpM.e11+tmp1Z*tmpM.e12;
this.relPos2Z$3=this.relativeAnchorPosition2.z=tmp1X*tmpM.e20+tmp1Y*tmpM.e21+tmp1Z*tmpM.e22;
this.anchorPosition1.x=this.relPos1X$3+this.body1.position.x;
this.anchorPosition1.y=this.relPos1Y$3+this.body1.position.y;
this.anchorPosition1.z=this.relPos1Z$3+this.body1.position.z;
this.anchorPosition2.x=this.relPos2X$3+this.body2.position.x;
this.anchorPosition2.y=this.relPos2Y$3+this.body2.position.y;
this.anchorPosition2.z=this.relPos2Z$3+this.body2.position.z;
tmpM=this.body1.invertInertia;
this.invI1e00$3=tmpM.e00;
this.invI1e01$3=tmpM.e01;
this.invI1e02$3=tmpM.e02;
this.invI1e10$3=tmpM.e10;
this.invI1e11$3=tmpM.e11;
this.invI1e12$3=tmpM.e12;
this.invI1e20$3=tmpM.e20;
this.invI1e21$3=tmpM.e21;
this.invI1e22$3=tmpM.e22;
tmpM=this.body2.invertInertia;
this.invI2e00$3=tmpM.e00;
this.invI2e01$3=tmpM.e01;
this.invI2e02$3=tmpM.e02;
this.invI2e10$3=tmpM.e10;
this.invI2e11$3=tmpM.e11;
this.invI2e12$3=tmpM.e12;
this.invI2e20$3=tmpM.e20;
this.invI2e21$3=tmpM.e21;
this.invI2e22$3=tmpM.e22;
this.xTorqueUnit1X$3=this.relPos1Z$3*this.invI1e01$3-this.relPos1Y$3*this.invI1e02$3;
this.xTorqueUnit1Y$3=this.relPos1Z$3*this.invI1e11$3-this.relPos1Y$3*this.invI1e12$3;
this.xTorqueUnit1Z$3=this.relPos1Z$3*this.invI1e21$3-this.relPos1Y$3*this.invI1e22$3;
this.xTorqueUnit2X$3=this.relPos2Z$3*this.invI2e01$3-this.relPos2Y$3*this.invI2e02$3;
this.xTorqueUnit2Y$3=this.relPos2Z$3*this.invI2e11$3-this.relPos2Y$3*this.invI2e12$3;
this.xTorqueUnit2Z$3=this.relPos2Z$3*this.invI2e21$3-this.relPos2Y$3*this.invI2e22$3;
this.yTorqueUnit1X$3=-this.relPos1Z$3*this.invI1e00$3+this.relPos1X$3*this.invI1e02$3;
this.yTorqueUnit1Y$3=-this.relPos1Z$3*this.invI1e10$3+this.relPos1X$3*this.invI1e12$3;
this.yTorqueUnit1Z$3=-this.relPos1Z$3*this.invI1e20$3+this.relPos1X$3*this.invI1e22$3;
this.yTorqueUnit2X$3=-this.relPos2Z$3*this.invI2e00$3+this.relPos2X$3*this.invI2e02$3;
this.yTorqueUnit2Y$3=-this.relPos2Z$3*this.invI2e10$3+this.relPos2X$3*this.invI2e12$3;
this.yTorqueUnit2Z$3=-this.relPos2Z$3*this.invI2e20$3+this.relPos2X$3*this.invI2e22$3;
this.zTorqueUnit1X$3=this.relPos1Y$3*this.invI1e00$3-this.relPos1X$3*this.invI1e01$3;
this.zTorqueUnit1Y$3=this.relPos1Y$3*this.invI1e10$3-this.relPos1X$3*this.invI1e11$3;
this.zTorqueUnit1Z$3=this.relPos1Y$3*this.invI1e20$3-this.relPos1X$3*this.invI1e21$3;
this.zTorqueUnit2X$3=this.relPos2Y$3*this.invI2e00$3-this.relPos2X$3*this.invI2e01$3;
this.zTorqueUnit2Y$3=this.relPos2Y$3*this.invI2e10$3-this.relPos2X$3*this.invI2e11$3;
this.zTorqueUnit2Z$3=this.relPos2Y$3*this.invI2e20$3-this.relPos2X$3*this.invI2e21$3;
this.d00$3=this.invM1$3+this.invM2$3;
this.d01$3=0;
this.d02$3=0;
this.d10$3=0;
this.d11$3=this.d00$3;
this.d12$3=0;
this.d20$3=0;
this.d21$3=0;
this.d22$3=this.d00$3;
t01=-this.relPos1Z$3;
t02=this.relPos1Y$3;
t10=this.relPos1Z$3;
t12=-this.relPos1X$3;
t20=-this.relPos1Y$3;
t21=this.relPos1X$3;
u00=this.invI1e01$3*t10+this.invI1e02$3*t20;
u01=this.invI1e00$3*t01+this.invI1e02$3*t21;
u02=this.invI1e00$3*t02+this.invI1e01$3*t12;
u10=this.invI1e11$3*t10+this.invI1e12$3*t20;
u11=this.invI1e10$3*t01+this.invI1e12$3*t21;
u12=this.invI1e10$3*t02+this.invI1e11$3*t12;
u20=this.invI1e21$3*t10+this.invI1e22$3*t20;
u21=this.invI1e20$3*t01+this.invI1e22$3*t21;
u22=this.invI1e20$3*t02+this.invI1e21$3*t12;
this.d00$3-=t01*u10+t02*u20;
this.d01$3-=t01*u11+t02*u21;
this.d02$3-=t01*u12+t02*u22;
this.d10$3-=t10*u00+t12*u20;
this.d11$3-=t10*u01+t12*u21;
this.d12$3-=t10*u02+t12*u22;
this.d20$3-=t20*u00+t21*u10;
this.d21$3-=t20*u01+t21*u11;
this.d22$3-=t20*u02+t21*u12;
t01=-this.relPos2Z$3;
t02=this.relPos2Y$3;
t10=this.relPos2Z$3;
t12=-this.relPos2X$3;
t20=-this.relPos2Y$3;
t21=this.relPos2X$3;
u00=this.invI2e01$3*t10+this.invI2e02$3*t20;
u01=this.invI2e00$3*t01+this.invI2e02$3*t21;
u02=this.invI2e00$3*t02+this.invI2e01$3*t12;
u10=this.invI2e11$3*t10+this.invI2e12$3*t20;
u11=this.invI2e10$3*t01+this.invI2e12$3*t21;
u12=this.invI2e10$3*t02+this.invI2e11$3*t12;
u20=this.invI2e21$3*t10+this.invI2e22$3*t20;
u21=this.invI2e20$3*t01+this.invI2e22$3*t21;
u22=this.invI2e20$3*t02+this.invI2e21$3*t12;
this.d00$3-=t01*u10+t02*u20;
this.d01$3-=t01*u11+t02*u21;
this.d02$3-=t01*u12+t02*u22;
this.d10$3-=t10*u00+t12*u20;
this.d11$3-=t10*u01+t12*u21;
this.d12$3-=t10*u02+t12*u22;
this.d20$3-=t20*u00+t21*u10;
this.d21$3-=t20*u01+t21*u11;
this.d22$3-=t20*u02+t21*u12;
tmp1X=1/(this.d00$3*(this.d11$3*this.d22$3-this.d21$3*this.d12$3)+this.d10$3*(this.d21$3*this.d02$3-this.d01$3*this.d22$3)+this.d20$3*(this.d01$3*this.d12$3-this.d11$3*this.d02$3));
t00=(this.d11$3*this.d22$3-this.d12$3*this.d21$3)*tmp1X;
t01=(this.d02$3*this.d21$3-this.d01$3*this.d22$3)*tmp1X;
t02=(this.d01$3*this.d12$3-this.d02$3*this.d11$3)*tmp1X;
t10=(this.d12$3*this.d20$3-this.d10$3*this.d22$3)*tmp1X;
t11=(this.d00$3*this.d22$3-this.d02$3*this.d20$3)*tmp1X;
t12=(this.d02$3*this.d10$3-this.d00$3*this.d12$3)*tmp1X;
t20=(this.d10$3*this.d21$3-this.d11$3*this.d20$3)*tmp1X;
t21=(this.d01$3*this.d20$3-this.d00$3*this.d21$3)*tmp1X;
t22=(this.d00$3*this.d11$3-this.d01$3*this.d10$3)*tmp1X;
this.d00$3=t00;
this.d01$3=t01;
this.d02$3=t02;
this.d10$3=t10;
this.d11$3=t11;
this.d12$3=t12;
this.d20$3=t20;
this.d21$3=t21;
this.d22$3=t22;
this.lVel1$3.x+=this.impulseX$3*this.invM1$3;
this.lVel1$3.y+=this.impulseY$3*this.invM1$3;
this.lVel1$3.z+=this.impulseZ$3*this.invM1$3;
this.aVel1$3.x+=this.xTorqueUnit1X$3*this.impulseX$3+this.yTorqueUnit1X$3*this.impulseY$3+this.zTorqueUnit1X$3*this.impulseZ$3;
this.aVel1$3.y+=this.xTorqueUnit1Y$3*this.impulseX$3+this.yTorqueUnit1Y$3*this.impulseY$3+this.zTorqueUnit1Y$3*this.impulseZ$3;
this.aVel1$3.z+=this.xTorqueUnit1Z$3*this.impulseX$3+this.yTorqueUnit1Z$3*this.impulseY$3+this.zTorqueUnit1Z$3*this.impulseZ$3;
this.lVel2$3.x-=this.impulseX$3*this.invM2$3;
this.lVel2$3.y-=this.impulseY$3*this.invM2$3;
this.lVel2$3.z-=this.impulseZ$3*this.invM2$3;
this.aVel2$3.x-=this.xTorqueUnit2X$3*this.impulseX$3+this.yTorqueUnit2X$3*this.impulseY$3+this.zTorqueUnit2X$3*this.impulseZ$3;
this.aVel2$3.y-=this.xTorqueUnit2Y$3*this.impulseX$3+this.yTorqueUnit2Y$3*this.impulseY$3+this.zTorqueUnit2Y$3*this.impulseZ$3;
this.aVel2$3.z-=this.xTorqueUnit2Z$3*this.impulseX$3+this.yTorqueUnit2Z$3*this.impulseY$3+this.zTorqueUnit2Z$3*this.impulseZ$3;
this.targetVelX$3=this.anchorPosition2.x-this.anchorPosition1.x;
this.targetVelY$3=this.anchorPosition2.y-this.anchorPosition1.y;
this.targetVelZ$3=this.anchorPosition2.z-this.anchorPosition1.z;
tmp1X=Math.sqrt(this.targetVelX$3*this.targetVelX$3+this.targetVelY$3*this.targetVelY$3+this.targetVelZ$3*this.targetVelZ$3);
if(tmp1X<0.005){
this.targetVelX$3=0;
this.targetVelY$3=0;
this.targetVelZ$3=0;
}else{
tmp1X=(0.005-tmp1X)/tmp1X*invTimeStep*0.05;
this.targetVelX$3*=tmp1X;
this.targetVelY$3*=tmp1X;
this.targetVelZ$3*=tmp1X;
}
},
"override public function solve",function(){
var relVelX;
var relVelY;
var relVelZ;
var newImpulseX;
var newImpulseY;
var newImpulseZ;
relVelX=this.lVel2$3.x-this.lVel1$3.x+this.aVel2$3.y*this.relPos2Z$3-this.aVel2$3.z*this.relPos2Y$3-this.aVel1$3.y*this.relPos1Z$3+this.aVel1$3.z*this.relPos1Y$3-this.targetVelX$3;
relVelY=this.lVel2$3.y-this.lVel1$3.y+this.aVel2$3.z*this.relPos2X$3-this.aVel2$3.x*this.relPos2Z$3-this.aVel1$3.z*this.relPos1X$3+this.aVel1$3.x*this.relPos1Z$3-this.targetVelY$3;
relVelZ=this.lVel2$3.z-this.lVel1$3.z+this.aVel2$3.x*this.relPos2Y$3-this.aVel2$3.y*this.relPos2X$3-this.aVel1$3.x*this.relPos1Y$3+this.aVel1$3.y*this.relPos1X$3-this.targetVelZ$3;
newImpulseX=relVelX*this.d00$3+relVelY*this.d01$3+relVelZ*this.d02$3;
newImpulseY=relVelX*this.d10$3+relVelY*this.d11$3+relVelZ*this.d12$3;
newImpulseZ=relVelX*this.d20$3+relVelY*this.d21$3+relVelZ*this.d22$3;
this.impulseX$3+=newImpulseX;
this.impulseY$3+=newImpulseY;
this.impulseZ$3+=newImpulseZ;
this.lVel1$3.x+=newImpulseX*this.invM1$3;
this.lVel1$3.y+=newImpulseY*this.invM1$3;
this.lVel1$3.z+=newImpulseZ*this.invM1$3;
this.aVel1$3.x+=this.xTorqueUnit1X$3*newImpulseX+this.yTorqueUnit1X$3*newImpulseY+this.zTorqueUnit1X$3*newImpulseZ;
this.aVel1$3.y+=this.xTorqueUnit1Y$3*newImpulseX+this.yTorqueUnit1Y$3*newImpulseY+this.zTorqueUnit1Y$3*newImpulseZ;
this.aVel1$3.z+=this.xTorqueUnit1Z$3*newImpulseX+this.yTorqueUnit1Z$3*newImpulseY+this.zTorqueUnit1Z$3*newImpulseZ;
this.lVel2$3.x-=newImpulseX*this.invM2$3;
this.lVel2$3.y-=newImpulseY*this.invM2$3;
this.lVel2$3.z-=newImpulseZ*this.invM2$3;
this.aVel2$3.x-=this.xTorqueUnit2X$3*newImpulseX+this.yTorqueUnit2X$3*newImpulseY+this.zTorqueUnit2X$3*newImpulseZ;
this.aVel2$3.y-=this.xTorqueUnit2Y$3*newImpulseX+this.yTorqueUnit2Y$3*newImpulseY+this.zTorqueUnit2Y$3*newImpulseZ;
this.aVel2$3.z-=this.xTorqueUnit2Z$3*newImpulseX+this.yTorqueUnit2Z$3*newImpulseY+this.zTorqueUnit2Z$3*newImpulseZ;
},
"override public function postSolve",function(){
this.impulse.x=this.impulseX$3;
this.impulse.y=this.impulseY$3;
this.impulse.z=this.impulseZ$3;
},
];},[],["com.element.oimo.physics.constraint.joint.Joint","com.element.oimo.math.Vec3","Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.constraint.joint.DistanceJoint
joo.classLoader.prepare(
"package com.element.oimo.physics.constraint.joint",
"public class DistanceJoint extends com.element.oimo.physics.constraint.joint.Joint",3,function($$private){;return[
"public var",{distance:NaN},
"public var",{impulse:NaN},
"private var",{posError:NaN},
"private var",{lVel1:null},
"private var",{lVel2:null},
"private var",{aVel1:null},
"private var",{aVel2:null},
"private var",{norX:NaN},
"private var",{norY:NaN},
"private var",{norZ:NaN},
"private var",{relPos1X:NaN},
"private var",{relPos1Y:NaN},
"private var",{relPos1Z:NaN},
"private var",{relPos2X:NaN},
"private var",{relPos2Y:NaN},
"private var",{relPos2Z:NaN},
"private var",{norTorque1X:NaN},
"private var",{norTorque1Y:NaN},
"private var",{norTorque1Z:NaN},
"private var",{norTorque2X:NaN},
"private var",{norTorque2Y:NaN},
"private var",{norTorque2Z:NaN},
"private var",{norTorqueUnit1X:NaN},
"private var",{norTorqueUnit1Y:NaN},
"private var",{norTorqueUnit1Z:NaN},
"private var",{norTorqueUnit2X:NaN},
"private var",{norTorqueUnit2Y:NaN},
"private var",{norTorqueUnit2Z:NaN},
"private var",{invM1:NaN},
"private var",{invM2:NaN},
"private var",{invI1e00:NaN},
"private var",{invI1e01:NaN},
"private var",{invI1e02:NaN},
"private var",{invI1e10:NaN},
"private var",{invI1e11:NaN},
"private var",{invI1e12:NaN},
"private var",{invI1e20:NaN},
"private var",{invI1e21:NaN},
"private var",{invI1e22:NaN},
"private var",{invI2e00:NaN},
"private var",{invI2e01:NaN},
"private var",{invI2e02:NaN},
"private var",{invI2e10:NaN},
"private var",{invI2e11:NaN},
"private var",{invI2e12:NaN},
"private var",{invI2e20:NaN},
"private var",{invI2e21:NaN},
"private var",{invI2e22:NaN},
"private var",{normalDenominator:NaN},
"private var",{targetNormalVelocity:NaN},
"public function DistanceJoint",function(rigid1,rigid2,distance,config){this.super$3();
this.body1=rigid1;
this.body2=rigid2;
this.connection1.connected=rigid2;
this.connection2.connected=rigid1;
this.distance=distance;
this.allowCollision=config.allowCollision;
this.localRelativeAnchorPosition1.copy(config.localRelativeAnchorPosition1);
this.localRelativeAnchorPosition2.copy(config.localRelativeAnchorPosition2);
this.type=com.element.oimo.physics.constraint.joint.Joint.JOINT_DISTANCE;
this.lVel1$3=this.body1.linearVelocity;
this.lVel2$3=this.body2.linearVelocity;
this.aVel1$3=this.body1.angularVelocity;
this.aVel2$3=this.body2.angularVelocity;
this.invM1$3=this.body1.invertMass;
this.invM2$3=this.body2.invertMass;
this.impulse=0;
},
"override public function preSolve",function(timeStep,invTimeStep){
var tmpM;
var tmp1X;
var tmp1Y;
var tmp1Z;
var tmp2X;
var tmp2Y;
var tmp2Z;
tmpM=this.body1.rotation;
tmp1X=this.localRelativeAnchorPosition1.x;
tmp1Y=this.localRelativeAnchorPosition1.y;
tmp1Z=this.localRelativeAnchorPosition1.z;
this.relPos1X$3=this.relativeAnchorPosition1.x=tmp1X*tmpM.e00+tmp1Y*tmpM.e01+tmp1Z*tmpM.e02;
this.relPos1Y$3=this.relativeAnchorPosition1.y=tmp1X*tmpM.e10+tmp1Y*tmpM.e11+tmp1Z*tmpM.e12;
this.relPos1Z$3=this.relativeAnchorPosition1.z=tmp1X*tmpM.e20+tmp1Y*tmpM.e21+tmp1Z*tmpM.e22;
tmpM=this.body2.rotation;
tmp1X=this.localRelativeAnchorPosition2.x;
tmp1Y=this.localRelativeAnchorPosition2.y;
tmp1Z=this.localRelativeAnchorPosition2.z;
this.relPos2X$3=this.relativeAnchorPosition2.x=tmp1X*tmpM.e00+tmp1Y*tmpM.e01+tmp1Z*tmpM.e02;
this.relPos2Y$3=this.relativeAnchorPosition2.y=tmp1X*tmpM.e10+tmp1Y*tmpM.e11+tmp1Z*tmpM.e12;
this.relPos2Z$3=this.relativeAnchorPosition2.z=tmp1X*tmpM.e20+tmp1Y*tmpM.e21+tmp1Z*tmpM.e22;
this.norX$3=(this.anchorPosition2.x=this.relPos2X$3+this.body2.position.x)-(this.anchorPosition1.x=this.relPos1X$3+this.body1.position.x);
this.norY$3=(this.anchorPosition2.y=this.relPos2Y$3+this.body2.position.y)-(this.anchorPosition1.y=this.relPos1Y$3+this.body1.position.y);
this.norZ$3=(this.anchorPosition2.z=this.relPos2Z$3+this.body2.position.z)-(this.anchorPosition1.z=this.relPos1Z$3+this.body1.position.z);
tmp1X=Math.sqrt(this.norX$3*this.norX$3+this.norY$3*this.norY$3+this.norZ$3*this.norZ$3);
this.posError$3=this.distance-tmp1X;
if(tmp1X>0)tmp1X=1/tmp1X;
this.norX$3*=tmp1X;
this.norY$3*=tmp1X;
this.norZ$3*=tmp1X;
tmpM=this.body1.invertInertia;
this.invI1e00$3=tmpM.e00;
this.invI1e01$3=tmpM.e01;
this.invI1e02$3=tmpM.e02;
this.invI1e10$3=tmpM.e10;
this.invI1e11$3=tmpM.e11;
this.invI1e12$3=tmpM.e12;
this.invI1e20$3=tmpM.e20;
this.invI1e21$3=tmpM.e21;
this.invI1e22$3=tmpM.e22;
tmpM=this.body2.invertInertia;
this.invI2e00$3=tmpM.e00;
this.invI2e01$3=tmpM.e01;
this.invI2e02$3=tmpM.e02;
this.invI2e10$3=tmpM.e10;
this.invI2e11$3=tmpM.e11;
this.invI2e12$3=tmpM.e12;
this.invI2e20$3=tmpM.e20;
this.invI2e21$3=tmpM.e21;
this.invI2e22$3=tmpM.e22;
this.norTorque1X$3=this.relPos1Y$3*this.norZ$3-this.relPos1Z$3*this.norY$3;
this.norTorque1Y$3=this.relPos1Z$3*this.norX$3-this.relPos1X$3*this.norZ$3;
this.norTorque1Z$3=this.relPos1X$3*this.norY$3-this.relPos1Y$3*this.norX$3;
this.norTorque2X$3=this.relPos2Y$3*this.norZ$3-this.relPos2Z$3*this.norY$3;
this.norTorque2Y$3=this.relPos2Z$3*this.norX$3-this.relPos2X$3*this.norZ$3;
this.norTorque2Z$3=this.relPos2X$3*this.norY$3-this.relPos2Y$3*this.norX$3;
this.norTorqueUnit1X$3=this.norTorque1X$3*this.invI1e00$3+this.norTorque1Y$3*this.invI1e01$3+this.norTorque1Z$3*this.invI1e02$3;
this.norTorqueUnit1Y$3=this.norTorque1X$3*this.invI1e10$3+this.norTorque1Y$3*this.invI1e11$3+this.norTorque1Z$3*this.invI1e12$3;
this.norTorqueUnit1Z$3=this.norTorque1X$3*this.invI1e20$3+this.norTorque1Y$3*this.invI1e21$3+this.norTorque1Z$3*this.invI1e22$3;
this.norTorqueUnit2X$3=this.norTorque2X$3*this.invI2e00$3+this.norTorque2Y$3*this.invI2e01$3+this.norTorque2Z$3*this.invI2e02$3;
this.norTorqueUnit2Y$3=this.norTorque2X$3*this.invI2e10$3+this.norTorque2Y$3*this.invI2e11$3+this.norTorque2Z$3*this.invI2e12$3;
this.norTorqueUnit2Z$3=this.norTorque2X$3*this.invI2e20$3+this.norTorque2Y$3*this.invI2e21$3+this.norTorque2Z$3*this.invI2e22$3;
tmp1X=this.norTorque1X$3*this.invI1e00$3+this.norTorque1Y$3*this.invI1e01$3+this.norTorque1Z$3*this.invI1e02$3;
tmp1Y=this.norTorque1X$3*this.invI1e10$3+this.norTorque1Y$3*this.invI1e11$3+this.norTorque1Z$3*this.invI1e12$3;
tmp1Z=this.norTorque1X$3*this.invI1e20$3+this.norTorque1Y$3*this.invI1e21$3+this.norTorque1Z$3*this.invI1e22$3;
tmp2X=tmp1Y*this.relPos1Z$3-tmp1Z*this.relPos1Y$3;
tmp2Y=tmp1Z*this.relPos1X$3-tmp1X*this.relPos1Z$3;
tmp2Z=tmp1X*this.relPos1Y$3-tmp1Y*this.relPos1X$3;
tmp1X=this.norTorque2X$3*this.invI2e00$3+this.norTorque2Y$3*this.invI2e01$3+this.norTorque2Z$3*this.invI2e02$3;
tmp1Y=this.norTorque2X$3*this.invI2e10$3+this.norTorque2Y$3*this.invI2e11$3+this.norTorque2Z$3*this.invI2e12$3;
tmp1Z=this.norTorque2X$3*this.invI2e20$3+this.norTorque2Y$3*this.invI2e21$3+this.norTorque2Z$3*this.invI2e22$3;
tmp2X+=tmp1Y*this.relPos2Z$3-tmp1Z*this.relPos2Y$3;
tmp2Y+=tmp1Z*this.relPos2X$3-tmp1X*this.relPos2Z$3;
tmp2Z+=tmp1X*this.relPos2Y$3-tmp1Y*this.relPos2X$3;
this.normalDenominator$3=1/(this.invM1$3+this.invM2$3+this.norX$3*tmp2X+this.norY$3*tmp2Y+this.norZ$3*tmp2Z);
tmp1X=this.norX$3*this.impulse;
tmp1Y=this.norY$3*this.impulse;
tmp1Z=this.norZ$3*this.impulse;
this.lVel1$3.x+=tmp1X*this.invM1$3;
this.lVel1$3.y+=tmp1Y*this.invM1$3;
this.lVel1$3.z+=tmp1Z*this.invM1$3;
this.aVel1$3.x+=this.norTorqueUnit1X$3*this.impulse;
this.aVel1$3.y+=this.norTorqueUnit1Y$3*this.impulse;
this.aVel1$3.z+=this.norTorqueUnit1Z$3*this.impulse;
this.lVel2$3.x-=tmp1X*this.invM2$3;
this.lVel2$3.y-=tmp1Y*this.invM2$3;
this.lVel2$3.z-=tmp1Z*this.invM2$3;
this.aVel2$3.x-=this.norTorqueUnit2X$3*this.impulse;
this.aVel2$3.y-=this.norTorqueUnit2Y$3*this.impulse;
this.aVel2$3.z-=this.norTorqueUnit2Z$3*this.impulse;
if(this.posError$3<-0.005)this.posError$3+=0.005;
else if(this.posError$3>0.005)this.posError$3-=0.005;
else this.posError$3=0;
this.targetNormalVelocity$3=this.posError$3*invTimeStep*0.05;
},
"override public function solve",function(){
var newImpulse;
var rvn;
var forceX;
var forceY;
var forceZ;
var tmpX;
var tmpY;
var tmpZ;
rvn=
(this.lVel2$3.x-this.lVel1$3.x)*this.norX$3+(this.lVel2$3.y-this.lVel1$3.y)*this.norY$3+(this.lVel2$3.z-this.lVel1$3.z)*this.norZ$3+
this.aVel2$3.x*this.norTorque2X$3+this.aVel2$3.y*this.norTorque2Y$3+this.aVel2$3.z*this.norTorque2Z$3-
this.aVel1$3.x*this.norTorque1X$3-this.aVel1$3.y*this.norTorque1Y$3-this.aVel1$3.z*this.norTorque1Z$3
;
newImpulse=(rvn-this.targetNormalVelocity$3)*this.normalDenominator$3;
this.impulse+=newImpulse;
forceX=this.norX$3*newImpulse;
forceY=this.norY$3*newImpulse;
forceZ=this.norZ$3*newImpulse;
this.lVel1$3.x+=forceX*this.invM1$3;
this.lVel1$3.y+=forceY*this.invM1$3;
this.lVel1$3.z+=forceZ*this.invM1$3;
this.aVel1$3.x+=this.norTorqueUnit1X$3*newImpulse;
this.aVel1$3.y+=this.norTorqueUnit1Y$3*newImpulse;
this.aVel1$3.z+=this.norTorqueUnit1Z$3*newImpulse;
this.lVel2$3.x-=forceX*this.invM2$3;
this.lVel2$3.y-=forceY*this.invM2$3;
this.lVel2$3.z-=forceZ*this.invM2$3;
this.aVel2$3.x-=this.norTorqueUnit2X$3*newImpulse;
this.aVel2$3.y-=this.norTorqueUnit2Y$3*newImpulse;
this.aVel2$3.z-=this.norTorqueUnit2Z$3*newImpulse;
},
"override public function postSolve",function(){
},
];},[],["com.element.oimo.physics.constraint.joint.Joint","Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.constraint.joint.Hinge2Joint
joo.classLoader.prepare(
"package com.element.oimo.physics.constraint.joint",
"public class Hinge2Joint extends com.element.oimo.physics.constraint.joint.Joint",3,function($$private){;return[
"public var",{impulse:null},
"public var",{limitTorque1:NaN},
"public var",{motorTorque1:NaN},
"public var",{limitTorque2:NaN},
"public var",{motorTorque2:NaN},
"public var",{torque:null},
"public var",{localAxis1:null},
"public var",{localAxis2:null},
"public var",{enableLimits1:false},
"public var",{lowerLimit1:NaN},
"public var",{upperLimit1:NaN},
"private var",{limitSign1:0},
"public var",{enableLimits2:false},
"public var",{lowerLimit2:NaN},
"public var",{upperLimit2:NaN},
"private var",{limitSign2:0},
"public var",{enableMotor1:false},
"public var",{motorSpeed1:NaN},
"public var",{maxMotorTorque1:NaN},
"private var",{stepMotorTorque1:NaN},
"public var",{enableMotor2:false},
"public var",{motorSpeed2:NaN},
"public var",{maxMotorTorque2:NaN},
"private var",{stepMotorTorque2:NaN},
"private var",{impulseX:NaN},
"private var",{impulseY:NaN},
"private var",{impulseZ:NaN},
"private var",{torqueX:NaN},
"private var",{torqueY:NaN},
"private var",{torqueZ:NaN},
"private var",{torqueNor:NaN},
"private var",{localAxis1X:NaN},
"private var",{localAxis1Y:NaN},
"private var",{localAxis1Z:NaN},
"private var",{localAxis2X:NaN},
"private var",{localAxis2Y:NaN},
"private var",{localAxis2Z:NaN},
"private var",{localAngAxis1X:NaN},
"private var",{localAngAxis1Y:NaN},
"private var",{localAngAxis1Z:NaN},
"private var",{localAngAxis2X:NaN},
"private var",{localAngAxis2Y:NaN},
"private var",{localAngAxis2Z:NaN},
"private var",{tanX:NaN},
"private var",{tanY:NaN},
"private var",{tanZ:NaN},
"private var",{binX:NaN},
"private var",{binY:NaN},
"private var",{binZ:NaN},
"private var",{angAxis1X:NaN},
"private var",{angAxis1Y:NaN},
"private var",{angAxis1Z:NaN},
"private var",{angAxis2X:NaN},
"private var",{angAxis2Y:NaN},
"private var",{angAxis2Z:NaN},
"private var",{norX:NaN},
"private var",{norY:NaN},
"private var",{norZ:NaN},
"private var",{angle1:NaN},
"private var",{angle2:NaN},
"private var",{lVel1:null},
"private var",{lVel2:null},
"private var",{aVel1:null},
"private var",{aVel2:null},
"private var",{relPos1X:NaN},
"private var",{relPos1Y:NaN},
"private var",{relPos1Z:NaN},
"private var",{relPos2X:NaN},
"private var",{relPos2Y:NaN},
"private var",{relPos2Z:NaN},
"private var",{xTorqueUnit1X:NaN},
"private var",{xTorqueUnit1Y:NaN},
"private var",{xTorqueUnit1Z:NaN},
"private var",{xTorqueUnit2X:NaN},
"private var",{xTorqueUnit2Y:NaN},
"private var",{xTorqueUnit2Z:NaN},
"private var",{yTorqueUnit1X:NaN},
"private var",{yTorqueUnit1Y:NaN},
"private var",{yTorqueUnit1Z:NaN},
"private var",{yTorqueUnit2X:NaN},
"private var",{yTorqueUnit2Y:NaN},
"private var",{yTorqueUnit2Z:NaN},
"private var",{zTorqueUnit1X:NaN},
"private var",{zTorqueUnit1Y:NaN},
"private var",{zTorqueUnit1Z:NaN},
"private var",{zTorqueUnit2X:NaN},
"private var",{zTorqueUnit2Y:NaN},
"private var",{zTorqueUnit2Z:NaN},
"private var",{invM1:NaN},
"private var",{invM2:NaN},
"private var",{invI1e00:NaN},
"private var",{invI1e01:NaN},
"private var",{invI1e02:NaN},
"private var",{invI1e10:NaN},
"private var",{invI1e11:NaN},
"private var",{invI1e12:NaN},
"private var",{invI1e20:NaN},
"private var",{invI1e21:NaN},
"private var",{invI1e22:NaN},
"private var",{invI2e00:NaN},
"private var",{invI2e01:NaN},
"private var",{invI2e02:NaN},
"private var",{invI2e10:NaN},
"private var",{invI2e11:NaN},
"private var",{invI2e12:NaN},
"private var",{invI2e20:NaN},
"private var",{invI2e21:NaN},
"private var",{invI2e22:NaN},
"private var",{d00:NaN},
"private var",{d01:NaN},
"private var",{d02:NaN},
"private var",{d10:NaN},
"private var",{d11:NaN},
"private var",{d12:NaN},
"private var",{d20:NaN},
"private var",{d21:NaN},
"private var",{d22:NaN},
"private var",{norDenominator:NaN},
"private var",{tanDenominator:NaN},
"private var",{binDenominator:NaN},
"private var",{invTanDenominator:NaN},
"private var",{invBinDenominator:NaN},
"private var",{targetVelX:NaN},
"private var",{targetVelY:NaN},
"private var",{targetVelZ:NaN},
"private var",{targetAngVelNor:NaN},
"private var",{targetAngVelTan:NaN},
"private var",{targetAngVelBin:NaN},
"public function Hinge2Joint",function(rigid1,rigid2,config){this.super$3();
this.body1=rigid1;
this.body2=rigid2;
this.connection1.connected=rigid2;
this.connection2.connected=rigid1;
this.localAxis1=new com.element.oimo.math.Vec3();
this.localAxis2=new com.element.oimo.math.Vec3();
this.localAxis1.normalize(config.localAxis1);
this.localAxis2.normalize(config.localAxis2);
var len;
this.localAxis1X$3=this.localAxis1.x;
this.localAxis1Y$3=this.localAxis1.y;
this.localAxis1Z$3=this.localAxis1.z;
this.localAngAxis1X$3=this.localAxis1Y$3*this.localAxis1X$3-this.localAxis1Z$3*this.localAxis1Z$3;
this.localAngAxis1Y$3=-this.localAxis1Z$3*this.localAxis1Y$3-this.localAxis1X$3*this.localAxis1X$3;
this.localAngAxis1Z$3=this.localAxis1X$3*this.localAxis1Z$3+this.localAxis1Y$3*this.localAxis1Y$3;
len=1/Math.sqrt(this.localAngAxis1X$3*this.localAngAxis1X$3+this.localAngAxis1Y$3*this.localAngAxis1Y$3+this.localAngAxis1Z$3*this.localAngAxis1Z$3);
this.localAngAxis1X$3*=len;
this.localAngAxis1Y$3*=len;
this.localAngAxis1Z$3*=len;
this.localAxis2X$3=this.localAxis2.x;
this.localAxis2Y$3=this.localAxis2.y;
this.localAxis2Z$3=this.localAxis2.z;
this.localAngAxis2X$3=this.localAxis2Y$3*this.localAxis2X$3-this.localAxis2Z$3*this.localAxis2Z$3;
this.localAngAxis2Y$3=-this.localAxis2Z$3*this.localAxis2Y$3-this.localAxis2X$3*this.localAxis2X$3;
this.localAngAxis2Z$3=this.localAxis2X$3*this.localAxis2Z$3+this.localAxis2Y$3*this.localAxis2Y$3;
len=1/Math.sqrt(this.localAngAxis2X$3*this.localAngAxis2X$3+this.localAngAxis2Y$3*this.localAngAxis2Y$3+this.localAngAxis2Z$3*this.localAngAxis2Z$3);
this.localAngAxis2X$3*=len;
this.localAngAxis2Y$3*=len;
this.localAngAxis2Z$3*=len;
this.allowCollision=config.allowCollision;
this.localRelativeAnchorPosition1.copy(config.localRelativeAnchorPosition1);
this.localRelativeAnchorPosition2.copy(config.localRelativeAnchorPosition2);
this.type=com.element.oimo.physics.constraint.joint.Joint.JOINT_HINGE2;
this.lVel1$3=this.body1.linearVelocity;
this.lVel2$3=this.body2.linearVelocity;
this.aVel1$3=this.body1.angularVelocity;
this.aVel2$3=this.body2.angularVelocity;
this.invM1$3=this.body1.invertMass;
this.invM2$3=this.body2.invertMass;
this.impulse=new com.element.oimo.math.Vec3();
this.torque=new com.element.oimo.math.Vec3();
this.impulseX$3=0;
this.impulseY$3=0;
this.impulseZ$3=0;
this.limitTorque1=0;
this.motorTorque1=0;
this.limitTorque2=0;
this.motorTorque2=0;
this.torqueX$3=0;
this.torqueY$3=0;
this.torqueZ$3=0;
this.torqueNor$3=0;
},
"override public function preSolve",function(timeStep,invTimeStep){
var tmpM;
var tmp1X;
var tmp1Y;
var tmp1Z;
var tmp2X;
var tmp2Y;
var tmp2Z;
var t00;
var t01;
var t02;
var t10;
var t11;
var t12;
var t20;
var t21;
var t22;
var u00;
var u01;
var u02;
var u10;
var u11;
var u12;
var u20;
var u21;
var u22;
tmpM=this.body1.rotation;
this.tanX$3=this.localAxis1X$3*tmpM.e00+this.localAxis1Y$3*tmpM.e01+this.localAxis1Z$3*tmpM.e02;
this.tanY$3=this.localAxis1X$3*tmpM.e10+this.localAxis1Y$3*tmpM.e11+this.localAxis1Z$3*tmpM.e12;
this.tanZ$3=this.localAxis1X$3*tmpM.e20+this.localAxis1Y$3*tmpM.e21+this.localAxis1Z$3*tmpM.e22;
this.angAxis1X$3=this.localAngAxis1X$3*tmpM.e00+this.localAngAxis1Y$3*tmpM.e01+this.localAngAxis1Z$3*tmpM.e02;
this.angAxis1Y$3=this.localAngAxis1X$3*tmpM.e10+this.localAngAxis1Y$3*tmpM.e11+this.localAngAxis1Z$3*tmpM.e12;
this.angAxis1Z$3=this.localAngAxis1X$3*tmpM.e20+this.localAngAxis1Y$3*tmpM.e21+this.localAngAxis1Z$3*tmpM.e22;
tmp1X=this.localRelativeAnchorPosition1.x;
tmp1Y=this.localRelativeAnchorPosition1.y;
tmp1Z=this.localRelativeAnchorPosition1.z;
this.relPos1X$3=this.relativeAnchorPosition1.x=tmp1X*tmpM.e00+tmp1Y*tmpM.e01+tmp1Z*tmpM.e02;
this.relPos1Y$3=this.relativeAnchorPosition1.y=tmp1X*tmpM.e10+tmp1Y*tmpM.e11+tmp1Z*tmpM.e12;
this.relPos1Z$3=this.relativeAnchorPosition1.z=tmp1X*tmpM.e20+tmp1Y*tmpM.e21+tmp1Z*tmpM.e22;
tmpM=this.body2.rotation;
this.binX$3=this.localAxis2X$3*tmpM.e00+this.localAxis2Y$3*tmpM.e01+this.localAxis2Z$3*tmpM.e02;
this.binY$3=this.localAxis2X$3*tmpM.e10+this.localAxis2Y$3*tmpM.e11+this.localAxis2Z$3*tmpM.e12;
this.binZ$3=this.localAxis2X$3*tmpM.e20+this.localAxis2Y$3*tmpM.e21+this.localAxis2Z$3*tmpM.e22;
this.angAxis2X$3=this.localAngAxis2X$3*tmpM.e00+this.localAngAxis2Y$3*tmpM.e01+this.localAngAxis2Z$3*tmpM.e02;
this.angAxis2Y$3=this.localAngAxis2X$3*tmpM.e10+this.localAngAxis2Y$3*tmpM.e11+this.localAngAxis2Z$3*tmpM.e12;
this.angAxis2Z$3=this.localAngAxis2X$3*tmpM.e20+this.localAngAxis2Y$3*tmpM.e21+this.localAngAxis2Z$3*tmpM.e22;
tmp1X=this.localRelativeAnchorPosition2.x;
tmp1Y=this.localRelativeAnchorPosition2.y;
tmp1Z=this.localRelativeAnchorPosition2.z;
this.relPos2X$3=this.relativeAnchorPosition2.x=tmp1X*tmpM.e00+tmp1Y*tmpM.e01+tmp1Z*tmpM.e02;
this.relPos2Y$3=this.relativeAnchorPosition2.y=tmp1X*tmpM.e10+tmp1Y*tmpM.e11+tmp1Z*tmpM.e12;
this.relPos2Z$3=this.relativeAnchorPosition2.z=tmp1X*tmpM.e20+tmp1Y*tmpM.e21+tmp1Z*tmpM.e22;
this.anchorPosition1.x=this.relPos1X$3+this.body1.position.x;
this.anchorPosition1.y=this.relPos1Y$3+this.body1.position.y;
this.anchorPosition1.z=this.relPos1Z$3+this.body1.position.z;
this.anchorPosition2.x=this.relPos2X$3+this.body2.position.x;
this.anchorPosition2.y=this.relPos2Y$3+this.body2.position.y;
this.anchorPosition2.z=this.relPos2Z$3+this.body2.position.z;
this.norX$3=this.binY$3*this.tanZ$3-this.binZ$3*this.tanY$3;
this.norY$3=this.binZ$3*this.tanX$3-this.binX$3*this.tanZ$3;
this.norZ$3=this.binX$3*this.tanY$3-this.binY$3*this.tanX$3;
tmp1X=Math.sqrt(this.norX$3*this.norX$3+this.norY$3*this.norY$3+this.norZ$3*this.norZ$3);
if(tmp1X>0)tmp1X=1/tmp1X;
this.norX$3*=tmp1X;
this.norY$3*=tmp1X;
this.norZ$3*=tmp1X;
if(
this.tanX$3*(this.angAxis1Y$3*this.binZ$3-this.angAxis1Z$3*this.binY$3)+
this.tanY$3*(this.angAxis1Z$3*this.binX$3-this.angAxis1X$3*this.binZ$3)+
this.tanZ$3*(this.angAxis1X$3*this.binY$3-this.angAxis1Y$3*this.binX$3)<0
){
this.angle1$3=-Math.acos(this.angAxis1X$3*this.binX$3+this.angAxis1Y$3*this.binY$3+this.angAxis1Z$3*this.binZ$3);
}else{
this.angle1$3=Math.acos(this.angAxis1X$3*this.binX$3+this.angAxis1Y$3*this.binY$3+this.angAxis1Z$3*this.binZ$3);
}
if(
this.binX$3*(this.angAxis2Y$3*this.tanZ$3-this.angAxis2Z$3*this.tanY$3)+
this.binY$3*(this.angAxis2Z$3*this.tanX$3-this.angAxis2X$3*this.tanZ$3)+
this.binZ$3*(this.angAxis2X$3*this.tanY$3-this.angAxis2Y$3*this.tanX$3)<0
){
this.angle2$3=Math.acos(this.angAxis2X$3*this.tanX$3+this.angAxis2Y$3*this.tanY$3+this.angAxis2Z$3*this.tanZ$3);
}else{
this.angle2$3=-Math.acos(this.angAxis2X$3*this.tanX$3+this.angAxis2Y$3*this.tanY$3+this.angAxis2Z$3*this.tanZ$3);
}
tmpM=this.body1.invertInertia;
this.invI1e00$3=tmpM.e00;
this.invI1e01$3=tmpM.e01;
this.invI1e02$3=tmpM.e02;
this.invI1e10$3=tmpM.e10;
this.invI1e11$3=tmpM.e11;
this.invI1e12$3=tmpM.e12;
this.invI1e20$3=tmpM.e20;
this.invI1e21$3=tmpM.e21;
this.invI1e22$3=tmpM.e22;
tmpM=this.body2.invertInertia;
this.invI2e00$3=tmpM.e00;
this.invI2e01$3=tmpM.e01;
this.invI2e02$3=tmpM.e02;
this.invI2e10$3=tmpM.e10;
this.invI2e11$3=tmpM.e11;
this.invI2e12$3=tmpM.e12;
this.invI2e20$3=tmpM.e20;
this.invI2e21$3=tmpM.e21;
this.invI2e22$3=tmpM.e22;
this.xTorqueUnit1X$3=this.relPos1Z$3*this.invI1e01$3-this.relPos1Y$3*this.invI1e02$3;
this.xTorqueUnit1Y$3=this.relPos1Z$3*this.invI1e11$3-this.relPos1Y$3*this.invI1e12$3;
this.xTorqueUnit1Z$3=this.relPos1Z$3*this.invI1e21$3-this.relPos1Y$3*this.invI1e22$3;
this.xTorqueUnit2X$3=this.relPos2Z$3*this.invI2e01$3-this.relPos2Y$3*this.invI2e02$3;
this.xTorqueUnit2Y$3=this.relPos2Z$3*this.invI2e11$3-this.relPos2Y$3*this.invI2e12$3;
this.xTorqueUnit2Z$3=this.relPos2Z$3*this.invI2e21$3-this.relPos2Y$3*this.invI2e22$3;
this.yTorqueUnit1X$3=-this.relPos1Z$3*this.invI1e00$3+this.relPos1X$3*this.invI1e02$3;
this.yTorqueUnit1Y$3=-this.relPos1Z$3*this.invI1e10$3+this.relPos1X$3*this.invI1e12$3;
this.yTorqueUnit1Z$3=-this.relPos1Z$3*this.invI1e20$3+this.relPos1X$3*this.invI1e22$3;
this.yTorqueUnit2X$3=-this.relPos2Z$3*this.invI2e00$3+this.relPos2X$3*this.invI2e02$3;
this.yTorqueUnit2Y$3=-this.relPos2Z$3*this.invI2e10$3+this.relPos2X$3*this.invI2e12$3;
this.yTorqueUnit2Z$3=-this.relPos2Z$3*this.invI2e20$3+this.relPos2X$3*this.invI2e22$3;
this.zTorqueUnit1X$3=this.relPos1Y$3*this.invI1e00$3-this.relPos1X$3*this.invI1e01$3;
this.zTorqueUnit1Y$3=this.relPos1Y$3*this.invI1e10$3-this.relPos1X$3*this.invI1e11$3;
this.zTorqueUnit1Z$3=this.relPos1Y$3*this.invI1e20$3-this.relPos1X$3*this.invI1e21$3;
this.zTorqueUnit2X$3=this.relPos2Y$3*this.invI2e00$3-this.relPos2X$3*this.invI2e01$3;
this.zTorqueUnit2Y$3=this.relPos2Y$3*this.invI2e10$3-this.relPos2X$3*this.invI2e11$3;
this.zTorqueUnit2Z$3=this.relPos2Y$3*this.invI2e20$3-this.relPos2X$3*this.invI2e21$3;
this.d00$3=this.invM1$3+this.invM2$3;
this.d01$3=0;
this.d02$3=0;
this.d10$3=0;
this.d11$3=this.d00$3;
this.d12$3=0;
this.d20$3=0;
this.d21$3=0;
this.d22$3=this.d00$3;
t01=-this.relPos1Z$3;
t02=this.relPos1Y$3;
t10=this.relPos1Z$3;
t12=-this.relPos1X$3;
t20=-this.relPos1Y$3;
t21=this.relPos1X$3;
u00=this.invI1e01$3*t10+this.invI1e02$3*t20;
u01=this.invI1e00$3*t01+this.invI1e02$3*t21;
u02=this.invI1e00$3*t02+this.invI1e01$3*t12;
u10=this.invI1e11$3*t10+this.invI1e12$3*t20;
u11=this.invI1e10$3*t01+this.invI1e12$3*t21;
u12=this.invI1e10$3*t02+this.invI1e11$3*t12;
u20=this.invI1e21$3*t10+this.invI1e22$3*t20;
u21=this.invI1e20$3*t01+this.invI1e22$3*t21;
u22=this.invI1e20$3*t02+this.invI1e21$3*t12;
this.d00$3-=t01*u10+t02*u20;
this.d01$3-=t01*u11+t02*u21;
this.d02$3-=t01*u12+t02*u22;
this.d10$3-=t10*u00+t12*u20;
this.d11$3-=t10*u01+t12*u21;
this.d12$3-=t10*u02+t12*u22;
this.d20$3-=t20*u00+t21*u10;
this.d21$3-=t20*u01+t21*u11;
this.d22$3-=t20*u02+t21*u12;
t01=-this.relPos2Z$3;
t02=this.relPos2Y$3;
t10=this.relPos2Z$3;
t12=-this.relPos2X$3;
t20=-this.relPos2Y$3;
t21=this.relPos2X$3;
u00=this.invI2e01$3*t10+this.invI2e02$3*t20;
u01=this.invI2e00$3*t01+this.invI2e02$3*t21;
u02=this.invI2e00$3*t02+this.invI2e01$3*t12;
u10=this.invI2e11$3*t10+this.invI2e12$3*t20;
u11=this.invI2e10$3*t01+this.invI2e12$3*t21;
u12=this.invI2e10$3*t02+this.invI2e11$3*t12;
u20=this.invI2e21$3*t10+this.invI2e22$3*t20;
u21=this.invI2e20$3*t01+this.invI2e22$3*t21;
u22=this.invI2e20$3*t02+this.invI2e21$3*t12;
this.d00$3-=t01*u10+t02*u20;
this.d01$3-=t01*u11+t02*u21;
this.d02$3-=t01*u12+t02*u22;
this.d10$3-=t10*u00+t12*u20;
this.d11$3-=t10*u01+t12*u21;
this.d12$3-=t10*u02+t12*u22;
this.d20$3-=t20*u00+t21*u10;
this.d21$3-=t20*u01+t21*u11;
this.d22$3-=t20*u02+t21*u12;
tmp1X=1/(this.d00$3*(this.d11$3*this.d22$3-this.d21$3*this.d12$3)+this.d10$3*(this.d21$3*this.d02$3-this.d01$3*this.d22$3)+this.d20$3*(this.d01$3*this.d12$3-this.d11$3*this.d02$3));
t00=(this.d11$3*this.d22$3-this.d12$3*this.d21$3)*tmp1X;
t01=(this.d02$3*this.d21$3-this.d01$3*this.d22$3)*tmp1X;
t02=(this.d01$3*this.d12$3-this.d02$3*this.d11$3)*tmp1X;
t10=(this.d12$3*this.d20$3-this.d10$3*this.d22$3)*tmp1X;
t11=(this.d00$3*this.d22$3-this.d02$3*this.d20$3)*tmp1X;
t12=(this.d02$3*this.d10$3-this.d00$3*this.d12$3)*tmp1X;
t20=(this.d10$3*this.d21$3-this.d11$3*this.d20$3)*tmp1X;
t21=(this.d01$3*this.d20$3-this.d00$3*this.d21$3)*tmp1X;
t22=(this.d00$3*this.d11$3-this.d01$3*this.d10$3)*tmp1X;
this.d00$3=t00;
this.d01$3=t01;
this.d02$3=t02;
this.d10$3=t10;
this.d11$3=t11;
this.d12$3=t12;
this.d20$3=t20;
this.d21$3=t21;
this.d22$3=t22;
t00=this.invI1e00$3+this.invI2e00$3;
t01=this.invI1e01$3+this.invI2e01$3;
t02=this.invI1e02$3+this.invI2e02$3;
t10=this.invI1e10$3+this.invI2e10$3;
t11=this.invI1e11$3+this.invI2e11$3;
t12=this.invI1e12$3+this.invI2e12$3;
t20=this.invI1e20$3+this.invI2e20$3;
t21=this.invI1e21$3+this.invI2e21$3;
t22=this.invI1e22$3+this.invI2e22$3;
this.norDenominator$3=
1/(
this.norX$3*(this.norX$3*t00+this.norY$3*t01+this.norZ$3*t02)+
this.norY$3*(this.norX$3*t10+this.norY$3*t11+this.norZ$3*t12)+
this.norZ$3*(this.norX$3*t20+this.norY$3*t21+this.norZ$3*t22)
)
;
this.invTanDenominator$3=
this.tanX$3*(this.tanX$3*t00+this.tanY$3*t01+this.tanZ$3*t02)+
this.tanY$3*(this.tanX$3*t10+this.tanY$3*t11+this.tanZ$3*t12)+
this.tanZ$3*(this.tanX$3*t20+this.tanY$3*t21+this.tanZ$3*t22)
;
this.tanDenominator$3=1/this.invTanDenominator$3;
this.invBinDenominator$3=
this.binX$3*(this.binX$3*t00+this.binY$3*t01+this.binZ$3*t02)+
this.binY$3*(this.binX$3*t10+this.binY$3*t11+this.binZ$3*t12)+
this.binZ$3*(this.binX$3*t20+this.binY$3*t21+this.binZ$3*t22)
;
this.binDenominator$3=1/this.invBinDenominator$3;
if(this.enableLimits1){
if(this.angle1$3<this.lowerLimit1){
if(this.limitSign1$3!=-1)this.limitTorque1=0;
this.limitSign1$3=-1;
}else if(this.angle1$3>this.upperLimit1){
if(this.limitSign1$3!=1)this.limitTorque1=0;
this.limitSign1$3=1;
}else{
this.limitSign1$3=0;
this.limitTorque1=0;
}
}else{
this.limitSign1$3=0;
this.limitTorque1=0;
}
if(this.enableLimits2){
if(this.angle2$3<this.lowerLimit2){
if(this.limitSign2$3!=-1)this.limitTorque2=0;
this.limitSign2$3=-1;
}else if(this.angle2$3>this.upperLimit2){
if(this.limitSign2$3!=1)this.limitTorque2=0;
this.limitSign2$3=1;
}else{
this.limitSign2$3=0;
this.limitTorque2=0;
}
}else{
this.limitSign2$3=0;
this.limitTorque2=0;
}
if(this.enableMotor1){
this.stepMotorTorque1$3=timeStep*this.maxMotorTorque1;
}
if(this.enableMotor2){
this.stepMotorTorque2$3=timeStep*this.maxMotorTorque2;
}
this.torqueNor$3*=0.95;
this.motorTorque1*=0.95;
this.limitTorque1*=0.95;
this.motorTorque2*=0.95;
this.limitTorque2*=0.95;
tmp1X=this.motorTorque1+this.limitTorque1;
tmp1Y=this.motorTorque2+this.limitTorque2;
this.torqueX$3=this.torqueNor$3*this.norX$3+tmp1X*this.tanX$3+tmp1Y*this.binX$3;
this.torqueY$3=this.torqueNor$3*this.norY$3+tmp1X*this.tanY$3+tmp1Y*this.binY$3;
this.torqueZ$3=this.torqueNor$3*this.norZ$3+tmp1X*this.tanZ$3+tmp1Y*this.binZ$3;
this.lVel1$3.x+=this.impulseX$3*this.invM1$3;
this.lVel1$3.y+=this.impulseY$3*this.invM1$3;
this.lVel1$3.z+=this.impulseZ$3*this.invM1$3;
this.aVel1$3.x+=this.xTorqueUnit1X$3*this.impulseX$3+this.yTorqueUnit1X$3*this.impulseY$3+this.zTorqueUnit1X$3*this.impulseZ$3+this.torqueX$3*this.invI1e00$3+this.torqueY$3*this.invI1e01$3+this.torqueZ$3*this.invI1e02$3;
this.aVel1$3.y+=this.xTorqueUnit1Y$3*this.impulseX$3+this.yTorqueUnit1Y$3*this.impulseY$3+this.zTorqueUnit1Y$3*this.impulseZ$3+this.torqueX$3*this.invI1e10$3+this.torqueY$3*this.invI1e11$3+this.torqueZ$3*this.invI1e12$3;
this.aVel1$3.z+=this.xTorqueUnit1Z$3*this.impulseX$3+this.yTorqueUnit1Z$3*this.impulseY$3+this.zTorqueUnit1Z$3*this.impulseZ$3+this.torqueX$3*this.invI1e20$3+this.torqueY$3*this.invI1e21$3+this.torqueZ$3*this.invI1e22$3;
this.lVel2$3.x-=this.impulseX$3*this.invM2$3;
this.lVel2$3.y-=this.impulseY$3*this.invM2$3;
this.lVel2$3.z-=this.impulseZ$3*this.invM2$3;
this.aVel2$3.x-=this.xTorqueUnit2X$3*this.impulseX$3+this.yTorqueUnit2X$3*this.impulseY$3+this.zTorqueUnit2X$3*this.impulseZ$3+this.torqueX$3*this.invI2e00$3+this.torqueY$3*this.invI2e01$3+this.torqueZ$3*this.invI2e02$3;
this.aVel2$3.y-=this.xTorqueUnit2Y$3*this.impulseX$3+this.yTorqueUnit2Y$3*this.impulseY$3+this.zTorqueUnit2Y$3*this.impulseZ$3+this.torqueX$3*this.invI2e10$3+this.torqueY$3*this.invI2e11$3+this.torqueZ$3*this.invI2e12$3;
this.aVel2$3.z-=this.xTorqueUnit2Z$3*this.impulseX$3+this.yTorqueUnit2Z$3*this.impulseY$3+this.zTorqueUnit2Z$3*this.impulseZ$3+this.torqueX$3*this.invI2e20$3+this.torqueY$3*this.invI2e21$3+this.torqueZ$3*this.invI2e22$3;
this.targetVelX$3=this.anchorPosition2.x-this.anchorPosition1.x;
this.targetVelY$3=this.anchorPosition2.y-this.anchorPosition1.y;
this.targetVelZ$3=this.anchorPosition2.z-this.anchorPosition1.z;
tmp1X=Math.sqrt(this.targetVelX$3*this.targetVelX$3+this.targetVelY$3*this.targetVelY$3+this.targetVelZ$3*this.targetVelZ$3);
if(tmp1X<0.005){
this.targetVelX$3=0;
this.targetVelY$3=0;
this.targetVelZ$3=0;
}else{
tmp1X=(0.005-tmp1X)/tmp1X*invTimeStep*0.05;
this.targetVelX$3*=tmp1X;
this.targetVelY$3*=tmp1X;
this.targetVelZ$3*=tmp1X;
}
this.targetAngVelNor$3=-(this.tanX$3*this.binX$3+this.tanY$3*this.binY$3+this.tanZ$3*this.binZ$3);
if(this.targetAngVelNor$3>0.02)this.targetAngVelNor$3=(this.targetAngVelNor$3-0.02)*invTimeStep*0.05;
else if(this.targetAngVelNor$3<-0.02)this.targetAngVelNor$3=(this.targetAngVelNor$3+0.02)*invTimeStep*0.05;
else this.targetAngVelNor$3=0;
if(this.limitSign1$3==-1){
this.targetAngVelTan$3=this.lowerLimit1-this.angle1$3;
if(this.targetAngVelTan$3<0.02)this.targetAngVelTan$3=0;
else this.targetAngVelTan$3=(this.targetAngVelTan$3-0.02)*invTimeStep*0.05;
}else if(this.limitSign1$3==1){
this.targetAngVelTan$3=this.upperLimit1-this.angle1$3;
if(this.targetAngVelTan$3>-0.02)this.targetAngVelTan$3=0;
else this.targetAngVelTan$3=(this.targetAngVelTan$3+0.02)*invTimeStep*0.05;
}else{
this.targetAngVelTan$3=0;
}
if(this.limitSign2$3==-1){
this.targetAngVelBin$3=this.lowerLimit2-this.angle2$3;
if(this.targetAngVelBin$3<0.02)this.targetAngVelBin$3=0;
else this.targetAngVelBin$3=(this.targetAngVelBin$3-0.02)*invTimeStep*0.05;
}else if(this.limitSign2$3==1){
this.targetAngVelBin$3=this.upperLimit2-this.angle2$3;
if(this.targetAngVelBin$3>-0.02)this.targetAngVelBin$3=0;
else this.targetAngVelBin$3=(this.targetAngVelBin$3+0.02)*invTimeStep*0.05;
}else{
this.targetAngVelBin$3=0;
}
},
"override public function solve",function(){
var relVelX;
var relVelY;
var relVelZ;
var tmp;
var newImpulseX;
var newImpulseY;
var newImpulseZ;
var newTorqueNor;
var newTorqueTan;
var newTorqueBin;
var oldMotorTorque1;
var newMotorTorque1;
var oldLimitTorque1;
var newLimitTorque1;
var oldMotorTorque2;
var newMotorTorque2;
var oldLimitTorque2;
var newLimitTorque2;
relVelX=this.lVel2$3.x-this.lVel1$3.x+this.aVel2$3.y*this.relPos2Z$3-this.aVel2$3.z*this.relPos2Y$3-this.aVel1$3.y*this.relPos1Z$3+this.aVel1$3.z*this.relPos1Y$3-this.targetVelX$3;
relVelY=this.lVel2$3.y-this.lVel1$3.y+this.aVel2$3.z*this.relPos2X$3-this.aVel2$3.x*this.relPos2Z$3-this.aVel1$3.z*this.relPos1X$3+this.aVel1$3.x*this.relPos1Z$3-this.targetVelY$3;
relVelZ=this.lVel2$3.z-this.lVel1$3.z+this.aVel2$3.x*this.relPos2Y$3-this.aVel2$3.y*this.relPos2X$3-this.aVel1$3.x*this.relPos1Y$3+this.aVel1$3.y*this.relPos1X$3-this.targetVelZ$3;
newImpulseX=relVelX*this.d00$3+relVelY*this.d01$3+relVelZ*this.d02$3;
newImpulseY=relVelX*this.d10$3+relVelY*this.d11$3+relVelZ*this.d12$3;
newImpulseZ=relVelX*this.d20$3+relVelY*this.d21$3+relVelZ*this.d22$3;
this.impulseX$3+=newImpulseX;
this.impulseY$3+=newImpulseY;
this.impulseZ$3+=newImpulseZ;
this.lVel1$3.x+=newImpulseX*this.invM1$3;
this.lVel1$3.y+=newImpulseY*this.invM1$3;
this.lVel1$3.z+=newImpulseZ*this.invM1$3;
this.aVel1$3.x+=this.xTorqueUnit1X$3*newImpulseX+this.yTorqueUnit1X$3*newImpulseY+this.zTorqueUnit1X$3*newImpulseZ;
this.aVel1$3.y+=this.xTorqueUnit1Y$3*newImpulseX+this.yTorqueUnit1Y$3*newImpulseY+this.zTorqueUnit1Y$3*newImpulseZ;
this.aVel1$3.z+=this.xTorqueUnit1Z$3*newImpulseX+this.yTorqueUnit1Z$3*newImpulseY+this.zTorqueUnit1Z$3*newImpulseZ;
this.lVel2$3.x-=newImpulseX*this.invM2$3;
this.lVel2$3.y-=newImpulseY*this.invM2$3;
this.lVel2$3.z-=newImpulseZ*this.invM2$3;
this.aVel2$3.x-=this.xTorqueUnit2X$3*newImpulseX+this.yTorqueUnit2X$3*newImpulseY+this.zTorqueUnit2X$3*newImpulseZ;
this.aVel2$3.y-=this.xTorqueUnit2Y$3*newImpulseX+this.yTorqueUnit2Y$3*newImpulseY+this.zTorqueUnit2Y$3*newImpulseZ;
this.aVel2$3.z-=this.xTorqueUnit2Z$3*newImpulseX+this.yTorqueUnit2Z$3*newImpulseY+this.zTorqueUnit2Z$3*newImpulseZ;
relVelX=this.aVel2$3.x-this.aVel1$3.x;
relVelY=this.aVel2$3.y-this.aVel1$3.y;
relVelZ=this.aVel2$3.z-this.aVel1$3.z;
tmp=relVelX*this.tanX$3+relVelY*this.tanY$3+relVelZ*this.tanZ$3;
if(this.enableMotor1){
newMotorTorque1=(tmp-this.motorSpeed1)*this.tanDenominator$3;
oldMotorTorque1=this.motorTorque1;
this.motorTorque1+=newMotorTorque1;
if(this.motorTorque1>this.stepMotorTorque1$3)this.motorTorque1=this.stepMotorTorque1$3;
else if(this.motorTorque1<-this.stepMotorTorque1$3)this.motorTorque1=-this.stepMotorTorque1$3;
newMotorTorque1=this.motorTorque1-oldMotorTorque1;
tmp-=newMotorTorque1*this.invTanDenominator$3;
}else newMotorTorque1=0;
if(this.limitSign1$3!=0){
newLimitTorque1=(tmp-this.targetAngVelTan$3)*this.tanDenominator$3;
oldLimitTorque1=this.limitTorque1;
this.limitTorque1+=newLimitTorque1;
if(this.limitTorque1*this.limitSign1$3<0)this.limitTorque1=0;
newLimitTorque1=this.limitTorque1-oldLimitTorque1;
}else newLimitTorque1=0;
tmp=relVelX*this.binX$3+relVelY*this.binY$3+relVelZ*this.binZ$3;
if(this.enableMotor2){
newMotorTorque2=(tmp-this.motorSpeed2)*this.binDenominator$3;
oldMotorTorque2=this.motorTorque2;
this.motorTorque2+=newMotorTorque2;
if(this.motorTorque2>this.stepMotorTorque2$3)this.motorTorque2=this.stepMotorTorque2$3;
else if(this.motorTorque2<-this.stepMotorTorque2$3)this.motorTorque2=-this.stepMotorTorque2$3;
newMotorTorque2=this.motorTorque2-oldMotorTorque2;
tmp-=newMotorTorque2*this.invBinDenominator$3;
}else newMotorTorque2=0;
if(this.limitSign2$3!=0){
newLimitTorque2=(tmp-this.targetAngVelBin$3)*this.binDenominator$3;
oldLimitTorque2=this.limitTorque2;
this.limitTorque2+=newLimitTorque2;
if(this.limitTorque2*this.limitSign2$3<0)this.limitTorque2=0;
newLimitTorque2=this.limitTorque2-oldLimitTorque2;
}else newLimitTorque2=0;
newTorqueNor=(relVelX*this.norX$3+relVelY*this.norY$3+relVelZ*this.norZ$3-this.targetAngVelNor$3)*this.norDenominator$3;
newTorqueTan=newMotorTorque1+newLimitTorque1;
newTorqueBin=newMotorTorque2+newLimitTorque2;
this.torqueNor$3+=newTorqueNor;
newImpulseX=newTorqueNor*this.norX$3+newTorqueTan*this.tanX$3+newTorqueBin*this.binX$3;
newImpulseY=newTorqueNor*this.norY$3+newTorqueTan*this.tanY$3+newTorqueBin*this.binY$3;
newImpulseZ=newTorqueNor*this.norZ$3+newTorqueTan*this.tanZ$3+newTorqueBin*this.binZ$3;
this.aVel1$3.x+=this.invI1e00$3*newImpulseX+this.invI1e01$3*newImpulseY+this.invI1e02$3*newImpulseZ;
this.aVel1$3.y+=this.invI1e10$3*newImpulseX+this.invI1e11$3*newImpulseY+this.invI1e12$3*newImpulseZ;
this.aVel1$3.z+=this.invI1e20$3*newImpulseX+this.invI1e21$3*newImpulseY+this.invI1e22$3*newImpulseZ;
this.aVel2$3.x-=this.invI2e00$3*newImpulseX+this.invI2e01$3*newImpulseY+this.invI2e02$3*newImpulseZ;
this.aVel2$3.y-=this.invI2e10$3*newImpulseX+this.invI2e11$3*newImpulseY+this.invI2e12$3*newImpulseZ;
this.aVel2$3.z-=this.invI2e20$3*newImpulseX+this.invI2e21$3*newImpulseY+this.invI2e22$3*newImpulseZ;
},
"override public function postSolve",function(){
this.impulse.x=this.impulseX$3;
this.impulse.y=this.impulseY$3;
this.impulse.z=this.impulseZ$3;
this.torque.x=this.torqueX$3;
this.torque.y=this.torqueY$3;
this.torque.z=this.torqueZ$3;
},
];},[],["com.element.oimo.physics.constraint.joint.Joint","com.element.oimo.math.Vec3","Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.constraint.joint.HingeJoint
joo.classLoader.prepare(
"package com.element.oimo.physics.constraint.joint",
"public class HingeJoint extends com.element.oimo.physics.constraint.joint.Joint",3,function($$private){;return[
"public var",{impulse:null},
"public var",{limitTorque:NaN},
"public var",{motorTorque:NaN},
"public var",{torque:null},
"public var",{localAxis1:null},
"public var",{localAxis2:null},
"public var",{enableLimits:false},
"public var",{lowerLimit:NaN},
"public var",{upperLimit:NaN},
"private var",{limitSign:0},
"public var",{enableMotor:false},
"public var",{motorSpeed:NaN},
"public var",{maxMotorTorque:NaN},
"private var",{stepMotorTorque:NaN},
"private var",{impulseX:NaN},
"private var",{impulseY:NaN},
"private var",{impulseZ:NaN},
"private var",{torqueX:NaN},
"private var",{torqueY:NaN},
"private var",{torqueZ:NaN},
"private var",{torqueTan:NaN},
"private var",{torqueBin:NaN},
"private var",{localAxis1X:NaN},
"private var",{localAxis1Y:NaN},
"private var",{localAxis1Z:NaN},
"private var",{localAxis2X:NaN},
"private var",{localAxis2Y:NaN},
"private var",{localAxis2Z:NaN},
"private var",{localAngAxis1X:NaN},
"private var",{localAngAxis1Y:NaN},
"private var",{localAngAxis1Z:NaN},
"private var",{localAngAxis2X:NaN},
"private var",{localAngAxis2Y:NaN},
"private var",{localAngAxis2Z:NaN},
"private var",{axis1X:NaN},
"private var",{axis1Y:NaN},
"private var",{axis1Z:NaN},
"private var",{axis2X:NaN},
"private var",{axis2Y:NaN},
"private var",{axis2Z:NaN},
"private var",{angAxis1X:NaN},
"private var",{angAxis1Y:NaN},
"private var",{angAxis1Z:NaN},
"private var",{angAxis2X:NaN},
"private var",{angAxis2Y:NaN},
"private var",{angAxis2Z:NaN},
"private var",{norX:NaN},
"private var",{norY:NaN},
"private var",{norZ:NaN},
"private var",{tanX:NaN},
"private var",{tanY:NaN},
"private var",{tanZ:NaN},
"private var",{binX:NaN},
"private var",{binY:NaN},
"private var",{binZ:NaN},
"private var",{hingeAngle:NaN},
"private var",{lVel1:null},
"private var",{lVel2:null},
"private var",{aVel1:null},
"private var",{aVel2:null},
"private var",{relPos1X:NaN},
"private var",{relPos1Y:NaN},
"private var",{relPos1Z:NaN},
"private var",{relPos2X:NaN},
"private var",{relPos2Y:NaN},
"private var",{relPos2Z:NaN},
"private var",{xTorqueUnit1X:NaN},
"private var",{xTorqueUnit1Y:NaN},
"private var",{xTorqueUnit1Z:NaN},
"private var",{xTorqueUnit2X:NaN},
"private var",{xTorqueUnit2Y:NaN},
"private var",{xTorqueUnit2Z:NaN},
"private var",{yTorqueUnit1X:NaN},
"private var",{yTorqueUnit1Y:NaN},
"private var",{yTorqueUnit1Z:NaN},
"private var",{yTorqueUnit2X:NaN},
"private var",{yTorqueUnit2Y:NaN},
"private var",{yTorqueUnit2Z:NaN},
"private var",{zTorqueUnit1X:NaN},
"private var",{zTorqueUnit1Y:NaN},
"private var",{zTorqueUnit1Z:NaN},
"private var",{zTorqueUnit2X:NaN},
"private var",{zTorqueUnit2Y:NaN},
"private var",{zTorqueUnit2Z:NaN},
"private var",{invM1:NaN},
"private var",{invM2:NaN},
"private var",{invI1e00:NaN},
"private var",{invI1e01:NaN},
"private var",{invI1e02:NaN},
"private var",{invI1e10:NaN},
"private var",{invI1e11:NaN},
"private var",{invI1e12:NaN},
"private var",{invI1e20:NaN},
"private var",{invI1e21:NaN},
"private var",{invI1e22:NaN},
"private var",{invI2e00:NaN},
"private var",{invI2e01:NaN},
"private var",{invI2e02:NaN},
"private var",{invI2e10:NaN},
"private var",{invI2e11:NaN},
"private var",{invI2e12:NaN},
"private var",{invI2e20:NaN},
"private var",{invI2e21:NaN},
"private var",{invI2e22:NaN},
"private var",{d00:NaN},
"private var",{d01:NaN},
"private var",{d02:NaN},
"private var",{d10:NaN},
"private var",{d11:NaN},
"private var",{d12:NaN},
"private var",{d20:NaN},
"private var",{d21:NaN},
"private var",{d22:NaN},
"private var",{norDenominator:NaN},
"private var",{tanDenominator:NaN},
"private var",{binDenominator:NaN},
"private var",{invNorDenominator:NaN},
"private var",{targetVelX:NaN},
"private var",{targetVelY:NaN},
"private var",{targetVelZ:NaN},
"private var",{targetAngVelNor:NaN},
"private var",{targetAngVelTan:NaN},
"private var",{targetAngVelBin:NaN},
"public function HingeJoint",function(rigid1,rigid2,config){this.super$3();
this.body1=rigid1;
this.body2=rigid2;
this.connection1.connected=rigid2;
this.connection2.connected=rigid1;
this.localAxis1=new com.element.oimo.math.Vec3();
this.localAxis2=new com.element.oimo.math.Vec3();
this.localAxis1.normalize(config.localAxis1);
this.localAxis2.normalize(config.localAxis2);
var len;
this.localAxis1X$3=this.localAxis1.x;
this.localAxis1Y$3=this.localAxis1.y;
this.localAxis1Z$3=this.localAxis1.z;
this.localAngAxis1X$3=this.localAxis1Y$3*this.localAxis1X$3-this.localAxis1Z$3*this.localAxis1Z$3;
this.localAngAxis1Y$3=-this.localAxis1Z$3*this.localAxis1Y$3-this.localAxis1X$3*this.localAxis1X$3;
this.localAngAxis1Z$3=this.localAxis1X$3*this.localAxis1Z$3+this.localAxis1Y$3*this.localAxis1Y$3;
len=1/Math.sqrt(this.localAngAxis1X$3*this.localAngAxis1X$3+this.localAngAxis1Y$3*this.localAngAxis1Y$3+this.localAngAxis1Z$3*this.localAngAxis1Z$3);
this.localAngAxis1X$3*=len;
this.localAngAxis1Y$3*=len;
this.localAngAxis1Z$3*=len;
this.localAxis2X$3=this.localAxis2.x;
this.localAxis2Y$3=this.localAxis2.y;
this.localAxis2Z$3=this.localAxis2.z;
this.localAngAxis2X$3=this.localAxis2Y$3*this.localAxis2X$3-this.localAxis2Z$3*this.localAxis2Z$3;
this.localAngAxis2Y$3=-this.localAxis2Z$3*this.localAxis2Y$3-this.localAxis2X$3*this.localAxis2X$3;
this.localAngAxis2Z$3=this.localAxis2X$3*this.localAxis2Z$3+this.localAxis2Y$3*this.localAxis2Y$3;
len=1/Math.sqrt(this.localAngAxis2X$3*this.localAngAxis2X$3+this.localAngAxis2Y$3*this.localAngAxis2Y$3+this.localAngAxis2Z$3*this.localAngAxis2Z$3);
this.localAngAxis2X$3*=len;
this.localAngAxis2Y$3*=len;
this.localAngAxis2Z$3*=len;
this.allowCollision=config.allowCollision;
this.localRelativeAnchorPosition1.copy(config.localRelativeAnchorPosition1);
this.localRelativeAnchorPosition2.copy(config.localRelativeAnchorPosition2);
this.type=com.element.oimo.physics.constraint.joint.Joint.JOINT_HINGE;
this.lVel1$3=this.body1.linearVelocity;
this.lVel2$3=this.body2.linearVelocity;
this.aVel1$3=this.body1.angularVelocity;
this.aVel2$3=this.body2.angularVelocity;
this.invM1$3=this.body1.invertMass;
this.invM2$3=this.body2.invertMass;
this.impulse=new com.element.oimo.math.Vec3();
this.torque=new com.element.oimo.math.Vec3();
this.impulseX$3=0;
this.impulseY$3=0;
this.impulseZ$3=0;
this.limitTorque=0;
this.motorTorque=0;
this.torqueX$3=0;
this.torqueY$3=0;
this.torqueZ$3=0;
this.torqueTan$3=0;
this.torqueBin$3=0;
},
"override public function preSolve",function(timeStep,invTimeStep){
var tmpM;
var tmp1X;
var tmp1Y;
var tmp1Z;
var tmp2X;
var tmp2Y;
var tmp2Z;
var t00;
var t01;
var t02;
var t10;
var t11;
var t12;
var t20;
var t21;
var t22;
var u00;
var u01;
var u02;
var u10;
var u11;
var u12;
var u20;
var u21;
var u22;
tmpM=this.body1.rotation;
this.axis1X$3=this.localAxis1X$3*tmpM.e00+this.localAxis1Y$3*tmpM.e01+this.localAxis1Z$3*tmpM.e02;
this.axis1Y$3=this.localAxis1X$3*tmpM.e10+this.localAxis1Y$3*tmpM.e11+this.localAxis1Z$3*tmpM.e12;
this.axis1Z$3=this.localAxis1X$3*tmpM.e20+this.localAxis1Y$3*tmpM.e21+this.localAxis1Z$3*tmpM.e22;
this.angAxis1X$3=this.localAngAxis1X$3*tmpM.e00+this.localAngAxis1Y$3*tmpM.e01+this.localAngAxis1Z$3*tmpM.e02;
this.angAxis1Y$3=this.localAngAxis1X$3*tmpM.e10+this.localAngAxis1Y$3*tmpM.e11+this.localAngAxis1Z$3*tmpM.e12;
this.angAxis1Z$3=this.localAngAxis1X$3*tmpM.e20+this.localAngAxis1Y$3*tmpM.e21+this.localAngAxis1Z$3*tmpM.e22;
tmp1X=this.localRelativeAnchorPosition1.x;
tmp1Y=this.localRelativeAnchorPosition1.y;
tmp1Z=this.localRelativeAnchorPosition1.z;
this.relPos1X$3=this.relativeAnchorPosition1.x=tmp1X*tmpM.e00+tmp1Y*tmpM.e01+tmp1Z*tmpM.e02;
this.relPos1Y$3=this.relativeAnchorPosition1.y=tmp1X*tmpM.e10+tmp1Y*tmpM.e11+tmp1Z*tmpM.e12;
this.relPos1Z$3=this.relativeAnchorPosition1.z=tmp1X*tmpM.e20+tmp1Y*tmpM.e21+tmp1Z*tmpM.e22;
tmpM=this.body2.rotation;
this.axis2X$3=this.localAxis2X$3*tmpM.e00+this.localAxis2Y$3*tmpM.e01+this.localAxis2Z$3*tmpM.e02;
this.axis2Y$3=this.localAxis2X$3*tmpM.e10+this.localAxis2Y$3*tmpM.e11+this.localAxis2Z$3*tmpM.e12;
this.axis2Z$3=this.localAxis2X$3*tmpM.e20+this.localAxis2Y$3*tmpM.e21+this.localAxis2Z$3*tmpM.e22;
this.angAxis2X$3=this.localAngAxis2X$3*tmpM.e00+this.localAngAxis2Y$3*tmpM.e01+this.localAngAxis2Z$3*tmpM.e02;
this.angAxis2Y$3=this.localAngAxis2X$3*tmpM.e10+this.localAngAxis2Y$3*tmpM.e11+this.localAngAxis2Z$3*tmpM.e12;
this.angAxis2Z$3=this.localAngAxis2X$3*tmpM.e20+this.localAngAxis2Y$3*tmpM.e21+this.localAngAxis2Z$3*tmpM.e22;
tmp1X=this.localRelativeAnchorPosition2.x;
tmp1Y=this.localRelativeAnchorPosition2.y;
tmp1Z=this.localRelativeAnchorPosition2.z;
this.relPos2X$3=this.relativeAnchorPosition2.x=tmp1X*tmpM.e00+tmp1Y*tmpM.e01+tmp1Z*tmpM.e02;
this.relPos2Y$3=this.relativeAnchorPosition2.y=tmp1X*tmpM.e10+tmp1Y*tmpM.e11+tmp1Z*tmpM.e12;
this.relPos2Z$3=this.relativeAnchorPosition2.z=tmp1X*tmpM.e20+tmp1Y*tmpM.e21+tmp1Z*tmpM.e22;
this.anchorPosition1.x=this.relPos1X$3+this.body1.position.x;
this.anchorPosition1.y=this.relPos1Y$3+this.body1.position.y;
this.anchorPosition1.z=this.relPos1Z$3+this.body1.position.z;
this.anchorPosition2.x=this.relPos2X$3+this.body2.position.x;
this.anchorPosition2.y=this.relPos2Y$3+this.body2.position.y;
this.anchorPosition2.z=this.relPos2Z$3+this.body2.position.z;
tmp1X=1/(this.invM1$3+this.invM2$3);
this.norX$3=(this.axis1X$3*this.invM1$3+this.axis2X$3*this.invM2$3)*tmp1X;
this.norY$3=(this.axis1Y$3*this.invM1$3+this.axis2Y$3*this.invM2$3)*tmp1X;
this.norZ$3=(this.axis1Z$3*this.invM1$3+this.axis2Z$3*this.invM2$3)*tmp1X;
tmp1X=Math.sqrt(this.norX$3*this.norX$3+this.norY$3*this.norY$3+this.norZ$3*this.norZ$3);
if(tmp1X>0)tmp1X=1/tmp1X;
this.norX$3*=tmp1X;
this.norY$3*=tmp1X;
this.norZ$3*=tmp1X;
this.tanX$3=this.norY$3*this.norX$3-this.norZ$3*this.norZ$3;
this.tanY$3=-this.norZ$3*this.norY$3-this.norX$3*this.norX$3;
this.tanZ$3=this.norX$3*this.norZ$3+this.norY$3*this.norY$3;
tmp1X=1/Math.sqrt(this.tanX$3*this.tanX$3+this.tanY$3*this.tanY$3+this.tanZ$3*this.tanZ$3);
this.tanX$3*=tmp1X;
this.tanY$3*=tmp1X;
this.tanZ$3*=tmp1X;
this.binX$3=this.norY$3*this.tanZ$3-this.norZ$3*this.tanY$3;
this.binY$3=this.norZ$3*this.tanX$3-this.norX$3*this.tanZ$3;
this.binZ$3=this.norX$3*this.tanY$3-this.norY$3*this.tanX$3;
if(
this.norX$3*(this.angAxis1Y$3*this.angAxis2Z$3-this.angAxis1Z$3*this.angAxis2Y$3)+
this.norY$3*(this.angAxis1Z$3*this.angAxis2X$3-this.angAxis1X$3*this.angAxis2Z$3)+
this.norZ$3*(this.angAxis1X$3*this.angAxis2Y$3-this.angAxis1Y$3*this.angAxis2X$3)<0
){
this.hingeAngle$3=-Math.acos(this.angAxis1X$3*this.angAxis2X$3+this.angAxis1Y$3*this.angAxis2Y$3+this.angAxis1Z$3*this.angAxis2Z$3);
}else{
this.hingeAngle$3=Math.acos(this.angAxis1X$3*this.angAxis2X$3+this.angAxis1Y$3*this.angAxis2Y$3+this.angAxis1Z$3*this.angAxis2Z$3);
}
tmpM=this.body1.invertInertia;
this.invI1e00$3=tmpM.e00;
this.invI1e01$3=tmpM.e01;
this.invI1e02$3=tmpM.e02;
this.invI1e10$3=tmpM.e10;
this.invI1e11$3=tmpM.e11;
this.invI1e12$3=tmpM.e12;
this.invI1e20$3=tmpM.e20;
this.invI1e21$3=tmpM.e21;
this.invI1e22$3=tmpM.e22;
tmpM=this.body2.invertInertia;
this.invI2e00$3=tmpM.e00;
this.invI2e01$3=tmpM.e01;
this.invI2e02$3=tmpM.e02;
this.invI2e10$3=tmpM.e10;
this.invI2e11$3=tmpM.e11;
this.invI2e12$3=tmpM.e12;
this.invI2e20$3=tmpM.e20;
this.invI2e21$3=tmpM.e21;
this.invI2e22$3=tmpM.e22;
this.xTorqueUnit1X$3=this.relPos1Z$3*this.invI1e01$3-this.relPos1Y$3*this.invI1e02$3;
this.xTorqueUnit1Y$3=this.relPos1Z$3*this.invI1e11$3-this.relPos1Y$3*this.invI1e12$3;
this.xTorqueUnit1Z$3=this.relPos1Z$3*this.invI1e21$3-this.relPos1Y$3*this.invI1e22$3;
this.xTorqueUnit2X$3=this.relPos2Z$3*this.invI2e01$3-this.relPos2Y$3*this.invI2e02$3;
this.xTorqueUnit2Y$3=this.relPos2Z$3*this.invI2e11$3-this.relPos2Y$3*this.invI2e12$3;
this.xTorqueUnit2Z$3=this.relPos2Z$3*this.invI2e21$3-this.relPos2Y$3*this.invI2e22$3;
this.yTorqueUnit1X$3=-this.relPos1Z$3*this.invI1e00$3+this.relPos1X$3*this.invI1e02$3;
this.yTorqueUnit1Y$3=-this.relPos1Z$3*this.invI1e10$3+this.relPos1X$3*this.invI1e12$3;
this.yTorqueUnit1Z$3=-this.relPos1Z$3*this.invI1e20$3+this.relPos1X$3*this.invI1e22$3;
this.yTorqueUnit2X$3=-this.relPos2Z$3*this.invI2e00$3+this.relPos2X$3*this.invI2e02$3;
this.yTorqueUnit2Y$3=-this.relPos2Z$3*this.invI2e10$3+this.relPos2X$3*this.invI2e12$3;
this.yTorqueUnit2Z$3=-this.relPos2Z$3*this.invI2e20$3+this.relPos2X$3*this.invI2e22$3;
this.zTorqueUnit1X$3=this.relPos1Y$3*this.invI1e00$3-this.relPos1X$3*this.invI1e01$3;
this.zTorqueUnit1Y$3=this.relPos1Y$3*this.invI1e10$3-this.relPos1X$3*this.invI1e11$3;
this.zTorqueUnit1Z$3=this.relPos1Y$3*this.invI1e20$3-this.relPos1X$3*this.invI1e21$3;
this.zTorqueUnit2X$3=this.relPos2Y$3*this.invI2e00$3-this.relPos2X$3*this.invI2e01$3;
this.zTorqueUnit2Y$3=this.relPos2Y$3*this.invI2e10$3-this.relPos2X$3*this.invI2e11$3;
this.zTorqueUnit2Z$3=this.relPos2Y$3*this.invI2e20$3-this.relPos2X$3*this.invI2e21$3;
this.d00$3=this.invM1$3+this.invM2$3;
this.d01$3=0;
this.d02$3=0;
this.d10$3=0;
this.d11$3=this.d00$3;
this.d12$3=0;
this.d20$3=0;
this.d21$3=0;
this.d22$3=this.d00$3;
t01=-this.relPos1Z$3;
t02=this.relPos1Y$3;
t10=this.relPos1Z$3;
t12=-this.relPos1X$3;
t20=-this.relPos1Y$3;
t21=this.relPos1X$3;
u00=this.invI1e01$3*t10+this.invI1e02$3*t20;
u01=this.invI1e00$3*t01+this.invI1e02$3*t21;
u02=this.invI1e00$3*t02+this.invI1e01$3*t12;
u10=this.invI1e11$3*t10+this.invI1e12$3*t20;
u11=this.invI1e10$3*t01+this.invI1e12$3*t21;
u12=this.invI1e10$3*t02+this.invI1e11$3*t12;
u20=this.invI1e21$3*t10+this.invI1e22$3*t20;
u21=this.invI1e20$3*t01+this.invI1e22$3*t21;
u22=this.invI1e20$3*t02+this.invI1e21$3*t12;
this.d00$3-=t01*u10+t02*u20;
this.d01$3-=t01*u11+t02*u21;
this.d02$3-=t01*u12+t02*u22;
this.d10$3-=t10*u00+t12*u20;
this.d11$3-=t10*u01+t12*u21;
this.d12$3-=t10*u02+t12*u22;
this.d20$3-=t20*u00+t21*u10;
this.d21$3-=t20*u01+t21*u11;
this.d22$3-=t20*u02+t21*u12;
t01=-this.relPos2Z$3;
t02=this.relPos2Y$3;
t10=this.relPos2Z$3;
t12=-this.relPos2X$3;
t20=-this.relPos2Y$3;
t21=this.relPos2X$3;
u00=this.invI2e01$3*t10+this.invI2e02$3*t20;
u01=this.invI2e00$3*t01+this.invI2e02$3*t21;
u02=this.invI2e00$3*t02+this.invI2e01$3*t12;
u10=this.invI2e11$3*t10+this.invI2e12$3*t20;
u11=this.invI2e10$3*t01+this.invI2e12$3*t21;
u12=this.invI2e10$3*t02+this.invI2e11$3*t12;
u20=this.invI2e21$3*t10+this.invI2e22$3*t20;
u21=this.invI2e20$3*t01+this.invI2e22$3*t21;
u22=this.invI2e20$3*t02+this.invI2e21$3*t12;
this.d00$3-=t01*u10+t02*u20;
this.d01$3-=t01*u11+t02*u21;
this.d02$3-=t01*u12+t02*u22;
this.d10$3-=t10*u00+t12*u20;
this.d11$3-=t10*u01+t12*u21;
this.d12$3-=t10*u02+t12*u22;
this.d20$3-=t20*u00+t21*u10;
this.d21$3-=t20*u01+t21*u11;
this.d22$3-=t20*u02+t21*u12;
tmp1X=1/(this.d00$3*(this.d11$3*this.d22$3-this.d21$3*this.d12$3)+this.d10$3*(this.d21$3*this.d02$3-this.d01$3*this.d22$3)+this.d20$3*(this.d01$3*this.d12$3-this.d11$3*this.d02$3));
t00=(this.d11$3*this.d22$3-this.d12$3*this.d21$3)*tmp1X;
t01=(this.d02$3*this.d21$3-this.d01$3*this.d22$3)*tmp1X;
t02=(this.d01$3*this.d12$3-this.d02$3*this.d11$3)*tmp1X;
t10=(this.d12$3*this.d20$3-this.d10$3*this.d22$3)*tmp1X;
t11=(this.d00$3*this.d22$3-this.d02$3*this.d20$3)*tmp1X;
t12=(this.d02$3*this.d10$3-this.d00$3*this.d12$3)*tmp1X;
t20=(this.d10$3*this.d21$3-this.d11$3*this.d20$3)*tmp1X;
t21=(this.d01$3*this.d20$3-this.d00$3*this.d21$3)*tmp1X;
t22=(this.d00$3*this.d11$3-this.d01$3*this.d10$3)*tmp1X;
this.d00$3=t00;
this.d01$3=t01;
this.d02$3=t02;
this.d10$3=t10;
this.d11$3=t11;
this.d12$3=t12;
this.d20$3=t20;
this.d21$3=t21;
this.d22$3=t22;
t00=this.invI1e00$3+this.invI2e00$3;
t01=this.invI1e01$3+this.invI2e01$3;
t02=this.invI1e02$3+this.invI2e02$3;
t10=this.invI1e10$3+this.invI2e10$3;
t11=this.invI1e11$3+this.invI2e11$3;
t12=this.invI1e12$3+this.invI2e12$3;
t20=this.invI1e20$3+this.invI2e20$3;
t21=this.invI1e21$3+this.invI2e21$3;
t22=this.invI1e22$3+this.invI2e22$3;
this.invNorDenominator$3=
this.norX$3*(this.norX$3*t00+this.norY$3*t01+this.norZ$3*t02)+
this.norY$3*(this.norX$3*t10+this.norY$3*t11+this.norZ$3*t12)+
this.norZ$3*(this.norX$3*t20+this.norY$3*t21+this.norZ$3*t22)
;
this.norDenominator$3=1/this.invNorDenominator$3;
this.tanDenominator$3=
1/(
this.tanX$3*(this.tanX$3*t00+this.tanY$3*t01+this.tanZ$3*t02)+
this.tanY$3*(this.tanX$3*t10+this.tanY$3*t11+this.tanZ$3*t12)+
this.tanZ$3*(this.tanX$3*t20+this.tanY$3*t21+this.tanZ$3*t22)
)
;
this.binDenominator$3=
1/(
this.binX$3*(this.binX$3*t00+this.binY$3*t01+this.binZ$3*t02)+
this.binY$3*(this.binX$3*t10+this.binY$3*t11+this.binZ$3*t12)+
this.binZ$3*(this.binX$3*t20+this.binY$3*t21+this.binZ$3*t22)
)
;
if(this.enableLimits){
if(this.hingeAngle$3<this.lowerLimit){
if(this.limitSign$3!=-1)this.limitTorque=0;
this.limitSign$3=-1;
}else if(this.hingeAngle$3>this.upperLimit){
if(this.limitSign$3!=1)this.limitTorque=0;
this.limitSign$3=1;
}else{
this.limitSign$3=0;
this.limitTorque=0;
}
}else{
this.limitSign$3=0;
this.limitTorque=0;
}
if(this.enableMotor){
this.stepMotorTorque$3=timeStep*this.maxMotorTorque;
}
this.torqueTan$3*=0.95;
this.torqueBin$3*=0.95;
this.motorTorque*=0.95;
this.limitTorque*=0.95;
tmp1X=this.limitTorque+this.motorTorque;
this.torqueX$3=tmp1X*this.norX$3+this.torqueTan$3*this.tanX$3+this.torqueBin$3*this.binX$3;
this.torqueY$3=tmp1X*this.norY$3+this.torqueTan$3*this.tanY$3+this.torqueBin$3*this.binY$3;
this.torqueZ$3=tmp1X*this.norZ$3+this.torqueTan$3*this.tanZ$3+this.torqueBin$3*this.binZ$3;
this.lVel1$3.x+=this.impulseX$3*this.invM1$3;
this.lVel1$3.y+=this.impulseY$3*this.invM1$3;
this.lVel1$3.z+=this.impulseZ$3*this.invM1$3;
this.aVel1$3.x+=this.xTorqueUnit1X$3*this.impulseX$3+this.yTorqueUnit1X$3*this.impulseY$3+this.zTorqueUnit1X$3*this.impulseZ$3+this.torqueX$3*this.invI1e00$3+this.torqueY$3*this.invI1e01$3+this.torqueZ$3*this.invI1e02$3;
this.aVel1$3.y+=this.xTorqueUnit1Y$3*this.impulseX$3+this.yTorqueUnit1Y$3*this.impulseY$3+this.zTorqueUnit1Y$3*this.impulseZ$3+this.torqueX$3*this.invI1e10$3+this.torqueY$3*this.invI1e11$3+this.torqueZ$3*this.invI1e12$3;
this.aVel1$3.z+=this.xTorqueUnit1Z$3*this.impulseX$3+this.yTorqueUnit1Z$3*this.impulseY$3+this.zTorqueUnit1Z$3*this.impulseZ$3+this.torqueX$3*this.invI1e20$3+this.torqueY$3*this.invI1e21$3+this.torqueZ$3*this.invI1e22$3;
this.lVel2$3.x-=this.impulseX$3*this.invM2$3;
this.lVel2$3.y-=this.impulseY$3*this.invM2$3;
this.lVel2$3.z-=this.impulseZ$3*this.invM2$3;
this.aVel2$3.x-=this.xTorqueUnit2X$3*this.impulseX$3+this.yTorqueUnit2X$3*this.impulseY$3+this.zTorqueUnit2X$3*this.impulseZ$3+this.torqueX$3*this.invI2e00$3+this.torqueY$3*this.invI2e01$3+this.torqueZ$3*this.invI2e02$3;
this.aVel2$3.y-=this.xTorqueUnit2Y$3*this.impulseX$3+this.yTorqueUnit2Y$3*this.impulseY$3+this.zTorqueUnit2Y$3*this.impulseZ$3+this.torqueX$3*this.invI2e10$3+this.torqueY$3*this.invI2e11$3+this.torqueZ$3*this.invI2e12$3;
this.aVel2$3.z-=this.xTorqueUnit2Z$3*this.impulseX$3+this.yTorqueUnit2Z$3*this.impulseY$3+this.zTorqueUnit2Z$3*this.impulseZ$3+this.torqueX$3*this.invI2e20$3+this.torqueY$3*this.invI2e21$3+this.torqueZ$3*this.invI2e22$3;
this.targetVelX$3=this.anchorPosition2.x-this.anchorPosition1.x;
this.targetVelY$3=this.anchorPosition2.y-this.anchorPosition1.y;
this.targetVelZ$3=this.anchorPosition2.z-this.anchorPosition1.z;
tmp1X=Math.sqrt(this.targetVelX$3*this.targetVelX$3+this.targetVelY$3*this.targetVelY$3+this.targetVelZ$3*this.targetVelZ$3);
if(tmp1X<0.005){
this.targetVelX$3=0;
this.targetVelY$3=0;
this.targetVelZ$3=0;
}else{
tmp1X=(0.005-tmp1X)/tmp1X*invTimeStep*0.05;
this.targetVelX$3*=tmp1X;
this.targetVelY$3*=tmp1X;
this.targetVelZ$3*=tmp1X;
}
tmp1X=this.axis2Y$3*this.axis1Z$3-this.axis2Z$3*this.axis1Y$3;
tmp1Y=this.axis2Z$3*this.axis1X$3-this.axis2X$3*this.axis1Z$3;
tmp1Z=this.axis2X$3*this.axis1Y$3-this.axis2Y$3*this.axis1X$3;
this.targetAngVelTan$3=this.tanX$3*tmp1X+this.tanY$3*tmp1Y+this.tanZ$3*tmp1Z;
if(this.targetAngVelTan$3>0.02)this.targetAngVelTan$3=(this.targetAngVelTan$3-0.02)*invTimeStep*0.05;
else if(this.targetAngVelTan$3<-0.02)this.targetAngVelTan$3=(this.targetAngVelTan$3+0.02)*invTimeStep*0.05;
else this.targetAngVelTan$3=0;
this.targetAngVelBin$3=this.binX$3*tmp1X+this.binY$3*tmp1Y+this.binZ$3*tmp1Z;
if(this.targetAngVelBin$3>0.02)this.targetAngVelBin$3=(this.targetAngVelBin$3-0.02)*invTimeStep*0.05;
else if(this.targetAngVelBin$3<-0.02)this.targetAngVelBin$3=(this.targetAngVelBin$3+0.02)*invTimeStep*0.05;
else this.targetAngVelBin$3=0;
if(this.limitSign$3==-1){
this.targetAngVelNor$3=this.lowerLimit-this.hingeAngle$3;
if(this.targetAngVelNor$3<0.02)this.targetAngVelNor$3=0;
else this.targetAngVelNor$3=(this.targetAngVelNor$3-0.02)*invTimeStep*0.05;
}else if(this.limitSign$3==1){
this.targetAngVelNor$3=this.upperLimit-this.hingeAngle$3;
if(this.targetAngVelNor$3>-0.02)this.targetAngVelNor$3=0;
else this.targetAngVelNor$3=(this.targetAngVelNor$3+0.02)*invTimeStep*0.05;
}else{
this.targetAngVelNor$3=0;
}
},
"override public function solve",function(){
var relVelX;
var relVelY;
var relVelZ;
var tmp;
var newImpulseX;
var newImpulseY;
var newImpulseZ;
var newTorqueTan;
var newTorqueBin;
var oldMotorTorque;
var newMotorTorque;
var oldLimitTorque;
var newLimitTorque;
relVelX=this.lVel2$3.x-this.lVel1$3.x+this.aVel2$3.y*this.relPos2Z$3-this.aVel2$3.z*this.relPos2Y$3-this.aVel1$3.y*this.relPos1Z$3+this.aVel1$3.z*this.relPos1Y$3-this.targetVelX$3;
relVelY=this.lVel2$3.y-this.lVel1$3.y+this.aVel2$3.z*this.relPos2X$3-this.aVel2$3.x*this.relPos2Z$3-this.aVel1$3.z*this.relPos1X$3+this.aVel1$3.x*this.relPos1Z$3-this.targetVelY$3;
relVelZ=this.lVel2$3.z-this.lVel1$3.z+this.aVel2$3.x*this.relPos2Y$3-this.aVel2$3.y*this.relPos2X$3-this.aVel1$3.x*this.relPos1Y$3+this.aVel1$3.y*this.relPos1X$3-this.targetVelZ$3;
newImpulseX=relVelX*this.d00$3+relVelY*this.d01$3+relVelZ*this.d02$3;
newImpulseY=relVelX*this.d10$3+relVelY*this.d11$3+relVelZ*this.d12$3;
newImpulseZ=relVelX*this.d20$3+relVelY*this.d21$3+relVelZ*this.d22$3;
this.impulseX$3+=newImpulseX;
this.impulseY$3+=newImpulseY;
this.impulseZ$3+=newImpulseZ;
this.lVel1$3.x+=newImpulseX*this.invM1$3;
this.lVel1$3.y+=newImpulseY*this.invM1$3;
this.lVel1$3.z+=newImpulseZ*this.invM1$3;
this.aVel1$3.x+=this.xTorqueUnit1X$3*newImpulseX+this.yTorqueUnit1X$3*newImpulseY+this.zTorqueUnit1X$3*newImpulseZ;
this.aVel1$3.y+=this.xTorqueUnit1Y$3*newImpulseX+this.yTorqueUnit1Y$3*newImpulseY+this.zTorqueUnit1Y$3*newImpulseZ;
this.aVel1$3.z+=this.xTorqueUnit1Z$3*newImpulseX+this.yTorqueUnit1Z$3*newImpulseY+this.zTorqueUnit1Z$3*newImpulseZ;
this.lVel2$3.x-=newImpulseX*this.invM2$3;
this.lVel2$3.y-=newImpulseY*this.invM2$3;
this.lVel2$3.z-=newImpulseZ*this.invM2$3;
this.aVel2$3.x-=this.xTorqueUnit2X$3*newImpulseX+this.yTorqueUnit2X$3*newImpulseY+this.zTorqueUnit2X$3*newImpulseZ;
this.aVel2$3.y-=this.xTorqueUnit2Y$3*newImpulseX+this.yTorqueUnit2Y$3*newImpulseY+this.zTorqueUnit2Y$3*newImpulseZ;
this.aVel2$3.z-=this.xTorqueUnit2Z$3*newImpulseX+this.yTorqueUnit2Z$3*newImpulseY+this.zTorqueUnit2Z$3*newImpulseZ;
relVelX=this.aVel2$3.x-this.aVel1$3.x;
relVelY=this.aVel2$3.y-this.aVel1$3.y;
relVelZ=this.aVel2$3.z-this.aVel1$3.z;
tmp=relVelX*this.norX$3+relVelY*this.norY$3+relVelZ*this.norZ$3;
if(this.enableMotor){
newMotorTorque=(tmp-this.motorSpeed)*this.norDenominator$3;
oldMotorTorque=this.motorTorque;
this.motorTorque+=newMotorTorque;
if(this.motorTorque>this.stepMotorTorque$3)this.motorTorque=this.stepMotorTorque$3;
else if(this.motorTorque<-this.stepMotorTorque$3)this.motorTorque=-this.stepMotorTorque$3;
newMotorTorque=this.motorTorque-oldMotorTorque;
tmp-=newMotorTorque*this.invNorDenominator$3;
}else newMotorTorque=0;
if(this.limitSign$3!=0){
newLimitTorque=(tmp-this.targetAngVelNor$3)*this.norDenominator$3;
oldLimitTorque=this.limitTorque;
this.limitTorque+=newLimitTorque;
if(this.limitTorque*this.limitSign$3<0)this.limitTorque=0;
newLimitTorque=this.limitTorque-oldLimitTorque;
}else newLimitTorque=0;
tmp=newMotorTorque+newLimitTorque;
newTorqueTan=(relVelX*this.tanX$3+relVelY*this.tanY$3+relVelZ*this.tanZ$3-this.targetAngVelTan$3)*this.tanDenominator$3;
newTorqueBin=(relVelX*this.binX$3+relVelY*this.binY$3+relVelZ*this.binZ$3-this.targetAngVelBin$3)*this.binDenominator$3;
this.torqueTan$3+=newTorqueTan;
this.torqueBin$3+=newTorqueBin;
newImpulseX=tmp*this.norX$3+newTorqueTan*this.tanX$3+newTorqueBin*this.binX$3;
newImpulseY=tmp*this.norY$3+newTorqueTan*this.tanY$3+newTorqueBin*this.binY$3;
newImpulseZ=tmp*this.norZ$3+newTorqueTan*this.tanZ$3+newTorqueBin*this.binZ$3;
this.aVel1$3.x+=this.invI1e00$3*newImpulseX+this.invI1e01$3*newImpulseY+this.invI1e02$3*newImpulseZ;
this.aVel1$3.y+=this.invI1e10$3*newImpulseX+this.invI1e11$3*newImpulseY+this.invI1e12$3*newImpulseZ;
this.aVel1$3.z+=this.invI1e20$3*newImpulseX+this.invI1e21$3*newImpulseY+this.invI1e22$3*newImpulseZ;
this.aVel2$3.x-=this.invI2e00$3*newImpulseX+this.invI2e01$3*newImpulseY+this.invI2e02$3*newImpulseZ;
this.aVel2$3.y-=this.invI2e10$3*newImpulseX+this.invI2e11$3*newImpulseY+this.invI2e12$3*newImpulseZ;
this.aVel2$3.z-=this.invI2e20$3*newImpulseX+this.invI2e21$3*newImpulseY+this.invI2e22$3*newImpulseZ;
},
"override public function postSolve",function(){
this.impulse.x=this.impulseX$3;
this.impulse.y=this.impulseY$3;
this.impulse.z=this.impulseZ$3;
this.torque.x=this.torqueX$3;
this.torque.y=this.torqueY$3;
this.torque.z=this.torqueZ$3;
},
];},[],["com.element.oimo.physics.constraint.joint.Joint","com.element.oimo.math.Vec3","Math"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.constraint.joint.Joint
joo.classLoader.prepare(
"package com.element.oimo.physics.constraint.joint",
"public class Joint extends com.element.oimo.physics.constraint.Constraint",2,function($$private){;return[
"public static const",{JOINT_NULL:0x0},
"public static const",{JOINT_DISTANCE:0x1},
"public static const",{JOINT_BALL:0x2},
"public static const",{JOINT_HINGE:0x3},
"public static const",{JOINT_HINGE2:0x4},
"public var",{type:0},
"public var",{allowCollision:false},
"public var",{localRelativeAnchorPosition1:null},
"public var",{localRelativeAnchorPosition2:null},
"public var",{relativeAnchorPosition1:null},
"public var",{relativeAnchorPosition2:null},
"public var",{anchorPosition1:null},
"public var",{anchorPosition2:null},
"public var",{connection1:null},
"public var",{connection2:null},
"public function Joint",function(){this.super$2();
this.localRelativeAnchorPosition1=new com.element.oimo.math.Vec3();
this.localRelativeAnchorPosition2=new com.element.oimo.math.Vec3();
this.relativeAnchorPosition1=new com.element.oimo.math.Vec3();
this.relativeAnchorPosition2=new com.element.oimo.math.Vec3();
this.anchorPosition1=new com.element.oimo.math.Vec3();
this.anchorPosition2=new com.element.oimo.math.Vec3();
this.connection1=new com.element.oimo.physics.constraint.joint.JointConnection(this);
this.connection2=new com.element.oimo.physics.constraint.joint.JointConnection(this);
},
"override public function preSolve",function(timeStep,invTimeStep){
this.preSolve$2(timeStep,invTimeStep);
},
"override public function solve",function(){
this.solve$2();
},
"override public function postSolve",function(){
this.postSolve$2();
},
];},[],["com.element.oimo.physics.constraint.Constraint","com.element.oimo.math.Vec3","com.element.oimo.physics.constraint.joint.JointConnection"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.constraint.joint.JointConfig
joo.classLoader.prepare(
"package com.element.oimo.physics.constraint.joint",
"public class JointConfig",1,function($$private){;return[
"public var",{localRelativeAnchorPosition1:null},
"public var",{localRelativeAnchorPosition2:null},
"public var",{localAxis1:null},
"public var",{localAxis2:null},
"public var",{allowCollision:false},
"public function JointConfig",function(){
this.localRelativeAnchorPosition1=new com.element.oimo.math.Vec3();
this.localRelativeAnchorPosition2=new com.element.oimo.math.Vec3();
this.localAxis1=new com.element.oimo.math.Vec3();
this.localAxis2=new com.element.oimo.math.Vec3();
},
];},[],["com.element.oimo.math.Vec3"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.constraint.joint.JointConnection
joo.classLoader.prepare("package com.element.oimo.physics.constraint.joint",
"public class JointConnection",1,function($$private){;return[
"public var",{prev:null},
"public var",{next:null},
"public var",{connected:null},
"public var",{parent:null},
"public function JointConnection",function(parent){
this.parent=parent;
},
];},[],[], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.dynamics.RigidBody
joo.classLoader.prepare(
"package com.element.oimo.physics.dynamics",
"public class RigidBody",1,function($$private){;return[
"public static const",{BODY_DYNAMIC:0x0},
"public static const",{BODY_STATIC:0x1},
"public static const",{MAX_SHAPES:64},
"public var",{type:0},
"public var",{position:null},
"public var",{orientation:null},
"public var",{sleepPosition:null},
"public var",{sleepOrientation:null},
"public var",{linearVelocity:null},
"public var",{angularVelocity:null},
"public var",{rotation:null},
"public var",{mass:NaN},
"public var",{invertMass:NaN},
"public var",{invertInertia:null},
"public var",{localInertia:null},
"public var",{invertLocalInertia:null},
"public const",{shapes:function(){return([]);}},
"public var",{numShapes:0},
"public var",{parent:null},
"public var",{contactList:null},
"public var",{jointList:null},
"public var",{numJoints:0},
"public var",{addedToIsland:false},
"public var",{sleepTime:NaN},
"public var",{sleeping:false},
"public var",{allowSleep:false},
"public function RigidBody",function(rad,ax,ay,az){if(arguments.length<4){if(arguments.length<3){if(arguments.length<2){if(arguments.length<1){rad=0;}ax=0;}ay=0;}az=0;}this.shapes=this.shapes();
this.position=new com.element.oimo.math.Vec3();
var len=ax*ax+ay*ay+az*az;
if(len>0){
len=1/Math.sqrt(len);
ax*=len;
ay*=len;
az*=len;
}
var sin=Math.sin(rad*0.5);
var cos=Math.cos(rad*0.5);
this.orientation=new com.element.oimo.math.Quat(cos,sin*ax,sin*ay,sin*az);
this.linearVelocity=new com.element.oimo.math.Vec3();
this.angularVelocity=new com.element.oimo.math.Vec3();
this.sleepPosition=new com.element.oimo.math.Vec3();
this.sleepOrientation=new com.element.oimo.math.Quat();
this.rotation=new com.element.oimo.math.Mat33();
this.invertInertia=new com.element.oimo.math.Mat33();
this.localInertia=new com.element.oimo.math.Mat33();
this.invertLocalInertia=new com.element.oimo.math.Mat33();
this.allowSleep=true;
this.sleepTime=0;
},
"public function addShape",function(shape){
if(this.numShapes==com.element.oimo.physics.dynamics.RigidBody.MAX_SHAPES){
throw new Error("It is not possible to add a shape to the more rigid");
}
if(shape.parent){
throw new Error("It is not possible that you add to the multi-rigid body the shape of one");
}
this.shapes[this.numShapes++]=shape;
shape.parent=this;
if(this.parent)this.parent.addShape(shape);
},
"public function removeShape",function(shape,index){if(arguments.length<2){index=-1;}
if(index<0){
for(var i=0;i<this.numShapes;i++){
if(shape==this.shapes[i]){
index=i;
break;
}
}
if(index==-1){
return;
}
}else if(index>=this.numShapes){
throw new Error("The index of the shape you want to delete is out of range");
}
var remove=this.shapes[index];
remove.parent=null;
if(this.parent)this.parent.removeShape(remove);
this.numShapes--;
for(var j=index;j<this.numShapes;j++){
this.shapes[j]=this.shapes[j+1];
}
this.shapes[this.numShapes]=null;
},
"public function setupMass",function(type){if(arguments.length<1){type=com.element.oimo.physics.dynamics.RigidBody.BODY_DYNAMIC;}
this.type=type;
this.position.init();
this.mass=0;
this.localInertia.init(0,0,0,0,0,0,0,0,0);
var invRot=new com.element.oimo.math.Mat33();
invRot.transpose(this.rotation);
var tmpM=new com.element.oimo.math.Mat33();
var tmpV=new com.element.oimo.math.Vec3();
var denom=0;
for(var i=0;i<this.numShapes;i++){
var shape=this.shapes[i];
shape.relativeRotation.mul(invRot,shape.rotation);
this.position.add(this.position,tmpV.scale(shape.position,shape.mass));
denom+=shape.mass;
this.mass+=shape.mass;
tmpM.mul(shape.relativeRotation,tmpM.mul(shape.localInertia,tmpM.transpose(shape.relativeRotation)));
this.localInertia.add(this.localInertia,tmpM);
}
this.position.scale(this.position,1/denom);
this.invertMass=1/this.mass;
var xy=0;
var yz=0;
var zx=0;
for(var j=0;j<this.numShapes;j++){
shape=this.shapes[j];
var relPos=shape.localRelativePosition;
relPos.sub(shape.position,this.position).mulMat(invRot,relPos);
shape.updateProxy();
this.localInertia.e00+=shape.mass*(relPos.y*relPos.y+relPos.z*relPos.z);
this.localInertia.e11+=shape.mass*(relPos.x*relPos.x+relPos.z*relPos.z);
this.localInertia.e22+=shape.mass*(relPos.x*relPos.x+relPos.y*relPos.y);
xy-=shape.mass*relPos.x*relPos.y;
yz-=shape.mass*relPos.y*relPos.z;
zx-=shape.mass*relPos.z*relPos.x;
}
this.localInertia.e01=xy;
this.localInertia.e10=xy;
this.localInertia.e02=zx;
this.localInertia.e20=zx;
this.localInertia.e12=yz;
this.localInertia.e21=yz;
this.invertLocalInertia.invert(this.localInertia);
if(type==com.element.oimo.physics.dynamics.RigidBody.BODY_STATIC){
this.invertMass=0;
this.invertLocalInertia.init(0,0,0,0,0,0,0,0,0);
}
var r00=this.rotation.e00;
var r01=this.rotation.e01;
var r02=this.rotation.e02;
var r10=this.rotation.e10;
var r11=this.rotation.e11;
var r12=this.rotation.e12;
var r20=this.rotation.e20;
var r21=this.rotation.e21;
var r22=this.rotation.e22;
var i00=this.invertLocalInertia.e00;
var i01=this.invertLocalInertia.e01;
var i02=this.invertLocalInertia.e02;
var i10=this.invertLocalInertia.e10;
var i11=this.invertLocalInertia.e11;
var i12=this.invertLocalInertia.e12;
var i20=this.invertLocalInertia.e20;
var i21=this.invertLocalInertia.e21;
var i22=this.invertLocalInertia.e22;
var e00=r00*i00+r01*i10+r02*i20;
var e01=r00*i01+r01*i11+r02*i21;
var e02=r00*i02+r01*i12+r02*i22;
var e10=r10*i00+r11*i10+r12*i20;
var e11=r10*i01+r11*i11+r12*i21;
var e12=r10*i02+r11*i12+r12*i22;
var e20=r20*i00+r21*i10+r22*i20;
var e21=r20*i01+r21*i11+r22*i21;
var e22=r20*i02+r21*i12+r22*i22;
this.invertInertia.e00=e00*r00+e01*r01+e02*r02;
this.invertInertia.e01=e00*r10+e01*r11+e02*r12;
this.invertInertia.e02=e00*r20+e01*r21+e02*r22;
this.invertInertia.e10=e10*r00+e11*r01+e12*r02;
this.invertInertia.e11=e10*r10+e11*r11+e12*r12;
this.invertInertia.e12=e10*r20+e11*r21+e12*r22;
this.invertInertia.e20=e20*r00+e21*r01+e22*r02;
this.invertInertia.e21=e20*r10+e21*r11+e22*r12;
this.invertInertia.e22=e20*r20+e21*r21+e22*r22;
this.syncShapes$1();
this.awake();
},
"public function awake",function(){
if(!this.allowSleep)return;
this.sleepTime=0;
if(this.sleeping){
var cc=this.contactList;
while(cc!=null){
cc.connectedBody.sleepTime=0;
cc.connectedBody.sleeping=false;
cc.parent.sleeping=false;
cc=cc.next;
}
var jc=this.jointList;
while(jc!=null){
jc.connected.sleepTime=0;
jc.connected.sleeping=false;
jc.parent.sleeping=false;
jc=jc.next;
}
}
this.sleeping=false;
},
"public function sleep",function(){
if(!this.allowSleep)return;
this.linearVelocity.init();
this.angularVelocity.init();
this.sleepPosition.copy(this.position);
this.sleepOrientation.copy(this.orientation);
this.sleepTime=0;
this.sleeping=true;
},
"public function updateVelocity",function(timeStep,gravity){
if(this.type==com.element.oimo.physics.dynamics.RigidBody.BODY_DYNAMIC){
this.linearVelocity.x+=gravity.x*timeStep;
this.linearVelocity.y+=gravity.y*timeStep;
this.linearVelocity.z+=gravity.z*timeStep;
}
},
"public function updatePosition",function(timeStep){
if(!this.allowSleep)this.sleepTime=0;
if(this.type==com.element.oimo.physics.dynamics.RigidBody.BODY_STATIC){
this.linearVelocity.x=0;
this.linearVelocity.y=0;
this.linearVelocity.z=0;
this.angularVelocity.x=0;
this.angularVelocity.y=0;
this.angularVelocity.z=0;
}else if(this.type==com.element.oimo.physics.dynamics.RigidBody.BODY_DYNAMIC){
var vx=this.linearVelocity.x;
var vy=this.linearVelocity.y;
var vz=this.linearVelocity.z;
if(vx*vx+vy*vy+vz*vz>0.01)this.sleepTime=0;
this.position.x+=vx*timeStep;
this.position.y+=vy*timeStep;
this.position.z+=vz*timeStep;
vx=this.angularVelocity.x;
vy=this.angularVelocity.y;
vz=this.angularVelocity.z;
if(vx*vx+vy*vy+vz*vz>0.025)this.sleepTime=0;
var os=this.orientation.s;
var ox=this.orientation.x;
var oy=this.orientation.y;
var oz=this.orientation.z;
timeStep*=0.5;
var s=(-vx*ox-vy*oy-vz*oz)*timeStep;
var x=(vx*os+vy*oz-vz*oy)*timeStep;
var y=(-vx*oz+vy*os+vz*ox)*timeStep;
var z=(vx*oy-vy*ox+vz*os)*timeStep;
os+=s;
ox+=x;
oy+=y;
oz+=z;
s=1/Math.sqrt(os*os+ox*ox+oy*oy+oz*oz);
this.orientation.s=os*s;
this.orientation.x=ox*s;
this.orientation.y=oy*s;
this.orientation.z=oz*s;
}else{
throw new Error("The type of rigid body of undefined");
}
this.syncShapes$1();
},
"private function syncShapes",function(){
var s=this.orientation.s;
var x=this.orientation.x;
var y=this.orientation.y;
var z=this.orientation.z;
var x2=2*x;
var y2=2*y;
var z2=2*z;
var xx=x*x2;
var yy=y*y2;
var zz=z*z2;
var xy=x*y2;
var yz=y*z2;
var xz=x*z2;
var sx=s*x2;
var sy=s*y2;
var sz=s*z2;
this.rotation.e00=1-yy-zz;
this.rotation.e01=xy-sz;
this.rotation.e02=xz+sy;
this.rotation.e10=xy+sz;
this.rotation.e11=1-xx-zz;
this.rotation.e12=yz-sx;
this.rotation.e20=xz-sy;
this.rotation.e21=yz+sx;
this.rotation.e22=1-xx-yy;
var r00=this.rotation.e00;
var r01=this.rotation.e01;
var r02=this.rotation.e02;
var r10=this.rotation.e10;
var r11=this.rotation.e11;
var r12=this.rotation.e12;
var r20=this.rotation.e20;
var r21=this.rotation.e21;
var r22=this.rotation.e22;
var i00=this.invertLocalInertia.e00;
var i01=this.invertLocalInertia.e01;
var i02=this.invertLocalInertia.e02;
var i10=this.invertLocalInertia.e10;
var i11=this.invertLocalInertia.e11;
var i12=this.invertLocalInertia.e12;
var i20=this.invertLocalInertia.e20;
var i21=this.invertLocalInertia.e21;
var i22=this.invertLocalInertia.e22;
var e00=r00*i00+r01*i10+r02*i20;
var e01=r00*i01+r01*i11+r02*i21;
var e02=r00*i02+r01*i12+r02*i22;
var e10=r10*i00+r11*i10+r12*i20;
var e11=r10*i01+r11*i11+r12*i21;
var e12=r10*i02+r11*i12+r12*i22;
var e20=r20*i00+r21*i10+r22*i20;
var e21=r20*i01+r21*i11+r22*i21;
var e22=r20*i02+r21*i12+r22*i22;
this.invertInertia.e00=e00*r00+e01*r01+e02*r02;
this.invertInertia.e01=e00*r10+e01*r11+e02*r12;
this.invertInertia.e02=e00*r20+e01*r21+e02*r22;
this.invertInertia.e10=e10*r00+e11*r01+e12*r02;
this.invertInertia.e11=e10*r10+e11*r11+e12*r12;
this.invertInertia.e12=e10*r20+e11*r21+e12*r22;
this.invertInertia.e20=e20*r00+e21*r01+e22*r02;
this.invertInertia.e21=e20*r10+e21*r11+e22*r12;
this.invertInertia.e22=e20*r20+e21*r21+e22*r22;
for(var i=0;i<this.numShapes;i++){
var shape=this.shapes[i];
var relPos=shape.relativePosition;
var lRelPos=shape.localRelativePosition;
var relRot=shape.relativeRotation;
var rot=shape.rotation;
var lx=lRelPos.x;
var ly=lRelPos.y;
var lz=lRelPos.z;
relPos.x=lx*r00+ly*r01+lz*r02;
relPos.y=lx*r10+ly*r11+lz*r12;
relPos.z=lx*r20+ly*r21+lz*r22;
shape.position.x=this.position.x+relPos.x;
shape.position.y=this.position.y+relPos.y;
shape.position.z=this.position.z+relPos.z;
e00=relRot.e00;
e01=relRot.e01;
e02=relRot.e02;
e10=relRot.e10;
e11=relRot.e11;
e12=relRot.e12;
e20=relRot.e20;
e21=relRot.e21;
e22=relRot.e22;
rot.e00=r00*e00+r01*e10+r02*e20;
rot.e01=r00*e01+r01*e11+r02*e21;
rot.e02=r00*e02+r01*e12+r02*e22;
rot.e10=r10*e00+r11*e10+r12*e20;
rot.e11=r10*e01+r11*e11+r12*e21;
rot.e12=r10*e02+r11*e12+r12*e22;
rot.e20=r20*e00+r21*e10+r22*e20;
rot.e21=r20*e01+r21*e11+r22*e21;
rot.e22=r20*e02+r21*e12+r22*e22;
shape.updateProxy();
}
},
"public function applyImpulse",function(position,force){
this.linearVelocity.x+=force.x*this.invertMass;
this.linearVelocity.y+=force.y*this.invertMass;
this.linearVelocity.z+=force.z*this.invertMass;
var rel=new com.element.oimo.math.Vec3();
rel.sub(position,this.position).cross(rel,force).mulMat(this.invertInertia,rel);
this.angularVelocity.x+=rel.x;
this.angularVelocity.y+=rel.y;
this.angularVelocity.z+=rel.z;
},
];},[],["com.element.oimo.math.Vec3","Math","com.element.oimo.math.Quat","com.element.oimo.math.Mat33","Error"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.dynamics.World
joo.classLoader.prepare("package com.element.oimo.physics.dynamics",
"public class World",1,function($$private){;return[function(){joo.classLoader.init(com.element.oimo.physics.collision.shape.Shape,com.element.oimo.physics.dynamics.RigidBody);},
"public static const",{MAX_BODIES:16384},
"public static const",{MAX_SHAPES:32768},
"public static const",{MAX_CONTACTS:65536},
"public static const",{MAX_JOINTS:16384},
"private static const",{MAX_CONSTRAINTS:function(){return(com.element.oimo.physics.dynamics.World.MAX_CONTACTS+com.element.oimo.physics.dynamics.World.MAX_JOINTS);}},
"public const",{rigidBodies:function(){return([]);}},
"public var",{numRigidBodies:0},
"public const",{shapes:function(){return([]);}},
"public var",{numShapes:0},
"public var",{contacts:null},
"private var",{prevContacts:null},
"private var",{contactPool1:function(){return([]);}},
"private var",{contactPool2:function(){return([]);}},
"public var",{numContacts:0},
"public var",{numPrevContacts1:0},
"public var",{numPrevContacts2:0},
"public const",{joints:function(){return([]);}},
"public var",{numJoints:0},
"public var",{numIslands:0},
"private const",{constraints:function(){return([]);}},
"private var",{numConstraints:0},
"public var",{timeStep:NaN},
"public var",{gravity:null},
"public var",{iteration:0},
"public var",{performance:null},
"public var",{broadPhase:null},
"private var",{detectors:null},
"private const",{collisionResult:function(){return(new com.element.oimo.physics.collision.narrow.CollisionResult(com.element.oimo.physics.dynamics.World.MAX_CONTACTS));}},
"private const",{islandStack:function(){return([]);}},
"private const",{islandRigidBodies:function(){return([]);}},
"private var",{islandNumRigidBodies:0},
"private const",{islandConstraints:function(){return([]);}},
"private var",{islandNumConstraints:0},
"private var",{randX:0},
"private var",{randA:0},
"private var",{randB:0},
"public function World",function(stepPerSecond){if(arguments.length<1){stepPerSecond=60;}this.rigidBodies=this.rigidBodies();this.shapes=this.shapes();this.contactPool1$1=this.contactPool1$1();this.contactPool2$1=this.contactPool2$1();this.joints=this.joints();this.constraints$1=this.constraints$1();this.collisionResult$1=this.collisionResult$1();this.islandStack$1=this.islandStack$1();this.islandRigidBodies$1=this.islandRigidBodies$1();this.islandConstraints$1=this.islandConstraints$1();
this.timeStep=1/stepPerSecond;
this.iteration=8;
this.gravity=new com.element.oimo.math.Vec3(0,-9.80665,0);
this.performance=new com.element.oimo.physics.util.Performance();
this.broadPhase=new com.element.oimo.physics.collision.broad.SweepAndPruneBroadPhase();
var numShapeTypes=4;
this.detectors$1=[];
for(var i=0;i<numShapeTypes;i++){
this.detectors$1[i]=[];
}
this.detectors$1[com.element.oimo.physics.collision.shape.Shape.SHAPE_SPHERE][com.element.oimo.physics.collision.shape.Shape.SHAPE_SPHERE]=new com.element.oimo.physics.collision.narrow.SphereSphereCollisionDetector();
this.detectors$1[com.element.oimo.physics.collision.shape.Shape.SHAPE_SPHERE][com.element.oimo.physics.collision.shape.Shape.SHAPE_BOX]=new com.element.oimo.physics.collision.narrow.SphereBoxCollisionDetector(false);
this.detectors$1[com.element.oimo.physics.collision.shape.Shape.SHAPE_SPHERE][com.element.oimo.physics.collision.shape.Shape.SHAPE_CYLINDER]=new com.element.oimo.physics.collision.narrow.SphereCylinderCollisionDetector(false);
this.detectors$1[com.element.oimo.physics.collision.shape.Shape.SHAPE_BOX][com.element.oimo.physics.collision.shape.Shape.SHAPE_SPHERE]=new com.element.oimo.physics.collision.narrow.SphereBoxCollisionDetector(true);
this.detectors$1[com.element.oimo.physics.collision.shape.Shape.SHAPE_BOX][com.element.oimo.physics.collision.shape.Shape.SHAPE_BOX]=new com.element.oimo.physics.collision.narrow.BoxBoxCollisionDetector();
this.detectors$1[com.element.oimo.physics.collision.shape.Shape.SHAPE_CYLINDER][com.element.oimo.physics.collision.shape.Shape.SHAPE_SPHERE]=new com.element.oimo.physics.collision.narrow.SphereCylinderCollisionDetector(true);
this.detectors$1[com.element.oimo.physics.collision.shape.Shape.SHAPE_BOX][com.element.oimo.physics.collision.shape.Shape.SHAPE_CYLINDER]=new com.element.oimo.physics.collision.narrow.BoxCylinderCollisionDetector(false);
this.detectors$1[com.element.oimo.physics.collision.shape.Shape.SHAPE_CYLINDER][com.element.oimo.physics.collision.shape.Shape.SHAPE_BOX]=new com.element.oimo.physics.collision.narrow.BoxCylinderCollisionDetector(true);
this.detectors$1[com.element.oimo.physics.collision.shape.Shape.SHAPE_CYLINDER][com.element.oimo.physics.collision.shape.Shape.SHAPE_CYLINDER]=new com.element.oimo.physics.collision.narrow.CylinderCylinderCollisionDetector();
this.contacts=this.contactPool1$1;
this.prevContacts$1=this.contactPool2$1;
this.randX$1=65535;
this.randA$1=98765;
this.randB$1=123456789;
},
"public function addRigidBody",function(rigidBody){
if(this.numRigidBodies==com.element.oimo.physics.dynamics.World.MAX_BODIES){
throw new Error("It is not possible to add a rigid body to the world any more");
}
if(rigidBody.parent){
throw new Error("It is not possible to be added to more than one world one of the rigid body");
}
rigidBody.awake();
var num=rigidBody.numShapes;
for(var i=0;i<num;i++){
this.addShape(rigidBody.shapes[i]);
}
this.rigidBodies[this.numRigidBodies++]=rigidBody;
rigidBody.parent=this;
},
"public function removeRigidBody",function(rigidBody){
var remove=null;
for(var i=0;i<this.numRigidBodies;i++){
if(this.rigidBodies[i]==rigidBody){
remove=rigidBody;
this.rigidBodies[i]=this.rigidBodies[--this.numRigidBodies];
this.rigidBodies[this.numRigidBodies]=null;
break;
}
}
if(remove==null)return;
remove.awake();
var jc=remove.jointList;
while(jc!=null){
var joint=jc.parent;
jc=jc.next;
this.removeJoint(joint);
}
var num=remove.numShapes;
for(i=0;i<num;i++){
this.removeShape(remove.shapes[i]);
}
remove.parent=null;
},
"public function addShape",function(shape){
if(this.numShapes==com.element.oimo.physics.dynamics.World.MAX_SHAPES){
throw new Error("It is not possible to add a shape to the world any more");
}
if(!shape.parent){
throw new Error("It is not possible to be added alone to shape world");
}
if(shape.parent.parent){
throw new Error("It is not possible to be added to multiple world the shape of one");
}
this.broadPhase.addProxy(shape.proxy);
this.shapes[this.numShapes++]=shape;
},
"public function removeShape",function(shape){
var remove=null;
for(var i=0;i<this.numShapes;i++){
if(this.shapes[i]==shape){
remove=shape;
this.shapes[i]=this.shapes[--this.numShapes];
this.shapes[this.numShapes]=null;
break;
}
}
if(remove==null)return;
this.broadPhase.removeProxy(remove.proxy);
},
"public function addJoint",function(joint){
if(this.numJoints==com.element.oimo.physics.dynamics.World.MAX_JOINTS){
throw new Error("It is not possible to add a joint to the world any more");
}
if(joint.parent){
throw new Error("It is not possible to be added to more than one world one of the joint");
}
var b=joint.body1;
var jc=joint.connection1;
b.awake();
b.numJoints++;
jc.next=b.jointList;
if(b.jointList!=null){
b.jointList.prev=jc;
}
b.jointList=jc;
b=joint.body2;
jc=joint.connection2;
b.awake();
b.numJoints++;
jc.next=b.jointList;
if(b.jointList!=null){
b.jointList.prev=jc;
}
b.jointList=jc;
this.joints[this.numJoints++]=joint;
joint.parent=this;
},
"public function removeJoint",function(joint){
var remove=null;
for(var i=0;i<this.numJoints;i++){
if(this.joints[i]==joint){
remove=joint;
this.joints[i]=this.joints[--this.numJoints];
this.joints[this.numJoints]=null;
break;
}
}
if(remove==null)return;
remove.body1.awake();
remove.body1.numJoints--;
remove.body2.awake();
remove.body2.numJoints--;
var jc=remove.connection1;
if(jc.prev!=null){
jc.prev.next=jc.next;
jc.prev=null;
}
if(jc.next!=null){
jc.next.prev=jc.prev;
jc.next=null;
}
jc=remove.connection2;
if(jc.prev!=null){
jc.prev.next=jc.next;
jc.prev=null;
}
if(jc.next!=null){
jc.next.prev=jc.prev;
jc.next=null;
}
remove.parent=null;
},
"public function step",function(){
var time1=Date.now();
var tmpC=this.contacts;
this.contacts=this.prevContacts$1;
this.prevContacts$1=tmpC;
for(var i=0;i<this.numRigidBodies;i++){
var tmpB=this.rigidBodies[i];
if(tmpB.sleeping){
var lv=tmpB.linearVelocity;
var av=tmpB.linearVelocity;
var p=tmpB.position;
var sp=tmpB.sleepPosition;
var o=tmpB.orientation;
var so=tmpB.sleepOrientation;
if(
lv.x!=0||lv.y!=0||lv.z!=0||
av.x!=0||av.y!=0||av.z!=0||
p.x!=sp.x||p.y!=sp.y||p.z!=sp.z||
o.s!=so.s||o.x!=so.x||o.y!=so.y||o.z!=so.z
){
tmpB.awake();
continue;
}
}
}
this.detectCollisions$1();
this.updateIslands$1();
var time2=Date.now();
this.performance.solvingTime=time2-this.performance.solvingTime;
this.performance.totalTime=time2-time1;
},
"private function detectCollisions",function(){
this.collectContactInfos$1();
this.setupContacts$1();
},
"private function collectContactInfos",function(){
var time1=Date.now();
this.broadPhase.detectPairs();
var time2=Date.now();
this.performance.broadPhaseTime=time2-time1;
this.collisionResult$1.numContactInfos=0;
var pairs=this.broadPhase.pairs;
var numPairs=this.broadPhase.numPairs;
for(var i=0;i<numPairs;i++){
var pair=pairs[i];
var s1=pair.shape1;
var s2=pair.shape2;
var detector=this.detectors$1[s1.type][s2.type];
if(detector){
detector.detectCollision(s1,s2,this.collisionResult$1);
if(this.collisionResult$1.numContactInfos==com.element.oimo.physics.dynamics.World.MAX_CONTACTS){
return;
}
}
}
var time3=Date.now();
this.performance.narrowPhaseTime=time3-time2;
this.performance.updatingTime=time3;
},
"private function setupContacts",function(){
this.numPrevContacts2=this.numPrevContacts1;
this.numPrevContacts1=this.numContacts;
var numSleptContacts=0;
for(var i=0;i<this.numPrevContacts1;i++){
var c=this.prevContacts$1[i];
if(c.sleeping){
this.prevContacts$1[i]=this.contacts[numSleptContacts];
this.contacts[numSleptContacts++]=c;
}
}
var contactInfos=this.collisionResult$1.contactInfos;
this.numContacts=numSleptContacts+this.collisionResult$1.numContactInfos;
for(i=numSleptContacts;i<this.numContacts;i++){
if(!this.contacts[i]){
this.contacts[i]=new com.element.oimo.physics.constraint.contact.Contact();
}
c=this.contacts[i];
c.setupFromContactInfo(contactInfos[i-numSleptContacts]);
var s1=c.shape1;
var s2=c.shape2;
var cc;
if(s1.numContacts<s2.numContacts)cc=s1.contactList;
else cc=s2.contactList;
while(cc!=null){
var old=cc.parent;
if(
(old.shape1==c.shape1&&old.shape2==c.shape2||
old.shape1==c.shape2&&old.shape2==c.shape1)&&
old.id.equals(c.id)
){
c.normalImpulse=old.normalImpulse;
c.tangentImpulse=old.tangentImpulse;
c.binormalImpulse=old.binormalImpulse;
c.warmStarted=true;
break;
}
cc=cc.next;
}
}
for(i=this.numContacts;i<this.numPrevContacts2;i++){
this.contacts[i].removeReferences();
}
},
"private function updateIslands",function(){
var invTimeStep=1/this.timeStep;
var tmpC;
var tmpB;
var tmpS;
var num;
for(var i=0;i<this.numShapes;i++){
tmpS=this.shapes[i];
tmpS.contactList=null;
tmpS.numContacts=0;
}
for(i=0;i<this.numRigidBodies;i++){
tmpB=this.rigidBodies[i];
tmpB.contactList=null;
tmpB.addedToIsland=false;
}
this.numConstraints$1=0;
for(i=0;i<this.numContacts;i++){
var c=this.contacts[i];
c.addedToIsland=false;
var cc=c.shapeConnection1;
tmpS=c.shape1;
cc.prev=null;
cc.next=tmpS.contactList;
if(tmpS.contactList!=null){
tmpS.contactList.prev=cc;
}
tmpS.contactList=cc;
tmpS.numContacts++;
cc=c.shapeConnection2;
tmpS=c.shape2;
cc.prev=null;
cc.next=tmpS.contactList;
if(tmpS.contactList!=null){
tmpS.contactList.prev=cc;
}
tmpS.contactList=cc;
tmpS.numContacts++;
cc=c.bodyConnection1;
tmpB=c.body1;
cc.prev=null;
cc.next=tmpB.contactList;
if(tmpB.contactList!=null){
tmpB.contactList.prev=cc;
}
tmpB.contactList=cc;
cc=c.bodyConnection2;
tmpB=c.body2;
cc.prev=null;
cc.next=tmpB.contactList;
if(tmpB.contactList!=null){
tmpB.contactList.prev=cc;
}
tmpB.contactList=cc;
this.constraints$1[this.numConstraints$1++]=c;
}
for(i=0;i<this.numJoints;i++){
tmpC=this.joints[i];
tmpC.addedToIsland=false;
this.constraints$1[this.numConstraints$1++]=tmpC;
}
for(i=1;i<this.numConstraints$1;i++){
var swap=(this.randX$1=(this.randX$1*this.randA$1+this.randB$1&0x7fffffff))/2147483648.0*i|0;
tmpC=this.constraints$1[i];
this.constraints$1[i]=this.constraints$1[swap];
this.constraints$1[swap]=tmpC;
}
var time1=Date.now();
this.performance.updatingTime=time1-this.performance.updatingTime;
this.performance.solvingTime=time1;
this.numIslands=0;
for(i=0;i<this.numRigidBodies;i++){
var base=this.rigidBodies[i];
if(base.addedToIsland||base.type==com.element.oimo.physics.dynamics.RigidBody.BODY_STATIC||base.sleeping)continue;
this.islandNumRigidBodies$1=0;
this.islandNumConstraints$1=0;
var numStacks=1;
this.islandStack$1[0]=base;
base.addedToIsland=true;
while(numStacks>0){
tmpB=this.islandStack$1[--numStacks];
tmpB.sleeping=false;
this.islandRigidBodies$1[this.islandNumRigidBodies$1++]=tmpB;
cc=tmpB.contactList;
while(cc!=null){
tmpC=cc.parent;
if(tmpC.addedToIsland){
cc=cc.next;
continue;
}
this.islandConstraints$1[this.islandNumConstraints$1++]=tmpC;
tmpC.addedToIsland=true;
tmpC.sleeping=false;
var next=cc.connectedBody;
if(next.addedToIsland||next.type==com.element.oimo.physics.dynamics.RigidBody.BODY_STATIC){
cc=cc.next;
continue;
}
this.islandStack$1[numStacks++]=next;
next.addedToIsland=true;
cc=cc.next;
}
var jc=tmpB.jointList;
while(jc!=null){
tmpC=jc.parent;
if(tmpC.addedToIsland){
jc=jc.next;
continue;
}
this.islandConstraints$1[this.islandNumConstraints$1++]=tmpC;
tmpC.addedToIsland=true;
tmpC.sleeping=false;
next=jc.connected;
if(next.addedToIsland||next.type==com.element.oimo.physics.dynamics.RigidBody.BODY_STATIC){
jc=jc.next;
continue;
}
this.islandStack$1[numStacks++]=next;
next.addedToIsland=true;
jc=jc.next;
}
}
for(var j=0;j<this.islandNumRigidBodies$1;j++){
tmpB=this.islandRigidBodies$1[j];
tmpB.updateVelocity(this.timeStep,this.gravity);
}
for(j=0;j<this.islandNumConstraints$1;j++){
this.islandConstraints$1[j].preSolve(this.timeStep,invTimeStep);
}
for(j=0;j<this.iteration;j++){
for(var k=0;k<this.islandNumConstraints$1;k++){
this.islandConstraints$1[k].solve();
}
}
for(j=0;j<this.islandNumConstraints$1;j++){
this.islandConstraints$1[j].postSolve();
}
var sleepTime=1000;
for(j=0;j<this.islandNumRigidBodies$1;j++){
tmpB=this.islandRigidBodies$1[j];
if(!tmpB.allowSleep){
tmpB.sleepTime=0;
sleepTime=0;
continue;
}
var vx=tmpB.linearVelocity.x;
var vy=tmpB.linearVelocity.y;
var vz=tmpB.linearVelocity.z;
if(vx*vx+vy*vy+vz*vz>0.01){
tmpB.sleepTime=0;
sleepTime=0;
continue;
}
vx=tmpB.angularVelocity.x;
vy=tmpB.angularVelocity.y;
vz=tmpB.angularVelocity.z;
if(vx*vx+vy*vy+vz*vz>0.04){
tmpB.sleepTime=0;
sleepTime=0;
continue;
}
tmpB.sleepTime+=this.timeStep;
if(tmpB.sleepTime<sleepTime)sleepTime=tmpB.sleepTime;
}
if(sleepTime>0.5){
for(j=0;j<this.islandNumRigidBodies$1;j++){
tmpB=this.islandRigidBodies$1[j];
tmpB.linearVelocity.init();
tmpB.angularVelocity.init();
tmpB.sleepPosition.copy(tmpB.position);
tmpB.sleepOrientation.copy(tmpB.orientation);
tmpB.sleepTime=0;
tmpB.sleeping=true;
}
for(j=0;j<this.islandNumConstraints$1;j++){
this.islandConstraints$1[j].sleeping=true;
}
}else{
for(j=0;j<this.islandNumRigidBodies$1;j++){
this.islandRigidBodies$1[j].updatePosition(this.timeStep);
}
}
this.numIslands++;
}
},
];},[],["com.element.oimo.physics.collision.narrow.CollisionResult","com.element.oimo.math.Vec3","com.element.oimo.physics.util.Performance","com.element.oimo.physics.collision.broad.SweepAndPruneBroadPhase","com.element.oimo.physics.collision.shape.Shape","com.element.oimo.physics.collision.narrow.SphereSphereCollisionDetector","com.element.oimo.physics.collision.narrow.SphereBoxCollisionDetector","com.element.oimo.physics.collision.narrow.SphereCylinderCollisionDetector","com.element.oimo.physics.collision.narrow.BoxBoxCollisionDetector","com.element.oimo.physics.collision.narrow.BoxCylinderCollisionDetector","com.element.oimo.physics.collision.narrow.CylinderCylinderCollisionDetector","Error","com.element.oimo.physics.constraint.contact.Contact","com.element.oimo.physics.dynamics.RigidBody"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.OimoPhysics
joo.classLoader.prepare(
"package com.element.oimo.physics",
"public final class OimoPhysics",1,function($$private){;return[
"public static const",{VERSION:"1.0.0"},
"public static const",{DESCRIPTION:function(){return("OimoPhysics "+com.element.oimo.physics.OimoPhysics.VERSION+" (c) 2012 EL-EMENT saharan");}},
"public function OimoPhysics",function(){
throw new Error("OimoPhysics オブジェクトを作成することはできません");
},
];},[],["Error"], "0.8.0", "0.8.1"
);
// class com.element.oimo.physics.util.Performance
joo.classLoader.prepare("package com.element.oimo.physics.util",
"public class Performance",1,function($$private){;return[
"public var",{broadPhaseTime:0},
"public var",{narrowPhaseTime:0},
"public var",{solvingTime:0},
"public var",{updatingTime:0},
"public var",{totalTime:0},
"public function Performance",function(){
},
];},[],[], "0.8.0", "0.8.1"
);
