import fs from "fs";
import moment from "moment"
const readHTMLFile = function (path: any, cb: any) {
  // read file
  fs.readFile(path, "utf-8", function (err, data) {
    if (err) {
      console.log(err);
      throw err;
    } else {
      cb(null, data);
    }
  });
};

const createLiveImageURL = (filedata: any, imageCount: any) => {
  const baseUrl = "http://localhost:5000";

  if (imageCount === "single") {
    return `${baseUrl}/uploads/${filedata[0]?.filename}`;
  } else {
    return `${baseUrl}/uploads/${filedata?.filename}`;
  }
};
const generateOtp = async (n: any) => {
    const val = Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1);
    return val;
}

export { createLiveImageURL, readHTMLFile,generateOtp };
