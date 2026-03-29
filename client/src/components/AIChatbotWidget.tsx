import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatState {
  step: 'greeting' | 'service' | 'budget' | 'timeline' | 'decision_maker' | 'demo_request' | 'demo_scheduling' | 'contact_info' | 'confirmation';
  leadData: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    projectType?: 'digital_marketing' | 'web_development' | 'data_analysis';
    budget?: string;
    timeline?: string;
    isDecisionMaker?: boolean;
    wantDemo?: boolean;
    preferredDate?: string;
    preferredTime?: string;
    platform?: 'Google Meet' | 'Zoom' | 'Teams' | 'Phone';
  };
}

const FALLBACK_RESPONSES = {
  greeting: "Hello! 👋 Welcome to ViyonaDigital. I'm your AI assistant, and I'm here to help you find the perfect solution for your business needs. To get started, could you tell me your name?",
  service: "Great! Now, what services are you most interested in? We specialize in:\n• Digital Marketing\n• Web Development\n• Data Analysis",
  budget: "Thanks for letting me know! What's your budget range for this project?",
  timeline: "Perfect! What's your timeline for getting started?",
  decision_maker: "Are you the decision-maker for this project?",
  demo_request: "Would you like to schedule a demo with our team?",
  demo_scheduling: "Excellent! Let me find some available time slots for you.",
  contact_info: "To complete your inquiry, could you please provide your email and phone number?",
  confirmation: "Thank you! We've received your information and will be in touch shortly.",
};

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    step: 'greeting',
    leadData: {},
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const createLeadMutation = trpc.leads.create.useMutation();
  const createDemoRequestMutation = trpc.demoRequests.create.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: FALLBACK_RESPONSES.greeting,
        timestamp: new Date(),
      };
      setMessages([greetingMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Process based on current step
      let nextStep = chatState.step;
      const updatedLeadData = { ...chatState.leadData };

      switch (chatState.step) {
        case 'greeting':
          updatedLeadData.name = input;
          nextStep = 'service';
          break;

        case 'service':
          if (input.toLowerCase().includes('digital marketing')) {
            updatedLeadData.projectType = 'digital_marketing';
          } else if (input.toLowerCase().includes('web')) {
            updatedLeadData.projectType = 'web_development';
          } else if (input.toLowerCase().includes('data')) {
            updatedLeadData.projectType = 'data_analysis';
          }
          nextStep = 'budget';
          break;

        case 'budget':
          updatedLeadData.budget = input;
          nextStep = 'timeline';
          break;

        case 'timeline':
          updatedLeadData.timeline = input;
          nextStep = 'decision_maker';
          break;

        case 'decision_maker':
          updatedLeadData.isDecisionMaker = input.toLowerCase().includes('yes');
          nextStep = 'demo_request';
          break;

        case 'demo_request':
          updatedLeadData.wantDemo = input.toLowerCase().includes('yes');
          if (updatedLeadData.wantDemo) {
            nextStep = 'contact_info';
          } else {
            nextStep = 'contact_info';
          }
          break;

        case 'contact_info':
          if (input.includes('@')) {
            updatedLeadData.email = input;
            if (!updatedLeadData.phone) {
              // Ask for phone
              const assistantMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Great! And what's your phone number?",
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, assistantMessage]);
              setIsLoading(false);
              setChatState({ step: 'contact_info', leadData: updatedLeadData });
              return;
            }
          } else {
            updatedLeadData.phone = input;
          }
          nextStep = 'confirmation';
          break;

        default:
          break;
      }

      // Generate assistant response
      let assistantContent = '';
      switch (nextStep) {
        case 'service':
          assistantContent = FALLBACK_RESPONSES.service;
          break;
        case 'budget':
          assistantContent = FALLBACK_RESPONSES.budget;
          break;
        case 'timeline':
          assistantContent = FALLBACK_RESPONSES.timeline;
          break;
        case 'decision_maker':
          assistantContent = FALLBACK_RESPONSES.decision_maker;
          break;
        case 'demo_request':
          assistantContent = FALLBACK_RESPONSES.demo_request;
          break;
        case 'contact_info':
          assistantContent = FALLBACK_RESPONSES.contact_info;
          break;
        case 'confirmation':
          assistantContent = FALLBACK_RESPONSES.confirmation;
          // Save lead to database
          if (updatedLeadData.name && updatedLeadData.email && updatedLeadData.projectType) {
            try {
              const lead = await createLeadMutation.mutateAsync({
                name: updatedLeadData.name,
                email: updatedLeadData.email,
                phone: updatedLeadData.phone,
                company: updatedLeadData.company,
                projectType: updatedLeadData.projectType,
                budget: updatedLeadData.budget,
                timeline: updatedLeadData.timeline,
                isDecisionMaker: updatedLeadData.isDecisionMaker || false,
              });

              if (updatedLeadData.wantDemo && lead) {
                await createDemoRequestMutation.mutateAsync({
                  leadId: lead.id,
                  platform: 'Google Meet',
                });
                assistantContent = "Your demo request has been scheduled! We'll contact you shortly to confirm the details.";
              }

              toast.success('Lead captured successfully!');
            } catch (error) {
              console.error('Error saving lead:', error);
              toast.error('Error saving your information');
            }
          }
          break;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setChatState({ step: nextStep, leadData: updatedLeadData });
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Widget */}
      <div className="chatbot-widget">
        {isOpen ? (
          <div className="bg-white rounded-lg shadow-2xl w-96 max-w-[calc(100vw-32px)] flex flex-col h-96 md:h-[500px] border border-border animate-fade-in-scale">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <h3 className="font-semibold">ViyonaDigital Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary/80 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-4 bg-card rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your response..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="bg-primary hover:bg-accent"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-accent transition-all hover:scale-110 animate-bounce-gentle"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    </>
  );
}
