
import { DOTNumberInput } from "@/components/MCS150Form/DOTNumberInput";
import { TableOfContents } from "@/components/MCS150Form/TableOfContents";
import { ContentSections } from "@/components/MCS150Form/ContentSections";

const MCS150Filing = () => {
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
          <h1 className="font-bold text-[#1A1F2C] mb-8 py-0 my-[30px] text-3xl">
            MCS-150 / Biennial Update
          </h1>
          <DOTNumberInput />
        </div>

        <TableOfContents />
        <ContentSections onScrollToTop={scrollToTop} />
      </div>
    </div>
  );
};

export default MCS150Filing;
