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
  Heart
} from 'lucide-react'

export const getSidebarDataForType = (clientType: string | undefined) => {
  if (!clientType) return {
    mainMenu: [],
    business: [],
    products: [],
    users: [],
    support: [],
    finance: [],
    settings: []
  }

  console.log('clientType', clientType);
  if (clientType === 'SAAS') {
    return {
      mainMenu: [
        {
          id: 1,
          title: "Dashboard",
          path: `/crm/${clientType}/dashboard`,
          icon: <LayoutDashboard className="w-5 h-5"/>,
        },
        {
          id: 2,
          title: "Analytics",
          path: `/crm/${clientType}/analytics`,
          icon: <BarChart3 className="w-5 h-5"/>,
        }
      ],
      business: [
        {
          id: 3,
          title: "Businesses",
          path: `/crm/${clientType}/businesses`,
          icon: <Building2 className="w-5 h-5"/>,
          children: [
            {
              id: "3-1",
              title: "All Businesses",
              path: `/crm/${clientType}/businesses`,
              icon: <Building2 className="w-4 h-4"/>
            },
            {
              id: "3-2",
              title: "Trial Users",
              path: `/crm/${clientType}/businesses/trials`,
              icon: <Clock className="w-4 h-4"/>
            }
          ]
        },
        {
          id: 4,
          title: "Subscriptions",
          path: `/crm/${clientType}/subscriptions`,
          icon: <CircleDollarSign className="w-5 h-5"/>,
          children: [
            {
              id: "4-1",
              title: "Active",
              path: `/crm/${clientType}/subscriptions/active`,
              icon: <CheckCircle className="w-4 h-4"/>
            },
            {
              id: "4-2",
              title: "Past Due",
              path: `/crm/${clientType}/subscriptions/past-due`,
              icon: <AlertCircle className="w-4 h-4"/>
            },
            {
              id: "4-3",
              title: "Canceled",
              path: `/crm/${clientType}/subscriptions/canceled`,
              icon: <XCircle className="w-4 h-4"/>
            }
          ]
        }
      ],
      products: [
        {
          id: 5,
          title: "Products",
          path: `/crm/${clientType}/products`,
          icon: <Package className="w-5 h-5"/>,
        },
        {
          id: 6,
          title: "Pricing Plans",
          path: `/crm/${clientType}/pricing`,
          icon: <Tags className="w-5 h-5"/>,
        }
      ],
      users: [
        {
          id: 7,
          title: "Users",
          path: `/crm/${clientType}/users`,
          icon: <Users className="w-5 h-5"/>,
          children: [
            {
              id: "7-1",
              title: "All Users",
              path: `/crm/${clientType}/users`,
              icon: <Users className="w-4 h-4"/>
            },
            {
              id: "7-2",
              title: "Admins",
              path: `/crm/${clientType}/users/admins`,
              icon: <UserCog className="w-4 h-4"/>
            }
          ]
        }
      ],
      support: [
        {
          id: 8,
          title: "Support",
          path: `/crm/${clientType}/support`,
          icon: <HelpCircle className="w-5 h-5"/>,
          children: [
            {
              id: "8-1",
              title: "Tickets",
              path: `/crm/${clientType}/support/tickets`,
              icon: <MessageSquare className="w-4 h-4"/>
            },
            {
              id: "8-2",
              title: "Knowledge Base",
              path: `/crm/${clientType}/support/knowledge-base`,
              icon: <BookOpen className="w-4 h-4"/>
            }
          ]
        }
      ],
      finance: [
        {
          id: 9,
          title: "Billing",
          path: `/crm/${clientType}/billing`,
          icon: <Wallet className="w-5 h-5"/>,
          children: [
            {
              id: "9-1",
              title: "Invoices",
              path: `/crm/${clientType}/billing/invoices`,
              icon: <Receipt className="w-4 h-4"/>
            },
            {
              id: "9-2",
              title: "Transactions",
              path: `/crm/${clientType}/billing/transactions`,
              icon: <CircleDollarSign className="w-4 h-4"/>
            }
          ]
        }
      ],
      settings: [
        {
          id: 10,
          title: "Settings",
          path: `/crm/${clientType}/settings`,
          icon: <Settings className="w-5 h-5"/>,
        }
      ]
    }
  }

  
  return {
    mainMenu: [
      {
        id: 1,
        title: "Dashboard",
        path: `/crm/${clientType}/dashboard`,
        icon: <LayoutDashboard className="w-5 h-5"/>,
      },
      {
        id: 2,
        title: "Analytics",
        path: `/crm/${clientType}/analytics`,
        icon: <BarChart3 className="w-5 h-5"/>,
      },
      {
        id: 3,
        title: "Sales",
        path: `/crm/${clientType}/sales-overview`,
        icon: <CircleDollarSign className="w-5 h-5"/>,
      },
      {
        id: 4,
        title: "Marketing",
        path: `/crm/${clientType}/marketing-overview`,
        icon: <Megaphone className="w-5 h-5"/>,
      }
    ],
    sales: [
      {
        id: 5,
        title: "Orders",
        path: `/crm/${clientType}/orders`,
        icon: <ShoppingBag className="w-5 h-5"/>,
        children: [
          {
            id: "5-1",
            title: "All Orders",
            path: `/crm/${clientType}/orders`,
            icon: <Package className="w-4 h-4"/>
          },
          {
            id: "5-2",
            title: "Omni-channel Orders",
            path: `/crm/${clientType}/orders/omnichannel`,
            icon: <Store className="w-4 h-4"/>
          },
          {
            id: "5-3",
            title: "Returns & Refunds",
            path: `/crm/${clientType}/orders/returns`,
            icon: <Receipt className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 6,
        title: "Sales Associates",
        path: `/crm/${clientType}/sales-team`,
        icon: <UserCog className="w-5 h-5"/>,
        children: [
          {
            id: "6-1",
            title: "Team",
            path: `/crm/${clientType}/sales-team/members`,
            icon: <Users className="w-4 h-4"/>
          },
          {
            id: "6-2",
            title: "Performance",
            path: `/crm/${clientType}/sales-team/performance`,
            icon: <BarChart3 className="w-4 h-4"/>
          },
          {
            id: "6-3",
            title: "Customer Assignment",
            path: `/crm/${clientType}/sales-team/assignments`,
            icon: <UserCircle className="w-4 h-4"/>
          }
        ]
      }
    ],
    crm: [
      {
        id: 7,
        title: "Customers",
        path: `/crm/${clientType}/customers`,
        icon: <Users className="w-5 h-5"/>,
        children: [
          {
            id: "7-1",
            title: "All Customers",
            path: `/crm/${clientType}/customers`,
            icon: <Users className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 8,
        title: "Members",
        path: `/crm/${clientType}/members`,
        icon: <UsersRound className="w-5 h-5"/>,
      },
      {
        id: 9,
        title: "Family Accounts",
        path: `/crm/${clientType}/family-accounts`,
        icon: <Users className="w-5 h-5"/>,
      },
      {
        id: 10,
        title: "Gifts Advisory",
        path: `/crm/${clientType}/gifts`,
        icon: <Gift className="w-5 h-5"/>,
      },
      {
        id: 11,
        title: "Customer Feedback",
        path: `/crm/${clientType}/feedback`,
        icon: <Heart className="w-5 h-5"/>,
      }
    ],
    marketing: [
      {
        id: 12,
        title: "Promotions",
        path: `/crm/${clientType}/promotions`,
        icon: <Tags className="w-5 h-5"/>,
        children: [
          {
            id: "12-1",
            title: "List",
            path: `/crm/${clientType}/promotions`,
            icon: <ScrollText className="w-4 h-4"/>
          },
          {
            id: "12-2",
            title: "Discounts",
            path: `/crm/${clientType}/promotions/discounts`,
            icon: <BadgePercent className="w-4 h-4"/>
          },
          {
            id: "12-3",
            title: "Coupons",
            path: `/crm/${clientType}/promotions/coupons`,
            icon: <Tags className="w-4 h-4"/>
          },
          {
            id: "12-4",
            title: "Calendar",
            path: `/crm/${clientType}/promotions/calendar`,
            icon: <CalendarDays className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 13,
        title: "Campaigns",
        path: `/crm/${clientType}/campaigns`,
        icon: <Megaphone className="w-5 h-5"/>,
        children: [
          {
            id: "13-1",
            title: "List",
            path: `/crm/${clientType}/campaigns`,
            icon: <ScrollText className="w-4 h-4"/>
          },
          {
            id: "13-2",
            title: "Create",
            path: `/crm/${clientType}/campaigns/create`,
            icon: <LayoutTemplate className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 14,
        title: "Landing",
        path: `/crm/${clientType}/landing`,
        icon: <LayoutTemplate className="w-5 h-5"/>,
        children: [
          {
            id: "14-1",
            title: "Registration",
            path: `/crm/${clientType}/landing/list`,
            icon: <UserPlus className="w-4 h-4"/>
          },
          {
            id: "14-2",
            title: "My Club",
            path: `/crm/${clientType}/landing/myclub`,
            icon: <Star className="w-4 h-4"/>
          }
        ]
      },
      {
        id: 15,
        title: "Paid Campagins",
        path: `/crm/${clientType}/paid-campaigns`,
        icon: <DollarSign className="w-5 h-5"/>,
        children: [
          {
            id: "14-1",
            title: "List",
            path: `/crm/${clientType}/paid-campaigns`,
            icon: <List className="w-4 h-4"/>
          },
        ]
      }
    ],
    loyalty: [
      {
        id: 16,
        title: "Manage Programs",
        path: `/crm/${clientType}/loyalty/programs`,
        icon: <Boxes className="w-5 h-5"/>,
      },
      {
        id: 17,
        title: "Points & Rewards",
        path: `/crm/${clientType}/loyalty/points`,
        icon: <Star className="w-5 h-5"/>,
      },
      {
        id: 18,
        title: "Benefits",
        path: `/crm/${clientType}/loyalty/benefits`,
        icon: <Gift className="w-5 h-5"/>,
      }
    ],
    communication: [
      {
        id: 19,
        title: "OneBox",
        path: `/crm/${clientType}/onebox`,
        icon: <MessageSquare className="w-5 h-5"/>,
      },
      {
        id: 20,
        title: "Help Center",
        path: `/crm/${clientType}/help-center`,
        icon: <HelpCircle className="w-5 h-5"/>,
      },
      {
        id: 21,
        title: "Resources",
        path: `/crm/${clientType}/resources`,
        icon: <BookOpen className="w-5 h-5"/>,
      }
    ],
    finance: [
      {
        id: 22,
        title: "Transactions",
        path: `/crm/${clientType}/finance/transactions`,
        icon: <Wallet className="w-5 h-5"/>,
      }
    ],
    hr: [
      {
        id: 23,
        title: "Staff",
        path: `/crm/${clientType}/hr/staff`,
        icon: <Building2 className="w-5 h-5"/>,
      },
      {
        id: 24,
        title: "Settings",
        path: `/crm/${clientType}/settings`,
        icon: <Settings className="w-5 h-5"/>,
      }
    ]
  };
}

export default getSidebarDataForType