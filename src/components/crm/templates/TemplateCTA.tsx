import React from 'react';
import Link from 'next/link';
import { BarChart2, ArrowRight } from 'lucide-react';

interface TemplateCTAProps {
  templateType: string;
  className?: string;
}

const TemplateCTA: React.FC<TemplateCTAProps> = ({ templateType, className = '' }) => {
  // Handle encoding the template type for URL
  const encodedTemplateType = encodeURIComponent(templateType);
  
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-medium text-blue-800">Template Analytics</h3>
          <p className="text-sm text-blue-600 mt-1">
            View detailed statistics for <span className="font-semibold">{templateType}</span> template
          </p>
        </div>
        
        <Link 
          href={`/templates/dashboard/${encodedTemplateType}`}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <BarChart2 className="h-4 w-4" />
          <span>View Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default TemplateCTA;