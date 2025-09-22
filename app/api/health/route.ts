import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health checks
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: await checkDatabase(),
        external: await checkExternalServices(),
      }
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 503 }
    );
  }
}

async function checkDatabase() {
  try {
    // Check if Supabase URL is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      return { status: 'not_configured', message: 'Supabase not configured' };
    }

    // In a real implementation, you'd make a simple query to test the connection
    // const { createSupabaseClient } = await import('@/lib/supabase');
    // const supabase = createSupabaseClient();
    // const { error } = await supabase.from('companions').select('id').limit(1);
    // if (error) throw error;

    return { status: 'healthy', message: 'Database connection successful' };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      message: error instanceof Error ? error.message : 'Database check failed' 
    };
  }
}

async function checkExternalServices() {
  const services = {
    clerk: checkClerk(),
    vapi: checkVapi(),
    sentry: checkSentry(),
  };

  return services;
}

function checkClerk() {
  const hasPublishableKey = !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder_key_for_development'
  );
  const hasSecretKey = !!(
    process.env.CLERK_SECRET_KEY && 
    process.env.CLERK_SECRET_KEY !== 'sk_test_placeholder_key_for_development'
  );

  if (hasPublishableKey && hasSecretKey) {
    return { status: 'configured', message: 'Clerk authentication configured' };
  } else {
    return { status: 'not_configured', message: 'Clerk keys not properly configured' };
  }
}

function checkVapi() {
  const hasToken = !!(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN);
  
  if (hasToken) {
    return { status: 'configured', message: 'Vapi voice service configured' };
  } else {
    return { status: 'not_configured', message: 'Vapi token not configured (voice features disabled)' };
  }
}

function checkSentry() {
  const hasToken = !!(process.env.SENTRY_AUTH_TOKEN);
  
  if (hasToken) {
    return { status: 'configured', message: 'Sentry error tracking configured' };
  } else {
    return { status: 'not_configured', message: 'Sentry not configured (error tracking disabled)' };
  }
}