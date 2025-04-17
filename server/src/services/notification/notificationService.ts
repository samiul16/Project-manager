// sms.ts
import twilio from "twilio";

import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "fb27b54e",
  apiSecret: "5udfxUgDOQRkGPhy",
});

const from = "Vonage APIs";
const to = "8801601076098";
const text = "A text message sent using the Vonage SMS API";

export async function sendSMS() {
  await vonage.sms
    .send({ to, from, text })
    .then((resp: any) => {
      console.log("Message sent successfully");
      console.log(resp);
    })
    .catch((err: any) => {
      console.log("There was an error sending the messages.");
      console.error(err);
    });
}

export const sendWhatsApp = async (toNumber: string, message: string) => {
  try {
    const body = {
      from: { type: "whatsapp", number: process.env.VONAGE_WHATSAPP_NUMBER },
      to: { type: "whatsapp", number: toNumber },
      message: {
        content: {
          type: "text",
          text: message,
        },
      },
    };
    const response = await axios.post(process.env.VONAGE_API_URL!, body, {
      auth: {
        username: process.env.VONAGE_API_KEY!,
        password: process.env.VONAGE_API_SECRET!,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("WhatsApp message sent:", response.data);
  } catch (error: any) {
    console.error(
      "WhatsApp send error:",
      error?.response?.data || error.message
    );
  }
};
