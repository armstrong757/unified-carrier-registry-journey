
import { UCRDOTInput } from "@/components/UCRForm/UCRDOTInput";
import { UCRTableOfContents } from "@/components/UCRForm/UCRTableOfContents";
import { UCRContentSections } from "@/components/UCRForm/UCRContentSections";

const UCRFiling = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-[16px]">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-8 mb-16">
          <h1 className="font-bold text-[#1A1F2C] mb-8 text-3xl my-[30px]">UCR Registration</h1>
          <UCRDOTInput />
        </div>

        <UCRTableOfContents />
        <UCRContentSections onScrollToTop={scrollToTop} />
      </div>
    </div>
  );
};

export default UCRFiling;
