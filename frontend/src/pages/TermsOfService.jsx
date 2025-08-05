import LegalLayout from '../layouts/LegalLayout'

export default function TermsOfService({ setContactOpen }) {
  return (
    <LegalLayout title="Terms of Service">
      <div className="space-y-8 text-gray-700">
        <p className="text-lg leading-relaxed">
          By using our services, you agree to comply with the following terms and conditions.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">1. Use of Service</h2>
          <p className="leading-relaxed">
            You agree to use our services only for lawful purposes and in accordance with these
            terms. You are responsible for your activity on the platform, including any content you
            generate, share, or upload.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">2. User Content</h2>
          <p className="leading-relaxed">
            You retain rights to the content you create but grant us a license to store and process
            it as necessary to provide our services. You are responsible for ensuring that your
            content does not violate any applicable laws or third-party rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">3. Prohibited Actions</h2>
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            <li>Using the service for illegal purposes</li>
            <li>Attempting to hack, disrupt, or overload our systems</li>
            <li>Generating content that violates intellectual property rights</li>
            <li>Engaging in harassment, abuse, or harmful activity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">4. Changes to Terms</h2>
          <p className="leading-relaxed">
            We may update these terms from time to time. Continued use of our services constitutes
            acceptance of the updated terms. You are encouraged to review this page periodically for
            the latest information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">5. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about these Terms of Service, contact us at
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
