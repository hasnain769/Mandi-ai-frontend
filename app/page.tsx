'use client';

import { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('+92 ');
  const [verificationId, setVerificationId] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'normal',
          callback: () => {
            // reCAPTCHA solved
          },
        });
      }

      const appVerifier = window.recaptchaVerifier;
      // Format phone number if needed, e.g., +92...
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      // @ts-ignore
      window.confirmationResult = confirmationResult;
      setVerificationId(confirmationResult.verificationId);
      setStep('OTP');
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      const confirmationResult = window.confirmationResult;
      await confirmationResult.confirm(otp);

      // Post-Login: Check if user exists in Backend, if not, Register them.
      try {
        const loginRes = await api.auth.login(phoneNumber);
        if (loginRes.status === 'not_found') {
          // Register User
          await api.auth.register(phoneNumber);
        }
      } catch (e) {
        console.error("Backend Sync Failed:", e);
        // Proceed anyway? Or block? For now proceed.
      }

      router.push('/dashboard');
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-black relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>

      {/* Glass Card */}
      <div className="relative bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-white/20">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-100 p-3 rounded-full mb-3">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mandi AI</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your inventory with voice.</p>
        </div>

        {step === 'PHONE' ? (
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  className="w-full p-3 pl-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 font-medium"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div id="recaptcha-container" className="flex justify-center"></div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transform transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : "Send Verification Code"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="text-center mb-2">
              <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-md font-medium">OTP Sent to {phoneNumber}</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Enter Code</label>
              <input
                type="text"
                placeholder="123456"
                className="w-full p-3 text-center text-2xl tracking-widest bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 font-bold"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transform transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              onClick={() => setStep('PHONE')}
              className="text-sm text-gray-400 hover:text-emerald-600 transition-colors font-medium"
            >
              Change Phone Number
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center items-center gap-1.5 opacity-60">
          <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">Powered by Gemini 2.5</span>
        </div>
      </div>
    </div>
  );
}

// Add global types for window
declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}
