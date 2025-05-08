// GenerationProgressTimer.tsx
import { useState, useEffect } from 'react';

interface GenerationProgressTimerProps {
  isGenerating: boolean;
  onComplete?: (time: number) => void;
  showProgress?: boolean;
  estimatedTime?: number; // in milliseconds, used for progress estimation
  hasError?: boolean; // new prop to indicate an error occurred
  errorMessage?: string; // optional error message to display
}

const GenerationProgressTimer: React.FC<GenerationProgressTimerProps> = ({ 
  isGenerating,
  onComplete,
  showProgress = true,
  estimatedTime = 5000, // default 5 seconds
  hasError = false,
  errorMessage
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'generating' | 'complete' | 'error'>('idle');

  // Format time as seconds with one decimal place
  const formatTime = (timeMs: number): string => {
    const seconds = (timeMs / 1000).toFixed(1);
    return `${seconds}s`;
  };

  // Handle status updates based on props
  useEffect(() => {
    if (hasError) {
      setStatus('error');
      setTimerActive(false);
      
      // Only call onComplete if we have a start time
      if (startTime) {
        const finalTime = Date.now() - startTime;
        if (onComplete) {
          onComplete(finalTime);
        }
      }
    } else if (isGenerating) {
      setStatus('generating');
    } else if (elapsedTime > 0) {
      setStatus('complete');
    } else {
      setStatus('idle');
    }
  }, [isGenerating, hasError, elapsedTime, startTime, onComplete]);

  // Handle timer start/stop based on generation state
  useEffect(() => {
    if (isGenerating && !timerActive && !hasError) {
      // Start timer
      setElapsedTime(0);
      setProgressPercent(0);
      setStartTime(Date.now());
      setTimerActive(true);
    } else if ((!isGenerating || hasError) && timerActive) {
      // Stop timer
      setTimerActive(false);
      
      // Set progress to 100% if complete, or to current percentage if error
      setProgressPercent(hasError ? progressPercent : 100);
      
      const finalTime = startTime ? Date.now() - startTime : 0;
      if (onComplete) {
        onComplete(finalTime);
      }
    }
  }, [isGenerating, timerActive, onComplete, startTime, hasError, progressPercent]);

  // Update timer and progress every 100ms
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && startTime) {
      interval = setInterval(() => {
        const currentTime = Date.now() - startTime;
        setElapsedTime(currentTime);
        
        // Calculate and update progress percentage
        // Progress is artificially capped at 95% until completion
        const calculatedProgress = Math.min(95, (currentTime / estimatedTime) * 100);
        setProgressPercent(calculatedProgress);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, startTime, estimatedTime]);

  // If idle with no elapsed time, don't show anything
  if (status === 'idle' && elapsedTime === 0) {
    return null;
  }

  // Progress bar color based on status
  const getProgressColor = () => {
    if (status === 'error') return 'bg-red-500'; // Error
    if (status === 'complete') return 'bg-green-500'; // Complete
    if (elapsedTime > estimatedTime * 1.5) return 'bg-red-500'; // Taking too long
    if (elapsedTime > estimatedTime) return 'bg-yellow-500'; // Taking longer than expected
    return 'bg-blue-500'; // Normal progress
  };

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between text-sm font-medium">
        <div className="flex items-center space-x-1 text-primary-600">
          {status === 'generating' && (
            <svg 
              className="w-4 h-4 animate-pulse" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
          <span>
            {status === 'generating' && `Generating: ${formatTime(elapsedTime)}`}
            {status === 'complete' && `Generated in ${formatTime(elapsedTime)}`}
            {status === 'error' && `Failed after ${formatTime(elapsedTime)}`}
          </span>
        </div>
        
        {/* Status indicator */}
        {status === 'complete' && (
          <span className="text-green-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Complete
          </span>
        )}
        
        {status === 'error' && (
          <span className="text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Failed
          </span>
        )}
      </div>
      
      {/* Error message if provided */}
      {status === 'error' && errorMessage && (
        <div className="text-xs text-red-600 mt-1 mb-2">
          {/* Replace <br /> tags with proper line breaks */}
          {errorMessage.split('<br />').map((line, index) => (
            <p key={index} className="mb-1">{line}</p>
          ))}
        </div>
      )}
      
      {showProgress && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-300 ease-out ${getProgressColor()}`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default GenerationProgressTimer;