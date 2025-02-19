
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSION = 1200; // Max width/height for resized images

const resizeImage = async (file: File, maxDimension: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png', 0.9);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
  });
};

export const uploadFormAttachment = async (file: File, usdotNumber: string, type: 'signature' | 'license') => {
  try {
    console.log(`Starting upload for ${type} file:`, { name: file.name, size: file.size });
    
    let processedFile: File | Blob = file;
    let contentType = file.type;
    
    // Handle size limits and resizing
    if (file.size > MAX_FILE_SIZE) {
      if (type === 'license' && file.type.startsWith('image/')) {
        // Resize image files that are too large
        processedFile = await resizeImage(file, MAX_IMAGE_DIMENSION);
        contentType = 'image/png';
      } else {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        });
        throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }
    }
    
    // For signatures, always convert to PNG and resize
    if (type === 'signature') {
      processedFile = await resizeImage(file, MAX_IMAGE_DIMENSION);
      contentType = 'image/png';
    }
    
    const fileExt = type === 'signature' ? 'png' : file.name.split('.').pop();
    const sanitizedUsdot = usdotNumber.replace(/[^a-zA-Z0-9-]/g, '');
    const fileName = `${sanitizedUsdot}/${type}_${Date.now()}.${fileExt}`;

    console.log('Uploading file to storage:', { fileName, contentType });

    // Ensure the storage client is properly initialized
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('form_attachments')
      .upload(fileName, processedFile, {
        contentType,
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: uploadError.message
      });
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from('form_attachments')
      .getPublicUrl(fileName);

    console.log('File uploaded successfully:', { fileName, publicUrl: urlData.publicUrl });

    return { 
      fileName,
      publicUrl: urlData.publicUrl,
      contentType,
      originalName: file.name
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    toast({
      variant: "destructive",
      title: "Upload failed",
      description: error instanceof Error ? error.message : "An unexpected error occurred"
    });
    throw error;
  }
};
