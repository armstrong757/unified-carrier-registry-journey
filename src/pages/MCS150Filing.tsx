import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MCS150Filing = () => {
  const [dotNumber, setDotNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dotNumber.trim()) {
      navigate("/mcs150");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-[#1A1F2C] mb-8">MCS-150 / Biennial Update</h1>
          
          <Card className="max-w-md mx-auto p-8 bg-white shadow-lg border-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-center mb-6">Enter DOT Number To Start</h2>
              <Input
                type="text"
                placeholder="Enter USDOT Number here"
                value={dotNumber}
                onChange={(e) => setDotNumber(e.target.value)}
                className="w-full text-lg py-6"
              />
              <div className="flex justify-center">
                <Button type="submit" className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 text-lg px-8">
                  GET STARTED
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <section className="space-y-12 bg-[#edf7ff]/50 p-4 sm:p-8 rounded-xl shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">What is an MCS-150?</h2>
            <p className="text-gray-600 leading-relaxed">
              The MCS-150 is a required form from the Federal Motor Carrier Safety Administration (FMCSA) for obtaining or renewing your USDOT number. This form collects essential data about your trucking business for safety purposes and is used to:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-3 mt-4">
              <li>Calculate safety scores through the Compliance, Safety, Accountability (CSA) program</li>
              <li>Monitor compliance with Federal Motor Carrier Safety Regulations (FMCSR)</li>
              <li>Track Hazardous Materials Regulations (HMR) compliance</li>
              <li>Maintain accurate carrier information in federal databases</li>
            </ul>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Consequences of Non-Compliance</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1F2C] mb-4">Penalties</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-3">
                  <li>Fines up to $1,000 per day</li>
                  <li>Maximum penalty of $10,000</li>
                  <li>USDOT number deactivation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1A1F2C] mb-4">Impact on Operations</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-3">
                  <li>Potential shutdown of operations</li>
                  <li>Loss of operating authority</li>
                  <li>Inability to conduct interstate commerce</li>
                  <li>Possible contract losses</li>
                  <li>Compliance issues with insurance providers</li>
                </ul>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Additional Filing Requirements</h2>
            <p className="text-gray-600 mb-4">You must also file an MCS-150 update within 30 days when:</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Changing your contact information (address, phone, email)</li>
              <li>Changing your company name</li>
              <li>Modifying your operating authority</li>
              <li>Modifying your number of power units</li>
              <li>Reapplying after new entrant revocation</li>
              <li>Becoming a hazardous materials carrier</li>
              <li>Adding or reducing fleet vehicles</li>
              <li>Making any other significant business changes</li>
              <li>Ceasing operations</li>
              <li>Reactivating a DOT number</li>
              <li>Changing company ownership</li>
              <li>Adding or reducing number of drivers</li>
            </ul>
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">When Must You File?</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1F2C] mb-4">Regular Biennial Updates</h3>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-600">1 - January</p>
                        <p className="text-gray-600">2 - February</p>
                        <p className="text-gray-600">3 - March</p>
                        <p className="text-gray-600">4 - April</p>
                      </div>
                      <div>
                        <p className="text-gray-600">5 - May</p>
                        <p className="text-gray-600">6 - June</p>
                        <p className="text-gray-600">7 - July</p>
                        <p className="text-gray-600">8 - August</p>
                      </div>
                      <div>
                        <p className="text-gray-600">9 - September</p>
                        <p className="text-gray-600">0 - October</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#1A1F2C] mb-4">Special Situations</h3>
                
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
          </div>
        </section>

        <div className="text-center mt-20">
          <Button 
            onClick={scrollToTop}
            className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 px-8 text-lg"
          >
            File Your MCS-150
          </Button>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#8E9196] text-xs">
            This website is not affiliated with the Federal Motor Carrier Safety Administration (FMCSA). This website is operated by a private company that provides a private registration service for an additional fee. You are not required to use this site to register your MCS-150. You may file directly with the FMCSA at www.fmcsa.dot.gov.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MCS150Filing;
