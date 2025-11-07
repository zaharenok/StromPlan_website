import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📥 API route received upload request');

    // Get the FormData from the request
    const formData = await request.formData();

    console.log('📋 Form data fields:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    // Forward the request to n8n webhook
    const webhookUrl = 'https://n8n.aaagency.at/webhook-test/25ea5e3f-346d-44ab-8e24-e6e114c40eae';

    console.log('🔄 Forwarding to n8n webhook...');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type - fetch will set it automatically with boundary
    });

    console.log('📬 n8n response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ n8n error:', errorText);

      return NextResponse.json(
        {
          success: false,
          error: `Webhook error: ${response.status}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const result = await response.json().catch(() => ({ success: true }));
    console.log('✅ n8n response:', result);

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: result
    });

  } catch (error: any) {
    console.error('❌ API route error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
