import { chromium } from 'playwright-chromium';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let consoleMessages = [];
  let pageErrors = [];

  page.on('console', (msg) => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  page.on('pageerror', (err) => {
    pageErrors.push({
      name: err.name,
      message: err.message,
      stack: err.stack
    });
  });

  try {
    await page.goto('https://frontend-wine-delta-71.vercel.app/', { waitUntil: 'networkidle' });
    
    // Get page content
    const content = await page.content();
    const bodyHTML = await page.locator('body').innerHTML();
    
    console.log('=== PAGE LOADED ===');
    console.log('\n=== BODY HTML ===');
    console.log(bodyHTML.substring(0, 500));
    
    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => {
      console.log(`[${msg.type}] ${msg.text}`);
    });
    
    console.log('\n=== PAGE ERRORS ===');
    pageErrors.forEach(err => {
      console.log(`${err.name}: ${err.message}`);
    });
    
    // Check if root element has children
    const rootChildren = await page.locator('#root > *').count();
    console.log(`\n=== ROOT CHILDREN: ${rootChildren} ===`);
    
  } catch (error) {
    console.error('Navigation error:', error.message);
  }

  await browser.close();
})();
