import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ScanPage() {

  const [pin, setPin] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const checkPin = () => {

    if (pin === "50") {

      setMessage("ACCESS GRANTED");

      setTimeout(() => {

        navigate("/final");

      }, 1500);

    } else {

      setMessage("INVALID PIN");

    }
  };

  return (

    <div className="
      min-h-screen
      bg-black
      text-cyan-400
      flex
      flex-col
      items-center
      justify-center
      p-8
      font-mono
    ">

      <h1 className="text-5xl font-black mb-8">
        PHYSICAL NODE
      </h1>

      <img
        src="/fragment4.png"
        className="w-64 rounded-2xl border border-cyan-500 mb-8"
      />

      <div className="
        border
        border-cyan-500
        rounded-2xl
        p-6
        max-w-xl
        w-full
        bg-black/60
      ">

        <p className="mb-6 text-xl">
          WiFi Signal:
        </p>

        <div className="
          text-4xl
          font-black
          text-green-400
          mb-8
          tracking-[8px]
        ">
          110010
        </div>

        <p className="mb-4">
          Convert Binary → Decimal
        </p>

        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="ENTER PIN"
          className="
            w-full
            bg-black
            border
            border-cyan-500
            rounded-xl
            px-5
            py-4
            mb-4
          "
        />

        <button
          onClick={checkPin}
          className="
            w-full
            bg-cyan-500
            text-black
            font-black
            py-4
            rounded-xl
          "
        >
          UNLOCK
        </button>

        {message && (

          <div className="mt-6 text-center text-2xl">
            {message}
          </div>

        )}

      </div>

    </div>
  );
}