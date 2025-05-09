// src/app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { createServerSupabaseClient } from '../../../lib/supabase';

// Define a type for SendGrid errors
type SendGridError = {
  response?: {
    body?: {
      errors?: Array<{ message: string }>;
    };
  };
};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    
    // Store email in Supabase
    const { error: dbError } = await supabase  // Remove "data" from destructuring
      .from('subscribers')
      .insert([{ 
        email: email.toLowerCase(),
        status: 'active',
        source: 'landing_page'
      }])
      .select();
      
    if (dbError) {
      // Handle unique constraint violation (email already exists)
      if (dbError.code === '23505') {
        console.log('Email already exists in database:', email);
        // Continue with email sending, but note it's a duplicate
      } else {
        console.error('Supabase error:', dbError);
        return NextResponse.json(
          { error: 'Error storing email' },
          { status: 500 }
        );
      }
    }

    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
    
    // User confirmation email
    const userMsg = {
      to: email,
      from: 'c8launch@cogn8solutions.com', // Verified sender
      subject: 'Thanks for your interest in Cogn8Solutions',
      text: 'We\'ve received your request to stay informed about our June 2025 launch. We\'ll keep you updated!\n\n-The Cogn8Solutions Team\n\nwww.cogn8solutions.com',
      html: '<p>We\'ve received your request to stay informed about our June 2025 launch. We\'ll keep you updated!<br><br>-The Cogn8Solutions Team<br>www.cogn8solutions.com</p>',
    };
    
    // Admin notification email
    const adminMsg = {
      to: 'dave.grice@cogn8solutions.com', // Your notification email
      from: 'c8launch@cogn8solutions.com', // Same verified sender
      subject: 'New Launch Page Signup',
      text: `New signup: ${email}`,
      html: `<p>New signup: ${email}</p><p>Status: ${dbError?.code === '23505' ? 'Duplicate' : 'New'}</p>`,
    };
    
    try {
      // First try sending user email
      await sgMail.send(userMsg);  // Remove response variable
      
      // If the first email succeeds, try sending the notification
      try {
        await sgMail.send(adminMsg);  // Remove notifyResponse variable
      } catch (notifyError: unknown) {
        // Log notification errors but don't fail the whole request
        console.error('Admin notification failed but user email sent:');
        const typedNotifyError = notifyError as SendGridError;
        if (typedNotifyError.response) {
          console.error(typedNotifyError.response.body);
        }
      }
      
      return NextResponse.json({ 
        success: true,
        duplicate: dbError?.code === '23505'
      });
    } catch (error: unknown) {
      console.error('SendGrid specific error:');
      
      const typedError = error as SendGridError;
      if (typedError.response) {
        // Get more detailed error info
        console.error(typedError.response.body);
        return NextResponse.json(
          { error: `SendGrid error: ${typedError.response.body?.errors?.[0]?.message || 'Unknown error'}` },
          { status: 500 }
        );
      }
      
      throw error; // Re-throw for outer catch
    }
  } catch (error: unknown) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}