/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Code2, 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  Phone, 
  Send,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Client ---
const supabase = createClient(
  'https://ximypoaoorqtjreefqkq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpbXlwb2Fvb3JxdGpyZWVmcWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTU5MjAsImV4cCI6MjA5MDYzMTkyMH0.tbLv_Wpkhk4opKV6M8DHnfx0kXl4a43toCBWaMTeo3o'
);

// --- Constants ---
const ACCENT_COLOR = '#14b8a6'; // Teal
const SECONDARY_BG = '#0D1B2A';
const DARK_BG = '#020617';

// --- Types ---
interface FormData {
  college: string;
  otherCollege: string;
  fullName: string;
  rollNumber: string;
  department: string;
  year: string;
  mobileNumber: string;
  email: string;
  transactionId: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    college: '',
    otherCollege: '',
    fullName: '',
    rollNumber: '',
    department: '',
    year: '',
    mobileNumber: '',
    email: '',
    transactionId: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [regCount, setRegCount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // --- Fetch Registration Count ---
  const fetchCount = async () => {
    try {
      const { count, error } = await supabase
        .from('registration')
        .select('*', { count: 'exact', head: true });
      
      if (!error && count !== null) {
        setRegCount(count);
      }
    } catch (err) {
      console.error("Error fetching registration count:", err);
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const colleges = [
    "NNRG (Nalla Narasimha Reddy Group of Institutions)",
    "VNR Vignan Jyothi",
    "CBIT",
    "JNTU Hyderabad",
    "Osmania University",
    "CVR College of Engineering",
    "Gokaraju Rangaraju",
    "Other"
  ];

  const departments = ["CSE", "AI & ML", "Data Science", "IT", "ECE", "EEE", "Mechanical", "Civil", "Other"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.college) newErrors.college = "College is required";
    if (formData.college === "Other" && !formData.otherCollege) newErrors.otherCollege = "Please specify your college";
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.rollNumber) newErrors.rollNumber = "Roll Number is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile Number is required";
    if (!formData.transactionId) newErrors.transactionId = "Transaction ID is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const collegeName = formData.college === "Other" ? formData.otherCollege : formData.college;
      
      // --- Save Data to Supabase ---
      try {
        const { data, error } = await supabase
          .from('registration')
          .insert([{ 
            college: collegeName, 
            name: formData.fullName, 
            roll_number: formData.rollNumber, 
            department: formData.department, 
            year: formData.year, 
            mobile: formData.mobileNumber, 
            email: formData.email, 
            transaction_id: formData.transactionId 
          }]);
        
        if (error) {
          console.error('Supabase error:', error);
        } else {
          console.log('Saved successfully:', data);
        }
      } catch (err) {
        console.error('Error:', err);
      }

      const message = `Hello! I have registered for CODEMANIA event at NNRG Tech Fest 2027.

Registration Details:
━━━━━━━━━━━━━━━━
College: ${collegeName}
Name: ${formData.fullName}
Roll No: ${formData.rollNumber}
Department: ${formData.department}
Year: ${formData.year}
Mobile: ${formData.mobileNumber}
Email: ${formData.email || "Not provided"}

Payment Details:
Amount Paid: ₹100
Transaction ID: ${formData.transactionId}
━━━━━━━━━━━━━━━━
Please verify my payment and confirm my registration for CodeMania.
Thank you! 🙏
━━━━━━━━━━━━━━━━`;

      const whatsappUrl = `https://wa.me/918309030400?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
    } else {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-teal-500" />
              <span className="font-mono font-bold text-xl tracking-tighter text-white">
                CODE<span className="text-teal-500">MANIA</span>
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['About', 'Rules', 'Timeline', 'Payment', 'Register'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-slate-400 hover:text-teal-500 transition-colors uppercase tracking-widest"
                >
                  {item}
                </a>
              ))}
              <a 
                href="#register" 
                className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105"
              >
                JOIN NOW
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-white/5 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-4">
                {['About', 'Rules', 'Timeline', 'Payment', 'Register'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg font-medium text-slate-300 hover:text-teal-500"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-500 text-xs font-bold tracking-widest uppercase mb-6">
              <Code2 className="w-3 h-3" /> Tech Fest 2027
            </div>
            <h1 
              className="text-6xl md:text-9xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-cover bg-center py-2"
              style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070")',
                textShadow: '0 0 30px rgba(20,184,166,0.3)'
              }}
            >
              CODEMANIA
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-10 leading-relaxed">
              Master the art of C programming. A high-stakes technical challenge organized by the 
              <span className="text-teal-500 font-semibold"> AI & ML Department, NNRG</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a 
                href="#register" 
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 group"
              >
                REGISTER NOW <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#about" 
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                LEARN MORE
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {[
                { icon: Calendar, label: "Date", val: "April 15, 2027" },
                { icon: Clock, label: "Time", val: "10:00 AM IST" },
                { icon: MapPin, label: "Venue", val: "NNRG Campus" },
                { icon: Trophy, label: "Prize", val: "Exciting Rewards" },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
                  <item.icon className="w-5 h-5 text-teal-500 mx-auto mb-2" />
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{item.label}</div>
                  <div className="text-sm font-bold text-white">{item.val}</div>
                </div>
              ))}
            </div>

            {/* Registration Counter */}
            {regCount !== null && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-block"
              >
                <p className="text-[#14b8a6] font-[900] text-[13px] tracking-[2px] uppercase">
                  🎯 {regCount} Students Registered So Far!
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="hacker-heading mb-12 text-center">About the Event</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-slate-400 text-lg leading-relaxed">
                CODEMANIA is the flagship C-programming competition of NNRG Tech Fest 2027. 
                Designed to test your logic, syntax knowledge, and problem-solving speed, 
                this event brings together the brightest minds from various engineering colleges.
              </p>
              <div className="space-y-4">
                {[
                  "Real-world coding challenges",
                  "Logic-based debugging rounds",
                  "Time-constrained problem solving",
                  "Networking with tech enthusiasts"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-teal-500/10 border border-teal-500/20 rounded-3xl overflow-hidden flex items-center justify-center">
                <Code2 className="w-24 h-24 text-teal-500/40" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-teal-600 p-6 rounded-2xl shadow-2xl hidden md:block">
                <div className="text-4xl font-black text-white">100+</div>
                <div className="text-xs font-bold text-teal-100 uppercase tracking-widest">Participants Expected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Rules Section --- */}
      <section id="rules" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="hacker-heading mb-12 text-center">Event Rules</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Eligibility", desc: "Open to all B.Tech students from any department and year." },
              { title: "Team Size", desc: "Individual participation only. No teams allowed for this event." },
              { title: "Environment", desc: "Standard C compilers will be provided. No external IDEs allowed." },
              { title: "Fair Play", desc: "Any form of plagiarism or use of mobile phones will lead to disqualification." },
              { title: "Rounds", desc: "Multiple elimination rounds based on difficulty and speed." },
              { title: "Judging", desc: "Decisions made by the technical committee will be final and binding." },
            ].map((rule, i) => (
              <div key={i} className="bg-slate-950 border border-white/5 p-6 rounded-2xl hover:border-teal-500/50 transition-colors">
                <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-teal-500 font-mono font-bold">0{i+1}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{rule.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Timeline Section --- */}
      <section id="timeline" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="hacker-heading mb-12 text-center">Event Timeline</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              { time: "09:30 AM", event: "Reporting & Registration Verification", desc: "Check-in at the venue and collect your badges." },
              { time: "10:30 AM", event: "Round 1: Logic Quiz", desc: "30-minute multiple choice questions on C fundamentals." },
              { time: "11:30 AM", event: "Round 2: Debugging", desc: "Find and fix errors in provided code snippets." },
              { time: "01:00 PM", event: "Lunch Break", desc: "Refreshments and networking." },
              { time: "02:00 PM", event: "Final Round: Code Sprint", desc: "Solve complex algorithmic problems in C." },
              { time: "04:00 PM", event: "Award Ceremony", desc: "Announcement of winners and certificate distribution." },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                  {i !== 5 && <div className="w-px flex-1 bg-slate-800 group-hover:bg-teal-500/30 transition-colors"></div>}
                </div>
                <div className="pb-8">
                  <div className="text-teal-500 font-mono font-bold text-sm mb-1">{item.time}</div>
                  <h3 className="text-white font-bold text-xl mb-2">{item.event}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Payment Section --- */}
      <section id="payment" className="py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="hacker-heading mb-12 text-center">Payment Details</h2>
          
          <div className="max-w-2xl mx-auto bg-[#0D1B2A] rounded-[14px] p-6 md:p-8 border border-[#21262d] shadow-2xl">
            {/* Warning Banner */}
            <div className="bg-[#1A0800] border-l-[3px] border-[#14b8a6] p-3 mb-8">
              <p className="text-[#14b8a6] text-[11px] font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> 
                PAY FIRST, THEN FILL THE FORM | Keep your Transaction ID ready
              </p>
            </div>

            {/* Payment Option 1 */}
            <div className="text-center mb-10">
              <p className="text-[#6e7681] tracking-[3px] text-[9px] font-bold mb-4 uppercase">SCAN QR CODE TO PAY</p>
              <div className="inline-block bg-white p-2 rounded-lg mb-6">
                <img 
                  src="https://quickchart.io/qr?text=upi://pay?pa=8309030400-id8e@axl%26pn=GattuAbhinay%26am=100%26cu=INR%26tn=NNRG_TechFest_CodeMania&size=300" 
                  alt="Payment QR Code Primary" 
                  className="w-[260px] h-[260px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">UPI ID</p>
                  <p className="text-[10px] text-[#14b8a6] font-mono break-all">8309030400-id8e@axl</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">PHONE</p>
                  <p className="text-[10px] text-[#14b8a6] font-mono">8309030400</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">NAME</p>
                  <p className="text-[10px] text-white font-bold uppercase">GATTU ABHINAY</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">AMOUNT</p>
                  <p className="text-[10px] text-[#22C55E] font-black">₹100</p>
                </div>
              </div>

              <div className="mt-6 border-l-2 border-[#14b8a6] bg-[#14b8a6]/5 p-3 text-left max-w-sm mx-auto">
                <p className="text-[#14b8a6] text-[10px] font-medium">📋 Note: NNRG TechFest - CodeMania</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-white/10"></div>
              <p className="text-[#8b949e] tracking-[2px] text-[8px] font-bold uppercase">ALTERNATIVE</p>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {/* Payment Option 2 */}
            <div className="text-center">
              <p className="text-[#6e7681] tracking-[3px] text-[9px] font-bold mb-4 uppercase">SCAN QR CODE TO PAY</p>
              <div className="inline-block bg-white p-2 rounded-lg mb-6">
                <img 
                  src="https://quickchart.io/qr?text=upi://pay?pa=6301523538-id6e@axl%26pn=Nithish%26am=100%26cu=INR%26tn=NNRG_TechFest_CodeMania&size=300" 
                  alt="Payment QR Code Alternative" 
                  className="w-[260px] h-[260px]"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">UPI ID</p>
                  <p className="text-[10px] text-[#14b8a6] font-mono break-all">6301523538-id6e@axl</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">PHONE</p>
                  <p className="text-[10px] text-[#14b8a6] font-mono">6301523538</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">NAME</p>
                  <p className="text-[10px] text-white font-bold uppercase">NITHISH</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">AMOUNT</p>
                  <p className="text-[10px] text-[#22C55E] font-black">₹100</p>
                </div>
              </div>

              <div className="mt-6 border-l-2 border-[#3B82F6] bg-[#3B82F6]/5 p-3 text-left max-w-sm mx-auto">
                <p className="text-[#3B82F6] text-[10px] font-medium">📋 Alternative Payment Option</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Previous Year Questions Section --- */}
      <section id="pyq" className="py-24 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-mono font-black text-[32px] tracking-[2px] uppercase text-[#F97316] mb-12 text-center">
            PREVIOUS YEAR QUESTIONS
          </h2>
          
          <div className="bg-[#0D1B2A] rounded-[14px] p-6 border border-[#21262d] shadow-2xl">
            {/* Info Banner */}
            <div className="bg-[#F97316]/[0.05] border-l-[3px] border-[#F97316] p-[10px] px-[14px] mb-8 text-left">
              <p className="text-[#F97316] text-[11px] font-medium">
                📚 Practice with last year's questions to prepare better for CODEMANIA 2027!
              </p>
            </div>

            {/* PDF Card */}
            <div className="bg-[#0D1117] border border-[#F97316]/20 rounded-[10px] p-5 max-w-[400px] mx-auto text-center">
              <div className="flex justify-center">
                <FileText className="w-[40px] h-[40px] text-[#F97316]" />
              </div>
              
              <h3 className="text-white font-bold text-[14px] mt-[10px]">
                CODEMANIA — Previous Year Questions
              </h3>
              <p className="text-[#6e7681] text-[11px] mb-4">
                C Language | Quiz + Debugging + Coding
              </p>

              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => window.open('https://drive.google.com/file/d/1bsk7CA8zsaJU_w6RQF--zQbBJUXvJJvS/view?usp=sharing', '_blank')}
                  className="flex-1 bg-transparent border border-[#F97316]/50 text-[#F97316] py-[10px] px-5 rounded-[6px] text-[12px] font-bold hover:bg-[#F97316]/10 transition-colors"
                >
                  👁 View PDF
                </button>
                <button 
                  onClick={() => window.open('https://drive.google.com/uc?export=download&id=1bsk7CA8zsaJU_w6RQF--zQbBJUXvJJvS', '_blank')}
                  className="flex-1 bg-[#F97316] text-white py-[10px] px-5 rounded-[6px] text-[12px] font-bold hover:bg-[#EA580C] transition-colors"
                >
                  ⬇ Download PDF
                </button>
              </div>

              {/* Note Bar */}
              <div className="mt-4 border-l-2 border-[#F97316]/40 bg-[#F97316]/[0.03] p-2 px-3 text-left">
                <p className="text-[#F97316]/60 text-[10px]">
                  💡 Tip: These questions are for practice only. Actual exam questions will be different.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Registration Form Section --- */}
      <section id="register" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="hacker-heading mb-12 text-center">Registration Form</h2>
          
          <div ref={formRef} className="max-w-2xl mx-auto bg-slate-900 border border-white/5 rounded-3xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* College */}
              <div className={errors.college ? 'animate-shake' : ''}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select College *</label>
                <select 
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className={`w-full bg-slate-950 border ${errors.college ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all`}
                >
                  <option value="">-- Choose College --</option>
                  {colleges.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.college && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.college}</p>}
              </div>

              {formData.college === "Other" && (
                <div className={errors.otherCollege ? 'animate-shake' : ''}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Specify College Name *</label>
                  <input 
                    type="text"
                    name="otherCollege"
                    value={formData.otherCollege}
                    onChange={handleChange}
                    placeholder="Enter your college name"
                    className={`w-full bg-slate-950 border ${errors.otherCollege ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all`}
                  />
                  {errors.otherCollege && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.otherCollege}</p>}
                </div>
              )}

              {/* Name & Roll */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className={errors.fullName ? 'animate-shake' : ''}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name *</label>
                  <input 
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full bg-slate-950 border ${errors.fullName ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all`}
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.fullName}</p>}
                </div>
                <div className={errors.rollNumber ? 'animate-shake' : ''}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Roll Number *</label>
                  <input 
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. 247Z1A66XX"
                    className={`w-full bg-slate-950 border ${errors.rollNumber ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all`}
                  />
                  {errors.rollNumber && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.rollNumber}</p>}
                </div>
              </div>

              {/* Dept & Year */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className={errors.department ? 'animate-shake' : ''}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Department *</label>
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full bg-slate-950 border ${errors.department ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all`}
                  >
                    <option value="">-- Select Dept --</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.department && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.department}</p>}
                </div>
                <div className={errors.year ? 'animate-shake' : ''}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Year *</label>
                  <select 
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={`w-full bg-slate-950 border ${errors.year ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all`}
                  >
                    <option value="">-- Select Year --</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.year && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.year}</p>}
                </div>
              </div>

              {/* Mobile & Email */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className={errors.mobileNumber ? 'animate-shake' : ''}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mobile Number *</label>
                  <input 
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className={`w-full bg-slate-950 border ${errors.mobileNumber ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all`}
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.mobileNumber}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email (Optional)</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Transaction ID */}
              <div className={errors.transactionId ? 'animate-shake' : ''}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Transaction ID *</label>
                <input 
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  placeholder="Enter UPI Transaction ID"
                  className={`w-full bg-slate-950 border ${errors.transactionId ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all`}
                />
                {errors.transactionId && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.transactionId}</p>}
                <p className="text-slate-500 text-[9px] mt-2 font-medium italic">Note: Your registration will be verified using this ID.</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-teal-800 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-500'} text-white py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-500/10 group`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Clock className="w-5 h-5" />
                    </motion.div>
                    PROCESSING...
                  </>
                ) : (
                  <>
                    SUBMIT VIA WHATSAPP <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- Footer Section --- */}
      <footer className="relative bg-black pt-20 pb-10 overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-[clamp(60px,12vw,160px)] font-black text-white/[0.03] tracking-[8px] whitespace-nowrap uppercase">
            TECH FEST 2027
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* AI & ML Tech Fest Image Banner */}
          <div className="mb-16 rounded-3xl overflow-hidden border border-white/10 relative group">
            <img 
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000" 
              alt="AI AND ML TECH FEST 2027" 
              className="w-full h-48 md:h-64 object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col items-center justify-center">
              <h3 className="text-teal-500 font-mono font-black text-2xl md:text-4xl tracking-[4px] uppercase text-center px-4">
                AI & ML TECH FEST 2027
              </h3>
              <div className="w-24 h-1 bg-teal-500 mt-4"></div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-[28px] font-bold text-white mb-2">NEED HELP?</h2>
            <div className="w-12 h-1 bg-teal-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Faculty Coordinators */}
            <div>
              <h3 className="text-[10px] text-white/30 tracking-[3px] font-bold uppercase mb-6">FACULTY COORDINATORS</h3>
              <div className="space-y-3">
                {[
                  { name: "Dr. V.V. Appaji", phone: "9949062386" },
                  { name: "Mr. M. Eswara Rao", phone: "8143848778" }
                ].map((coord, i) => (
                  <div key={i} className="bg-[#0D1117] border border-[#21262d] rounded-md p-4 flex justify-between items-center">
                    <span className="text-white font-bold text-sm">{coord.name}</span>
                    <span className="text-white/40 text-xs font-mono">{coord.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Coordinators */}
            <div>
              <h3 className="text-[10px] text-white/30 tracking-[3px] font-bold uppercase mb-6">STUDENT COORDINATORS</h3>
              <div className="space-y-3">
                {/* Abhinay */}
                <a 
                  href="https://wa.me/918309030400" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-[#1A0805] border-l-4 border-[#14b8a6] rounded-r-md p-4 flex justify-between items-center group transition-all hover:bg-[#220a06]"
                >
                  <div>
                    <p className="text-[#14b8a6]/60 text-[8px] font-bold uppercase mb-1">STUDENT COORDINATOR</p>
                    <p className="text-[#14b8a6] font-bold text-base">ABHINAY</p>
                    <p className="text-[#14b8a6] text-[11px] font-medium">CSM-A | 247Z1A6660</p>
                  </div>
                  <div className="text-[#14b8a6] font-bold text-sm flex items-center gap-1">
                    8309030400 <ExternalLink className="w-3 h-3" />
                  </div>
                </a>

                {/* Nithish */}
                <div className="bg-[#0D1117] border border-[#21262d] rounded-md p-4 flex justify-between items-center">
                  <div>
                    <p className="text-white/30 text-[8px] font-bold uppercase mb-1">STUDENT COORDINATOR</p>
                    <p className="text-white font-bold text-sm">NITHISH</p>
                    <p className="text-white/40 text-[11px]">CSM-A | 247Z1A6631</p>
                  </div>
                  <span className="text-white/40 text-xs font-mono">6301523534</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-top border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-white/20 text-[10px]">
              Developed and maintained by <span className="text-white/40">Computer Science Department</span>
            </p>
            <p className="text-white/20 text-[10px]">
              © 2027 NNRG Fest. All rights reserved.
            </p>
            <a 
              href="https://wa.me/918309030400" 
              className="text-[#14b8a6] text-[10px] font-bold hover:underline flex items-center gap-1"
            >
              Designed by ABHINAY <ExternalLink className="w-2 h-2" />
            </a>
          </div>
        </div>
      </footer>

      {/* --- Loading Overlay --- */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 border border-teal-500/30 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl shadow-teal-500/20">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-teal-500/20"
              >
                <Terminal className="w-10 h-10 text-teal-500" />
              </motion.div>
              <h3 className="text-white font-black text-xl mb-2 tracking-tight uppercase">Securing Your Spot</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Please wait while we encrypt your data and prepare your registration link...
              </p>
              <div className="flex items-center justify-center gap-2">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                  className="w-2 h-2 bg-teal-500 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-2 h-2 bg-teal-500 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-2 h-2 bg-teal-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
