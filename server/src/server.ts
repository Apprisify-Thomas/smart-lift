import { WebSocketServer } from "ws";
import express from "express";
import fs from "fs";
import cors from "cors";
import { askFloorManager, saveImage, writeFloorsFile } from "./utils";
import path from "path";
import { FLOORS_FILE } from "./config";

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "../../client/dist")));
app.use(express.json({ limit: "5mb" }));

const wsServer = new WebSocketServer({
  port: 8082,
});

wsServer.on("connection", (ws) => {
  console.log("Client connected");

  const sendFloorUpdate = () => {
    var data = JSON.parse(fs.readFileSync(FLOORS_FILE).toString());
    ws.send(JSON.stringify({ type: "floors:update", payload: data.floors }));
  };

  ws.on("error", console.error);

  sendFloorUpdate();

  fs.watch(FLOORS_FILE, () => {
    sendFloorUpdate();
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

app.post("/", async(req, res) => {
  const message = req.body.TextBody as string;
  const attachments = req.body.Attachments as { Content: string }[];
  let imageFile = '';

  if(attachments[0] && attachments[0].Content) {
    imageFile = saveImage(attachments[0].Content);
  }

  const action = await askFloorManager(message);

  switch(action.actionType) {
    case 'UPDATE':
      // Update company action 
      writeFloorsFile((data) => {
        data.floors = data.floors.map(f => {
          const foundIndex = f.companies.findIndex((c) => c.name.toLowerCase() === action.companyName.toLowerCase());

          if(foundIndex >= 0) {
            f.companies[foundIndex] = { 
              ...f.companies[foundIndex], 
              name: action.replacedByName ? action.replacedByName : f.companies[foundIndex].name, 
              logo: action.image ? imageFile : "" 
            }
          }

          return f;
        });

        return data;
      }); 
    break;
    case 'ADD':
      // Add company action
      writeFloorsFile((data) => {
        data.floors = data.floors.map(f => {
          if(action.floor !== 0 && action.floor === f.num) {
            f.companies.push({ name: action.companyName, logo: action.image ? imageFile : "" });
          }

          return f;
        })

        return data;
      });
      break;
    case 'DELETE':
      // Delete company action
      writeFloorsFile((data) => {
        data.floors = data.floors.map(f => {
          f.companies = f.companies.filter(c => c.name.toLowerCase() !== action.companyName.toLowerCase());

          return f;
        })

        return data;
      });
  }

  res.send("email recieved");
});

app.listen(8083, () => {
  console.log("Server listening on port 8083");
});

console.log(`Websocket is running on ws://localhost:${wsServer.options.port}`);
