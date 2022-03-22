const puppeteer = require('puppeteer-extra');
const stealth = require('puppeteer-extra-plugin-stealth');
const adblocker = require('puppeteer-extra-plugin-adblocker');

const username = 'grime__core';
const password = 'nsr10ojif';
var isLoggedIn = false;
var browser;

// For the opps
puppeteer.use(stealth());
puppeteer.use(adblocker({ blockTrackers: true }));

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

async function getSession() {
	if (isLoggedIn) {
		return await browser.newPage();
	}

	// Create a new browser instance
	browser = await puppeteer.launch({
		args: [
			'--window-size=1920,1080',
			],
		headless: true
	});

	// Manually log into Instagram
	let page = await browser.newPage();
	await page.goto('https://www.instagram.com/accounts/login/');
	await page.waitForSelector('input._2hvTZ.pexuQ.zyHYP');
	await page.type('input[name=username]', username);
	await page.type('input[name=password]', password);
	await page.click('button[type=submit]');
	await page.waitForNavigation({'waitUntil': 'networkidle2'});

	// Update state and return a page object
	isLoggedIn = true;
	return page;
}

async function streamComments(url, update) {
	let count = 0;
	let comments = [];
	let page = await browser.newPage();
	await page.goto(url);
	
	while (true) {
		const newCount = await page.$$eval('div.C4VMK', divs => divs.length);
		update(newCount, newCount - count);
		count = newCount;

		// If this button disappears we can almost for sure say there are no more comments
		// There are some potential bugs here though
		try {
			await page.waitForSelector('li > div > button.wpO6b', { 
				timeout: 5000,
				visible: true 
			});
		} catch (e) {
			break;
		}
		await page.click('li > div > button.wpO6b');

		// Wait 1 second to allow for new comments to load
		await delay(1000);
	}

	// Parse the comment html
	const divs = await page.$$('ul.Mr508 > div > li > div > div > div.C4VMK');
	for (const div of divs) {
		// The username of the commenter is held within an h3 tag
		const user = await div.$eval('h3._6lAjh', e => e.innerText);

		// The comment itself is held within a div tag
		const comment = await div.$eval('div.MOdxS', e => e.innerText);

		// Extract the users mentioned in the comment, if any
		const mentions = comment.match(/@[a-zA-Z0-9_.]*/g);
		comments.push({
			user: user,
			comment: comment,
			mentions: mentions
		});
	}
	return comments;
}

module.exports = {
	getSession,
	streamComments
}