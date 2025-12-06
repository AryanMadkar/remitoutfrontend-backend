'use client';
import { X, Send, Paperclip, Smile, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function InboxDrawer({ isOpen, onClose }) {
  const [messageText, setMessageText] = useState('');

  const messages = [
    { 
      id: 1, 
      bank: 'Bank Name', 
      preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      time: '2h ago',
      hasReply: true
    },
    { 
      id: 2, 
      bank: 'Bank Name', 
      preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      time: '5h ago',
      hasReply: false
    },
    { 
      id: 3, 
      bank: 'Bank Name', 
      preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      time: '1d ago',
      hasReply: false
    },
    { 
      id: 4, 
      bank: 'Bank Name', 
      preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      time: '2d ago',
      hasReply: false
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Inbox</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white bg-orange-600 px-3 py-1 rounded-full">06</span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-orange-600 transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Scrollable Messages */}
        <div className="h-[calc(100%-64px)] overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <div key={message.id} className="p-4 hover:bg-orange-50/30 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">{message.bank}</h3>
                      <button className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">
                      {message.preview}
                    </p>
                    <p className="text-sm text-gray-600">
                      Lorem ipsum dolor sit.
                    </p>
                  </div>
                </div>

                {/* Message Input for first message */}
                {message.hasReply && (
                  <div className="mt-3 border border-purple-200 rounded-lg overflow-hidden">
                    <input
                      type="text"
                      placeholder="Send message"
                      className="w-full px-4 py-2.5 focus:outline-none text-sm"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <div className="flex gap-3">
                        <button className="text-gray-400 hover:text-purple-600">
                          <Paperclip size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-purple-600">
                          <Smile size={18} />
                        </button>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700">
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Button for other messages */}
                {!message.hasReply && (
                  <button className="mt-3 px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
                    <span>Message</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* View More */}
          <div className="p-4">
            <button className="w-full py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors">
              View More ↓
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
