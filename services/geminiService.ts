
import { GoogleGenAI, Type } from "@google/genai";
import { PlayerListResponse, LeagueCategory, GroundingSource } from "../types";

export const fetchAFCONPlayers = async (): Promise<PlayerListResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a detailed scouting report of 18 top-tier AFCON players (2024/25) currently in Europe (EPL, La Liga, Serie A, Bundesliga, Ligue 1) or Saudi Pro League. 
      
      CRITICAL INSTRUCTIONS:
      1. Provide a unique ID for each player.
      2. Set 'imageUrl' to "" (empty string) unless you find a high-confidence, stable link. Do not guess Wikimedia paths.
      3. Provide a primary national team HEX color ('nationColor') for branding (e.g., Egypt: #CE1126, Nigeria: #008751).
      4. Write professional technical scout summaries for 'description'.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            players: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  nationalTeam: { type: Type.STRING },
                  club: { type: Type.STRING },
                  league: { type: Type.STRING, enum: Object.values(LeagueCategory) },
                  position: { type: Type.STRING },
                  age: { type: Type.INTEGER },
                  marketValue: { type: Type.STRING },
                  starPower: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  imageUrl: { type: Type.STRING },
                  nationColor: { type: Type.STRING }
                },
                required: ["id", "name", "nationalTeam", "club", "league", "position", "starPower", "nationColor"]
              }
            }
          },
          required: ["players"]
        }
      }
    });

    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'Source',
            uri: chunk.web.uri
          });
        }
      });
    }

    const data = JSON.parse(response.text || '{"players": []}');
    return {
      players: data.players || [],
      sources: sources
    };
  } catch (error) {
    console.error("Discovery Error:", error);
    return { players: [], sources: [] };
  }
};
