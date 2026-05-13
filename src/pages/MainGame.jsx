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
  // STATES
  // =========================

  const [step, setStep] = useState(0);

  const [bootProgress, setBootProgress] = useState(0);

  const [timeLeft, setTimeLeft] = useState(7200);

  const [glitch, setGlitch] = useState(false);

  const [message, setMessage] = useState("");

  const [caesarAnswer, setCaesarAnswer] = useState("");

  const [hexAnswer, setHexAnswer] = useState("");

  const [masterKey, setMasterKey] = useState("");

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

    const hours = String(
      Math.floor(timeLeft / 3600)
    ).padStart(2, "0");

    const minutes = String(
      Math.floor((timeLeft % 3600) / 60)
    ).padStart(2, "0");

    const seconds = String(
      timeLeft % 60
    ).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
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
  // STEP 1 CHECK
  // =========================

  const checkCaesar = () => {

    if (caesarAnswer.trim() === "03285") {

      playSuccess();

      setFragments((prev) => ({
        ...prev,
        f1: true,
      }));

      setMessage("ACCESS GRANTED");

      setTimeout(() => {

        setShowFragment1(true);

      }, 700);

      setTimeout(() => {

        setShowFragment1(false);

        setMessage("");

        setStep(2);

      }, 3500);

    } else {

      playBeep();

      setMessage("INVALID KEY");

      setTimeout(() => {

        setMessage("");

      }, 1500);
    }
  };

  // =========================
  // STEP 3 CHECK
  // =========================

  const checkHex = () => {

    const answer = hexAnswer
      .replaceAll(" ", "")
      .toLowerCase();

    if (answer === "12475105") {

      playSuccess();

      setFragments((prev) => ({
        ...prev,
        f3: true,
      }));

      setMessage("SIGNAL DECRYPTED");

      setTimeout(() => {

        setShowFragment3(true);

      }, 700);

      setTimeout(() => {

        setShowFragment3(false);

        setMessage("");

        setStep(4);

      }, 3500);

    } else {

      playBeep();

      setMessage("CORRUPTED DATA");

      setTimeout(() => {

        setMessage("");

      }, 1500);
    }
  };

  // =========================
  // MASTER KEY
  // =========================

  const checkMasterKey = () => {

    const key = masterKey.trim().toLowerCase();

    if (
      key === "john von neumann" ||
      key === "johnvonneumann"
    ) {

      playSuccess();

      setFragments({
        f1: true,
        f2: true,
        f3: true,
      });

      setMessage("MASTER ACCESS GRANTED");

      setTimeout(() => {

        setStep(999);

      }, 1500);

    } else {

      playBeep();

      setMessage("ACCESS DENIED");

      setTimeout(() => {

        setMessage("");

      }, 1500);
    }
  };

  // =========================
  // SCREEN CLASS
  // =========================

  const screenClass = `
    min-h-screen
    bg-black
    text-green-400
    flex
    flex-col
    items-center
    justify-center
    p-6
    font-mono
    overflow-hidden
    relative
    transition-all
    duration-150
    ${glitch ? "scale-[1.002]" : ""}
  `;

  return (

    <div className={screenClass}>

      {/* SCANLINES */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">

        <div className="h-full w-full bg-[linear-gradient(rgba(0,255,0,0.15)_1px,transparent_1px)] bg-[size:100%_3px]" />

      </div>

      {/* TIMER */}
      <div className="absolute top-5 right-5 border border-red-500 px-5 py-3 rounded-xl bg-black/70 z-50">

        <p className="text-red-400 text-sm tracking-widest">
          ARCHIVE COLLAPSE
        </p>

        <p className="text-2xl font-bold text-red-300">
          {formatTime()}
        </p>

      </div>

      {/* INVENTORY */}
      <div className="
        absolute
        top-28
        left-5
        border
        border-cyan-500
        rounded-2xl
        bg-black/70
        backdrop-blur-md
        p-5
        z-50
        w-56
      ">

        <p className="text-cyan-300 mb-4 tracking-widest text-sm">
          FRAGMENT INVENTORY
        </p>

        <div className="space-y-3 text-sm">

          <div className={fragments.f1 ? "text-green-400" : "text-zinc-600"}>
            {fragments.f1 ? "[✓]" : "[ ]"} Fragment 01
          </div>

          <div className={fragments.f2 ? "text-yellow-400" : "text-zinc-600"}>
            {fragments.f2 ? "[✓]" : "[ ]"} Fragment 02
          </div>

          <div className={fragments.f3 ? "text-purple-400" : "text-zinc-600"}>
            {fragments.f3 ? "[✓]" : "[ ]"} Fragment 03
          </div>

        </div>

      </div>

      {/* MASTER ACCESS */}
      <div className="
        fixed
        bottom-5
        right-5
        border
        border-red-500
        bg-black/80
        backdrop-blur-md
        p-5
        rounded-2xl
        z-50
        w-80
      ">

        <p className="text-red-400 mb-3 text-sm tracking-widest">
          MASTER ACCESS
        </p>

        <input
          value={masterKey}
          onChange={(e) => setMasterKey(e.target.value)}
          placeholder="ENTER FINAL KEY"
          className="
            w-full
            bg-black
            border
            border-red-500
            px-4
            py-3
            rounded-xl
            text-red-300
            mb-3
            outline-none
          "
        />

        <button
          onClick={checkMasterKey}
          className="
            w-full
            bg-red-500
            hover:bg-red-400
            text-black
            font-black
            py-3
            rounded-xl
          "
        >
          OVERRIDE SYSTEM
        </button>

      </div>

      {/* STEP 0 */}
      {step === 0 && (

        <div className="w-full max-w-2xl z-10">

          <div className="text-center mb-10">

            <h1 className={`
              text-5xl
              font-black
              tracking-[8px]
              text-green-300
              mb-4
              animate-pulse
            `}>

              THE FRAGMENT SEEKER

            </h1>

            <p className="text-green-500 text-lg">
              NEXUS ARCHIVE INITIALIZATION
            </p>

          </div>

          <div className="border border-green-500 p-6 rounded-3xl bg-black/60 backdrop-blur-md">

            <div className="flex justify-between mb-3 text-sm">

              <span>BOOTING CORE SYSTEM...</span>

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

      {/* STEP 1 */}
      {step === 1 && (

        <div className="max-w-4xl w-full z-10">

          <div className="border border-green-500 rounded-3xl p-8 bg-black/70 backdrop-blur-md">

            <h2 className="text-4xl font-black mb-8 text-green-200">
              ARCHIVE CORRUPTION DETECTED
            </h2>

            <div className="border border-green-700 rounded-2xl p-6 bg-black/80 mb-8">

              <p className="text-green-300 mb-3 text-lg">
                TRANSMISSION DAMAGED
              </p>

              <div className="text-green-500 break-all text-lg leading-8">
                https://www.facebook.com/nguyen.quang.anh.1XXXXX
              </div>

              <div className="mt-6 text-green-400 text-xl tracking-[0.3em]">
                ENCRYPTED STRING: 365;8
              </div>

              <div className="mt-6 border-t border-green-800 pt-4 text-green-600">
                Hint: Caesar Cipher Shift = 3
              </div>

            </div>

            <input
              value={caesarAnswer}
              onChange={(e) => setCaesarAnswer(e.target.value)}
              placeholder="ENTER MISSING DIGITS"
              className="
                w-full
                bg-black
                border
                border-green-500
                rounded-xl
                px-5
                py-4
                text-green-300
                mb-5
              "
            />

            <button
              onClick={checkCaesar}
              className="
                w-full
                bg-green-500
                hover:bg-green-400
                text-black
                font-black
                py-4
                rounded-xl
              "
            >
              DECRYPT SIGNAL
            </button>

          </div>

        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (

        <div className="max-w-5xl w-full z-10">

          <div className="border border-yellow-500 rounded-3xl p-10 bg-black/70 text-center">

            <h1 className="text-5xl font-black text-yellow-300 mb-8">
              FRAGMENT 02 RECOVERED
            </h1>

            <img
              src={fragment2}
              className="
                w-full
                max-w-2xl
                mx-auto
                rounded-3xl
                border-4
                border-yellow-500
                mb-10
              "
            />

            <div className="
              border
              border-yellow-500
              rounded-2xl
              p-6
              max-w-2xl
              mx-auto
              bg-black/60
            ">

              <p className="text-xl text-yellow-200 mb-4">
                BONUS SIGNAL DETECTED
              </p>

              <p className="text-yellow-400 mb-8 leading-8">
                Hidden archive discovered at the bottom
                of the corrupted fanpage.
              </p>

              <button
                onClick={() => {

                  playSuccess();

                  setFragments((prev) => ({
                    ...prev,
                    f2: true,
                  }));

                  setShowFragment2(true);

                  setTimeout(() => {

                    setShowFragment2(false);

                    setStep(3);

                  }, 3000);

                }}
                className="
                  bg-yellow-500
                  hover:bg-yellow-400
                  text-black
                  font-black
                  px-8
                  py-4
                  rounded-2xl
                "
              >
                RECOVER BONUS FRAGMENT
              </button>

            </div>

          </div>

        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (

        <div className="max-w-4xl w-full z-10">

          <div className="border border-purple-500 rounded-3xl p-8 bg-black/70 text-purple-300">

            <h2 className="text-4xl font-black mb-8">
              COLOR DATA RECOVERY
            </h2>

            <div className="bg-black border border-purple-700 rounded-2xl p-6 mb-8 text-xl leading-10">

              <p className="text-purple-400">
                ENCRYPTED COLOR SIGNAL
              </p>

              <p className="text-5xl font-black text-pink-400 mt-4">
                #7c4b69
              </p>

              <div className="mt-8 border-t border-purple-800 pt-6">

                <p className="mb-3 text-purple-500">
                  SYSTEM INSTRUCTION
                </p>

                <p>Convert HEX → RGB</p>

                <p>Merge all RGB values continuously</p>

                <p>No spaces. No commas.</p>

              </div>

              <div className="mt-8 border-t border-purple-800 pt-6 text-purple-600">
                Hint: HEX to RGB Converter
              </div>

            </div>

            <input
              value={hexAnswer}
              onChange={(e) => setHexAnswer(e.target.value)}
              placeholder="ENTER ACCESS CODE"
              className="
                w-full
                bg-black
                border
                border-purple-500
                rounded-xl
                px-5
                py-4
                mb-5
                text-purple-300
              "
            />

            <button
              onClick={checkHex}
              className="
                w-full
                bg-purple-500
                hover:bg-purple-400
                text-black
                font-black
                py-4
                rounded-xl
              "
            >
              DECRYPT SIGNAL
            </button>

          </div>

        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (

        <div className="max-w-5xl w-full z-10 text-center">

          <div className="border border-cyan-500 rounded-3xl p-10 bg-black/70">

            <h1 className="text-6xl font-black text-cyan-300 mb-10">
              FPT UNIVERSITY
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
              p-10
              bg-black/60
              max-w-3xl
              mx-auto
            ">

              <p className="text-3xl font-black text-cyan-300 mb-6 tracking-widest">
                PHYSICAL QR REQUIRED
              </p>

              <p className="text-cyan-200 leading-8 text-lg">
                This node cannot be accessed digitally.
                <br />
                You must use a physical device to continue the recovery.
              </p>

              <div className="mt-8 text-cyan-500 text-sm opacity-70">
                Scan the QR code using your mobile camera
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SECRET ENDING */}
      {step === 999 && (

        <div className="fixed inset-0 bg-black flex items-center justify-center z-[999]">

          <div className="text-center">

            <h1 className="text-7xl font-black text-red-500 mb-8 animate-pulse">
              MASTER ACCESS
            </h1>

            <p className="text-red-300 text-2xl mb-10 tracking-widest">
              SYSTEM OVERRIDE COMPLETE
            </p>

            <div className="
              border
              border-red-500
              rounded-3xl
              p-10
              bg-black/70
            ">

              <p className="text-red-400 text-lg leading-10">
                Hidden route unlocked.
                <br />
                Archive integrity restored.
                <br />
                Welcome back, Administrator.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* MESSAGE */}
      {message && (

        <div className="
          fixed
          top-24
          left-1/2
          -translate-x-1/2
          text-2xl
          font-black
          z-[999]
        ">

          {message}

        </div>

      )}

      {/* FRAGMENT 1 */}
      {showFragment1 && (

        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">

          <div className="text-center">

            <p className="text-green-400 text-3xl mb-8">
              FRAGMENT 01 RECOVERED
            </p>

            <img
              src={fragment1}
              className="
                w-96
                rounded-3xl
                border-4
                border-green-500
              "
            />

          </div>

        </div>
      )}

      {/* FRAGMENT 2 */}
      {showFragment2 && (

        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">

          <div className="text-center">

            <p className="text-yellow-400 text-3xl mb-8">
              FRAGMENT 02 RECOVERED
            </p>

            <img
              src={fragment2}
              className="
                w-96
                rounded-3xl
                border-4
                border-yellow-500
              "
            />

          </div>

        </div>
      )}

      {/* FRAGMENT 3 */}
      {showFragment3 && (

        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">

          <div className="text-center">

            <p className="text-purple-400 text-3xl mb-8">
              FRAGMENT 03 RECOVERED
            </p>

            <img
              src={fragment3}
              className="
                w-96
                rounded-3xl
                border-4
                border-purple-500
              "
            />

          </div>

        </div>
      )}

    </div>
  );
}