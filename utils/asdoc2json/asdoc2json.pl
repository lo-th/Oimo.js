#!/usr/bin/env perl -w

# humbletim's quick n' dirty experiment (to autoextract ActionScript comments)

# usage: perl asdoc2json.pl <filename1.as> [<filename2.as> etc.]

# notes: github.com/saharan/OimoPhysics .as => github.com/lo-th/Oimo.js .js
#  the general idea is to:
#  1) extract saharan's inline comments into a quick JSON structure
#  2) let Google Translate have at 'em
#  3) write a node script or something to reflect somehow into Oimo.js source..

use JSON;
use File::Slurp;
use File::Basename;

my %packages;


foreach my $filename (@ARGV) {
  my $data = File::Slurp::slurp($filename);

  # assume first package-like line describes just that
  my ($package) = $data =~ m/package ([^ ]+)/;

  # OimoPhysics.as seems to have a 1:1 relationship between .as and class
  my ($class) = $data =~ m/class ([^ ]+)/;

  print STDERR "processing: $package.$class\n";

  # saharan's ActionScript commenting pattern appears to be:
  #   /** inline coments */ <CRLF> <<actionscript thing>>
  # ... so we'll just grab "/**" comments and an immediate next line

  my @comments_and_nextline = 
    $data =~ m!/\*(?:.|[\r\n])*?\*/[^\n]+\n[^\n]+!sg;

  foreach my $asdoc (@comments_and_nextline) {
    # for now just trim some whitespace
    my @lines = map { $_=~s/[\t\r]//g; $_  } split(/\n/, $asdoc);

    # in theory the last line now contains the comment's actionscript subject
    my $subject = pop @lines;

    # add the comment record to the json database tree
    push @{$packages{$package}{$class}},
      {
       comment => (join "\n", @lines),
       subject => $subject
      };
  }
}

# and finally pretty JSON print the generated database
print to_json(\%packages, { pretty => 1 });
