import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const GOOGLE_CLIENT_ID = '1037712146378-4o732l7sfn12f0do4jdb0c40j863grce.apps.googleusercontent.com';

export function LoginView() {
  const { login } = useAuth();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        login(credentialResponse.credential);
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">App Expenses</h1>
            <p className="text-gray-600">Manage your group expenses efficiently</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="outline"
                size="large"
                text="signin_with"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue as guest</span>
              </div>
            </div>

            <Button
              onClick={() => {
                // Guest mode: create dummy JWT token
                const guestToken = btoa(
                  JSON.stringify({
                    sub: 'guest_' + Date.now(),
                    email: 'guest@local',
                    name: 'Guest User',
                  })
                );
                login(guestToken);
              }}
              variant="secondary"
              className="w-full"
            >
              Continue as Guest
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}
