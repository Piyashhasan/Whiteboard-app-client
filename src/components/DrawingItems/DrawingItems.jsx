import { IoEye } from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { useGetAllDrawingsQuery } from "../../services/appApi";
import { Link } from "react-router-dom";

const DrawingItems = () => {
  // --- Get all Drawing ---
  const { data } = useGetAllDrawingsQuery();
  const drawingItem = data?.data;

  return (
    <div className="py-10">
      <div className="grid grid-cols-4 gap-5">
        {drawingItem?.map((item) => {
          return (
            <div key={item?._id} className="bg-[#86ECB6] p-5 rounded-md">
              <p className="text-center text-[18px] capitalize font-bold">
                {item?.name}
              </p>
              <div className="flex items-center justify-center gap-5 mt-5">
                <button className="py-1 flex items-center justify-center relative group">
                  <IoEye className="text-[20px] text-gray-600" />
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex justify-center items-center px-2 py-1 bg-gray-700 text-white text-sm rounded">
                    view
                  </div>
                </button>
                <Link to={`/whiteboard/${item?._id}`}>
                  <button className="py-1 flex items-center justify-center relative group">
                    <FiEdit3 className="text-[20px] text-gray-600" />
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex justify-center items-center px-2 py-1 bg-gray-700 text-white text-sm rounded">
                      edit
                    </div>
                  </button>
                </Link>
                <button className="py-1 flex items-center justify-center relative group">
                  <MdDeleteForever className="text-[20px] text-gray-600" />
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex justify-center items-center px-2 py-1 bg-gray-700 text-white text-sm rounded">
                    delete
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DrawingItems;
