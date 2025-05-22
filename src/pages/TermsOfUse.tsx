
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="mb-4">Last updated: May 20, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Color Grid Logic, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily access and use the game for personal, non-commercial transitory viewing only. 
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained in Color Grid Logic</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          <p className="mb-4">
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by Color Grid Logic at any time.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. 
            Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the service.
          </p>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. 
            You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Contact</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Use, please contact us at: <a href="mailto:ssnow@sterneschool.org" className="text-blue-600 hover:underline">ssnow@sterneschool.org</a>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfUse;
