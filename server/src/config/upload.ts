import multer from "multer";

// Use memoryStorage for Vercel compatibility (no filesystem writes)
const storage = multer.memoryStorage();

export const audioUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
  fileFilter: (_req, file, cb) => {
    // Only accept audio/mpeg for consistency with Google TTS output
    if (file.mimetype === "audio/mpeg") {
      cb(null, true);
    } else {
      cb(new Error("Invalid audio file type. Only audio/mpeg (MP3) is allowed"));
    }
  },
});
