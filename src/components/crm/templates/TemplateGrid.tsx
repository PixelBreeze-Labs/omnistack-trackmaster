// src/components/crm/templates/TemplateGrid.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Template = {
  id: number;
  name: string;
  image: string;
  template_type: string;
  description?: string;
};

export default function TemplateGrid() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // This would normally come from your API
        const templatesData: Template[] = [
          { 
            id: 21, 
            name: "News Story 1", 
            image: "/images/templates/web_news_story.png", 
            template_type: "web_news_story",
            description: "Template for news articles with headline and category" 
          },
          { 
            id: 23, 
            name: "News Story 2", 
            image: "/images/templates/web_news_story_2.png", 
            template_type: "web_news_story_2",
            description: "Alternative layout for news articles" 
          },
          // Add more templates as needed
        ];
        
        setTemplates(templatesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateClick = (template: Template) => {
    router.push(`/crm/platform/template-form/${template.id}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className="border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleTemplateClick(template)}
        >
          <div className="relative h-48 w-full">
            <Image
              src={template.image}
              alt={template.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-slate-500 mt-1">{template.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}