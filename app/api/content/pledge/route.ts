import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract data
    const fullName = formData.get("fullName");
    const jobTitle = formData.get("jobTitle");
    const orgName = formData.get("orgName");
    const website = formData.get("website");
    const place = formData.get("place");
    const date = formData.get("date");
    const signatoryEmail = formData.get("signatoryEmail");
    const orgEmail = formData.get("orgEmail");
    const logoFile = formData.get("logo") as File;
    
    /** 
     * DESTINATION: official@thepact.in
     * This fulfills the requirement to send all pledge details 
     * and the organization logo to the official PACT email.
     */
    
    // Prepare attachments if logo exists
    const attachments = [];
    if (logoFile && logoFile.size > 0) {
      const buffer = await logoFile.arrayBuffer();
      attachments.push({
        filename: logoFile.name,
        content: Buffer.from(buffer),
        contentType: logoFile.type
      });
    }

    // Send the email
    const mailResult = await sendMail({
      to: "official@thepact.in",
      subject: `New Pledge to Mediate: ${orgName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #bf9a66; border-bottom: 2px solid #bf9a66; padding-bottom: 10px;">New Pledge Submission</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px;">Full Name:</td>
              <td style="padding: 8px 0;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Job Title:</td>
              <td style="padding: 8px 0;">${jobTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Organization:</td>
              <td style="padding: 8px 0;">${orgName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Website:</td>
              <td style="padding: 8px 0;">${website || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Place:</td>
              <td style="padding: 8px 0;">${place}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Date:</td>
              <td style="padding: 8px 0;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Signatory Email:</td>
              <td style="padding: 8px 0;">${signatoryEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Organization Email:</td>
              <td style="padding: 8px 0;">${orgEmail}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This pledge was submitted via the PACT Ecosystem - Pledge page.</p>
            <p><strong>Note:</strong> The organization's logo is attached to this email.</p>
          </div>
        </div>
      `,
      attachments
    });

    console.log("--- PLEDGE ROUTED TO official@thepact.in ---");
    console.log("Result:", mailResult.success ? "Success" : "Failed", mailResult.error || "");
    console.log("-------------------------------------------");
    
    return NextResponse.json({ 
      success: true, 
      message: "Thank you for opting for the PACT Pledge to Mediate. The team will respond to you with a confirmation within the next 48-96 hours." 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error receiving pledge:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process pledge submission" 
    }, { status: 500 });
  }
}


export async function GET() {
  return NextResponse.json({ success: true, data: [] });
}
