import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  private chatHistory: ChatMessage[] = [];

  async sendMessage(message: string): Promise<string> {
    try {
      // If no API key is provided, return a demo response
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        return this.getDemoResponse(message);
      }

      // Create context for the AI mentor with comprehensive guidance
      const context = `You are Sophia, an advanced AI mentor specifically designed for gifted and talented students aged 12-18. You have deep expertise in:

ACADEMIC SUPPORT:
- Advanced mathematics, sciences, arts, music, literature, and technology
- Study strategies for accelerated learning
- Research methodologies and critical thinking
- Project planning and execution guidance

EMOTIONAL & SOCIAL GUIDANCE:
- Understanding the unique challenges of giftedness (perfectionism, impostor syndrome, social isolation)
- Building confidence and resilience
- Managing academic pressure and expectations
- Developing healthy relationships with peers and mentors

CAREER & FUTURE PLANNING:
- Exploring career paths in various fields
- College preparation and application strategies
- Scholarship and opportunity identification
- Building portfolios and showcasing talents

CREATIVE & INNOVATIVE THINKING:
- Brainstorming project ideas across disciplines
- Encouraging interdisciplinary connections
- Fostering innovation and original thinking
- Supporting artistic and creative expression

Your communication style should be:
- Encouraging and supportive, never condescending
- Age-appropriate but intellectually stimulating
- Practical with actionable advice
- Empathetic to the unique struggles of gifted students
- Inspiring and motivational

Current conversation context: ${this.getContextFromHistory()}

Student's message: "${message}"

Provide a thoughtful, personalized response that addresses their specific needs while encouraging their growth and development.`;

      const result = await this.model.generateContent(context);
      const response = await result.response;
      const text = response.text();
      
      // Add to history for context
      this.addToHistory({
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: new Date()
      });
      
      this.addToHistory({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date()
      });
      
      return text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return this.getIntelligentFallback(message);
    }
  }

  private getContextFromHistory(): string {
    if (this.chatHistory.length === 0) return "This is the start of our conversation.";
    
    const recentMessages = this.chatHistory.slice(-6); // Last 6 messages for context
    return recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  }

  private getIntelligentFallback(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Academic help
    if (lowerMessage.includes('math') || lowerMessage.includes('calculus') || lowerMessage.includes('algebra')) {
      return "I'd love to help you with mathematics! Math is such a beautiful subject that connects to so many areas. What specific concept are you working on? Whether it's calculus, algebra, or advanced topics, I can break it down step by step and show you some fascinating real-world applications.";
    }
    
    if (lowerMessage.includes('physics') || lowerMessage.includes('science')) {
      return "Physics is amazing - it's literally the study of how our universe works! What area of physics interests you? Whether it's quantum mechanics, relativity, or classical physics, I can help you understand the concepts and even suggest some cool experiments or projects you could try.";
    }
    
    if (lowerMessage.includes('music') || lowerMessage.includes('piano') || lowerMessage.includes('instrument')) {
      return "Music is such a powerful form of expression! As a gifted musician, you have the ability to connect with others through your art. What instrument do you play, or what musical challenge are you facing? I can help with practice strategies, music theory, or even composition ideas.";
    }
    
    if (lowerMessage.includes('art') || lowerMessage.includes('drawing') || lowerMessage.includes('painting')) {
      return "Art is a wonderful way to express your unique perspective on the world! What type of art are you working on? Whether it's traditional techniques, digital art, or experimental media, I can help you develop your skills and find your artistic voice.";
    }
    
    // Emotional support
    if (lowerMessage.includes('stress') || lowerMessage.includes('pressure') || lowerMessage.includes('overwhelmed')) {
      return "I understand that being gifted can sometimes feel overwhelming. The pressure to excel and the intensity of your thoughts and feelings are very real challenges. Remember that it's okay to take breaks and that your worth isn't defined by your achievements. What's been causing you the most stress lately? Let's work through this together.";
    }
    
    if (lowerMessage.includes('lonely') || lowerMessage.includes('friends') || lowerMessage.includes('social')) {
      return "Feeling different or misunderstood is something many gifted students experience. Your unique way of thinking is a gift, even if it sometimes makes social connections challenging. Have you considered joining clubs or communities related to your interests? Sometimes the best friendships form around shared passions.";
    }
    
    // Project and career guidance
    if (lowerMessage.includes('project') || lowerMessage.includes('idea') || lowerMessage.includes('create')) {
      return "I love that you're thinking about creating something! Projects are a fantastic way to apply your knowledge and explore your interests. What field or topic excites you most right now? I can help you brainstorm ideas that match your skill level and interests, and we can break it down into manageable steps.";
    }
    
    if (lowerMessage.includes('college') || lowerMessage.includes('university') || lowerMessage.includes('career')) {
      return "Planning for your future is exciting! As a gifted student, you have many paths available to you. What fields or careers interest you most? I can help you understand what steps to take now to prepare, including coursework, extracurriculars, and portfolio development.";
    }
    
    // General encouragement
    return "That's a thoughtful question! I can see you're really engaged with learning, which is wonderful. As your AI mentor, I'm here to support you in whatever challenges or interests you're exploring. Could you tell me a bit more about what you're working on or what's on your mind? I'd love to help you think through it and provide some guidance tailored to your unique situation as a gifted student.";
  }

  private getDemoResponse(message: string): string {
    const responses = [
      "That's a fascinating question! As your AI mentor, I'd love to help you explore this topic further. What specific aspect interests you most?",
      "I can see you're really passionate about learning! Let me share some insights that might help you on your journey...",
      "Great question! This reminds me of some advanced concepts we could explore together. Would you like me to break this down step by step?",
      "I'm impressed by your curiosity! This is exactly the kind of thinking that sets gifted students apart. Let's dive deeper into this...",
      "That's a wonderful project idea! I can help you plan this out and suggest some resources that would be perfect for your skill level.",
      "I understand this can be challenging. Many gifted students face similar struggles. Let me offer some strategies that have helped others..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  addToHistory(message: ChatMessage) {
    this.chatHistory.push(message);
    // Keep only last 20 messages for context
    if (this.chatHistory.length > 20) {
      this.chatHistory = this.chatHistory.slice(-20);
    }
  }

  getHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  clearHistory() {
    this.chatHistory = [];
  }
}