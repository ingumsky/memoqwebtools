'use strict';

/*
	go to previous/next 'page'
	@isNext - Boolean value
	@rows 	- Number of rows in a 'page' to scroll
*/
let gotoPage = (isNext, rows) => {
	const 	direction = isNext ? 'next' : 'prev';
	const 	buttons = {
		prev: document.getElementById('decrementPage') || document.getElementsByClassName('vertical-scrollbar-up-button scrollbar-button-enabled')[0], // get a previous page button from either old or new interface
		next: document.getElementById('incrementPage') || document.getElementsByClassName('vertical-scrollbar-down-button scrollbar-button-enabled')[0], // get a next page button handler from either old or new interface
	};
	const 	quasiClick = (node, evType) => {
		let clickEvent = document.createEvent('MouseEvents');
		clickEvent.initEvent(evType, true, true);
		node.dispatchEvent(clickEvent);
	};
	if (buttons[direction]) {
		// the action does the job for 'proper pages' (old interface)
		quasiClick(buttons[direction], 'click');
		// the action does the job for 'infinite pages' (new interface)
		if (!rows) { rows = 20; }
		for (let i = 0; i < rows; i++) {
			quasiClick(buttons[direction], 'mousedown');
			quasiClick(buttons[direction], 'mouseup');
		}
	} else {
		console.log('Sorry, no page to go');
	}
};

/*
	go to the next segment missing translation or not confirmed yet
	@isNext - Boolean value
*/
let gotoEmpty = (isNext) => {
	let editable = $('.status-cell:not(.confirmed):not(.r1confirmed):not(.r2confirmed):not(:has(a.locked))').prev('.translated-segment-grid').parent('tr:not(.lock):not(.not-loaded-row)');
	if (!editable.length) {
		gotoPage(isNext);
		setTimeout(() => {memoq.nextEmpty()}, 400);
	} else {
		editable[0].scrollIntoView(true);
		console.log('Found a result:', editable[0]);
		// editable[0].click();
	}
};

/*
	use one of the TM suggestions
	@choice - row number to choose from a TM suggestion list
*/
let useTm = (choice) => {
	let suggestions = $('#resultsList tr');
	if (!suggestions.length || !choice || isNaN(choice)) { return; } // no TM suggestions or choice is invalid
	choice = !choice ? 0 : Number(choice) - 1; // use the first suggestion available on the list
	$(suggestions[choice]).dblclick();
};


/*
	gets length of the segment currently edited
	Returns the number
*/
let getLength = () => {
	let ed =  $('.focused .editor-char')[0];
	if (ed) { // segment is being edited
		return ed.innerText.length;
	}
};

/*
	gets parameters (like string id, character limit, etc.)
	returns an object with parameters
	@key - optional key to return a parameter only
*/
let getParams = (key) => {
	// if parameters are stored in a comment
	let commentString = $('div#comment ul li.info span.comment b span').text();
	// ea format
	let params = {}; // parsed string with parameters
	if (commentString) {
		let a = commentString.slice(6, -1); // remove redundant characters at the beginning and the end of the string in globaloc format
		let b = a.split('||');
		b.filter(function (el) {
			let a = el.trim();
			let b = el.split(':');
			if (b.length > 1) {
				params[b[0].trim()] = b[1].trim();
			}
		});
	}
	if (key) { return params[key]; }
	return params;
};

/*
	gets the source string and returns either element (el === true) or its text (el !== true)
	@el - switch between element (true) and text (false)
	@src - switch between original (true) and translation (false)
*/
const getSource = (el, src) => {
	const elem = (src && $('.focused.editor-cell').parent('.active').children('.original-segment-grid')) || $('.focused.editor-cell').parent('.active').children('.translated-segment-grid');
	if (el) {
		return elem;
	} return elem.text();
};

/*
	checks against known set of rules and returns an array of matches
	@data - a string to search in
	@rules - user defined set of regex to check the data string against
*/
const listMatches = (data, rules) => {
	if (!data) { return []; }

	const RULES = rules || [ // ...or default set
		'\\${[\\w\\[\\]\\s]+}', // ea NBA LIVE: ${OVR}, ${RES2}, ${fast furious}, ${[0]}, etc.
		'\\\\n', // ea NBA LIVE: \n
		'%%\\w+%%', // eden games F1
		'</?[a-zA-Z0-9=]+>', // <a>, </ab>, <23>, </g45>, <foo=5>, etc.
	];
	return data.match(new RegExp(RULES.join('|'), 'g')) || [];
};

/*
	takes two arrays as its arguments and returns an object with two arrays of elements missing from either and an array of shared
	@set1 - array to be compared
	@set2 - another array to be compared
*/
const diffArray = (set1, set2) => {
	let shared = [];
	const diff = set2.slice();
	const diff2 = set1.filter((el) => {
		if (diff.indexOf(el) >= 0) {
			shared.push(diff.splice(diff.indexOf(el), 1));
			return false;
		}
		return true;
	});
	return {
		missing: diff2 || [], // elements missing from set1
		redundant: diff || [], // elements missing from set2
		shared: shared // elements shared between the two
	};
};

/*
	inserts text to an element in focus
	@input - element to be updated with new text
	@text - text to insert
*/
const insertAtCursor = (input, text) => {
	// const inpt = getSource(true, false);
	getSource(true, false).focus();
	// console.log(`input: ${inpt}, text: ${text}`);
	// inpt.focus(); // make sure we have focus in the right input
	document.execCommand('insertText', false, text);
	// see https://www.everythingfrontend.com/posts/insert-text-into-textarea-at-cursor-position.html
};

let charsLimit = () => {
	let params = getParams();
	if (params.MAX_LENGTH > 0) {
		// console.log('limit:', params.MAX_LENGTH);
		// console.log('string id:', params['STRING ID']);
		return params.MAX_LENGTH;
	} else { return ''; }
	// return params.MAX_LENGTH > 0 ? params.MAX_LENGTH : '';
};

/*
	describes a global object with methods available
*/
let memoq = {
	prevPage: 	() => gotoPage(false),
	nextPage: 	() => gotoPage(true),
	prevEmpty: 	() => gotoEmpty(false),
	nextEmpty: 	() => gotoEmpty(true),
	useTm: 		useTm,
	limit: 		charsLimit,
};

/*
	adds actions for the menu:
	draggable - the menu could be dragged around
	offset - sets offset for the menu
*/
let menuActions = {
	draggable: () => {
		$('#memoqwtools').draggable({
			handle: '#memoqwtools-handle',
			stop: (event, ui) => {
				// console.log('dragging has stopped!');
				// chrome.storage.local.set({'position': new Date()}, () => {console.log('Saved to local storage')});
				// console.log('ui:', ui);
			}
		});
	},
	offset: () => {
		let offset = $('td.editor-cell.focused').offset(); // edited block's offset
		let height = $('td.editor-cell.focused').outerHeight(); // edited block's height
		$('#memoqwtools:not(.sticky)').offset({
			'top': offset.top + height,
			'left': offset.left
		});
	},
};

document.onkeyup = (obj) => {
	if (!obj.code) { return; } // no actual key code is given


	const createButton = (value, action) => {
		// const el = $('#memoqwtools-vars')[0];
		const el = document.createElement('button');
		const text = document.createTextNode(value);
		el.name = value;
		el.onclick = function(action) { insertAtCursor(false, value); };
		// console.log(`el: ${el}, text: ${text}`);
		el.appendChild(text);
		return el;
	};

	/*
		@values - array of values to
		@names - optional array of names to be used
	*/
	const createInserts = (values, names) => {
		if (!values) { return; }
		if (!names) { names = values.slice(); }
		// an element insert buttons to be appended to
		const parent = document.getElementById('memoqwtools-vars');
		// console.log(`values: ${values}`);
		values.forEach((el, ind) => {
			// console.log(`value: ${el}, name: ${names[ind]}`);
			const btn = createButton(names[ind] || el, el);
			// console.log(`btn: ${btn}, parent: ${parent}`);
			parent.appendChild(btn);
		});
		// return parent;
	};

	/*
		shows variables in a source segment and in a translated segment not matching each other
	*/
	const showVars = (div) => {
		const matchVars = diffArray(listMatches(getSource(false, true)), listMatches(getSource()));
		if (matchVars.missing.length !== 0 || matchVars.redundant.length !== 0) {
			// createInserts(matchVars.missing);
			// const buttons = createInserts(matchVars.missing);
			// console.log('buttons:', buttons);
			// const missing = document.createElement('span');
			// missing.class = 'memoqwtools-varsmissing';
			// missing.innerText = matchVars.missing;
			// const redundant = document.createElement('span');
			// redundant.class = 'memoqwtools-varsredundant';
			// redundant.innerText = matchVars.redundant;
			// div.appendChild(missing);
			// div.appendChild(redundant);
			while (div.firstChild) {
				div.removeChild(div.firstChild);
			}
			['missing', 'redundant'].forEach((name) => {
				const el = document.createElement('span');
				el.className = 'memoqwtools-vars' + name;
				el.innerText = matchVars[name];
				div.appendChild(el);
			});

			// div.innerText = `<span class='memoqwtools-varsmissing'>${matchVars.missing}</span> > > | < < <span class='memoqwtools-varsredundant'>${matchVars.redundant}</span>`;
		} else { div.innerText = ''; }
		return div.innerText;
	};

	/*
		shows character limits and segment length and handles them
		@lngth - element containing segment length
		@lmt - element containing character limit for a segment
		@edtr - element containting text of a segment
	*/
	const showLimits = (lngth, limit, edtr) => {
		const len = getLength() || 0;
		const lmt = charsLimit() || 'n/a';
		const errClass = 'limit-exceeded';
		lngth.innerText = len;
		limit.innerText = lmt;
		if (lmt < len) {
			lngth.classList.add(errClass);
			edtr.classList.add(errClass);
		} else {
			lngth.classList.remove(errClass);
			edtr.classList.remove(errClass);
		}
	};

	showLimits($('#memoqwtools-length')[0], $('#memoqwtools-limit')[0], $('.focused.editor-cell')[0]);
	showVars($('#memoqwtools-vars')[0]);
	$('#memoqwtools-stringId')[0].innerText = getParams('STRING ID');

	menuActions.offset();
	menuActions.draggable();
};