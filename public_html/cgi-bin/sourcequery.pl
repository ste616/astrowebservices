#!/usr/bin/perl

use CGI qw(:standard);
use strict;

my $in=CGI->new;

my %input=$in->Vars;

# debugging

print $in->header('text/json');

my @planetnames=('mercury','venus','mars','jupiter',
		 'saturn','uranus','neptune','sun');
my @months=('JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG',
	    'SEP','OCT','NOV','DEC');

# Changeable program locations.
# The Miriad task 'planets'.
my $planets = "/home/ste616/usr/src/miriad/linux64/bin/planets";
# The location of wget.
my $wget = "/usr/bin/wget";

print "{";

if (!$input{'name'}){
    print " error: 'No name supplied.', name: '', position: {} }\n";
    exit;
}

if (!$input{'noplanets'}) {
    # check for a planet first
    my $cn=lc($input{'name'});
    for (my $i=0;$i<=$#planetnames;$i++){
	if ($planetnames[$i] eq $cn){
	    my @time=gmtime;
	    my $epoch=sprintf "%4d%3s%02dT%02d:%02d:%02d",
	    $time[5]+1900,$months[$time[4]],$time[3],
	    $time[2],$time[1],$time[0];
	    my $info=`$planets source=$planetnames[$i] epoch=$epoch`;
	    my @infosplit=split(/\n/,$info);
	    my ($ra,$dec);
	    for (my $j=0;$j<=$#infosplit;$j++){
		if ($infosplit[$j]=~/RA:\s+(.*)$/){
		    $ra=$1;
		} elsif ($infosplit[$j]=~/DEC:\s+(.*)$/){
		    $dec=$1;
		}
	    }
	    print "name: '".$input{'name'}."', position: {".
		"ra: '".$ra."', dec: '".$dec."', epoch: 'J2000' }, ".
		"resolver: 'planets' }\n";
	    exit;
	}
    }
}

# otherwise we query the Sesame database
my $url="http://cdsws.u-strasbg.fr/axis/services/Sesame?".
	"method=sesame&type=p&name=".$input{'name'};
    
my $rv = `$wget -q -O - "$url"`;
my $name;
my $position;
my @re=split(/\n/,$rv);
my ($ra,$dec);
for (my $i=0;$i<=$#re;$i++){
  if ($re[$i]=~/^\%J\s/){
    $position=$re[$i];
    if ($position=~/^(.*)\=\s(.*)$/){
	$position=$2;
	($ra,$dec)=split(/\s+/,$position);
    }
  } elsif ($re[$i]=~/^%I.0\s/){
    $name=$re[$i];
    $name=~s/%I.0\s+//;
    $name=~s/NAME\s+//;
  }
}
    
print " name: '".$input{'name'}."', position: { ra: '".$ra."',".
  "dec: '".$dec."', epoch: 'J2000' }, resolver: 'sesame',".
  " resolvedName: '".$name."' }\n";
