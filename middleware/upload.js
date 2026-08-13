// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Make sure uploads folder exists
// const uploadDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // e.g.  1720000000000-burger.jpg
//     const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
//     const ext = path.extname(file.originalname).toLowerCase();
//     cb(null, unique + ext);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = /jpeg|jpg|png|gif|webp/;
//   const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
//   const mimeOk = allowed.test(file.mimetype);
//   if (extOk && mimeOk) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
// });

// module.exports = upload;



const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'foodie-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;

  const extOk = allowed.test(file.originalname.toLowerCase());
  const mimeOk = allowed.test(file.mimetype);

  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;