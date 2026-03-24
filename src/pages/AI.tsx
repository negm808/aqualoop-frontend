import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  Sparkles,
  Zap,
  Activity,
  FileText,
  Cpu,
  Shield,
  Download,
  CheckCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'report' | 'alert';
}

export const AI: React.FC = () => {
  const { activeProfile, wsConnected } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [reportOutput, setReportOutput] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollHeight = scrollRef.current.scrollHeight;
      scrollRef.current.scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const requestAI = async (msgs: any[]) => {
    const apiBase = import.meta.env.VITE_API_BASE || '';
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(`${apiBase}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs }),
        signal: controller.signal
      });
      
      clearTimeout(id);
      const data = await res.json();
      return data.content?.[0]?.text || "Communication loop synchronization failed.";
    } catch (e) {
      console.error('AI Request Error:', e);
      return "The neural link is temporarily unstable. Please ensure the system is connected and try your query again.";
    }
  };

  const handleSend = async (forcedText?: string) => {
    const text = forcedText || input;
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev: Message[]) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const fullHistory = [...messages, userMsg].map((m: Message) => ({ role: m.role, content: m.content }));
    const aiResponse = await requestAI(fullHistory);

    setMessages((prev: Message[]) => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsTyping(false);
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    setReportOutput(null);
    try {
      const apiBase = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${apiBase}/api/ai/report`);
      const data = await res.json();
      setReportOutput(data.report);
    } catch (e) {
      setReportOutput("Biological report generation interrupted. Please check raw telemetry in the dashboard.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const downloadReport = (format: 'md' | 'txt' | 'pdf') => {
    if (!reportOutput) return;

    if (format === 'pdf') {
       try {
         const { jsPDF } = (window as any).jspdf;
         const doc = new jsPDF();
         
         doc.setFontSize(22);
         doc.text("AQUALOOP - BIOLOGICAL AUDIT", 20, 20);
         
         doc.setFontSize(10);
         doc.setTextColor(100);
         doc.text(`Generated: ${new Date().toLocaleString()} | Profile: ${activeProfile.toUpperCase()}`, 20, 30);
         doc.line(20, 35, 190, 35);
         
         doc.setFontSize(12);
         doc.setTextColor(0);
         
         const splitText = doc.splitTextToSize(reportOutput, 170);
         doc.text(splitText, 20, 45);
         
         doc.save(`AquaLoop_Report_${new Date().toISOString().split('T')[0]}.pdf`);
         setShowExportMenu(false);
       } catch (e) {
         console.error('PDF Export Error:', e);
         window.print(); // Fallback
       }
       return;
    }

    const filename = `AquaLoop_Report_${new Date().toISOString().split('T')[0]}.${format}`;
    const blob = new Blob([reportOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div className="page ai-page" style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      paddingBottom: '80px'
    }}>
      {/* Main Terminal */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: 'var(--r-xl)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        position: 'relative',
        height: 'clamp(500px, 85vh, 85vh)',
        minHeight: 'clamp(400px, 60vh, 800px)',
        flexShrink: 0
      }}>
        <div className="terminal-header" style={{ 
          padding: 'clamp(16px, 3vw, 24px) clamp(16px, 4vw, 32px)', 
          background: 'linear-gradient(90deg, var(--primary) 0%, #4facfe 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="brain-pulse" style={{ 
              width: 'clamp(32px, 8vw, 40px)', 
              height: 'clamp(32px, 8vw, 40px)', 
              borderRadius: '12px', 
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 700 }}>NEURAL CORE</h2>
              <div className="desktop-only" style={{ fontSize: '12px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={12} /> HYBRID PROCESSING ARCHITECTURE
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <span className={`badge ${wsConnected ? 'badge-ok' : 'badge-neutral'}`} style={{ border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '9px' }}>
               {wsConnected ? 'LIVE' : 'LOCAL'}
             </span>
             <span className="badge desktop-only" style={{ border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '9px' }}>
               {activeProfile.toUpperCase()}
             </span>
          </div>
        </div>

        {/* Messages Volume */}
        <div ref={scrollRef} style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          scrollBehavior: 'smooth'
        }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'var(--surface2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <Cpu size={40} color="var(--primary)" />
              </div>
              <h3 className="text-display-sm" style={{ marginBottom: '8px' }}>Awaiting Input...</h3>
              <p className="text-body-sm" style={{ color: 'var(--muted)', maxWidth: '360px', margin: '0 auto 32px' }}>
                I am your system's cognitive layer. Ask for status updates, diagnostic reports, or biological advice.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => handleSend("System status check")} className="chip-action">Status Check</button>
                <button onClick={() => handleSend("Analyze pH stability")} className="chip-action">pH Stability</button>
                <button onClick={generateReport} className="chip-action">Biological Report</button>
              </div>
            </div>
          )}

          {messages.map((m: Message, i: number) => (
            <div key={i} className={`msg-bubble-container ${m.role}`}>
              <div className={`msg-avatar ${m.role}`}>
                {m.role === 'user' ? <Zap size={14} /> : <Bot size={14} />}
              </div>
              <div className={`msg-bubble ${m.role} ${m.type === 'report' ? 'report-style' : ''}`}>
                {m.content.split('\n').map((line: string, li: number) => {
                  const isHeading = line.startsWith('###') || line.startsWith('**');
                  return (
                    <p key={li} style={{ 
                      margin: line.trim() === '' ? '12px 0' : '4px 0',
                      fontWeight: isHeading ? 600 : 400,
                      fontSize: isHeading ? '16px' : '15px'
                    }}>
                      {line.replace(/^###\s?/, '').replace(/\*\*/g, '')}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="msg-bubble-container assistant">
              <div className="msg-avatar assistant">
                <Bot size={14} />
              </div>
              <div className="msg-bubble assistant typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
        </div>

        {/* Console Input */}
        <div style={{ 
          padding: '24px 32px', 
          background: 'rgba(255, 255, 255, 0.5)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query the system consciousness..."
              style={{
                width: '100%',
                padding: '16px 20px',
                paddingLeft: '48px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                background: 'white',
                fontSize: '16px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
            <Sparkles size={20} color="var(--primary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s, background 0.2s',
              boxShadow: '0 8px 16px -4px var(--primary)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Send size={24} />
          </button>
        </div>
      </div>

      {/* AI Reporter Section */}
      <div className="ai-reporter-section" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {reportOutput && (
          <div className="card report-output-container printable-report" style={{ 
            padding: '48px', 
            background: 'white',
            borderRadius: 'var(--r-xl)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            border: '1px solid var(--border)',
            animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', borderBottom: '2px solid var(--surface2)', paddingBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                  <FileText size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '24px', letterSpacing: '-0.5px' }}>SYSTEM BIOLOGICAL AUDIT</h3>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>GENETIC SYNTHESIS • {new Date().toLocaleDateString()}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="btn-glass"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}
                >
                  <Download size={18} /> EXPORT
                </button>
                
                {showExportMenu && (
                  <div className="glass-premium" style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    right: 0, 
                    marginTop: '8px', 
                    width: '180px', 
                    zIndex: 100,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid var(--border)'
                  }}>
                    {['md', 'txt', 'pdf'].map((fmt) => (
                      <button 
                        key={fmt}
                        onClick={() => downloadReport(fmt as any)}
                        style={{ 
                          width: '100%', 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          background: 'none', 
                          border: 'none', 
                          borderBottom: '1px solid var(--border)',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--text)'
                        }}
                      >
                         Download as {fmt}
                      </button>
                    ))}
                  </div>
                )}

                <button 
                  onClick={() => setReportOutput(null)}
                  style={{ padding: '10px', color: 'var(--muted)', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  DISMISS
                </button>
              </div>
            </div>

            <div className="report-content" style={{ 
              lineHeight: '1.8', 
              fontSize: '16px', 
              color: '#334155',
              fontFamily: 'Inter, sans-serif'
            }}>
              {reportOutput.split('\n').map((line, li) => {
                if (line.startsWith('###')) return <h4 key={li} style={{ fontSize: '20px', marginTop: '32px', color: 'var(--text)', fontWeight: 700 }}>{line.replace('###', '')}</h4>;
                if (line.startsWith('####')) return <h5 key={li} style={{ fontSize: '18px', marginTop: '24px', color: 'var(--primary)', fontWeight: 600 }}>{line.replace('####', '')}</h5>;
                if (line.startsWith('*')) return <div key={li} style={{ marginLeft: '20px', display: 'flex', gap: '10px', margin: '8px 0' }}><span style={{ color: 'var(--primary)' }}>•</span> <span>{line.replace('*', '')}</span></div>;
                return <p key={li} style={{ margin: line.trim() === '' ? '20px 0' : '8px 0' }}>{line}</p>;
              })}
            </div>
            
            <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--surface2)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)' }}>
              <div>AQUALOOP COGNITIVE CORE • REDUNDANCY: GROQ/OPENROUTER</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} color="var(--success)" /> BIOLOGICAL PARAMETERS VERIFIED</div>
            </div>
          </div>
        )}

        <div className="ai-reporter-grid">
          <div className="card glass-premium" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Shield color="var(--primary)" />
              <h4 style={{ margin: 0 }}>System Guard</h4>
            </div>
            <div className="status-item">
              <span>Biological Status</span>
              <span style={{ color: 'var(--success)', fontWeight: 700 }}>STABLE</span>
            </div>
            <div className="status-item">
              <span>Failover Redundancy</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>ACTIVE (GROQ)</span>
            </div>
            <button 
              onClick={generateReport} 
              disabled={isGeneratingReport}
              style={{ 
                width: '100%', 
                marginTop: '20px', 
                padding: '14px', 
                borderRadius: '12px',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--primary)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              {isGeneratingReport ? 'SCANNING SYSTEM...' : <><Activity size={18} /> INITIATE GENETIC SCAN</>}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media print {
          .navbar, .btn-glass, .ai-reporter-grid, .ai-page > div:first-child, button, .DISMISS {
            display: none !important;
          }
          .printable-report {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .report-content {
            font-size: 14px !important;
          }
        }

        .ai-page {
          --glass-msg: rgba(255, 255, 255, 0.4);
          --glass-ai: rgba(79, 172, 254, 0.05);
        }

        .msg-bubble-container {
          display: flex;
          margin: 16px 0;
          gap: 12px;
          animation: slideIn 0.3s ease-out;
        }

        .msg-bubble-container.user {
          flex-direction: row-reverse;
        }

        .msg-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .msg-avatar.user {
          background: var(--surface2);
          color: var(--primary);
        }

        .msg-avatar.assistant {
          background: var(--primary);
          color: white;
        }

        .msg-bubble {
          max-width: 80%;
          padding: 14px 20px;
          border-radius: 18px;
          font-size: 15px;
          line-height: 1.6;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }

        .msg-bubble.user {
          background: linear-gradient(135deg, var(--primary) 0%, #4facfe 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .msg-bubble.assistant {
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          color: var(--text);
          border-bottom-left-radius: 4px;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ai-reporter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .msg-bubble-container {
          display: flex;
          gap: 16px;
          max-width: 85%;
        }
        .msg-bubble-container.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .msg-avatar {
          width: 28px;
          height: 28px;
          borderRadius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .msg-avatar.assistant {
          background: var(--primary);
          color: white;
        }
        .msg-avatar.user {
          background: var(--surface2);
          color: var(--primary);
        }
        .msg-bubble {
          padding: 16px 20px;
          border-radius: 20px;
          font-size: 15px;
          line-height: 1.5;
        }
        .msg-bubble.assistant {
          background: white;
          color: var(--text);
          border-bottom-left-radius: 4px;
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .msg-bubble.user {
          background: var(--primary);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 20px rgba(79, 172, 254, 0.2);
        }
        .report-style {
          font-family: monospace;
          background: #f8fafc !important;
          color: #334155 !important;
          border-left: 4px solid var(--primary) !important;
          white-space: pre-wrap;
        }
        .chip-action {
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: white;
          color: var(--muted);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chip-action:hover {
          background: var(--surface2);
          color: var(--primary);
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        .status-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
          font-size: 14px;
        }
        .status-item:last-child {
          border-bottom: none;
        }
        .glass-premium {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.04);
        }
        .typing {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }
        .dot {
          width: 6px;
          height: 6px;
          background: var(--muted);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
          opacity: 0.6;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        .brain-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
      `}</style>
    </div>
  );
};
