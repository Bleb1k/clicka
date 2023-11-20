let tiles = Array.from(document.getElementsByClassName('movableTile'));
(() => {
	let zIndex = 0
	tiles.forEach((i) => {
		if (!i.style.zIndex) i.style.zIndex = zIndex++
	})
})()
let highestZIndexElement = tiles.length - 1

for (let i = 0; i < tiles.length; i++) {
	let tile = tiles[i];
	let header = tile.getElementsByClassName('header')[0];

	let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

	header.onmousedown = function (e) {
		e = e || window.event;
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;

		const tempZIndex = tile.style.zIndex;
		tile.style.zIndex = tiles[highestZIndexElement].style.zIndex;
		tiles[highestZIndexElement].style.zIndex = tempZIndex;
		highestZIndexElement = i;
	}

	function elementDrag(e) {
		e = e || window.event;
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		tile.style.top = (tile.offsetTop - pos2) + "px";
		tile.style.left = (tile.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}