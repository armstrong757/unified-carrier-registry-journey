
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const UCRFiling = () => {
  const [dotNumber, setDotNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dotNumber.trim()) {
      navigate("/ucr");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1A1F2C] mb-8">UCR Registration</h1>
          
          <Card className="max-w-md mx-auto p-6 bg-white shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-medium text-center mb-4">Enter DOT Number To Start</h2>
              <Input
                type="text"
                placeholder="Enter USDOT Number here"
                value={dotNumber}
                onChange={(e) => setDotNumber(e.target.value)}
                className="w-full"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                GET STARTED
              </Button>
            </form>
          </Card>
        </div>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-[#1A1F2C] mb-4">What is UCR?</h2>
            <p className="text-gray-600">
              The Unified Carrier Registration (UCR) is a federally mandated program established in 2005 that requires motor carriers and businesses engaged in interstate commerce to register and pay annual fees. This program applies to all companies with an active USDOT number that transport goods across state lines.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1A1F2C] mb-4">Who Needs to Register?</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Operate commercial motor vehicles in interstate commerce</li>
              <li>Are a motor carrier (private, exempt, or for-hire)</li>
              <li>Work as a broker, freight forwarder, or leasing company</li>
              <li>Cross state lines for business, even occasionally</li>
              <li>Operate from a non-participating state but drive into participating states</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1A1F2C] mb-4">Penalties for Non-Compliance:</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Fines ranging from $100 to $5,000</li>
              <li>Vehicle detention or impoundment</li>
              <li>Potential suspension of operating authority</li>
              <li>Removal from road operations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1A1F2C] mb-4">Fee Structure:</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Based on fleet size</li>
              <li>Fees support:
                <ul className="list-disc pl-6 mt-2">
                  <li>State enforcement programs</li>
                  <li>Road maintenance</li>
                  <li>Highway safety initiatives</li>
                  <li>State motor carrier registration programs</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1A1F2C] mb-4">Legal Framework</h2>
            <p className="text-gray-600">The UCR program operates under:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
              <li>Unified Carrier Registration Act of 2005</li>
              <li>Code of Federal Regulations Title 49 Section 367</li>
              <li>Federal Motor Carrier Safety Administration (FMCSA) oversight</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1A1F2C] mb-4">Participating States</h2>
            <p className="text-gray-600 mb-4">Currently, 41 U.S. states participate in the UCR program</p>
            <p className="font-medium mb-2">Non-participating states:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
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
            <p className="text-gray-600 mt-4 italic">
              *Note: Even if based in a non-participating state, registration is required if operating in participating states.*
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1A1F2C] mb-4">Base State Selection:</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Register in your home state if it participates in UCR</li>
              <li>If your state doesn't participate, select the nearest participating state</li>
              <li>Canadian-based businesses must also comply when operating in participating states</li>
              <li>Must be completed before any interstate operations</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UCRFiling;
