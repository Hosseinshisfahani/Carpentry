import api from './api';

class BinPackingService {
  /**
   * Perform 2D bin packing optimization
   * @param {Object} containerSize - Container dimensions
   * @param {number} containerSize.width - Container width
   * @param {number} containerSize.height - Container height
   * @param {Array} rectangles - Array of rectangle objects
   * @param {number} rectangles[].width - Rectangle width
   * @param {number} rectangles[].height - Rectangle height
   * @returns {Promise<Object>} Packing result with success, density, packed rectangles, and visualization
   */
  async packRectangles(containerSize, rectangles) {
    try {
      const requestData = {
        container_width: containerSize.width,
        container_height: containerSize.height,
        rectangles: rectangles.map(rect => ({
          width: parseFloat(rect.width),
          height: parseFloat(rect.height)
        }))
      };

      const response = await api.post('/projects/bin_pack/', requestData);
      return response.data;
    } catch (error) {
      console.error('Bin packing API error:', error);
      
      // Handle different error types
      if (error.response?.data?.error) {
        throw new Error(`بهینه‌سازی چیدمان ناموفق بود: ${error.response.data.error}`);
      } else if (error.response?.data) {
        // Handle validation errors
        const errors = error.response.data;
        if (typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          throw new Error(`خطای اعتبارسنجی: ${errorMessages}`);
        }
        throw new Error(`خطای API: ${JSON.stringify(errors)}`);
      } else if (error.request) {
        throw new Error('خطای شبکه: امکان اتصال به سرور وجود ندارد');
      } else {
        throw new Error(`خطای درخواست: ${error.message}`);
      }
    }
  }

  /**
   * Validate input data before sending to API
   * @param {Object} containerSize - Container dimensions
   * @param {Array} rectangles - Array of rectangles
   * @returns {Object} Validation result
   */
  validateInput(containerSize, rectangles) {
    const errors = [];

    // Convert container size to numbers for validation
    const containerWidth = parseFloat(containerSize.width);
    const containerHeight = parseFloat(containerSize.height);

    // Validate container size
    if (!containerSize.width || isNaN(containerWidth) || containerWidth <= 0) {
      errors.push('عرض ظرف باید بیشتر از 0 باشد');
    }
    if (!containerSize.height || isNaN(containerHeight) || containerHeight <= 0) {
      errors.push('ارتفاع ظرف باید بیشتر از 0 باشد');
    }

    // Validate rectangles
    if (!rectangles || rectangles.length === 0) {
      errors.push('حداقل یک قطعه مورد نیاز است');
    } else {
      rectangles.forEach((rect, index) => {
        const rectWidth = parseFloat(rect.width);
        const rectHeight = parseFloat(rect.height);
        
        if (!rect.width || isNaN(rectWidth) || rectWidth <= 0) {
          errors.push(`قطعه ${index + 1}: عرض باید بیشتر از 0 باشد`);
        }
        if (!rect.height || isNaN(rectHeight) || rectHeight <= 0) {
          errors.push(`قطعه ${index + 1}: ارتفاع باید بیشتر از 0 باشد`);
        }
        
        // Check if rectangle fits in container (only if both values are valid numbers)
        if (!isNaN(containerWidth) && !isNaN(rectWidth) && rectWidth > containerWidth) {
          errors.push(`قطعه ${index + 1}: عرض (${rect.width}) از عرض ظرف (${containerSize.width}) بیشتر است`);
        }
        if (!isNaN(containerHeight) && !isNaN(rectHeight) && rectHeight > containerHeight) {
          errors.push(`قطعه ${index + 1}: ارتفاع (${rect.height}) از ارتفاع ظرف (${containerSize.height}) بیشتر است`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Format packing result for display
   * @param {Object} result - Raw API result
   * @returns {Object} Formatted result
   */
  formatResult(result) {
    return {
      success: result.success,
      density: Math.round(result.density * 100 * 100) / 100, // Round to 2 decimal places
      packedRectangles: result.packed_rectangles || [],
      visualization: result.visualization || null,
      imageBase64: result.image_base64 || '', // Keep for backward compatibility
      message: result.message || '',
      totalRectangles: result.packed_rectangles?.length || 0
    };
  }

  /**
   * Save a bin packing report for a project
   * @param {number} projectId - Project ID
   * @param {Object} containerSize - Container dimensions
   * @param {Array} rectangles - Array of rectangle objects
   * @param {Object} result - Packing result from formatResult
   * @param {string} name - Optional report name
   * @returns {Promise<Object>} Saved report data
   */
  async saveReport(projectId, containerSize, rectangles, result, name = null) {
    try {
      const reportData = {
        name: name || `گزارش ${new Date().toLocaleDateString('fa-IR')}`,
        container_width: parseFloat(containerSize.width),
        container_height: parseFloat(containerSize.height),
        rectangles: rectangles.map(rect => ({
          width: parseFloat(rect.width),
          height: parseFloat(rect.height)
        })),
        packed_rectangles: result.packedRectangles || [],
        visualization: result.visualization || {},
        density: result.density,
        success: result.success,
        message: result.message || '',
      };

      const response = await api.post(`/projects/${projectId}/save_report/`, reportData);
      return response.data;
    } catch (error) {
      console.error('Save report API error:', error);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          throw new Error(`خطای اعتبارسنجی: ${errorMessages}`);
        }
        throw new Error(`خطای API: ${JSON.stringify(errors)}`);
      } else if (error.request) {
        throw new Error('خطای شبکه: امکان اتصال به سرور وجود ندارد');
      } else {
        throw new Error(`خطای درخواست: ${error.message}`);
      }
    }
  }

  /**
   * Get all bin packing reports for a project
   * @param {number} projectId - Project ID
   * @returns {Promise<Array>} Array of report objects
   */
  async getReports(projectId) {
    try {
      const response = await api.get(`/projects/${projectId}/reports/`);
      return response.data;
    } catch (error) {
      console.error('Get reports API error:', error);
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.request) {
        throw new Error('خطای شبکه: امکان اتصال به سرور وجود ندارد');
      } else {
        throw new Error(`خطای درخواست: ${error.message}`);
      }
    }
  }
}

export const binPackingService = new BinPackingService();
export default binPackingService;
