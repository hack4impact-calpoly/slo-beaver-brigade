'use server'
import { DeleteObjectCommand, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { getImageUploadFileURL } from "./useractions";
import { extractObjectKey } from "app/lib/clientActions";

const s3Client = new S3Client({
    region: process.env.S3_REGION as string,
    credentials: {
        accessKeyId: process.env.IAM_ACCESS_KEY as string,
        secretAccessKey: process.env.IAM_SECRET_KEY as string
    },
})
export async function getAllImagesS3(){
    const command = new ListObjectsCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Delimiter: "/"
    })
    const res = await s3Client.send(command)
    if (!res){
        return "[]"
    }
    const image_keys = res.Contents?.map((content) => {
        if (content.Key){
            const file_name = encodeURI(content.Key)
            return`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${file_name}`
        }
    })
    return JSON.stringify(image_keys)
}
export async function removeImageS3(url: string){

    const parsedUrl = new URL(url);
    // Split the pathname to get the last part
    const pathSegments = parsedUrl.pathname.split('/');

    // The object key is the last segment of the pathname
    const key = decodeURI(pathSegments[pathSegments.length - 1]);

    
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    });

    try {
        const response = await s3Client.send(command);
        
    } catch (err) {
        console.error(err);
  }
}