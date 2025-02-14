import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
const UCRFiling = () => {
  const [dotNumber, setDotNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dotNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a DOT number",
        variant: "destructive"
      });
      return;
    }
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
      if (error) throw error;
      sessionStorage.setItem('usdotData', JSON.stringify(data));
      navigate("/ucr");
    } catch (error) {
      console.error('Error fetching USDOT info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch DOT information. Please try again.",
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
          <h1 className="font-bold text-[#1A1F2C] mb-8 text-3xl my-[30px]">UCR Registration</h1>
          
          <Card className="max-w-md mx-auto p-8 bg-white shadow-lg border-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold text-center mb-6">Enter DOT Number To Start</h2>
              <Input type="text" placeholder="Enter USDOT Number here" value={dotNumber} onChange={e => setDotNumber(e.target.value)} className="w-full text-lg py-6" disabled={isLoading} />
              <div className="flex justify-center">
                <Button type="submit" className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 text-lg px-8" disabled={isLoading}>
                  {isLoading ? "LOADING..." : "GET STARTED"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-600">Table of Contents</h2>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
            <a href="#what-is-ucr" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={e => {
            e.preventDefault();
            document.querySelector('#what-is-ucr')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
            setTimeout(() => {
              window.scrollBy(0, -20);
            }, 800);
          }}>
              What is UCR?
            </a>
            <a href="#who-needs" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={e => {
            e.preventDefault();
            document.querySelector('#who-needs')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
            setTimeout(() => {
              window.scrollBy(0, -20);
            }, 800);
          }}>
              Who Needs to Register?
            </a>
            <a href="#penalties" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={e => {
            e.preventDefault();
            document.querySelector('#penalties')?.scrollIntoView({
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
            <a href="#participating-states" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={e => {
            e.preventDefault();
            document.querySelector('#participating-states')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
            setTimeout(() => {
              window.scrollBy(0, -20);
            }, 800);
          }}>
              Participating States
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
          <section id="what-is-ucr" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl text-gray-600 mb-6 font-semibold">What is UCR?</h2>
            <p className="text-gray-600 leading-relaxed">
              The Unified Carrier Registration (UCR) is a federally mandated program established in 2005 that requires motor carriers and businesses engaged in interstate commerce to register and pay annual fees. This program applies to all companies with an active USDOT number that transport goods across state lines.
            </p>
          </section>

          <section id="who-needs" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Who Needs to Register?</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Operate commercial motor vehicles in interstate commerce</li>
              <li>Are a motor carrier (private, exempt, or for-hire)</li>
              <li>Work as a broker, freight forwarder, or leasing company</li>
              <li>Cross state lines for business, even occasionally</li>
              <li>Operate from a non-participating state but drive into participating states</li>
            </ul>
          </section>

          <section id="penalties" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Non-Compliance Penalties</h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-3">
              <li>Fines ranging from $100 to $5,000</li>
              <li>Vehicle detention or impoundment</li>
              <li>Potential suspension of operating authority</li>
              <li>Removal from road operations</li>
            </ul>
          </section>

          <section id="participating-states" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Participating States</h2>
            <p className="text-gray-600 mb-4">Currently, 41 U.S. states participate in the UCR program</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#1A1F2C] mb-3">Non-participating states:</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Arizona</li>
                <li>District of Columbia</li>
                <li>Florida</li>
                <li>Hawaii</li>
                <li>Maryland</li>
                <li>New Jersey</li>
                <li>Nevada</li>
                <li>Oregon</li>
                <li>Vermont</li>
                <li>Wyoming</li>
              </ul>
            </div>

            <p className="text-gray-600 italic mb-6">
              Note: Even if based in a non-participating state, registration is required if operating in participating states.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-[#1A1F2C] mb-3">Base State Selection:</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Register in your home state if it participates in UCR</li>
                <li>If your state doesn't participate, select the nearest participating state</li>
                <li>Canadian-based businesses must also comply when operating in participating states</li>
                <li>Must be completed before any interstate operations</li>
              </ul>
            </div>
          </section>

          <section id="fee-structure" className="bg-[#edf7ff]/50 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl text-gray-600 mb-6 font-semibold">Fee Structure</h2>
            <div className="space-y-6">
              <div className="text-gray-600 mb-8">
                <p className="mb-4">Based on fleet size</p>
                <p className="font-semibold mb-2">Fees support:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>State enforcement programs</li>
                  <li>Road maintenance</li>
                  <li>Highway safety initiatives</li>
                  <li>State motor carrier registration programs</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-[#1A1F2C] mb-4">UCR Filing Fee For 2025</h3>
                <div className="mt-8 border rounded-lg overflow-hidden bg-white sm:w-[53%]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-gray-50 text-[#1A1F2C] font-semibold">Truck Quantity</TableHead>
                        <TableHead className="bg-gray-50 text-[#1A1F2C] font-semibold">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">0 – 2 Trucks</TableCell>
                        <TableCell>$176.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">3 – 5 Trucks</TableCell>
                        <TableCell>$388.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">6 – 20 Trucks</TableCell>
                        <TableCell>$609.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">21 – 100 Trucks</TableCell>
                        <TableCell>$1,449.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">101 – 1,000 Trucks</TableCell>
                        <TableCell>$6,816.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">1,001 or more Trucks</TableCell>
                        <TableCell>Contact Us</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center mt-20">
          <div className="mb-[150px]">
            <Button onClick={scrollToTop} className="bg-[#517fa4] hover:bg-[#517fa4]/90 text-white py-6 px-8 text-lg">
              File Your UCR
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mb-[150px]">
          <p className="text-[#8E9196] text-xs">
            This website is not affiliated with the Unified Carrier Registration Plan. This website is operated by a private company that provides a private registration service for an additional fee. You are not required to use this site to register with the UCR Plan. You may register directly with the UCR Plan at www.ucr.gov.
          </p>
        </div>
      </div>
    </div>;
};
export default UCRFiling;