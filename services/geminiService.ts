
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateStories = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a list of 5 creative and interesting story titles for children, each with a one-sentence summary.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "The title of the story."
                  },
                  summary: {
                    type: Type.STRING,
                    description: "A short, one-sentence summary of the story."
                  }
                },
                required: ["title", "summary"]
              }
            }
          },
          required: ["stories"]
        }
      }
    });
    
    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);
    return parsed.stories;

  } catch (error) {
    console.error("Error generating stories:", error);
    throw new Error("Failed to generate story ideas. Please try again.");
  }
};

export const generateStoryContent = async (title: string) => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Write a complete short story for children based on the title: "${title}". The story should be engaging, imaginative, and around 500 words long. Use paragraphs to structure the story.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story content:", error);
    throw new Error("Failed to generate the full story. Please try again.");
  }
};
