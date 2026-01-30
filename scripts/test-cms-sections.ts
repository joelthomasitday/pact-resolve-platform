
import { SignJWT } from "jose";

const BASE_URL = "http://localhost:3000/api";
const CONTENT_API_URL = `${BASE_URL}/content`;

interface TestResult {
  name: string;
  success: boolean;
  message?: string;
  status?: number;
  body?: any;
}

const results: { passed: number; failed: number; tests: TestResult[] } = {
  passed: 0,
  failed: 0,
  tests: []
};

function logResult(name: string, success: boolean, message?: string, status?: number, body?: any) {
  const statusMsg = status ? ` [Status: ${status}]` : "";
  const bodyMsg = body && !success ? ` - Response: ${JSON.stringify(body)}` : "";
  if (success) {
    results.passed++;
    console.log(`✅ PASS: ${name}${statusMsg}`);
  } else {
    results.failed++;
    console.error(`❌ FAIL: ${name}${statusMsg}${message ? ` - ${message}` : ""}${bodyMsg}`);
  }
  results.tests.push({ name, success, message, status });
}

async function getAdminToken() {
  console.log("🔐 Authenticating as Admin...");
  const email = "cms-test-admin@test.com";
  const password = "password123";

  // Try Login first
  let loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (loginRes.status === 401 || loginRes.status === 404) {
    // If login fails, try to signup
    console.log("⚠️ Admin account not found, creating new one...");
    await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "CMS Test Admin",
        email,
        password,
        role: "admin"
      })
    });

    // Login again
    loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
  }

  const data = await loginRes.json();
  if (!loginRes.ok || !data.token) {
    throw new Error(`Authentication failed: ${loginRes.status} ${JSON.stringify(data)}`);
  }
  
  console.log("🔑 token obtained");
  return data.token;
}

async function runCMSTests() {
  console.log("🚀 Starting CMS Content Sections Testing Suite...");

  try {
    const token = await getAdminToken();
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    // --- 1. Panel Members ---
    console.log("\n👤 --- Section: Panel Members ---");
    const panelMemberEndpoint = `${CONTENT_API_URL}/panel-members`;
    
    // Create
    const newMember = {
      name: "Test Panelist",
      role: "Mediator",
      image: { url: "https://example.com/panel.jpg", alt: "Panelist Image" },
      bio: "Experienced mediator.",
      order: 1,
      isActive: true
    };
    
    const memberCreateRes = await fetch(panelMemberEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(newMember)
    });
    const memberCreateData = await memberCreateRes.json();
    const memberId = memberCreateData.data?._id;
    logResult("Create Panel Member", memberCreateRes.ok && !!memberId, undefined, memberCreateRes.status, memberCreateData);

    if (memberId) {
        // Update Order
        const updateOrderRes = await fetch(panelMemberEndpoint, {
            method: "PUT",
            headers,
            body: JSON.stringify({ _id: memberId, order: 2 })
        });
        logResult("Update Panel Member Order", updateOrderRes.ok, undefined, updateOrderRes.status);

        // Toggle Status
        const toggleRes = await fetch(panelMemberEndpoint, {
            method: "PUT",
            headers,
            body: JSON.stringify({ _id: memberId, isActive: false })
        });
        logResult("Toggle Panel Member Status", toggleRes.ok, undefined, toggleRes.status);

        // Delete
        const deleteRes = await fetch(`${panelMemberEndpoint}?id=${memberId}`, {
            method: "DELETE",
            headers
        });
        logResult("Delete Panel Member", deleteRes.ok, undefined, deleteRes.status);
    }

    // --- 2. Partners ---
    console.log("\n🤝 --- Section: Partners ---");
    const partnerEndpoint = `${CONTENT_API_URL}/partners`;

    // Create
    const newPartner = {
        name: "Test Partner Corp",
        logo: { url: "https://example.com/logo.png", alt: "Logo" },
        category: "strategic",
        order: 1,
        isActive: true
    };

    const partnerCreateRes = await fetch(partnerEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(newPartner)
    });
    const partnerCreateData = await partnerCreateRes.json();
    const partnerId = partnerCreateData.data?._id;
    logResult("Create Partner", partnerCreateRes.ok && !!partnerId, undefined, partnerCreateRes.status, partnerCreateData);

    if (partnerId) {
        // Verify Enum (Implicitly tested by creating 'strategic') - Try Updating URL
        const updateUrlRes = await fetch(partnerEndpoint, {
            method: "PUT",
            headers,
            body: JSON.stringify({ _id: partnerId, websiteUrl: "https://testpartner.com" })
        });
        logResult("Update Partner URL", updateUrlRes.ok, undefined, updateUrlRes.status);

        // Delete
        const partnerDeleteRes = await fetch(`${partnerEndpoint}?id=${partnerId}`, {
            method: "DELETE",
            headers
        });
        logResult("Delete Partner", partnerDeleteRes.ok, undefined, partnerDeleteRes.status);
    }

    // --- 3. MCI Events ---
    console.log("\n🏆 --- Section: MCI Events ---");
    const mciEndpoint = `${CONTENT_API_URL}/mci-event`;

    // Create
    const newEvent = {
        year: 2099, // Future year to avoid conflicts
        isActive: true,
        title: ["MCI", "2099"],
        subtitle: "Future of Mediation",
        heroImage: { url: "https://example.com/mci.jpg", alt: "MCI Hero" },
        eventDetails: {
            dates: "Jan 1-5, 2099",
            venue: "Virtual Space",
            hosts: "AI Hosts",
            sponsors: "Future Tech"
        }
    };

    const eventCreateRes = await fetch(mciEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(newEvent)
    });
    const eventCreateData = await eventCreateRes.json();
    const eventId = eventCreateData.data?._id;
    logResult("Create MCI Event", eventCreateRes.ok && !!eventId, undefined, eventCreateRes.status, eventCreateData);

    if (eventId) {
        // Update nested fields
        const updateEventRes = await fetch(mciEndpoint, {
            method: "PUT",
            headers,
            body: JSON.stringify({
                _id: eventId,
                vision: "To unite the galaxy through mediation",
                eventDetails: {
                    ...newEvent.eventDetails,
                    venue: "Mars Colony 1"
                }
            })
        });
        logResult("Update Event Details", updateEventRes.ok, undefined, updateEventRes.status);

        // Add Past Edition (if schema allows updating array directly or if specific logic exists)
        // Assuming array update via PUT
        const addPastRes = await fetch(mciEndpoint, {
            method: "PUT",
            headers,
            body: JSON.stringify({
                 _id: eventId,
                 pastEditions: [{ year: 2098, title: "The Prequel", summary: "It was great" }]
            })
        });
        logResult("Add Past Edition", addPastRes.ok, undefined, addPastRes.status);

         // Clean up (Delete) - usually events stick around, but for test hygiene we might want to delete
         const deleteEventRes = await fetch(`${mciEndpoint}?id=${eventId}`, {
            method: "DELETE",
            headers
        });
        logResult("Delete MCI Event", deleteEventRes.ok, undefined, deleteEventRes.status);
    }

    // --- 4. Global Settings ---
    console.log("\n🌍 --- Section: Global Settings ---");
    const globalSettingsEndpoint = `${CONTENT_API_URL}/global-settings`;

    // Fetch Existing
    const getSettingsRes = await fetch(globalSettingsEndpoint, { headers });
    const getSettingsData = await getSettingsRes.json();
    logResult("Fetch Global Settings", getSettingsRes.ok, undefined, getSettingsRes.status);

    // Update
    const updateSettingsRes = await fetch(globalSettingsEndpoint, {
        method: "PUT",
        headers,
        body: JSON.stringify({
            whatsapp: "+1234567890",
            address: "123 Test St, Test City",
            contactPersons: [{ name: "Test Contact", phone: "111-222-3333", role: "Tester" }]
        })
    });
    logResult("Update Global Settings", updateSettingsRes.ok, undefined, updateSettingsRes.status);

    // --- 5. Footer Settings ---
    console.log("\n🦶 --- Section: Footer Settings ---");
    const footerEndpoint = `${CONTENT_API_URL}/footer`;

    // Fetch First to see structure if needed, or just update (Singleton)
    // Update Copyright and Socials
    const updateFooterRes = await fetch(footerEndpoint, {
        method: "PUT",
        headers,
        body: JSON.stringify({
            copyrightText: `© ${new Date().getFullYear()} PACT Mediation Test`,
            newsletter: { enabled: true, heading: "Subscribe Now" },
            socialLinks: [
                { platform: "linkedin", url: "https://linkedin.com/company/test", enabled: true },
                { platform: "facebook", url: "https://facebook.com/test", enabled: false }
            ]
        })
    });
    logResult("Update Footer Settings", updateFooterRes.ok, undefined, updateFooterRes.status);


    // --- Summary ---
    console.log("\n📊 --- Test Summary ---");
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    
    if (results.failed > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error("❌ Critical Test Error:", error);
    process.exit(1);
  }
}

runCMSTests();
