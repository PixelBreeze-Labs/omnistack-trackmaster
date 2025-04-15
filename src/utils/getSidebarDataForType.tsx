import { 
  LayoutDashboard,
  BarChart3,
  CircleDollarSign,
  Users,
  Building2,
  Package,
  Tags,
  HelpCircle,
  Wallet,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageSquare,
  BookOpen,
  Receipt,
  UserCog,
  ShoppingBag,
  Megaphone,
  Store,
  UserCircle,
  ScrollText,
  BadgePercent,
  CalendarDays,
  LayoutTemplate,
  UserPlus,
  Star,
  DollarSign,
  List,
  Boxes,
  Gift,
  UsersRound,
  Heart,
  Layers,
  Bed,
  Calendar,
  Eye,
  Image as PImage,
  PenTool,
  Grid,
  FileImage,
  Video,
  ClipboardList,
  CreditCard,
  Coffee,
  Hotel,
  ShoppingBasket,
  Film,
  Layout,
  MapPin,
  Map,
  Bell,
  FileText,
  Sliders,
  Filter,
  Mail,
  FolderOpen,
  FolderClosed,
  Code,
  Monitor,
  Briefcase,
  Network,
  Globe,
  PanelLeft
} from 'lucide-react'

export const getSidebarDataForType = (clientType: string | undefined) => {
  if (!clientType) return {
    mainMenu: [],
    business: [],
    products: [],
    users: [],
    support: [],
    finance: [],
    settings: [],
    // VenueBoost props
    venues: [],
    ticketing: [],
    performers: [],
    guests: [],
    // PixelBreeze props
    content: [],
    media: [],
    generate: [],
    profiles: [],
    // QYTETARET props
    reports: [],
    citizens: [],
    authorities: [],
    analytics: [],
    communication: [],
    // STUDIO props
    clients: []
  }

  // Add STUDIO case
  if (clientType === 'STUDIO') {
    return {
      mainMenu: [
        {
          id: 1,
          title: "Dashboard",
          path: `/crm/platform/studio-dashboard`,
          icon: <LayoutDashboard className="w-5 h-5"/>,
        },
      ],
      clients: [
        {
          id: 3,
          title: "Client Management",
          path: `/crm/platform/os-clients`,
          icon: <Briefcase className="w-5 h-5"/>,
          children: [
            {
              id: "3-1",
              title: "Client Apps",
              path: `/crm/platform/os-clients/apps`,
              icon: <Building2 className="w-4 h-4"/>
            },
            {
              id: "3-2",
              title: "Clients",
              path: `/crm/platform/os-clients/all`,
              icon: <Clock className="w-4 h-4"/>
            },
          ]
        },
      ],
      settings: [
        {
          id: 7,
          title: "Settings",
          path: `/crm/platform/studio-settings`,
          icon: <Settings className="w-5 h-5"/>,
          children: [
            {
              id: "7-1",
              title: "User Management",
              path: `/crm/platform/studio-settings/users`,
              icon: <UserCog className="w-4 h-4"/>
            },
            {
              id: "7-2",
              title: "Studio Configuration",
              path: `/crm/platform/studio-settings/configuration`,
              icon: <Sliders className="w-4 h-4"/>
            },
            {
              id: "7-3",
              title: "Billing",
              path: `/crm/platform/studio-settings/billing`,
              icon: <CreditCard className="w-4 h-4"/>
            }
          ]
        }
      ]
    }
  }

  // Add QYTETARET case
  if (clientType === 'QYTETARET') {
    return {
      mainMenu: [
        {
          id: 1,
          title: "Dashboard",
          path: `/crm/platform/qytetaret-dashboard`,
          icon: <LayoutDashboard className="w-5 h-5"/>,
        }
      ],
      reports: [
        {
          id: 3,
          title: "Reports",
          path: `/crm/platform/reports`,
          icon: <ScrollText className="w-5 h-5"/>,
          children: [
            {
              id: "3-1",
              title: "All Reports",
              path: `/crm/platform/reports/all`,
              icon: <List className="w-4 h-4"/>
            },
            {
              id: "3-2",
              title: "Pending",
              path: `/crm/platform/reports/pending`,
              icon: <Clock className="w-4 h-4"/>
            },
            {
              id: "3-3",
              title: "In Progress",
              path: `/crm/platform/reports/in-progress`,
              icon: <AlertCircle className="w-4 h-4"/>
            },
            {
              id: "3-4",
              title: "Resolved",
              path: `/crm/platform/reports/resolved`,
              icon: <CheckCircle className="w-4 h-4"/>
            }
          ]
        },
        {
          id: 4,
          title: "Platform Settings",
          path: `/crm/platform/settings`,
          icon: <Settings className="w-5 h-5"/>,
          children: [
            {
              id: "4-1",
              title: "Categories",
              path: `/crm/platform/categories`,
              icon: <FolderOpen className="w-4 h-4"/>
            },
            {
              id: "4-2",
              title: "Report Tags",
              path: `/crm/platform/report-tags`,
              icon: <Tags className="w-4 h-4"/>
            }
          ]
        }
      ],
      citizens: [
        {
          id: 5,
          title: "Citizens",
          path: `/crm/platform/citizens`,
          icon: <Users className="w-5 h-5"/>,
          children: [
            {
              id: "5-1",
              title: "All Citizens",
              path: `/crm/platform/citizens/all`,
              icon: <Users className="w-4 h-4"/>
            },
            {
              id: "5-2",
              title: "Active Reporters",
              path: `/crm/platform/citizens/active`,
              icon: <UserCog className="w-4 h-4"/>
            }
          ]
        },
        {
          id: 6,
          title: "Engagement",
          path: `/crm/platform/engagement`,
          icon: <Heart className="w-5 h-5"/>,
        }
      ],
      authorities: [
        {
          id: 7,
          title: "Authorities",
          path: `/crm/platform/authorities`,
          icon: <Building2 className="w-5 h-5"/>,
          children: [
            {
              id: "7-1",
              title: "Local Departments",
              path: `/crm/platform/authorities/departments`,
              icon: <Building2 className="w-4 h-4"/>
            },
            {
              id: "7-2",
              title: "Response Teams",
              path: `/crm/platform/authorities/teams`,
              icon: <Users className="w-4 h-4"/>
            }
          ]
        },
        {
          id: 8,
          title: "Performance",
          path: `/crm/platform/performance`,
          icon: <BarChart3 className="w-5 h-5"/>,
          children: [
            {
              id: "8-1",
              title: "Response Time",
              path: `/crm/platform/performance/response-time`,
              icon: <Clock className="w-4 h-4"/>
            },
            {
              id: "8-2",
              title: "Resolution Rate",
              path: `/crm/platform/performance/resolution-rate`,
              icon: <BarChart3 className="w-4 h-4"/>
            }
          ]
        }
      ],
      analytics: [
        {
          id: 9,
          title: "Reports Analytics",
          path: `/crm/platform/qytetaret-analytics/reports`,
          icon: <FileText className="w-5 h-5"/>,
        },
        {
          id: 10,
          title: "Citiziens Analytics",
          path: `/crm/platform/analytics/citiziens`,
          icon: <Users className="w-5 h-5"/>,
        },
        {
          id: 11,
          title: "Geographical Data",
          path: `/crm/platform/analytics/geographical`,
          icon: <Map className="w-5 h-5"/>,
        }
      ],
      communication: [
        {
          id: 12,
          title: "Contacts",
          path: `/crm/platform/contacts`,
          icon: <Mail className="w-5 h-5"/>,
        },
        {
          id: 13,
          title: "Notifications",
          path: `/crm/platform/notifications`,
          icon: <Bell className="w-5 h-5"/>,
        },
        {
          id: 14,
          title: "Updates",
          path: `/crm/platform/updates`,
          icon: <MessageSquare className="w-5 h-5"/>,
        },
        {
          id: 15,
          title: "Email Templates",
          path: `/crm/platform/email-templates`,
          icon: <Mail className="w-5 h-5"/>,
        }
      ],
      settings: [
        {
          id: 16,
          title: "Settings",
          path: `/crm/platform/settings`,
          icon: <Settings className="w-5 h-5"/>,
          children: [
            {
              id: "16-1",
              title: "Platform Settings",
              path: `/crm/platform/settings/platform`,
              icon: <Settings className="w-4 h-4"/>
            },
            {
              id: "16-2",
              title: "Admin Users",
              path: `/crm/platform/settings/admins`,
              icon: <UserCog className="w-4 h-4"/>
            },
            {
              id: "16-3",
              title: "Configurations",
              path: `/crm/platform/settings/configurations`,
              icon: <Sliders className="w-4 h-4"/>
            }
          ]
        }
      ]
    }
  }

  if (clientType === 'SAAS') {
    // SAAS sidebar items (unchanged)
    return {
      mainMenu: [
        {
          id: 1,
          title: "Dashboard",
          path: `/crm/platform/staffluent-dashboard`,
          icon: <LayoutDashboard className="w-5 h-5"/>,
        },
        {
          id: 2,
          title: "Analytics",
          path: `/crm/platform/staffluent-analytics`,
          icon: <BarChart3 className="w-5 h-5"/>,
        }
      ],
      business: [
        {
          id: 3,
          title: "Businesses",
          path: `/crm/platform/businesses`,
          icon: <Building2 className="w-5 h-5"/>,
          children: [
            {
              id: "3-1",
              title: "All Businesses",
              path: `/crm/platform/businesses`,
              icon: <Building2 className="w-4 h-4"/>
            },
            {
              id: "3-2",
              title: "Trial Users",
              path: `/crm/platform/businesses/trials`,
              icon: <Clock className="w-4 h-4"/>
            }
          ]
        },
        {
          id: 4,
          title: "Subscriptions",
          path: `/crm/platform/subscriptions`,
          icon: <CircleDollarSign className="w-5 h-5"/>,
          children: [
            {
              id: "4-1",
              title: "Active",
              path: `/crm/platform/subscriptions/active`,
              icon: <CheckCircle className="w-4 h-4"/>
            },
            {
              id: "4-2",
              title: "Past Due",
              path: `/crm/platform/subscriptions/past-due`,
              icon: <AlertCircle className="w-4 h-4"/>
            },
            {
              id: "4-3",
              title: "Canceled",
              path: `/crm/platform/subscriptions/canceled`,
              icon: <XCircle className="w-4 h-4"/>
            }
          ]
        }
      ],
      products: [
        {
          id: 5,
          title: "Products & Pricing",
          path: `/crm/platform/stripe-products`,
          icon: <Package className="w-5 h-5"/>,
        },
        {
          id: 6,
          title: "Stripe Config",
          path: `/crm/platform/stripe-config`,
          icon: <Tags className="w-5 h-5"/>,
        },
        {
          id: 7,
          title: "Features Management",
          path: `/crm/platform/features`,
          icon: <Layers className="w-5 h-5"/>,
        }
      ],
      users: [
        {
          id: 7,
          title: "Users",
          path: `/crm/platform/users`,
          icon: <Users className="w-5 h-5"/>,
          children: [
            {
              id: "7-1",
              title: "All Users",
              path: `/crm/platform/users`,
              icon: <Users className="w-4 h-4"/>
            },
            {
              id: "7-2",
              title: "Admins",
              path: `/crm/platform/users/admins`,
              icon: <UserCog className="w-4 h-4"/>
            }
          ]
        }
      ],
      support: [
        {
          id: 8,
          title: "Support",
          path: `/crm/platform/support`,
          icon: <HelpCircle className="w-5 h-5"/>,
          children: [
            {
              id: "8-1",
              title: "Tickets",
              path: `/crm/platform/support/tickets`,
              icon: <MessageSquare className="w-4 h-4"/>
            },
            {
              id: "8-2",
              title: "Knowledge Base",
              path: `/crm/platform/support/knowledge-base`,
              icon: <BookOpen className="w-4 h-4"/>
            }
          ]
        }
      ],
      finance: [
        {
          id: 9,
          title: "Billing",
          path: `/crm/platform/billing`,
          icon: <Wallet className="w-5 h-5"/>,
          children: [
            {
              id: "9-1",
              title: "Invoices",
              path: `/crm/platform/billing/invoices`,
              icon: <Receipt className="w-4 h-4"/>
            },
            {
              id: "9-2",
              title: "Transactions",
              path: `/crm/platform/billing/transactions`,
              icon: <CircleDollarSign className="w-4 h-4"/>
            }
          ]
        }
      ],
      settings: [
        {
          id: 10,
          title: "Settings",
          path: `/crm/platform/settings`,
          icon: <Settings className="w-5 h-5"/>,
        }
      ]
    }
  }

  if (clientType === 'BOOKING') {
    return {
      mainMenu: [
        {
          id: 1,
          title: "Dashboard",
          path: `/crm/platform/booking-dashboard`,
          icon: <LayoutDashboard className="w-5 h-5"/>,
        },
        {
          id: 2,
          title: "Analytics",
          path: `/crm/platform/booking-analytics`,
          icon: <BarChart3 className="w-5 h-5"/>,
        }
      ],
      sales: [
        {
          id: 3,
          title: "Bookings",
          path: `/crm/platform/bookings`,
          icon: <Calendar className="w-5 h-5"/>,
        },
        {
          id: 4,
          title: "Rental Units",
          path: `/crm/platform/rental-units`,
          icon: <Bed className="w-5 h-5"/>,
        }
      ],
      crm: [
        {
          id: 5,
          title: "Guests Management",
          path: `/crm/platform/guests-management`,
          icon: <Users className="w-5 h-5"/>,
          children: [
            {
              id: "5-1",
              title: "Guests",
              path: `/crm/platform/guests`,
              icon: <Users className="w-4 h-4"/>
            },
            {
              id: "5-2",
              title: "Guest Insights",
              path: `/crm/platform/guest-insights`,
              icon: <Eye className="w-4 h-4"/>
            },
            {
              id: "5-3",
              title: "Guest Preferences",
              path: `/crm/platform/guest-preferences`,
              icon: <Star className="w-4 h-4"/>
            },
            {
              id: "5-4",
              title: "Check-in Forms",
              path: `/crm/platform/checkin-forms`,
              icon: <FileText className="w-4 h-4"/>
            }
          ]
        },
        {
          id: 6,
          title: "Messages",
          path: `/crm/platform/messages`,
          icon: <MessageSquare className="w-5 h-5"/>,
        }
      ],
      marketing: [
        {
          id: 7,
          title: "Promotions",
          path: `/crm/platform/general-promotions`,
          icon: <BadgePercent className="w-5 h-5"/>,
        },
        {
          id: 8,
          title: "Campaigns",
          path: `/crm/platform/general-campaigns`,
          icon: <Megaphone className="w-5 h-5"/>,
        }
      ],
      loyalty: [
        {
          id: 9,
          title: "Manage Programs",
          path: `/crm/platform/loyalty/programs`,
          icon: <Boxes className="w-5 h-5"/>,
        },
        {
          id: 10,
          title: "Points & Rewards",
          path: `/crm/platform/loyalty/points`,
          icon: <Star className="w-5 h-5"/>,
        },
        {
          id: 11,
          title: "Benefits",
          path: `/crm/platform/loyalty/benefits`,
          icon: <Gift className="w-5 h-5"/>,
        }
      ],
      communication: [
        {
          id: 12,
          title: "Whitelabel",
          path: `/crm/platform/whitelabel`,
          icon: <LayoutTemplate className="w-5 h-5"/>,
        },
      ],
      finance: [
        {
          id: 13,
          title: "Transactions",
          path: `/crm/platform/finance/transactions`,
          icon: <Wallet className="w-5 h-5"/>,
        }
      ],
      hr: [
        {
          id: 13,
          title: "Staff",
          path: `/crm/platform/hr/staff`,
          icon: <Building2 className="w-5 h-5"/>,
        },
        {
          id: 14,
          title: "Settings",
          path: `/crm/platform/settings`,
          icon: <Settings className="w-5 h-5"/>,
        }
      ]
    }
  }
  
  if (clientType === 'VENUEBOOST') {
    return {
      mainMenu: [
        {
          id: 1,
          title: "Dashboard",
          path: `/crm/platform/venueboost-dashboard`,
          icon: <LayoutDashboard className="w-5 h-5"/>,
        },
        {
          id: 2,
          title: "Analytics",
          path: `/crm/platform/venueboost-analytics`,
          icon: <BarChart3 className="w-5 h-5"/>,
        }
      ],
      business: [
        {
          id: 3,
          title: "Businesses",
          path: `/crm/platform/venueboost-businesses`,
          icon: <Building2 className="w-5 h-5"/>,
          children: [
            {
              id: "3-1",
              title: "All Businesses",
              path: `/crm/platform/venueboost-businesses`,
              icon: <Building2 className="w-4 h-4"/>
            },
            {
              id: "3-2",
              title: "Trial Users",
              path: `/crm/platform/venueboost-businesses/trials`,
              icon: <Clock className="w-4 h-4"/>
            }
          ]
        },
        {
          id: 4,
          title: "Subscriptions",
          path: `/crm/platform/venueboost-subscriptions`,
          icon: <CircleDollarSign className="w-5 h-5"/>,
          children: [
            {
              id: "4-1",
              title: "Active",
              path: `/crm/platform/venueboost-subscriptions/active`,
              icon: <CheckCircle className="w-4 h-4"/>
            },
            {
              id: "4-2",
              title: "Past Due",
              path: `/crm/platform/venueboost-subscriptions/past-due`,
              icon: <AlertCircle className="w-4 h-4"/>
            },
            {
              id: "4-3",
              title: "Canceled",
              path: `/crm/platform/venueboost-subscriptions/canceled`,
              icon: <XCircle className="w-4 h-4"/>
            }
          ]
        }
      ],
      products: [
        {
          id: 5,
          title: "Products",
          path: `/crm/platform/venueboost-products`,
          icon: <Package className="w-5 h-5"/>,
        }
      ],
      venues: [
        {
          id: 6,
          title: "Food & Beverage",
          path: `/crm/platform/venues/food-beverage`,
          icon: <Coffee className="w-5 h-5"/>,
        },
        {
          id: 7,
          title: "Accommodation",
          path: `/crm/platform/venues/accommodation`,
          icon: <Hotel className="w-5 h-5"/>,
        },
        {
          id: 8,
          title: "Retail Management",
          path: `/crm/platform/venues/retail`,
          icon: <ShoppingBasket className="w-5 h-5"/>,
        },
        {
          id: 9,
          title: "Entertainment Venues",
          path: `/crm/platform/venues/entertainment`,
          icon: <Film className="w-5 h-5"/>,
        }
      ],
      communication: [
        {
          id: 10,
          title: "Whitelabel",
          path: `/crm/platform/whitelabel/solutions`,
          icon: <LayoutTemplate className="w-5 h-5"/>,
          children: [
            {
              id: "10-1",
              title: "Solutions",
              path: `/crm/platform/whitelabel/solutions`,
              icon: <Layout className="w-4 h-4"/>
            },
            {
              id: "10-2",
              title: "Configuration",
              path: `/crm/platform/whitelabel/configuration`,
              icon: <Settings className="w-4 h-4"/>
            }
          ]
        }
      ],
      hr: [
        {
          id: 11,
          title: "HR",
          path: `/crm/platform/venueboost-hr`,
          icon: <Users className="w-5 h-5"/>,
        }
      ],
      finance: [
        {
          id: 12,
          title: "Finance",
          path: `/crm/platform/venueboost-finance`,
          icon: <Wallet className="w-5 h-5"/>,
        }
      ],
      settings: [
        {
          id: 13,
          title: "Settings",
          path: `/crm/platform/venueboost-settings`,
          icon: <Settings className="w-5 h-5"/>,
        }
      ]
    }
  }

  if (clientType === 'PIXELBREEZE') {
    return {
      mainMenu: [
        {
          id: 1,
          title: "Dashboard",
          path: `/crm/platform/pixelbreeze-dashboard`,
          icon: <LayoutDashboard className="w-5 h-5"/>,
        },
        {
          id: 2,
          title: "Analytics",
          path: `/crm/platform/pixelbreeze-analytics`,
          icon: <BarChart3 className="w-5 h-5"/>,
        }
      ],
      content: [
        {
          id: 3,
          title: "Templates",
          path: `/crm/platform/templates`,
          icon: <FileImage className="w-5 h-5"/>,
          children: [
            {
              id: "3-1",
              title: "All Templates",
              path: `/crm/platform/templates/all`,
              icon: <Grid className="w-4 h-4"/>
            }
          ]
        }
      ],
      media: [
        {
          id: 4,
          title: "Images",
          path: `/crm/platform/media/images`,
          icon: <PImage className="w-5 h-5"/>,
        },
        {
          id: 5,
          title: "Videos",
          path: `/crm/platform/media/videos`,
          icon: <Video className="w-5 h-5"/>,
        }
      ],
      generate: [
        {
          id: 6,
          title: "Images",
          path: `/crm/platform/generate/images`,
          icon: <PenTool className="w-5 h-5"/>,
        }
      ],
      profiles: [
        {
          id: 7,
          title: "Social Profiles",
          path: `/crm/platform/social-profiles`,
          icon: <Users className="w-5 h-5"/>,
          children: [
            {
              id: "7-1",
              title: "List",
              path: `/crm/platform/social-profiles/list`,
              icon: <List className="w-4 h-4"/>
            }
          ]
        },
        {
          id: 8,
          title: "Operating Entities",
          path: `/crm/platform/operating-entities`,
          icon: <ClipboardList className="w-5 h-5"/>,
          children: [
            {
              id: "7-1",
              title: "List",
              path: `/crm/platform/operating-entities/list`,
              icon: <List className="w-4 h-4"/>
            }
          ]
        }
      ],
      settings: [
        {
          id: 9,
          title: "Settings",
          path: `/crm/platform/settings`,
          icon: <Settings className="w-5 h-5"/>,
          children: [
            {
              id: "8-1",
              title: "Users",
              path: `/crm/platform/settings/users`,
              icon: <Users className="w-4 h-4"/>
            }
          ]
        }
      ],
      finance: [
        {
          id: 10,
          title: "Billing",
          path: `/crm/platform/billing`,
          icon: <CreditCard className="w-5 h-5"/>,
        }
      ]
    }
  }
  
  // Default return for other client types
  return {
    mainMenu: [
      {
        id: 1,
        title: "Dashboard",
        path: `/crm/platform/dashboard`,
        icon: <LayoutDashboard className="w-5 h-5"/>,
      },
      {
        id: 2,
        title: "Analytics",
        path: `/crm/platform/analytics`,
        icon: <BarChart3 className="w-5 h-5"/>,
      },
      {
        id: 3,
        title: "Sales",
        path: `/crm/platform/sales-overview`,
        icon: <CircleDollarSign className="w-5 h-5"/>,
      },
      {
        id: 4,
        title: "Marketing",
        path: `/crm/platform/marketing-overview`,
        icon: <Megaphone className="w-5 h-5"/>,
      }
    ],
    sales: [
      {
        id: 5,
        title: "Orders",
        path: `/crm/platform/orders`,
        icon: <ShoppingBag className="w-5 h-5"/>,
        children: [
          {
            id: "5-1",
            title: "All Orders",
            path: `/crm/platform/orders`,
            icon: <Package className="w-4 h-4"/>
          },
          {
            id: "5-2",
            title: "Omni-channel Orders",
            path: `/crm/platform/orders/omnichannel`,
            icon: <Store className="w-4 h-4"/>
          },
          {
            id: "5-3",
            title: "Returns & Refunds",
            path: `/crm/platform/orders/returns`,
            icon: <Receipt className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 6,
        title: "Sales Associates",
        path: `/crm/platform/sales-team`,
        icon: <UserCog className="w-5 h-5"/>,
        children: [
          {
            id: "6-1",
            title: "Team",
            path: `/crm/platform/sales-team/members`,
            icon: <Users className="w-4 h-4"/>
          },
          {
            id: "6-2",
            title: "Performance",
            path: `/crm/platform/sales-team/performance`,
            icon: <BarChart3 className="w-4 h-4"/>
          },
          {
            id: "6-3",
            title: "Customer Assignment",
            path: `/crm/platform/sales-team/assignments`,
            icon: <UserCircle className="w-4 h-4"/>
          }
        ]
      }
    ],
    crm: [
      {
        id: 7,
        title: "Customers",
        path: `/crm/platform/customers`,
        icon: <Users className="w-5 h-5"/>,
        children: [
          {
            id: "7-1",
            title: "All Customers",
            path: `/crm/platform/customers`,
            icon: <Users className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 8,
        title: "Members",
        path: `/crm/platform/members`,
        icon: <UsersRound className="w-5 h-5"/>,
      },
      {
        id: 9,
        title: "Family Accounts",
        path: `/crm/platform/family-accounts`,
        icon: <Users className="w-5 h-5"/>,
      },
      {
        id: 10,
        title: "Gifts Advisory",
        path: `/crm/platform/gifts`,
        icon: <Gift className="w-5 h-5"/>,
      },
      {
        id: 11,
        title: "Customer Feedback",
        path: `/crm/platform/feedback`,
        icon: <Heart className="w-5 h-5"/>,
      }
    ],
    marketing: [
      {
        id: 12,
        title: "Promotions",
        path: `/crm/platform/promotions`,
        icon: <Tags className="w-5 h-5"/>,
        children: [
          {
            id: "12-1",
            title: "List",
            path: `/crm/platform/promotions`,
            icon: <ScrollText className="w-4 h-4"/>
          },
          {
            id: "12-2",
            title: "Discounts",
            path: `/crm/platform/promotions/discounts`,
            icon: <BadgePercent className="w-4 h-4"/>
          },
          {
            id: "12-3",
            title: "Coupons",
            path: `/crm/platform/promotions/coupons`,
            icon: <Tags className="w-4 h-4"/>
          },
          {
            id: "12-4",
            title: "Calendar",
            path: `/crm/platform/promotions/calendar`,
            icon: <CalendarDays className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 13,
        title: "Campaigns",
        path: `/crm/platform/campaigns`,
        icon: <Megaphone className="w-5 h-5"/>,
        children: [
          {
            id: "13-1",
            title: "List",
            path: `/crm/platform/campaigns`,
            icon: <ScrollText className="w-4 h-4"/>
          },
          {
            id: "13-2",
            title: "Create",
            path: `/crm/platform/campaigns/create`,
            icon: <LayoutTemplate className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 14,
        title: "Landing",
        path: `/crm/platform/landing`,
        icon: <LayoutTemplate className="w-5 h-5"/>,
        children: [
          {
            id: "14-1",
            title: "Registration",
            path: `/crm/platform/landing/list`,
            icon: <UserPlus className="w-4 h-4"/>
          },
          {
            id: "14-2",
            title: "My Club",
            path: `/crm/platform/landing/myclub`,
            icon: <Star className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 15,
        title: "Paid Campagins",
        path: `/crm/platform/paid-campaigns`,
        icon: <DollarSign className="w-5 h-5"/>,
        children: [
          {
            id: "14-1",
            title: "List",
            path: `/crm/platform/paid-campaigns`,
            icon: <List className="w-4 h-4"/>
          },
        ]
      }
    ],
    loyalty: [
      {
        id: 16,
        title: "Manage Programs",
        path: `/crm/platform/loyalty/programs`,
        icon: <Boxes className="w-5 h-5"/>,
      },
      {
        id: 17,
        title: "Points & Rewards",
        path: `/crm/platform/loyalty/points`,
        icon: <Star className="w-5 h-5"/>,
      },
      {
        id: 18,
        title: "Benefits",
        path: `/crm/platform/loyalty/benefits`,
        icon: <Gift className="w-5 h-5"/>,
      }
    ],
    communication: [
      {
        id: 19,
        title: "OneBox",
        path: `/crm/platform/onebox`,
        icon: <MessageSquare className="w-5 h-5"/>,
      },
      {
        id: 20,
        title: "Help Center",
        path: `/crm/platform/help-center`,
        icon: <HelpCircle className="w-5 h-5"/>,
      },
      {
        id: 21,
        title: "Resources",
        path: `/crm/platform/resources`,
        icon: <BookOpen className="w-5 h-5"/>,
      }
    ],
    finance: [
      {
        id: 22,
        title: "Transactions",
        path: `/crm/platform/finance/transactions`,
        icon: <Wallet className="w-5 h-5"/>,
      }
    ],
    hr: [
      {
        id: 23,
        title: "Staff",
        path: `/crm/platform/hr/staff`,
        icon: <Building2 className="w-5 h-5"/>,
      },
      {
        id: 24,
        title: "Settings",
        path: `/crm/platform/settings`,
        icon: <Settings className="w-5 h-5"/>,
      }
    ]
  };
}

export default getSidebarDataForType