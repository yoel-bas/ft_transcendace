const ProgressLine = ({ progress }) => {
    return (
      <div className="w-full h-2 bg-blue-900/40 rounded-full overflow-hidden">
      <div
          className="h-full bg-[#00FFF0] transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };
  export default ProgressLine;