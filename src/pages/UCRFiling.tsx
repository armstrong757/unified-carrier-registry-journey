
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

  const feeStructure = [
    { vehicles: "0-2", fee: "$69" },
    { vehicles: "3-5", fee: "$206" },
    { vehicles: "6-20", fee: "$410" },
    { vehicles: "21-100", fee: "$1,431" },
    { vehicles: "101-1000", fee: "$6,820" },
    { vehicles: "1001 or more", fee: "$66,597" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-[#1A1F2C] mb-8">UCR Registration</h1>
          
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
              <Button type="submit" className="w-full bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white py-6 text-lg">
                GET STARTED
              </Button>
            </form>
          </Card>
        </div>

        {/* Fee Structure Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-[#1A1F2C] mb-8">UCR Filing Fee for 2025</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeStructure.map((tier, index) => (
              <Card key={index} className="p-6 text-center bg-white hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-[#1A1F2C] mb-2">
                  {tier.vehicles} Vehicles
                </h3>
                <p className="text-2xl font-bold text-[#1A1F2C]">{tier.fee}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <section className="space-y-12 bg-white p-8 rounded-xl shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">What is UCR?</h2>
            <p className="text-gray-600 leading-relaxed">
              The Unified Carrier Registration (UCR) is a federally mandated program established in 2005 that requires motor carriers and businesses engaged in interstate commerce to register and pay annual fees. This program applies to all companies with an active USDOT number that transport goods across state lines.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Who Needs to Register?</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-3">
              <li>Operate commercial motor vehicles in interstate commerce</li>
              <li>Are a motor carrier (private, exempt, or for-hire)</li>
              <li>Work as a broker, freight forwarder, or leasing company</li>
              <li>Cross state lines for business, even occasionally</li>
              <li>Operate from a non-participating state but drive into participating states</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Penalties for Non-Compliance:</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-3">
              <li>Fines ranging from $100 to $5,000</li>
              <li>Vehicle detention or impoundment</li>
              <li>Potential suspension of operating authority</li>
              <li>Removal from road operations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Fee Structure:</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-3">
              <li>Based on fleet size</li>
              <li>Fees support:
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>State enforcement programs</li>
                  <li>Road maintenance</li>
                  <li>Highway safety initiatives</li>
                  <li>State motor carrier registration programs</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Legal Framework</h2>
            <p className="text-gray-600 mb-4">The UCR program operates under:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-3">
              <li>Unified Carrier Registration Act of 2005</li>
              <li>Code of Federal Regulations Title 49 Section 367</li>
              <li>Federal Motor Carrier Safety Administration (FMCSA) oversight</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Participating States</h2>
            <p className="text-gray-600 mb-6">Currently, 41 U.S. states participate in the UCR program</p>
            <p className="font-semibold mb-4">Non-participating states:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-gray-600">Arizona</p>
                <p className="text-gray-600">District of Columbia</p>
                <p className="text-gray-600">Florida</p>
                <p className="text-gray-600">Hawaii</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Maryland</p>
                <p className="text-gray-600">New Jersey</p>
                <p className="text-gray-600">Nevada</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Oregon</p>
                <p className="text-gray-600">Vermont</p>
                <p className="text-gray-600">Wyoming</p>
              </div>
            </div>
            <p className="text-gray-600 italic bg-gray-50 p-4 rounded-lg">
              *Note: Even if based in a non-participating state, registration is required if operating in participating states.*
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-6">Base State Selection:</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-3">
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
