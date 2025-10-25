import { GoogleGenAI, Type, Modality } from '@google/genai';

// The user-provided API key is hardcoded here as requested.
// WARNING: This is not a secure practice for production applications as it exposes your key.
const API_KEY = 'AIzaSyDD0nS4I9Kk4IhyXayYatqVzAnxjGO0ebk';

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
    
    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);
    return parsed.stories;

  } catch (error) {
    console.error("Error generating stories:", error);
    throw new Error("Failed to generate story ideas. Please try again.");
  }
};

export const generateStoryImage = async (summary: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Generate an enchanting, digital art style illustration for a children's story with the theme: "${summary}". The style should be whimsical and colorful.`,
            },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
  
      // The response structure for image generation is different, we need to parse candidates.
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:image/png;base64,${base64ImageBytes}`;
        }
      }
      throw new Error("No image data found in response.");
  
    } catch (error) {
      console.error("Error generating story image:", error);
      throw new Error("Failed to generate a story image.");
    }
  };

export const generateStoryContent = async (title: string) => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Write a complete short story for children based on the title: "${title}". The story should be engaging, imaginative, and around 500 words long. Use paragraphs to structure the story.`
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story content:", error);
    throw new Error("Failed to generate the full story. Please try again.");
  }
};
