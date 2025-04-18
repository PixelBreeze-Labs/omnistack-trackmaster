import React, { useState } from 'react';
import { Poll } from '@/app/api/external/omnigateway/types/polls';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

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

      {/* Poll container */}
      <div 
        className="rounded-lg p-6 shadow-md w-full"
        style={{ 
          backgroundColor: styles.background,
          color: styles.text
        }}
      >
        {/* Poll header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">{poll.title}</h3>
          {poll.description && (
            <p className="text-sm mb-4">{poll.description}</p>
          )}
        </div>

        {/* Poll options */}
        {!hasVoted ? (
          <div className="space-y-3">
            {poll.options.map((option, index) => (
              <div 
                key={index}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedOption === index ? 'border-2' : 'border'
                }`}
                style={{ 
                  backgroundColor: styles.optionBackground,
                  borderColor: selectedOption === index ? styles.radioCheckedBorder : styles.radioBorder,
                  transition: 'background-color 0.2s, border-color 0.2s'
                }}
                onClick={() => setSelectedOption(index)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = styles.optionHover;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = styles.optionBackground;
                }}
              >
                <div className="flex items-center">
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
                </div>
              </div>
            ))}

            <div className="mt-6">
              <Button
                onClick={handleVote}
                disabled={selectedOption === null}
                className="w-full text-white transition-colors"
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
            </div>
            
            {poll.showResults && (
              <div className="text-center mt-3">
                <button
                  onClick={() => setHasVoted(true)}
                  className="text-sm underline transition-colors"
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
                  View results without voting
                </button>
              </div>
            )}
          </div>
        ) : (
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
            
            <div className="mt-4 text-sm text-center">
              Total: {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
            </div>
            
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  setHasVoted(false);
                  setSelectedOption(null);
                }}
                className="text-sm underline transition-colors"
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
                Back to voting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollPreview;