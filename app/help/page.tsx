import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Help = () => {
  const faqs = [
    {
      id: "getting-started",
      question: "How do I get started with Converso?",
      answer: "Getting started is easy! First, create your account and browse our companion library. Choose a companion that matches your learning goals, then start a voice session. You can create your own companions or use the ones created by our community."
    },
    {
      id: "voice-sessions",
      question: "How do voice sessions work?",
      answer: "Voice sessions are real-time conversations with AI tutors. Simply click 'Start Session' on any companion page, allow microphone access, and begin talking. The AI will respond naturally and help you learn through conversation. Sessions are transcribed in real-time for your review."
    },
    {
      id: "create-companion",
      question: "How do I create my own companion?",
      answer: "Visit the 'Create Companion' page from the navigation menu. Choose a subject, describe the topic you want to learn, select a voice style (formal or casual), and set your preferred session duration. Your companion will be ready immediately!"
    },
    {
      id: "subscription-plans",
      question: "What are the different subscription plans?",
      answer: "We offer flexible plans to suit your learning needs. Free users can create up to 3 companions and have limited session time. Pro users get unlimited companions, longer sessions, and priority support. Check our pricing page for detailed comparisons."
    },
    {
      id: "technical-issues",
      question: "I'm having technical issues with voice sessions",
      answer: "If you're experiencing issues: 1) Ensure your browser has microphone permissions, 2) Check your internet connection, 3) Try refreshing the page, 4) Make sure your microphone is working in other applications. If problems persist, contact our support team."
    },
    {
      id: "data-privacy",
      question: "How is my data protected?",
      answer: "We take privacy seriously. Voice sessions are processed for transcription but not stored permanently unless you save them. Your personal information is encrypted and we never share your data with third parties. You can download or delete your data anytime from Settings."
    },
    {
      id: "mobile-support",
      question: "Can I use Converso on my mobile device?",
      answer: "Yes! Converso works on all modern browsers including mobile Safari and Chrome. For the best experience, we recommend using the latest browser version and ensuring a stable internet connection."
    },
    {
      id: "session-history",
      question: "How can I review my past sessions?",
      answer: "All your completed sessions are saved in your 'My Journey' page. You can view transcripts, see your learning progress, and revisit topics you've covered. Sessions are organized by date and companion for easy navigation."
    }
  ];

  const supportTopics = [
    {
      icon: "/icons/mic-on.svg",
      title: "Voice & Audio Issues",
      description: "Microphone not working, audio quality problems, or connection issues",
      link: "/help#technical-issues"
    },
    {
      icon: "/icons/cap.svg",
      title: "Companion Creation",
      description: "How to create, edit, or manage your AI learning companions",
      link: "/help#create-companion"
    },
    {
      icon: "/icons/check.svg",
      title: "Account & Billing",
      description: "Subscription management, billing questions, and account settings",
      link: "/subscription"
    },
    {
      icon: "/icons/science.svg",
      title: "Learning Resources",
      description: "Tips for effective learning, best practices, and study guides",
      link: "/help#getting-started"
    }
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
        <p className="text-xl text-gray-600 mb-8">
          Get the most out of your Converso learning experience
        </p>
        
        <div className="flex justify-center gap-4 max-sm:flex-col max-sm:items-center">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Contact Support
          </Button>
          <Button variant="outline">
            <Link href="/settings">Account Settings</Link>
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Quick Help Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportTopics.map((topic, index) => (
            <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Image src={topic.icon} alt={topic.title} width={24} height={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                  <p className="text-gray-600 mb-3">{topic.description}</p>
                  <a href={topic.link} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Get Help →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg p-4">
              <AccordionTrigger className="text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pt-4 text-gray-700">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mb-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
        <p className="text-gray-600 mb-6">
          Can't find what you're looking for? Our support team is here to help you succeed.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h3 className="font-medium mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-3">
              Get detailed help via email
            </p>
            <Button variant="outline" size="sm">
              Send Email
            </Button>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-medium mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-3">
              Chat with our support team
            </p>
            <Button variant="outline" size="sm">
              Start Chat
            </Button>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-medium mb-2">Learning Guides</h3>
            <p className="text-sm text-gray-600 mb-3">
              Detailed tutorials and guides
            </p>
            <Button variant="outline" size="sm">
              View Guides
            </Button>
          </div>
        </div>
      </section>

      <section className="text-center p-6 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Feature Request or Feedback?</h3>
        <p className="text-sm text-blue-700 mb-4">
          Help us improve Converso by sharing your ideas and feedback
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Send Feedback
        </Button>
      </section>
    </main>
  );
};

export default Help;