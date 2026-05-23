import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// Đảm bảo import đúng ảnh
import paletteImg from "../assets/fragments/palette.png";
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

  // --- AUDIO SETUP ---
  const beepSound = useRef(null);
  const successSound = useRef(null);

  useEffect(() => {
    beepSound.current = new Audio(beepSoundFile);
    successSound.current = new Audio(successSoundFile);
  }, []);

  const playAudio = (audioRef, volume = 0.5) => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.volume = volume;
    audioRef.current.play().catch(() => {});
  };

  const playBeep = () => playAudio(beepSound, 0.4);
  const playSuccess = () => playAudio(successSound, 0.6);

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
    playBeep(); // Phát âm thanh báo lỗi
    setTimeLeft((prev) => Math.max(0, prev - 30)); // Trừ 30s
    setSevereError(true); // Bật hiệu ứng đỏ
    setTimeout(() => {
      setSevereError(false); // Tắt hiệu ứng sau 400ms
    }, 400);
  };

  const checkAnswer = () => {
    if (answer.trim().toLowerCase() === "fpt") {
      playSuccess(); // Phát âm thanh thành công
      setMessage("ACCESS GRANTED");
      setTimeout(() => {
        navigate("/final");
      }, 1500);
    } else {
      handlePenalty();
      setMessage("INVALID SPONSOR NAME (-30S)");
      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };

  // --- GIAO DIỆN 1: MÀN HÌNH CHỜ ---
  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 font-mono overflow-hidden">
        <div className="absolute w-[500px] h-[500px] border border-cyan-500/20 rounded-full animate-ping" />
        
        <div className="relative z-10 text-center">
          <img
            src={fragment4}
            alt="Loading Fragment"
            className="w-80 md:w-96 rounded-2xl border-2 border-cyan-400 shadow-[0_0_50px_rgba(0,255,255,0.3)] mb-8 animate-pulse"
          />
          <div className="text-cyan-400 text-xl tracking-[4px] font-bold">
            ANALYZING DATA FRAGMENT...
            <span className="inline-block w-4 animate-bounce">.</span>
            <span className="inline-block w-4 animate-bounce [animation-delay:0.2s]">.</span>
            <span className="inline-block w-4 animate-bounce [animation-delay:0.4s]">.</span>
          </div>
          <div className="mt-4 w-64 h-1 bg-cyan-900 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 animate-[load_5s_linear]"></div>
          </div>
        </div>

        <style jsx>{`
          @keyframes load {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  // --- GIAO DIỆN 2: MÀN HÌNH CÂU HỎI ---
  const screenClass = `
    min-h-screen
    bg-black
    text-cyan-400
    flex
    flex-col
    items-center
    justify-center
    p-8
    font-mono
    overflow-hidden
    relative
    transition-all
    duration-300
    ${severeError ? "scale-[1.02] blur-[1px] translate-x-2 -translate-y-1 duration-75" : ""}
  `;

  return (
    <div className={screenClass}>
      
      {/* HIỆU ỨNG NHÁY ĐỎ KHI BỊ PHẠT */}
      <div className={`
        fixed inset-0 z-[9999] pointer-events-none transition-all duration-75 mix-blend-screen
        ${severeError ? "bg-red-600/40 opacity-100" : "bg-transparent opacity-0"}
      `} />

      {/* BACKGROUND GLOW */}
      <div className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)]
        pointer-events-none
      " />

      {/* TIMER GÓC TRÊN PHẢI */}
      <div className={`
        fixed top-3 right-3
        border px-4 py-2
        rounded-2xl
        z-50
        transition-colors duration-300
        ${severeError ? "bg-red-900 border-red-400" : "bg-black/70 border-cyan-500"}
      `}>
        <p className={`text-sm ${severeError ? "text-white" : "text-cyan-400"}`}>
          TIME REMAINING
        </p>
        <p className={`text-2xl font-bold text-center ${severeError ? "text-white animate-pulse" : "text-cyan-300"}`}>
          {formatTime()}
        </p>
      </div>

      <div className="z-10 max-w-3xl w-full animate-in fade-in duration-1000">
        <div className={`
          border
          rounded-3xl
          p-8
          bg-black/70
          backdrop-blur-md
          transition-all duration-300
          ${severeError ? "border-red-600 shadow-[0_0_40px_rgba(255,0,0,0.4)]" : "border-cyan-500 shadow-[0_0_40px_rgba(0,255,255,0.15)]"}
        `}>
          <h1 className="text-4xl md:text-5xl font-black mb-8 text-center tracking-[6px]">
            STEP 5: SPONSOR
          </h1>

          <div className="flex justify-center mb-8">
            <img
              src={paletteImg}
              alt="Sponsor Color Palette"
              className={`
                w-full
                max-w-md
                rounded-2xl
                border
                transition-colors duration-300
                ${severeError ? "border-red-600 shadow-[0_0_30px_rgba(255,0,0,0.4)]" : "border-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.2)]"}
              `}
            />
          </div>

          <div className={`
            border
            rounded-2xl
            p-6
            bg-black/80
            text-lg
            leading-9
            transition-colors duration-300
            ${severeError ? "border-red-600" : "border-cyan-800"}
          `}>
            <p className="text-cyan-300 mb-4 font-bold">
              SIGNAL DECODED SUCCESSFULLY
            </p>

            <p className="text-cyan-500">
              Mảnh dữ liệu vừa rồi chứa thông tin về một thực thể quan trọng.
            </p>

            <div className={`
              mt-8
              border-t
              pt-6
              transition-colors duration-300
              ${severeError ? "border-red-900 text-red-400" : "border-cyan-900 text-cyan-600"}
            `}>
              <p className="font-bold mb-2">Requirement:</p>
              <p>Xác nhận tên nhà tài trợ dựa vào bảng màu bạn vừa thấy.</p>
            </div>
          </div>

          <input
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="ENTER SPONSOR NAME"
            className={`
              w-full
              bg-black
              border
              rounded-xl
              px-5
              py-4
              mt-8
              mb-5
              outline-none
              uppercase
              text-center
              text-2xl
              tracking-widest
              transition-colors duration-300
              ${severeError ? "border-red-600 bg-red-900/20 text-white placeholder-red-300" : "border-cyan-500 text-cyan-300"}
            `}
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
          />

          <button
            onClick={checkAnswer}
            className={`
              w-full
              font-black
              py-4
              rounded-xl
              transition-all
              duration-300
              text-xl
              ${severeError ? "bg-red-600 text-white" : "bg-cyan-500 hover:bg-cyan-400 text-black"}
            `}
          >
            VERIFY IDENTITY
          </button>

          {message && (
            <div className={`
              mt-6
              text-center
              text-2xl
              font-bold
              ${message === "ACCESS GRANTED" ? "text-green-500" : "text-red-500 animate-pulse"}
            `}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}