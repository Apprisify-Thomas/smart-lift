import puppeteer from 'puppeteer';
import Mailjet from 'node-mailjet';

const emailClient = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || '',
  apiSecret: process.env.MJ_APIKEY_PRIVATE || '',
});

export async function makeScreenshot(): Promise<string | undefined> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(process.env.LIFT_UI_HOST || 'http://localhost:8083', {
      waitUntil: 'networkidle0',
    });
    page.setViewport({ width: 1080, height: 1980 });

    const screenshot = await page.screenshot({ encoding: 'base64' });
    return screenshot;
  } catch (e: any) {
    console.log(e.message);
  }

  await browser.close();
}

export async function sendResponseEmail(
  to: string,
  subject: string,
  htmlBody: string,
  includeScreenshot: boolean = false
) {
  const emailData: any = {
    From: {
      Email: 'liftfabrik@apprisify.com',
      Name: 'Liftfabrik',
    },
    To: [
      {
        Email: to,
      },
    ],
    Subject: subject,
    HTMLPart: htmlBody,
  };

  if (includeScreenshot) {
    const screenshot = await makeScreenshot();

    if (screenshot) {
      emailData.Attachments = [
        {
          Filename: 'lift_ui_status.png',
          Base64Content: screenshot,
          ContentType: 'image/png',
        },
      ];
    }
  }

  const request = emailClient.post('send', { version: 'v3.1' }).request({
    Messages: [emailData],
  });

  request
    .then((result) => {
      console.log('Email sent successfully:', result.body);
    })
    .catch((err) => {
      console.error('Error sending email:', err);
    });
}
