import { useState, useEffect, useRef } from "react";
import reconstructed from "../assets/final/reconstructed.png";

// Import âm thanh
import beepSoundFile from "../assets/sounds/beep.mp3";
import successSoundFile from "../assets/sounds/success.mp3"; // File báo ghép thành công
import winnerSoundFile from "../assets/sounds/winner.mp3";   // File chiến thắng cuối cùng

// Cấu hình 5 mảnh vỡ (Chia thành 5 cột dọc)
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

  // --- STATES CHO PUZZLE ---
  const [isAssembled, setIsAssembled] = useState(false);
  const [availablePieces, setAvailablePieces] = useState([]);
  const [board, setBoard] = useState([null, null, null, null, null]); // 5 ô trống
  const [draggedPiece, setDraggedPiece] = useState(null);

  // --- STATES CHO TIMER VÀ PENALTY ---
  const [severeError, setSevereError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("techfest_timer");
    return savedTime !== null ? parseInt(savedTime, 10) : 1800;
  });

  // --- AUDIO SETUP ---
  const beepSound = useRef(null);
  const successSound = useRef(null);
  const winnerSound = useRef(null);

  useEffect(() => {
    beepSound.current = new Audio(beepSoundFile);
    successSound.current = new Audio(successSoundFile);
    winnerSound.current = new Audio(winnerSoundFile);
    
    // Xáo trộn các mảnh vỡ khi load trang
    setAvailablePieces([...PUZZLE_PIECES].sort(() => Math.random() - 0.5));
  }, []);

  const playAudio = (audioRef, volume = 0.5) => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.volume = volume;
    audioRef.current.play().catch(() => {});
  };

  const playBeep = () => playAudio(beepSound, 0.4);
  const playSuccess = () => playAudio(successSound, 0.5); // Phát khi ghép xong
  const playWinner = () => playAudio(winnerSound, 0.6);   // Phát khi nhập đúng key

  // --- THỜI GIAN ---
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

  // --- HÀM XỬ LÝ PHẠT ---
  const handlePenalty = () => {
    playBeep();
    setTimeLeft((prev) => Math.max(0, prev - 30));
    setSevereError(true);
    setTimeout(() => {
      setSevereError(false);
    }, 400);
  };

  // --- LOGIC KÉO THẢ (DRAG & DROP) ---
  const handleDragStart = (piece) => {
    setDraggedPiece(piece);
  };

  const handleDrop = (index) => {
    if (!draggedPiece) return;

    if (board[index] !== null) return;

    const newBoard = [...board];
    newBoard[index] = draggedPiece;
    setBoard(newBoard);

    setAvailablePieces((prev) => prev.filter((p) => p.id !== draggedPiece.id));
    setDraggedPiece(null);

    checkPuzzleCompletion(newBoard);
  };

  const handleRemoveFromBoard = (index, piece) => {
    const newBoard = [...board];
    newBoard[index] = null;
    setBoard(newBoard);
    setAvailablePieces((prev) => [...prev, piece]);
    setIsAssembled(false);
  };

  const checkPuzzleCompletion = (currentBoard) => {
    // Thứ tự chuẩn là p1, p2, p3, p4, p5
    const isCorrect = 
      currentBoard[0]?.id === "p1" &&
      currentBoard[1]?.id === "p2" &&
      currentBoard[2]?.id === "p3" &&
      currentBoard[3]?.id === "p4" &&
      currentBoard[4]?.id === "p5";

    if (isCorrect) {
      playSuccess(); // <--- Đổi thành playSuccess() khi ghép ảnh
      setIsAssembled(true);
    } else if (currentBoard.every(slot => slot !== null)) {
      // Điền đủ 5 ô nhưng sai -> Phạt 30s
      handlePenalty();
      setMessage("FRAGMENT MISMATCH (-30S)");
      setTimeout(() => setMessage(""), 1500);
      
      // Reset lại mảnh vỡ
      setAvailablePieces([...PUZZLE_PIECES].sort(() => Math.random() - 0.5));
      setBoard([null, null, null, null, null]);
    }
  };

  // --- LOGIC CHECK KEY ---
  const checkFinalKey = () => {
    const answer = finalKey.trim().toLowerCase();
    if (
      answer === "hai phong" ||
      answer === "haiphong" ||
      answer === "hải phòng" ||
      answer === "tp hải phòng"
    ) {
      playWinner(); // <--- Đổi thành playWinner() khi phá đảo
      setSuccess(true);
      setMessage("ARCHIVE FULLY RESTORED");
    } else {
      handlePenalty();
      setMessage("INVALID FINAL KEY (-30S)");
      setTimeout(() => setMessage(""), 1500);
    }
  };

  const screenClass = `
    min-h-screen bg-black text-yellow-300 flex flex-col items-center justify-center p-8
    font-mono relative overflow-hidden transition-all duration-300
    ${severeError ? "scale-[1.02] blur-[1px] translate-x-2 -translate-y-1 duration-75" : ""}
  `;

  return (
    <div className={screenClass}>
      <div className={`fixed inset-0 z-[9999] pointer-events-none transition-all duration-75 mix-blend-screen ${severeError ? "bg-red-600/40 opacity-100" : "bg-transparent opacity-0"}`} />

      <div className={`fixed top-3 right-3 border px-4 py-2 rounded-2xl z-50 transition-colors duration-300 ${severeError ? "bg-red-900 border-red-400" : "bg-black/70 border-yellow-500"}`}>
        <p className={`text-sm ${severeError ? "text-white" : "text-yellow-400"}`}>TIME REMAINING</p>
        <p className={`text-2xl font-bold text-center ${severeError ? "text-white animate-pulse" : "text-yellow-300"}`}>{formatTime()}</p>
      </div>

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,0,0.15)_1px,transparent_1px)] bg-[size:100%_3px]" />
      </div>

      <div className="z-10 text-center max-w-6xl w-full">
        <p className="tracking-[0.5em] text-yellow-500 mb-4 animate-pulse">
          {isAssembled ? "IMAGE RECONSTRUCTED" : "DATA FRAGMENTED: 5 PARTS"}
        </p>

        <h1 className="text-5xl md:text-7xl font-black mb-10 text-yellow-300 tracking-widest">
          THE FRAGMENT SEEKER
        </h1>

        {!isAssembled ? (
          <div className="flex flex-col items-center justify-center mb-10 gap-8">
            
            {/* Bảng ghép (Board có 5 ô ngang) */}
            <div className="grid grid-cols-5 gap-1 bg-zinc-900 border-4 border-yellow-600 p-2 rounded-xl">
              {board.map((piece, index) => (
                <div
                  key={index}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className="w-16 h-32 md:w-32 md:h-64 border border-dashed border-yellow-600/50 bg-black flex items-center justify-center transition-colors"
                >
                  {piece ? (
                    <div
                      onClick={() => handleRemoveFromBoard(index, piece)}
                      className="w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundImage: `url(${reconstructed})`,
                        backgroundPosition: piece.bgPos,
                        backgroundSize: "500% 100%", // Scale 500% cho 5 mảnh dọc
                      }}
                      title="Click to remove"
                    />
                  ) : (
                    <span className="text-zinc-700 font-bold opacity-30 select-none text-xs md:text-base">
                      0{index + 1}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Kho chứa mảnh vỡ */}
            <div className="flex flex-wrap gap-4 justify-center p-4 border border-yellow-500/50 rounded-xl bg-black/50 min-h-[150px] w-full max-w-3xl">
              {availablePieces.length === 0 && <p className="text-zinc-500 text-sm p-4 my-auto">NO FRAGMENTS</p>}
              {availablePieces.map((piece) => (
                <div
                  key={piece.id}
                  draggable
                  onDragStart={() => handleDragStart(piece)}
                  className="w-16 h-32 md:w-24 md:h-48 cursor-grab active:cursor-grabbing border-2 border-yellow-400 hover:scale-105 transition-transform"
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
          /* ẢNH HOÀN CHỈNH */
          <div className="flex justify-center mb-10 animate-in zoom-in duration-500">
            <img
              src={reconstructed}
              alt="Reconstructed"
              className={`w-full max-w-4xl rounded-3xl border-4 transition-all duration-300 ${severeError ? "border-red-600 shadow-[0_0_50px_rgba(255,0,0,0.4)]" : "border-yellow-500 shadow-[0_0_50px_rgba(255,255,0,0.2)]"}`}
            />
          </div>
        )}

        {/* FINAL INPUT */}
        {isAssembled && !success && (
          <div className={`border bg-black/70 rounded-3xl p-8 mb-8 max-w-2xl mx-auto transition-colors duration-300 ${severeError ? "border-red-600" : "border-yellow-500"}`}>
            <p className="text-yellow-500 tracking-[0.3em] mb-6 font-bold">
              ENTER FINAL KEYWORD
            </p>
            <input
              autoFocus
              value={finalKey}
              onChange={(e) => setFinalKey(e.target.value)}
              placeholder="FINAL KEY"
              className={`w-full bg-black border rounded-xl px-5 py-4 mb-5 outline-none uppercase text-center text-2xl tracking-widest transition-colors duration-300 ${severeError ? "border-red-600 bg-red-900/20 text-white placeholder-red-300" : "border-yellow-500 text-yellow-200"}`}
              onKeyDown={(e) => e.key === "Enter" && checkFinalKey()}
            />
            <button
              onClick={checkFinalKey}
              className={`w-full font-black py-4 rounded-xl text-xl transition-all duration-300 ${severeError ? "bg-red-600 text-white" : "bg-yellow-500 hover:bg-yellow-400 text-black"}`}
            >
              RESTORE ARCHIVE
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="border border-green-500 bg-black/70 rounded-3xl p-10 text-green-300 leading-8 max-w-3xl mx-auto animate-in fade-in zoom-in duration-700">
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-green-400">MISSION COMPLETE!</h2>
            <p className="text-lg md:text-xl">Fragment reconstruction successful.</p>
            <p className="text-lg md:text-xl">Hidden archive fully restored.</p>
            <p className="mt-6 text-cyan-400 text-xl font-bold tracking-widest">Welcome back, Administrator.</p>
          </div>
        )}

        {/* MESSAGES */}
        {message && (
          <div className={`mt-6 text-2xl font-black ${message === "ARCHIVE FULLY RESTORED" ? "text-green-400" : "text-red-500 animate-pulse"}`}>
            {message}
          </div>
        )}
        {!success && (
          <div className="mt-10 text-sm text-zinc-600 tracking-[0.3em] font-bold">
            {isAssembled ? "MEMORY IS THE KEY" : "ASSEMBLE THE 5 DATA FRAGMENTS TO PROCEED"}
          </div>
        )}
      </div>
    </div>
  );
}