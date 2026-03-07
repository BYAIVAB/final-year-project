import { Link } from 'react-router-dom';

const Logo = () => {
    return (
        <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">MedAI</span>
        </Link>
    );
};

export default Logo;
