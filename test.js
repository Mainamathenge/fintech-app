const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    // Read the HTML content from a file
    const htmlPath = 'path/to/your/html/file.html';
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Set the HTML content of the page
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Read the CSS content from a file
    const cssPath = 'path/to/your/css/file.css';
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Add the CSS styles to the page
    await page.addStyleTag({ content: cssContent });

    // Generate the PDF
    await page.pdf({ path: 'output.pdf', format: 'A4' });

    // Close the browser
    await browser.close();

    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
})();
