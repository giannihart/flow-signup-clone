import React, { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import GitHubButton from "@/components/GitHubButton";
import StepCard from "@/components/StepCard";
import Accordion from "@/components/Accordion";

interface SignupFlowProps {
  initialUserName?: string;
  initialFramework?: 'DRF' | 'Express' | 'FastAPI' | 'Flask';
}

const SignupFlow: React.FC<SignupFlowProps> = ({ initialUserName = "TEAM", initialFramework }) => {
  const [userName, setUserName] = useState(initialUserName);
  const [currentStep, setCurrentStep] = useState(2);
  const [isGithubAuthorized, setIsGithubAuthorized] = useState(true);
  const [repoName, setRepoName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [isRepoConnected, setIsRepoConnected] = useState(false);
  const [repositories, setRepositories] = useState<string[]>([]);
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [domainName, setDomainName] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string | null>(initialFramework || null);

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

  const handleConnectRepo = () => {
    if (!repoUrl.trim()) return;
    
    setIsLoading(true);
    setErrorMessage("");
    
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/;
    if (!urlPattern.test(repoUrl)) {
      setErrorMessage("Please enter a valid GitHub repository URL");
      setIsLoading(false);
      return;
    }
    
    // Simulate repository connection with a small delay
    setTimeout(() => {
      setIsRepoConnected(true);
      setCurrentStep(3);
      setIsLoading(false);
    }, 800);
  };

  const handleAddRepository = () => {
    if (!newRepoUrl.trim()) return;
    
    // More flexible URL validation
    const urlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+\/?$/;
    
    // Remove any trailing slashes
    let cleanedRepoUrl = newRepoUrl.trim().replace(/\/+$/, '');
    
    // If URL doesn't match pattern, try to clean it up
    if (!urlPattern.test(cleanedRepoUrl)) {
      // Try to convert SSH or git URLs to HTTPS
      if (cleanedRepoUrl.startsWith('git@github.com:')) {
        cleanedRepoUrl = cleanedRepoUrl.replace('git@github.com:', 'https://github.com/');
      } else if (cleanedRepoUrl.startsWith('git://')) {
        cleanedRepoUrl = cleanedRepoUrl.replace('git://', 'https://');
      }
      
      // If still not valid, add https:// prefix
      if (!cleanedRepoUrl.startsWith('http://') && !cleanedRepoUrl.startsWith('https://')) {
        cleanedRepoUrl = `https://${cleanedRepoUrl}`;
      }
    }
    
    // Revalidate after cleaning
    if (!urlPattern.test(cleanedRepoUrl)) {
      setErrorMessage("Please enter a valid GitHub repository URL");
      return;
    }
    
    // Check if a repository is already added
    if (repositories.length > 0) {
      setErrorMessage("Only one repository can be added at this time");
      return;
    }
    
    // Add repository
    setRepositories([cleanedRepoUrl]);
    setNewRepoUrl("");
    setErrorMessage("");
    setIsRepoConnected(true);
    setCurrentStep(3); // Advance to framework selection step
  };

  const resetRepositoryState = () => {
    setRepositories([]);
    setNewRepoUrl("");
    setErrorMessage("");
    setIsRepoConnected(false);
    setCurrentStep(2);
  };

  // Function to copy git command to clipboard
  const copyGitCommand = () => {
    const command = repoUrl;
    
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

  const handleDomainCustomization = () => {
    // Validate domain name
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/;
    
    if (!domainName.trim()) {
      setErrorMessage("Please enter a domain name");
      return;
    }

    if (!domainPattern.test(domainName)) {
      setErrorMessage("Please enter a valid domain name (letters, numbers, hyphens)");
      return;
    }

    // Prepend https:// to the domain
    const formattedDomain = `https://${domainName.trim()}`;

    // Set custom domain
    setCustomDomain(formattedDomain);
    setErrorMessage("");
  };

  const handleFrameworkSelection = (framework: string) => {
    setSelectedFramework(framework);
    setCurrentStep(4); // Move to the next step
  };

  return (
    <div className="flex flex-col items-start w-full">
      <Logo />
      
      <h1 className="text-2xl font-bold mb-1">Hello, {userName}</h1>
      <p className="text-gray-400 mb-2">Let's set up your first documentation deployment</p>
      
      {/* Hide sign-in section */}
      {false && (
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
      )}
      
      <StepCard 
        stepNumber={1} 
        title="Connect documentation repos"
        active={currentStep === 2}
        completed={currentStep > 2}
      >
        <p className="mb-4">Connect existing GitHub repositories for your documentation</p>
        
        {currentStep === 2 && (
          <div className={`flex flex-col space-y-3 animate-slide-up animate-delay-100`}>
            {!isRepoConnected && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="text"
                  value={newRepoUrl}
                  onChange={(e) => {
                    setNewRepoUrl(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                />
                <button
                  onClick={handleAddRepository}
                  disabled={!newRepoUrl.trim()}
                  className={`px-4 py-2 rounded-md whitespace-nowrap ${
                    newRepoUrl.trim() ? "bg-white hover:bg-gray-100" : "bg-gray-700 cursor-not-allowed"
                  } transition-colors`}
                >
                  Add Repository
                </button>
              </div>
            )}
            
            {errorMessage && (
              <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
            )}
            
            {isRepoConnected && (
              <>
                <div className="text-white flex items-center animate-slide-up mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Repository successfully connected
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Connected Repository:</h4>
                  <ul className="space-y-2">
                    {repositories.map((repo, index) => (
                      <li 
                        key={repo} 
                        className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-md"
                      >
                        <span className="text-xs truncate">{repo}</span>
                        <button
                          onClick={() => {
                            setNewRepoUrl(repo);
                            resetRepositoryState();
                          }}
                          className="text-xs text-blue-400 hover:text-blue-300 ml-2"
                        >
                          Edit
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full py-2 mt-4 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
                >
                  Continue
                </button>
              </>
            )}
          </div>
        )}

        {currentStep > 2 && (
          <div className="text-xs text-white hover:underline mt-2 cursor-pointer" 
               onClick={() => setCurrentStep(2)}>
            Edit Repository
          </div>
        )}
      </StepCard>
      
      {/* Framework Selection Step */}
      <StepCard 
        stepNumber={2} 
        title="Select Your Backend Framework"
        active={currentStep === 3}
        completed={currentStep > 3}
      >
        <p className="mb-4">Choose the backend framework for your project</p>
        
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {['DRF', 'Express', 'FastAPI', 'Flask'].map((framework) => (
                <button
                  key={framework}
                  onClick={() => {
                    setSelectedFramework(framework);
                    setCurrentStep(4);
                  }}
                  className="w-full py-3 bg-gray-800 text-white rounded-md 
                    hover:bg-white hover:text-black 
                    transition-colors duration-300 
                    flex items-center justify-center
                    font-medium
                    border border-gray-700 hover:border-white
                    group"
                >
                  <span className="transition-transform group-hover:scale-105">
                    {framework}
                  </span>
                </button>
              ))}
            </div>

            {currentStep > 3 && (
              <div className="mt-4 bg-gray-800 px-3 py-2 rounded-md">
                <p className="text-xs">
                  Selected Framework: <span className="font-medium">{selectedFramework}</span>
                </p>
                <button
                  onClick={() => {
                    setSelectedFramework(null);
                    setCurrentStep(3);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                >
                  Change Framework
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep > 3 && (
          <div className="text-xs text-white hover:underline mt-2 cursor-pointer" 
               onClick={() => setCurrentStep(3)}>
            Edit Framework
          </div>
        )}
      </StepCard>

      {/* Customize Domain Section (hidden) */}
      {false && (
        <StepCard 
          stepNumber={4} 
          title="Customize Your Docs Domain"
          active={currentStep === 4}
          completed={false}
        >
          <p className="mb-4">Set up a custom documentation subdomain</p>
          
          {currentStep >= 4 && (
            <div className="space-y-4 animate-slide-up animate-delay-200">
              <div>
                <h4 className="text-sm font-medium mb-2">Domain Customization</h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex w-full">
                    <div className="bg-gray-700 px-3 py-2 flex items-center border border-r-0 border-gray-700 rounded-l-md">
                      <span className="text-gray-400">https://</span>
                    </div>
                    <input
                      type="text"
                      value={domainName}
                      onChange={(e) => {
                        setDomainName(e.target.value);
                        setErrorMessage("");
                      }}
                      placeholder="yourdomain"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-600"
                    />
                    <div className="bg-gray-700 px-3 py-2 flex items-center border border-l-0 border-gray-700 rounded-r-md">
                      <span className="text-gray-400">/docs</span>
                    </div>
                  </div>
                  <button
                    onClick={handleDomainCustomization}
                    disabled={!domainName.trim()}
                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                      domainName.trim() ? "bg-white hover:bg-gray-100" : "bg-gray-700 cursor-not-allowed"
                    } transition-colors`}
                  >
                    Set Domain
                  </button>
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                )}

                {customDomain && (
                  <div className="mt-2 bg-gray-800 px-3 py-2 rounded-md">
                    <p className="text-xs">
                      Custom Docs Domain: <span className="font-medium">{customDomain}/docs</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </StepCard>
      )}

      {/* Continue button for the last page */}
      {currentStep === 4 && (
        <div className="w-full mt-8">
          <button
            onClick={() => {
              // Add final step logic here
              alert('Completing signup flow...');
            }}
            className="w-full py-3 bg-white text-black rounded-md 
              flex items-center justify-center
              font-semibold text-base
              hover:bg-gray-100 
              active:bg-gray-200 
              transition-all duration-300 
              transform hover:scale-[1.01]
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              shadow-md hover:shadow-lg
              group"
          >
            <span>Complete Setup</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        </div>
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
