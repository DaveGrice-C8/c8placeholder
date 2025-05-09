// src/app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Log environment variables (safely)
    console.log('API Key defined:', !!process.env.SENDGRID_API_KEY);
    
    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
    
    // User confirmation email
    const userMsg = {
      to: email,
      from: 'c8launch@cogn8solutions.com', // Verified sender
      subject: 'Thanks for your interest in Cogn8Solutions',
      text: 'We\'ve received your request to stay informed about our June 2025 launch. We\'ll keep you updated!',
      html: '<p>We\'ve received your request to stay informed about our June 2025 launch. We\'ll keep you updated!</p>',
    };
    
    // Admin notification email
    const adminMsg = {
      to: 'dave.grice@cogn8solutions.com', // Your notification email
      from: 'c8launch@cogn8solutions.com', // Same verified sender
      subject: 'New Launch Page Signup',
      text: `New signup: ${email}`,
      html: `<p>New signup: ${email}</p>`,
    };
    
    console.log('Attempting to send confirmation to:', email);
    console.log('And notification to: dave.grice@cogn8solutions.com');
    
    try {
      // First try sending just one email to test
      const response = await sgMail.send(userMsg);
      console.log('User confirmation sent:', response);
      
      // If the first email succeeds, try sending the notification
      try {
        const notifyResponse = await sgMail.send(adminMsg);
        console.log('Admin notification sent:', notifyResponse);
      } catch (notifyError: any) {
        // Log notification errors but don't fail the whole request
        console.error('Admin notification failed but user email sent:');
        if (notifyError.response) {
          console.error(notifyError.response.body);
        }
      }
      
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('SendGrid specific error:');
      
      if (error.response) {
        // Get more detailed error info
        console.error(error.response.body);
        return NextResponse.json(
          { error: `SendGrid error: ${error.response.body.errors?.[0]?.message || 'Unknown error'}` },
          { status: 500 }
        );
      }
      
      throw error; // Re-throw for outer catch
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: 'Error sending email' },
      { status: 500 }
    );
  }
}