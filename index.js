'use strict';

/*
	Go to previous/next "page"
	@isNext - Boolean value
	@rows 	- Number of rows in a "page" to scroll
*/
let gotoPage = (isNext, rows) => {
	const 	direction = isNext ? "next" : "prev";
	const 	buttons = {
		prev: document.getElementsByClassName('vertical-scrollbar-up-button scrollbar-button-enabled')[0],
		next: document.getElementsByClassName('vertical-scrollbar-down-button scrollbar-button-enabled')[0],
	};
	const 	quasiClick = (node, evType) => {
		let clickEvent = document.createEvent('MouseEvents');
		clickEvent.initEvent(evType, true, true);
		node.dispatchEvent(clickEvent);
	};
	if (buttons[direction]) {
		if (!rows) { rows = 20; }
		for (let i = 0; i < rows; i++) {
			quasiClick(buttons[direction], 'mousedown');
			quasiClick(buttons[direction], 'mouseup');
		};
	} else {
		console.log("Sorry, no page to go");
	}
}

/*
	Go to the next segment missing translation or not confirmed yet
	@isNext - Boolean value
*/
let gotoEmpty = (isNext) => {
	let editable = $(".status-cell:not(.confirmed):not(.r1confirmed):not(.r2confirmed):not(:has(a.locked))").prev(".translated-segment-grid").parent("tr:not(.lock):not(.not-loaded-row)");
	if (!editable.length) {
		gotoPage(isNext);
		setTimeout(() => {memoq.nextEmpty()}, 400);
	} else {
		editable[0].scrollIntoView(true);
		console.log("Found a result:", editable[0]);
		// editable[0].click();
	}
};

/* 
	Use one of the TM suggestions
	@choice - row number to choose from a TM suggestion list
*/
let useTm = (choice) => {
	let suggestions = $("#resultsList tr");
	if (!suggestions.length || !choice || isNaN(choice)) { return; } // no TM suggestions or choice is invalid
	choice = !choice ? 0 : Number(choice) - 1; // use the first suggestion available on the list
	$(suggestions[choice]).dblclick();
};


/*
	Gets length of the segment currently edited
	Returns the number
*/
let getLength = () => {
	let ed =  $(".focused .editor-char")[0];
	if (ed) { // segment is being edited
		return ed.innerText.length;
	}
};

/*
	Global object with methods available
*/
let memoq = {
	prevPage: 	() => gotoPage(false),
	nextPage: 	() => gotoPage(true),
	prevEmpty: 	() => gotoEmpty(false),
	nextEmpty: 	() => gotoEmpty(true),
	useTm: 		useTm,
};

/*
	Turns MemoQ WebTrans Tools menu into a draggable one
*/
$("#memoqwtools").draggable({
	handle: "#memoqwtools-handle",
	stop: (event, ui) => { 
		// console.log("dragging has stopped!");
		// chrome.storage.local.set({"position": new Date()}, () => {console.log("Saved to local storage")});
		// console.log("ui:", ui);
	}
});

document.onkeyup = (obj) => {
	if (!obj.code) { return; } // no actual key code is given
	let len = getLength() || 0;
	$("#memoqwtools-length")[0].innerText = len;
};
