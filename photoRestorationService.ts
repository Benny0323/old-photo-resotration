/**
 * Photo Restoration Service
 * Provides real-time photo enhancement and restoration using AI
 */

export interface RestorationResult {
  success: boolean;
  restoredImageUrl?: string;
  error?: string;
}

/**
 * Enhance a historical photo using AI restoration techniques
 * This simulates a real-time restoration by applying various enhancement filters
 */
export async function restorePhoto(imageUrl: string): Promise<RestorationResult> {
  try {
    // Fetch the image as a blob to avoid CORS issues
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch image: ${response.status}`
      };
    }
    
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            resolve({
              success: false,
              error: 'Failed to get canvas context'
            });
            return;
          }
          
          // Set canvas dimensions with a maximum size to avoid memory issues
          const maxSize = 2000;
          let width = img.width;
          let height = img.height;
          
          if (width > maxSize || height > maxSize) {
            const scale = Math.min(maxSize / width, maxSize / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw the original image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Apply restoration filters
          // 1. Enhance contrast
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Enhance contrast by stretching the tonal range
            const factor = 1.3;
            data[i] = Math.min(255, Math.max(0, (r - 128) * factor + 128));
            data[i + 1] = Math.min(255, Math.max(0, (g - 128) * factor + 128));
            data[i + 2] = Math.min(255, Math.max(0, (b - 128) * factor + 128));
          }
          
          // 2. Reduce noise using a simple median-like filter
          const smoothedData = new Uint8ClampedArray(data);
          for (let i = 0; i < data.length; i += 4) {
            if (i > canvas.width * 4 && i < data.length - canvas.width * 4) {
              // Simple blur to reduce noise
              const neighbors = [
                data[i - canvas.width * 4],
                data[i - 4],
                data[i],
                data[i + 4],
                data[i + canvas.width * 4]
              ];
              smoothedData[i] = neighbors.reduce((a, b) => a + b) / neighbors.length;
              smoothedData[i + 1] = neighbors.reduce((a, b) => a + b) / neighbors.length;
              smoothedData[i + 2] = neighbors.reduce((a, b) => a + b) / neighbors.length;
            }
          }
          
          // Apply smoothed data
          for (let i = 0; i < data.length; i += 4) {
            data[i] = smoothedData[i];
            data[i + 1] = smoothedData[i + 1];
            data[i + 2] = smoothedData[i + 2];
          }
          
          // 3. Enhance colors slightly
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Slightly boost color saturation
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const l = (max + min) / 2;
            
            if (l > 0 && l < 255) {
              const s = (max - min) / (max + min > 127 ? 510 - max - min : max + min);
              const boost = 1.15;
              
              data[i] = Math.min(255, Math.max(0, r + (r - l) * s * boost));
              data[i + 1] = Math.min(255, Math.max(0, g + (g - l) * s * boost));
              data[i + 2] = Math.min(255, Math.max(0, b + (b - l) * s * boost));
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          // Convert canvas to blob and create URL
          canvas.toBlob((restoredBlob) => {
            URL.revokeObjectURL(objectUrl);
            
            if (restoredBlob) {
              const restoredUrl = URL.createObjectURL(restoredBlob);
              resolve({
                success: true,
                restoredImageUrl: restoredUrl
              });
            } else {
              resolve({
                success: false,
                error: 'Failed to create blob from canvas'
              });
            }
          }, 'image/png', 0.95);
        } catch (error) {
          URL.revokeObjectURL(objectUrl);
          resolve({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error during restoration'
          });
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          success: false,
          error: 'Failed to load image'
        });
      };
      
      img.src = objectUrl;
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Batch restore multiple photos
 */
export async function restorePhotoBatch(imageUrls: string[]): Promise<RestorationResult[]> {
  return Promise.all(imageUrls.map(url => restorePhoto(url)));
}
