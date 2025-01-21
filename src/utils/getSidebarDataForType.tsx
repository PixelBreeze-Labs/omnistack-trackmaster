// src/utils/getSidebarDataForType.tsx
import { 
    Users, 
    ShoppingBag, 
    Star, 
    BarChart2, 
    Settings, 
    UserCog, 
    Mail,
    Tags,
    Gift,
    TrendingUp,
    MessageSquare,
    UserPlus,
    Store,
    Megaphone
  } from 'lucide-react';
  import { Sidebar } from "@/types/sidebar";
  
  export const getSidebarDataForType = (clientType: string | undefined): Sidebar[] => {
    // If no client type, return empty array
    if (!clientType) return [];
  
    // Return the sidebar data with updated paths
    return [
      {
        id: 1,
        title: "Dashboard",
        path: `/crm/${clientType}/dashboard`,
        icon: <BarChart2 className="w-6 h-6"/>,
      },
      {
        id: 2,
        title: "Customers",
        path: `/crm/${clientType}/customers`,
        icon: <Users className="w-6 h-6"/>,
        children: [
          {
            id: "2-1",
            title: "All Customers",
            path: `/crm/${clientType}/customers`,
            icon: <Users className="w-4 h-4"/>
          },
          {
            id: "2-2",
            title: "Customer Journey",
            path: `/crm/${clientType}/customers/journey`,
            icon: <TrendingUp className="w-4 h-4"/>
          },
          {
            id: "2-3",
            title: "Customer Segments",
            path: `/crm/${clientType}/customers/segments`,
            icon: <Tags className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 3,
        title: "Sales Associates",
        path: `/crm/${clientType}/sales-associates`,
        icon: <UserCog className="w-6 h-6"/>,
        children: [
          {
            id: "3-1",
            title: "Team Members",
            path: `/crm/${clientType}/sales-associates`,
            icon: <UserCog className="w-4 h-4"/>
          },
          {
            id: "3-2",
            title: "Performance",
            path: `/crm/${clientType}/sales-associates/performance`,
            icon: <TrendingUp className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 4,
        title: "Loyalty Program",
        path: `/crm/${clientType}/loyalty`,
        icon: <Star className="w-6 h-6"/>,
        children: [
          {
            id: "4-1",
            title: "Program Overview",
            path: `/crm/${clientType}/loyalty`,
            icon: <Star className="w-4 h-4"/>
          },
          {
            id: "4-2",
            title: "Points & Rewards",
            path: `/crm/${clientType}/loyalty/rewards`,
            icon: <Gift className="w-4 h-4"/>
          },
          {
            id: "4-3",
            title: "Tiers",
            path: `/crm/${clientType}/loyalty/tiers`,
            icon: <TrendingUp className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 5,
        title: "Orders",
        path: `/crm/${clientType}/orders`,
        icon: <ShoppingBag className="w-6 h-6"/>,
      },
      {
        id: 6,
        title: "Communications",
        path: `/crm/${clientType}/communications`,
        icon: <Mail className="w-6 h-6"/>,
        children: [
          {
            id: "6-1",
            title: "Email Campaigns",
            path: `/crm/${clientType}/communications/email`,
            icon: <Mail className="w-4 h-4"/>
          },
          {
            id: "6-2",
            title: "Chat",
            path: `/crm/${clientType}/communications/chat`,
            icon: <MessageSquare className="w-4 h-4"/>
          },
          {
            id: "6-3",
            title: "Marketing",
            path: `/crm/${clientType}/communications/marketing`,
            icon: <Megaphone className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 7,
        title: "Lead Management",
        path: `/crm/${clientType}/leads`,
        icon: <UserPlus className="w-6 h-6"/>,
        children: [
          {
            id: "7-1",
            title: "All Leads",
            path: `/crm/${clientType}/leads`,
            icon: <UserPlus className="w-4 h-4"/>
          },
          {
            id: "7-2",
            title: "Lead Sources",
            path: `/crm/${clientType}/leads/sources`,
            icon: <Store className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 8,
        title: "Settings",
        path: `/crm/${clientType}/settings`,
        icon: <Settings className="w-6 h-6"/>,
        children: [
          {
            id: "8-1",
            title: "General Settings",
            path: `/crm/${clientType}/settings`,
            icon: <Settings className="w-4 h-4"/>
          },
          {
            id: "8-2",
            title: "Loyalty Config",
            path: `/crm/${clientType}/settings/loyalty`,
            icon: <Star className="w-4 h-4"/>
          },
          {
            id: "8-3",
            title: "Communication Templates",
            path: `/crm/${clientType}/settings/templates`,
            icon: <Mail className="w-4 h-4"/>
          }
        ]
      }
    ];
  };
  
  export default getSidebarDataForType;