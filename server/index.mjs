import OpenAI from "openai";
import fs from "fs";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_APIKEY,
});

const FloorsSchema = z.object({
  floors: z.array(
    z.object({
      num: z.number(),
      companies: z.array(
        z.object({
          name: z.string(),
          logo: z.string(),
        }),
      ),
    }),
  ),
});

async function modifyFloorsData(filePath, message) {
  const fileStream = fs.createReadStream(filePath);
  const file = await client.files.create({
    file: fileStream,
    purpose: "user_data",
  });

  const response = await client.responses.create({
    model: "gpt-4.1",
    input: [
      {
        role: "system",
        content:
          "Modify the given json input file and respond with the correct output",
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
      {
        role: "user",
        content: [{ type: "input_file", file_id: file.id }],
      },
    ],
    text: {
      format: zodTextFormat(FloorsSchema, "floors"),
    },
  });

  fs.writeFileSync(filePath, response.output_text);
}

await modifyFloorsData(
  "./floors.json",
  "Füge die Company Bing hinter Facebook ein",
);
