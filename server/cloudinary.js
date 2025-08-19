require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Cloudinary storage for Multer
const chatStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'chat_data',               // folder for all chat media
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: 'auto',             // supports image/audio/video
      type: 'upload'
    };
  },
});

// ✅ File filter for chat media
const chatFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'audio/mpeg', 'audio/mp3', 'audio/wav',
    'video/mp4', 'video/quicktime', 'video/mov'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

module.exports = { chatStorage, chatFileFilter };
