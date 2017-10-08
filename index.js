'use strict';

/*
	Go to previous/next page
	@isNext - Boolean value
*/
let gotoPage = (isNext) => {
	const buttons = {
		prev: document.getElementById("decrementPage"),
		next: document.getElementById("incrementPage"),
	};
	let direction = isNext ? "next" : "prev";
	buttons[direction].click(); 
};

/*
	Go to the next segment missing translation or not confirmed yet
	@isNext - Boolean value
*/
let gotoEmpty = (isNext) => {
	let editable = $(".status-cell:not(.confirmed):not(.r1confirmed):not(.r2confirmed):not(:has(a.locked))");
	if (!editable.length) {
		gotoPage(isNext);
		setTimeout(() => {memoq.nextEmpty()}, 1000);		
	} else {
		editable[0].scrollIntoView(true);
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
