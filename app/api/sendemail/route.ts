// app/api/send-email/route.ts
import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    
    const msg = {
      to: process.env.RECIPIENT_EMAIL!,
      from: process.env.VERIFIED_SENDER_EMAIL!, // Must be verified with SendGrid
      subject: `New Lab Test Booking - ${formData.name}`,
      html: `
        <h1>New Lab Test Booking</h1>
        <h2>Personal Information</h2>
        <p>Name: ${formData.name}</p>
        <p>Age: ${formData.age}</p>
        <p>Blood Group: ${formData.bloodGroup}</p>
        <p>Sex: ${formData.sex}</p>
        <p>Mobile: ${formData.mobile}</p>
        <p>Address: ${formData.address}</p>
        <p>Landmark: ${formData.landmark}</p>
        <h2>Test Details</h2>
        <p>Selected Tests: ${formData.selectedTests.join(', ')}</p>
        <p>Preferred Date: ${formData.date}</p>
        <p>Preferred Time: ${formData.time}</p>
        <p>Alternative Time: ${formData.alternativeTime}</p>
        <h2>Health Information</h2>
        <p>Health Issues: ${formData.healthIssues}</p>
        <p>Medications: ${formData.medications}</p>
        <p>Allergies: ${formData.allergies}</p>
      `
    }

    await sgMail.send(msg)
    
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { 
        message: 'Failed to send email', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
