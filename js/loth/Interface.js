/**
 * @author loth / http://3dflashlo.wordpress.com/
 */

var Interface = function (name) {
	var container = document.createElement( 'div' );
	container.id = 'interface';
	var unselect = '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select: none; user-select: none;'
	//container.style.cssText = unselect+ 'position:absolute; color:#CCCCCC; font-size:10px; font-family:"Trebuchet MS", Helvetica, sans-serif; width:100%; height:100%; pointer-events:none;';
	container.style.cssText =unselect +  'position:absolute; left:0; right:0; top:0; bottom:0; color:#FFFFFF; font-size:10px; font-family:SourceCode; pointer-events:none;  overflow:hidden; -webkit-font-smoothing: antialiased;';
	var effect = '';//border:3px solid rgba(255,255,255,0.3);
	var buttonStyle = effect+'width:30px; height:28px; position:relative; -webkit-border-radius: 20px; border-radius:20px; background-color: rgba(1,1,1,0.0); display:inline-block; text-align:center; cursor:pointer; pointer-events:auto; font-size:18px; ';
	var bbStyle = 'width:130px; height:28px; position:relative; display:inline-block; text-decoration:none; font-size:14px; ';

	//-----------------------------------------------------
    //  ICON
    //-----------------------------------------------------
    var iconSize = 40;//48;
    var iconColor = '#ffffff';

    var icon_logos = [
	    "<svg version='1.1' id='oimo' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
	    "width='40px' height='40px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
        "<path fill='none' stroke='#FFFFFF' stroke-width='30' stroke-miterlimit='10' d='M310.215,82.307",
	    "c-40.867-12.279-86.859-5.284-105.407,6.843c-45.29,29.612-34.695,57.513-63.106,107.836",
	    "c-28.035,49.658-46.876,76.344-40.464,124.752c6.61,49.901,24.723,98.776,121.386,116.684s145.224-25.592,159.089-65.439",
	    "c17.737-50.974-1.591-91.972-6.908-134.5c-4.861-38.877,17.96-77.561-3.27-112.521C350.714,91.678,310.215,82.307,310.215,82.307z'/>",
        "<circle fill='#FFFFFF' stroke='none' cx='245.424' cy='153.905' r='16'/>",
        "<circle fill='#FFFFFF' stroke='none' cx='302.593' cy='168.211' r='10'/></svg>"
    ].join("\n");

    var icon_github= [
		"<svg version='1.1' id='Calque_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 128 128' enable-background='new 0 0 128 128' xml:space='preserve'>",
		"<path id='icon_github' fill='"+iconColor+"' d='M64.606,16.666c-26.984,0-48.866,21.879-48.866,48.872",
		"c0,21.589,14.001,39.905,33.422,46.368c2.444,0.448,3.335-1.06,3.335-2.356c0-1.16-0.042-4.233-0.066-8.312",
		"c-13.594,2.953-16.462-6.551-16.462-6.551c-2.222-5.645-5.426-7.148-5.426-7.148c-4.437-3.032,0.336-2.971,0.336-2.971",
		"c4.904,0.346,7.485,5.036,7.485,5.036c4.359,7.468,11.438,5.312,14.222,4.061c0.444-3.158,1.706-5.312,3.103-6.533",
		"c-10.852-1.233-22.26-5.426-22.26-24.152c0-5.335,1.904-9.697,5.03-13.113c-0.503-1.236-2.18-6.205,0.479-12.933",
		"c0,0,4.103-1.314,13.438,5.01c3.898-1.084,8.078-1.626,12.234-1.645c4.15,0.019,8.331,0.561,12.234,1.645",
		"c9.33-6.324,13.425-5.01,13.425-5.01c2.666,6.728,0.989,11.697,0.486,12.933c3.132,3.416,5.023,7.778,5.023,13.113",
		"c0,18.773-11.426,22.904-22.313,24.114c1.755,1.509,3.318,4.491,3.318,9.05c0,6.533-0.06,11.804-0.06,13.406",
		"c0,1.307,0.88,2.827,3.36,2.35c19.402-6.475,33.391-24.779,33.391-46.363C113.478,38.545,91.596,16.666,64.606,16.666z'/></svg>"
	].join("\n");

    var icon_gear = [
        "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
        "width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
        "<path id='icon_gear' fill='"+iconColor+"' d='M462,283.742v-55.485l-49.249-17.514c-3.4-11.792-8.095-23.032-13.919-33.563l22.448-47.227",
        "l-39.234-39.234l-47.226,22.449c-10.53-5.824-21.772-10.52-33.564-13.919L283.741,50h-55.484l-17.515,49.25",
        "c-11.792,3.398-23.032,8.094-33.563,13.918l-47.227-22.449l-39.234,39.234l22.45,47.227c-5.824,10.531-10.521,21.771-13.919,33.563",
        "L50,228.257v55.485l49.249,17.514c3.398,11.792,8.095,23.032,13.919,33.563l-22.45,47.227l39.234,39.234l47.227-22.449",
        "c10.531,5.824,21.771,10.52,33.563,13.92L228.257,462h55.484l17.515-49.249c11.792-3.398,23.034-8.095,33.564-13.919l47.226,22.448",
        "l39.234-39.234l-22.448-47.226c5.824-10.53,10.521-21.772,13.919-33.564L462,283.742z M256,331.546",
        "c-41.724,0-75.548-33.823-75.548-75.546s33.824-75.547,75.548-75.547c41.723,0,75.546,33.824,75.546,75.547",
        "S297.723,331.546,256,331.546z'/></svg>"
    ].join("\n");

    var icon_material = [
	    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
	    "<path id='icon_material' fill='"+iconColor+"' d='M255.5,156c-55.141,0-100,44.86-100,100c0,55.141,44.859,100,100,100s100-44.859,100-100",
		"C355.5,200.86,310.641,156,255.5,156z M255.5,316c-33.084,0-60-26.916-60-60s26.916-60,60-60s60,26.916,60,60S288.584,316,255.5,316",
		"z M150.779,179.064l-54.586-54.586l28.285-28.284l54.664,54.664C168.305,158.75,158.73,168.272,150.779,179.064z M332.436,151.28",
		"l55.086-55.086l28.285,28.284l-55.164,55.165C352.75,168.805,343.229,159.229,332.436,151.28z M127.039,276H50v-40h77.039",
		"c-1.012,6.521-1.539,13.2-1.539,20C125.5,262.801,126.027,269.479,127.039,276z M236,127.463V50h40v77.622",
		"c-6.68-1.062-13.525-1.622-20.5-1.622C248.873,126,242.362,126.502,236,127.463z M179.143,361.143l-54.664,54.664l-28.285-28.285",
		"l54.586-54.585C158.729,343.729,168.305,353.251,179.143,361.143z M462,236v40h-78.039c1.012-6.521,1.539-13.199,1.539-20",
		"c0-6.8-0.527-13.479-1.539-20H462z M276,384.378V462h-40v-77.463c6.362,0.962,12.873,1.463,19.5,1.463",
		"C262.475,386,269.32,385.441,276,384.378z M360.643,332.357l55.164,55.164l-28.285,28.285l-55.086-55.086",
		"C343.229,352.771,352.751,343.195,360.643,332.357z'/></svg>"
    ].join("\n");

    var icon_shadow = [
	    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
	    "<path id='icon_shadow' fill='"+iconColor+"' d='M256,90c44.342,0,86.027,17.267,117.381,48.62S422,211.66,422,256.001",
		"c0,44.34-17.266,86.026-48.619,117.379C342.027,404.733,300.342,422,256,422c-44.34,0-86.027-17.267-117.379-48.62",
		"C107.268,342.027,90,300.341,90,256.001c0-44.341,17.268-86.027,48.621-117.381C169.973,107.267,211.66,90,256,90z M256,50",
		"C142.229,50,50,142.229,50,256.001C50,369.771,142.229,462,256,462s206-92.229,206-205.999C462,142.229,369.771,50,256,50z M256,392",
		"c-36.328,0-70.48-14.146-96.166-39.833C134.146,326.48,120,292.328,120,256.001c0-36.328,14.146-70.48,39.834-96.168",
		"C185.52,134.146,219.672,120,256,120V392z'/></svg>"
    ].join("\n");

    /*var icon_env = [
	    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
	    "<path id='icon_env' fill='"+iconColor+"'  d='M256.417,90c44.34,0,86.026,17.267,117.38,48.62c31.354,31.354,48.62,73.04,48.62,117.38",
		"c0,44.34-17.267,86.026-48.62,117.38c-31.354,31.353-73.04,48.62-117.38,48.62s-86.026-17.268-117.38-48.62",
		"c-31.354-31.354-48.62-73.04-48.62-117.38c0-44.34,17.267-86.026,48.62-117.38C170.391,107.267,212.077,90,256.417,90 M256.417,50",
		"c-113.771,0-206,92.229-206,206s92.229,206,206,206s206-92.229,206-206S370.188,50,256.417,50L256.417,50z M342.41,237.25",
		"c-1.479-36.569-31.577-65.765-68.508-65.765c-25.183,0-47.183,13.583-59.107,33.814c-5.449-3.39-11.857-5.379-18.746-5.379",
		"c-19.566,0-35.432,15.795-35.57,35.33c-17.266,8.197-29.206,25.79-29.206,46.173c0,28.22,22.872,51.092,51.091,51.092H333.51",
		"c26.537,0,48.052-21.513,48.052-48.05C381.562,260.969,364.692,241.425,342.41,237.25z'/></svg>"
    ].join("\n");*/

    var icon_env = [
	    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
	    "width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
	    "<path id='icon_env' fill='"+iconColor+"' d='M409.338,216.254c-10.416-54.961-58.666-95.777-115.781-95.777c-35.098,0-67.631,15.285-89.871,41.584",
		"c-37.148-9.906-76.079,11.781-86.933,48.779C78.16,222.176,50.6,257.895,50.6,299.303c0,50.852,41.37,92.221,93.222,92.221H369.18",
		"c50.85,0,92.221-41.369,92.221-92.221C461.4,263.389,440.941,231.457,409.338,216.254z M369.18,351.523H143.821",
		"c-29.795,0-53.222-23.426-53.222-52.221c0-34.078,27.65-60.078,62.186-53.816c-11.536-39.596,44.131-61.93,64.641-32.348",
		"c5.157-14.582,25.823-52.662,76.131-52.662c38.027,0,77.361,26.08,78.664,84.982c25.363,0.098,49.18,18.432,49.18,53.844",
		"C421.4,328.098,397.975,351.523,369.18,351.523z'/></svg>"
    ].join("\n");

    var icon_target = [
	    "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
		"<path id='icon_target' fill='"+iconColor+"' d='M280.316,266.703l158.854,78.616l-55.943,21.638l53.979,69.331L405.115,462l-54.461-70.728",
		"l-34.746,48.97L280.316,266.703z M237.525,178.318c-19.426,0-35.178,15.748-35.178,35.177c0,19.427,15.752,35.178,35.178,35.178",
		"c19.428,0,35.178-15.751,35.178-35.178C272.703,194.066,256.953,178.318,237.525,178.318z M270.521,343.293",
		"c-10.654,2.713-21.715,4.116-32.996,4.116c-35.449,0-68.775-13.804-93.844-38.869c-25.066-25.068-38.871-58.396-38.871-93.846",
		"c0-35.447,13.805-68.775,38.873-93.843c25.066-25.066,58.395-38.872,93.842-38.872c35.449,0,68.775,13.806,93.844,38.872",
		"c25.066,25.067,38.871,58.396,38.871,93.843c0,21.681-5.172,42.563-14.918,61.253l28.643,14.176",
		"c11.664-22.601,18.256-48.244,18.256-75.429C402.221,123.739,328.482,50,237.525,50C146.57,50,72.83,123.739,72.83,214.694",
		"c0,90.962,73.74,164.694,164.695,164.694c13.59,0,26.791-1.658,39.422-4.76L270.521,343.293z M237.525,114.89",
		"c-55.119,0-99.805,44.687-99.805,99.805c0,55.122,44.686,99.805,99.805,99.805c9.129,0,17.967-1.232,26.367-3.527l-6.449-31.441",
		"c-6.301,1.939-12.988,2.989-19.918,2.989c-37.398,0-67.824-30.426-67.824-67.825s30.426-67.825,67.824-67.825",
		"s67.826,30.426,67.826,67.825c0,11.738-3,22.789-8.271,32.429l28.701,14.203c7.371-13.918,11.551-29.785,11.551-46.632",
		"C337.332,159.576,292.645,114.89,237.525,114.89z'/></svg>"
    ].join("\n");

    var txt_logo = [
        "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='100px'",
	    "height='40px' viewBox='0 0 86.25 30.375' enable-background='new 0 0 86.25 30.375' xml:space='preserve'>",
	    "<path fill='#FFFFFF' d='M23.023,7.516c-1.615,0-1.609-2.496,0-2.496C24.661,5.02,24.658,7.516,23.023,7.516z M23.961,22.563h-1.922v-12",
		"c0.609,0,1.219,0,1.828,0c0.182,0,0.093,0.343,0.093,0.494c0,1.308,0,2.615,0,3.923C23.961,17.507,23.961,20.035,23.961,22.563z'/>",
	    "<path fill='#FFFFFF' d='M44.891,22.563h-1.922v-6.891c0-1.992-0.711-4.262-3.212-3.718c-1.83,0.398-2.424,2.48-2.424,4.103",
		"c0,2.168,0,4.337,0,6.505H35.41v-7.125c0-1.799-0.684-3.539-2.73-3.539c-2.126,0-2.906,2.217-2.906,3.998c0,2.222,0,4.444,0,6.666",
		"h-1.922v-12h1.922v1.898h0.047c1.582-2.699,6.08-3.118,7.125,0.305c1.077-2.003,3.326-3.011,5.528-2.251",
		"c1.96,0.677,2.418,2.834,2.418,4.681C44.891,17.651,44.891,20.107,44.891,22.563z'/>",
	    "<path fill='#FFFFFF' d='M53.539,22.844c-3.712,0-5.942-2.908-5.831-6.472c0.111-3.554,2.498-6.09,6.112-6.09c3.656,0,5.695,2.753,5.695,6.234",
		"C59.516,20.062,57.192,22.844,53.539,22.844z M53.68,11.898c-5.36,0-5.384,9.328,0,9.328C58.929,21.227,58.915,11.898,53.68,11.898z'/>",
	    "<path fill='#FFFFFF' d='M63.254,22.82c-1.685,0-1.679-2.637,0-2.637C64.96,20.184,64.966,22.82,63.254,22.82z'/>",
	    "<path fill='#FFFFFF' d='M69.711,22.059c0,2.215-0.561,4.962-2.884,5.859c-0.544,0.21-1.129,0.294-1.71,0.294c-0.209,0-1.594-0.125-1.594-0.401",
		"c0-0.589,0-1.178,0-1.767c0.964,0.586,2.284,0.799,3.19-0.016c0.893-0.803,1.042-2.198,1.071-3.323",
		"c0.028-1.09,0.004-2.184,0.004-3.274c0-2.956,0-5.912,0-8.867c0.574,0,1.148,0,1.722,0c0.3,0,0.2,0.137,0.2,0.421",
		"c0,1.285,0,2.57,0,3.855C69.711,17.245,69.711,19.652,69.711,22.059z M68.773,7.516c-1.615,0-1.609-2.496,0-2.496",
		"C70.411,5.02,70.408,7.516,68.773,7.516z'/>",
	    "<path fill='#FFFFFF' d='M72.875,22.129v-2.063c1.222,0.903,5.139,2.242,5.899,0.046c0.467-1.349-0.769-2.114-1.835-2.546",
		"c-1.173-0.475-2.583-0.882-3.416-1.898c-0.755-0.921-0.845-2.392-0.238-3.412c0.728-1.225,2.149-1.797,3.512-1.939",
		"c0.45-0.047,3.484-0.06,3.484,0.598c0,0.617,0,1.234,0,1.851c-1.274-0.834-4.646-1.681-5.339,0.349",
		"c-0.745,2.184,2.92,2.748,4.19,3.491c1.921,1.124,2.351,3.741,0.51,5.2C77.857,23.221,74.825,23.154,72.875,22.129z'/></svg>"
    ].join("\n");



	//-----------------------------------------------------
    //  TITLE
    //-----------------------------------------------------

    var titleLogo = document.createElement( 'svg' );
	titleLogo.style.cssText = 'position:absolute; top:8px; left:8px; width:60x; height:120px;';
    titleLogo.innerHTML = icon_logos;//+//new_logo;//icon_logos;

	var title = document.createElement( 'div' );
	title.style.cssText = 'position:absolute; color:#FFFFFF; top:9px; left:19px; text-align:left; font-weight:900; font-size:23px; pointer-events:none;';
	title.innerHTML = txt_logo;//"Oimo.js";

	var titleLink = document.createElement( 'div' );
	titleLink.style.cssText = 'position:absolute; color:#FFFFFF; top:23px; left:124px; text-align:left; pointer-events:auto; font-size:14px;';// font-weight:600

	var linkStyle = "color:#7fdbff; cursor:pointer;";
	var sep = ".";
	
	var txt = "";
	if(name==='dev') txt +="dev";
	else txt += "<a href='index.html' target='_self' style='"+linkStyle+"'>dev</a>";
	txt += sep;
	if(name==='rev') txt +="rev";
	else txt += "<a href='index_rev.html' target='_self' style='"+linkStyle+"'>rev</a>";
	
	titleLink.innerHTML = txt;

	container.appendChild( titleLogo );
	container.appendChild( title );
	container.appendChild( titleLink );

	//-----------------------------------------------------
    //  OUTPUT
    //-----------------------------------------------------

	var output = document.createElement( 'div' );
	output.id = "output";
	output.style.cssText = 'line-height:12px; letter-spacing:0px; position:absolute; color:#DEDEDE; top:115px; width:200px; height:200px; left:60px; text-align:left; pointer-events:none; font-size:11px; ';
	container.appendChild( output );

	//-----------------------------------------------------
    //  COPY
    //-----------------------------------------------------

	var copy = document.createElement( 'div' );
	copy.style.cssText = 'position:absolute; bottom:0px; width:350px; right:0px; text-align:right; pointer-events:auto; color:#777777; margin-right:10px; margin-bottom:5px;';
	copy.innerHTML = "<a href='http://3dflashlo.wordpress.com/' target='_blank' style='color:#909090'>LOTH 2014</a> |  <a href='https://github.com/saharan/OimoPhysics' target='_blank' style='color:#888888'>OIMO.PHYSICS</a> | <a href='http://threejs.org' target='_blank' style='color:#888888'>THREE.JS</a> | <a href='https://code.google.com/p/sea3d/' target='_blank' style='color:#888888'>SEA3D</a>";
	container.appendChild( copy );

	//-----------------------------------------------------
    //  MENU DEMO
    //-----------------------------------------------------

    var aMenu = document.createElement( 'div' );
	aMenu.style.cssText = 'left:calc(50% - 100px); width:200px; top:20px; position:absolute; display:block; text-align:center; ';
	container.appendChild( aMenu );

	var bnext = document.createElement( 'div' );
	bnext.style.cssText = buttonStyle;
	bnext.innerHTML = "&raquo;";

	var bprev = document.createElement( 'div' );
	bprev.style.cssText = buttonStyle;
	bprev.innerHTML = "&laquo;";

	var bcenter = document.createElement( 'div' );
	bcenter.id = "demoName";
	bcenter.style.cssText = bbStyle;
	bcenter.textContent = "Basic shape";

	var demoName =  function (name) {
		bcenter.textContent = name;
	}

	aMenu.appendChild( bprev );
	aMenu.appendChild( bcenter );
	aMenu.appendChild( bnext );

    bprev.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(127,219,255,0.3)';  }, false );
    bprev.addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0)';  }, false );
    bnext.addEventListener( 'mouseover', function ( event ) { event.preventDefault(); this.style.backgroundColor = 'rgba(127,219,255,0.3)';  }, false );
    bnext.addEventListener( 'mouseout', function ( event ) { event.preventDefault();  this.style.backgroundColor = 'rgba(1,1,1,0)';  }, false );

	bprev.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); prevDemo(); this.style.backgroundColor = 'rgba(127,219,255,0.5)';}, false );
	bnext.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); nextDemo(); this.style.backgroundColor = 'rgba(127,219,255,0.5)';}, false );

	//-----------------------------------------------------
    //  MENU DEMO
    //-----------------------------------------------------

    var bMenu = document.createElement( 'div' );
	bMenu.style.cssText = 'right:0px; top:12px; position:absolute; width:'+(iconSize+12)+'px; display:block; text-align:center;  margin-right:5px;';
	container.appendChild( bMenu );

	var bbMenu = [];
	var bbMenu2 = [];

	var bbMenuNames = ["Source", "Editor", "Material", "Reflect", "Shadow", "Mouse mode"];
	var bbMenuIcons = ["icon_github", "icon_gear", "icon_material", "icon_env", "icon_shadow", "icon_target"];

	for(var i=0;i!==6;i++){

		bbMenu[i] = document.createElement( 'div' );
		bbMenu[i].name = i;
		bbMenu[i].style.cssText = "margin-left:6px; width:"+iconSize+"px; height:"+iconSize+"px; margin-bottom:0px; pointer-events:auto;  ";

		bbMenu2[i] = document.createElement( 'div' );
		bbMenu2[i].name = i;
		if(i===0)bbMenu2[i].style.cssText = "width:"+(iconSize+12)+"px; height:20px; margin-bottom:30px; color:#7fdbff;";
		else bbMenu2[i].style.cssText = "width:"+(iconSize+12)+"px; height:20px; margin-bottom:0px; color:#7fdbff;";
		bbMenu2[i].style.visibility = "hidden";
		bbMenu2[i].id = "menu"+i;
		bbMenu2[i].innerHTML = bbMenuNames[i];
		//else bbMenu[i].style.cssText = buttonStyle + "width:120px; height:30px; margin-bottom:6px;";
		bbMenu[i].addEventListener( 'mouseover', function ( event ) { event.preventDefault(); overColor(this.name);  }, false );
		bbMenu[i].addEventListener( 'mouseout', function ( event ) { event.preventDefault(); outColor(this.name); }, false );
		bMenu.appendChild( bbMenu[i] );
		bMenu.appendChild( bbMenu2[i] );
	}


	bbMenu[0].innerHTML = "<a href='https://github.com/lo-th/Oimo.js'  target='_blank' >"+icon_github+"</a>";
	bbMenu[1].innerHTML = icon_gear;
	bbMenu[2].innerHTML = icon_material;
	bbMenu[3].innerHTML = icon_env;
	bbMenu[4].innerHTML = icon_shadow;
	bbMenu[5].innerHTML = icon_target;

	//bbMenu[0].style.color = "#ffffff";
	/*var overColor = function (n) {
		if(document.getElementById(bbMenuIcons[n]))document.getElementById(bbMenuIcons[n]).setAttribute('fill','#0074d9');
		bbMenu2[n].style.visibility = "visible";
	}*/

	var overColor = function (n) {
		if(document.getElementById(bbMenuIcons[n]))document.getElementById(bbMenuIcons[n]).setAttribute('fill','#7fdbff');
		bbMenu2[n].style.visibility = "visible";
		bbMenu2[n].style.color = "#7fdbff";
	}
	var outColor = function (n) {
		if(document.getElementById(bbMenuIcons[n]))document.getElementById(bbMenuIcons[n]).setAttribute('fill','#ffffff');
		bbMenu2[n].style.visibility = "hidden";
	}
	var clickColor = function (n) {
		if(document.getElementById(bbMenuIcons[n]))document.getElementById(bbMenuIcons[n]).setAttribute('fill','#ff851b');
		bbMenu2[n].style.color = "#ff851b";
	}
	//bbMenu[4].innerHTML = "E";

	bbMenu[0].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); clickColor(this.name); }, false );
	bbMenu[1].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); showCode(); clickColor(this.name); }, false );
	bbMenu[2].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); TE.changeMaterialType(); clickColor(this.name); }, false );
	bbMenu[3].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); TE.reflection(); clickColor(this.name); }, false );
	bbMenu[4].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); TE.shadow(); clickColor(this.name); }, false );
	bbMenu[5].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); TE.setMouseMode(); bbMenu2[5].innerHTML = TE.getMouseMode(); clickColor(this.name); }, false );
	
	//bbMenu[4].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.shadow(); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	

	/*bbMenu[0].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.setMouseMode('delete'); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bbMenu[1].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.setMouseMode('drag'); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );
	bbMenu[2].addEventListener( 'mousedown', function ( event ) { event.preventDefault(); threeEngine.setMouseMode('shoot'); this.style.backgroundColor = 'rgba(55,123,167,0.5)';}, false );*/
	var openSource = function () {
		window.open("https://github.com/lo-th/Oimo.js", "_blank");
	}
    var showCode = function () {
    	TE.viewDivid();
    	var mode = TE.getViewMode();

    	if(mode==='no'){
    		aMenu.style.left = 'calc(50% - 100px)';
    		//ribbon.style.right = '0';
    		bMenu.style.right = '0';
    		copy.style.right = '0';
    		copy.style.bottom = '0';
    		menu.style.bottom = '0';

    		Editor.hide();
    	} else {
    		if(mode==="v"){
    			aMenu.style.left = 'calc(25% - 100px)';
    			//ribbon.style.right = '50%';
    			bMenu.style.right = '50%';
    			copy.style.right = '50%';

    		} else {
    			copy.style.bottom = '50%'
    			menu.style.bottom = '50%';
    		}
    	    Editor.show(mode);
    	}
    }




	//-----------------------------------------------------
    //  GRAVITY
    //-----------------------------------------------------

	var G = -10;
	var drag;
	//var finalFunction;

	var loDiv = document.createElement( 'div' );
	loDiv.style.cssText = effect+ 'position:absolute; left:10px; top:110px; width:30px; height:200px; padding:0 0 0 0; display:block; background:rgba(1,1,1,0.1); -webkit-border-radius:20px; border-radius:20px; cursor:ns-resize;text-align:center; pointer-events:auto;';
	container.appendChild( loDiv );

	var loDiv2 = document.createElement( 'div' );
	loDiv2.style.cssText = 'position:absolute; left:5px; bottom:0px; width:20px; height:200px; display:block; background:rgba(255,255,0,0.05);-webkit-border-radius:10px; border-radius:10px; pointer-events:none;';
	loDiv.appendChild( loDiv2 );
	

	var center = document.createElement( 'div' );
	center.style.cssText = 'position:absolute;width:30px;left:0px;height:1px;padding:0 0 0 0; background:rgba(255,255,255,0.2); top:100px; pointer-events:none;';
	loDiv.appendChild( center );

	var select = document.createElement( 'div' );
	select.style.cssText = 'position:absolute;width:30px;left:0px;height:1px;padding:0 0 0 0; background:rgba(255,255,1,0.8); top:100px; pointer-events:none;';
	loDiv.appendChild( select );

	var txt = document.createElement( 'div' );
	txt.style.cssText = 'position:absolute;width:30px;height:30px; padding:0 0 0 0; top:105px; pointer-events:none; font-size:10px;';
	loDiv.appendChild( txt );

	var txt2 = document.createElement( 'div' );
	txt2.style.cssText = 'position:absolute;width:30px;height:30px; padding:0 0 0 0; top:85px; pointer-events:none; font-size:10px;';
	loDiv.appendChild( txt2 );
	txt2.textContent ="G";

	loDiv.addEventListener( 'mousedown', function(e){ drag = true; move(e); }, false );
	loDiv.addEventListener( 'mouseout', function(e){ drag = false; }, false );
	loDiv.addEventListener( 'mouseup', function(e){ drag = false; }, false );
	loDiv.addEventListener( 'mousemove', function(e){ move(e); } , false );

	var move =  function ( e ) {
		var rect = loDiv.getBoundingClientRect();
		var pos;
		if(drag){
			pos = parseInt(e.clientY-rect.top);
			if(pos<0)pos=0;
			if(pos>200)pos=200;
			select.style.top = pos+"px";
			loDiv2.style.height = 200-pos +"px";
			G = -(pos-100)/10;
			txt.textContent =G;
			if(changeGravity)changeGravity(G);

			if(pos<10 || pos>190){ 
				select.style.width = '10px';
				select.style.left = '10px';
			}else{
				select.style.width = '30px';
				select.style.left = '0px';
			}
		}
	}

	var setCurrentGravity =  function ( g ) {
		var rect = loDiv.getBoundingClientRect();
		var pos = (((-g)*10)+100);

		G = g;
		txt.textContent = G;
		select.style.top = pos +"px";
		loDiv2.style.height = 200-pos +"px";

		if(pos<10 || pos>190){ 
			select.style.width = '10px';
			select.style.left = '10px';
		}else{
			select.style.width = '30px';
			select.style.left = '0px';
		}
	}

	setCurrentGravity(G);

	//-----------------------------------------------------
    //  MENU OPTIONS BOTTOM
    //-----------------------------------------------------

	var menu = document.createElement( 'div' );
	menu.style.cssText ='position:absolute; height:600px; width:100%; overflow:hidden; bottom:0px; left:0px; pointer-events:none;';
	container.appendChild( menu );

	//-----------------------------------------------------
    //  RIBBON
    //-----------------------------------------------------

	/*var ribbon = document.createElement( 'div' );
	ribbon.style.cssText ='position: absolute; top: 0; right: 0; border: 0;  pointer-events:auto;';
	ribbon.innerHTML ="<a href='https://github.com/lo-th/Oimo.js'  target='_blank' ><img  src='images/ribbon0.png' alt='Fork me on GitHub' /></a>";
	container.appendChild( ribbon );*/

	//-----------------------------------------------------
    //  BADGE
    //-----------------------------------------------------

    /*var badge = document.createElement( 'div' );
    badge.style.cssText ='position: absolute; bottom: 20px; right: 10px; border: 0;  pointer-events:auto;';
	badge.innerHTML ="<a href='http://www.chromeexperiments.com/detail/YOUR-PROJECT-NAME/'><img src='images/badge.png' alt='See my Experiment on ChromeExperiments.com' /></a>"
	container.appendChild( badge );*/

    return {
		domElement: container,
		menu:menu,
		setCurrentGravity:setCurrentGravity,
		demoName:demoName
	}


	


}