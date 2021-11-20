import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('attachmentUtils')
const s3 = new XAWS.S3({ signatureVersion: 'v4' })
// TODO: Implement the fileStogare logic
export class AttachmentUtils {

    constructor(
      private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
      private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
    ) {}
  
    async getAttachmentUrl(attachmentId: string): Promise<string> {
        logger.info(`setting attachment url: ${this.bucketName, attachmentId}`);
        const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
        return attachmentUrl
    }
  
    async getUploadUrl(attachmentId: string): Promise<string> {
      logger.info(`getting upload url: ${this.bucketName, attachmentId}`);
      return s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: attachmentId,
        Expires: this.urlExpiration
      })
      
    }
  
  }