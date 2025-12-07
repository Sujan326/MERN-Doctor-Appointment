import multer from "multer";

// STEPS:
/*
  1. Frontend uploads the image.
  2. Multer receives the image file and gives the req.file to controller.
  3. Mutler stores the image temperary on the server and uploads it cloudinary which gives the public url for that image.
  4. Save the public url in the database.

  FLOW:
  Frontend Form → Multer → temp file → Cloudinary → URL → MongoDB → Frontend display
*/

// Store the image file receiving temporarily
const storage = multer.diskStorage({
  // The image file is received from req, mutler adds the other properties to files and finally gives: req.file
  filename: function (req, file, callback) {
    // callback here is, null means no error and keep the name of the file like that only.
    callback(null, file.originalname);
  },
});

// when the image file is received the multer calls the storage.filename function to store the image.
const upload = multer({ storage });

// Export
export default upload;
