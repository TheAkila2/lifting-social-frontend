export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-8 sm:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-6 sm:mb-8 text-black">
          Terms and Conditions
        </h1>

        <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            Welcome to <strong>Lifting Social</strong>. These Terms and Conditions govern your use of our website and the purchase and
            sale of products from our platform. By accessing and using our website, you
            agree to comply with these terms. Please read them carefully before proceeding with
            any transactions.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">1. Use of the Website</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
            By using our website, you agree to the following:
          </p>
          <ul className="list-disc list-outside ml-5 sm:ml-6 text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
            <li>You must be at least <strong>18 years old</strong> to use our website or make purchases. Users under 18 must have parental consent.</li>
            <li>
              You are responsible for maintaining the confidentiality of your account
              information, including your username and password.
            </li>
            <li>
              You agree to provide accurate and current information during the registration
              and checkout process.
            </li>
            <li>You may not use our website for any unlawful or unauthorized purposes.</li>
            <li>You may not attempt to interfere with the proper functioning of our website.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">2. Product Information and Pricing</h2>
          <ul className="list-disc list-outside ml-5 sm:ml-6 text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
            <li>
              We strive to provide accurate product descriptions, images, and pricing
              information. However, we do not guarantee the accuracy or completeness of such
              information.
            </li>
            <li>
              Prices are subject to change without notice. Any promotions or discounts are
              valid for a limited time and may be subject to additional terms and conditions.
            </li>
            <li>All prices are displayed in Sri Lankan Rupees (LKR) unless otherwise stated.</li>
            <li>We reserve the right to correct pricing errors on our website.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">3. Orders and Payments</h2>
          <ul className="list-disc list-outside ml-5 sm:ml-6 text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
            <li>
              By placing an order on our website, you are making an offer to purchase the
              selected products.
            </li>
            <li>
              We reserve the right to refuse or cancel any order for any reason, including
              but not limited to product availability, errors in pricing or product
              information, or suspected fraudulent activity.
            </li>
            <li>
              You agree to provide valid and up-to-date payment information and authorize
              us to charge the total order amount, including applicable taxes and shipping
              fees, to your chosen payment method.
            </li>
            <li>
              We use trusted third-party payment processors (Payments.lk) to handle your payment
              information securely. We do not store or have access to your full payment details.
            </li>
            <li>Payment can be made via credit/debit card or cash on delivery (COD) where available.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">4. Shipping and Delivery</h2>
          <ul className="list-disc list-outside ml-5 sm:ml-6 text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
            <li>
              We will make reasonable efforts to ensure timely shipping and delivery of
              your orders.
            </li>
            <li>
              Shipping and delivery times provided are estimates and may vary based on your
              location and other factors beyond our control.
            </li>
            <li>We are not responsible for delays caused by courier services or customs clearance.</li>
            <li>You must provide accurate shipping information. We are not responsible for orders shipped to incorrect addresses provided by you.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">5. Returns and Refunds</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            Our Returns and Refund Policy governs the process and conditions for
            returning products and seeking refunds. Please refer to our <a href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</a> page for more information.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">6. Intellectual Property</h2>
          <ul className="list-disc list-outside ml-5 sm:ml-6 text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
            <li>
              All content and materials on our website, including but not limited to text,
              images, logos, graphics, videos, and training content are protected by intellectual property rights and
              are the property of <strong>Lifting Social</strong> or its licensors.
            </li>
            <li>
              You may not use, reproduce, distribute, or modify any content from our
              website without our prior written consent.
            </li>
            <li>User-generated content (reviews, comments) remains your property but you grant us a license to use it.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">7. User Accounts</h2>
          <ul className="list-disc list-outside ml-5 sm:ml-6 text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
            <li>You are responsible for maintaining the security of your account.</li>
            <li>You must not share your account credentials with others.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">8. Limitation of Liability</h2>
          <ul className="list-disc list-outside ml-5 sm:ml-6 text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 space-y-1.5 sm:space-y-2">
            <li>
              In no event shall <strong>Lifting Social</strong>, its directors, employees, or affiliates be liable for any direct, indirect,
              incidental, special, or consequential damages arising out of or in connection with
              your use of our website or the purchase and use of our products.
            </li>
            <li>
              We make no warranties or representations, express or implied, regarding the
              quality, accuracy, or suitability of the products offered on our website.
            </li>
            <li>Our total liability to you for any claim shall not exceed the amount you paid for the product or service.</li>
            <li>We are not responsible for injuries resulting from improper use of weightlifting equipment or nutritional supplements.</li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">9. Indemnification</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            You agree to indemnify and hold harmless Lifting Social and its affiliates from any claims, damages, losses, or expenses arising from your violation of these Terms and Conditions or your use of our website.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">10. Third-Party Links</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of these external sites. Your use of third-party websites is at your own risk.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">11. Governing Law</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            These Terms and Conditions shall be governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">12. Amendments and Termination</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            We reserve the right to modify, update, or terminate these Terms and Conditions
            at any time without prior notice. It is your responsibility to review these
            terms periodically for any changes. Continued use of our website after changes constitutes acceptance of the modified terms.
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-black mt-6 sm:mt-8 mb-3 sm:mb-4">13. Contact Information</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
            If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
          </p>
          <ul className="list-none text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 space-y-1.5 sm:space-y-2">
            <li><strong>Email:</strong> theliftingsocial@gmail.com</li>
            <li><strong>Phone:</strong> +94 76 482 9645</li>
            <li><strong>Address:</strong> Lifting Social, Colombo, Sri Lanka</li>
          </ul>

          <p className="text-sm text-gray-500 italic mt-8 pt-6 border-t border-gray-200">
            Last updated: February 10, 2026
          </p>
        </div>
      </div>
    </div>
  )
}
