import { Metadata } from "next"
import { Suspense } from "react"
import WeatherMonitoringContent from "@/components/crm/weather-monitoring/weather-monitoring-content"

export const metadata: Metadata = {
  title: "Weather Monitoring - TrackMaster CRM",
  description: "Track and manage weather monitoring for all sites",
}

export default function WeatherMonitoringPage() {
  return (
    <div className="px-3">
      <Suspense fallback={<WeatherMonitoringLoading />}>
        <WeatherMonitoringContent />
      </Suspense>
    </div>
  )
}

// Loading component to show while the page is loading
function WeatherMonitoringLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  )
}