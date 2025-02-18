
import { supabase } from "@/integrations/supabase/client";

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

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const uploadFormAttachment = async (file: File, usdotNumber: string, type: 'signature' | 'license') => {
  try {
    let processedFile: File | Blob = file;
    let contentType = file.type;
    
    // Handle size limits and resizing
    if (file.size > MAX_FILE_SIZE) {
      if (type === 'license' && file.type.startsWith('image/')) {
        // Resize image files that are too large
        processedFile = await resizeImage(file, MAX_IMAGE_DIMENSION);
        contentType = 'image/png';
      } else {
        throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      }
    }
    
    // For signatures, always convert to PNG and resize
    if (type === 'signature') {
      processedFile = await resizeImage(file, MAX_IMAGE_DIMENSION);
      contentType = 'image/png';
    }
    
    const fileExt = type === 'signature' ? 'png' : file.name.split('.').pop();
    const fileName = `${usdotNumber}/${type}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('form_attachments')
      .upload(fileName, processedFile, {
        contentType,
        upsert: true
      });

    if (error) throw error;

    // Convert the processed file to base64
    const base64Data = await blobToBase64(processedFile);

    const { data: { publicUrl } } = supabase.storage
      .from('form_attachments')
      .getPublicUrl(fileName);

    return { 
      fileName,
      publicUrl,
      base64Data,
      contentType,
      originalName: file.name
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Helper to flatten nested objects for Airtable compatibility
export const flattenFormData = (data: any, parentKey = ''): Record<string, any> => {
  return Object.keys(data).reduce((acc, key) => {
    const newKey = parentKey ? `${parentKey}_${key}` : key;
    
    if (
      typeof data[key] === 'object' && 
      data[key] !== null && 
      !(data[key] instanceof File) &&
      !(data[key] instanceof Blob) &&
      !Array.isArray(data[key])
    ) {
      Object.assign(acc, flattenFormData(data[key], newKey));
    } else {
      acc[newKey] = data[key];
    }
    
    return acc;
  }, {} as Record<string, any>);
};
