#!/usr/bin/env node

// just experimenting with the JSON comments...

var lookup = process.argv[2];

if (!lookup) {
   console.warn("usage: node oimodoc.js <case-insensitive regex>");
   console.warn("       ... like node oimodoc.js joint");
   process.exit(1);
}

var packages = JSON.parse(
   require('fs')
      .readFileSync('../../build/OimoPhysics.rev.comments.json')
);

lookup = new RegExp(lookup,"i");

// console.warn("searching packages...");
// Object.keys(packages)
//    .filter(function(key) { return lookup.test(key); })
//    .forEach(function(package) {
//                console.warn("found package: ", package);
//             });

for(var package in packages) {
   for(var clazz in packages[package]) {

      var OimoJS = [
         package.replace(/\./g,'/')
            .replace("com/element/oimo/physics/",
                     "../../src/rev/"),
         "/",
         clazz,
         ".js"
      ].join("");

      console.log("///////////////////////////////////////////////////////////////");
      console.log("// "+package+"."+clazz);
      console.log("// maybe goes with ", OimoJS);

      packages[package][clazz]
      .filter(function(comment) { return lookup.test(comment.subject); })
         .forEach(
            function(comment) {
               console.warn("what: ", package+"."+clazz);
               //console.warn("subject:", comment.subject);
               
               // naive quick n' dirty first pass transcoding as => js infos
               comment.subject
               .replace(/public class (\w+) /,
                        function(_, clz) {
                           console.log(comment.comment);
                           console.log("OIMO."+clz+"=function(...){}\nOIMO."+clz+".prototype={");
                        });

               comment.subject
               .replace(/ var (\w+):/,
                        function(_, asvar) {
                           console.log(comment.comment.replace(/^/mg,'\t'));
                           console.log("\tthis."+asvar+"=...");
                           console.log("");
                        });

               comment.subject
               .replace(/ function (\w+)\(/,
                        function(_, func) {
                           console.log(comment.comment.replace(/^/mg,'\t'));
                           console.log("\t"+func+":function(){}...");
                           console.log("");
                        });



               console.warn("/*[[[" + comment.subject + "]]]*/");
            });
      
      console.log("}; // eof:", package+"."+clazz);
      console.log("");
   }
}


