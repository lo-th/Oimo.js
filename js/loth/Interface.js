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
    var iconSize = 36;//48;
    var iconColor = '#ffffff';

    var icon_logos = [
	    "<svg version='1.1' id='oimo' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
	    "width='48px' height='48px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
        "<path fill='none' stroke='#FFFFFF' stroke-width='40' stroke-miterlimit='10' d='M310.215,82.307",
	    "c-40.867-12.279-86.859-5.284-105.407,6.843c-45.29,29.612-34.695,57.513-63.106,107.836",
	    "c-28.035,49.658-46.876,76.344-40.464,124.752c6.61,49.901,24.723,98.776,121.386,116.684s145.224-25.592,159.089-65.439",
	    "c17.737-50.974-1.591-91.972-6.908-134.5c-4.861-38.877,17.96-77.561-3.27-112.521C350.714,91.678,310.215,82.307,310.215,82.307z'/>",
        "<circle fill='#FFFFFF' stroke='none' cx='245.424' cy='153.905' r='16'/>",
        "<circle fill='#FFFFFF' stroke='none' cx='302.593' cy='168.211' r='10'/></svg>"
    ].join("\n");

    var icon_github= [
	    "<svg version='1.1' id='Calque_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
		"width='"+iconSize+"px' height='"+iconSize+"px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'>",
	    "<path id='icon_github' fill='"+iconColor+"' d='M256,90c44.34,0,86.026,17.267,117.38,48.62C404.733,169.974,422,211.66,422,256",
		"s-17.267,86.026-48.62,117.38C342.026,404.732,300.34,422,256,422s-86.026-17.268-117.38-48.62C107.267,342.026,90,300.34,90,256",
		"s17.267-86.026,48.62-117.38C169.974,107.267,211.66,90,256,90 M256,50C142.229,50,50,142.229,50,256s92.229,206,206,206",
		"s206-92.229,206-206S369.771,50,256,50L256,50z M391.25,266.53l0.238-2.476c-14.836-1.439-29.593-1.567-43.927-0.473",
		"c2.304-7.354,3.518-15.659,3.43-25.104c-0.188-20.065-6.879-35.692-17.394-48.662c2.02-12.216,0.498-24.431-3.312-36.651",
		"c-15.024,1.23-28.547,6.151-40.587,14.7c-22.502-4.564-45.001-4.855-67.503,0c-14.044-9.479-27.835-14.127-41.413-14.7",
		"c-4.025,13.456-4.646,26.719-1.242,39.76c-11.846,12.57-16.373,27.828-16.151,44.724c0.127,9.672,1.617,18.279,4.367,25.888",
		"c-14.125-1.036-28.643-0.896-43.244,0.518l0.239,2.476c14.869-1.443,29.652-1.563,44.012-0.439c0.527,1.278,1.058,2.552,1.663,3.769",
		"c-15.559-0.41-29.561,0.941-42.674,4.166l0.592,2.412c13.31-3.271,27.566-4.588,43.485-4.053",
		"c10.527,18.703,30.794,29.693,60.306,33.182c-6.856,5.568-10.543,12.137-11.492,19.57c0,0-3.103,0-15.63,0",
		"c-20.992,0-26.715-26.766-48.457-24.125c21.093,10.461,16.88,43.896,50.633,43.896c11.343,0,13.755,0,14.181,0v30.648",
		"c0.15,4.952-2.006,8.265-5.488,10.56c12.088,1.221,21.172-4.814,21.172-12.217s0-36.902,0-40.512s3.779-3.889,3.779-3.889v47.3",
		"c0.16,4.707-2.128,7.383-4.556,9.939c10.649,0.425,20.666-1.702,21.12-10.766c0,0,0-42.993,0-45.269s3.729-2.332,3.729,0",
		"s0,43.145,0,43.145c0.11,7.646,6.714,13.845,20.705,12.89c-3.743-3.013-4.892-6.059-4.892-10.466c0-4.406,0-46.773,0-46.773",
		"s3.856-0.196,3.856,3.889c0,4.086,0,32.614,0,39.451c0,8.779,10.54,12.402,22.569,12.062c-3.94-2.952-6.608-6.474-6.625-11.182",
		"v-47.443c-0.407-6.974-3.242-13.548-8.802-19.673c26.978-4.142,46.422-14.91,56.104-34.211c15.971-0.549,30.271,0.766,43.615,4.047",
		"l0.592-2.412c-13.215-3.248-27.333-4.599-43.037-4.157c0.543-1.226,1.082-2.456,1.547-3.749",
		"C361.268,264.955,376.216,265.069,391.25,266.53z'/></svg>"
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

    var new_logo = [
        "<svg version='1.1' id='Calque_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
	    "width='360px' height='80px' viewBox='0 0 200 40' enable-background='new 0 0 200 40' xml:space='preserve'>",
        "<g><path fill='#FFFFFF' d='M17.053,24.732c-7.745,0-6.856-14.104,0.48-14.104C25.287,10.629,24.385,24.732,17.053,24.732z M17.317,23.971",
		"c3.221,0,3.932-3.817,3.932-6.34c0-2.477-0.794-6.24-3.949-6.24c-3.221,0-3.932,3.817-3.932,6.34",
		"C13.368,20.207,14.162,23.971,17.317,23.971z'/>",
	    "<path fill='#FFFFFF' d='M26.686,16.166c-0.253,1.693-0.381,3.415-0.368,5.128c0.005,0.636-0.032,1.355,0.178,1.965",
		"c0.266,0.774,1.383,0.345,1.901,0.108c0.035,0.095,0.102,0.205,0.111,0.305c-0.539,0.434-2.347,1.488-3.015,0.838",
		"c-0.636-0.619-0.448-2.224-0.448-3.023c0-1.175,0.033-2.351,0.082-3.524c0.018-0.439-0.108-1.357,0.164-1.723",
		"C25.594,15.832,26.309,15.968,26.686,16.166C26.62,16.611,26.456,16.045,26.686,16.166z M26.176,13.518",
		"c-1.286,0-1.034-2.321,0.289-2.05C27.552,11.69,27.221,13.518,26.176,13.518z'/>",
	    "<path fill='#FFFFFF' d='M28.239,16.623c0.845-0.298,3.182-1.393,3.182,0.24c0,1.419-0.469,3.024-0.311,4.377c0.451-1.635,1.606-5.697,3.982-5.263",
		"c2.11,0.386,0.878,3.999,1.039,5.251c0.393-1.447,0.892-2.979,1.825-4.178c0.999-1.284,2.963-1.698,3.37,0.289",
		"c0.277,1.35-0.104,2.887-0.182,4.249c-0.032,0.547-0.123,1.304,0.144,1.811c0.325,0.618,1.446,0.169,1.887-0.032",
		"c0.035,0.095,0.102,0.205,0.111,0.305c-0.625,0.503-1.987,1.238-2.82,0.954c-0.728-0.248-0.631-1.53-0.631-2.12",
		"c0-1.088,0.114-2.173,0.208-3.255c0.052-0.59,0.18-1.665-0.56-1.901c-1.496-0.478-2.587,3.05-2.863,3.993",
		"c-0.293,0.999-0.49,2.028-0.553,3.067c-0.17,0.165-0.975,0.121-1.225,0.152l-0.094-0.006c0.083-1.594,0.186-3.186,0.276-4.779",
		"c0.034-0.596,0.146-1.308-0.086-1.877c-0.323-0.792-1.093-0.511-1.557-0.033c-1.114,1.146-1.663,2.949-1.993,4.474",
		"c-0.072,0.334-0.18,2.056-0.417,2.086c-0.366,0.045-0.732,0.091-1.097,0.136l-0.094-0.006c0.135-1.609,0.203-3.223,0.262-4.836",
		"c0.027-0.746,0.105-1.524,0.04-2.27c-0.083-0.95-1.147-0.567-1.755-0.406C28.3,16.917,28.231,16.752,28.239,16.623z'/>",
	    "<path fill='#FFFFFF' d='M43.79,21.041c0-1.964,0.997-4.185,2.93-4.922c2.408-0.919,4.33,1.131,4.33,3.469c0,1.964-1.005,4.185-2.936,4.922",
		"C45.704,25.429,43.79,23.379,43.79,21.041z M45.19,20.484c0,1.391,0.625,3.416,2.326,3.416c1.772,0,2.127-2.434,2.127-3.768",
		"c0-1.391-0.627-3.404-2.326-3.404C45.546,16.729,45.19,19.148,45.19,20.484z'/>",
	    "<path fill='#FFFFFF' d='M53.241,24.65c-1.327,0-1.062-2.36,0.291-2.079C54.653,22.805,54.322,24.65,53.241,24.65z'/>",
	    "<path fill='#FFFFFF' d='M58.092,16.166c-0.071,3.527-0.013,7.237-0.99,10.658c-0.392,1.396-1.238,2.869-2.704,3.337",
		"c-0.681,0.217-1.433,0.244-2.109-0.006c-0.647-0.24-1.385-0.981-0.727-1.64c0.658-0.658,0.874,0.286,1.424,0.595",
		"c0.751,0.421,1.733,0.334,2.3-0.34c0.949-1.101,1.01-3.007,1.119-4.379c0.131-1.643,0.162-3.292,0.183-4.94",
		"c0.011-0.852,0.018-1.704,0.021-2.556C56.612,15.988,57.313,15.756,58.092,16.166C58.081,16.748,57.862,16.045,58.092,16.166z",
		" M57.454,13.535c-1.28,0-1.027-2.346,0.283-2.067C58.81,11.697,58.496,13.535,57.454,13.535z'/>",
	    "<path fill='#FFFFFF' d='M60.964,22.295c0.171,1.856,3.703,2.468,3.703,0.416c0-1.024-1.35-1.457-2.098-1.811c-0.954-0.452-2.108-1.029-2.292-2.19",
		"c-0.31-1.951,1.929-2.918,3.544-2.796c0.741,0.056,1.714,0.36,1.95,1.166c0.234,0.801-0.725,1.7-1.43,1.119",
		"c0.836-1.911-2.569-2.177-2.97-0.552c-0.255,1.033,1.005,1.589,1.741,1.945c0.897,0.434,1.968,0.823,2.492,1.733",
		"c1.211,2.106-1.628,3.506-3.301,3.384c-0.838-0.061-2.221-0.387-2.461-1.353C59.672,22.681,60.336,22.134,60.964,22.295z'/></g></svg>"
    ].join("\n");


	//-----------------------------------------------------
    //  TITLE
    //-----------------------------------------------------

    var titleLogo = document.createElement( 'svg' );
	titleLogo.style.cssText = 'position:absolute; top:-11px; left:-5px; width:60x; height:120px;';
    titleLogo.innerHTML = new_logo;//icon_logos;

	/*var title = document.createElement( 'div' );
	title.style.cssText = 'position:absolute; color:#FFFFFF; top:12px; left:60px; text-align:left; font-weight:900; font-size:23px; pointer-events:none;';
	title.innerHTML ="Oimo.js";*/

	var titleLink = document.createElement( 'div' );
	titleLink.style.cssText = 'position:absolute; color:#FFFFFF; top:23px; left:130px; text-align:left; pointer-events:auto; font-size:14px;';// font-weight:600

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
	//container.appendChild( title );
	container.appendChild( titleLink );

	//-----------------------------------------------------
    //  OUTPUT
    //-----------------------------------------------------

	var output = document.createElement( 'div' );
	output.id = "output";
	output.style.cssText = 'line-height:12px; letter-spacing:0px; position:absolute; color:#DEDEDE; top:115px; width:200px; height:200px; left:60px; text-align:left; pointer-events:none; font-size:10px; ';
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