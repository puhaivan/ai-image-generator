import LegalLayout from '../layouts/LegalLayout'

export default function PrivacyPolicy({ setContactOpen }) {
  return (
    <LegalLayout title="Privacy Policy">
      <div className="space-y-8 text-gray-700">
        <p className="text-lg leading-relaxed">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and
          protect your information when you use our services.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">1. Information We Collect</h2>
          <p className="leading-relaxed">
            We collect information you provide directly, such as account details, and information
            generated during your use of our services, including logs and analytics. This may
            include usage data, device information, and other data that helps us improve your
            experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">2. How We Use Information</h2>
          <p className="leading-relaxed">
            We use the information to provide, maintain, and improve our services, communicate with
            you, and ensure security and compliance. This includes sending account notifications,
            enhancing product functionality, and preventing fraudulent activity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">3. Data Protection</h2>
          <p className="leading-relaxed">
            We implement industry-standard security measures to protect your personal data from
            unauthorized access, disclosure, or destruction. While no system can guarantee absolute
            security, we actively monitor and improve our security practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">4. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, contact us at
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="ml-1 text-purple-600 font-medium underline hover:text-purple-700 transition"
            >
              unsaightly@gmail.com
            </button>
            . We aim to respond to all inquiries within 48 hours.
          </p>
        </section>
      </div>
    </LegalLayout>
  )
}
