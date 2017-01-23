
function demolink (){

    var demolink = document.createElement('div');
    demolink.className = 'link';
    document.body.appendChild( demolink );

    var demos = ['basic', 'compound', 'compound2', 'ragdoll', 'collision', 'moving', 'terrain', 'vehicle', 'walker'];
    var n; 
    for(var i=0; i<demos.length; i++ ){
        n = document.createElement('a');
        n.innerHTML = demos[i];
        n.setAttribute('href', 'test_'+demos[i]+'.html');

        demolink.appendChild( n );
    }

}