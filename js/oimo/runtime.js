(function(theGlobalObject) {
  theGlobalObject['int'] = theGlobalObject['$$int'] = function $int(num) {
    var i = Math.floor(num);
    if (this===theGlobalObject) {
      return i;
    }
    var result = new Number(i);
    result.constructor = $int;
    return result;
  };
  theGlobalObject['int'].MAX_VALUE =  2147483647;
  theGlobalObject['int'].MIN_VALUE = -2147483648;
})(this);(function(theGlobalObject) {
  theGlobalObject['uint'] = theGlobalObject['$$uint'] = function $uint(num) {
    var ui = Math.abs(Math.floor(num));
    if (this===theGlobalObject) {
      return ui;
    }
    var result = new Number(ui);
    result.constructor = $uint;
    return result;
  };
  theGlobalObject['uint'].MAX_VALUE =  4294967295;
  theGlobalObject['uint'].MIN_VALUE =  0;
})(this);
(function(theGlobalObject){
  // define alias "js" for the top-level package, so that name-clashes in AS3 can be resolved:
  theGlobalObject.js = theGlobalObject;
  // defined here to avoid global name space pollution and unnecessary closures:
  function clone(object) {
    var empty = function(){ };
    empty.prototype =  object;
    return new empty();
  }
  function copyFromTo(source, target) {
    for (var m in source) {
      target[m] = source[m];
    }
  }
  function createGetQualified(create) {
    return (function(name) {
      var object = theGlobalObject;
      if (name) {
        var parts = name.split(".");
        for (var i=0; i<parts.length; ++i) {
          var subobject = object[parts[i]];
          try {
            if(String(subobject).indexOf("[JavaPackage")==0) {
              subobject =  null;
            }
          } catch(e) {
            // ignore
          }
          if (!subobject) {
            if (create) {
              subobject = object[parts[i]] = {};
            } else {
              return null;
            }
          }
          object = subobject;
        }
      }
      return object;
    });
  }

  if (!theGlobalObject.joo) {
    theGlobalObject.joo = {};
  }
  joo.getOrCreatePackage = createGetQualified(true);
  joo.getQualifiedObject = createGetQualified(false);

  joo.is = function(object, type) {
      if (!type || object===undefined || object===null) {
        return false;
      }
      // constructor or instanceof may return false negatives:
      if (object.constructor === type || object instanceof type) {
        return true;
      }
      // special case meta-class Class:
      if (type === Class) {
        return !!object["$class"];
      }
      var classDeclaration = object.constructor["$class"];
      var typeDeclaration = type["$class"];
      if (classDeclaration && typeDeclaration) {
        return !!classDeclaration.Types.prototype[typeDeclaration.fullClassName];
      }
      return false;
    };

    joo.as = function (object, type) {
      return joo.is(object, type) ? object : null;
    };

  joo.boundMethod = function boundMethod(object, methodName) {
    return object['$$b_' + methodName] ||
      (object['$$b_' + methodName] = function() {
        return object[methodName].apply(object, arguments);
      });
  };

    /*
    unsupported ActionScript features during bootstrap:
      - private non-static members (use internal instead)
      - field initializers (initialize in constructor instead)
      - dynamic class loading + resource bundles
      - implicit empty constructor (must have explicit constructor)
      - Array methods like forEach (not supported by all browsers)
      - all classes must reside within the joo package

     Caveat: static code blocks are executed immediately

     */
    joo.classLoader = {
      prepare: function(packageDef, classDef, inheritanceLevel, memberFactory, publicStaticMethodNames, dependencies, runtimeApiVersion, compilerVersion) {
        joo.runtimeApiVersion = runtimeApiVersion;
        joo.compilerVersion = compilerVersion;
        var classMatch = classDef.match(/^\s*((public|internal|final|dynamic)\s+)*class\s+([A-Za-z][a-zA-Z$_0-9]*)(\s+extends\s+([a-zA-Z$_0-9.]+))?(\s+implements\s+([a-zA-Z$_0-9.,\s]+))?\s*$/);
        var className = classMatch[3];
        var $extends = classMatch[5];
        var constructor = {}; // also used for collecting static member
        var superConstructor = $extends ? joo.getQualifiedObject($extends) : Object;
        var prototype = clone(superConstructor.prototype);
        prototype["super$" + inheritanceLevel] = superConstructor;
        var privateStatics = {};
        var members = memberFactory(privateStatics);
        var staticInitializer;
        for (var i = 0; i < members.length; ++i) {
          var memberDeclaration = members[i];
          switch (typeof memberDeclaration) {
            case "function": staticInitializer = memberDeclaration; break;
            case "string":
              var isStatic = memberDeclaration.match(/\bstatic\b/);
              var isPrivate = memberDeclaration.match(/\bprivate\b/);
              var target = isStatic ? isPrivate ? privateStatics : constructor : prototype;
              var member = members[++i];
              if (typeof member == "function") {
                var methodName = memberDeclaration.match(/function\s+([a-zA-Z$_0-9]+)/)[1];
                if (methodName == className) { // found constructor!
                  // add collected public static members to the real constructor
                  copyFromTo(constructor, member);
                  joo[className] = constructor = member;
                  constructor.prototype = prototype;
                } else {
                  target[methodName] = member;
                }
              } else {
                copyFromTo(member, target);
              }
          }
        }
        if (staticInitializer) {
          staticInitializer();
        }
      },
      init: function() {
        // ignore
      }
    };
})(this);
// function assert(cond : Object, file : String, line : uint, column : uint) : void
joo.assert = function joo$assert(cond, file, line, column) {
  if (!cond)
    throw new Error(file+"("+line+":"+column+"): assertion failed");
};
// simulate ActionScript's meta class "Class": at least provide placeholder and empty init function.
Class = function joo$Class(c){return c;};
Class.$class = {
  init: function(){}
};
// function trace(...msg) : void
if (typeof joo.trace !== "function") {
  joo.trace = function joo$trace() {
    var msg = Array.prototype.join.call(arguments, " ");
    var logLevelMatches = msg.match(/^\[(LOG|INFO|WARN|ERROR)\]\s*(.*)$/);
    var logLevel = logLevelMatches ? logLevelMatches[1].toLowerCase() : null;
    msg = "AS3: " + msg;
    var console;
    if ((console = joo.getQualifiedObject("console")) && console.log) {
      // Firebug supports different log levels:
      if (!console[logLevel]) {
        logLevel = 'log';
      } else {
        msg = "AS3: " + logLevelMatches[2];
      }
      console[logLevel](msg);
    } else if ((console = joo.getQualifiedObject("runtime")) && console.trace) {
      console.trace(msg);
    } else if (console = joo.getQualifiedObject("trace")) {
      console(msg);
    } else if (console = joo.getQualifiedObject("opera")) {
      console.postError(msg);
    }
  };
}joo.classLoader.prepare(
"package joo",
"public class MemberDeclaration",1,function($$private){;return[function(){joo.classLoader.init(RegExp,Object);},
"public static const",{
METHOD_TYPE_GET:"get",
METHOD_TYPE_SET:"set",
MEMBER_TYPE_VAR:"var",
MEMBER_TYPE_CONST:"const",
MEMBER_TYPE_FUNCTION:"function",
MEMBER_TYPE_CLASS:"class",
MEMBER_TYPE_INTERFACE:"interface",
MEMBER_TYPE_NAMESPACE:"namespace",
NAMESPACE_PRIVATE:"private",
NAMESPACE_INTERNAL:"internal",
NAMESPACE_PROTECTED:"protected",
NAMESPACE_PUBLIC:"public",
STATIC:"static",
FINAL:"final",
NATIVE:"native",
OVERRIDE:"override",
VIRTUAL:"virtual"},
"private static var",{SUPPORTS_GETTERS_SETTERS:false},
"private static var",{SUPPORTS_PROPERTIES:false},
"private static var",{DEFINE_METHOD:null},
"private static var",{LOOKUP_METHOD:null},function()
{
if('getOwnPropertyDescriptor'in Object){
try{
$$private.SUPPORTS_PROPERTIES=Object['getOwnPropertyDescriptor']({foo:1},"foo").value===1;
}catch(e){
}
}
$$private.SUPPORTS_GETTERS_SETTERS="__defineGetter__"in Object['prototype'];
$$private.DEFINE_METHOD={
"get":"__defineGetter__",
"set":"__defineSetter__"
};
$$private.LOOKUP_METHOD={
"get":"__lookupGetter__",
"set":"__lookupSetter__"
};
},
"public static function create",function(memberDeclarationStr){
var tokens=memberDeclarationStr.split(/\s+/);
return tokens[0]=="import"?null
:new joo.MemberDeclaration(tokens);
},
"internal var",{
_namespace:function(){return(joo.MemberDeclaration.NAMESPACE_INTERNAL);},
_static:false,
_final:false,
_native:false,
_override:false,
_cloneFactory:null},
"public var",{
memberType:null,
getterOrSetter:null,
memberName:null,
slot:null,
value:undefined},
"public var",{metadata:function(){return({});}},
"public function MemberDeclaration",function(tokens){this._namespace=this._namespace();this.metadata=this.metadata();
for(var j=0;j<tokens.length;++j){
var token=tokens[j];
if(!this.memberType){
switch(token){
case joo.MemberDeclaration.STATIC:
case joo.MemberDeclaration.FINAL:
case joo.MemberDeclaration.NATIVE:
case joo.MemberDeclaration.OVERRIDE:
this["_"+token]=true;break;
case joo.MemberDeclaration.MEMBER_TYPE_VAR:
case joo.MemberDeclaration.MEMBER_TYPE_CONST:
case joo.MemberDeclaration.MEMBER_TYPE_FUNCTION:
case joo.MemberDeclaration.MEMBER_TYPE_CLASS:
this.memberType=token;break;
case joo.MemberDeclaration.VIRTUAL:
break;
default:
this._namespace=token;
}
}else{
if(this.isMethod()&&$$private.LOOKUP_METHOD[this.memberName]){
this.getterOrSetter=this.memberName;
}
this.memberName=token;
if(this.memberType===joo.MemberDeclaration.MEMBER_TYPE_CLASS){
break;
}
}
}
if(!this.memberType){
throw new Error("Missing member type in declaration '"+tokens.join(" ")+"'.");
}
},
"public function getQualifiedName",function(){
return this._namespace+"::"+this.memberName;
},
"public function isPrivate",function(){
return this._namespace==joo.MemberDeclaration.NAMESPACE_PRIVATE;
},
"public function isStatic",function(){
return this._static;
},
"public function isFinal",function(){
return this._final;
},
"public function isNative",function(){
return this._native;
},
"public function isOverride",function(){
return this._override;
},
"public function isMethod",function(){
return this.memberType==joo.MemberDeclaration.MEMBER_TYPE_FUNCTION;
},
"internal function initSlot",function(level){
this.slot=this.isPrivate()&&!this.isStatic()
?this.memberName+"$"+level
:this.memberName;
},
"public function getNativeMember",function(publicConstructor){
var target=this.isStatic()?publicConstructor:publicConstructor.prototype;
if(this.memberType==joo.MemberDeclaration.MEMBER_TYPE_FUNCTION&&this.getterOrSetter){
this.memberType=joo.MemberDeclaration.MEMBER_TYPE_VAR;
this.getterOrSetter=null;
}
try{
var member=target[this.memberName];
}catch(e){
}
if(typeof member!="function"){
var memberObject={};
memberObject[this.memberName]=member;
member=memberObject;
}
return member;
},
"public function hasOwnMember",function(target){
if(!this.getterOrSetter&&target.hasOwnProperty){
return target.hasOwnProperty(this.slot);
}
var value=this.retrieveMember(target);
if(value!==undefined&&target.constructor){
var superTarget=target.constructor.prototype;
var superValue=this.retrieveMember(superTarget);
if(value!==superValue){
return true;
}
}
return false;
},
"public function retrieveMember",function(target){
if(!target){
return undefined;
}
var slot=this.slot;
if(this.getterOrSetter){
if($$private.SUPPORTS_PROPERTIES){
var propertyDescriptor=this._lookupPropertyDescriptor(target);
return propertyDescriptor?propertyDescriptor[this.getterOrSetter]:undefined;
}else if($$private.SUPPORTS_GETTERS_SETTERS){
return target[$$private.LOOKUP_METHOD[this.getterOrSetter]](slot);
}else{
slot=slot+"$"+this.getterOrSetter;
}
}
try{
return target[slot];
}catch(e){
return undefined;
}
},
"internal function _lookupPropertyDescriptor",function(target){
var slot=this.slot;
do{
var propertyDescriptor=Object['getOwnPropertyDescriptor'](target,slot);
if(propertyDescriptor){
return propertyDescriptor;
}
var oldTarget=target;
target=target.constructor?target.constructor['superclass']||target.constructor.prototype:null;
}while(target&&target!==oldTarget);
return undefined;
},
"public function storeMember",function(target){
if(!this.isNative()&&!this.hasOwnMember(target)){
var slot=this.slot;
if(this.getterOrSetter){
if($$private.SUPPORTS_PROPERTIES){
var propertyDescriptor=this._lookupPropertyDescriptor(target)
||{configurable:true,enumerable:true};
propertyDescriptor[this.getterOrSetter]=this.value;
Object['defineProperty'](target,slot,propertyDescriptor);
return;
}else if($$private.SUPPORTS_GETTERS_SETTERS){
var oppositeMethodType=this.getterOrSetter==joo.MemberDeclaration.METHOD_TYPE_GET?joo.MemberDeclaration.METHOD_TYPE_SET:joo.MemberDeclaration.METHOD_TYPE_GET;
var counterpart=target[$$private.LOOKUP_METHOD[oppositeMethodType]](slot);
if(counterpart&&counterpart===target.constructor.prototype[$$private.LOOKUP_METHOD[oppositeMethodType]](slot)){
target[$$private.DEFINE_METHOD[oppositeMethodType]](slot,counterpart);
}
target[$$private.DEFINE_METHOD[this.getterOrSetter]](slot,this.value);
return;
}else{
slot=slot+"$"+this.getterOrSetter;
}
}
target[slot]=this.value;
}
},
"public function hasInitializer",function(){
return this.memberType!=joo.MemberDeclaration.MEMBER_TYPE_FUNCTION&&this.memberType!=joo.MemberDeclaration.MEMBER_TYPE_CLASS&&typeof this.value=="function"&&this.value.constructor!==RegExp;
},
"public function _getCloneFactory",function(){
if(!this._cloneFactory){
this._cloneFactory=function(){};
this._cloneFactory.prototype=this;
}
return this._cloneFactory;
},
"public function clone",function(changedProperties){
var CloneFactory=this._getCloneFactory();
var clone=new CloneFactory();
for(var m in changedProperties){
clone[m]=changedProperties[m];
}
return clone;
},
"public function toString",function(){
var sb=[this._namespace];
if(this._static){
sb.push(joo.MemberDeclaration.STATIC);
}
if(this._override){
sb.push(joo.MemberDeclaration.OVERRIDE);
}
sb.push(this.memberType);
if(this.getterOrSetter){
sb.push(this.getterOrSetter);
}
sb.push(this.memberName);
return sb.join(" ");
},
];},["create"],["Object","Error","RegExp"], "0.8.0", "0.8.1"
);joo.classLoader.prepare(
"package joo",
"public class NativeClassDeclaration",1,function($$private){var trace=joo.trace;return[function(){joo.classLoader.init(Error);},
"internal static const",{RESOURCE_BUNDLE_PATTERN:/_properties$/},
"internal static function createEmptyConstructor",function(prototype_){
var emptyConstructor=function(){};
emptyConstructor.prototype=prototype_;
return emptyConstructor;
},
"internal static const",{STATE_LOADED:0},
"internal static const",{STATE_COMPLETING:1},
"internal static const",{STATE_COMPLETED:2},
"internal static const",{STATE_INITIALIZING:3},
"internal static const",{STATE_INITIALIZED:4},
"public var",{
fullClassName:null,
constructor_:null,
publicConstructor:null,
state:function(){return(joo.NativeClassDeclaration.STATE_LOADED);},
Public:null,
superClassDeclaration:null,
Types:null,
interfaces:null},
"public function NativeClassDeclaration",function(){this.state=this.state();
},
"public function create",function(fullClassName,publicConstructor){
this.fullClassName=fullClassName;
this.publicConstructor=publicConstructor;
if(fullClassName!="Error"){
try{
this.publicConstructor["$class"]=this;
}catch(e){
}
}
return this;
},
"public function complete",function(){
if(this.state<joo.NativeClassDeclaration.STATE_COMPLETING){
this.state=joo.NativeClassDeclaration.STATE_COMPLETING;
this.doComplete();
this.state=joo.NativeClassDeclaration.STATE_COMPLETED;
}
return this;
},
"private static const",{ERROR_CONSTRUCTOR:function(message){
this.message=message||"";
}},
"internal function doComplete",function(){
this.interfaces=[];
if(this.publicConstructor!==Error){
this.constructor_=this.publicConstructor;
}else{
this.constructor_=$$private.ERROR_CONSTRUCTOR;
this.constructor_.prototype=this.publicConstructor.prototype;
}
this.Public=joo.NativeClassDeclaration.createEmptyConstructor(this.publicConstructor.prototype);
this.initTypes();
},
"protected function initTypes",function(){
this.Types=function(){};
var types=this.Types.prototype=this.superClassDeclaration?new this.superClassDeclaration.Types():{};
types[this.fullClassName]=true;
for(var i=0;i<this.interfaces.length;i++){
types[this.interfaces[i]]=true;
}
},
"private static var",{initializationDepth:""},
"public function init",function(){
if(this.state<joo.NativeClassDeclaration.STATE_INITIALIZING){
this.complete();
this.state=joo.NativeClassDeclaration.STATE_INITIALIZING;
if(joo.classLoader.debug){
trace("[INFO] Jangaroo Runtime: initializing class "+$$private.initializationDepth+this.fullClassName);
$$private.initializationDepth+="  ";
}
this.doInit();
if(joo.classLoader.debug){
$$private.initializationDepth=$$private.initializationDepth.substr(0,$$private.initializationDepth.length-2);
}
this.state=joo.NativeClassDeclaration.STATE_INITIALIZED;
}else if(this.state===joo.NativeClassDeclaration.STATE_INITIALIZING&&!this.fullClassName.match(joo.NativeClassDeclaration.RESOURCE_BUNDLE_PATTERN)){
trace("[WARN] Jangaroo Runtime: cyclic static initializer dependency in "+this.fullClassName);
}
return this;
},
"internal function doInit",function(){
},
"public function getQualifiedName",function(){
return this.fullClassName.replace(/\.([^\.]+)^/,"::");
},
"public function toString",function(){
return this.fullClassName;
},
];},["createEmptyConstructor"],["Error"], "0.8.0", "0.8.1"
);joo.classLoader.prepare(
"package joo",
"public class JooClassDeclaration extends joo.NativeClassDeclaration",2,function($$private){;return[function(){joo.classLoader.init(joo.MemberDeclaration,Object);},
"protected var",{
package_:null,
type:function(){return(joo.MemberDeclaration.MEMBER_TYPE_CLASS);},
namespace_:function(){return(joo.MemberDeclaration.NAMESPACE_INTERNAL);},
className:null,
native_:false,
extends_:"Object",
level:-1,
privateStatics:null,
memberDeclarations:undefined,
memberDeclarationsByQualifiedName:null,
staticInitializers:null,
publicStaticMethodNames:null,
dependencies:null},
"public var",{metadata:function(){return({});}},
"private static const",{DECLARATION_PATTERN_CLASS:
/^\s*((public|internal|final|dynamic)\s+)*class\s+([A-Za-z][a-zA-Z$_0-9]*)(\s+extends\s+([a-zA-Z$_0-9.]+))?(\s+implements\s+([a-zA-Z$_0-9.,\s]+))?\s*$/},
"private static const",{DECLARATION_PATTERN_INTERFACE:
/^\s*((public|internal)\s+)?interface\s+([A-Za-z][a-zA-Z$_0-9]*)(\s+extends\s+([a-zA-Z$_0-9.,\s]+))?\s*$/},
"private static const",{DECLARATION_PATTERN_NAMESPACE:
/^\s*((public|internal)\s+)?namespace\s+([A-Za-z][a-zA-Z$_0-9]*)\s*$/},
"public function JooClassDeclaration",function(packageDef,classDef,inheritanceLevel,memberDeclarations,
publicStaticMethodNames,dependencies){this.super$2();this.namespace_=this.namespace_();this.type=this.type();this.metadata=this.metadata();
var packageName=packageDef.split(/\s+/)[1]||"";
this.package_=joo.getOrCreatePackage(packageName);
var classMatch=classDef.match($$private.DECLARATION_PATTERN_CLASS);
var interfaces;
if(classMatch){
if(classMatch[5]){
this.extends_=classMatch[5];
}
interfaces=classMatch[7];
}else{
classMatch=classDef.match($$private.DECLARATION_PATTERN_INTERFACE);
if(classMatch){
this.type=joo.MemberDeclaration.MEMBER_TYPE_INTERFACE;
interfaces=classMatch[5];
}else{
classMatch=classDef.match($$private.DECLARATION_PATTERN_NAMESPACE);
if(classMatch){
this.type=joo.MemberDeclaration.MEMBER_TYPE_NAMESPACE;
}
}
}
if(!classMatch){
throw new Error("SyntaxError: \""+classDef+"\" does not match.");
}
this.level=inheritanceLevel;
this.namespace_=classMatch[2];
this.className=classMatch[3];
var fullClassName=this.className;
if(packageName){
fullClassName=packageName+"."+this.className;
}
this.interfaces=interfaces?interfaces.split(/\s*,\s*/):[];
this.memberDeclarations=memberDeclarations;
this.publicStaticMethodNames=publicStaticMethodNames;
this.dependencies=dependencies;
this.privateStatics={};
this.publicConstructor=joo.getQualifiedObject(fullClassName);
if(this.publicConstructor){
this.native_=true;
}else{
this.package_[this.className]=this.publicConstructor=$$private.createInitializingConstructor(this);
for(var i=0;i<publicStaticMethodNames.length;i++){
this.createInitializingStaticMethod(publicStaticMethodNames[i]);
}
}
this.create(fullClassName,this.publicConstructor);
},
"public function isClass",function(){
return this.type===joo.MemberDeclaration.MEMBER_TYPE_CLASS;
},
"public function isInterface",function(){
return this.type===joo.MemberDeclaration.MEMBER_TYPE_INTERFACE;
},
"public function isNamespace",function(){
return this.type===joo.MemberDeclaration.MEMBER_TYPE_NAMESPACE;
},
"public function isNative",function(){
return this.native_;
},
"internal override function doComplete",function(){
this.superClassDeclaration=joo.classLoader.getRequiredClassDeclaration(this.extends_);
this.superClassDeclaration.complete();
var Super=this.superClassDeclaration.Public;
if(!this.native_){
this.publicConstructor.prototype=new Super();
this.publicConstructor.prototype['constructor']=this.publicConstructor;
this.publicConstructor["superclass"]=Super.prototype;
}
this.Public=joo.NativeClassDeclaration.createEmptyConstructor(this.publicConstructor.prototype);
this.initTypes();
},
"internal function initMembers",function(){
this.staticInitializers=[];
var memberDeclarations=this.memberDeclarations(this.privateStatics);
this.memberDeclarations=[];
this.memberDeclarationsByQualifiedName={};
this.constructor_=this.isNative()?this.publicConstructor:null;
var metadata={};
for(var i=0;i<memberDeclarations.length;++i){
var item=memberDeclarations[i];
switch(typeof item){
case"function":
this.staticInitializers.push(item);
break;
case"string":
var memberDeclaration=joo.MemberDeclaration.create(item);
if(memberDeclaration){
memberDeclaration.metadata=metadata;
metadata={};
if(!memberDeclaration.isNative()){
if(++i>=memberDeclarations.length){
throw new Error(this+": Member expected after modifiers '"+item+"'.");
}
var member=memberDeclarations[i];
}
switch(memberDeclaration.memberType){
case joo.MemberDeclaration.MEMBER_TYPE_FUNCTION:
this.initMethod(memberDeclaration,(member));
break;
case joo.MemberDeclaration.MEMBER_TYPE_CLASS:
var helperInheritanceLevel=member;
var helperMemberDeclarations=memberDeclarations[++i];
var helperStatics=memberDeclarations[++i];
var secondaryClass=joo.classLoader.prepare("package "+this.fullClassName,item,
helperInheritanceLevel,helperMemberDeclarations,
helperStatics,[],joo.runtimeApiVersion,joo.compilerVersion).complete();
memberDeclaration._static=true;
memberDeclaration.initSlot(this.level);
this._storeMember(memberDeclaration,secondaryClass.publicConstructor);
break;
default:
for(var memberName in member){
this._storeMember(this._createMemberDeclaration(memberDeclaration,{memberName:memberName}),member[memberName]);
}
}
}
break;
case"object":
joo.SystemClassLoader.addToMetadata(metadata,item);
}
}
if(!this.isInterface()&&!this.native_){
if(!this.superClassDeclaration.constructor_){
throw new Error("Class "+this.fullClassName+" extends "+this.superClassDeclaration.fullClassName+" whose constructor is not defined!");
}
this.Public.prototype["super$"+this.level]=this.superClassDeclaration.constructor_;
if(!this.constructor_){
this._setConstructor($$private.createSuperConstructor(this.level));
}
}
},
"internal function _setConstructor",function(constructor_){
for(var i=0;i<this.memberDeclarations.length;i++){
var memberDeclaration=this.memberDeclarations[i];
if(memberDeclaration.isStatic()&&!memberDeclaration.isPrivate()){
memberDeclaration.storeMember(constructor_);
}
}
constructor_['$class']=this;
if(this.superClassDeclaration){
constructor_['superclass']=this.superClassDeclaration.Public.prototype;
}
constructor_.prototype=this.Public.prototype;
constructor_.prototype['constructor']=constructor_;
this.package_[this.className]=this.constructor_=constructor_;
},
"private static function createSuperConstructor",function(level){
return function generatedConstructor$(){
this['super$'+level]();
};
},
"internal function initMethod",function(memberDeclaration,member){
if(memberDeclaration.memberName==this.className&&!memberDeclaration.isStatic()){
if(memberDeclaration.getterOrSetter){
throw new Error(this+": Class name cannot be used for getter or setter: "+memberDeclaration);
}
if(!this.native_&&!memberDeclaration.isNative()){
this._setConstructor(member);
}
}else{
memberDeclaration.initSlot(this.level);
if(memberDeclaration.isNative()){
member=memberDeclaration.getNativeMember(this.publicConstructor);
}
if(memberDeclaration.isMethod()){
if(this.extends_!="Object"){
var superMethod=memberDeclaration.retrieveMember(this.superClassDeclaration.Public.prototype);
}
var overrides=! !superMethod
&&superMethod!==member
&&superMethod!==Object['prototype'][memberDeclaration.memberName];
if(overrides!==memberDeclaration.isOverride()){
var msg=overrides
?"Method overrides without 'override' modifier"
:"Method with 'override' modifier does not override";
throw new Error(this+": "+msg+": "+memberDeclaration);
}
if(overrides){
this._storeMember(this._createMemberDeclaration(memberDeclaration,{_namespace:joo.MemberDeclaration.NAMESPACE_PRIVATE}),superMethod);
}
}
this._storeMember(memberDeclaration,member);
}
},
"internal function _createMemberDeclaration",function(memberDeclaration,changedProperties){
var newMemberDeclaration=memberDeclaration.clone(changedProperties);
newMemberDeclaration.initSlot(this.level);
return newMemberDeclaration;
},
"internal function _storeMember",function(memberDeclaration,value){
this.memberDeclarations.push(memberDeclaration);
this.memberDeclarationsByQualifiedName[memberDeclaration.getQualifiedName()]=memberDeclaration;
memberDeclaration.value=value;
var _static=memberDeclaration.isStatic();
var _private=memberDeclaration.isPrivate();
if(_static&&memberDeclaration.hasInitializer()){
this.staticInitializers.push(memberDeclaration);
}
this._processMetadata(memberDeclaration);
var target=_static?_private?this.privateStatics:this.constructor_:this.Public.prototype;
if(target){
memberDeclaration.storeMember(target);
}
},
"internal function _processMetadata",function(memberDeclaration){
var metadata=memberDeclaration.metadata;
if(metadata){
for(var metaFunctionName in metadata){
var metaFunction=joo.getQualifiedObject("joo.meta."+metaFunctionName);
if(metaFunction){
metaFunction(this,memberDeclaration,metadata[metaFunctionName]);
}
}
}
},
"internal override function doInit",function(){
this.superClassDeclaration.init();
for(var j=0;j<this.interfaces.length;j++){
this.interfaces[j]=joo.classLoader.getRequiredClassDeclaration(this.interfaces[j]).init();
}
this.initMembers();
for(var i=0;i<this.staticInitializers.length;++i){
var staticInitializer=this.staticInitializers[i];
if(typeof staticInitializer=="function"){
staticInitializer();
}else{
var target=staticInitializer.isPrivate()?this.privateStatics:this.constructor_;
target[staticInitializer.slot]=target[staticInitializer.slot]();
}
}
},
"public function getMemberDeclaration",function(namespace_,memberName){
var memberDeclaration=this.memberDeclarationsByQualifiedName[namespace_+"::"+memberName];
return!memberDeclaration&&this.superClassDeclaration&&this.superClassDeclaration["getMemberDeclaration"]
?(this.superClassDeclaration).getMemberDeclaration(namespace_,memberName)
:memberDeclaration;
},
"public function getDependencies",function(){
return this.dependencies;
},
"private static function createInitializingConstructor",function(classDeclaration){
return function(){
classDeclaration.init();
classDeclaration.constructor_.apply(this,arguments);
};
},
"internal function createInitializingStaticMethod",function(methodName){var this$=this;
this.publicConstructor[methodName]=function(){
this$.init();
return this$.constructor_[methodName].apply(null,arguments);
};
},
];},[],["joo.NativeClassDeclaration","joo.MemberDeclaration","Error","Function","joo.SystemClassLoader","Object"], "0.8.0", "0.8.1"
);joo.classLoader.prepare(
"package joo",
"public class SystemClassLoader",1,function($$private){;return[function()
{
joo.classLoader=new joo.SystemClassLoader();
},
"public static const",{classDeclarationsByName:function(){return({});}},
"public var",{debug:false},
"public function SystemClassLoader",function(){
this.debug=joo.debug;
},
"public function prepare",function(){var params=arguments;
var packageDef=params[0];
var metadata={};
for(var i=1;typeof params[i]=="object";i++){
joo.SystemClassLoader.addToMetadata(metadata,params[i]);
}
var classDef=params[i++];
var inheritanceLevel=params[i++];
if(typeof inheritanceLevel!=="number"){
i--;
}
var memberFactory=params[i++];
var publicStaticMethodNames=params[i++];
var dependencies=params[i++];
var runtimeApiVersion=params[i++];
var compilerVersion=params[i++];
var cd=this.createClassDeclaration(packageDef,classDef,inheritanceLevel,memberFactory,publicStaticMethodNames,dependencies);
cd.metadata=metadata;
if(!joo.SystemClassLoader.isRuntimeCompatible(runtimeApiVersion,compilerVersion)){
throw new Error("Runtime version "+joo.runtimeApiVersion+"/"+joo.compilerVersion+
" and class version "+runtimeApiVersion+"/"+compilerVersion+
" of "+cd.fullClassName+" do not match. "+
"Please recompile with the correct compiler version or replace jangaroo-runtime[-debug].js.");
}
joo.SystemClassLoader.classDeclarationsByName[cd.fullClassName]=cd;
return cd;
},
"private static function toVersionParts",function(version){
var parts=(version||"").split(".");
for(var i=0;i<parts.length;++i){
parts[i]=parseInt(parts[i],10);
}
return parts;
},
"internal static function isRuntimeCompatible",function(runtimeApiVersion,compilerVersion){
if(runtimeApiVersion!==joo.runtimeApiVersion){
return false;
}
var runtimeCompilerVersionParts=$$private.toVersionParts(joo.compilerVersion);
var compilerVersionParts=$$private.toVersionParts(compilerVersion);
for(var i=0;i<runtimeCompilerVersionParts.length;++i){
if(compilerVersionParts[i]!==runtimeCompilerVersionParts[i]){
return compilerVersionParts[i]<runtimeCompilerVersionParts[i];
}
}
return true;
},
"internal static function addToMetadata",function(metadata,annotation){
for(var m in annotation){
metadata[m]=annotation[m];
}
},
"protected function createClassDeclaration",function(packageDef,classDef,inheritanceLevel,memberFactory,
publicStaticMethodNames,dependencies){
return(new joo.JooClassDeclaration(packageDef,classDef,inheritanceLevel,memberFactory,publicStaticMethodNames,dependencies).init());
},
"public function getClassDeclaration",function(fullClassName){
var cd=joo.SystemClassLoader.classDeclarationsByName[fullClassName];
if(!cd){
var constructor_=joo.getQualifiedObject(fullClassName);
if(constructor_){
if(!constructor_["$class"]){
cd=this.createNativeClassDeclaration(fullClassName,constructor_).init();
joo.SystemClassLoader.classDeclarationsByName[fullClassName]=cd;
}else{
cd=constructor_["$class"];
}
}
}
return cd;
},
"public function getRequiredClassDeclaration",function(className){
var cd=this.getClassDeclaration(className);
if(!cd){
throw new Error("Class not found: "+className);
}
return cd;
},
"protected function createNativeClassDeclaration",function(fullClassName,nativeClass){
return new joo.NativeClassDeclaration().create(fullClassName,nativeClass);
},
"public function init",function(){var classes=arguments;
return null;
},
];},["isRuntimeCompatible","addToMetadata"],["Error","joo.JooClassDeclaration","joo.NativeClassDeclaration"], "0.8.0", "0.8.1"
);joo.classLoader.prepare("package",
"public dynamic class ArgumentError extends Error",2,function($$private){;return[
"public function ArgumentError",function(message){if(arguments.length<1){message="";}
this.super$2(message);
},
];},[],["Error"], "0.8.0", "0.8.1"
);joo.classLoader.prepare("package",
"public dynamic class DefinitionError extends Error",2,function($$private){;return[
"public function DefinitionError",function(message){if(arguments.length<1){message="";}
this.super$2(message);
},
];},[],["Error"], "0.8.0", "0.8.1"
);joo.classLoader.prepare("package",
"public dynamic class SecurityError extends Error",2,function($$private){;return[
"public function SecurityError",function(message){if(arguments.length<1){message="";}
this.super$2(message);
},
];},[],["Error"], "0.8.0", "0.8.1"
);joo.classLoader.prepare(
"package",
"public dynamic class Array",1,function($$private){;return[
"public native function get length",
"public native function set length",
"public native function Array",
"public native function concat",
"public function every",function(callback,thisObject){if(arguments.length<2){thisObject=null;}
var i=0,
j=this.length;
if(thisObject){
for(;i<j;i++){
if(i in this){
if(!callback.call(thisObject,this[i],i,this)){
return false;
}
}
}
}else{
for(;i<j;i++){
if(i in this){
if(!callback(this[i],i,this)){
return false;
}
}
}
}
return true;
},
"public function filter",function(callback,thisObject){
var len=this.length;
var res=[];
var i=0;
var val;
if(thisObject){
for(;i<len;i++){
if(i in this){
val=this[i];
if(callback.call(thisObject,val,i,this)){
res.push(val);
}
}
}
}else{
for(;i<len;i++){
if(i in this){
val=this[i];
if(callback(val,i,this)){
res.push(val);
}
}
}
}
return res;
},
"public function forEach",function(callback,thisObject){
var i=0,
j=this.length;
if(thisObject){
for(;i<j;i++){
if(i in this){
callback.call(thisObject,this[i],i,this);
}
}
}else{
for(;i<j;i++){
if(i in this){
callback(this[i],i,this);
}
}
}
},
"public function indexOf",function(searchElement,fromIndex){if(arguments.length<2){fromIndex=0;}
var len=this.length;
for(var i=(fromIndex<0)?Math.max(0,len+fromIndex):fromIndex||0;i<len;i++){
if(searchElement===this[i])
return i;
}
return-1;
},
"public native function join",
"public function lastIndexOf",function(searchElement,fromIndex){if(arguments.length<2){fromIndex=0x7fffffff;}
var len=this.length;
for(var i=((fromIndex<0)?Math.max(len,len-fromIndex):fromIndex||len)-1;i>=0;i--){
if(searchElement===this[i])
return i;
}
return-1;
},
"public function map",function(callback,thisObject){if(arguments.length<2){thisObject=null;}
var results=[];
var i=0,
j=this.length;
if(thisObject){
for(;i<j;i++){
results[i]=callback.call(thisObject,this[i],i,this);
}
}else{
for(;i<j;i++){
results[i]=callback(this[i],i,this);
}
}
return results;
},
"public native function pop",
"public native function push",
"public native function reverse",
"public native function shift",
"public native function slice",
"public function some",function(callback,thisObject){if(arguments.length<2){thisObject=null;}
var i=0,
j=this.length;
if(thisObject){
for(;i<j;i++){
if(i in this){
if(callback.call(thisObject,this[i],i,this)){
return true;
}
}
}
}else{
for(;i<j;i++){
if(i in this){
if(callback(this[i],i,this)){
return true;
}
}
}
}
return false;
},
"public native function sort",
"public native function sortOn",
"public native function splice",
"public native function toLocaleString",
"public native function toString",
"public native function unshift",
"public static const",{CASEINSENSITIVE:1},
"public static const",{DESCENDING:2},
"public static const",{NUMERIC:16},
"public static const",{RETURNINDEXEDARRAY:8},
"public static const",{UNIQUESORT:4},
];},[],["Math"], "0.8.0", "0.8.1"
);joo.classLoader.prepare(
"package",
"public final dynamic class Date",1,function($$private){;return[
"public function get date",function(){
return this.getDate();
},
"public function set date",function(value){
this.setDate(value);
},
"public function get dateUTC",function(){
return this.getUTCDate();
},
"public function set dateUTC",function(value){
this.setUTCDate(value);
},
"public function get day",function(){
return this.getDay();
},
"public function get dayUTC",function(){
return this.getUTCDay();
},
"public function get fullYear",function(){
return this.getFullYear();
},
"public function set fullYear",function(value){
this.setFullYear(value);
},
"public function get fullYearUTC",function(){
return this.getUTCFullYear();
},
"public function set fullYearUTC",function(value){
this.setUTCFullYear(value);
},
"public function get hours",function(){
return this.getHours();
},
"public function set hours",function(value){
this.setHours(value);
},
"public function get hoursUTC",function(){
return this.getUTCHours();
},
"public function set hoursUTC",function(value){
this.setUTCHours(value);
},
"public function get milliseconds",function(){
return this.getMilliseconds();
},
"public function set milliseconds",function(value){
this.setMilliseconds(value);
},
"public function get millisecondsUTC",function(){
return this.getUTCMilliseconds();
},
"public function set millisecondsUTC",function(value){
this.setUTCMilliseconds(value);
},
"public function get minutes",function(){
return this.getMinutes();
},
"public function set minutes",function(value){
this.setMinutes(value);
},
"public function get minutesUTC",function(){
return this.getUTCMinutes();
},
"public function set minutesUTC",function(value){
this.setUTCMinutes(value);
},
"public function get month",function(){
return this.getMonth();
},
"public function set month",function(value){
this.setMonth(value);
},
"public function get monthUTC",function(){
return this.getUTCMonth();
},
"public function set monthUTC",function(value){
this.setUTCMonth(value);
},
"public function get seconds",function(){
return this.getSeconds();
},
"public function set seconds",function(value){
this.setSeconds(value);
},
"public function get secondsUTC",function(){
return this.getUTCSeconds();
},
"public function set secondsUTC",function(value){
this.setUTCSeconds(value);
},
"public function get time",function(){
return this.getTime();
},
"public function set time",function(value){
this.setTime(value);
},
"public function get timezoneOffset",function(){
return this.getTimezoneOffset();
},
"public native function Date",
"public native function getDate",
"public native function getDay",
"public native function getFullYear",
"public native function getHours",
"public native function getMilliseconds",
"public native function getMinutes",
"public native function getMonth",
"public native function getSeconds",
"public native function getTime",
"public native function getTimezoneOffset",
"public native function getUTCDate",
"public native function getUTCDay",
"public native function getUTCFullYear",
"public native function getUTCHours",
"public native function getUTCMilliseconds",
"public native function getUTCMinutes",
"public native function getUTCMonth",
"public native function getUTCSeconds",
"public static native function parse",
"public native function setDate",
"public native function setFullYear",
"public native function setHours",
"public native function setMilliseconds",
"public native function setMinutes",
"public native function setMonth",
"public native function setSeconds",
"public native function setTime",
"public native function setUTCDate",
"public native function setUTCFullYear",
"public native function setUTCHours",
"public native function setUTCMilliseconds",
"public native function setUTCMinutes",
"public native function setUTCMonth",
"public native function setUTCSeconds",
"public native function toDateString",
"public native function toLocaleDateString",
"public native function toLocaleString",
"public native function toLocaleTimeString",
"public native function toString",
"public native function toTimeString",
"public native function toUTCString",
"public native static function UTC",
"public native function valueOf",
"public native function getYear",
"public native function setYear",
"public native function toGMTString",
];},[],[], "0.8.0", "0.8.1"
);joo.classLoader.prepare(
"package joo",
"public class StandardClassLoader extends joo.SystemClassLoader",2,function($$private){;return[
"private static var",{classDeclarations:function(){return([]);}},
"private var",{imports:null},
"public function StandardClassLoader",function(){this.super$2();
this.imports$2=[];
},
"override protected function createClassDeclaration",function(packageDef,classDef,inheritanceLevel,memberFactory,
publicStaticMethodNames,dependencies){
var cd=new joo.JooClassDeclaration(packageDef,classDef,inheritanceLevel,memberFactory,publicStaticMethodNames,dependencies);
$$private.classDeclarations.push(cd);
return cd;
},
"public function import_",function(fullClassName){
this.imports$2.push(fullClassName);
},
"public function run",function(mainClassName){var this$=this;var args=Array.prototype.slice.call(arguments,1);
this.complete(function(){
var mainClass=this$.getRequiredClassDeclaration(mainClassName).init();
mainClass.constructor_["main"].apply(null,args);
});
},
"public override function init",function(){var classes=arguments;
var clazz;
for(var i=0;i<classes.length;++i){
if("$class"in classes[i]){((clazz=classes[i])["$class"]).init();
}
}
return clazz;
},
"public function complete",function(onCompleteCallback){
this.completeAll();
if(onCompleteCallback){
this.doCompleteCallbacks([onCompleteCallback]);
}
},
"protected function completeAll",function(){
for(var i=0;i<$$private.classDeclarations.length;i++){
var classDeclaration=$$private.classDeclarations[i];
classDeclaration.complete();
if(classDeclaration.isNative()){
classDeclaration.init();
}
}
},
"protected function doCompleteCallbacks",function(onCompleteCallbacks){
if(onCompleteCallbacks.length){
var importMap={};
for(var j=0;j<this.imports$2.length;j++){
var fullClassName=this.imports$2[j];
var className=fullClassName.substring(fullClassName.lastIndexOf(".")+1);
importMap[className]=joo.classLoader.getRequiredClassDeclaration(fullClassName).init().constructor_;
}
for(var i=0;i<onCompleteCallbacks.length;++i){
onCompleteCallbacks[i](importMap);
}
}
},
];},[],["joo.SystemClassLoader","joo.JooClassDeclaration","joo.NativeClassDeclaration"], "0.8.0", "0.8.1"
);joo.classLoader.prepare(
"package joo",
"public class DynamicClassLoader extends joo.StandardClassLoader",3,function($$private){var trace=joo.trace;return[
"private static function isEmpty",function(object){
for(var m in object){
return false;
}
return true;
},
"public static var",{INSTANCE:null},
"private var",{resourceByPath:function(){return({});}},
"private var",{onCompleteCallbacks:function(){return([]);}},
"public function DynamicClassLoader",function(){this.super$3();this.resourceByPath$3=this.resourceByPath$3();this.onCompleteCallbacks$3=this.onCompleteCallbacks$3();this.pendingDependencies$3=this.pendingDependencies$3();this.pendingClassState$3=this.pendingClassState$3();
joo.classLoader=joo.DynamicClassLoader.INSTANCE=this;
},
"private var",{pendingDependencies:function(){return([]);}},
"private var",{pendingClassState:function(){return({});}},
"override public function prepare",function(){var params=arguments;
var cd=(this.prepare$3.apply(this,params));
this.pendingDependencies$3.push(cd);
this.fireDependency(cd.fullClassName);
return cd;
},
"public function addDependency",function(dependency){
this.pendingClassState$3[dependency]=true;
},
"public function fireDependency",function(dependency){
if(delete this.pendingClassState$3[dependency]){
if(this.onCompleteCallbacks$3.length){
this.loadPendingDependencies$3();
if($$private.isEmpty(this.pendingClassState$3)){
this.doCompleteCallbacks(this.onCompleteCallbacks$3);
}
}
}
},
"override protected function doCompleteCallbacks",function(onCompleteCallbacks){var this$=this;
this.onCompleteCallbacks$3=[];
joo.getQualifiedObject("setTimeout")(function(){
this$.completeAll();
this$.internalDoCompleteCallbacks$3(onCompleteCallbacks);
},0);
},
"private function internalDoCompleteCallbacks",function(onCompleteCallbacks){
this.doCompleteCallbacks$3(onCompleteCallbacks);
},
"private function createClassLoadErrorHandler",function(fullClassName,url){var this$=this;
return function(){
this$.classLoadErrorHandler(fullClassName,url);
};
},
"public function classLoadErrorHandler",function(fullClassName,url){
trace("[ERROR] Jangaroo Runtime: Class "+fullClassName+" not found at URL ["+url+"].");
},
"public override function import_",function(fullClassName){
this.import_$3(fullClassName);
this.load$3(fullClassName);
},
"override public function run",function(mainClassName){var args=Array.prototype.slice.call(arguments,1);
this.load$3(mainClassName);
args.splice(0,0,mainClassName);
this.run$3.apply(this,args);
},
"private function load",function(fullClassName){
var resourcePathMatch=fullClassName.match(/^resource:(.*)$/);
if(resourcePathMatch){
this.loadResource$3(resourcePathMatch[1]);
return;
}
if(!this.getClassDeclaration(fullClassName)){
if(this.onCompleteCallbacks$3.length==0){
if(this.pendingClassState$3[fullClassName]===undefined){
this.pendingClassState$3[fullClassName]=false;
}
}else{
if(this.pendingClassState$3[fullClassName]!==true){
this.pendingClassState$3[fullClassName]=true;
var url=joo.getRelativeClassUrl(fullClassName);
var script=joo.loadScriptAsync(url);
script.onerror=this.createClassLoadErrorHandler$3(fullClassName,script['src']);
}
}
}
},
"private static const",{RESOURCE_TYPE_IMAGE:"Image"},
"private static const",{RESOURCE_TYPE_AUDIO:"Audio"},
"private static const",{RESOURCE_TYPE_BY_EXTENSION:function(){return({
"png":$$private.RESOURCE_TYPE_IMAGE,
"gif":$$private.RESOURCE_TYPE_IMAGE,
"jpg":$$private.RESOURCE_TYPE_IMAGE,
"jpeg":$$private.RESOURCE_TYPE_IMAGE,
"mp3":$$private.RESOURCE_TYPE_AUDIO,
"ogg":$$private.RESOURCE_TYPE_AUDIO,
"wav":$$private.RESOURCE_TYPE_AUDIO
});}},
"private function loadResource",function(path){var this$=this;var this$=this;
var resource=this.resourceByPath$3[path];
if(!resource){
var dotPos=path.lastIndexOf('.');
var extension=path.substring(dotPos+1);
var resourceType=$$private.RESOURCE_TYPE_BY_EXTENSION[extension];
if(resourceType){
var resourceTypeClass=joo.getQualifiedObject(resourceType);
if(resourceTypeClass){
this.resourceByPath$3[path]=resource=new(resourceTypeClass)();
if(resourceType===$$private.RESOURCE_TYPE_IMAGE){
this.addDependency("resource:"+path);
resource.onload=function(){
this$.fireDependency("resource:"+path);
};
resource.onerror=function(m){
trace("[WARN]","Error while loading resource "+path+": "+m);
this$.fireDependency("resource:"+path);
};
}else if(resourceType===$$private.RESOURCE_TYPE_AUDIO){
if(!resource['canPlayType']("audio/"+extension)){
var fallbackExtension=$$private.findFallback(resource);
if(!fallbackExtension){
return;
}
path=path.substring(0,dotPos)+"."+fallbackExtension;
}
resource.preload="auto";
}
resource.src=joo.baseUrl+"joo/classes/"+path;
}else{
trace("[WARN]","Resource type "+resourceType+" not supported by client, ignoring resource "+path);
}
}else{
trace("[WARN]","Ignoring unsupported media type of file "+path);
}
}
},
"private static const",{AUDIO_FALLBACK_ORDER:function(){return(["mp3","ogg","wav"]);}},
"private static var",{AUDIO_FALLBACK_EXTENSION:null},
"private static function findFallback",function(audio){
if($$private.AUDIO_FALLBACK_EXTENSION===null){
for(var i=0;i<$$private.AUDIO_FALLBACK_ORDER.length;i++){
var fallback=$$private.AUDIO_FALLBACK_ORDER[i];
if(audio['canPlayType']("audio/"+fallback)){
return $$private.AUDIO_FALLBACK_EXTENSION=fallback;
}
}
trace("[WARN]","Could not find any audio extension that this client can play ("+$$private.AUDIO_FALLBACK_ORDER.join(",")+
"), no sound available.");
$$private.AUDIO_FALLBACK_EXTENSION="";
}
return $$private.AUDIO_FALLBACK_EXTENSION;
},
"public function getResource",function(path){
return this.resourceByPath$3[path];
},
"public override function complete",function(onCompleteCallback){
if(onCompleteCallback||this.onCompleteCallbacks$3.length==0){
this.onCompleteCallbacks$3.push(onCompleteCallback||$$private.defaultOnCompleteCallback);
}
this.loadPendingDependencies$3();
if($$private.isEmpty(this.pendingClassState$3)){
this.doCompleteCallbacks(this.onCompleteCallbacks$3);
}else{
for(var c in this.pendingClassState$3){
this.load$3(c);
}
}
},
"private static function defaultOnCompleteCallback",function(){
trace("[INFO] Jangaroo Runtime: All classes loaded!");
},
"private function loadPendingDependencies",function(){
for(var j=0;j<this.pendingDependencies$3.length;++j){
var dependencies=(this.pendingDependencies$3[j]).getDependencies();
for(var i=0;i<dependencies.length;++i){
this.load$3(dependencies[i]);
}
}
this.pendingDependencies$3=[];
},
];},[],["joo.StandardClassLoader","joo.JooClassDeclaration"], "0.8.0", "0.8.1"
);joo.classLoader.prepare(
"package joo",
"public class ResourceBundleAwareClassLoader extends joo.DynamicClassLoader",4,function($$private){;return[function(){joo.classLoader.init(joo.localization,joo.NativeClassDeclaration);},
"private static const",{DAYS_TILL_LOCALE_COOKIE_EXPIRY:10*356},
"public static var",{INSTANCE:null},
"private var",{supportedLocales:null},
"private var",{localeCookieName:null},
"private var",{localeCookiePath:null},
"public var",{localeCookieDomain:null},
"private var",{locale:null},
"public function ResourceBundleAwareClassLoader",function(supportedLocales,
localeCookieName,
localeCookiePath,
localeCookieDomain){
joo.ResourceBundleAwareClassLoader.INSTANCE=this;
this.super$4();
this.supportedLocales$4=supportedLocales||joo.localization.supportedLocales||["en"];
this.localeCookieName$4=localeCookieName||joo.localization.localeCookieName||"joo.locale";
this.localeCookiePath$4=localeCookiePath||joo.localization.localeCookiePath||joo.getQualifiedObject("location.pathname");
this.localeCookieDomain=localeCookieDomain||joo.localization.localeCookieDomain||null;
},
"public function getSupportedLocales",function(){
return this.supportedLocales$4.concat();
},
"public function getDefaultLocale",function(){
return this.supportedLocales$4[0];
},
"override protected function createClassDeclaration",function(packageDef,classDef,inheritanceLevel,memberFactory,
publicStaticMethodNames,dependencies){
var cd=(this.createClassDeclaration$4(packageDef,classDef,inheritanceLevel,memberFactory,publicStaticMethodNames,dependencies));
if(cd.fullClassName.match(joo.NativeClassDeclaration.RESOURCE_BUNDLE_PATTERN)){
cd.getDependencies().push(this.getLocalizedResourceClassName$4(cd));
}
return cd;
},
"public function createSingleton",function(resourceBundle){
var cd=(resourceBundle['$class']);
var fullLocalizedClassName=this.getLocalizedResourceClassName$4(cd);
var LocalizedResourceBundle=joo.getQualifiedObject(fullLocalizedClassName);
return new LocalizedResourceBundle();
},
"private function escape",function(s){
return s.replace(/([.*+?^${}()|[\]\/\\])/g,"\\$1");
},
"private function readLocaleFromCookie",function(){
var cookieKey=this.escape$4(this.localeCookieName$4);
var document=joo.getQualifiedObject("document");
var match=document.cookie.match("(?:^|;)\\s*"+cookieKey+"=([^;]*)");
return match?decodeURIComponent(match[1]):null;
},
"private function setCookie",function(name,value,
path,
expires,
domain,
secure){if(arguments.length<6){if(arguments.length<5){if(arguments.length<4){if(arguments.length<3){path=null;}expires=null;}domain=null;}secure=false;}
var document=joo.getQualifiedObject("document");
document.cookie=
name+"="+encodeURIComponent(value)+
((expires===null)?"":("; expires="+expires.toGMTString()))+
((path===null)?"":("; path="+path))+
((domain===null)?"":("; domain="+domain))+
(secure?"; secure":"");
},
"private function getLocaleCookieExpiry",function(){
var date=new Date();
date.setTime(date.getTime()+($$private.DAYS_TILL_LOCALE_COOKIE_EXPIRY*24*60*60*1000));
return date;
},
"private function readLocaleFromNavigator",function(locale){
var navigator=joo.getQualifiedObject("navigator");
if(navigator){
locale=navigator['language']||navigator['browserLanguage']
||navigator['systemLanguage']||navigator['userLanguage'];
if(locale){
locale=locale.replace(/-/g,"_");
}
}
return locale;
},
"public function setLocale",function(locale){
var longestMatch="";
for(var i=0;i<this.supportedLocales$4.length;i++){
if(locale.indexOf(this.supportedLocales$4[i])===0
&&this.supportedLocales$4[i].length>longestMatch.length){
longestMatch=this.supportedLocales$4[i];
}
}
this.locale$4=longestMatch?longestMatch:this.getDefaultLocale();
this.setCookie$4(this.localeCookieName$4,this.locale$4,this.localeCookiePath$4,this.getLocaleCookieExpiry$4(),this.localeCookieDomain);
return this.locale$4;
},
"public function getLocale",function(){
if(!this.locale$4){
this.setLocale(this.readLocaleFromCookie$4()||this.readLocaleFromNavigator$4(this.locale$4));
}
return this.locale$4;
},
"private function getLocalizedResourceClassName",function(cd){
var localizedResourceClassName=cd.fullClassName;
var locale=this.getLocale();
if(locale!==this.getDefaultLocale()){
localizedResourceClassName+="_"+locale;
}
return localizedResourceClassName;
},
];},[],["joo.DynamicClassLoader","joo.localization","joo.JooClassDeclaration","joo.NativeClassDeclaration","Date"], "0.8.0", "0.8.1"
);joo.classLoader = new ('localization' in joo ? joo.ResourceBundleAwareClassLoader : joo.DynamicClassLoader)();
