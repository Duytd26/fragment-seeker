import { useState } from "react";

import reconstructed from "../assets/final/reconstructed.png";

export default function FinalPage() {

  const [finalKey, setFinalKey] = useState("");

  const [success, setSuccess] = useState(false);

  const [message, setMessage] = useState("");

  const checkFinalKey = () => {

    const answer = finalKey.trim().toLowerCase();

    if (
      answer === "john von neumann" ||
      answer === "johnvonneumann"
    ) {

      setSuccess(true);

      setMessage("ARCHIVE FULLY RESTORED");

    } else {

      setMessage("INVALID FINAL KEY");

      setTimeout(() => {

        setMessage("");

      }, 1500);
    }
  };

  return (

    <div className="
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
    ">

      {/* SCANLINES */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">

        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,0,0.15)_1px,transparent_1px)] bg-[size:100%_3px]" />

      </div>

      <div className="z-10 text-center max-w-5xl">

        <p className="tracking-[0.5em] text-yellow-500 mb-4 animate-pulse">
          ARCHIVE RECOVERY COMPLETE
        </p>

        <h1 className="text-7xl font-black mb-10 text-yellow-300">
          THE FRAGMENT SEEKER
        </h1>

        {/* RECONSTRUCTED IMAGE */}
        <img
          src={reconstructed}
          className="
            w-full
            max-w-4xl
            rounded-3xl
            border-4
            border-yellow-500
            mb-10
            shadow-[0_0_50px_rgba(255,255,0,0.2)]
          "
        />

        {/* FINAL INPUT */}
        {!success && (

          <div className="
            border
            border-yellow-500
            bg-black/70
            rounded-3xl
            p-8
            mb-8
            max-w-2xl
            mx-auto
          ">

            <p className="text-yellow-500 tracking-[0.3em] mb-6">
              ENTER FINAL KEYWORD
            </p>

            <input
              value={finalKey}
              onChange={(e) => setFinalKey(e.target.value)}
              placeholder="FINAL KEY"
              className="
                w-full
                bg-black
                border
                border-yellow-500
                rounded-xl
                px-5
                py-4
                text-yellow-200
                mb-5
                outline-none
              "
            />

            <button
              onClick={checkFinalKey}
              className="
                w-full
                bg-yellow-500
                hover:bg-yellow-400
                text-black
                font-black
                py-4
                rounded-xl
              "
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
          ">

            <h2 className="text-5xl font-black mb-8 text-green-400">
              MISSION COMPLETE!
            </h2>

            <p>
              Fragment reconstruction successful.
            </p>

            <p>
              Hidden archive fully restored.
            </p>

            <p className="mt-6 text-cyan-400">
              Welcome back, Administrator.
            </p>

          </div>

        )}

        {/* MESSAGE */}
        {message && (

          <div className="
            mt-6
            text-2xl
            font-black
          ">

            {message}

          </div>

        )}

        {/* SECRET HINT */}
        <div className="mt-10 text-sm text-zinc-600 tracking-[0.3em]">
          MEMORY IS THE KEY
        </div>

      </div>

    </div>
  );
}