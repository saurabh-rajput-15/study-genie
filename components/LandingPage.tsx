import React from 'react';

interface LandingPageProps {
    onNavigateToSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToSignIn }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen font-sans overflow-hidden relative scroll-smooth">
            {/* Background with Dot Grid - Unchanged */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black" />
                <div className="absolute top-0 right-0 w-[760px] h-[760px] bg-purple-600/18 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 left-0 w-[620px] h-[620px] bg-indigo-500/16 rounded-full blur-[130px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/25 via-transparent to-indigo-900/15" />
                <div
                    className="absolute inset-0 opacity-45"
                    style={{
                        backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.14) 1.25px, transparent 1.25px)',
                        backgroundSize: '26px 26px',
                    }}
                />
            </div>

            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 py-4">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full px-6 shadow-lg shadow-black/20 relative">
                        <div className="flex items-center justify-between h-14">
                            {/* Logo */}
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <img src="/logo.png" alt="StudyGenie" className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                                <span className="text-lg font-bold text-white">StudyGenie</span>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-slate-400 hover:text-white transition-all duration-300 text-sm font-medium hover:scale-105">Features</a>
                                <a href="#how-it-works" className="text-slate-400 hover:text-white transition-all duration-300 text-sm font-medium hover:scale-105">How It Works</a>
                                <a href="#testimonials" className="text-slate-400 hover:text-white transition-all duration-300 text-sm font-medium hover:scale-105">Reviews</a>
                            </nav>

                            {/* Desktop Login Button */}
                            <div className="hidden md:block">
                                <button 
                                    onClick={onNavigateToSignIn}
                                    className="bg-purple-500 hover:bg-purple-400 text-white font-medium py-2 px-5 rounded-full text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                                >
                                    Login
                                </button>
                            </div>

                            {/* Mobile Menu Button */}
                            <button 
                                className="md:hidden text-white p-2"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <div className="absolute top-full left-4 right-4 mt-2 p-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-4 md:hidden animate-in slide-in-from-top-2 fade-in duration-200">
                            <a 
                                href="#features" 
                                className="text-slate-300 hover:text-white py-2 px-4 hover:bg-white/5 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Features
                            </a>
                            <a 
                                href="#how-it-works" 
                                className="text-slate-300 hover:text-white py-2 px-4 hover:bg-white/5 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                How It Works
                            </a>
                            <a 
                                href="#testimonials" 
                                className="text-slate-300 hover:text-white py-2 px-4 hover:bg-white/5 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Reviews
                            </a>
                            <button 
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    onNavigateToSignIn();
                                }}
                                className="bg-purple-500 hover:bg-purple-400 text-white font-medium py-3 px-5 rounded-lg text-center transition-colors shadow-lg shadow-purple-500/20"
                            >
                                Login
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-slate-200 text-xs font-semibold tracking-wider uppercase mb-8 backdrop-blur-sm">
                            <span className="w-2 h-2 bg-purple-400 rounded-full" />
                            AI-Powered Learning Platform
                        </span>
                        
                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8">
                            Empower Your Learning
                            <br />
                            <span className="bg-gradient-to-r from-purple-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent">with Next-Gen AI</span>
                        </h1>
                        
                        {/* Subtitle */}
                        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                            Transform any study material into interactive quizzes, flashcards, and mind maps — powered by advanced AI
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button 
                                onClick={onNavigateToSignIn}
                                className="group inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold py-4 px-8 rounded-full shadow-xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 text-base"
                            >
                                Get Started Free
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                            <a href="#how-it-works" className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium py-4 px-6 rounded-full transition-all duration-300 hover:bg-white/5">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                See How It Works
                            </a>
                        </div>
                    </div>

                    {/* App Mockup */}
                    <div className="max-w-5xl mx-auto mt-20 px-4">
                        <div className="relative group">
                            {/* Shadow/Glow Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/25 via-indigo-500/20 to-blue-500/25 rounded-3xl blur-3xl opacity-55 group-hover:opacity-70 transition-opacity duration-500" />
                            
                            {/* Mockup Container */}
                            <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:-translate-y-1 transition-transform duration-500">
                                {/* Window Controls */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-white/10">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
                                        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="bg-slate-700/50 border border-white/10 rounded-lg px-4 py-1.5 text-xs text-slate-400 flex items-center gap-2">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            studygenie.app/dashboard
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Dashboard Preview */}
                                <img
                                    src="./dashboard-mobile-preview.jpg"
                                    alt="Dashboard Preview Mobile"
                                    className="w-full md:hidden"
                                />
                                <img src="./dashboard.png" alt="Dashboard Preview" className="hidden w-full md:block" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trusted By Section */}

                {/* <section className="py-12 border-y border-white/10">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
                            <div className="text-slate-400 font-semibold text-lg">amazon</div>
                            <div className="text-slate-400 font-semibold text-lg flex items-center gap-1">
                                <span className="text-blue-400">▲</span> ATLASSIAN
                            </div>
                            <div className="text-slate-400 font-semibold text-lg flex items-center gap-1">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                                GitHub
                            </div>
                            <div className="text-slate-400 font-semibold text-lg">LaunchDarkly →</div>
                            <div className="text-slate-400 font-bold text-lg tracking-wider">NETFLIX</div>
                            <div className="text-slate-400 font-semibold text-lg flex items-center gap-1">
                                <span className="text-2xl">●●</span> Medium
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* Features Section */}
                <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold tracking-wider uppercase mb-4">
                                Features
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Everything You Need to Excel
                            </h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                Powerful AI-driven tools designed to make learning fun and effective
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[{
                                title: 'Smart Quizzes',
                                emoji: '🧠',
                                desc: 'AI-generated quizzes with instant feedback and detailed explanations.'
                            }, {
                                title: 'Flashcards',
                                emoji: '🃏',
                                desc: 'Memorize key concepts efficiently with smart, swipeable flashcards.'
                            }, {
                                title: 'Mind Maps',
                                emoji: '🗺️',
                                desc: 'Visualize connections between topics with interactive mind maps.'
                            }, {
                                title: 'AI Summaries',
                                emoji: '📝',
                                desc: 'Get concise summaries of complex topics in seconds.'
                            }, {
                                title: 'Progress Tracking',
                                emoji: '📈',
                                desc: 'Monitor your learning journey with detailed analytics.'
                            }, {
                                title: 'Gamification',
                                emoji: '🏆',
                                desc: 'Earn XP, unlock achievements, and level up as you learn.'
                            }].map((feature) => (
                                <div key={feature.title} className="group bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-8 hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feature.emoji}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8 relative">
                    {/* Section Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-transparent pointer-events-none" />
                    
                    <div className="max-w-6xl mx-auto relative">
                        <div className="text-center mb-20">
                            <span className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold tracking-wider uppercase mb-4">
                                How It Works
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                Three Simple Steps
                            </h2>
                            <p className="text-slate-400 text-lg">From upload to mastery in minutes</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-30" />
                            
                            <div className="text-center group">
                                <div className="w-20 h-20 mx-auto bg-purple-500/15 border-2 border-purple-500/40 rounded-full flex items-center justify-center text-4xl mb-6 relative group-hover:scale-110 transition-transform duration-300 group-hover:border-purple-300">
                                    📤
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">1</div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Upload Anything</h3>
                                <p className="text-slate-400">PDFs, images, notes, or textbook photos. We handle it all.</p>
                            </div>

                            <div className="text-center group">
                                <div className="w-20 h-20 mx-auto bg-indigo-500/15 border-2 border-indigo-500/40 rounded-full flex items-center justify-center text-4xl mb-6 relative group-hover:scale-110 transition-transform duration-300 group-hover:border-indigo-300">
                                    ✨
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">2</div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">AI Magic</h3>
                                <p className="text-slate-400">Our AI instantly generates quizzes, flashcards, and more.</p>
                            </div>

                            <div className="text-center group">
                                <div className="w-20 h-20 mx-auto bg-blue-500/15 border-2 border-blue-500/40 rounded-full flex items-center justify-center text-4xl mb-6 relative group-hover:scale-110 transition-transform duration-300 group-hover:border-blue-300">
                                    🎯
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">3</div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Learn & Grow</h3>
                                <p className="text-slate-400">Study smarter, track progress, and ace your exams.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl blur-lg opacity-45 group-hover:opacity-65 transition-opacity duration-500" />
                            <div className="relative bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl p-12 md:p-14">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                                    <div className="group/stat">
                                        <div className="text-4xl md:text-5xl font-bold group-hover/stat:scale-110 transition-transform duration-300">50K+</div>
                                        <div className="text-white/70 mt-2 text-sm font-medium">Active Learners</div>
                                    </div>
                                    <div className="group/stat">
                                        <div className="text-4xl md:text-5xl font-bold group-hover/stat:scale-110 transition-transform duration-300">1M+</div>
                                        <div className="text-white/70 mt-2 text-sm font-medium">Quizzes Generated</div>
                                    </div>
                                    <div className="group/stat">
                                        <div className="text-4xl md:text-5xl font-bold group-hover/stat:scale-110 transition-transform duration-300">95%</div>
                                        <div className="text-white/70 mt-2 text-sm font-medium">Success Rate</div>
                                    </div>
                                    <div className="group/stat">
                                        <div className="text-4xl md:text-5xl font-bold group-hover/stat:scale-110 transition-transform duration-300">4.9★</div>
                                        <div className="text-white/70 mt-2 text-sm font-medium">User Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs font-semibold tracking-wider uppercase mb-4">
                                Testimonials
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Loved by Students
                            </h2>
                            <p className="text-slate-400 text-lg">See what our community has to say</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="group bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-lg">★</span>)}
                                </div>
                                <p className="text-slate-300 leading-relaxed mb-6">
                                    "StudyGenie transformed how I prepare for exams. The AI quizzes found gaps I didn't know I had!"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-xl shadow-lg">👩‍⚕️</div>
                                    <div>
                                        <div className="font-semibold text-white">Sarah Chen</div>
                                        <div className="text-slate-500 text-sm">Medical Student</div>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-lg">★</span>)}
                                </div>
                                <p className="text-slate-300 leading-relaxed mb-6">
                                    "The mind maps make complex chemistry so easy to understand. Went from C to A+ in one semester!"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-xl shadow-lg">🧑‍🔬</div>
                                    <div>
                                        <div className="font-semibold text-white">Marcus Johnson</div>
                                        <div className="text-slate-500 text-sm">Chemistry Major</div>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-lg">★</span>)}
                                </div>
                                <p className="text-slate-300 leading-relaxed mb-6">
                                    "As a working professional, StudyGenie saves me hours every week. Perfect for certification prep!"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-xl shadow-lg">👩‍💻</div>
                                    <div>
                                        <div className="font-semibold text-white">Priya Patel</div>
                                        <div className="text-slate-500 text-sm">IT Professional</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-28 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/35 via-indigo-600/35 to-blue-600/35 rounded-3xl blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                            <div className="relative bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/18 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/18 rounded-full blur-3xl" />
                                
                                <h2 className="relative text-3xl md:text-5xl font-bold text-white mb-6">
                                    Ready to Transform Your Learning?
                                </h2>
                                <p className="relative text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                                    Join thousands of students already studying smarter. Start your journey today – it's free!
                                </p>
                                <button 
                                    onClick={onNavigateToSignIn}
                                    className="relative group/btn inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/30"
                                >
                                    Get Started Free
                                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                                <p className="relative text-slate-500 mt-6 text-sm flex items-center justify-center gap-4">
                                    <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> No credit card</span>
                                    <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Free forever</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-black/30">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <img src="/logo.png" alt="StudyGenie" className="h-7 w-7 opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span className="text-lg font-semibold text-slate-400 group-hover:text-white transition-colors">StudyGenie</span>
                            </div>
                            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} StudyGenie. Made with 💜 for learners everywhere.</p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="text-slate-500 hover:text-purple-400 transition-colors text-sm">Twitter</a>
                                <a href="#" className="text-slate-500 hover:text-purple-400 transition-colors text-sm">GitHub</a>
                                <a href="#" className="text-slate-500 hover:text-purple-400 transition-colors text-sm">Privacy</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default LandingPage;
