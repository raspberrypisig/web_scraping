const puppeteer = require('puppeteer');

if (process.argv.length === 4) {
  analytics_email = process.argv[2];
  analytics_password = process.argv[3];
}

else {
  console.log("Please provide arguments\ngmail email address\npassword");
  process.exit(1);
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://analytics.google.com/analytics/web/', {waitUntil: 'networkidle2'});
  //await delay(4000);
  await page.type('#identifierId', analytics_email);
  await page.keyboard.press('Enter');
  await delay(2000);
  await page.type("input[name='password']", analytics_password);
  await page.keyboard.press('Enter');
  //await delay(10000);
  //await page.goto('https://analytics.google.com/analytics/web', {waitUntil: 'networkidle2'});
  await page.waitForSelector('#ga-left-nav')
  console.log('good');
  //const start_date = '20181001';
  //const end_date = '20181031';

  function firstOfMonth() {
    var d = new Date();
    var year = d.getFullYear();
    var e = d.getMonth() + 1;
    var month = ('0' +  e).slice(-2);
    var m = year + month + '01'; 
    return m;
  }

  function currentDate() {
    var d = new Date();
    var year = d.getFullYear();
    var e = d.getMonth() + 1;
    var month = ('0' +  e).slice(-2);
    var date = ('0' +  d.getDate()).slice(-2);
    var m = year + month + date; 
    return m;
  }

  const start_date = firstOfMonth();
  const end_date = currentDate();

  await page.goto('https://analytics.google.com/analytics/web/#/my-reports/fmJz3ymlTUuBXib0ocAZ4Q/a90424511w134058947p138130061/_u.date00=' + start_date + '&_u.date01=' + end_date + '&2307-table.secSegmentId=analytics.date&2307-table.plotKeys=%5B%5D');
  await delay(5000);
  await page.goto('https://analytics.google.com/analytics/web/#/crbuilder/cr-builder/a90424511w134058947p138130061/2307-table.secSegmentId=analytics.date&2307-table.plotKeys=%5B%5D/EDIT~2FfmJz3ymlTUuBXib0ocAZ4Q~2F');
  await delay(5000);

  function firstWednesdayOfTheMonth() {
    const d = new Date();
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(),1));
    const day = 4 - date.getDay();
    let result;
    if (day > 0) {
      result = day;
    }
    
    else {
      result = day + 7;
    }
    
    var month = d.getMonth() + 1
    month = ('0' +  month).slice(-2);
    var firstWed = ('0' +  result).slice(-2);

    var m = '' + d.getFullYear() + month + firstWed;
    return m; 
  }
  
  const filterDate = firstWednesdayOfTheMonth();

  await page.evaluate( (filterDate) => {
    document.querySelector("#galaxyIframe").contentDocument.querySelectorAll('input')[6].value = filterDate
  }, filterDate);

  await delay(2000);

  await page.evaluate( () => {
    document.querySelector("#galaxyIframe").contentDocument.querySelector('.ACTION-save').click()
  });

  

  /*
  await delay(1000);
  const a = await page.evaluateHandle( () => {
    return document.querySelectorAll('a')[1];
  }
  );
  a.click();
  await delay(3000);
  const b = await page.evaluateHandle( () => {
    return document.querySelectorAll('a')[4];
  }
  );
  b.click();  
  await delay(100000);
  await browser.close();
*/
})();
