
import { DOTNumberInput } from "@/components/MCS150Form/DOTNumberInput";
import { TableOfContents } from "@/components/MCS150Form/TableOfContents";
import { ContentSections } from "@/components/MCS150Form/ContentSections";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getFilingByResumeToken } from "@/utils/filingUtils";
import { useToast } from "@/components/ui/use-toast";
import { Filing, MCS150FormData } from "@/types/filing";

const MCS150Filing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const resumeToken = searchParams.get('resume');
    
    if (resumeToken) {
      const resumeFiling = async () => {
        try {
          const filing = await getFilingByResumeToken(resumeToken);
          if (filing) {
            const formData = filing.form_data as MCS150FormData;
            
            sessionStorage.setItem('usdotData', JSON.stringify({
              usdotNumber: filing.usdot_number,
              legalName: formData.companyName || '',
              telephone: formData.businessPhone || '',
              physicalAddress: formData.principalAddress?.address || '',
            }));
            
            navigate("/mcs150", {
              state: {
                usdotData: {
                  usdotNumber: filing.usdot_number,
                  legalName: formData.companyName || '',
                  telephone: formData.businessPhone || '',
                  physicalAddress: formData.principalAddress?.address || '',
                },
                resumedFiling: filing
              }
            });
            
            toast({
              title: "Form Resumed",
              description: "Your previous progress has been restored.",
            });
          }
        } catch (error) {
          console.error('Error resuming filing:', error);
          toast({
            title: "Error",
            description: "This resume link is no longer valid. Please start a new filing.",
            variant: "destructive",
          });
        }
      };
      
      resumeFiling();
    }
  }, [location, navigate, toast]);

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
