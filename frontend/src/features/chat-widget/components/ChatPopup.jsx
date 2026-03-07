import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ChatContainer from '../../../components/Chat/ChatContainer';

const ChatPopup = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9, originX: 1, originY: 1 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-[#0A0E27] border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Medical AI Assistant</h3>
                                <div className="flex items-center gap-1.5 align-middle">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs text-green-400">Online & Ready</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-400">
                            <button
                                onClick={() => navigate('/chat')}
                                className="p-1.5 hover:bg-slate-700 rounded-lg hover:text-white transition-colors"
                                title="Expand to Full Chat"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-slate-700 rounded-lg hover:text-white transition-colors"
                                title="Close"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Chat Container (Reusing existing component) */}
                    <div className="flex-1 overflow-hidden relative bg-[#0A0E27]">
                        <ChatContainer compactMode={true} />
                    </div>

                    {/* Footer quick actions */}
                    <div className="bg-slate-800/80 backdrop-blur-md border-t border-slate-700/50 p-3">
                        <button
                            onClick={() => navigate('/chat')}
                            className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            View Full Conversation History →
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatPopup;
