import { useState, useEffect, useRef } from "react";
import reconstructed from "../assets/final/reconstructed.png";

// Import âm thanh
import beepSoundFile from "../assets/sounds/beep.mp3";
import successSoundFile from "../assets/sounds/winner.mp3";

export default function FinalPage() {
  const [finalKey, setFinalKey] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  // --- STATES CHO TIMER VÀ PENALTY ---
  const [severeError, setSevereError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("techfest_timer");
    return savedTime !== null ? parseInt(savedTime, 10) : 1800;
  });

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

  // --- EFFECT ĐẾM NGƯỢC VÀ LƯU VÀO LOCALSTORAGE ---
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

  // --- HÀM XỬ LÝ PHẠT TRỪ TIME ---
  const handlePenalty = () => {
    playBeep(); // Phát âm thanh báo lỗi
    setTimeLeft((prev) => Math.max(0, prev - 30));
    setSevereError(true);
    setTimeout(() => {
      setSevereError(false);
    }, 400);
  };

  const checkFinalKey = () => {
    const answer = finalKey.trim().toLowerCase();

    if (
      answer === "hai phong" ||
      answer === "haiphong" ||
      answer === "hải phòng" ||
      answer === "tp hải phòng"
    ) {
      playSuccess(); // Phát âm thanh thành công
      setSuccess(true);
      setMessage("ARCHIVE FULLY RESTORED");
    } else {
      handlePenalty();
      setMessage("INVALID FINAL KEY (-30S)");
      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };

  const screenClass = `
    min-h-screen
    bg-black
    text-yellow-300
    flex
    flex-col
    items-center
    justify-center
    p-8
    font-mono
    relative
    overflow-hidden
    transition-all
    duration-300
    ${severeError ? "scale-[1.02] blur-[1px] translate-x-2 -translate-y-1 duration-75" : ""}
  `;

  return (
    <div className={screenClass}>
      
      {/* RED FLASH PENALTY OVERLAY */}
      <div className={`
        fixed inset-0 z-[9999] pointer-events-none transition-all duration-75 mix-blend-screen
        ${severeError ? "bg-red-600/40 opacity-100" : "bg-transparent opacity-0"}
      `} />

      {/* TIMER ĐỒNG BỘ */}
      <div className={`
        fixed top-3 right-3
        border px-4 py-2
        rounded-2xl
        z-50
        transition-colors duration-300
        ${severeError ? "bg-red-900 border-red-400" : "bg-black/70 border-yellow-500"}
      `}>
        <p className={`text-sm ${severeError ? "text-white" : "text-yellow-400"}`}>
          TIME REMAINING
        </p>
        <p className={`text-2xl font-bold text-center ${severeError ? "text-white animate-pulse" : "text-yellow-300"}`}>
          {formatTime()}
        </p>
      </div>

      {/* SCANLINES */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,0,0.15)_1px,transparent_1px)] bg-[size:100%_3px]" />
      </div>

      <div className="z-10 text-center max-w-5xl">
        <p className="tracking-[0.5em] text-yellow-500 mb-4 animate-pulse">
          ARCHIVE RECOVERY COMPLETE
        </p>

        <h1 className="text-5xl md:text-7xl font-black mb-10 text-yellow-300 tracking-widest">
          THE FRAGMENT SEEKER
        </h1>

        {/* RECONSTRUCTED IMAGE */}
        <div className="flex justify-center">
          <img
            src={reconstructed}
            alt="Reconstructed Fragment"
            className={`
              w-full
              max-w-4xl
              rounded-3xl
              border-4
              mb-10
              transition-all duration-300
              ${severeError ? "border-red-600 shadow-[0_0_50px_rgba(255,0,0,0.4)]" : "border-yellow-500 shadow-[0_0_50px_rgba(255,255,0,0.2)]"}
            `}
          />
        </div>

        {/* FINAL INPUT */}
        {!success && (
          <div className={`
            border
            bg-black/70
            rounded-3xl
            p-8
            mb-8
            max-w-2xl
            mx-auto
            transition-colors duration-300
            ${severeError ? "border-red-600" : "border-yellow-500"}
          `}>
            <p className="text-yellow-500 tracking-[0.3em] mb-6 font-bold">
              ENTER FINAL KEYWORD
            </p>

            <input
              autoFocus
              value={finalKey}
              onChange={(e) => setFinalKey(e.target.value)}
              placeholder="FINAL KEY"
              className={`
                w-full
                bg-black
                border
                rounded-xl
                px-5
                py-4
                mb-5
                outline-none
                uppercase
                text-center
                text-2xl
                tracking-widest
                transition-colors duration-300
                ${severeError ? "border-red-600 bg-red-900/20 text-white placeholder-red-300" : "border-yellow-500 text-yellow-200"}
              `}
              onKeyDown={(e) => e.key === 'Enter' && checkFinalKey()}
            />

            <button
              onClick={checkFinalKey}
              className={`
                w-full
                font-black
                py-4
                rounded-xl
                text-xl
                transition-all duration-300
                ${severeError ? "bg-red-600 text-white" : "bg-yellow-500 hover:bg-yellow-400 text-black"}
              `}
            >
              RESTORE ARCHIVE
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="
            border
            border-green-500
            bg-black/70
            rounded-3xl
            p-10
            text-green-300
            leading-8
            max-w-3xl
            mx-auto
            animate-in fade-in zoom-in duration-700
          ">
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-green-400">
              MISSION COMPLETE!
            </h2>
            <p className="text-lg md:text-xl">
              Fragment reconstruction successful.
            </p>
            <p className="text-lg md:text-xl">
              Hidden archive fully restored.
            </p>
            <p className="mt-6 text-cyan-400 text-xl font-bold tracking-widest">
              Welcome back, Administrator.
            </p>
          </div>
        )}

        {/* MESSAGE */}
        {message && (
          <div className={`
            mt-6
            text-2xl
            font-black
            ${message === "ARCHIVE FULLY RESTORED" ? "text-green-400" : "text-red-500 animate-pulse"}
          `}>
            {message}
          </div>
        )}

        {/* SECRET HINT */}
        {!success && (
          <div className="mt-10 text-sm text-zinc-600 tracking-[0.3em] font-bold">
            MEMORY IS THE KEY
          </div>
        )}
      </div>
    </div>
  );
}