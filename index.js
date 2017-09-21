'use strict';

let gotoPage = (isNext) => {
	const buttons = {
		prev: document.getElementById("decrementPage"),
		next: document.getElementById("incrementPage"),
	};
	let direction = isNext ? "next" : "prev";
	buttons[direction].click(); 
}

let gotoEmpty = (isNext) => {
	let editable = $(".status-cell:not(.confirmed):not(.r1confirmed):not(.r2confirmed)");
	if (!editable.length) {
		gotoPage(isNext);
		setTimeout(function(){memoq.nextEmpty()}, 1000);		
	} else {
		editable[0].scrollIntoView(true);
	}
}

let memoq = {
	prevPage: () => gotoPage(false),
	nextPage: () => gotoPage(true),
	prevEmpty: () => gotoEmpty(false),
	nextEmpty: () => gotoEmpty(true)
};