import "dotenv/config";
import { synthesizeFrench } from "../lib/tts.js";

async function checkTTS() {
  console.log("🔍 Checking Google TTS credentials...\n");

  // Check environment variables
  const base64Creds = process.env.GOOGLE_TTS_CREDENTIALS_B64;
  const fileCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (base64Creds) {
    console.log("✓ GOOGLE_TTS_CREDENTIALS_B64 is set");
    console.log(`  Length: ${base64Creds.length} characters`);
  } else if (fileCreds) {
    console.log("⚠ Using GOOGLE_APPLICATION_CREDENTIALS (file-based, won't work on Vercel)");
    console.log(`  Path: ${fileCreds}`);
  } else {
    console.log("⚠ No Google credentials found - will try Application Default Credentials");
  }

  console.log("\n🎤 Testing TTS synthesis...");

  try {
    const testPhrase = "Bonjour";
    console.log(`  Synthesizing: "${testPhrase}"`);

    const audioBuffer = await synthesizeFrench(testPhrase);

    console.log(`\n✅ SUCCESS!`);
    console.log(`  Audio generated: ${audioBuffer.length} bytes`);
    console.log(`  Voice: fr-FR-Neural2-A (Female, Neural2 quality)`);
    console.log(`  Format: MP3`);
    console.log(`  Speaking rate: 0.9x (slower for learning)`);
    console.log("\n✓ Google TTS is working correctly!");
    process.exit(0);
  } catch (error) {
    console.log(`\n❌ FAILED!`);
    console.error(`  Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    console.log("\nTroubleshooting:");
    console.log("1. Verify GOOGLE_TTS_CREDENTIALS_B64 is a valid base64-encoded service account JSON");
    console.log("2. Ensure the service account has 'Cloud Text-to-Speech User' role");
    console.log("3. Check that the Cloud Text-to-Speech API is enabled in your project");
    console.log("4. For local dev, ensure gcloud CLI is authenticated: gcloud auth application-default login");
    process.exit(1);
  }
}

checkTTS();
