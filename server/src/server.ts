import express from 'express';
import cors from 'cors';
import { askFloorManager, saveImage } from './utils';
import path from 'path';
import { FileAttachment, MailBodyData } from './types';
import { processActions } from './actions';
import { LiftSocket } from './LiftSocket';
import { sendResponseEmail } from './mail';
import cron from 'node-cron';

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.use(express.json({ limit: '5mb' }));

const socket = new LiftSocket(8082);

app.post('/', async (req, res) => {
  socket.sendAction({
    type: 'email:processing',
    payload: { message: 'Processing email...' },
  });

  const body = req.body as MailBodyData;

  console.log('Received email from:', body.From);
  console.log('Email Subject', body.Subject);
  console.log('Email body:', body.TextBody);

  const attachments = body.Attachments as FileAttachment[];
  let imageFile;

  if (attachments && attachments[0] && attachments[0].contentBytes && !attachments[0].isInline) {
    imageFile = await saveImage(attachments[0]);
  }

  const response = await askFloorManager(body.Subject, body.TextBody, body.From);

  console.dir(response, { depth: null });

  processActions(response.actions, imageFile);

  socket.sendAction({
    type: 'email:processed',
    payload: response,
  });

  socket.sendUpdate();

  if (response.actions[0] && response.actions[0].type === 'REJECT') {
    await sendResponseEmail(
      body.From,
      'Smart Lift / Aktion abgelehnt',
      `${response.feedbackMessage}`,
      true
    );
  } else {
    await sendResponseEmail(body.From, 'Smart Lift / Aktion', `${response.feedbackMessage}`, true);
  }

  res.send('mail recieved and processed');
});

socket.listenForConnections();
app.listen(8083, () => console.log('Server listening on port 8083'));

// Update client every 30 seconds in case of external changes to the events data
setInterval(() => {
  socket.sendEventsUpdate();
}, 30000);

// Reset to factory settings every day at 00:00
cron.schedule('0 0 * * *', () => {
  processActions([{ type: 'RESET_TO_FACTORY' }]);
  socket.sendUpdate();
  console.log('Reset to factory settings');
});
