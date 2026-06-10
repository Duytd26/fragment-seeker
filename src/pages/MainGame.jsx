import { useEffect, useRef, useState } from "react";

import fragment1 from "../assets/fragments/fragment1.png";
import fragment2 from "../assets/fragments/fragment2.png";
import fragment3 from "../assets/fragments/fragment3.png";

import campusImg from "../assets/campus.jpg";

import beepSoundFile from "../assets/sounds/beep.mp3";
import glitchSoundFile from "../assets/sounds/glitch.mp3";
import successSoundFile from "../assets/sounds/success.mp3";

export default function MainGame() {

  // =========================
  // QUESTION POOLS
  // =========================

  const step1Questions = [
    {
      question: "1, 1, 2, 3, 5, 8, ?",
      answer: "13",
      hint: "Tổng của hai số đứng liền trước."
    },
    {
      question: "2, 5, 11, 23, 47, ?",
      answer: "95",
      hint: "Nhân đôi số trước rồi cộng thêm 1."
    },
    {
      question: "1, 2, 6, 24, 120, ?",
      answer: "720",
      hint: "Nhân số trước lần lượt với 2, 3, 4, 5..."
    },
    {
      question: "5, 7, 11, 19, 35, ?",
      answer: "67",
      hint: "Khoảng cách tăng theo lũy thừa của 2."
    },
    {
      question: "12, 15, 21, 30, 42, ?",
      answer: "48",
      hint: "Số sau bằng số trước cộng tổng các chữ số của nó."
    },
    {
      question: "3, 4, 7, 12, 19, 28, ?",
      answer: "39",
      hint: "Khoảng cách là dãy số lẻ tăng dần."
    },
    {
      question: "2, 3, 6, 7, 14, 15, ?",
      answer: "30",
      hint: "Quy luật xen kẽ: cộng rồi nhân."
    },
    {
      question: "1, 8, 27, 64, 125, ?",
      answer: "216",
      hint: "Lập phương các số tự nhiên liên tiếp."
    },
    {
      question: "18, 10, 6, 4, 3, ?",
      answer: "2.5",
      hint: "Chia đôi số trước rồi cộng thêm 1."
    },
    {
      question: "4, 9, 25, 49, 121, ?",
      answer: "169",
      hint: "Bình phương các số nguyên tố liên tiếp."
    }
  ];

  const step2Questions = [
    {
      question: "FPTU AI Club là gì?",
      answer: "cau lac bo tri tue nhan tao",
      hint: "Tên đầy đủ của CLB"
    },
    {
      question: "FPTU AI Club đã có bao nhiêu follower trên Facebook?",
      answer: "7600",
      hint: "7x00"
    },
    {
      question: "Sự kiện TechFest có bao nhiêu gian hàng?",
      answer: "10",
      hint: "Quan sát toàn bộ khu vực sự kiện"
    },
    {
      question: "Hiện tại có bao nhiêu chiếc RC car đang được trưng bày tại khu vực big game?",
      answer: "2",
      hint: "Tìm khu big game"
    },
    {
      question: "Màu sắc chủ đạo trên áo đồng phục BTC TechFest hôm nay là màu gì?",
      answer: "xanh than",
      hint: "Quan sát áo BTC"
    },
    {
      question: "Khẩu hiệu chính thức của TechFest năm nay là gì?",
      answer: "break the limit",
      hint: "Xuất hiện trên banner chính"
    },
    {
      question: "Trong AI, hai chữ A và I là viết tắt của cụm từ tiếng Anh nào?",
      answer: "artificial intelligence",
      hint: "Kiến thức công nghệ cơ bản"
    },
    {
      question: "Gặp anh Trưởng ban chuyên môn Nguyễn Nam Khánh để kiếm key cho câu hỏi này :3",
      answer: "i love you",
      hint: "Hỏi trực tiếp anh Khánh"
    },
    {
      question: "FPTU AI Club đã tổ chức bao nhiêu mùa TechFest?",
      answer: "2",
      hint: "Thông tin truyền thông sự kiện"
    },
    {
      question: "Kể tên 3 đơn vị tổ chức sự kiện TechFest",
      answer: "fptu ai club fcode dsac",
      hint: "Xuất hiện trên poster sự kiện"
    },
    {
      question: "Kể tên 1 nhà tài trợ bất kỳ của TechFest",
      answer: "fpt software",
      hint: "Logo xuất hiện ở backdrop"
    }
  ];

  const step3Questions = [
    {
      question: "Gero kodi klu skryt, vedi pobeda.",
      answer: "nguoi choi giai ma mat ma an giau tim thay chien thang",
      hint: "Dùng bảng từ điển Kanaxian"
    },
    {
      question: "Gero skan svezi.",
      answer: "nguoi choi quet tin hieu",
      hint: "Skan = Scan"
    },
    {
      question: "Kodi klu, vedi lokos.",
      answer: "giai ma mat ma tim thay dia diem"
    },
    {
      question: "Null set.",
      answer: "he thong loi",
      hint: "Null = lỗi"
    },
    {
      question: "Gero vedi skryt lokos.",
      answer: "nguoi choi tim thay dia diem bi an"
    },
    {
      question: "Skan svezi, kodi klu.",
      answer: "quet tin hieu giai ma mat ma"
    },
    {
      question: "Gero pobeda.",
      answer: "nguoi choi chien thang"
    },
    {
      question: "Nix pobeda.",
      answer: "khong chien thang",
      hint: "Nix = phủ định"
    },
    {
      question: "Kodi svezi skryt.",
      answer: "giai ma tin hieu an giau"
    },
    {
      question: "Vedi klu, gero pobeda.",
      answer: "tim thay chia khoa nguoi choi chien thang"
    }
  ];

  // =========================
  // STATES
  // =========================

  const [step, setStep] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  // Khởi tạo thời gian: Lấy từ localStorage, nếu chưa có thì mặc định là 1800s
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("techfest_timer");
    return savedTime !== null ? parseInt(savedTime, 10) : 1800;
  });

  // Mỗi khi đồng hồ nhảy (mỗi giây) hoặc bị phạt trừ điểm, lập tức lưu vào localStorage
  useEffect(() => {
    localStorage.setItem("techfest_timer", timeLeft.toString());
  }, [timeLeft]);
  const [glitch, setGlitch] = useState(false);
  const [severeError, setSevereError] = useState(false); // State quản lý nháy đỏ màn hình
  const [message, setMessage] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const [showFragment1, setShowFragment1] = useState(false);
  const [showFragment2, setShowFragment2] = useState(false);
  const [showFragment3, setShowFragment3] = useState(false);

  const [fragments, setFragments] = useState({
    f1: false,
    f2: false,
    f3: false,
  });

  // =========================
  // AUDIO
  // =========================

  const beepSound = useRef(null);
  const glitchSound = useRef(null);
  const successSound = useRef(null);

  useEffect(() => {
    beepSound.current = new Audio(beepSoundFile);
    glitchSound.current = new Audio(glitchSoundFile);
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
  const playGlitch = () => playAudio(glitchSound, 0.5);
  const playSuccess = () => playAudio(successSound, 0.6);

  // =========================
  // HELPERS
  // =========================

  const normalizeText = (text) => {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const getRandomQuestion = (pool) => {
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  };

  // =========================
  // TIME PENALTY HANDLER
  // =========================

  const handlePenalty = () => {
    playBeep();
    // Trừ 30s, nếu còn ít hơn 30s thì set về 0 để không bị số âm
    setTimeLeft((prev) => Math.max(0, prev - 30)); 
    setSevereError(true);
    // Tắt nháy đỏ sau 400ms
    setTimeout(() => {
      setSevereError(false);
    }, 400);
  };

  // =========================
  // TIMER
  // =========================

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // =========================
  // BOOT
  // =========================

  useEffect(() => {
    if (step === 0) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 4;
        setBootProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            playGlitch();
            setStep(1);
          }, 700);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [step]);

  // =========================
  // RANDOM GLITCH
  // =========================

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => {
        setGlitch(false);
      }, 120);
    }, 4000);
    return () => clearInterval(glitchInterval);
  }, []);

  // =========================
  // RANDOM QUESTIONS
  // =========================

  useEffect(() => {
    if (step === 1) setCurrentQuestion(getRandomQuestion(step1Questions));
    if (step === 2) setCurrentQuestion(getRandomQuestion(step2Questions));
    if (step === 3) setCurrentQuestion(getRandomQuestion(step3Questions));
    setAnswerInput("");
  }, [step]);

  useEffect(() => {
    setShowHint(false);
    if (![1, 2, 3].includes(step)) return;

    const hintTimer = setTimeout(() => {
      setShowHint(true);
    }, 60000);

    return () => clearTimeout(hintTimer);
  }, [step, currentQuestion]);

  // =========================
  // CHECK ANSWER
  // =========================

  const checkAnswer = (correctAnswer, nextStep, fragmentKey) => {
    if (normalizeText(answerInput) === normalizeText(correctAnswer)) {
      playSuccess();
      setFragments((prev) => ({
        ...prev,
        [fragmentKey]: true,
      }));
      setMessage("ACCESS GRANTED");

      if (fragmentKey === "f1") setTimeout(() => setShowFragment1(true), 500);
      if (fragmentKey === "f2") setTimeout(() => setShowFragment2(true), 500);
      if (fragmentKey === "f3") setTimeout(() => setShowFragment3(true), 500);

      setTimeout(() => {
        setShowFragment1(false);
        setShowFragment2(false);
        setShowFragment3(false);
        setMessage("");
        setStep(nextStep);
      }, 3000);
    } else {
      handlePenalty();
      setMessage("INVALID ANSWER (-30S)");
      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };

  // =========================
  // MASTER KEY
  // =========================

  const checkMasterKey = () => {
    const key = normalizeText(masterKey);

    if (key === "hai phong" || key === "haiphong" || key === "tp hai phong") {
      playSuccess();
      setFragments({
        f1: true,
        f2: true,
        f3: true,
      });
      setMessage("SYSTEM UNLOCKED");

      setTimeout(() => {
        setStep(999);
      }, 1500);
    } else {
      handlePenalty();
      setMessage("INVALID MASTER KEY (-30S)");
      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };

  // =========================
  // SCREEN CLASS
  // =========================

  // Bổ sung hiệu ứng rung giật + nhòe (shake, blur) khi trả lời sai
  const screenClass = `
    min-h-screen
    w-full
    bg-black
    text-green-400
    flex
    flex-col
    items-center
    justify-start
    p-4
    md:p-6
    font-mono
    overflow-x-hidden
    overflow-y-auto
    relative
    transition-all
    page-scene
    ${glitch ? "scale-[1.002] duration-150" : "duration-300"}
    ${severeError ? "scale-[1.02] blur-[1px] translate-x-2 -translate-y-1 duration-75" : ""}
  `;

  return (
    <div className={screenClass}>
      
      {/* RED FLASH PENALTY OVERLAY */}
      <div className={`
        fixed inset-0 z-[9999] pointer-events-none transition-all duration-75 mix-blend-screen
        ${severeError ? "bg-red-600/40 opacity-100" : "bg-transparent opacity-0"}
      `} />

      {/* SCANLINES */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,255,0,0.15)_1px,transparent_1px)] bg-[size:100%_3px]" />
      </div>

      {/* TIMER */}
      <div className={`
        fixed top-3 right-3
        border px-4 py-2
        rounded-2xl
        z-50
        transition-colors duration-300
        ${severeError ? "bg-red-900 border-red-400" : "bg-black/70 border-red-500"}
      `}>
        <p className={`text-sm ${severeError ? "text-white" : "text-red-400"}`}>
          TIME REMAINING
        </p>
        <p className={`text-2xl font-bold text-center ${severeError ? "text-white animate-pulse" : "text-red-300"}`}>
          {formatTime()}
        </p>
      </div>

      {/* INVENTORY */}
      <div className="
        relative
        mt-24
        mb-6
        w-full
        max-w-xs
        border
        border-cyan-500
        rounded-2xl
        bg-black/70
        p-5
        poster-card
      ">
        <p className="text-cyan-300 mb-4 font-bold neon-accent">
          FRAGMENT INVENTORY
        </p>
        <div className="space-y-3 text-sm">
          <div className={fragments.f1 ? "text-green-400 font-bold" : "text-zinc-600"}>
            {fragments.f1 ? "[✓]" : "[ ]"} Fragment 01
          </div>
          <div className={fragments.f2 ? "text-yellow-400 font-bold" : "text-zinc-600"}>
            {fragments.f2 ? "[✓]" : "[ ]"} Fragment 02
          </div>
          <div className={fragments.f3 ? "text-purple-400 font-bold" : "text-zinc-600"}>
            {fragments.f3 ? "[✓]" : "[ ]"} Fragment 03
          </div>
        </div>
      </div>

      {/* MASTER KEY */}
      <div className="
        relative
        mt-6
        w-full
        max-w-md
        border
        border-red-500
        bg-black/80
        p-5
        rounded-2xl
        poster-card
      ">
        <p className="text-red-400 mb-3 font-bold neon-accent">
          FINAL MASTER KEY
        </p>
        <input
          value={masterKey}
          onChange={(e) => setMasterKey(e.target.value)}
          placeholder="ENTER KEY TO OVERRIDE"
          className={`
            w-full cyber-input border px-4 py-3 rounded-xl mb-3 outline-none uppercase transition-colors
            ${severeError ? "border-red-600 text-white bg-red-900/30" : "border-red-500 text-red-300"}
          `}
          onKeyDown={(e) => e.key === 'Enter' && checkMasterKey()}
        />
        <button
          onClick={checkMasterKey}
          className="
            w-full
            glow-button
            hover:brightness-105
            text-black
            font-black
            py-3
            rounded-xl
            transition-all
          "
        >
          VERIFY
        </button>
      </div>

      {/* STEP 0 */}
      {step === 0 && (
        <div className="w-full max-w-2xl z-10 mt-10">
          <div className="text-center mb-10">
            <h1 className="
              text-3xl md:text-5xl
              font-black
              tracking-[8px]
              text-green-300
              mb-4
              animate-pulse
            ">
              THE HIDDEN SIGNAL
            </h1>
            <p className="text-green-500 text-lg">
              INITIALIZING GAME
            </p>
          </div>
          <div className="border border-green-500 p-6 rounded-3xl bg-black/60">
            <div className="flex justify-between mb-3 text-sm">
              <span>LOADING...</span>
              <span>{bootProgress}%</span>
            </div>
            <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden border border-green-700">
              <div
                className="h-full bg-green-400 transition-all duration-100"
                style={{ width: `${bootProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 1 / 2 / 3 */}
      {[1, 2, 3].includes(step) && currentQuestion && (
        <div className="max-w-4xl w-full z-10 mt-6">
          <div className={`
            rounded-3xl
            p-5 md:p-8
            bg-black/70
            border
            transition-all duration-300
            ${step === 1 ? "border-green-500 text-green-300" : ""}
            ${step === 2 ? "border-yellow-500 text-yellow-300" : ""}
            ${step === 3 ? "border-purple-500 text-purple-300" : ""}
            ${severeError ? "!border-red-600 shadow-[0_0_30px_rgba(255,0,0,0.4)]" : ""}
          `}>
            <h2 className="text-2xl md:text-4xl font-black mb-8 text-center tracking-widest">
              {step === 1 && "PHASE 1: Mystery Number Sequence"}
              {step === 2 && "PHASE 2: TechFest Event Knowledge Challenge"}
              {step === 3 && "PHASE 3: Kanaxian Decoding Missions"}
            </h2>

            <div className={`
              bg-black
              border
              rounded-2xl
              p-5 md:p-10
              mb-8
              text-center
              transition-colors duration-300
              ${severeError ? "border-red-600" : ""}
            `}>
              <p className="text-2xl md:text-3xl font-black mb-8 leading-relaxed">
                {currentQuestion.question}
              </p>
              <div className="mt-8 border-t pt-4 opacity-70">
                Hint: {showHint ? (currentQuestion.hint ?? "No hint available.") : "Decrypting hint... Please wait."}
              </div>
            </div>

            <input
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="ENTER ANSWER"
              className={`
                w-full cyber-input border rounded-xl px-5 py-4 mb-5 uppercase outline-none transition-colors duration-300
                ${severeError ? "border-red-600 bg-red-900/20 text-white placeholder-red-300" : "border-cyan-500 text-cyan-100"}
              `}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer(
                currentQuestion.answer,
                step + 1,
                step === 1 ? "f1" : step === 2 ? "f2" : "f3"
              )}
            />

            <button
              onClick={() =>
                checkAnswer(
                  currentQuestion.answer,
                  step + 1,
                  step === 1 ? "f1" : step === 2 ? "f2" : "f3"
                )
              }
              className={`
                w-full font-black py-4 rounded-xl transition-all duration-300 glow-button
                ${severeError ? "bg-red-600 text-white" : "text-black"}
              `}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="max-w-5xl w-full z-10 text-center mt-6">
          <div className="border border-cyan-500 rounded-3xl p-5 md:p-10 bg-black/70">
            <h1 className="text-4xl md:text-6xl font-black text-cyan-300 mb-10 tracking-widest">
              QR CODE SEARCH
            </h1>
            <img
              src={campusImg}
              className="
                w-full
                max-w-4xl
                rounded-3xl
                border-4
                border-cyan-500
                mx-auto
                mb-10
              "
            />
            <div className="
              border
              border-cyan-700
              rounded-2xl
              p-5 md:p-10
              bg-black/60
              max-w-3xl
              mx-auto
            ">
              <p className="text-2xl md:text-3xl font-black text-cyan-300 mb-6">
                REAL WORLD CHECKPOINT
              </p>
              <p className="text-cyan-200 leading-8 text-lg">
                The next clue exists somewhere in the real world.
                <br />
                Use your phone camera to continue the journey.
              </p>
              <div className="mt-8 text-cyan-500 text-sm opacity-70">
                Scan the nearby QR code
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENDING */}
      {step === 999 && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[999] p-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-7xl font-black text-red-500 mb-8 animate-pulse tracking-widest">
              CONGRATULATIONS
            </h1>
            <p className="text-red-300 text-xl md:text-2xl mb-10">
              FINAL PUZZLE COMPLETED
            </p>
            <div className="
              border
              border-red-500
              rounded-3xl
              p-5 md:p-10
              bg-black/70
            ">
              <p className="text-red-400 text-lg md:text-xl leading-10">
                All fragments recovered.
                <br />
                Welcome to the final archive.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE */}
      {message && (
        <div className={`
          fixed
          top-20
          left-1/2
          -translate-x-1/2
          text-xl md:text-2xl
          font-black
          z-[999]
          px-6 py-3
          rounded-xl
          bg-black/90
          border
          ${message === "ACCESS GRANTED" || message === "SYSTEM UNLOCKED" ? "border-green-500 text-green-400" : "border-red-500 text-red-500 animate-pulse"}
        `}>
          {message}
        </div>
      )}

      {/* FRAGMENT 1 */}
      {showFragment1 && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <img
            src={fragment1}
            className="w-full max-w-sm rounded-3xl border-4 border-green-500"
          />
        </div>
      )}

      {/* FRAGMENT 2 */}
      {showFragment2 && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <img
            src={fragment2}
            className="w-full max-w-sm rounded-3xl border-4 border-yellow-500"
          />
        </div>
      )}

      {/* FRAGMENT 3 */}
      {showFragment3 && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <img
            src={fragment3}
            className="w-full max-w-sm rounded-3xl border-4 border-purple-500"
          />
        </div>
      )}
    </div>
  );
}