const Footer = () => {
    return (
        <footer className="bg-[#050814] border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">MedAI</span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Advanced Retrieval-Augmented Generation for specialized medical knowledge and insights.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                            <li><a href="#dashboard" className="hover:text-blue-400 transition-colors">Analytics</a></li>
                            <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">How it Works</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Compliance</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">HIPAA Info</a></li>
                        </ul>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} MedAI Assistant. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
