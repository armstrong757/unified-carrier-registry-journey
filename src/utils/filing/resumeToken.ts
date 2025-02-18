
import { supabase } from "@/integrations/supabase/client";

export const getFilingByResumeToken = async (token: string) => {
  try {
    const { data, error } = await supabase
      .from('filings')
      .select()
      .eq('resume_token', token)
      .eq('status', 'draft') // Only get draft filings
      .gt('resume_token_expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error('No valid filing found for this resume token');
    }
    return data;
  } catch (error) {
    console.error('Error retrieving filing by resume token:', error);
    throw error;
  }
};
