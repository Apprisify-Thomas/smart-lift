import { Message, ServerClient } from 'postmark';
import puppeteer from 'puppeteer';

const emailClient = new ServerClient(process.env.POSTMARK_APIKEY || '');

export async function makeScreenshot(): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8083');
  page.setViewport({ width: 1080, height: 1980 });
  const screenshot = await page.screenshot({ encoding: 'base64' });
  await browser.close();
  return screenshot;
}

export async function sendResponseEmail(
  subject: string,
  htmlBody: string,
  includeScreenshot: boolean = false
) {
  const emailData: Message = {
    From: process.env.MAIL_RECIPIENT || '',
    To: process.env.MAIL_RECIPIENT || '',
    Subject: subject,
    HtmlBody: htmlBody,
  };

  if (includeScreenshot) {
    const screenshot = await makeScreenshot();
    emailData.Attachments = [
      {
        Name: 'screenshot.png',
        ContentID: 'screenshot',
        Content: screenshot,
        ContentType: 'image/png',
      },
    ];
  }

  await emailClient.sendEmail(emailData);
}
