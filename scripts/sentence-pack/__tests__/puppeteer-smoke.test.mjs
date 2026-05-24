import { test } from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';

test('puppeteer launches Chromium and renders a page', async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setContent('<h1>hello</h1>');
    const text = await page.$eval('h1', el => el.textContent);
    assert.equal(text, 'hello');
  } finally {
    await browser.close();
  }
});
