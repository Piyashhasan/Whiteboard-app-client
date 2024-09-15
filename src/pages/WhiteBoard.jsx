import { Link } from "react-router-dom";
import Canvas from "../components/Canvas/Canvas";

const WhiteBoard = () => {
  return (
    <div className="wrapper">
      <Link to="/">
        <button className="my-2 bg-blue-500 text-[14px] px-5 py-1 rounded-sm text-white hover:bg-blue-600">
          Back
        </button>
      </Link>

      {/* --- Canvas section start --- */}
      <Canvas />
      {/* --- Canvas section end --- */}
    </div>
  );
};

export default WhiteBoard;
