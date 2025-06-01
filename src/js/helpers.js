import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// export const getJSON = async function (url) {

//     try{
//         const res = await fetch(url);
//         const data = await res.json();

//         if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//         return data;
//     }catch(err){
//        // console.log(err);
//        throw err;
//     }
// };

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchpro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchpro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchpro = fetch(url);
//     const res = await Promise.race([fetchpro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     // console.log(err);
//     throw err;
//   }
// };

// export const sendJSON = async function (url, updateData) {
//   try {
//     const fetchpro = fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updateData),
//     });
//     const res = await Promise.race([fetchpro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     // console.log(err);
//     throw err;
//   }
// };