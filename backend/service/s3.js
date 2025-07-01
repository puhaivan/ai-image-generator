import dotenv from 'dotenv'
dotenv.config()

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { Buffer } from 'buffer'


console.log('AWS Access:', process.env.AWS_ACCESS_KEY_ID)
console.log('AWS Secret:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Loaded' : '❌ Missing')
console.log('AWS Region:', process.env.AWS_REGION)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export const uploadImageToS3 = async (base64Data, prompt) => {
  const buffer = Buffer.from(base64Data, 'base64')
  const fileName = `${uuidv4()}.jpg`

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: 'image/jpeg',
    Metadata: {
      prompt,
    },
  })

  await s3.send(command)

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
}
