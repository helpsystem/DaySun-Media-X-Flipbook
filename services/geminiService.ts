
import { GoogleGenAI, Modality } from "@google/genai";
import { Language } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. TTS functionality will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// 🔊 Generate speech from text using the Gemini TTS model
export const generateSpeech = async (text: string, lang: Language): Promise<string | null> => {
    if (!ai) {
        console.error("GoogleGenAI client is not initialized. Check API_KEY.");
        return null;
    }
    
    // 🌓 Switch voice based on language
    const voiceName = lang === Language.EN ? 'Kore' : 'Puck'; // Kore for English, Puck for Persian as an example

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (base64Audio) {
            return base64Audio;
        } else {
            console.error("No audio data received from Gemini API.");
            return null;
        }
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};
