import reconstructed from "../assets/final/reconstructed.png";

export default function FinalPage() {

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
    ">

      <h1 className="text-6xl font-black mb-8">
        ARCHIVE RESTORED
      </h1>

      <img
        src={reconstructed}
        className="
          w-full
          max-w-3xl
          rounded-3xl
          border-4
          border-yellow-500
          mb-8
        "
      />

      <div className="
        text-2xl
        border
        border-yellow-500
        px-8
        py-5
        rounded-2xl
      ">
        FINAL KEYWORD:
        <span className="ml-4 text-white">
          NEXUS
        </span>
      </div>

    </div>
  );
}