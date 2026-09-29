# Google Cloud Text-to-Speech Setup Tutorial

## How Audio Storage Works

**Important: Audio is NOT stored in the database or on the server. Here's how it works:**

1. **Audio Files** → Stored as MP3 files in **Cloudflare R2** (cloud object storage)
2. **Database** → Stores the R2 public URL and object key
3. **App Load** → Audio does NOT regenerate. Existing MP3 files are served directly from R2
4. **Server** → Serverless-friendly (no local filesystem required) ✅ Works on Vercel

**Example:**
```
Flashcard: "Bonjour" → "Hello"
├── Database stores:
│   ├── audio_url = "https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev/audio/flashcard-5-1696032000000.mp3"
│   └── audio_key = "audio/flashcard-5-1696032000000.mp3"
└── R2 bucket stores: audio/flashcard-5-1696032000000.mp3 (actual MP3 file)

When user clicks play:
→ Browser loads audio directly from R2 public URL
→ No server involved in audio delivery!
```

**Audio is generated ONCE when:**
- You create a new flashcard
- You edit the French text of an existing flashcard
- You manually click the "Regenerate" button

**Why R2 instead of local files?**
- ✅ **Vercel compatible** - Serverless platforms have read-only filesystems
- ✅ **Globally distributed** - R2 serves files from Cloudflare's edge network
- ✅ **Scalable** - No server disk space limits
- ✅ **Cost-effective** - R2 has no egress fees (unlike S3)

---

## Step-by-Step Google Cloud Setup

### Step 1: Create a Google Account (if you don't have one)

1. Go to [accounts.google.com](https://accounts.google.com/signup)
2. Create a free Google account
3. Verify your email

---

### Step 2: Access Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Sign in with your Google account
3. You may see a welcome screen - click "**Select a project**" at the top

![Google Cloud Console](https://cloud.google.com/_static/cloud/images/social-icon-google-cloud-1200-630.png)

---

### Step 3: Create a New Project

1. Click the **project dropdown** at the top (next to "Google Cloud")
2. Click "**NEW PROJECT**" button (top right of dialog)
3. Fill in project details:
   - **Project name**: `expense-tracker-learning` (or any name you like)
   - **Organization**: Leave as "No organization" (unless you have one)
   - **Location**: Leave as "No organization"
4. Click "**CREATE**"
5. Wait 10-20 seconds for project creation
6. Click "**SELECT PROJECT**" when the notification appears

**Your project ID will be shown** (e.g., `expense-tracker-learning-123456`)

---

### Step 4: Enable Billing (Required)

Google Cloud requires billing to be enabled even for the free tier.

1. In the left sidebar, click "**Billing**"
2. If you don't have a billing account:
   - Click "**Link a billing account**"
   - Click "**CREATE BILLING ACCOUNT**"
   - Enter your credit card details
   - **Don't worry**: Google offers $300 free credit for 90 days, and TTS has a generous free tier
3. Link your project to the billing account
4. Click "**SET ACCOUNT**"

**Free Tier Info:**
- $300 credit for 90 days (new users)
- After that: 0-4 million characters/month FREE for standard voices
- **Neural2 voices** (what this app uses): First **1 million characters FREE** per month, then $16/million
  - Voice: `fr-FR-Neural2-A` (Female, high quality)
  - Speaking rate: 0.9x (slightly slower for learning)

**Cost Estimate:**
- Average flashcard: ~20-30 characters (e.g., "Bonjour", "Comment allez-vous?")
- With 1 million free characters: **~33,000-50,000 flashcards FREE per month**
- After free tier: ~$0.0005 per flashcard ($0.50 per 1000 cards)

For personal learning use, you'll likely stay within the free tier indefinitely.

---

### Step 5: Enable Text-to-Speech API

1. In the top search bar, type "**Text-to-Speech API**"
2. Click on "**Cloud Text-to-Speech API**" in results
3. Click the blue "**ENABLE**" button
4. Wait 10-30 seconds for API to be enabled
5. You should see a dashboard with "API enabled" message

**Alternative path:**
1. Left sidebar → "**APIs & Services**" → "**Library**"
2. Search for "**text-to-speech**"
3. Click "**Cloud Text-to-Speech API**"
4. Click "**ENABLE**"

---

### Step 6: Create a Service Account

1. In the left sidebar, click "**IAM & Admin**"
2. Click "**Service Accounts**" in the submenu
3. Click "**+ CREATE SERVICE ACCOUNT**" at the top
4. Fill in service account details:
   - **Service account name**: `expense-tracker-tts`
   - **Service account ID**: (auto-filled, e.g., `expense-tracker-tts@project-id.iam.gserviceaccount.com`)
   - **Description**: `Service account for French learning TTS`
5. Click "**CREATE AND CONTINUE**"

---

### Step 7: Grant Permissions to Service Account

1. In the "**Grant this service account access to project**" section:
2. Click the "**Select a role**" dropdown
3. Type "**text-to-speech**" in the search box
4. Select "**Cloud Text-to-Speech API User**"
   - Alternative: You can also use "**Cloud Text-to-Speech API Client**"
5. Click "**CONTINUE**"
6. Click "**DONE**" (skip the optional "Grant users access" step)

---

### Step 8: Create and Download JSON Key

1. You should see your service account in the list
2. Click on the service account email (e.g., `expense-tracker-tts@...`)
3. Click on the "**KEYS**" tab at the top
4. Click "**ADD KEY**" dropdown
5. Select "**Create new key**"
6. Choose "**JSON**" format
7. Click "**CREATE**"
8. A JSON file will automatically download to your computer
   - File name will be like: `expense-tracker-learning-123456-a1b2c3d4e5f6.json`
9. **Important**: Keep this file secure! It's like a password.

---

### Step 9: Convert Credentials to Base64 (Vercel-Compatible)

For serverless platforms like Vercel, we use base64-encoded credentials instead of file paths.

1. Rename the downloaded file to something simple:
   ```bash
   # Move from Downloads to your project directory temporarily
   mv ~/Downloads/expense-tracker-learning-*.json ~/Downloads/google-tts-credentials.json
   ```

2. Convert the JSON file to base64 (one-line, no newlines):
   ```bash
   # macOS/Linux
   base64 -i ~/Downloads/google-tts-credentials.json | tr -d '\n'

   # This will output a long string like:
   # ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAi...
   ```

3. **Copy the entire base64 output** (it will be very long, ~2000 characters)

4. **Delete the original JSON file** (you won't need it anymore):
   ```bash
   rm ~/Downloads/google-tts-credentials.json
   ```

   ⚠️ **Important**: Never commit the JSON file to git. The base64 string will be stored as an environment variable only.

---

### Step 10: Set Environment Variable

#### Local Development (macOS/Linux)

1. Open your `.env` file:
   ```bash
   cd /Users/sharoztariq/Documents/personal/expense-tracker/server
   nano .env  # or use any text editor
   ```

2. Add the base64-encoded credentials:
   ```bash
   # server/.env
   GOOGLE_TTS_CREDENTIALS_B64=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAi...
   ```

   Replace the example string with your actual base64 output from Step 9.

3. Save and close the file

4. **Verify it works:**
   ```bash
   npm run tts:check
   ```

   Expected output:
   ```
   ✓ GOOGLE_TTS_CREDENTIALS_B64 is set
     Length: 1847 characters

   🎤 Testing TTS synthesis...
     Synthesizing: "Bonjour"

   ✅ SUCCESS!
     Audio generated: 15234 bytes
     Voice: fr-FR-Neural2-A (Female, Neural2 quality)
     Format: MP3
     Speaking rate: 0.9x (slower for learning)

   ✓ Google TTS is working correctly!
   ```

#### Alternative: Use gcloud CLI (Local Dev Only)

If you prefer not to use base64 for local development, you can use Google Cloud's Application Default Credentials:

```bash
# Install gcloud CLI first: https://cloud.google.com/sdk/docs/install
gcloud auth application-default login
```

The app will automatically fall back to ADC if `GOOGLE_TTS_CREDENTIALS_B64` is not set.

#### Vercel/Production Deployment

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. Add a new variable:
   - **Name**: `GOOGLE_TTS_CREDENTIALS_B64`
   - **Value**: Paste your base64 string from Step 9
   - **Environment**: Production, Preview, Development (select all)

3. Click "Save"

4. Redeploy your app for changes to take effect

**How it works:**
- The server automatically detects `GOOGLE_TTS_CREDENTIALS_B64` on startup
- It decodes the base64 string and initializes the TTS client
- No file writes needed ✅ Works on Vercel's read-only filesystem

---

### Step 11: Set Up Cloudflare R2 (Required for Audio Storage)

Since audio is stored in Cloudflare R2, you need to set up R2 as well:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** in the left sidebar
3. Click "**Create bucket**"
4. Name: `flashcards-audio`
5. Location: Choose closest to your users
6. Click "**Create bucket**"

**Enable Public Access:**
1. Go to bucket settings
2. Click "**Settings**" tab
3. Under "**Public access**", click "**Allow Access**"
4. Copy the public URL (e.g., `https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev`)

**Create API Tokens:**
1. Go to R2 → **Manage R2 API Tokens**
2. Click "**Create API Token**"
3. Name: `flashcards-audio-access`
4. Permissions: **Object Read & Write**
5. Bucket: Select `flashcards-audio` (or leave "All buckets")
6. Click "**Create API Token**"
7. **Copy** the Access Key ID and Secret Access Key (shown only once!)

**Add to .env file:**
```bash
# server/.env
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET=flashcards-audio
R2_PUBLIC_URL=https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev
```

---

### Step 12: Verify Your Setup

1. Start your server:
   ```bash
   cd /Users/sharoztariq/Documents/personal/expense-tracker/server
   npm start
   ```

2. You should see:
   ```
   Server running on http://localhost:3000
   ```

3. Test the setup:
   ```bash
   # In a new terminal window
   cd /Users/sharoztariq/Documents/personal/expense-tracker/client
   npm run dev
   ```

4. Open your browser to the client URL (usually http://localhost:5173)

5. Login and navigate to: **Learning** → **Flashcards**

6. Create a test flashcard:
   - French Text: `Bonjour`
   - English Meaning: `Hello`
   - Click "Create"

7. **Check that it worked:**
   - Server logs should show no errors
   - The flashcard should show a Play button (🔊)
   - Go to Cloudflare R2 dashboard → Your bucket → You should see `audio/flashcard-{id}-{timestamp}.mp3`
   - Click Play to hear "Bonjour" pronounced in French

8. Verify the audio URL:
   - Inspect the flashcard in your browser's dev tools
   - The `audio_url` should be: `https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev/audio/flashcard-...mp3`

---

## Troubleshooting

### Error: "Could not load the default credentials" or "Failed to initialize Google TTS client"

**Solution 1: Verify base64 credentials are set**
```bash
# Run the TTS check script
cd server
npm run tts:check
```

**Solution 2: Check environment variable**
```bash
# Verify the variable is set
echo $GOOGLE_TTS_CREDENTIALS_B64 | wc -c
# Should output a number around 1800-2000 characters
```

**Solution 3: Regenerate base64 string**
Make sure you used `tr -d '\n'` to remove newlines:
```bash
base64 -i google-tts-credentials.json | tr -d '\n'
```

Copy the entire output (it's one very long line) and paste it into your `.env` file.

**Solution 4: Fallback to gcloud (local dev only)**
```bash
# If you have gcloud CLI installed
gcloud auth application-default login
```

Then restart your server. The app will automatically use Application Default Credentials.

---

### Error: "Missing required environment variable: R2_ACCOUNT_ID"

**Solution:**
Make sure all 5 R2 environment variables are set in your `.env` file:
```bash
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET=flashcards-audio
R2_PUBLIC_URL=https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev
```

---

### Error: "API has not been used in project... before or it is disabled"

**Solution:**
1. Go to [console.cloud.google.com/apis/library/texttospeech.googleapis.com](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com)
2. Make sure you're in the correct project (check dropdown at top)
3. Click "ENABLE"

---

### Error: "Permission denied" or "403 Forbidden"

**Solution: Check service account role**
1. Go to [IAM & Admin > IAM](https://console.cloud.google.com/iam-admin/iam)
2. Find your service account (e.g., `expense-tracker-tts@...`)
3. Click the pencil icon to edit
4. Add role: "Cloud Text-to-Speech API User"
5. Save

---

### Error: "Network error" or R2 connection refused

**Solution:**
1. Verify R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY are correct
2. Check that the R2 bucket exists and is named correctly
3. Verify the API token has "Object Read & Write" permissions

---

### Audio doesn't play (404 error)

**Possible causes:**

1. **R2_PUBLIC_URL is incorrect**
   - Check R2 bucket → Settings → Public Access
   - Ensure bucket allows public reads
   - Verify R2_PUBLIC_URL matches the public endpoint

2. **Bucket is private**
   - Go to R2 bucket → Settings → Public Access
   - Click "Allow Access"

3. **Audio file wasn't uploaded**
   - Check R2 bucket contents
   - Look for `audio/flashcard-*.mp3` files

---

### Flashcard created but no audio

**This is normal if:**
- Google TTS credentials are not configured
- TTS API call failed
- R2 credentials are invalid

**Solution:**
- Check server logs for errors
- Verify both Google TTS and R2 credentials
- Click the Regenerate button (↻) on the flashcard to retry

---

## Cost Monitoring

### View Your Google TTS Usage

1. Go to [Cloud Console > Text-to-Speech > Quotas](https://console.cloud.google.com/apis/api/texttospeech.googleapis.com/quotas)
2. You can see:
   - Characters synthesized
   - API requests made
   - Current usage vs limits

### View Your R2 Usage

1. Go to Cloudflare Dashboard → R2
2. View:
   - Storage used (GB)
   - Class A operations (writes)
   - Class B operations (reads)

### Set Budget Alerts

**Google Cloud:**
1. Go to [Billing > Budgets & alerts](https://console.cloud.google.com/billing/budgets)
2. Click "CREATE BUDGET"
3. Set budget amount: e.g., $1/month
4. Set alert thresholds: 50%, 90%, 100%
5. Add your email for notifications

**Cloudflare R2:**
- R2 has no egress fees (free downloads)
- Storage: $0.015/GB/month
- Class A operations (writes): $4.50/million
- Class B operations (reads): $0.36/million
- For typical use, costs are minimal (<$1/month)

---

## Working Without Google Cloud (Optional)

If you don't want to set up Google Cloud, the app will still work:

1. Flashcards will be created successfully
2. Audio will NOT be auto-generated
3. You'll see this in server logs:
   ```
   Failed to generate/upload TTS audio: Could not load the default credentials
   ```
4. Flashcards without audio will not have a Play button
5. You can manually regenerate audio later by:
   - Setting up Google TTS credentials
   - Clicking the Regenerate button (↻) on each flashcard

---

## Summary Checklist

- [ ] Google account created
- [ ] Google Cloud project created
- [ ] Billing enabled (free $300 credit)
- [ ] Text-to-Speech API enabled
- [ ] Service account created
- [ ] Service account has "Text-to-Speech API User" role
- [ ] JSON key downloaded
- [ ] JSON key moved to secure location
- [ ] JSON key added to .gitignore
- [ ] GOOGLE_APPLICATION_CREDENTIALS environment variable set
- [ ] Cloudflare R2 bucket created (`flashcards-audio`)
- [ ] R2 public access enabled
- [ ] R2 API tokens created
- [ ] All 5 R2 environment variables set
- [ ] Server started successfully
- [ ] Test flashcard created
- [ ] Audio file appears in R2 bucket
- [ ] Play button works and audio plays from R2 URL

---

## Quick Reference

**Environment Variables (.env):**
```bash
# Google Cloud TTS
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/google-tts-credentials.json

# Cloudflare R2
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET=flashcards-audio
R2_PUBLIC_URL=https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev
```

**Useful Links:**
- [Google Cloud Console](https://console.cloud.google.com/)
- [TTS API Documentation](https://cloud.google.com/text-to-speech/docs)
- [TTS Pricing](https://cloud.google.com/text-to-speech/pricing)
- [TTS Voices Demo](https://cloud.google.com/text-to-speech#section-2)
- [Cloudflare R2 Dashboard](https://dash.cloudflare.com/?to=/:account/r2)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)

---

## Need Help?

If you're still having issues:

1. Check server logs for specific error messages
2. Verify all checkboxes above are complete
3. Try creating a flashcard and check both:
   - Browser console (F12)
   - Server terminal output
   - R2 bucket contents
4. Make sure you're using the correct Google Cloud project (check dropdown at top)

The most common issues:
1. GOOGLE_APPLICATION_CREDENTIALS not set or using relative path
2. R2 environment variables missing or incorrect
3. R2 bucket not set to public access
4. Service account missing required role

For production deployment on Vercel, see the R2_MIGRATION_COMPLETE.md guide for additional setup steps.
