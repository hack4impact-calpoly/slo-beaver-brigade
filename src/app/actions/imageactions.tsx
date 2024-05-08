'use server'
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { getImageUploadFileURL } from "./useractions";

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
            return`https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${content.Key}`
        }
    })
    console.log(image_keys)
    return JSON.stringify(image_keys)
}