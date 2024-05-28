'use client'
import { createPresignedUrlWithClient, getImageUploadFileURL } from "@app/actions/useractions"
import https from "https";
import { URL } from "url";

export async function uploadFileS3Bucket(file: File | null){
    if (!file){
        return null
    }
    
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const urlEncodedFilename = encodeURI(file.name)
    console.log(file)

    const presSignedURL = await createPresignedUrlWithClient(file.name, file.type)

    const myHeaders = new Headers({ 'Content-Type': file.type });
    console.log(presSignedURL)
    const res = await fetch(presSignedURL, {method: "PUT", headers: myHeaders, body: await file.arrayBuffer()})
    console.log(res)
    const url = getImageUploadFileURL(urlEncodedFilename)
    return url

}

function put(url: string | URL, bufferData: string | ArrayBuffer | DataView) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream', // or the appropriate MIME type
          'Content-Length': Buffer.byteLength(bufferData)
        },
      };
  
      const req = https.request(url, options, (res) => {
        let responseBody = '';
  
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
  
        res.on('end', () => {
          resolve(responseBody);
        });
      });
  
      req.on('error', (e) => {
        reject(e);
      });
  
      req.write(bufferData);
      req.end();
    });
  }
  

export function extractObjectKey(url: string) {
    // Use URL constructor to parse the URL
    const parsedUrl = new URL(url);

    // Split the pathname to get the last part
    const pathSegments = parsedUrl.pathname.split('/');

    // The object key is the last segment of the pathname
    const objectKey = pathSegments[pathSegments.length - 1];

    return objectKey;
}