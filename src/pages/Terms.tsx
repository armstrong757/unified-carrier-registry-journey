
const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            TERMS & CONDITIONS
          </h1>
          <p className="text-sm text-gray-600 text-center mb-8">
            Updated: February 15th, 2025
          </p>
          
          <div className="prose prose-sm max-w-none">
            <p className="mb-6">
              Welcome to the DOT HUB website and services. The following terms and conditions ("Terms"), along with our Privacy Policy, Refund Policy and any linked agreements, govern your access to and use of the website, including any content, features, and services offered through it. By accessing or using the website, you agree to be bound by these Terms. Please carefully review these Terms before using the website.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">1. Consent and Agreement</h2>
            <p className="mb-4">
              By accessing or using the DOT HUB website, you agree to abide by these Terms, our Privacy Policy, and all applicable laws and regulations. If you do not agree to these Terms, you are not authorized to use the website. DOT HUB may update these Terms at any time, and your continued use of the website constitutes acceptance of the revised Terms.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">2. Eligibility and Responsibility</h2>
            <p className="mb-4">
              The website is intended for users aged eighteen (18) or older. By using the website, you represent that you are of legal age and meet all eligibility requirements. You are responsible for ensuring that anyone accessing the website through your account complies with these Terms.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">3. Reservation of Rights</h2>
            <p className="mb-4">
              DOT HUB reserves the right to modify or discontinue the website or any services provided on it without prior notice. DOT HUB may also restrict access to certain parts of the website as needed.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">4. Services</h2>
            <p className="mb-2">DOT HUB provides a range of services to its customers, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Unified Carrier Registration services for trucking companies, brokers, leasing companies, and freight forwarders operating in multiple states.</li>
              <li>Reviewing and confirming compliance with Federal Motor Carrier Safety regulations, including MCS-150 / Biennial Update, UCR / Unified Carrier Registration, and BOC-3 / Processing Agents.</li>
            </ul>

            {/* Continue with remaining sections */}
            <h2 className="text-lg font-semibold mt-6 mb-3">5. Orders</h2>
            <p className="mb-4">
              Customers can place orders for registration and filing services through the Website or LiveChat communication portal. Customers are responsible for providing accurate and complete information. DOT HUB will use and store this information in accordance with its privacy policy. DOT HUB relies on the accuracy of the information provided by the customer and is not liable for damages arising from incorrect or incomplete information.
            </p>

            {/* ... Additional sections 6-25 following the same pattern ... */}
            
            <p className="mt-8 text-sm text-gray-600">
              If you have questions about these Terms, contact DOT HUB at hello@DOTHUB.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
