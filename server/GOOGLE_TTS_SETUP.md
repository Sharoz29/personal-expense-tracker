# Google Cloud Text-to-Speech Setup

This application uses Google Cloud Text-to-Speech API to automatically generate French pronunciation audio for flashcards.

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### 2. Enable Text-to-Speech API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Cloud Text-to-Speech API"
3. Click "Enable"

### 3. Create a Service Account

1. Navigate to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name: `expense-tracker-tts` (or any name you prefer)
4. Role: Select "Cloud Text-to-Speech User" or "Text-to-Speech API User"
5. Click "Done"

### 4. Generate Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Click "Create" - this will download a JSON file

### 5. Configure Application

**Option 1: Using Environment Variable (Recommended for Production)**

1. Save the downloaded JSON file securely (e.g., `server/config/google-credentials.json`)
2. Add to `.gitignore`:
   ```
   server/config/google-credentials.json
   ```
3. Set the environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/google-credentials.json"
   ```

4. Add to your shell profile (`.bashrc`, `.zshrc`, etc.) to persist:
   ```bash
   echo 'export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/google-credentials.json"' >> ~/.zshrc
   source ~/.zshrc
   ```

**Option 2: Using Application Default Credentials (For Development)**

Place the credentials file at the default location:
```bash
# macOS/Linux
~/.config/gcloud/application_default_credentials.json

# Windows
%APPDATA%\gcloud\application_default_credentials.json
```

### 6. Verify Setup

Start the server and create a flashcard:
```bash
cd server
npm start
```

When you create a flashcard with French text, the server will automatically:
1. Call Google Cloud TTS API
2. Generate French pronunciation audio (MP3)
3. Save the file in `server/uploads/audio/`
4. Link the audio to the flashcard

Check the server logs for any TTS errors.

## Pricing

Google Cloud TTS offers:
- **Free Tier**: 0-4 million characters/month (Standard voices)
- **WaveNet/Neural2 voices** (what we use): $16 per million characters

For typical flashcard usage (20-50 characters per card), you can create:
- ~80,000 flashcards per month on free tier
- This is more than sufficient for personal use

[Current Pricing](https://cloud.google.com/text-to-speech/pricing)

## Features

### Automatic Audio Generation
- Audio is automatically generated when creating a flashcard
- Audio is regenerated when the French text is edited
- Audio files are deleted when flashcards are deleted

### Voice Configuration
The app uses: `fr-FR-Neural2-A` (Female, Neural2 quality)
- Speaking rate: 0.9 (slightly slower for learning)
- Language: French (France)

### Manual Regeneration
If needed, you can manually regenerate audio:
```bash
POST /api/flashcards/:id/generate-audio
```

## Troubleshooting

### Error: "Could not load the default credentials"
- Ensure `GOOGLE_APPLICATION_CREDENTIALS` environment variable is set correctly
- Check that the path to the credentials file is absolute
- Verify the JSON file is valid and not corrupted

### Error: "Permission denied" or "API not enabled"
- Ensure Text-to-Speech API is enabled in your GCP project
- Verify your service account has the correct role

### No audio generated but no errors
- Check server logs for any warnings
- Verify the `uploads/audio/` directory exists and is writable
- Check GCP billing is enabled (required even for free tier)

### Audio file not served
- Ensure static file serving is configured in `app.ts`:
  ```typescript
  app.use("/uploads/audio", express.static(path.join(__dirname, "../uploads/audio")));
  ```

## Development Without Google Cloud

If you don't want to set up Google Cloud TTS:
1. The app will work but flashcards won't have auto-generated audio
2. You can still manually upload audio files using the `/api/flashcards/:id/audio` endpoint
3. Errors are logged but don't prevent flashcard creation
