import React, { useState } from 'react';
import { Poll } from '@/app/api/external/omnigateway/types/polls';
import { Button } from '@/components/ui/button';
import { Sun, Moon, ChevronLeft, BarChart2 } from 'lucide-react';

interface PollPreviewProps {
  poll: Poll;
}

const PollPreview: React.FC<PollPreviewProps> = ({ poll }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(poll.darkMode);
  
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  // Get the appropriate styles based on light/dark mode
  const getStyles = () => {
    if (isDarkMode) {
      return {
        background: poll.darkModeBackground,
        text: poll.darkModeTextColor,
        optionBackground: poll.darkModeOptionBackground,
        optionHover: poll.darkModeOptionHover,
        link: poll.darkModeLinkColor,
        linkHover: poll.darkModeLinkHoverColor,
        progressBackground: poll.darkModeProgressBackground,
        radioBorder: poll.darkModeRadioBorder,
        radioCheckedBorder: poll.darkModeRadioCheckedBorder,
        radioCheckedDot: poll.darkModeRadioCheckedDot
      };
    } else {
      return {
        background: 'white',
        text: '#333333',
        optionBackground: poll.optionsBackgroundColor,
        optionHover: poll.optionsHoverColor,
        link: poll.resultsLinkColor,
        linkHover: poll.resultsLinkHoverColor,
        progressBackground: poll.progressBarBackgroundColor,
        radioBorder: poll.radioBorderColor,
        radioCheckedBorder: poll.radioCheckedBorderColor,
        radioCheckedDot: poll.radioCheckedDotColor
      };
    }
  };

  const styles = getStyles();

  const handleVote = () => {
    if (selectedOption !== null) {
      setHasVoted(true);
    }
  };

  // Toggle between light and dark mode for preview
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getProgressBarAnimation = () => {
    switch (poll.highlightAnimation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-right';
      case 'pulse':
        return 'animate-pulse';
      case 'bounce':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col">
      {/* Mode switcher */}
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleDarkMode}
          className="flex items-center gap-2"
        >
          {isDarkMode ? (
            <>
              <Sun className="h-4 w-4" />
              <span>Switch to Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              <span>Switch to Dark Mode</span>
            </>
          )}
        </Button>
      </div>

      {/* Poll container - matches WordPress preview structure */}
      <div 
        className="rounded-lg p-6 shadow-md w-full max-w-[600px] border border-gray-200"
        style={{ 
          backgroundColor: styles.background,
          color: styles.text,
          borderColor: isDarkMode ? '#444' : '#eaeaea'
        }}
      >
        {!hasVoted ? (
          <div className="poll-preview-voting">
            {/* Poll header */}
            <h3 className="text-xl font-bold mb-2">{poll.title}</h3>
            {poll.description && (
              <p className="text-sm mb-4">{poll.description}</p>
            )}

            {/* Poll options */}
            <div className="space-y-2">
              {poll.options.map((option, index) => (
                <label 
                  key={index}
                  className="flex items-center p-3 rounded-md cursor-pointer border mb-2"
                  style={{ 
                    backgroundColor: selectedOption === index ? styles.optionHover : styles.optionBackground,
                    borderColor: isDarkMode ? '#444' : '#eaeaea',
                  }}
                  onClick={() => setSelectedOption(index)}
                >
                  <div 
                    className="w-5 h-5 rounded-full border mr-3 flex items-center justify-center"
                    style={{ 
                      borderColor: selectedOption === index ? styles.radioCheckedBorder : styles.radioBorder,
                    }}
                  >
                    {selectedOption === index && (
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: styles.radioCheckedDot }}
                      />
                    )}
                  </div>
                  <span>{option.optionText}</span>
                </label>
              ))}
            </div>

            {/* Poll actions - matches WordPress layout */}
            <div className="flex items-center mt-6">
              <Button
                onClick={handleVote}
                disabled={selectedOption === null}
                className="text-white transition-colors"
                style={{ 
                  backgroundColor: poll.voteButtonColor,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = poll.voteButtonHoverColor;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = poll.voteButtonColor;
                }}
              >
                Vote
              </Button>
              
              {poll.showResults && (
                <button
                  onClick={() => setHasVoted(true)}
                  className="ml-4 flex items-center text-sm transition-colors"
                  style={{ 
                    color: styles.link,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = styles.linkHover;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = styles.link;
                  }}
                >
                  <BarChart2 className="mr-1 h-4 w-4" />
                  View Results
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="poll-preview-results">
            <h3 className="text-xl font-bold mb-2">Results</h3>
            
            <div className="space-y-4">
              {poll.options.map((option, index) => {
                const votePercentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                const optionHighlightColor = option.customHighlight || poll.highlightColor;
                
                return (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span>{option.optionText}</span>
                      <span className="font-bold">{votePercentage}%</span>
                    </div>
                    <div 
                      className="h-6 rounded-md overflow-hidden w-full"
                      style={{ backgroundColor: styles.progressBackground }}
                    >
                      <div 
                        className={`h-full ${getProgressBarAnimation()}`}
                        style={{ 
                          width: `${votePercentage}%`, 
                          backgroundColor: optionHighlightColor,
                          transition: 'width 1s ease-in-out'
                        }}
                      />
                    </div>
                    <div className="text-sm mt-1">
                      {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                    </div>
                  </div>
                );
              })}
              
              {/* Poll total votes - matches WordPress layout */}
              <div className="mt-4 pt-3 border-t text-sm" style={{ borderTopColor: isDarkMode ? '#444' : '#f5f5f5' }}>
                <p>Total votes: <strong>{totalVotes}</strong></p>
              </div>
              
              {/* Back to vote link - matches WordPress layout */}
              <div className="mt-3">
                <button
                  onClick={() => {
                    setHasVoted(false);
                    setSelectedOption(null);
                  }}
                  className="flex items-center text-sm transition-colors"
                  style={{ 
                    color: styles.link,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = styles.linkHover;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = styles.link;
                  }}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to voting
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollPreview;