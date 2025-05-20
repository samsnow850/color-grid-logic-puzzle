
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="mb-4">Last updated: May 20, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Color Grid Logic. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. The Data We Collect About You</h2>
          <p className="mb-4">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Identity Data: includes username or similar identifier.</li>
            <li>Contact Data: includes email address.</li>
            <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting and location, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li>Profile Data: includes your username and password, game progress, preferences, feedback, and survey responses.</li>
            <li>Usage Data: includes information about how you use our website and game.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Personal Data</h2>
          <p className="mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>To register you as a new player.</li>
            <li>To manage our relationship with you.</li>
            <li>To enable you to participate in leaderboard features.</li>
            <li>To administer and protect our website and game.</li>
            <li>To deliver relevant content and advertisements to you.</li>
            <li>To use data analytics to improve our website, game, marketing, customer relationships and experiences.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Contact</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:ssnow@sterneschool.org" className="text-blue-600 hover:underline">ssnow@sterneschool.org</a>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
