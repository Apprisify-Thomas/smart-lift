import express from 'express';
import cors from 'cors';
import { askFloorManager, saveImage } from './utils';
import path from 'path';
import { FileAttachment } from './types';
import { processActions } from './actions';
import { LiftSocket } from './LiftSocket';

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

  const attachments = req.body.Attachments as FileAttachment[];
  let imageFile;

  if (attachments && attachments[0] && attachments[0].Content) {
    imageFile = await saveImage(attachments[0]);
  }

  const response = await askFloorManager(req.body.TextBody as string);

  console.dir(response, { depth: null });

  await processActions(response.actions, imageFile);

  socket.sendAction({
    type: 'email:processed',
    payload: response,
  });

  socket.sendUpdate();

  res.send('mail recieved and processed');
});

socket.listenForConnections();
app.listen(8083, () => console.log('Server listening on port 8083'));

// Update client every 30 seconds in case of external changes to the events data
setInterval(() => {
  socket.sendEventsUpdate();
}, 30000);
