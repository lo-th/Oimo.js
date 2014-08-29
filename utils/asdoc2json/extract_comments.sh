#!/bin/bash
set -e
test -n "$OIMOPHYSICS" -a -d "$OIMOPHYSICS/src"  || 
  { echo "usage: OIMOPHYSICS=<path to OimoPhysics repo> $0" ; exit 1; }

# do a quick pretest to make sure JSON module is available
perl -MJSON -e1

perl asdoc2json.pl `find "$OIMOPHYSICS/dev" -name \*.as` > ../../build/OimoPhysics.dev.comments.json
perl asdoc2json.pl `find "$OIMOPHYSICS/src" -name \*.as` >  ../../build/OimoPhysics.rev.comments.json

ls -l ../../build/OimoPhysics.{rev,dev}.comments.json
