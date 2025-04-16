import React, { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import GitHubButton from "@/components/GitHubButton";
import StepCard from "@/components/StepCard";
import Accordion from "@/components/Accordion";

interface SignupFlowProps {
  initialUserName?: string;
}

const SignupFlow: React.FC<SignupFlowProps> = ({ initialUserName = "TEAM" }) => {
  const [userName, setUserName] = useState(initialUserName);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGithubAuthorized, setIsGithubAuthorized] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = () => {
    setIsLoading(true);
    setErrorMessage("");
    
    // Simulate GitHub login with a small delay to show loading state
    setTimeout(() => {
      setIsGithubAuthorized(true);
      setCurrentStep(2);
      setIsLoading(false);
    }, 800);
  };

  const handleEmailLogin = () => {
    setIsLoading(true);
    setErrorMessage("");
    
    if (!email.includes('@') || password.length < 6) {
      setErrorMessage("Please enter a valid email and password (min 6 characters)");
      setIsLoading(false);
      return;
    }
    
    // Simulate email login with a small delay
    setTimeout(() => {
      setIsGithubAuthorized(true);
      setCurrentStep(2);
      setIsLoading(false);
    }, 800);
  };

  const handleCreateRepo = () => {
    if (!repoName.trim()) return;
    
    setIsLoading(true);
    setErrorMessage("");
    
    // Validate repo name (only letters, numbers, hyphens)
    if (!/^[a-zA-Z0-9-]+$/.test(repoName)) {
      setErrorMessage("Repository name can only contain letters, numbers, and hyphens");
      setIsLoading(false);
      return;
    }
    
    // Simulate repo creation with a small delay
    setTimeout(() => {
      setCurrentStep(3);
      setIsLoading(false);
    }, 800);
  };

  // Function to copy git command to clipboard
  const copyGitCommand = () => {
    const command = `git clone https://github.com/${userName}/${repoName || "docs"}.git`;
    
    try {
      navigator.clipboard.writeText(command);
      
      // Show copy feedback by temporarily changing button text
      const button = document.getElementById('copy-button');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('bg-white', 'text-black');
        button.classList.remove('bg-gray-700', 'text-gray-300');
        
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('bg-white', 'text-black');
          button.classList.add('bg-gray-700', 'text-gray-300');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      
      // Show error message
      const button = document.getElementById('copy-button');
      if (button) {
        button.textContent = 'Copy failed';
        button.classList.add('bg-red-600');
        
        setTimeout(() => {
          button.textContent = 'Copy';
          button.classList.remove('bg-red-600');
        }, 2000);
      }
    }
  };

  const resetStep = (stepToReset: number) => {
    switch (stepToReset) {
      case 1:
        setIsGithubAuthorized(false);
        setEmail("");
        setPassword("");
        setCurrentStep(1);
        break;
      case 2:
        setRepoName("");
        setCurrentStep(2);
        break;
      default:
        break;
    }
  };

  // Track current step for progress indicator
  useEffect(() => {
    // Automatically scroll to active step
    const activeStep = document.querySelector(`[data-step="${currentStep}"]`);
    if (activeStep) {
      setTimeout(() => {
        activeStep.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col items-start w-full">
      <Logo />
      
      <h1 className="text-2xl font-bold mb-1">Hello, {userName}</h1>
      <p className="text-gray-400 mb-2">Let's set up your first documentation deployment</p>
      
      <StepCard 
        stepNumber={1} 
        title="Sign in with GitHub" 
        active={currentStep === 1}
        completed={currentStep > 1}
      >
        <p className="mb-4">To get started, log in with your GitHub account</p>
        
        {!isGithubAuthorized ? (
          <>
            <GitHubButton 
              onClick={handleGitHubLogin}
              disabled={isLoading}
            >
              {isLoading && currentStep === 1 ? "Connecting..." : "Login with GitHub"}
            </GitHubButton>
            
            <div className="mt-4 w-full">
              <Accordion title="Don't want to authorize GitHub OAuth?">
                <div className="flex flex-col space-y-3 animate-slide-up opacity-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                  />
                  <button 
                    onClick={handleEmailLogin}
                    disabled={isLoading}
                    className="w-full py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading && currentStep === 1 ? "Connecting..." : "Continue with Email"}
                  </button>
                  
                  {errorMessage && (
                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                  )}
                </div>
              </Accordion>
            </div>
          </>
        ) : (
          <div className="text-white flex items-center animate-slide-up">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            GitHub account connected successfully
          </div>
        )}
        
        {currentStep > 1 && (
          <div className="text-xs text-white hover:underline mt-2 cursor-pointer" 
               onClick={() => resetStep(1)}>
            Edit Sign In
          </div>
        )}
      </StepCard>
      
      <StepCard 
        stepNumber={2} 
        title="Create documentation repo"
        active={currentStep === 2}
        completed={currentStep > 2}
      >
        <p className="mb-4">Your documentation content will be managed through this repo</p>
        
        {currentStep >= 2 && (
          <div className={`flex flex-col space-y-3 ${currentStep === 2 ? "animate-slide-up animate-delay-100" : ""}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="documentation-repo"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                disabled={currentStep > 2 || isLoading}
              />
              <button
                onClick={handleCreateRepo}
                disabled={!repoName.trim() || currentStep > 2 || isLoading}
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  repoName.trim() && currentStep === 2 && !isLoading ? "bg-white hover:bg-gray-100" : "bg-gray-700 cursor-not-allowed"
                } transition-colors`}
              >
                {isLoading && currentStep === 2 ? "Creating..." : "Create"}
              </button>
            </div>
            
            {errorMessage && currentStep === 2 && (
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
            
            {currentStep === 2 && !errorMessage && (
              <p className="text-xs text-gray-500">This will create a new GitHub repository for your documentation</p>
            )}
            
            {currentStep > 2 && (
              <div className="text-white flex items-center animate-slide-up">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Repository created successfully
              </div>
            )}
          </div>
        )}
        
        {currentStep > 2 && (
          <div className="text-xs text-white hover:underline mt-2 cursor-pointer" 
               onClick={() => resetStep(2)}>
            Edit Repository
          </div>
        )}
      </StepCard>
      
      <StepCard 
        stepNumber={3} 
        title="Make an update"
        active={currentStep === 3}
        completed={false}
      >
        <p>Clone the repo by running the following in your terminal</p>
        {currentStep >= 3 && (
          <div className="mt-2 relative animate-slide-up animate-delay-200">
            <div className="p-3 bg-gray-800 rounded-md text-xs font-mono overflow-x-auto">
              git clone https://github.com/{userName}/{repoName || "docs"}.git
            </div>
            <button
              id="copy-button"
              onClick={copyGitCommand}
              className="absolute top-2 right-2 p-1 px-2 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors duration-200"
            >
              Copy
            </button>
          </div>
        )}
      </StepCard>
      
      {currentStep === 3 && (
        <button
          onClick={() => {/* Add continue logic */}}
          className="w-full mt-4 py-3 bg-gray-800 text-white rounded-md 
            hover:bg-white hover:text-black 
            active:bg-gray-200 
            transition-colors duration-300 
            focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Continue
        </button>
      )}

      <div className="w-full text-center mt-8">
        <p className="text-sm text-gray-500">
          Need help? <a href="#" className="text-white hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
};

export default SignupFlow;
