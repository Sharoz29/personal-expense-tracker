import { synthesizeFrench } from "../lib/tts.js";

export class TTSService {
  async generateFrenchAudio(text: string): Promise<Buffer> {
    try {
      return await synthesizeFrench(text);
    } catch (error) {
      console.error("TTS generation error:", error);
      throw new Error(`Failed to generate audio: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
