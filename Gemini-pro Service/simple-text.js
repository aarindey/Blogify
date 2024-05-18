// import { genAI } from "./utils/common.js";

// export async function askGemini(prompt) {

//   // For text-only inputs, use the gemini-pro model
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//   //   const prompt = "what is developmnt?";

//   const { totalTokens } = await model.countTokens(prompt);
//   console.log("Tokens count:", totalTokens);

//   const result = await model.generateContent(prompt);
//   const response = result.response;
//   const text = response.text();
//   console.log(text);
// }

import { genAI } from "./utils/common.js";

export async function askGemini(prompt) {
  try {
    // For text-only inputs, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { totalTokens } = await model.countTokens(prompt);
    console.log("Tokens count:", totalTokens);

    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const client = new GoogleGenerativeAI({
//   apiKey: process.env.API_KEY,
// });

// export async function askGemini(prompt) {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     if (response.candidates[0].finishReason === "SAFETY") {
//       throw new Error("Query was blocked due to safety concerns.");
//     }

//     return response.candidates[0].text();
//   } catch (error) {
//     console.error("Error generating response:", error);
//     throw error;
//   }
// }
