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
	let editable = $(".status-cell:not(.confirmed):not(.r1confirmed):not(.r2confirmed)");
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
	Global object with methods available
*/
let memoq = {
	prevPage: 	() => gotoPage(false),
	nextPage: 	() => gotoPage(true),
	prevEmpty: 	() => gotoEmpty(false),
	nextEmpty: 	() => gotoEmpty(true),
	useTm: 		useTm,
};