// File: app/api/submit-booking/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    
    // Format the message content
    const emailContent = {
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      subject: `New Lab Test Booking - ${formData.name}`,
      from_name: 'Lab Test Booking System',
      to_name: 'Admin',
      message: `
        New Lab Test Booking

        Personal Information:
        Name: ${formData.name}
        Age: ${formData.age}
        Blood Group: ${formData.bloodGroup}
        Sex: ${formData.sex}
        Mobile: ${formData.mobile}
        Address: ${formData.address}
        Landmark: ${formData.landmark}

        Appointment Details:
        Preferred Date: ${formData.date}
        Preferred Time: ${formData.time}
        Alternative Time: ${formData.alternativeTime}

        Selected Tests:
        ${formData.selectedTests.map((test: string) => `- ${test}`).join('\n')}

        Health Information:
        Health Issues: ${formData.healthIssues || 'None specified'}
        Current Medications: ${formData.medications || 'None specified'}
        Allergies: ${formData.allergies || 'None specified'}
      `,
      // You can customize these fields as needed
      botcheck: '',
      replyto: formData.email || process.env.RECIPIENT_EMAIL,
    };

    // Send to Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(emailContent),
    });

    const result = await response.json();
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Failed to send email');
    }
    
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}
