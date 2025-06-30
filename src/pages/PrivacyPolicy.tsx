
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:text-blue-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-300 text-lg">
            Last updated: June 30, 2025
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border-white/10 rounded-lg p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              This Privacy Policy describes how Facing Fentanyl Now ("we," "our," or "us") collects, uses, and protects your information when you use our website and services related to National Fentanyl Prevention and Awareness Day.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-blue-300 mb-2">Personal Information</h3>
                <p className="text-gray-300 leading-relaxed">
                  We collect your email address when you sign up for awareness day reminders. This is the only personal information we directly collect from you.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-blue-300 mb-2">Usage Information</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may collect information about how you interact with our website, including pages visited and actions taken, to improve our services.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc list-inside">
              <li>To send you reminder emails about National Fentanyl Prevention and Awareness Day</li>
              <li>To provide you with information about fentanyl awareness and prevention</li>
              <li>To improve our website and services</li>
              <li>To respond to your inquiries and provide customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Storage and Security</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Your email address is securely stored using Supabase, a trusted cloud database provider. We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We retain your email address only as long as necessary to provide our services and send awareness reminders. You may request deletion of your information at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-blue-300 mb-2">Social Media Integration</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our website includes Facebook SDK and social sharing features. When you use these features, you may be sharing information with these platforms according to their own privacy policies.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-blue-300 mb-2">Email Services</h3>
                <p className="text-gray-300 leading-relaxed">
                  We use Resend for email delivery services. Your email address may be processed by Resend according to their privacy policy.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Your Rights and Choices</h2>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc list-inside">
              <li>You can unsubscribe from our emails at any time by clicking the unsubscribe link in any email</li>
              <li>You can request access to the personal information we have about you</li>
              <li>You can request correction or deletion of your personal information</li>
              <li>You can opt out of certain communications while still receiving important awareness reminders</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">International Users</h2>
            <p className="text-gray-300 leading-relaxed">
              If you are located outside the United States, please be aware that information we collect will be transferred to and processed in the United States. By using our services, you consent to this transfer and processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibred text-white mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us through the official Facing Fentanyl Now website at{" "}
              <a 
                href="https://facingfentanylnow.org" 
                className="text-blue-300 hover:text-blue-200 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                facingfentanylnow.org
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
