// element to add <script> tag with index.js to a webpage
let s = document.createElement("script"); 
s.src = chrome.extension.getURL("index.js");
s.onload = function() {
    this.remove();
};

// element to add <link> tag with index.css to a webpage
let cs = document.createElement("link"); 
cs.href = chrome.extension.getURL("index.css");
cs.setAttribute("rel", "stylesheet");

// Appending aforementioned <script> and <link> tags to <head> 
[s, cs].map((x) => {
	(document.head || document.documentElement).appendChild(x);	
});

// element with MemoQ WebTrans Tools buttons
let mn = document.createElement("div");
mn.id = "memoqwtools";

/*
	Set of buttons with values as follows:
	0: name of the image to be used as a button
	1: alt/title attributes
	2: name of the memoq maethods to be called on click
	3: (optional) argument to be used by the function above 
*/
let actions = [
	["rewind.png", "Previous page", "prevPage"],
	["play.png", "Next segment", "nextEmpty"],
	["fastforward.png", "Next page", "nextPage"],
	["1.png", "Append TM 1", "useTm", 1],
	["2.png", "Append TM 2", "useTm", 2],
	["3.png", "Append TM 3", "useTm", 3],
];

// create button elements and append them to MemoQ WebTrans Tools menu bar
actions.map((x) => {
	let btn = document.createElement("img");
	let ar = x[3] ? x[3] : ''; 
	btn.src = chrome.extension.getURL(`/static/${x[0]}`);
	btn.setAttribute("alt", x[1]);
	btn.setAttribute("title", x[1]);
	btn.setAttribute("onclick", ` memoq.${x[2]}(${ar}) `);
	mn.appendChild(btn);	
});
document.body.appendChild(mn);