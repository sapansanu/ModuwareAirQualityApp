/** ================ Handlers == */
function nativeDataUpdateHandler(data) {
	if(data > 1024) return;
	var level = window.current_level = parseInt(data*4/1024);
	
	document.getElementById('wrapper').dataset.level = level;
	document.getElementById('result-title').textContent = levels[level].title;
	document.getElementById("result-svg").src  = levels[level].src;
	document.getElementById("result-screen").style.backgroundColor  = levels[level].color;
}