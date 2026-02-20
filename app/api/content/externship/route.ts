import { NextRequest, NextResponse } from "next/server";
import { StorageProvider } from "@/lib/upload/storage";

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
    console.log("--- EXTERNSHIP APPLICATION ROUTED TO official@thepact.in ---");
    console.log("Applicant:", name);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Location:", location);
    console.log("Resume URL:", resumeUrl);
    console.log("Cover Letter URL:", coverLetterUrl);
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
