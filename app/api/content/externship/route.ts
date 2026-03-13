import { NextRequest, NextResponse } from "next/server";
import { StorageProvider } from "@/lib/upload/storage";
import { sendMail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract data
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const location = formData.get("location");
    const resumeFile = formData.get("resume") as File;
    const coverLetterFile = formData.get("coverLetter") as File;

    let resumeUrl = "No file provided";
    let coverLetterUrl = "No file provided";

    // Upload files to Cloudinary if they exist
    if (resumeFile && resumeFile.size > 0) {
      const result = await StorageProvider.uploadFile(resumeFile);
      resumeUrl = result.url;
    }

    if (coverLetterFile && coverLetterFile.size > 0) {
      const result = await StorageProvider.uploadFile(coverLetterFile);
      coverLetterUrl = result.url;
    }
    
    /** 
     * DESTINATION: official@thepact.in
     * This section fulfills the requirement to send all externship application details 
     * including secure Cloudinary links for resume and cover letter to the official PACT email.
     */
    
    // Send the email
    const mailResult = await sendMail({
      to: "official@thepact.in",
      subject: `New Externship Application: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #bf9a66; border-bottom: 2px solid #bf9a66; padding-bottom: 10px;">New Externship Application</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Location:</td>
              <td style="padding: 8px 0;">${location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Resume:</td>
              <td style="padding: 8px 0;"><a href="${resumeUrl}" style="color: #bf9a66;">View Resume</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Cover Letter:</td>
              <td style="padding: 8px 0;"><a href="${coverLetterUrl}" style="color: #bf9a66;">View Cover Letter</a></td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This application was submitted via the PACT Ecosystem - Externship page.</p>
          </div>
        </div>
      `
    });

    console.log("--- EXTERNSHIP APPLICATION ROUTED TO official@thepact.in ---");
    console.log("Result:", mailResult.success ? "Success" : "Failed", mailResult.error || "");
    console.log("-------------------------------------------");
    
    return NextResponse.json({ 
      success: true, 
      message: "Your application for the Externship has been received. Our team will review your profile and get back to you shortly." 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error receiving externship application:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process application submission" 
    }, { status: 500 });
  }
}


export async function GET() {
  return NextResponse.json({ success: true, message: "Externship API is active" });
}
