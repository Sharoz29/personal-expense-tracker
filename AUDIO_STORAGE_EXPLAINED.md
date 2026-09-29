# How Audio Storage Works - Visual Guide

## TL;DR - Quick Answer

**Is audio saved in the database?**
- ❌ NO - Audio FILES are saved in **Cloudflare R2** (cloud storage)
- ✅ YES - Audio URLS and KEYS are saved in database

**Does audio regenerate on app load?**
- ❌ NO - Audio is generated ONCE and stored in R2
- ✅ YES - You can manually regenerate by clicking the refresh button

**Why R2 instead of local files?**
- ✅ Works on Vercel (serverless, read-only filesystem)
- ✅ Globally distributed via Cloudflare edge network
- ✅ No egress fees (unlike AWS S3)
- ✅ Scalable without server disk limits

---

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  USER CREATES FLASHCARD                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Save to Database                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ INSERT INTO flashcards                                    │  │
│  │   french_text = "Bonjour"                                 │  │
│  │   english_meaning = "Hello"                               │  │
│  │   audio_url = NULL  ← Not set yet                         │  │
│  │   audio_key = NULL                                        │  │
│  │   id = 5                                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Call Google Cloud TTS API                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ POST https://texttospeech.googleapis.com/v1/text:synth... │  │
│  │ {                                                         │  │
│  │   "input": { "text": "Bonjour" },                        │  │
│  │   "voice": { "languageCode": "fr-FR" },                  │  │
│  │   "audioConfig": { "audioEncoding": "MP3" }              │  │
│  │ }                                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  Google returns: MP3 audio as Buffer (in-memory)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Upload to Cloudflare R2                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ S3Client.send(PutObjectCommand)                          │  │
│  │   Bucket: "flashcards-audio"                             │  │
│  │   Key: "audio/flashcard-5-1696032000000.mp3"            │  │
│  │   Body: <MP3 Buffer>                                     │  │
│  │   ContentType: "audio/mpeg"                              │  │
│  │   CacheControl: "public, max-age=31536000, immutable"    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  R2 returns:                                                    │
│    key = "audio/flashcard-5-1696032000000.mp3"                 │
│    url = "https://pub-28...r2.dev/audio/flashcard-5-...mp3"    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Update Database with R2 URL and Key                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ UPDATE flashcards                                         │  │
│  │ SET audio_url = 'https://pub-28...r2.dev/audio/...'      │  │
│  │     audio_key = 'audio/flashcard-5-1696032000000.mp3'    │  │
│  │ WHERE id = 5                                              │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ✅ COMPLETE - Flashcard Created with Audio                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## When User Opens the App Later

```
┌─────────────────────────────────────────────────────────────────┐
│  USER OPENS FLASHCARDS PAGE                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Load Flashcards from Database                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ SELECT * FROM flashcards                                  │  │
│  │                                                           │  │
│  │ Returns:                                                  │  │
│  │   id: 5                                                   │  │
│  │   french_text: "Bonjour"                                  │  │
│  │   english_meaning: "Hello"                                │  │
│  │   audio_url: "https://pub-28...r2.dev/audio/..."         │  │
│  │   audio_key: "audio/flashcard-5-1696032000000.mp3"       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Display Flashcard in UI                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ┌─────────────────────────────────────────────────────┐   │  │
│  │ │ Bonjour                                      [🔊]   │   │  │
│  │ │ Hello                                               │   │  │
│  │ │ [Edit] [Refresh] [Delete]                          │   │  │
│  │ └─────────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │ Play button shows because audio_url exists ✓              │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  USER CLICKS PLAY BUTTON                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Browser Loads Audio Directly from R2                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ GET https://pub-28dbdccede424ae6abd4ff153acbde7d.r2.dev  │  │
│  │     /audio/flashcard-5-1696032000000.mp3                 │  │
│  │                                                           │  │
│  │ → Direct connection from browser to Cloudflare R2        │  │
│  │ → Server is NOT involved in audio delivery!              │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Cloudflare R2 Serves Audio File                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ R2 returns MP3 binary data from edge cache               │  │
│  │ Served from nearest Cloudflare data center               │  │
│  │ Fast global delivery via CDN                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: Browser Plays Audio                                   │
│  🔊 "Bon-jour" (French pronunciation)                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Storage Comparison Table

| Aspect | Database (Turso) | R2 Cloud Storage | Server Filesystem (OLD) |
|--------|------------------|------------------|------------------------|
| **What's Stored** | URL & Key<br>`audio_url: "https://..."`<br>`audio_key: "audio/..."` | Actual MP3 file<br>(binary data) | ❌ Not used anymore<br>(Vercel is read-only) |
| **Size in DB** | ~150 bytes (two text fields) | 0 bytes | N/A |
| **Size in Storage** | 0 bytes | ~15 KB per file | N/A |
| **When Created** | On flashcard insert | After TTS API call | N/A |
| **On App Load** | Read from DB | NOT regenerated | N/A |
| **On Play Click** | URL used directly | File served via CDN | N/A |
| **Backup Needed** | Yes (via DB dump) | Yes (R2 backup) | N/A |
| **Works on Vercel** | ✅ Yes | ✅ Yes | ❌ No (read-only filesystem) |

---

## Why Cloudflare R2? (vs Local Files or S3)

### ❌ Old Approach: Local Filesystem
```
TTS → fs.writeFile(server/uploads/audio/file.mp3)
     ↓
Database stores: audio_filename = "file.mp3"
     ↓
express.static serves: /uploads/audio/file.mp3
     ↓
Browser loads: http://localhost:3000/uploads/audio/file.mp3

❌ Problems:
- Doesn't work on Vercel (read-only filesystem)
- Files lost on every deploy
- No scalability (limited disk space)
- Single point of failure
```

### ✅ New Approach: Cloudflare R2
```
TTS → R2.PutObject(audio/file.mp3)
     ↓
Database stores:
  audio_url = "https://pub-28...r2.dev/audio/file.mp3"
  audio_key = "audio/file.mp3"
     ↓
Browser loads DIRECTLY from R2 (no server involved!)
     ↓
Cloudflare edge network delivers audio

✅ Benefits:
- Works on Vercel and all serverless platforms
- Files persist forever (no deploy impact)
- Unlimited scalability
- Globally distributed (fast everywhere)
- No egress fees (unlike S3)
- Server never touches audio playback
```

### R2 vs AWS S3

| Feature | Cloudflare R2 | AWS S3 |
|---------|---------------|--------|
| **Storage** | $0.015/GB/month | $0.023/GB/month |
| **Egress (Downloads)** | ✅ **FREE** | ❌ $0.09/GB |
| **API Calls** | Cheap | Moderate |
| **Global Edge** | ✅ Built-in CDN | Requires CloudFront |
| **Cost for 1000 flashcards** | <$0.25/month | ~$3-5/month |

**For this app:** R2 is **10-20x cheaper** than S3 because users frequently play audio (lots of downloads).

---

## Key Takeaways

1. **Audio files live in R2**, not in database or server filesystem
2. **Database only stores URLs and keys** (pointers to R2 objects)
3. **Audio is generated once** and reused forever (until edited/deleted)
4. **No regeneration on app load** - existing files are served from R2
5. **Browser loads audio directly from R2** - server not involved in playback
6. **Automatic cleanup** when flashcard is deleted or French text changes
7. **Serverless-friendly** - works on Vercel with read-only filesystem
8. **Cost-effective** - R2 has no egress fees, unlike S3

---

## Common Misconceptions

### ❌ "Audio regenerates every time I load the page"
**Reality**: Audio files persist in R2. They're only generated once when created or edited.

### ❌ "If I restart the server, audio will be gone"
**Reality**: Audio files are in R2 (cloud storage), not on the server. They survive server restarts, deploys, etc.

### ❌ "Google charges me every time someone plays audio"
**Reality**: Google only charges when TTS API is called (creation/edit). Playing uses R2 files.

### ❌ "R2 charges me for every audio download"
**Reality**: R2 has **zero egress fees**. Downloads are completely free! (This is R2's killer feature vs S3)

### ❌ "Files are stored on my Vercel server"
**Reality**: Vercel has a **read-only filesystem**. All audio is in R2, not on Vercel servers.
