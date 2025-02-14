import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
const MCS150Filing = () => {
  const [dotNumber, setDotNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dotNumber.trim()) return;
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('fetch-usdot-info', {
        body: {
          dotNumber: dotNumber.trim()
        }
      });
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to fetch DOT information');
      }
      if (!data) {
        throw new Error('No data returned from USDOT lookup');
      }
      console.log('USDOT data received:', data);
      sessionStorage.setItem('usdotData', JSON.stringify(data));
      navigate("/mcs150", {
        state: {
          usdotData: data
        }
      });
    } catch (error: any) {
      console.error('Error fetching USDOT info:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch DOT information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-[16px]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-8 mb-16">
          <h1 className="font-bold text-[#1A1F2C] mb-8 py-0 my-[30px] text-3xl">MCS-150 / Biennial Update</h1>
          
          <Card className="max-w-md mx-auto p-8 bg-white shadow-lg border-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-center mb-6">Enter DOT Number To Start</h2>
              <Input type="text" placeholder="Enter USDOT Number here" value={dotNumber} onChange={e => setDotNumber(e.target.value)} className="w-full text-lg py-6" disabled={isLoading} />
              <div className="flex justify-center">
                <Button type="submit" className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 text-lg px-8" disabled={isLoading}>
                  {isLoading ? "Loading..." : "GET STARTED"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-[#1A1F2C] mb-4">Table of Contents</h2>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
            <a href="#what-is-mcs150" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={e => {
            e.preventDefault();
            document.querySelector('#what-is-mcs150')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
            setTimeout(() => {
              window.scrollBy(0, -20);
            }, 800);
          }}>
              What is an MCS-150?
            </a>
            <a href="#consequences" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={e => {
            e.preventDefault();
            document.querySelector('#consequences')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
            setTimeout(() => {
              window.scrollBy(0, -20);
            }, 800);
          }}>
              Non-Compliance Penalties
            </a>
            <a href="#filing-requirements" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={e => {
            e.preventDefault();
            document.querySelector('#filing-requirements')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
            setTimeout(() => {
              window.scrollBy(0, -20);
            }, 800);
          }}>
              Filing Requirements
            </a>
            <a href="#when-to-file" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={e => {
            e.preventDefault();
            document.querySelector('#when-to-file')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
            setTimeout(() => {
              window.scrollBy(0, -20);
            }, 800);
          }}>
              When Must You File?
            </a>
            <a href="#fee-structure" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={e => {
            e.preventDefault();
            document.querySelector('#fee-structure')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
            setTimeout(() => {
              window.scrollBy(0, -20);
            }, 800);
          }}>
              Fee Structure
            </a>
          </nav>
        </div>

        <div className="space-y-8">
          <section id="what-is-mcs150" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-600 mb-6">What is an MCS-150?</h2>
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
            <h2 className="text-2xl font-bold text-gray-600 mb-6">Non-Compliance Penalties</h2>
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
          </section>

          <section id="filing-requirements" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-600 mb-6">Filing Requirements</h2>
            <p className="text-gray-600 mb-6">You must file an MCS-150 update within 30 days when making changes in any of these categories:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-4">Company Info Changes</h3>
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
                  <li>Making any other significant business changes</li>
                  <li>Reapplying after new entrant revocation</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="when-to-file" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-600 mb-6">When Must You File?</h2>
            
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
          </section>

          <section id="fee-structure" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-600 mb-6">Fee Structure</h2>
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
        </div>

        <div className="text-center mt-20">
          <div className="mb-[150px]">
            <Button onClick={scrollToTop} className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 px-8 text-lg">
              File Your MCS-150
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-[150px]">
          <p className="text-[#8E9196] text-xs">This website is not affiliated with the Federal Motor Carrier Safety Administration (FMCSA). Itis operated by a private company that provides a registration service for an additional fee. You are not required to use this site to register your MCS-150. You may file directly with the FMCSA at www.fmcsa.dot.gov.</p>
        </div>
      </div>
    </div>;
};
export default MCS150Filing;