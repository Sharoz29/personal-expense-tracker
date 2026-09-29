import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";

// Voice configuration - change this constant to switch voices
const FRENCH_VOICE_NAME = "fr-FR-Neural2-A";

// Initialize TTS client at module scope (only once)
let ttsClient: TextToSpeechClient;

try {
  const base64Creds = process.env.GOOGLE_TTS_CREDENTIALS_B64;

  if (base64Creds) {
    // Decode base64-encoded service account JSON
    const jsonString = Buffer.from(base64Creds, "base64").toString("utf-8");
    const credentials = JSON.parse(jsonString);

    if (!credentials.client_email || !credentials.private_key || !credentials.project_id) {
      throw new Error("Invalid Google service account JSON: missing required fields (client_email, private_key, project_id)");
    }

    ttsClient = new TextToSpeechClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      projectId: credentials.project_id,
    });

    console.log("✓ Google TTS client initialized with base64-encoded credentials");
  } else {
    // Fallback to Application Default Credentials (local dev with gcloud)
    ttsClient = new TextToSpeechClient();
    console.warn("⚠ GOOGLE_TTS_CREDENTIALS_B64 not set - falling back to Application Default Credentials (gcloud)");
  }
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  throw new Error(`Failed to initialize Google TTS client: ${message}`);
}

/**
 * Synthesizes French text to speech using Google Cloud TTS
 * @param text - French text to synthesize
 * @returns MP3 audio as Buffer
 */
export async function synthesizeFrench(text: string): Promise<Buffer> {
  try {
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text },
      voice: {
        languageCode: "fr-FR",
        name: FRENCH_VOICE_NAME,
        ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE,
      },
      audioConfig: {
        audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
        speakingRate: 0.9, // Slightly slower for learning
        pitch: 0,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error("No audio content received from Google TTS");
    }

    return Buffer.from(response.audioContent as Uint8Array);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to synthesize French audio: ${message}`);
  }
}
