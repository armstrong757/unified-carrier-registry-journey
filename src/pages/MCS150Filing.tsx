
import { DOTNumberInput } from "@/components/MCS150Form/DOTNumberInput";
import { TableOfContents } from "@/components/MCS150Form/TableOfContents";
import { ContentSections } from "@/components/MCS150Form/ContentSections";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getFilingByResumeToken } from "@/utils/filing";
import { useToast } from "@/components/ui/use-toast";
import { Filing, MCS150FormData } from "@/types/filing";

const MCS150Filing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check URL parameters first
    const searchParams = new URLSearchParams(location.search);
    const dotNumber = searchParams.get('dot');
    const legalName = searchParams.get('name');
    const phone = searchParams.get('phone');
    const address = searchParams.get('address');

    if (dotNumber) {
      const usdotData = {
        usdotNumber: dotNumber,
        legalName: legalName ? decodeURIComponent(legalName) : '',
        telephone: phone ? decodeURIComponent(phone) : '',
        physicalAddress: address ? decodeURIComponent(address) : ''
      };
      
      // Store the data in session storage for persistence
      sessionStorage.setItem('usdotData', JSON.stringify(usdotData));
      // Navigate directly to the form
      navigate("/mcs150", {
        state: { usdotData },
        replace: true
      });
      return;
    }

    // Then check if we have DOT data passed directly
    if (location.state?.usdotData) {
      // Store the data in session storage for persistence
      sessionStorage.setItem('usdotData', JSON.stringify(location.state.usdotData));
      // Navigate directly to the form
      navigate("/mcs150", {
        state: { usdotData: location.state.usdotData },
        replace: true
      });
      return;
    }

    // Finally check for resume token
    const resumeToken = searchParams.get('resume');
    if (resumeToken) {
      const resumeFiling = async () => {
        try {
          const filing = await getFilingByResumeToken(resumeToken);
          if (filing) {
            const formData = filing.form_data as unknown as MCS150FormData;
            const usdotData = {
              usdotNumber: filing.usdot_number,
              legalName: formData.companyName || '',
              telephone: formData.businessPhone || '',
              physicalAddress: formData.principalAddress?.address || ''
            };
            sessionStorage.setItem('usdotData', JSON.stringify(usdotData));
            navigate("/mcs150", {
              state: {
                usdotData,
                resumedFiling: filing
              },
              replace: true
            });
            toast({
              title: "Form Resumed",
              description: "Your previous progress has been restored."
            });
          }
        } catch (error) {
          console.error('Error resuming filing:', error);
          toast({
            title: "Error",
            description: "This resume link is no longer valid. Please start a new filing.",
            variant: "destructive"
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
