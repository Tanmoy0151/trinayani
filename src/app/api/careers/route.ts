import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

// Set up Google Drive API credentials
const setupGoogleDrive = () => {
  const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI || 'https://developers.google.com/oauthplayground';
  const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  return google.drive({ version: 'v3', auth: oauth2Client });
};

// Function to upload a file to Google Drive
const uploadFileToDrive = async (drive: any, file: any, fileName: string, mimeType: string) => {
  try {
    // Create a buffer from the file data
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Create a readable stream from the buffer
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    
    // Set up the media and metadata for the file
    const driveResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: mimeType,
        parents: ['15Gxm_JjptyksIyLHoEcgEOWaggzySqx1'], // Specified Google Drive folder ID
      },
      media: {
        mimeType: mimeType,
        body: readableStream,
      },
    });
    
    return driveResponse.data;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
};

export async function POST(request: Request) {
  try {
    // Initialize Google Drive
    const drive = setupGoogleDrive();
    
    // Get the form data
    const formData = await request.formData();
    
    // Extract application data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const jobId = formData.get('jobId') as string;
    const jobTitle = formData.get('jobTitle') as string;
    
    // Get the resume file
    const resumeFile = formData.get('resume') as File;
    let fileUploadResult = null;
    
    if (resumeFile) {
      const fileName = `Resume-${name.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}-${resumeFile.name}`;
      
      // Upload file to Google Drive
      fileUploadResult = await uploadFileToDrive(
        drive,
        resumeFile,
        fileName,
        resumeFile.type
      );
      
      console.log('File uploaded to Google Drive:', fileUploadResult);
    }
    
    // Log the application data
    console.log('Received job application:', {
      name,
      email, 
      phone,
      coverLetter,
      jobId,
      jobTitle,
      resumeFile: resumeFile ? {
        name: resumeFile.name,
        type: resumeFile.type,
        size: resumeFile.size,
        googleDriveId: fileUploadResult?.id || null
      } : null
    });
    
    // Generate a fake application ID
    const applicationId = `APP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Application received successfully!',
      applicationId,
      fileUploaded: !!fileUploadResult
    });
    
  } catch (error) {
    console.error('Error processing job application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process your application. Please try again later.' },
      { status: 500 }
    );
  }
} 