import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="wrapper">
      <Link to="/">
        <button className="my-5 bg-blue-500 px-10 py-2 rounded-sm text-white hover:bg-blue-600">
          Back
        </button>
      </Link>
      <div className="text-center my-20">
        <h2 className="text-[32px] text-red-500">NOT FOUND...</h2>
        <p className="text-[18px] my-2">Page not available ... !</p>
      </div>
    </div>
  );
};

export default NotFound;
