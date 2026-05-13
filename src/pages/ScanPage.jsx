import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fragment4 from "../assets/fragments/fragment4.png";

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

      setMessage("INVALID ACCESS CODE");

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
      overflow-hidden
      relative
    ">

      {/* Background Glow */}
      <div className="
        absolute
        inset-0
        bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)]
        pointer-events-none
      " />

      <div className="z-10 max-w-3xl w-full">

        <div className="
          border
          border-cyan-500
          rounded-3xl
          p-8
          bg-black/70
          backdrop-blur-md
          shadow-[0_0_40px_rgba(0,255,255,0.15)]
        ">

          <h1 className="text-5xl font-black mb-8 text-center tracking-[6px]">
            PHYSICAL NODE
          </h1>

          <div className="flex justify-center mb-8">

            <img
              src={fragment4}
              className="
                w-72
                rounded-2xl
                border
                border-cyan-500
                shadow-[0_0_30px_rgba(0,255,255,0.2)]
              "
            />

          </div>

          <div className="
            border
            border-cyan-800
            rounded-2xl
            p-6
            bg-black/80
            text-lg
            leading-9
          ">

            <p className="text-cyan-300 mb-4">
              SIGNAL TRACE DETECTED
            </p>

            <p className="text-cyan-500">
              Nearby wireless activity has been detected.
            </p>

            <p className="text-cyan-500">
              Search for the hidden network fragment.
            </p>

            <div className="
              mt-8
              border-t
              border-cyan-900
              pt-6
              text-cyan-600
            ">

              <p>
                Hint:
              </p>

              <p>
                The access code is hidden within a nearby WiFi signal.
              </p>

              <p>
                Decode the signal to recover the final PIN.
              </p>

            </div>

          </div>

          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="ENTER ACCESS CODE"
            className="
              w-full
              bg-black
              border
              border-cyan-500
              rounded-xl
              px-5
              py-4
              mt-8
              mb-5
              text-cyan-300
              outline-none
            "
          />

          <button
            onClick={checkPin}
            className="
              w-full
              bg-cyan-500
              hover:bg-cyan-400
              text-black
              font-black
              py-4
              rounded-xl
              transition-all
              duration-300
            "
          >
            UNLOCK NODE
          </button>

          {message && (

            <div className="
              mt-6
              text-center
              text-2xl
              font-bold
            ">

              {message}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}