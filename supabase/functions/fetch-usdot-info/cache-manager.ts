
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { USDOTData } from './types.ts';

interface ApiRequestLog {
  usdotNumber: string;
  requestType: string;
  requestSource: string;
  cacheHit: boolean;
  responseTime?: number;
  filingId?: string;
}

export class CacheManager {
  private supabase;
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getCachedData(dotNumber: string): Promise<USDOTData | null> {
    const { data: existingData, error } = await this.supabase
      .from('usdot_info')
      .select('*')
      .eq('usdot_number', dotNumber)
      .maybeSingle();

    if (error) {
      console.error('DEBUG: Cache fetch error:', error);
      return null;
    }

    if (!existingData) return null;

    const lastUpdate = new Date(existingData.updated_at || '');
    const timeSinceUpdate = Date.now() - lastUpdate.getTime();
    
    return timeSinceUpdate > this.cacheExpiry ? null : existingData as USDOTData;
  }

  async updateCache(data: USDOTData): Promise<void> {
    const { error } = await this.supabase
      .from('usdot_info')
      .upsert({
        usdot_number: data.usdotNumber,
        operating_status: data.operatingStatus,
        entity_type: data.entityType,
        legal_name: data.legalName,
        dba_name: data.dbaName,
        physical_address: data.physicalAddress,
        telephone: data.telephone,
        power_units: data.powerUnits,
        bus_count: data.busCount,
        limo_count: data.limoCount,
        minibus_count: data.minibusCount,
        motorcoach_count: data.motorcoachCount,
        van_count: data.vanCount,
        complaint_count: data.complaintCount,
        out_of_service: data.outOfService,
        out_of_service_date: data.outOfServiceDate,
        mc_number: data.mcNumber,
        mcs150_last_update: data.mcs150LastUpdate,
        basics_data: data.basicsData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'usdot_number'
      });

    if (error) {
      console.error('DEBUG: Cache update error:', error);
    }
  }

  async logApiRequest(request: ApiRequestLog): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('api_requests')
        .insert([{
          usdot_number: request.usdotNumber,
          request_type: request.requestType,
          request_source: request.requestSource,
          cache_hit: request.cacheHit,
          filing_id: request.filingId,
          response_time_ms: request.responseTime,
          request_timestamp: new Date().toISOString()
        }]);

      if (error) {
        console.error('DEBUG: API request logging error:', error);
      }
    } catch (error) {
      console.error('DEBUG: Failed to log API request:', error);
    }
  }
}
