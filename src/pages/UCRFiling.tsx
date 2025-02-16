
import { UCRDOTInput } from "@/components/UCRForm/UCRDOTInput";
import { UCRTableOfContents } from "@/components/UCRForm/UCRTableOfContents";
import { UCRContentSections } from "@/components/UCRForm/UCRContentSections";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getFilingByResumeToken } from "@/utils/filingUtils";
import { useToast } from "@/components/ui/use-toast";

const UCRFiling = () => {
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
            sessionStorage.setItem('usdotData', JSON.stringify({
              usdotNumber: filing.usdot_number,
              // Add other relevant data
              legalName: filing.form_data.representative || '',
              telephone: filing.form_data.phone || '',
            }));
            
            navigate("/ucr", {
              state: {
                usdotData: {
                  usdotNumber: filing.usdot_number,
                  legalName: filing.form_data.representative || '',
                  telephone: filing.form_data.phone || '',
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
