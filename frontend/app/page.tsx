'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      {/* Container Kartu Utama - Meniru max-w-4xl dan shadow-lg dari Register */}
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-10 text-center border-t-4 border-orange-500">
        
        {/* Header - Mengikuti gaya warna orange-500 */}
        <h1 className="text-4xl font-extrabold text-orange-500 mb-4">
          Proposal Approval System
        </h1>
        
        {/* Subtitle - Mengikuti gaya text-gray-600 */}
        <p className="text-gray-600 text-lg mb-10">
          Welcome to the Relawan Jurnal Indonesia portal. 
          Manage your institution registration and journal approvals in less than a minute.
        </p>

        {/* Action Area */}
        <div className="space-y-4">
          <Link 
            href="/register" 
            className="block w-full py-4 bg-orange-500 text-white rounded-md font-bold text-lg hover:bg-orange-600 transition-colors shadow-md"
          >
            GET STARTED
          </Link>
          
          <p className="text-sm text-gray-400">
            By continuing, you agree to our terms and conditions.
          </p>
        </div>

        {/* Dekorasi Tambahan agar tidak sepi */}
        <div className="mt-12 flex justify-center gap-8 text-gray-400 text-sm">
          <div className="flex flex-col items-center">
            <span className="font-bold text-orange-400">Step 1</span>
            <span>Account</span>
          </div>
          <div className="h-10 w-px bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-orange-400">Step 2</span>
            <span>Institution</span>
          </div>
          <div className="h-10 w-px bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-orange-400">Step 3</span>
            <span>Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}