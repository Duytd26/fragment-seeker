import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Đổi đường dẫn này tới file ảnh chứa đoạn code Python của bro nhé
import codeSnippetImg from "../assets/fragments/palette.png"; 
import fragment4 from "../assets/fragments/fragment4.png"; 

// Import âm thanh
import beepSoundFile from "../assets/sounds/beep.mp3";
import successSoundFile from "../assets/sounds/success.mp3";

export default function ScanPage() {
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  
  // --- STATES CHO TIMER VÀ PENALTY ---
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("techfest_timer");
    return savedTime !== null ? parseInt(savedTime, 10) : 1800;
  });
  const [severeError, setSevereError] = useState(false);
  
  const navigate = useNavigate();

  // --- AUDIO HELPER ---
  const playAudioId = (id, volume = 0.5) => {
    const audioEl = document.getElementById(id);
    if (!audioEl) return;
    audioEl.pause();
    audioEl.currentTime = 0;
    audioEl.volume = volume;
    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => console.log(`Trình duyệt chặn play (${id}):`, e));
    }
  };

  const playBeep = () => playAudioId("audio-beep", 0.4);
  const playSuccess = () => playAudioId("audio-success", 0.6);

  // Audio Unlocker: Xin quyền phát âm thanh ở lần chạm đầu tiên
  useEffect(() => {
    const unlockAudio = () => {
      ["audio-beep", "audio-success"].forEach((id) => {
        const audioEl = document.getElementById(id);
        if (audioEl) {
          audioEl.volume = 0;
          const promise = audioEl.play();
          if (promise !== undefined) {
            promise.then(() => {
              audioEl.pause();
              audioEl.currentTime = 0;
            }).catch(() => {});
          }
        }
      });
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("touchstart", unlockAudio, { once: true });
    document.addEventListener("click", unlockAudio, { once: true });

    return () => {
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("click", unlockAudio);
    };
  }, []);

  // --- EFFECT ĐẾM NGƯỢC THỜI GIAN ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("techfest_timer", timeLeft.toString());
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // --- HIỆU ỨNG SPLASH SCREEN 5 GIÂY ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // --- HÀM XỬ LÝ PHẠT TRỪ TIME ---
  const handlePenalty = () => {
    playBeep(); 
    setTimeLeft((prev) => Math.max(0, prev - 30)); 
    setSevereError(true); 
    setTimeout(() => {
      setSevereError(false); 
    }, 400);
  };

  // --- LOGIC KIỂM TRA ĐÁP ÁN OUTPUT MỚI ---
  const checkAnswer = () => {
    // Chuẩn hóa chuỗi: Biến thành chữ hoa và xóa các khoảng trắng thừa
    const normalizedAnswer = answer.trim().toUpperCase().replace(/\s+/g, ' ');
    
    // Chấp nhận nhiều format để người chơi không bị bắt bẻ dấu cách
    if (
      normalizedAnswer === "TECH - FEST 2026" || 
      normalizedAnswer === "TECH-FEST 2026" || 
      normalizedAnswer === "TECH FEST 2026"
    ) {
      playSuccess();
      setMessage("OUTPUT VERIFIED");
      setTimeout(() => {
        navigate("/final");
      }, 1500);
    } else {
      handlePenalty();
      setMessage("INCORRECT OUTPUT (-30S)");
      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };

  return (
    <>
      <audio id="audio-beep" src={beepSoundFile} preload="auto" />
      <audio id="audio-success" src={successSoundFile} preload="auto" />

      {/* --- GIAO DIỆN 1: MÀN HÌNH CHỜ --- */}
      {showSplash ? (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 font-mono overflow-hidden page-scene poster-card">
          <div className="absolute w-72 h-72 md:w-[500px] md:h-[500px] border border-cyan-500/20 rounded-full animate-ping" />
          
          <div className="relative z-10 text-center w-full px-4">
            <img
              src={fragment4}
              alt="Loading Fragment"
              className="w-56 sm:w-64 md:w-96 rounded-2xl border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.3)] md:shadow-[0_0_50px_rgba(0,255,255,0.3)] mx-auto mb-6 md:mb-8 animate-pulse"
            />
            <div className="text-cyan-400 text-sm md:text-xl tracking-[2px] md:tracking-[4px] font-bold">
              COMPILING SCRIPT...
              <span className="inline-block w-2 md:w-4 animate-bounce">.</span>
              <span className="inline-block w-2 md:w-4 animate-bounce [animation-delay:0.2s]">.</span>
              <span className="inline-block w-2 md:w-4 animate-bounce [animation-delay:0.4s]">.</span>
            </div>
            <div className="mt-4 md:mt-6 w-48 md:w-64 h-1 bg-cyan-900 mx-auto rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 animate-[load_5s_linear]"></div>
            </div>
          </div>

          <style>{`
            @keyframes load {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>
      ) : (
        /* --- GIAO DIỆN 2: MÀN HÌNH CÂU HỎI --- */
        <div className={`
          min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 
          font-mono overflow-hidden relative transition-all duration-300 page-scene
          ${severeError ? "scale-[1.02] blur-[1px] translate-x-2 -translate-y-1 duration-75" : ""}
        `}>
          
          <div className={`
            fixed inset-0 z-[9999] pointer-events-none transition-all duration-75 mix-blend-screen
            ${severeError ? "bg-red-600/40 opacity-100" : "bg-transparent opacity-0"}
          `} />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1),transparent_80%)] pointer-events-none" />

          <div className={`
            fixed top-3 right-3 md:top-4 md:right-4 border px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl z-50 transition-colors duration-300
            ${severeError ? "bg-red-900 border-red-400" : "bg-black/80 border-cyan-500 backdrop-blur-md"}
          `}>
            <p className={`text-[10px] md:text-sm font-bold tracking-wider ${severeError ? "text-white" : "text-cyan-400"}`}>
              TIME REMAINING
            </p>
            <p className={`text-lg md:text-2xl font-black text-center ${severeError ? "text-white animate-pulse" : "text-cyan-300"}`}>
              {formatTime()}
            </p>
          </div>

          <div className="z-10 max-w-2xl w-full mt-12 md:mt-0 animate-in fade-in zoom-in-95 duration-700">
            <div className={`
              border rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 bg-black/70 backdrop-blur-md transition-all duration-300 poster-card
              ${severeError ? "border-red-600 shadow-[0_0_30px_rgba(255,0,0,0.4)]" : "border-cyan-500 shadow-[0_0_40px_rgba(0,255,255,0.15)]"}
            `}>
              
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-6 md:mb-8 text-center tracking-[2px] md:tracking-[4px] uppercase neon-title">
                STEP 5: SCRIPT EXECUTION
              </h1>

              <div className="flex justify-center mb-6 md:mb-8">
                <img
                  src={codeSnippetImg}
                  alt="Python Code Snippet"
                  className={`
                    w-full max-w-[320px] sm:max-w-md md:max-w-lg rounded-xl md:rounded-2xl border transition-colors duration-300
                    ${severeError ? "border-red-600 shadow-[0_0_20px_rgba(255,0,0,0.4)]" : "border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.2)]"}
                  `}
                />
              </div>

              {/* BOX THÔNG TIN ĐÃ ĐƯỢC DỌN DẸP */}
              <div className={`
                border rounded-xl md:rounded-2xl p-4 md:p-6 bg-black/80 text-sm md:text-lg leading-relaxed md:leading-9 transition-colors duration-300
                ${severeError ? "border-red-900" : "border-cyan-900"}
              `}>
                <p className={`font-bold mb-1 md:mb-2 uppercase tracking-widest text-xs md:text-base ${severeError ? "text-red-400" : "text-cyan-600"}`}>
                  Requirement:
                </p>
                <p className="text-sm md:text-base text-cyan-500 text-justify">
                  Phân tích đoạn mã Python trên và nhập chính xác OUTPUT (kết quả hiển thị) của chương trình.
                </p>
              </div>

              <input
                autoFocus
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="ENTER THE OUTPUT"
                className={`
                  w-full cyber-input border rounded-lg md:rounded-xl px-4 py-3 md:px-5 md:py-4 mt-6 md:mt-8 mb-4 md:mb-5 outline-none uppercase text-center 
                  text-lg md:text-2xl tracking-widest transition-colors duration-300
                  ${severeError ? "border-red-600 bg-red-900/20 text-white placeholder-red-300" : "border-cyan-500 text-cyan-300"}
                `}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              />

              <button
                onClick={checkAnswer}
                className={`
                  w-full font-black py-3 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 text-base md:text-xl tracking-wider glow-button
                  ${severeError ? "bg-red-600 text-white" : "text-black"}
                `}
              >
                EXECUTE
              </button>

              {message && (
                <div className={`
                  mt-4 md:mt-6 text-center text-lg md:text-2xl font-bold
                  ${message === "OUTPUT VERIFIED" ? "text-green-500" : "text-red-500 animate-pulse"}
                `}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}