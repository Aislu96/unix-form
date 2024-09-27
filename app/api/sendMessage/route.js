import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, phone_number } = await req.json();

    const apiUrl =
      "https://binorix.bitrix24.ru/rest/84/vkjnlsum474ykygo/crm.lead.list";

    // Check if lead with the same email exists
    const emailCheckResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          UF_CRM_1717761252272: email, // Email field
        },
        select: ["ID"],
      }),
    });

    const emailCheckData = await emailCheckResponse.json();

    // Check if lead with the same phone number exists
    const phoneCheckResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          PHONE: phone_number, // Phone field
        },
        select: ["ID"],
      }),
    });

    const phoneCheckData = await phoneCheckResponse.json();

    // Combine the results to determine if either exists
    const leadExists =
      emailCheckData.result.length > 0 || phoneCheckData.result.length > 0;

    if (leadExists) {
      // Handle the case where the lead already exists
      return new Response("Lead already exists", { status: 409 });
    }

    // If no existing lead, proceed to add the new lead
    const addLeadUrl =
      "https://binorix.bitrix24.ru/rest/84/vkjnlsum474ykygo/crm.lead.add";

    const bitrix24Response = await fetch(addLeadUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          TITLE: `Lead: ${name}`,
          NAME: name,
          UF_CRM_1717761252272: email, // "Email" field
          OPENED: "Y",
          STATUS_ID: "NEW",
          SOURCE_ID: "WEB",
          PHONE: [{ VALUE: phone_number, VALUE_TYPE: "WORK" }],
          UF_CRM_1713940452974: "Unix form page", // "Lead Source" field
        },
        params: { REGISTER_SONET_EVENT: "Y" },
      }),
    });

    if (bitrix24Response.ok) {
      const result = await bitrix24Response.json();
      return NextResponse.json(
        { success: true, data: result },
        { status: 200 }
      );
    } else {
      const errorData = await bitrix24Response.text();
      console.error("Error response from Bitrix24:", errorData);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add lead to Bitrix24",
          errorData,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred", error: error.toString() },
      { status: 500 }
    );
  }
}
