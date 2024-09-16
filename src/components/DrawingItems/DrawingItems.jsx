import { IoEye } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import {
  useDeleteDrawingMutation,
  useGetAllDrawingsQuery,
} from "../../services/appApi";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

const DrawingItems = () => {
  // --- Get all Drawing ---
  const { data } = useGetAllDrawingsQuery();
  const drawingItem = data?.data;

  // --- Delete drawing query ---
  const [deleteDrawing, { isLoading, isSuccess, isError }] =
    useDeleteDrawingMutation();

  // --- handle delete functionality ---
  const handleDeleteDrawing = (id) => {
    if (id) {
      deleteDrawing(id);
    }
  };

  // --- handle toast ---
  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading ...", { id: "deleteDrawing" });
    }
    if (!isLoading && !isSuccess && isError) {
      toast.error("Not deleted..", { id: "deleteDrawing" });
    }
    if (isSuccess) {
      toast.success("Deleted Successfully... ", { id: "deleteDrawing" });
    }
  }, [isLoading, isSuccess, isError]);

  return (
    <div className="">
      <div className="grid grid-cols-4 gap-5">
        {drawingItem?.map((item) => {
          return (
            <div key={item?._id} className="bg-[#86ECB6] p-5 rounded-md">
              <p className="text-center text-[18px] capitalize font-bold">
                {item?.name}
              </p>
              <div className="flex items-center justify-center gap-5 mt-5">
                <Link to={`/whiteboard/${item?._id}`}>
                  <button className="py-1 flex items-center justify-center relative group">
                    <IoEye className="text-[20px] text-gray-600" />
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex justify-center items-center px-2 py-1 bg-gray-700 text-white text-sm rounded">
                      view
                    </div>
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteDrawing(item?._id)}
                  className="py-1 flex items-center justify-center relative group"
                >
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
