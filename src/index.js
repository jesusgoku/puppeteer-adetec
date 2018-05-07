const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const USERNAME = process.env.USERNAME;
  const PASSWORD = process.env.PASSWORD;
  const HOME_URL = process.env.HOME_URL;
  console.log(HOME_URL);

  const browser = await puppeteer.launch();

  const data = JSON.parse(await readFile('./src/data.json'));

  for (let index in data) {
    const design = data[index];
    console.log(`Product code: ${design.product_code}`);
    console.log(`Design name: ${design.design_name}`);

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(HOME_URL);

    try {

      await page.type(
        'input[placeholder="Busca tu producto o una descripción"]',
        design.product_code
      );
      await page.waitFor(1000);

      await page.click('.el-table__row td');
      await page.waitFor(1000);

      await page.click('td.TemplatesViewer-select');
      await page.waitFor(5000);

      await page.click(`img[alt="${design.design_name}"]`);
      await page.waitFor(1000);

      await page.click(`a.DesignsViewer-button[title="${design.design_name}"]`);
      await page.waitFor(5000);

      await page.click('i.fa-square-o');
      await page.waitFor(1000);

      await page.click('i.fa-retweet');
      await page.waitFor(3000);

      await page.keyboard.down('Meta');
      await page.keyboard.press('KeyA');
      await page.keyboard.up('Meta');
      await page.waitFor(1000);

      await page.evaluate(async () => {
        const canvas = window.$vm.$store.state.editor.canvas;
        const ao = canvas.getActiveObject();
        ao.rotate(90);
        ao.setCoords();
        canvas.centerObject(ao);
        ao.setCoords();
        canvas.requestRenderAll();
        return;
      });
      await page.waitFor(1000);

      await page.click('button.button--secondary');
      await page.waitFor(1000);

      await page.type('#email', USERNAME);
      await page.type('#password', PASSWORD);
      await page.click('button.login-button');
      await page.waitFor(3000);

      await page.click('.el-collapse-item__header');
      await page.waitFor(1000);

      await page.click('.DesignAdminPanel-design +  .button--primary');
      await page.waitFor(7500);

      await page.screenshot({path: `${design.product_code} - ${design.design_name}.png`});
      await page.close();
    } catch (e) {
      await page.screenshot({path: 'example.png'});
      await browser.close();
      console.error(e);
    }
  }

  await browser.close();

})();

function readFile(path) {
  return new Promise((resolve, reject) => fs.readFile(path, (err, data) => {
    if (err) {
      reject(err);
    }

    resolve(data);
  }));
}
