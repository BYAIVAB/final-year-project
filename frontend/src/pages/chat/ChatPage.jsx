import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/Layout/MainLayout'
import ChatContainer from '../../components/Chat/ChatContainer'
import Sidebar from '../../components/Sidebar/Sidebar'
import UploadModal from '../../components/Upload/UploadModal'
import { useChatStore } from '../../store/chatStore'

function ChatPage() {
  const [showUpload, setShowUpload] = useState(false)
  const { currentConversationId } = useChatStore()
  const navigate = useNavigate()

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Sidebar */}
        <Sidebar 
          onUploadClick={() => setShowUpload(true)} 
          onLogoClick={() => navigate('/')}
        />
        
        {/* Chat Area */}
        <div className="flex-1">
          <ChatContainer />
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          conversationId={currentConversationId}
          onClose={() => setShowUpload(false)}
        />
      )}
    </MainLayout>
  )
}

export default ChatPage
