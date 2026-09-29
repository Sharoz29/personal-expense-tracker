# R2 Migration Complete - Summary

## ✅ Migration Status: COMPLETE

Flashcard audio storage has been successfully migrated from local filesystem (`server/uploads/audio/`) to Cloudflare R2. The application is now ready for deployment on Vercel's serverless platform.

---

## 📋 Files Changed

### Server - Created/Modified (10 files)

**New Files:**
1. `server/src/lib/r2.ts` - R2 client with `uploadAudio()` and `deleteAudio()` functions
2. `server/src/db/migrations/022_flashcard_r2_audio.sql` - Adds `audio_url` and `audio_key` columns

**Modified Files:**
3. `server/src/db/migrate.ts` - Added migration 022 to migration list
4. `server/src/services/tts.service.ts` - Now returns `Buffer` instead of writing to disk; removed all `fs` operations
5. `server/src/services/flashcard.service.ts` - Complete R2 integration: create → TTS → uploadAudio → update DB; handles old key deletion
6. `server/src/repositories/flashcard.repository.ts` - Added `updateAudioR2(id, url, key)` method
7. `server/src/app.ts` - **REMOVED** `express.static("/uploads/audio")` route and unused imports
8. `server/src/types/index.ts` - Added `audio_url: string | null` and `audio_key: string | null` to `Flashcard` interface
9. `server/.env.example` - Added R2 environment variables with placeholder values
10. `server/package.json` - Added `@aws-sdk/client-s3` dependency

### Client - Modified (3 files)

1. `client/src/types/index.ts` - Added `audio_url` and `audio_key` to `Flashcard` interface
2. `client/src/pages/learning/Flashcards.tsx` - Changed `playAudio(filename)` → `playAudio(url)`; now checks `card.audio_url` instead of `card.audio_filename`
3. `client/src/pages/learning/Study.tsx` - Same changes as Flashcards.tsx

---

## 🔑 Environment Variables Required

Add these to your `.env` file (server):

```bash
# Cloudflare R2 Storage
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET=flashcards-audio
R2_PUBLIC_URL=https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev
```

**Where to find these values:**

1. **R2_ACCOUNT_ID**: Cloudflare Dashboard → R2 → Overview (in the endpoint URL)
2. **R2_ACCESS_KEY_ID & R2_SECRET_ACCESS_KEY**:
   - R2 → Manage R2 API Tokens → Create API Token
   - Permissions: Object Read & Write
   - Copy the Access Key ID and Secret Access Key (shown only once!)
3. **R2_BUCKET**: `flashcards-audio` (your bucket name)
4. **R2_PUBLIC_URL**: `https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev` (from bucket settings → Public Access)

---

## 🗄️ Database Migration

Run the migration to add the new columns:

```bash
cd server
npm run migrate
```

This adds:
- `audio_url TEXT` - Full public URL to audio file in R2
- `audio_key TEXT` - R2 object key for deletion

**Note:** The old `audio_filename` column is **NOT** dropped. This allows for:
1. Backward compatibility during migration
2. Manual data migration if needed
3. Rollback capability

**References to `audio_filename`** (if you want to clean up later):
- Server: `repositories/flashcard.repository.ts` (line 64-70, 133, 135)
- Server: `services/flashcard.service.ts` (line 90-93 - uploadAudio method)
- Client: `types/index.ts` (line 284)

Ask before dropping this column.

---

## 🧪 Local Testing

### 1. Set up R2 credentials

```bash
# Add to server/.env
R2_ACCOUNT_ID=your-actual-account-id
R2_ACCESS_KEY_ID=your-actual-key
R2_SECRET_ACCESS_KEY=your-actual-secret
R2_BUCKET=flashcards-audio
R2_PUBLIC_URL=https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev
```

### 2. Run migration

```bash
cd server
npm run migrate
```

Expected output:
```
Migration 022_flashcard_r2_audio.sql completed.
All migrations completed successfully.
```

### 3. Start the app

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

### 4. Test Scenarios

**Test 1: Create Flashcard**
1. Navigate to Learning → Flashcards
2. Click "Add Flashcard"
3. Enter:
   - French Text: `Bonjour`
   - English Meaning: `Hello`
4. Click "Create"
5. ✅ **Expected**:
   - Flashcard appears with Play button (🔊)
   - Check R2 bucket: Object `audio/flashcard-{id}-{timestamp}.mp3` should exist
   - Click Play → Audio plays from R2 URL

**Test 2: Edit French Text (triggers regeneration)**
1. Click Edit on the "Bonjour" flashcard
2. Change French Text to `Bonsoir`
3. Click "Update"
4. ✅ **Expected**:
   - New audio object in R2 with new timestamp
   - Old `audio/flashcard-{id}-{old-timestamp}.mp3` deleted from R2
   - Play button works with new pronunciation

**Test 3: Edit English Only (no TTS call)**
1. Click Edit on any flashcard
2. Change **only** English Meaning (e.g., "Hello" → "Good morning")
3. Click "Update"
4. ✅ **Expected**:
   - Flashcard updated
   - NO new audio generated (check server logs - no TTS call)
   - Same audio object in R2
   - Play button still works

**Test 4: Regenerate Audio**
1. Click the Refresh (↻) icon on any flashcard
2. ✅ **Expected**:
   - Icon spins
   - New audio object created
   - Old audio object deleted
   - Play button works with new audio

**Test 5: Delete Flashcard**
1. Click Delete (trash icon) on any flashcard
2. Confirm deletion
3. ✅ **Expected**:
   - Flashcard removed from list
   - Audio object deleted from R2 bucket
   - Check R2: `audio/flashcard-{id}-*.mp3` should be gone

**Test 6: TTS Failure Handling**
1. Temporarily remove `GOOGLE_APPLICATION_CREDENTIALS` from `.env`
2. Create a new flashcard
3. ✅ **Expected**:
   - Flashcard created successfully (no crash)
   - NO Play button (audio_url is null)
   - Server logs error: "Failed to generate/upload TTS audio"
   - Flashcard can be regenerated later by clicking ↻

---

## 🚀 Vercel Deployment

### 1. Add Environment Variables to Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET=flashcards-audio
R2_PUBLIC_URL=https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev
GOOGLE_APPLICATION_CREDENTIALS=/var/task/google-credentials.json
```

For Google TTS credentials on Vercel:
1. Base64 encode your credentials file:
   ```bash
   base64 -i /path/to/google-credentials.json
   ```
2. Add as environment variable: `GOOGLE_CREDENTIALS_BASE64=<base64-string>`
3. In your server startup, decode and write to `/tmp/google-credentials.json` (Vercel's writable temp dir)

**OR** use Vercel Secrets for sensitive values.

### 2. Run Migration on Turso

```bash
# If using Turso CLI locally
turso db shell <your-db-name> < server/src/db/migrations/022_flashcard_r2_audio.sql

# Or via the web console
# 1. Go to Turso dashboard
# 2. Select your database
# 3. Open SQL console
# 4. Paste and run:
ALTER TABLE flashcards ADD COLUMN audio_url TEXT;
ALTER TABLE flashcards ADD COLUMN audio_key TEXT;
```

### 3. Deploy

```bash
git add .
git commit -m "Migrate audio storage from local fs to Cloudflare R2"
git push
```

Vercel will automatically deploy. Check deployment logs for any errors.

### 4. Verify Production

1. Open your production URL
2. Create a test flashcard
3. Check R2 bucket for the audio file
4. Play the audio
5. Delete the test flashcard
6. Verify audio file is removed from R2

---

## 📊 How It Works Now

### Flow Diagram

```
User Creates Flashcard ("Bonjour" → "Hello")
           ↓
1. INSERT INTO flashcards (...)
   → Returns flashcard with id=5, audio_url=null
           ↓
2. Google TTS API Call
   → Returns MP3 audio as Buffer
           ↓
3. R2 uploadAudio(flashcardId=5, mp3Buffer)
   → PutObject to R2
   → Key: "audio/flashcard-5-1696032000000.mp3"
   → Returns: {
        key: "audio/flashcard-5-1696032000000.mp3",
        url: "https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev/audio/flashcard-5-1696032000000.mp3"
      }
           ↓
4. UPDATE flashcards SET
     audio_url = 'https://pub-28...',
     audio_key = 'audio/flashcard-5-1696032000000.mp3'
   WHERE id = 5
           ↓
5. Return updated flashcard to client
           ↓
User Clicks Play Button
   → Plays audio directly from R2 public URL
   → No server request needed!
```

### What Changed

**Before (Local Filesystem):**
```
TTS → fs.writeFile(uploads/audio/file.mp3)
     → DB stores filename
     → express.static serves /uploads/audio
     → Browser: /uploads/audio/file.mp3
     → ❌ Doesn't work on Vercel (read-only filesystem)
```

**After (Cloudflare R2):**
```
TTS → R2.PutObject(audio/file.mp3)
     → DB stores URL and key
     → Browser: https://pub-28....r2.dev/audio/file.mp3
     → ✅ Works on Vercel (no local filesystem needed)
```

---

## 🔍 Verification Checklist

- [x] ✅ Server builds without errors (`npm run build`)
- [x] ✅ Client builds without errors (`npm run build`)
- [x] ✅ Migration file created and added to migration list
- [x] ✅ R2 client created with proper error handling
- [x] ✅ TTS service returns Buffer (no fs writes)
- [x] ✅ Flashcard service uses R2 (create, update, delete, regenerate)
- [x] ✅ Old audio deleted AFTER new upload succeeds
- [x] ✅ Frontend uses `audio_url` directly
- [x] ✅ No more `express.static` for audio
- [x] ✅ Environment variables documented
- [x] ✅ `.env` is gitignored
- [ ] 🔲 Local testing completed (your turn!)
- [ ] 🔲 Migration run on Turso production DB (your turn!)
- [ ] 🔲 Environment variables added to Vercel (your turn!)
- [ ] 🔲 Production deployment tested (your turn!)

---

## 🐛 Troubleshooting

### "Missing required environment variable: R2_ACCOUNT_ID"

**Cause:** R2 env vars not set
**Fix:** Add all 5 R2 variables to `.env`

### "Network error" or "Connection refused" when creating flashcard

**Cause:** R2 credentials invalid
**Fix:** Double-check R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY

### Audio doesn't play (404 error)

**Cause:** R2_PUBLIC_URL is incorrect or bucket is private
**Fix:**
1. Check R2 bucket → Settings → Public Access
2. Ensure bucket allows public reads
3. Verify R2_PUBLIC_URL matches the public endpoint

### "No audio content received from Google TTS"

**Cause:** Google TTS not configured
**Fix:** Set GOOGLE_APPLICATION_CREDENTIALS in `.env`

### Old filesystem audio still being used

**Cause:** Database still has `audio_filename` but no `audio_url`
**Fix:**
1. Either regenerate audio (click ↻)
2. Or create new flashcards (old ones will gradually be updated)

---

## 🗑️ Cleanup (Optional)

### Remove old audio files from uploads/audio

```bash
# Once all flashcards have audio_url populated
rm -rf server/uploads/audio/*
# Or delete the entire uploads directory
rm -rf server/uploads
```

### Remove audio_filename column (After verifying everything works)

**WARNING:** Only do this after confirming all flashcards have `audio_url` populated!

```sql
-- Check first
SELECT COUNT(*) FROM flashcards WHERE audio_url IS NOT NULL;
SELECT COUNT(*) FROM flashcards WHERE audio_filename IS NOT NULL;

-- If all flashcards have audio_url, you can drop audio_filename
-- But ASK before doing this!
ALTER TABLE flashcards DROP COLUMN audio_filename;
```

Then remove references from:
- `server/src/repositories/flashcard.repository.ts` (updateAudioFilename method)
- `server/src/services/flashcard.service.ts` (uploadAudio method)
- `server/src/types/index.ts` (Flashcard interface)
- `client/src/types/index.ts` (Flashcard interface)

---

## 💡 Key Points

1. **Audio is now stored in R2**, not on the server's filesystem
2. **Database stores URLs**, not filenames
3. **Vercel-compatible** - no filesystem writes needed
4. **Backward compatible** - `audio_filename` column kept for migration period
5. **Graceful failure** - If TTS/R2 fails, flashcard is still created (can regenerate later)
6. **Delete order matters** - Always delete from DB first, then cleanup R2 objects
7. **Update order matters** - Upload new → Update DB → Delete old (prevents broken state)

---

## 📞 Next Steps

1. **Test locally** using the test scenarios above
2. **Run migration** on your Turso production database
3. **Add env vars** to Vercel
4. **Deploy** to Vercel
5. **Test production** by creating/editing/deleting a flashcard
6. **Monitor** R2 usage in Cloudflare dashboard

If everything works, you can optionally clean up the old `uploads/audio/` directory and eventually drop the `audio_filename` column (ask first!).

---

**Status:** ✅ Migration code complete. Builds successful. Ready for local testing and deployment.
