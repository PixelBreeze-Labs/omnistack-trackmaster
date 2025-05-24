"use client";

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  FileText,
  Briefcase,
  Layers,
  BarChart2,
  Bot,
  MessageSquare,
  BookOpen,
  Brain,
  Zap,
  Cloud,
  UserCheck,
  ClipboardList,
  Target,
  Activity,
  Database,
  Settings,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Network,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Calendar,
  RefreshCw,
  Building2
} from 'lucide-react';

export default function StaffluentAIOverview() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [currentProcess, setCurrentProcess] = useState(0);

  const processes = [
    "Analyzing task assignments...",
    "Processing compliance data...",
    "Generating insights...",
    "Optimizing schedules...",
    "Syncing employee data...",
    "Monitoring system health..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProcess((prev) => (prev + 1) % processes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const specializedAgents = [
    { name: 'Auto Assignment Agent', icon: <Users className="h-5 w-5" />, color: 'text-blue-600' },
    { name: 'Client Communication Agent', icon: <MessageSquare className="h-5 w-5" />, color: 'text-green-600' },
    { name: 'Compliance Monitoring Agent', icon: <ShieldCheck className="h-5 w-5" />, color: 'text-purple-600' },
    { name: 'Report Generation Agent', icon: <FileText className="h-5 w-5" />, color: 'text-orange-600' },
    { name: 'Resource Request Agent', icon: <Layers className="h-5 w-5" />, color: 'text-indigo-600' },
    { name: 'Shift Optimization Agent', icon: <BarChart2 className="h-5 w-5" />, color: 'text-teal-600' }
  ];

  const supportingServices = [
    {
      name: 'Staffluent Employee Service',
      icon: <UserCheck className="h-6 w-6" />,
      description: 'Synchronizes employee data from external VenueBoost system',
      features: ['Bi-directional sync', 'Skill mapping', 'Workload tracking', 'Role management'],
      frequency: 'Every 4 hours'
    },
    {
      name: 'Staffluent Task Service',
      icon: <ClipboardList className="h-6 w-6" />,
      description: 'Synchronizes task data from external VenueBoost system',
      features: ['Task synchronization', 'Status mapping', 'Assignment tracking', 'Priority management'],
      frequency: 'Every hour'
    },
    {
      name: 'Weather Monitor Service',
      icon: <Cloud className="h-6 w-6" />,
      description: 'Monitors weather conditions for business projects and sends alerts',
      features: ['Project-based monitoring', 'Business configuration', 'Alert generation', 'API rate limiting'],
      frequency: 'Every 3 hours'
    },
    {
      name: 'Business Task Assignment Service',
      icon: <Target className="h-6 w-6" />,
      description: 'Handles manual task assignment operations and approval workflows',
      features: ['Manual assignment', 'Approval workflows', 'History tracking', 'Integration bridge'],
      frequency: 'Real-time'
    }
  ];

  const intelligenceFeatures = [
    {
      name: 'Model Registry',
      icon: <Database className="h-6 w-6" />,
      description: 'Register and manage AI models across the platform'
    },
    {
      name: 'Feature Management',
      icon: <Settings className="h-6 w-6" />,
      description: 'Store and retrieve feature data for entities'
    },
    {
      name: 'Prediction Testing',
      icon: <Target className="h-6 w-6" />,
      description: 'Test model predictions with custom input data'
    },
    {
      name: 'Insight Generation',
      icon: <Brain className="h-6 w-6" />,
      description: 'AI-powered insights for projects, tasks, and businesses'
    },
    {
      name: 'Agent Integration',
      icon: <Network className="h-6 w-6" />,
      description: 'Direct integration with existing Staffluent agents'
    },
    {
      name: 'Performance Monitoring',
      icon: <Monitor className="h-6 w-6" />,
      description: 'Track model performance and system health'
    }
  ];

  const cronJobs = [
    {
      name: 'processUnassignedTasks',
      frequency: 'Every 30 minutes',
      purpose: 'Global task assignment fallback',
      service: 'Auto Assignment',
      status: 'active'
    },
    {
      name: 'scheduledEmployeeSync',
      frequency: 'Every 4 hours',
      purpose: 'Employee data synchronization',
      service: 'Employee Service',
      status: 'active'
    },
    {
      name: 'scheduledTaskSync',
      frequency: 'Every hour',
      purpose: 'Task data synchronization',
      service: 'Task Service',
      status: 'active'
    },
    {
      name: 'processCertificationExpirations',
      frequency: 'Daily at midnight',
      purpose: 'Certification monitoring',
      service: 'Compliance',
      status: 'active'
    },
    {
      name: 'processScheduledUpdates',
      frequency: 'Daily at 9 AM',
      purpose: 'Client communication updates',
      service: 'Communication',
      status: 'active'
    },
    {
      name: 'checkWeatherForAllBusinesses',
      frequency: 'Every 3 hours',
      purpose: 'Weather monitoring',
      service: 'Weather Monitor',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Brain className="h-12 w-12 text-blue-300" />
              <h1 className="text-5xl font-bold">Staffluent AI Engine</h1>
            </div>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              A comprehensive business automation system featuring 6 specialized agents, an AI/ML Intelligence Hub, 
              supporting services, and a Knowledge Base & Chatbot System that handle various aspects of business 
              operations including task management, compliance monitoring, resource planning, communication, 
              optimization, customer support, and advanced AI-powered insights.
            </p>
            
            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Network className="h-8 w-8 text-blue-300 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Multi-Agent Architecture</h3>
                <p className="text-sm text-blue-100">Independent agents with specific responsibilities</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Brain className="h-8 w-8 text-blue-300 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">AI/ML Intelligence Hub</h3>
                <p className="text-sm text-blue-100">Centralized platform for AI model management and testing</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Building2 className="h-8 w-8 text-blue-300 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Multi-Tenant Support</h3>
                <p className="text-sm text-blue-100">Isolated environments for each registered business</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-16">
        
        {/* Specialized Agents Section */}
        <section className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Specialized Agents</h2>
                  <p className="text-gray-600">6 intelligent agents handling core business automation</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI Processing Active</span>
              </div>
            </div>

            {/* Processing Animation */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">{processes[currentProcess]}</span>
                  </p>
                  <div className="w-48 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specializedAgents.map((agent, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={agent.color}>
                      {agent.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{agent.name}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <span>Go to AI Agents Section</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Supporting Services Section */}
        <section className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-lg">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Supporting Services</h2>
                  <p className="text-gray-600">Data synchronization, monitoring, and management capabilities</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Syncing Data</span>
              </div>
            </div>

            {/* Processing Animation */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">Processing service integrations...</span>
                </div>
                <span className="text-xs text-gray-500">4 services active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportingServices.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      <div className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {service.frequency}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                <span>Go to Supporting Services</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Intelligence Hub Section */}
        <section>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">AI/ML Intelligence Hub</h2>
                <p className="text-gray-600">Comprehensive AI/ML management platform</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {intelligenceFeatures.map((feature, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-purple-600">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Key Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Model Registry & Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Feature Engineering & Extraction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Real-time Prediction Testing</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Insight Generation & Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Performance Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Agent Integration</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                <span>Go to Intelligence Hub</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Knowledge Base & Chatbot Section */}
        <section className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Knowledge Base & Chatbot System</h2>
                  <p className="text-gray-600">Intelligent customer support and information management</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full">
                <MessageSquare className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium">AI Learning Active</span>
              </div>
            </div>

            {/* Processing Animation */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 border-2 border-orange-500 rounded-full">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping absolute top-3 left-3"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-orange-600">Processing knowledge articles and training chatbot responses...</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">Natural Language Processing</span>
                    <div className="w-20 bg-gray-200 rounded-full h-1">
                      <div className="bg-orange-500 h-1 rounded-full animate-pulse" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Knowledge Base Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Database className="h-5 w-5 text-gray-600" />
                    <span className="text-sm">Intelligent article management</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Target className="h-5 w-5 text-gray-600" />
                    <span className="text-sm">Semantic search capabilities</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-gray-600" />
                    <span className="text-sm">Usage analytics & insights</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Chatbot Capabilities</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Brain className="h-5 w-5 text-gray-600" />
                    <span className="text-sm">AI-powered natural language understanding</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <span className="text-sm">Multi-channel support</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Activity className="h-5 w-5 text-gray-600" />
                    <span className="text-sm">Real-time learning & adaptation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                <span>Go to Knowledge Base & Chatbot</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Cron Jobs & Scheduling Section */}
        <section className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Cron Jobs & Scheduling</h2>
                  <p className="text-gray-600">Automated task scheduling and execution</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Scheduler Active</span>
              </div>
            </div>

            {/* Processing Animation */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid grid-cols-3 gap-1">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded animate-pulse"></div>
                    <div className="w-1.5 h-8 bg-indigo-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-4 bg-indigo-500 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Executing scheduled jobs...</span>
                </div>
                <span className="text-xs text-gray-500">6 jobs running</span>
              </div>
            </div>

            <div className="space-y-4">
              {cronJobs.map((job, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${job.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{job.name}</code>
                      </div>
                      <div className="text-sm text-gray-600">{job.purpose}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{job.service}</span>
                      <span className="text-xs text-gray-500">{job.frequency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Global Scheduled Jobs</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Task assignment fallback every 30 minutes</div>
                  <div>• Employee sync every 4 hours</div>
                  <div>• Task sync every hour</div>
                  <div>• Daily compliance checks at midnight</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Business-Specific Jobs</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Custom frequency per business</div>
                  <div>• Configurable monitoring intervals</div>
                  <div>• Template-based scheduling</div>
                  <div>• Weekly optimization and forecasts</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                <span>Go to Cron Jobs & Scheduling</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}