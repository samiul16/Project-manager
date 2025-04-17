import axios from "axios";

export const sendWhatsAppMessage = async (
  toNumber: string,
  message: string
) => {
  return axios.post(
    process.env.VONAGE_API_URL!,
    {
      from: { type: "whatsapp", number: process.env.VONAGE_WHATSAPP_NUMBER },
      to: { type: "whatsapp", number: toNumber },
      message: {
        content: {
          type: "text",
          text: message,
        },
      },
    },
    {
      auth: {
        username: process.env.VONAGE_API_KEY!,
        password: process.env.VONAGE_API_SECRET!,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
