import { useState, useEffect } from "react";
import reconstructed from "../assets/final/reconstructed.png";

// Import âm thanh
import beepSoundFile from "../assets/sounds/beep.mp3";
import successSoundFile from "../assets/sounds/success.mp3";
import winnerSoundFile from "../assets/sounds/winner.mp3";

const PUZZLE_PIECES = [
  { id: "p1", bgPos: "0% 0%" },
  { id: "p2", bgPos: "25% 0%" },
  { id: "p3", bgPos: "50% 0%" },
  { id: "p4", bgPos: "75% 0%" },
  { id: "p5", bgPos: "100% 0%" },
];

export default function FinalPage() {
  const [finalKey, setFinalKey] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [isAssembled, setIsAssembled] = useState(false);
  const [availablePieces, setAvailablePieces] = useState([]);
  const [board, setBoard] = useState([null, null, null, null, null]);

  // States cho Custom Drag & Drop
  const [draggingPiece, setDraggingPiece] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

  const [severeError, setSevereError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("techfest_timer");
    return savedTime !== null ? parseInt(savedTime, 10) : 1800;
  });

  useEffect(() => {
    setAvailablePieces([...PUZZLE_PIECES].sort(() => Math.random() - 0.5));
  }, []);

  // --- AUDIO HELPER (Dùng HTML Audio Elements trực tiếp) ---
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
  const playWinner = () => playAudioId("audio-winner", 0.8);

  // Mẹo nhỏ: Bật âm lượng 0 một lần khi chạm màn hình để mở khóa AudioContext (iOS Fix)
  useEffect(() => {
    const unlockAudio = () => {
      ["audio-beep", "audio-success", "audio-winner"].forEach((id) => {
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

  // --- THỜI GIAN ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
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

  const handlePenalty = () => {
    playBeep();
    setTimeLeft((prev) => Math.max(0, prev - 30));
    setSevereError(true);
    setTimeout(() => setSevereError(false), 400);
  };

  // --- LOGIC KÉO THẢ TÙY CHỈNH ---
  const handlePointerDown = (e, piece) => {
    e.preventDefault(); 
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDraggingPiece(piece);
    setDragPos({ x: clientX, y: clientY });
  };

  const handlePointerMove = (e) => {
    if (!draggingPiece) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragPos({ x: clientX, y: clientY });
  };

  const handlePointerUp = (e) => {
    if (!draggingPiece) return;
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    let droppedIndex = -1;
    
    // Quét tìm ô chứa dựa trên element thay vì ref
    const slots = document.querySelectorAll(".puzzle-slot");
    slots.forEach((slot, index) => {
      const rect = slot.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        droppedIndex = index;
      }
    });

    if (droppedIndex !== -1 && board[droppedIndex] === null) {
      const newBoard = [...board];
      newBoard[droppedIndex] = draggingPiece;
      setBoard(newBoard);
      setAvailablePieces((prev) => prev.filter((p) => p.id !== draggingPiece.id));
      checkPuzzleCompletion(newBoard);
    }
    setDraggingPiece(null);
  };

  useEffect(() => {
    if (draggingPiece) {
      window.addEventListener("mousemove", handlePointerMove, { passive: false });
      window.addEventListener("touchmove", handlePointerMove, { passive: false });
      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchend", handlePointerUp);
    } else {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
    }
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [draggingPiece, board]);

  const handleRemoveFromBoard = (index, piece) => {
    const newBoard = [...board];
    newBoard[index] = null;
    setBoard(newBoard);
    setAvailablePieces((prev) => [...prev, piece]);
    setIsAssembled(false);
  };

  const checkPuzzleCompletion = (currentBoard) => {
    const isCorrect =
      currentBoard[0]?.id === "p1" &&
      currentBoard[1]?.id === "p2" &&
      currentBoard[2]?.id === "p3" &&
      currentBoard[3]?.id === "p4" &&
      currentBoard[4]?.id === "p5";

    if (isCorrect) {
      playSuccess(); // Âm thanh kêu khi ghép đúng
      setIsAssembled(true);
    } else if (currentBoard.every((slot) => slot !== null)) {
      handlePenalty();
      setMessage("FRAGMENT MISMATCH (-30S)");
      setTimeout(() => setMessage(""), 1500);
      setAvailablePieces([...PUZZLE_PIECES].sort(() => Math.random() - 0.5));
      setBoard([null, null, null, null, null]);
    }
  };

  const checkFinalKey = () => {
    const answer = finalKey.trim().toLowerCase();
    if (
      answer === "hai phong" ||
      answer === "haiphong" ||
      answer === "hải phòng" ||
      answer === "tp hải phòng"
    ) {
      playWinner(); // Gọi Winner Play trước khi update state
      setSuccess(true);
      setMessage("ARCHIVE FULLY RESTORED");
    } else {
      handlePenalty();
      setMessage("INVALID FINAL KEY (-30S)");
      setTimeout(() => setMessage(""), 1500);
    }
  };

  const screenClass = `
    min-h-screen bg-black text-yellow-300 flex flex-col items-center justify-center p-4 md:p-8
    font-mono relative overflow-hidden transition-all duration-300 touch-none
    ${severeError ? "scale-[1.02] blur-[1px] translate-x-2 -translate-y-1 duration-75" : ""}
  `;

  return (
    <div className={screenClass}>
      
      {/* 
        Rất quan trọng: Nhúng thẻ audio trực tiếp vào HTML.
        Thuộc tính preload="auto" đảm bảo nó được tải về máy ngay lúc mở web. 
      */}
      <audio id="audio-beep" src={beepSoundFile} preload="auto" />
      <audio id="audio-success" src={successSoundFile} preload="auto" />
      <audio id="audio-winner" src={winnerSoundFile} preload="auto" />

      {/* GHOST IMAGE KHI KÉO THẢ */}
      {draggingPiece && (
        <div
          className="fixed pointer-events-none z-[9999] opacity-80 border-2 border-white scale-110 shadow-2xl"
          style={{
            left: dragPos.x - 30,
            top: dragPos.y - 60,
            width: "64px",
            height: "128px",
            backgroundImage: `url(${reconstructed})`,
            backgroundPosition: draggingPiece.bgPos,
            backgroundSize: "500% 100%",
          }}
        />
      )}

      <div className={`fixed inset-0 z-[9000] pointer-events-none transition-all duration-75 mix-blend-screen ${severeError ? "bg-red-600/40 opacity-100" : "bg-transparent opacity-0"}`} />

      <div className={`fixed top-3 right-3 border px-4 py-2 rounded-2xl z-50 transition-colors duration-300 ${severeError ? "bg-red-900 border-red-400" : "bg-black/70 border-yellow-500"}`}>
        <p className={`text-xs md:text-sm ${severeError ? "text-white" : "text-yellow-400"}`}>TIME REMAINING</p>
        <p className={`text-xl md:text-2xl font-bold text-center ${severeError ? "text-white animate-pulse" : "text-yellow-300"}`}>{formatTime()}</p>
      </div>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,0,0.15)_1px,transparent_1px)] bg-[size:100%_3px]" />
      </div>

      <div className="z-10 text-center w-full max-w-6xl mt-12 md:mt-0 px-2 overflow-hidden">
        <p className="tracking-[0.2em] md:tracking-[0.5em] text-yellow-500 mb-2 md:mb-4 animate-pulse text-xs md:text-base">
          {isAssembled ? "IMAGE RECONSTRUCTED" : "DATA FRAGMENTED: 5 PARTS"}
        </p>

        <h1 className="text-[1.3rem] sm:text-3xl md:text-5xl lg:text-7xl font-black mb-6 md:mb-10 text-yellow-300 tracking-wider md:tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
          THE FRAGMENT SEEKER
        </h1>

        {!isAssembled ? (
          <div className="flex flex-col items-center justify-center mb-6 gap-6 md:gap-8">
            
            <div className="grid grid-cols-5 gap-1 md:gap-1 bg-zinc-900 border-4 border-yellow-600 p-1 md:p-2 rounded-xl">
              {board.map((piece, index) => (
                <div
                  key={index}
                  className={`
                    puzzle-slot /* Class này dùng cho hàm querySelectorAll tính vị trí thả */
                    w-12 h-24 sm:w-16 sm:h-32 md:w-32 md:h-64 border border-dashed flex items-center justify-center transition-colors
                    ${draggingPiece && !piece ? "border-yellow-400 bg-yellow-900/30" : "border-yellow-600/50 bg-black"}
                  `}
                >
                  {piece ? (
                    <div
                      onClick={() => handleRemoveFromBoard(index, piece)}
                      className="w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundImage: `url(${reconstructed})`,
                        backgroundPosition: piece.bgPos,
                        backgroundSize: "500% 100%",
                      }}
                    />
                  ) : (
                    <span className="text-zinc-700 font-bold opacity-30 select-none text-[10px] md:text-base">
                      0{index + 1}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4 justify-center p-3 md:p-4 border border-yellow-500/50 rounded-xl bg-black/50 min-h-[120px] md:min-h-[150px] w-full max-w-3xl">
              {availablePieces.length === 0 && <p className="text-zinc-500 text-xs md:text-sm p-4 my-auto">NO FRAGMENTS</p>}
              {availablePieces.map((piece) => (
                <div
                  key={piece.id}
                  onMouseDown={(e) => handlePointerDown(e, piece)}
                  onTouchStart={(e) => handlePointerDown(e, piece)}
                  className={`
                    w-12 h-24 sm:w-16 sm:h-32 md:w-24 md:h-48 cursor-grab active:cursor-grabbing border-2 border-yellow-400 
                    transition-transform hover:scale-105 touch-none
                    ${draggingPiece?.id === piece.id ? "opacity-20 scale-90" : "opacity-100"}
                  `}
                  style={{
                    backgroundImage: `url(${reconstructed})`,
                    backgroundPosition: piece.bgPos,
                    backgroundSize: "500% 100%",
                  }}
                />
              ))}
            </div>

          </div>
        ) : (
          <div className="flex justify-center mb-8 animate-in zoom-in duration-500">
            <img
              src={reconstructed}
              alt="Reconstructed"
              className={`w-full max-w-[90%] md:max-w-4xl rounded-xl md:rounded-3xl border-4 transition-all duration-300 ${severeError ? "border-red-600 shadow-[0_0_50px_rgba(255,0,0,0.4)]" : "border-yellow-500 shadow-[0_0_50px_rgba(255,255,0,0.2)]"}`}
            />
          </div>
        )}

        {/* BẢNG NHẬP FINAL KEY */}
        {isAssembled && !success && (
          <div className={`border bg-black/70 rounded-2xl md:rounded-3xl p-6 md:p-8 mb-6 max-w-2xl mx-auto transition-colors duration-300 w-full ${severeError ? "border-red-600" : "border-yellow-500"}`}>
            <p className="text-yellow-500 tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6 font-bold text-sm md:text-base">
              ENTER FINAL KEYWORD
            </p>
            <input
              autoFocus
              value={finalKey}
              onChange={(e) => setFinalKey(e.target.value)}
              placeholder="FINAL KEY"
              className={`w-full bg-black border rounded-lg md:rounded-xl px-4 py-3 md:px-5 md:py-4 mb-4 outline-none uppercase text-center text-lg md:text-2xl tracking-widest transition-colors duration-300 ${severeError ? "border-red-600 bg-red-900/20 text-white placeholder-red-300" : "border-yellow-500 text-yellow-200"}`}
              onKeyDown={(e) => e.key === "Enter" && checkFinalKey()}
            />
            <button
              onClick={checkFinalKey}
              className={`w-full font-black py-3 md:py-4 rounded-lg md:rounded-xl text-base md:text-xl transition-all duration-300 ${severeError ? "bg-red-600 text-white" : "bg-yellow-500 hover:bg-yellow-400 text-black"}`}
            >
              RESTORE ARCHIVE
            </button>
          </div>
        )}

        {/* GIAO DIỆN PHÁ ĐẢO THÀNH CÔNG */}
        {success && (
          <div className="border border-green-500 bg-black/70 rounded-2xl md:rounded-3xl p-6 md:p-10 text-green-300 leading-6 md:leading-8 max-w-3xl mx-auto animate-in fade-in zoom-in duration-700 w-full">
            <h2 className="text-2xl md:text-5xl font-black mb-4 md:mb-8 text-green-400">MISSION COMPLETE!</h2>
            <p className="text-base md:text-xl">Fragment reconstruction successful.</p>
            <p className="text-base md:text-xl">Hidden archive fully restored.</p>
            <p className="mt-4 md:mt-6 text-cyan-400 text-base md:text-xl font-bold tracking-[0.1em] md:tracking-widest">Welcome back, Administrator.</p>
          </div>
        )}

        {message && (
          <div className={`mt-4 md:mt-6 text-lg md:text-2xl font-black ${message === "ARCHIVE FULLY RESTORED" ? "text-green-400" : "text-red-500 animate-pulse"}`}>
            {message}
          </div>
        )}
        {!success && (
          <div className="mt-6 md:mt-10 text-xs md:text-sm text-zinc-500 tracking-[0.1em] md:tracking-[0.3em] font-bold">
            {isAssembled ? "MEMORY IS THE KEY" : "DRAG & DROP TO ASSEMBLE"}
          </div>
        )}
      </div>
    </div>
  );
}