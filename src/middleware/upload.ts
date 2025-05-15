const multer = require('koa-multer');
const path = require('path');

// Set storage config
// const storage = multer.diskStorage({
//   destination: (req:any, file:any, cb:any) => {
//     console.log("dirrrrrrr..",__dirname)
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: (req:any, file:any, cb:any) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

module.exports = upload;

