'use client';

import { useEffect, useState } from 'react';

interface EnvStatus {
  clerk: boolean;
  supabase: boolean;
  vapi: boolean;
  sentry: boolean;
}

const EnvChecker = ({ children }: { children: React.ReactNode }) => {
  const [envStatus, setEnvStatus] = useState<EnvStatus>({
    clerk: false,
    supabase: false,
    vapi: false,
    sentry: false
  });
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkEnv = () => {
      const status: EnvStatus = {
        clerk: !!(
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder_key_for_development'
        ),
        supabase: !!(
          process.env.NEXT_PUBLIC_SUPABASE_URL && 
          process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
        ),
        vapi: !!(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN),
        sentry: !!(process.env.SENTRY_AUTH_TOKEN)
      };

      setEnvStatus(status);
      
      // Show warning if critical services are not configured
      if (!status.clerk || !status.supabase) {
        setShowWarning(true);
      }
    };

    checkEnv();
  }, []);

  if (showWarning && process.env.NODE_ENV === 'development') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🔧 Setup Required
            </h1>
            <p className="text-gray-600 mb-6">
              Please configure the required services to use the LMS application.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className={`flex items-center p-3 rounded-lg ${envStatus.clerk ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <span className="mr-3">{envStatus.clerk ? '✅' : '❌'}</span>
              <span className="font-medium">Clerk Authentication</span>
              {!envStatus.clerk && <span className="ml-auto text-sm">Required</span>}
            </div>

            <div className={`flex items-center p-3 rounded-lg ${envStatus.supabase ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <span className="mr-3">{envStatus.supabase ? '✅' : '❌'}</span>
              <span className="font-medium">Supabase Database</span>
              {!envStatus.supabase && <span className="ml-auto text-sm">Required</span>}
            </div>

            <div className={`flex items-center p-3 rounded-lg ${envStatus.vapi ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
              <span className="mr-3">{envStatus.vapi ? '✅' : '⚠️'}</span>
              <span className="font-medium">Vapi AI Voice</span>
              {!envStatus.vapi && <span className="ml-auto text-sm">Optional</span>}
            </div>

            <div className={`flex items-center p-3 rounded-lg ${envStatus.sentry ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
              <span className="mr-3">{envStatus.sentry ? '✅' : '⚠️'}</span>
              <span className="font-medium">Sentry Error Tracking</span>
              {!envStatus.sentry && <span className="ml-auto text-sm">Optional</span>}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Quick Setup:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Check the <code className="bg-blue-100 px-1 rounded">SETUP.md</code> file for detailed instructions</li>
              <li>2. Configure your <code className="bg-blue-100 px-1 rounded">.env.local</code> file</li>
              <li>3. Set up Clerk and Supabase accounts</li>
              <li>4. Restart the development server</li>
            </ol>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowWarning(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Continue Anyway (Limited Functionality)
            </button>
            <a
              href="https://github.com/yourusername/lms-saas-app/blob/main/SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              View Setup Guide
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EnvChecker;