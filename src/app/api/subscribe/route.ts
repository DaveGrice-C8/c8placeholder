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

    // Initialize database status tracking variables
    let databaseSuccess = false;
    let isDuplicate = false;

    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    console.log('Supabase client initialized with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ exists' : '✗ missing');
    console.log('Supabase service role key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ exists' : '✗ missing');

    try {
      console.log('Attempting to store email in Supabase:', email);
      
      // Store email in Supabase
      const { data, error: dbError } = await supabase
        .from('subscribers')
        .insert([{ 
          email: email.toLowerCase(),
          status: 'active',
          source: 'landing_page'
        }])
        .select();
      
      console.log('Supabase insert response - data:', data);
      console.log('Supabase insert response - error:', dbError);
        
      if (dbError) {
        // Handle unique constraint violation (email already exists)
        if (dbError.code === '23505') {
          console.log('Email already exists in database:', email);
          isDuplicate = true;
          // Continue with email sending, but note it's a duplicate
        } else {
          console.error('Supabase error details:', {
            code: dbError.code,
            message: dbError.message,
            details: dbError.details,
            hint: dbError.hint
          });
          return NextResponse.json(
            { error: `Error storing email: ${dbError.message}` },
            { status: 500 }
          );
        }
      } else {
        console.log('Successfully stored email in Supabase');
        databaseSuccess = true;
      }
    } catch (supabaseError) {
      console.error('Unexpected Supabase error:', supabaseError);
      // Continue with email sending despite database error
    }

    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
    
    // User confirmation email
    const userMsg = {
      to: email,
      from: 'c8launch@cogn8solutions.com', // Verified sender
      templateId: 'd-7ea616e14ec04f3580d5761fa56ceb44',
      dynamic_template_data: {
        email: email
      }
    };
    
    // Admin notification email
    const adminMsg = {
      to: 'dave.grice@cogn8solutions.com', // Your notification email
      from: 'c8launch@cogn8solutions.com', // Same verified sender
      subject: 'New Launch Page Signup',
      text: `New signup: ${email}`,
      html: `<p>New signup: ${email}</p><p>Status: ${isDuplicate ? 'Duplicate' : 'New'}</p>`,
    };
    
    try {
      // First try sending user email
      await sgMail.send(userMsg);
      
      // If the first email succeeds, try sending the notification
      try {
        await sgMail.send(adminMsg);
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
        database_success: databaseSuccess,
        duplicate: isDuplicate
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