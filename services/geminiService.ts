import { GoogleGenAI } from "@google/genai";
import { Gender } from "../types";
import { PROMPT_TEMPLATES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes the image to detect the gender of the main subject.
 */
export const detectGender = async (base64Image: string): Promise<Gender> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: "Analyze this image. Is the main person Male or Female? Respond with exactly one word: 'MALE' or 'FEMALE'." },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64,
            },
          },
        ],
      },
    });

    const text = response.text?.trim().toUpperCase() || '';
    
    if (text.includes('FEMALE')) {
      return Gender.FEMALE;
    }
    // Default to Male if specifically identified or if ambiguous (as a fallback)
    return Gender.MALE;
  } catch (error) {
    console.error("Error identifying gender:", error);
    return Gender.MALE; // Fallback default
  }
};

/**
 * Generates a new fashion look based on the input image and selected parameters.
 */
export const generateNewLook = async (
  base64Image: string,
  gender: Gender,
  style: string
): Promise<string> => {
  try {
    // Clean base64 string if necessary (remove data:image/png;base64, prefix)
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const prompt = PROMPT_TEMPLATES[gender](style);

    // Using gemini-2.5-flash-image for editing tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG for standardization, or detect from input
              data: cleanBase64,
            },
          },
        ],
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const resultBase64 = part.inlineData.data;
          // Construct a displayable data URL
          return `data:image/png;base64,${resultBase64}`;
        }
      }
    }
    
    throw new Error("No image generated in response.");
  } catch (error) {
    console.error("Error generating style:", error);
    throw error;
  }
};