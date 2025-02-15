import { Button } from "@/components/ui/button";

interface ContentSectionsProps {
  onScrollToTop: () => void;
}

export const ContentSections = ({ onScrollToTop }: ContentSectionsProps) => {
  return (
    <div className="space-y-8">
      <section id="what-is-mcs150" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-600 mb-6 font-semibold">What is an MCS-150?</h2>
        <p className="text-gray-600 leading-relaxed">
          The MCS-150 is a required form from the Federal Motor Carrier Safety Administration (FMCSA) for obtaining or renewing your USDOT number. This form collects essential data about your trucking business for safety purposes and is used to:
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-3 mt-4">
          <li>Calculate safety scores through the Compliance, Safety, Accountability (CSA) program</li>
          <li>Monitor compliance with Federal Motor Carrier Safety Regulations (FMCSR)</li>
          <li>Track Hazardous Materials Regulations (HMR) compliance</li>
          <li>Maintain accurate carrier information in federal databases</li>
        </ul>
      </section>

      <section id="consequences" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Non-Compliance Penalties</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-600">Penalties</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Fines up to $1,000 per day</li>
              <li>Maximum penalty of $10,000</li>
              <li>USDOT number deactivation</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-600">Impact on Operations</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Potential shutdown of operations</li>
              <li>Loss of operating authority</li>
              <li>Inability to conduct interstate commerce</li>
              <li>Possible contract losses</li>
              <li>Compliance issues with insurance providers</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="filing-requirements" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Filing Requirements</h2>
        <p className="text-gray-600 mb-6">You must file an MCS-150 update within 30 days when making changes in any of these categories:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-600">Company Info Changes</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Changing your address, phone, or email</li>
              <li>Changing your company name</li>
              <li>Changing company ownership</li>
              <li>Ceasing operations</li>
              <li>Reactivating a DOT number</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-600 mb-4">Operational Changes</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Modifying your operating authority</li>
              <li>Modifying your number of power units</li>
              <li>Adding or reducing fleet vehicles</li>
              <li>Adding or reducing number of drivers</li>
              <li>Becoming a hazardous materials carrier</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-600 mb-4">Additional Filing Triggers</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Every two years for required Biennial Update</li>
              <li>Making any other significant business changes</li>
              <li>Reapplying after new entrant revocation</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="when-to-file" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-600 mb-6 font-semibold">When Must You File?</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-600">Regular Biennial Updates</h3>
            <p className="text-gray-600 mb-4">Your filing schedule is determined by your USDOT number:</p>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium mb-2">The second-to-last digit determines the year:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Odd number: File in odd-numbered years</li>
                  <li>Even number: File in even-numbered years</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <p className="font-medium mb-2">The last digit determines the month:</p>
                <div className="block sm:grid sm:grid-cols-3 sm:gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-600">1 - January</p>
                    <p className="text-gray-600">2 - February</p>
                    <p className="text-gray-600">3 - March</p>
                    <p className="text-gray-600">4 - April</p>
                  </div>
                  <div className="space-y-2 mt-2 sm:mt-0">
                    <p className="text-gray-600">5 - May</p>
                    <p className="text-gray-600">6 - June</p>
                    <p className="text-gray-600">7 - July</p>
                    <p className="text-gray-600">8 - August</p>
                  </div>
                  <div className="space-y-2 mt-2 sm:mt-0">
                    <p className="text-gray-600">9 - September</p>
                    <p className="text-gray-600">0 - October</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-600">Special Situations</h3>
            
            <div>
              <h4 className="font-semibold text-[#1A1F2C] mb-2">New Businesses</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Must file initial MCS-150 before beginning operations</li>
                <li>Required to file biennial update on schedule even if recently opened</li>
                <li>May need to file first update sooner than two years after opening</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#1A1F2C] mb-2">Inactive or Closed Businesses</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Must still file if ceased interstate operations</li>
                <li>Required to notify FMCSA if no longer in business</li>
                <li>Failure to report closure can result in continued obligations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#1A1F2C] mb-2">DOT Number Reactivation</h4>
              <p className="text-gray-600 mb-2">If your DOT number becomes inactive due to missed updates:</p>
              <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                <li>Complete a new MCS-150 form</li>
                <li>Sign and submit to FMCSA</li>
                <li>Wait for processing and reactivation</li>
                <li>Resume operations only after confirmation</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="fee-structure" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Fee Structure</h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-100">
            <p className="text-gray-600 mb-4 text-base">
              Our service fee is a simple, flat rate of <span className="font-semibold">$149</span> for all MCS-150 filings, regardless of:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Filing reason (biennial update, reactivation, or changes)</li>
              <li>Company size or fleet size</li>
              <li>Type of operation</li>
              <li>Filing frequency</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="text-center mt-20">
        <div className="mb-[150px]">
          <Button onClick={onScrollToTop} className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 px-8 text-lg">
            File Your MCS-150
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-[150px]">
        <p className="text-[#8E9196] text-xs">
          This website is not affiliated with the Federal Motor Carrier Safety Administration (FMCSA). It is operated by a private company that provides a registration service for an additional fee. You are not required to use this site to register your MCS-150. You may file directly with the FMCSA at www.fmcsa.dot.gov.
        </p>
      </div>
    </div>
  );
};
