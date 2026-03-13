import { NextRequest, NextResponse } from "next/server";
import { StorageProvider } from "@/lib/upload/storage";
import { sendMail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract text data
    const name = formData.get("name");
    const university = formData.get("university");
    const yearOfStudy = formData.get("yearOfStudy");
    const resumeHistory = formData.get("resumeHistory");
    const linkedin = formData.get("linkedin");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const category = formData.get("category");

    // Extract files
    const resumeFile = formData.get("resumeFile") as File;
    const certificatesFile = formData.get("certificatesFile") as File;

    let resumeUrl = "No file provided";
    let certificatesUrl = "No file provided";

    // Upload files to Cloudinary if they exist
    if (resumeFile && resumeFile.size > 0) {
      const result = await StorageProvider.uploadFile(resumeFile);
      resumeUrl = result.url;
    }

    if (certificatesFile && certificatesFile.size > 0) {
      const result = await StorageProvider.uploadFile(certificatesFile);
      certificatesUrl = result.url;
    }
    
    /** 
     * DESTINATION: official@mediationchampionship.com / official@thepact.in
     */
    
    // Send the email
    const mailResult = await sendMail({
      to: "official@thepact.in",
      subject: `New MCI Challenger Application: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #bf9a66; border-bottom: 2px solid #bf9a66; padding-bottom: 10px;">New MCI Challenger Application</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">University:</td>
              <td style="padding: 8px 0;">${university}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Year of Study:</td>
              <td style="padding: 8px 0;">${yearOfStudy}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">WhatsApp/Phone:</td>
              <td style="padding: 8px 0;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 15px 0; vertical-align: top; font-weight: bold;">Mediation History:</td>
              <td style="padding: 15px 0;">${resumeHistory}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">LinkedIn:</td>
              <td style="padding: 8px 0;"><a href="${linkedin}" style="color: #bf9a66;">Profile Link</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Resume File:</td>
              <td style="padding: 8px 0;"><a href="${resumeUrl}" style="color: #bf9a66;">Open Resume</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Certificates:</td>
              <td style="padding: 8px 0;"><a href="${certificatesUrl}" style="color: #bf9a66;">Open Certificates</a></td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This application was submitted via the MCI Challenger - Application page.</p>
          </div>
        </div>
      `
    });

    console.log("--- MCI CHALLENGER APPLICATION ROUTED ---");
    console.log("Result:", mailResult.success ? "Success" : "Failed", mailResult.error || "");
    console.log("-------------------------------------------");
    
    return NextResponse.json({ 
      success: true, 
      message: "Your application has been received. Our team will review your profile and get back to you shortly." 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error receiving MCI application:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process application submission" 
    }, { status: 500 });
  }
}


export async function GET() {
  return NextResponse.json({ success: true, message: "MCI Challenger API is active" });
}
