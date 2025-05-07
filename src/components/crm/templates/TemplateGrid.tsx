"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BarChart2, ArrowRight, Filter } from "lucide-react";
import Link from "next/link";

type Template = {
  id: number;
  name: string;
  image: string;
  template_type: string;
  description?: string;
  entity: string;
};

export default function TemplateGrid() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterEntity, setFilterEntity] = useState<string>("iconstyle");
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handlePreviewClick = (e: React.MouseEvent, imageSrc: string) => {
    e.stopPropagation(); // Prevent triggering the card click
    setPreviewImage(imageSrc);
  };

  useEffect(() => {
    // Use AbortController for cleanup
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchTemplates = async () => {
      try {
        // This would be a static array for now, but could be fetched from an API in the future
        const templatesData: Template[] = [
          // IconStyle Templates
          {
            id: 1,
            name: "Feed Basic",
            image: "/images/templates/feed_basic.png",
            template_type: "feed_basic",
            description: "Template for basic social media feeds",
            entity: "iconstyle"
          },
          {
            id: 2,
            name: "Feed Swipe",
            image: "/images/templates/feed_swipe.png",
            template_type: "feed_swipe",
            description: "Template for swipeable social media content",
            entity: "iconstyle"
          },
          {
            id: 3,
            name: "Iconic Location",
            image: "/images/templates/iconic_location.png",
            template_type: "iconic_location",
            description: "Template highlighting locations with iconic design",
            entity: "iconstyle"
          },
          {
            id: 4,
            name: "Citim",
            image: "/images/templates/citim.png",
            template_type: "citim",
            description: "Template for article quotes and citations",
            entity: "iconstyle"
          },
          {
            id: 5,
            name: "Web News Story",
            image: "/images/templates/web_news_story.png",
            template_type: "web_news_story",
            description: "Template for news articles with headline and category",
            entity: "iconstyle"
          },
          {
            id: 6,
            name: "Feed Headline",
            image: "/images/templates/feed_headline.png",
            template_type: "feed_headline",
            description: "Template for headlines in social feeds",
            entity: "iconstyle"
          },
          {
            id: 7,
            name: "Logo Only",
            image: "/images/templates/logo_only.png",
            template_type: "logo_only",
            description: "Simple template featuring just the logo",
            entity: "iconstyle"
          },
          {
            id: 8,
            name: "Web News",
            image: "/images/templates/web_news.png",
            template_type: "web_news",
            description: "General template for web news content",
            entity: "iconstyle"
          },
          {
            id: 9,
            name: "Feed Location",
            image: "/images/templates/feed_location.png",
            template_type: "feed_location",
            description: "Template for location-based social media content",
            entity: "iconstyle"
          },
          {
            id: 10,
            name: "Quotes & Writings",
            image: "/images/templates/quotes_writings_art.png",
            template_type: "quotes_writings_art",
            description: "Artistic template for quotes and writings",
            entity: "iconstyle"
          },
          {
            id: 11,
            name: "Morning Quote",
            image: "/images/templates/quotes_writings_morning.png",
            template_type: "quotes_writings_morning",
            description: "Template for morning motivational quotes",
            entity: "iconstyle"
          },
          {
            id: 12,
            name: "Pa Thonjëza",
            image: "/images/templates/quotes_writings_thonjeza.png",
            template_type: "quotes_writings_thonjeza",
            description: "Template for quotes without quotation marks",
            entity: "iconstyle"
          },
          {
            id: 13,
            name: "Citim Blank",
            image: "/images/templates/quotes_writings_citim.png",
            template_type: "quotes_writings_citim",
            description: "Clean template for citations and quotes",
            entity: "iconstyle"
          },
          {
            id: 14,
            name: "Web News Story 2",
            image: "/images/templates/web_news_story_2.png",
            template_type: "web_news_story_2",
            description: "Alternative layout for news articles",
            entity: "iconstyle"
          },
          {
            id: 15,
            name: "Highlight",
            image: "/images/templates/highlight.png",
            template_type: "highlight",
            description: "Template for highlighting important content",
            entity: "iconstyle"
          },
          
          // Reforma Templates
          {
            id: 16,
            name: "Reforma Quotes Writing",
            image: "/images/templates/reforma_quotes_writings.jpeg",
            template_type: "reforma_quotes_writings",
            description: "Elegant template for quotes in Reforma style",
            entity: "reforma"
          },
          {
            id: 17,
            name: "Reforma New Quote",
            image: "/images/templates/reforma_new_quote.jpeg",
            template_type: "reforma_new_quote",
            description: "Fresh design for quotes in Reforma style",
            entity: "reforma"
          },
          {
            id: 18,
            name: "Reforma Feed Swipe",
            image: "/images/templates/reforma_feed_swipe.jpeg",
            template_type: "reforma_feed_swipe",
            description: "Swipeable feed content in Reforma style",
            entity: "reforma"
          },
          {
            id: 19,
            name: "Citim 2",
            image: "/images/templates/citim_version_2.jpeg",
            template_type: "citim_version_2",
            description: "Updated citation template for Reforma",
            entity: "reforma"
          },
          {
            id: 20,
            name: "Reforma News Feed",
            image: "/images/templates/reforma_news_feed.jpeg",
            template_type: "reforma_news_feed",
            description: "News feed template in Reforma style",
            entity: "reforma"
          },
          {
            id: 21,
            name: "Reforma Web News Story",
            image: "/images/templates/reforma_web_news_story1.jpeg",
            template_type: "reforma_web_news_story1",
            description: "News article template for Reforma",
            entity: "reforma"
          },
          {
            id: 22,
            name: "Reforma Web News Story (Caption)",
            image: "/images/templates/reforma_web_news_story2.jpeg",
            template_type: "reforma_web_news_story2",
            description: "News article with caption in Reforma style",
            entity: "reforma"
          },
          {
            id: 23,
            name: "Reforma Logo Only",
            image: "/images/templates/reforma_logo_only.jpg",
            template_type: "reforma_logo_only",
            description: "Simple logo template for Reforma",
            entity: "reforma"
          }
        ];
        
        // Check if component is still mounted
        if (!signal.aborted) {
          setTemplates(templatesData);
          setFilteredTemplates(templatesData);
          setIsLoading(false);
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("Failed to fetch templates:", error);
          setIsLoading(false);
        }
      }
    };

    fetchTemplates();
    
    // Cleanup function to prevent memory leaks
    return () => {
      controller.abort();
    };
  }, []);

  // Filter templates based on selected entity
  useEffect(() => {
    if (filterEntity === "all") {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter(template => template.entity === filterEntity));
    }
  }, [filterEntity, templates]);

  const handleTemplateClick = (template: Template) => {
    // Prefetch the template form page to improve load time
    router.prefetch(`/crm/platform/template-form/${template.id}`);
    
    // Use shallow routing to prevent unnecessary data fetching
    router.push(`/crm/platform/template-form/${template.id}`, { 
      scroll: true // Ensure proper scrolling behavior
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
    <div key={i} className="bg-slate-100 animate-pulse rounded-lg h-[450px]"></div>
  ))}
</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-slate-500" />
          <span className="font-medium text-slate-700">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilterEntity("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterEntity === "all" 
                ? "bg-blue-600 text-white" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Templates
          </button>
          <button 
            onClick={() => setFilterEntity("iconstyle")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterEntity === "iconstyle" 
                ? "bg-blue-600 text-white" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            IconStyle
          </button>
          <button 
            onClick={() => setFilterEntity("reforma")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterEntity === "reforma" 
                ? "bg-blue-600 text-white" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Reforma
          </button>
        </div>
        <div className="ml-auto text-sm text-slate-500">
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            <div 
              className="relative h-[550px] w-full cursor-pointer"
              onClick={() => handleTemplateClick(template)}
            >
              <Image
                src={template.image}
                alt={template.name}
                fill
                style={{ objectFit: "cover" }}
                loading="eager" 
                priority={template.id <= 6} // Prioritize loading of first 6 templates
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2 bg-slate-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {template.entity === "iconstyle" ? "IconStyle" : "Reforma"}
              </div>
              <button
    className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
    onClick={(e) => handlePreviewClick(e, template.image)}
  >
    Preview
  </button>
            </div>
            <div className="p-4 flex-grow flex flex-col">
              <h3 
                className="font-medium text-lg cursor-pointer" 
                onClick={() => handleTemplateClick(template)}
              >
                {template.name}
              </h3>
              {template.description && (
                <p className="text-sm text-slate-500 mt-1 flex-grow">{template.description}</p>
              )}
              
              {/* Template Dashboard CTA */}
              <div className="mt-4 flex justify-between items-center">
                <Link 
                  href={`/crm/platform/template-dashboard/${(template.id)}`}
                  className="text-sm flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
                  prefetch={false} // Don't prefetch dashboard links to save bandwidth
                >
                  <BarChart2 className="h-4 w-4 mr-1" />
                  <span>View Analytics</span>
                  <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <button
                  onClick={() => handleTemplateClick(template)}
                  className="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-slate-200">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No templates found</h3>
          <p className="text-slate-500">Try changing your filter or check back later for new templates.</p>
          <button 
            onClick={() => setFilterEntity("all")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Show All Templates
          </button>
        </div>
      )}

{previewImage && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    onClick={() => setPreviewImage(null)}
  >
    <div className="relative max-w-4xl max-h-[90vh] w-full">
      <button 
        className="absolute top-4 right-4 bg-white rounded-full p-2 text-black z-10"
        onClick={() => setPreviewImage(null)}
      >
        ✕
      </button>
      <div className="bg-white rounded-lg p-2 w-full h-full flex items-center justify-center">
        <img 
          src={previewImage} 
          alt="Template Preview" 
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    </div>
  </div>
)}
        {/* Bottom spacing */}
        <div className="h-10"></div>
    </div>
  );
}