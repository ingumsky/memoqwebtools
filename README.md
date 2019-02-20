# MemoQ WebTools
## What's this?
(Currently) a very modest set of tools needed to improve translator's user experience with MemoQ WebTrans product. 

## Why so serious?
The product in question lacks many tools needed to make translator's job easier and more enojyable. One of the most annoying things is - you can't just go to the next segment missing translation quickly or filter them, so if there are new segments among those previously translated and confirmed you have to look through the pages and check them manually. It's boring, tiresome and annoying task to say the least. And, seemingly, Kilgray have no intentions to fix them, so I've tried to fix some of them myself.  

## Changelog

### 0.5.0
1. Works with both "inifinite" pages and "classic" pages. 2. Comments are now parsed to retrieve information on string id, char limit, etc (some companies store the information there). 3. If char limit (see 2) is exceeded, a warning will be shown. 4. If there are any variables or certain elements (like "\n") are missing from the source or translation, a warning will be shown.

### 0.4.0
Updated to be able to work with MemoQ Webtrans "infinite page" UI.

### 0.3.5
Segment length is available, so you can track it in case you'll need to honour some character limit.

### 0.3
It's available as a Chrome extension now and, most probably, can be used with any browsers based on Chromium / Blink. 

### Aknowledgments 
Icons used in a menu are courtesy of iconsdb.com and provided as CC0 1.0 Universal (CC0 1.0) Public Domain Dedication