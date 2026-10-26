import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import userImg from "../assets/user.gif"

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [inputText, setInputText] = useState("")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const [ham, setHam] = useState(false)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  }

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    }
    synth.cancel();
    synth.speak(utterance);
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response);

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if (type === 'calculator-open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }
    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  }

  const processQuery = async (query) => {
    if (!query || !query.trim()) return;
    setAiText("");
    setUserText(query);
    try {
      recognitionRef.current?.stop();
    } catch (_) {}
    isRecognizingRef.current = false;
    setListening(false);

    const data = await getGeminiResponse(query);
    if (data) {
      handleCommand(data);
      setAiText(data.response);
    }
  }

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      processQuery(inputText.trim());
      setInputText("");
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript) {
        processQuery(transcript);
      }
    };

    const greeting = new SpeechSynthesisUtterance(`Hello ${userData?.name || 'there'}, what can I help you with?`);
    greeting.lang = 'hi-IN';
    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      try {
        recognition.stop();
      } catch (_) {}
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div className='w-full min-h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] p-4 relative'>
      <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={() => setHam(true)} />
      
      {/* Mobile Drawer */}
      <div className={`fixed lg:hidden top-0 right-0 w-3/4 max-w-[320px] h-full bg-[#000000bd] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start z-50 ${ham ? "translate-x-0" : "translate-x-full"} transition-transform duration-300`}>
        <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer' onClick={() => setHam(false)} />
        <button className='w-full h-[50px] text-black font-semibold bg-white rounded-full cursor-pointer text-[17px]' onClick={handleLogOut}>Log Out</button>
        <button className='w-full h-[50px] text-black font-semibold bg-white rounded-full cursor-pointer text-[17px] px-[15px]' onClick={() => navigate("/customize")}>Customize Assistant</button>
        <div className='w-full h-[1px] bg-gray-500 my-2'></div>
        <h1 className='text-white font-semibold text-[18px]'>History</h1>
        <div className='w-full max-h-[300px] gap-[10px] overflow-y-auto flex flex-col'>
          {userData?.history?.map((his, idx) => (
            <div key={idx} className='text-gray-300 text-[15px] truncate'>{his}</div>
          ))}
        </div>
      </div>

      {/* Desktop Buttons */}
      <button className='min-w-[140px] h-[50px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[17px] hover:bg-gray-200 transition-all' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[140px] h-[50px] text-black font-semibold bg-white absolute top-[85px] right-[20px] rounded-full cursor-pointer text-[17px] px-[20px] hidden lg:block hover:bg-gray-200 transition-all' onClick={() => navigate("/customize")}>Customize</button>

      {/* Assistant Avatar */}
      <div className='w-[240px] h-[300px] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl border border-blue-500/30'>
        <img src={userData?.assistantImage} alt="Assistant" className='h-full w-full object-cover' />
      </div>

      <h1 className='text-white text-[20px] font-semibold tracking-wide'>I'm {userData?.assistantName || "Assistant"}</h1>

      {/* Status indicator */}
      <div className='flex items-center gap-2 text-sm text-gray-300'>
        <span className={`w-3 h-3 rounded-full ${listening ? "bg-red-500 animate-pulse" : "bg-green-500"}`}></span>
        <span>{listening ? "Listening... (speak now)" : "Ready"}</span>
      </div>

      {/* Animated status wave */}
      {!aiText && <img src={userImg} alt="listening wave" className='w-[160px]' />}
      {aiText && <img src={aiImg} alt="speaking wave" className='w-[160px]' />}

      {/* Dialog response */}
      <div className='min-h-[30px] max-w-[600px] text-center px-4'>
        <h1 className='text-white text-[17px] font-medium text-wrap'>
          {userText ? `You: "${userText}"` : aiText ? `${userData?.assistantName || "AI"}: "${aiText}"` : "Say or type something to start..."}
        </h1>
      </div>

      {/* Interactive Text Input & Mic fallback */}
      <form onSubmit={handleTextSubmit} className='flex items-center gap-2 w-full max-w-[500px] px-4 mt-2'>
        <button
          type="button"
          onClick={startRecognition}
          className={`p-3 rounded-full text-white cursor-pointer transition-all ${listening ? "bg-red-600 shadow-red-500/50 shadow-lg" : "bg-blue-600 hover:bg-blue-700"}`}
          title="Click to activate voice mic"
        >
          <FaMicrophone />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask ${userData?.assistantName || "Assistant"} anything... (e.g. what time is it)`}
          className='flex-1 h-[45px] px-4 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-blue-400'
        />
        <button
          type="submit"
          className='p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white cursor-pointer transition-all'
          title="Send command"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  )
}

export default Home