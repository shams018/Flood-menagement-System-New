import React, { useState, useEffect, useRef } from 'react';
import {
  MessagesSquare, AlertCircle, LifeBuoy, Users, Settings,
  HelpCircle, Search, MoreVertical, Paperclip, PlusCircle,
  Send, Shield, Menu, X, CheckCheck, Camera, ImagePlus, Smile, MapPin, FileText,
  ThumbsUp, Heart, Zap, AlertTriangle, Edit, Trash2
} from 'lucide-react';
import Logo from "../../assets/logo.jpg";

const AdminChat = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedFilePreview, setAttachedFilePreview] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('No location yet');
  const [locationStatus, setLocationStatus] = useState('Live location disconnected');
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [RecordedChunks, setRecordedChunks] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");
  const scrollRef = useRef(null);

  // --- REAL-TIME DATA SIMULATION ---
  useEffect(() => {
    const initialData = [
      { id: 1, user: "COMMAND_CENTRAL", time: "14:02", isVerified: true, text: "All personnel transition to Sector 7 frequency. Aerial surveillance confirms rising water levels near the North Dam. NGOs please standby for regional dispatch codes.", type: "incoming" },
      { id: 2, user: "RESCUE_RED_CROSS", time: "14:05", text: "Copy that Command. We have 3 units positioned at the Sector 7 perimeter. We are ready for the dispatch codes. Resources are at 85% capacity.", type: "incoming" }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < initialData.length) {
        setIsTyping(true);
        const nextMsg = initialData[i];

        setTimeout(() => {
          setMessages(prev => {
            // Check if message is already added to prevent duplicates
            if (prev.some(m => m.id === nextMsg.id)) return prev;
            return [...prev, nextMsg];
          });
          setIsTyping(false);
        }, 1200);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (cameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraOpen, cameraStream]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowMediaMenu(false);
        setShowEmojiMenu(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation unsupported');
      return;
    }

    setLocationStatus('Fetching current location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const long = position.coords.longitude.toFixed(5);
        const locationString = `Lat: ${lat}, Long: ${long}`;
        setCurrentLocation(locationString);
        setLocationStatus('Live location active');
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            user: 'SYSTEM',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            text: `Current location shared: ${locationString}`,
            type: 'outgoing',
          },
        ]);
        setShowMediaMenu(false);
      },
      () => {
        setLocationStatus('Location access denied');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedFilePreview(event.target?.result);
      };
      reader.readAsDataURL(file);
      setShowMediaMenu(false);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setAttachedFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleEditMessage = (id, text) => {
    setEditingMessageId(id);
    setEditMessageText(text || "");
    setShowMediaMenu(false);
    setShowEmojiMenu(false);
  };

  const handleSaveEdit = () => {
    if (editingMessageId === null) return;
    setMessages((prev) => prev.map((msg) => msg.id === editingMessageId ? { ...msg, text: editMessageText } : msg));
    setEditingMessageId(null);
    setEditMessageText("");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditMessageText("");
  };

  const handleDeleteMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (editingMessageId === id) {
      setEditingMessageId(null);
      setEditMessageText("");
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraOpen(false);
    setIsRecording(false);
    setRecordedChunks([]);
    setCameraError(null);
  };

  const openCameraModal = async () => {
    setShowMediaMenu(false);
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
      setCameraStream(stream);
      setCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setCameraError('Camera access denied or unavailable');
      cameraInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setAttachedFile(file);
      setAttachedFilePreview(URL.createObjectURL(blob));
      stopCameraStream();
    }, 'image/jpeg', 0.92);
  };

  const startRecording = () => {
    if (!cameraStream || !MediaRecorder) return;
    const chunks = [];
    const recorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm; codecs=vp8,opus' });
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
      setAttachedFile(file);
      setAttachedFilePreview(URL.createObjectURL(blob));
      stopCameraStream();
    };
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    const newMessage = {
      id: Date.now(),
      user: "FIELD_OP_ALEX",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      text: inputText,
      type: "outgoing",
      file: attachedFile ? { name: attachedFile.name, preview: attachedFilePreview, type: attachedFile.type } : null
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    removeAttachment();
  };

  const insertEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-[#E0E0E0] font-sans overflow-hidden">

      {/* --- SIDEBAR (As per your UI) --- */}
      <aside className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 fixed md:relative z-50 w-72 min-h-screen bg-slate-900 text-slate-200 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-transform duration-300
      `}>
        <div className="flex flex-row px-6 pt-8 pb-4 border-b border-slate-700">
          <div className=" w-10 h-10 rounded-3xl bg-slate-500 flex items-center justify-center mb-5 shadow-xl">
            <img src={Logo} alt="Logo" />
            {/* <Shield className="text-sky-300" size={26} /> */}
          </div>
          <div className="flex flex-col ml-4">
            <p className="text-xl font-extrabold uppercase tracking-widest text-[#A9C7FF] leading-tight">
              Protocol Alpha
            </p>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mt-3">
              Flood Monitoring
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto text-gray-500"><X size={20} /></button>
        </div>

        {/* Sidebar navigation */}
        <nav className="px-4  space-y-2 text-md">
          <p className="px-2 text-[9px] text-slate-600 mb-2 tracking-[0.2em] uppercase">Comms Channels</p>
          <NavItem icon={<MessagesSquare size={18} />} label="General" active />
          <NavItem icon={<AlertCircle size={18} />} label="Help Requests" badge="12" />
          <NavItem icon={<LifeBuoy size={18} />} label="Rescue" badge="3" />
          <NavItem icon={<Users size={18} />} label="NGO Coordination" />
        </nav>

        <div className="px-6 pb-8">
          <button className="w-full rounded-3xl bg-sky-400 text-slate-950 font-semibold py-3 shadow-lg shadow-sky-500/20 transition hover:bg-sky-300">
            <AlertCircle size={16} className="text-red-500 inline mr-2" /> Report Incident
          </button>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              className="w-full flex items-center gap-3 text-sm text-slate-400 hover:text-slate-100 transition"
            >
              <Settings size={18} className="text-slate-400" />
              Settings
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-3 text-sm text-slate-400 hover:text-slate-100 transition"
            >
              <HelpCircle size={18} className="text-slate-400" />
              Support
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0d0d0d] relative">

        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400"><Menu size={24} /></button>
            <div className='flex flex-row gap-5'>
              <div className="relative">
                <MessagesSquare size={40} className="text-slate-300" />
                {messages.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-[#0d0d0d] shadow-lg animate-pulse"></div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="text-xl">#</span> GENERAL-COMMS
                </h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Live Feed - 1,240 Operators Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <Search size={20} className="cursor-pointer hover:text-white" />
            <MoreVertical size={20} className="cursor-pointer hover:text-white" />
          </div>
        </header>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide scroll-smooth">
          <div className="flex justify-center">
            <span className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full text-slate-400 border border-white/10 shadow-sm">
              Protocol Shift: Night Watch Active - 22:00 UTC
            </span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`relative flex ${msg.type === 'outgoing' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
              <div className={`flex gap-4 max-w-[86%] ${msg.type === 'outgoing' ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-11 h-11 rounded-3xl bg-slate-950 shrink-0 border border-white/5 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user}`} alt="avatar" />
                </div>
                <div className="space-y-2 relative group">
                  {msg.type === 'outgoing' && editingMessageId !== msg.id && (
                    <div className="absolute -top-2 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        type="button"
                        onClick={() => handleEditMessage(msg.id, msg.text)}
                        className="rounded-full bg-white/10 p-2 text-slate-200 hover:bg-slate-800"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="rounded-full bg-white/10 p-2 text-red-400 hover:bg-slate-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  <div className={`flex items-center gap-3 ${msg.type === 'outgoing' ? 'flex-row-reverse justify-end' : ''}`}>
                    <span className={`text-[11px] font-black tracking-wider uppercase ${msg.type === 'outgoing' ? 'text-sky-300' : 'text-slate-300'}`}>{msg.user}</span>
                    {msg.isVerified && (
                      <span className="text-[8px] bg-slate-900/90 text-sky-300 font-black px-2 py-1 rounded-full border border-sky-500/20 uppercase tracking-[0.25em]">
                        Verified Protocol
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-slate-500">{msg.time}</span>
                  </div>
                  {/* File Attachment Display */}
                  {msg.file && (
                    <div className={`rounded-[20px] p-3 max-w-xs ${msg.type === 'outgoing' ? 'bg-blue-500/20' : 'bg-white/5'} border border-white/10`}>
                      {msg.file.type.startsWith('image/') ? (
                        <img src={msg.file.preview} alt="attachment" className="rounded-lg max-h-48 w-full object-cover" />
                      ) : msg.file.type.startsWith('video/') ? (
                        <video src={msg.file.preview} controls className="rounded-lg max-h-48 w-full object-cover bg-black" />
                      ) : (
                        <div className="flex items-center gap-3 p-2">
                          <div className="p-3 bg-slate-800 rounded-lg">
                            <FileText size={24} className="text-sky-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-200 truncate">{msg.file.name}</p>
                            <p className="text-[10px] text-slate-500">File attached</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Text Message */}
                  {editingMessageId === msg.id ? (
                    <div className={`relative p-4 text-sm leading-relaxed shadow-[0_20px_50px_rgba(0,0,0,0.35)] ${msg.type === 'outgoing' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-[30px] rounded-br-[8px]' : 'bg-[#111827] border border-white/10 text-slate-200 rounded-[30px] rounded-bl-[8px]'}`}>
                      <textarea
                        value={editMessageText}
                        onChange={(e) => setEditMessageText(e.target.value)}
                        rows={3}
                        className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 p-3 text-sm text-slate-100 outline-none focus:border-sky-400"
                      />
                      <div className="mt-3 flex justify-end gap-2">
                        <button type="button" onClick={handleCancelEdit} className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/20">Cancel</button>
                        <button type="button" onClick={handleSaveEdit} className="rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-sky-400">Save</button>
                      </div>
                    </div>
                  ) : msg.text && (
                    <div className={`relative p-4 text-sm leading-relaxed shadow-[0_20px_50px_rgba(0,0,0,0.35)] ${msg.type === 'outgoing' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-[30px] rounded-br-[8px]' : 'bg-[#111827] border border-white/10 text-slate-200 rounded-[30px] rounded-bl-[8px]'}`}>
                      {msg.type === 'incoming' && <span className="absolute left-0 top-4 h-10 w-0.5 rounded-full bg-sky-400/80" />}
                      {msg.text}
                    </div>
                  )}
                  {msg.type === 'outgoing' && editingMessageId !== msg.id && (
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <div className="bg-[#0f172a] px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
                        <CheckCheck size={10} className="text-sky-300" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.25em]">Sent</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* AI Insight Box */}
          <div className="bg-slate-900/40 border-l-2 border-l-blue-500 border border-white/5 p-4 rounded-xl flex gap-4">
            <div className="shrink-0 p-2 bg-blue-500/10 rounded-lg h-fit"><Shield size={16} className="text-blue-500" /></div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1 italic">Sentinel_AI_Insight</p>
              <p className="text-xs text-gray-400 leading-relaxed italic">Analyzing Sector 7 acoustic sensors... detected abnormal resonance frequency in dam structural pillars. Probability of fatigue: 64%. Recommend immediate visual drone inspection.</p>
            </div>
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 animate-pulse ml-2">
              <div className="w-10 h-10 rounded-xl bg-white/5" />
              <div className="bg-[#181818] p-3 rounded-xl flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <footer className="p-4 md:p-6 bg-[#070a12] border-t border-white/5 space-y-3">
          {/* Attachment Preview */}
          {attachedFilePreview && (
            <div className="mx-auto max-w-4xl bg-[#111827] border border-white/10 rounded-xl p-3 flex items-center gap-3">
              {attachedFile?.type.startsWith('image/') ? (
                <img src={attachedFilePreview} alt="preview" className="h-16 w-16 object-cover rounded-lg" />
              ) : attachedFile?.type.startsWith('video/') ? (
                <video src={attachedFilePreview} controls className="h-16 w-16 object-cover rounded-lg bg-black" />
              ) : (
                <div className="h-16 w-16 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5">
                  <FileText size={24} className="text-sky-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{attachedFile?.name}</p>
                <p className="text-[10px] text-slate-500">{(attachedFile?.size || 0) / 1024 < 1024 ? Math.round((attachedFile?.size || 0) / 1024) + ' KB' : Math.round((attachedFile?.size || 0) / (1024 * 1024)) + ' MB'}</p>
              </div>
              <button onClick={removeAttachment} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                <X size={18} />
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-4 bg-[#111827] border border-white/10 p-3 rounded-[32px] focus-within:border-sky-500/50 transition-all shadow-[0_20px_50px_rgba(15,23,42,0.45)] relative">
            {/* File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            <input
              type="file"
              ref={galleryInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*"
              capture="environment"
            />

            <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-2 border border-white/10 relative">
              {/* Attachment Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-sky-400 transition-colors"
                title="Attach file"
              >
                <Paperclip size={18} />
              </button>

              {/* Media Menu Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMediaMenu(!showMediaMenu)}
                  className="p-2 text-slate-400 hover:text-sky-400 transition-colors"
                  title="Media options"
                >
                  <PlusCircle size={18} />
                </button>

                {/* Media Menu */}
                {showMediaMenu && (
                  <div className="absolute bottom-12 left-0 bg-[#1a2332] border border-white/10 rounded-xl p-2 shadow-xl z-50 flex flex-col gap-1 w-40">
                    <button
                      type="button"
                      onClick={openCameraModal}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Camera size={16} className="text-orange-400" />
                      Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMediaMenu(false);
                        fileInputRef.current?.click();
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ImagePlus size={16} className="text-green-400" />
                      Gallery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMediaMenu(false);
                        setShowEmojiMenu(!showEmojiMenu);
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Smile size={16} className="text-yellow-400" />
                      Emoji
                    </button>
                    <button
                      type="button"
                      onClick={handleUseLocation}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MapPin size={16} className="text-red-400" />
                      Location
                    </button>
                  </div>
                )}
              </div>

              {/* Emoji Menu */}
              {showEmojiMenu && (
                <div className="absolute bottom-12 left-16 bg-[#1a2332] border border-white/10 rounded-xl p-3 shadow-xl z-50 grid grid-cols-3 gap-2 w-56">
                  {[
                    { icon: <ThumbsUp size={18} className="text-sky-400" />, label: String.fromCodePoint(0x1F44D) },
                    { icon: <Heart size={18} className="text-red-400" />, label: String.fromCodePoint(0x2764) },
                    { icon: <Zap size={18} className="text-yellow-400" />, label: String.fromCodePoint(0x26A1) },
                    { icon: <AlertTriangle size={18} className="text-orange-400" />, label: String.fromCodePoint(0x26A0) },
                    { icon: <Smile size={18} className="text-green-400" />, label: String.fromCodePoint(0x1F60A) },
                    { icon: <MapPin size={18} className="text-pink-400" />, label: String.fromCodePoint(0x1F4CD) }
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        insertEmoji(option.label);
                        setShowEmojiMenu(false);
                        setShowMediaMenu(false);
                      }}
                      className="flex flex-col items-center justify-center gap-1 rounded-xl p-2 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {option.icon}
                      <span className="text-[10px] text-slate-200">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type tactical message or command..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-100 py-3 placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-6 py-3 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] transition-all shadow-[0_20px_50px_rgba(56,189,248,0.25)]"
            >
              Send <Send size={14} />
            </button>
          </form>

          {cameraOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
              <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#08101b]/95 shadow-[0_30px_80px_rgba(0,0,0,0.75)] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.35em] text-slate-300">Live Camera</p>
                    <p className="text-[11px] text-slate-500 mt-1">{cameraError || (isRecording ? 'Recording video — press stop to save' : 'Capture a photo or record a clip')}</p>
                  </div>
                  <button type="button" onClick={stopCameraStream} className="rounded-2xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-100 transition hover:bg-white/10">Close</button>
                </div>
                <div className="bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onCanPlay={() => {
                      if (videoRef.current) {
                        videoRef.current.play().catch(() => {});
                      }
                    }}
                    className="h-[360px] w-full object-cover bg-slate-900"
                  />
                </div>
                <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={capturePhoto} className="rounded-full bg-sky-500 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-sky-400">Photo</button>
                    {isRecording ? (
                      <button type="button" onClick={stopRecording} className="rounded-full bg-red-500 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-red-400">Stop</button>
                    ) : (
                      <button type="button" onClick={startRecording} className="rounded-full bg-orange-500 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-orange-400">Record</button>
                    )}
                    <button type="button" onClick={() => galleryInputRef.current?.click()} className="rounded-full bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-100 transition hover:bg-white/20">Gallery</button>
                  </div>
                  {cameraError && <p className="text-sm text-orange-300">{cameraError}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-3 px-2 text-[9px] text-slate-500 uppercase font-bold tracking-[0.2em] sm:flex-row sm:justify-between">
            <p>Encrypting... [AES-256-GCM]</p>
            <p>{locationStatus}: {currentLocation}</p>
          </div>
        </footer>
      </main>

      {/* --- RIGHT PANEL (USERS) --- */}
      <aside className="w-72 bg-[#0a0a0a] border-l border-white/5 hidden lg:flex flex-col p-6 overflow-y-auto scrollbar-hide">
        <SectionHeader label="Admins" count />
        <UserItem name="COMMAND_CENTRAL" role="Master Controller" online />

        <SectionHeader label="NGO Responders" />
        <UserItem name="RESCUE_RED_CROSS" role="Active Deployment" online />
        <UserItem name="UN_RELIEF_OPS" role="Away" away />

        <SectionHeader label="Active Responders" count="402" />
        <UserItem name="FIELD_OP_ALEX" role="On Site - Seattle" online />

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
            <span className="text-gray-500">System Health</span>
            <span className="text-[#5eead4]">Optimal</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full w-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
          </div>
        </div>
      </aside>
    </div>
  );
};

// Sub-components as per original UI
const NavItem = ({ icon, label, active, badge }) => (
  <button type="button" className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-slate-900 text-slate-100" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/70"}`}>
    <span className={`${active ? "text-sky-300" : "text-slate-400"}`}>{icon}</span>
    {label}
    {badge && <span className="ml-auto bg-blue-600/10 text-blue-500 text-[10px] font-black px-2 py-0.5 rounded-md border border-blue-600/20">{badge}</span>}
  </button>
);

const SectionHeader = ({ label, count }) => (
  <div className="flex justify-between items-center mb-4 mt-8 first:mt-0">
    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">{label}</h3>
    {count && <span className="text-[10px] text-gray-700 font-bold">{count === true ? "" : count}</span>}
  </div>
);

const UserItem = ({ name, role, online, away }) => (
  <div className="flex items-center gap-3 mb-4 group cursor-pointer p-2 hover:bg-white/[0.02] rounded-xl transition-all">
    <div className="relative shrink-0">
      <div className="w-9 h-9 rounded-lg bg-slate-800 border border-white/5 overflow-hidden">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="user" />
      </div>
      {online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-[#0a0a0a]" />}
      {away && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-500 rounded-full border-2 border-[#0a0a0a]" />}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-black truncate uppercase text-gray-300 group-hover:text-blue-400">{name}</p>
      <p className="text-[9px] font-bold text-gray-600 uppercase truncate">{role}</p>
    </div>
  </div>
);

export default AdminChat;