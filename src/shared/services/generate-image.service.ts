import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
// apt-get install libnss3 libxss1 libasound2 libatk-bridge2.0-0 libgtk-3-0 libgbm-dev

@Injectable()
export class GenerateImageService {
  async generate(item): Promise<string> {
    const randomName = Array(8)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const date = item.createdAt.toLocaleDateString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    const deposit =
      item.deposit === 0
        ? `<span class="font-medium">0 บาท</span>`
        : `<span class="text-green-600">+${item.deposit
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท</span>`;
    const withdraw =
      item.withdraw === 0
        ? `<span class="font-medium">0 บาท</span>`
        : `<span class="text-red-600">-${item.withdraw
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} บาท</span>`;
    const contact = item.name
      ? `<div class="text-xl font-medium">ชื่อ ${item.name}</div>
         <div class="text-gray-500">ชื่อบริษัท ${item.company}</div>`
      : `<div class="text-xl font-medium">ชื่อบริษัท ${item.company}</div>`;
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--use-gl=egl', '--no-sandbox'],
      ignoreDefaultArgs: ['--disable-extensions'],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 440,
      height: 580,
      deviceScaleFactor: 1,
    });
    await page.setContent(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SLIP</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Prompt', sans-serif;
    }
  </style>
</head>
<body>
<div class="flex justify-between items-center p-4">
  <div class="flex flex-col">
    <div class="text-2xl font-medium">Cashback</div>
    <div>${date} น.</div>
  </div>
  <div>
    <img width="100px" src="https://cashback-api.tumtook.com/assets/TumtookNewLogo.png" />
<!--    <img width="100px" src="http://localhost:3001/assets/tumtook-logo-full.png" />-->
  </div>
</div>
<div class="border-t-[4px] mx-4">
  <!-- ... -->
</div>

<div class="flex items-center p-4">
  <div class="rounded-full">
<!--    <img width="75px" class="rounded-full" src="http://localhost:3001/assets/tumtook.png" />-->
    <img width="75px" class="rounded-full" src="https://cashback-api.tumtook.com/assets/tumtook.png" />
  </div>
  <div class="flex flex-col ml-3">
    <div class="text-xl font-medium">Tumtook co.,ltd.</div>
    <div class="text-gray-500">ผู้ทำรายการ (${item.admin})</div>
  </div>
</div>

<div class="flex ml-9 text-[50px] text-gray-300">
  <svg width="40" height="40" viewBox="0 0 87 176" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M58.8122 123.002V4.70161C58.8122 2.10515 56.7071 0 54.1106 0H32.1698C29.5733 0 27.4682 2.10515 27.4682 4.70161V123.002H9.4222C1.04471 123.002 -3.15069 133.131 2.77295 139.055L36.4909 172.773C40.1633 176.445 46.1171 176.445 49.7891 172.773L83.5071 139.055C89.4307 133.131 85.2353 123.002 76.8578 123.002H58.8122Z" fill="#828282"/>
  </svg>
</div>

<div class="flex p-4">
  <div>
    <svg width="75" height="75" viewBox="0 0 80 81" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 0.5C17.9032 0.5 0 18.4032 0 40.5C0 62.5968 17.9032 80.5 40 80.5C62.0968 80.5 80 62.5968 80 40.5C80 18.4032 62.0968 0.5 40 0.5ZM40 15.9839C47.8387 15.9839 54.1935 22.3387 54.1935 30.1774C54.1935 38.0161 47.8387 44.371 40 44.371C32.1613 44.371 25.8065 38.0161 25.8065 30.1774C25.8065 22.3387 32.1613 15.9839 40 15.9839ZM40 71.4677C30.5323 71.4677 22.0484 67.1774 16.371 60.4677C19.4032 54.7581 25.3387 50.8226 32.2581 50.8226C32.6452 50.8226 33.0323 50.8871 33.4032 51C35.5 51.6774 37.6935 52.1129 40 52.1129C42.3065 52.1129 44.5161 51.6774 46.5968 51C46.9677 50.8871 47.3548 50.8226 47.7419 50.8226C54.6613 50.8226 60.5968 54.7581 63.629 60.4677C57.9516 67.1774 49.4677 71.4677 40 71.4677Z" fill="#ED1F24"/>
    </svg>
  </div>
  <div class="flex flex-col ml-3">
    ${contact}
    <div class="text-gray-500">หมายเลขผู้เสียภาษี ${
      item.tax ? item.tax : '-'
    }</div>
    <div class="text-gray-500">เบอร์โทร ${item.tel ? item.tel : '-'}</div>
  </div>
</div>

<div class="p-4">
  <div>อ้างอิงรหัสใบเสนอราคา :</div>
  <div class="flex justify-end font-medium">${item.remark}</div>
</div>

<div class="border-t-[4px] mx-4">
  <!-- ... -->
</div>

<div class="p-4">
  <div class="flex justify-between">
    <span class="font-medium">CashBack คงเหลือ :</span>
    <span class="font-medium">${item.cashBack} บาท</span>
  </div>

  <div class="flex justify-between">
    <span class="font-medium">ใช้ Cashback :</span>
    ${withdraw}
  </div>

  <div class="flex justify-between">
    <span class="font-medium">ได้รับ Cashback :</span>
    ${deposit}
  </div>

  <div class="flex justify-between">
    <span class="font-medium">Cashback คงเหลือปัจจุบัน :</span>
    <span class="font-medium">${item.balance} บาท</span>
  </div>
</div>
</body>
</html>`);
    await page.screenshot({ path: `./uploads/slip/${randomName}.png` });
    await browser.close();
    return `${randomName}.png`;
  }
}
