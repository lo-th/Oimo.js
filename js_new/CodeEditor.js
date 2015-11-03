/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_|
*    @author lo.th / http://lo-th.github.io/labs/
*/

var CodeEditor = function(callback){

    this.callback = callback;

    this.content = document.createElement('div');
    this.content.className = 'editor';
    document.body.appendChild( this.content );

    this.isSelfDrag = false;
    this.isFocus = false;
    this.errorLines = [];
    this.widgets = [];
    this.interval = null;
    this.editor = CodeMirror(this.content, {
        lineNumbers: false, matchBrackets: true, indentWithTabs: true, styleActiveLine: true,
        theme:'monokai', mode:'text/javascript',
        tabSize: 4, indentUnit: 4, highlightSelectionMatches: {showToken: /\w/}
    });

    var _this = this;
    this.editor.on('change', function() { _this.onChange() } );
    this.editor.on('focus', function() { _this.isFocus = true; } );
    this.editor.on('blur', function() { _this.isFocus = false; } );
    this.editor.on('drop', function(e) { if(!_this.isSelfDrag) _this.editor.setValue(''); else _this.isSelfDrag=false; } );
    this.editor.on('dragstart', function(e) { _this.isSelfDrag=true; } );
    //this.editor.on('dragend', function(e) { _this.isSelfDrag=false; } );
};

CodeEditor.prototype = {
    constructor: CodeEditor,
    load : function (url){
        var _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            var reader = new FileReader();
            reader.onload = function(e) {
                _this.editor.setValue(e.target.result);
            }
            reader.readAsText(this.response);
        };
        xhr.send();
    },
    unFocus:function(){
        this.editor.getInputField().blur();
    },
    refresh:function(){
        this.editor.refresh();
    },
    validate : function ( value ){
        var _this = this;
        return this.editor.operation( function () {
            while ( _this.errorLines.length > 0 ) _this.editor.removeLineClass( _this.errorLines.shift(), 'background', 'errorLine' );
            var i = _this.widgets.length;
            while(i--) _this.editor.removeLineWidget( _this.widgets[ i ] );
            _this.widgets.length = 0;
            var string = value;
            try {
                var result = esprima.parse( string, { tolerant: true } ).errors;
                i = result.length;
                while(i--){
                    var error = result[ i ];
                    var m = document.createElement( 'div' );
                    m.className = 'esprima-error';
                    m.textContent = error.message.replace(/Line [0-9]+: /, '');
                    var l = error.lineNumber - 1;
                    _this.errorLines.push( l );
                    _this.editor.addLineClass( l, 'background', 'errorLine' );
                    var widget = _this.editor.addLineWidget( l, m );
                    _this.widgets.push( widget );
                }
            } catch ( error ) {
                var m = document.createElement( 'div' );
                m.className = 'esprima-error';
                m.textContent = error.message.replace(/Line [0-9]+: /, '');
                var l = error.lineNumber - 1;
                _this.errorLines.push( l );
                _this.editor.addLineClass( l, 'background', 'errorLine' );
                var widget = _this.editor.addLineWidget( l, m );
                _this.widgets.push( widget );
            }
            return _this.errorLines.length === 0;
        });
    },
    onChange : function (){
        var _this = this;
        clearTimeout( this.interval );
        var value = this.editor.getValue();
        if(this.validate( value )) this.interval = setTimeout( function() {_this.inject(value); }, 500);
        //editor.focus();
    },
    inject : function (value){

        var name = value.substring(value.indexOf("function")+9, value.indexOf("("));
        var oScript = document.createElement("script");
        oScript.language = "javascript";
        oScript.type = "text/javascript";
        oScript.text = value;
        document.getElementsByTagName('BODY').item(0).appendChild(oScript);

        this.callback(name);
    }
}