// const createLiveImageURL=(filedata:any, imageCount:any)=> {
//   const baseUrl = 'http://localhost:5000';
// console.log("base hhhhhh bbbhhh",baseUrl)
//   if (imageCount === 'single') {
//     return `${baseUrl}/uploads/${filedata[0]?.filename}`;
//   } else {
//     return `${baseUrl}/uploads/${filedata?.filename}`;
//   }
// }
const createLiveImageURL = (filedata: any, imageCount: any) => {
  const baseUrl = 'http://localhost:5000';

  if (imageCount === 'single') {
    return `${baseUrl}/uploads/${filedata[0]?.filename}`;
  } else {
    return `${baseUrl}/uploads/${filedata?.filename}`;
  }
};

export default createLiveImageURL