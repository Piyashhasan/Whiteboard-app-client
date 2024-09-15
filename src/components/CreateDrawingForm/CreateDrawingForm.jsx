import { useEffect, useState } from "react";
import { useCreateDrawingMutation } from "../../services/appApi";
import toast from "react-hot-toast";

// eslint-disable-next-line react/prop-types
const CreateDrawingForm = ({ setVisible }) => {
  const [drawingName, setDrawingName] = useState("");
  const [createDrawing, { isLoading, isSuccess, isError }] =
    useCreateDrawingMutation();

  // --- Form handler ---
  const handleFromSubmit = (e) => {
    e.preventDefault();
    const fileName = drawingName
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, " ");

    if (fileName) {
      createDrawing(fileName);
      setVisible(false);
    }

    setDrawingName("");
  };

  // --- handle toast ---
  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading ...", { id: "createDrawing" });
    }
    if (!isLoading && !isSuccess && isError) {
      toast.error("Drawing not added..", { id: "createDrawing" });
    }
    if (isSuccess) {
      toast.success("Successfully create drawing... ", { id: "createDrawing" });
    }
  }, [isLoading, isSuccess, isError]);

  return (
    <div className="h-40">
      <form onSubmit={handleFromSubmit} className="p-5">
        <div className="flex items-center gap-2">
          <label className="text-black" htmlFor="">
            Drawing Name :
          </label>
          <input
            value={drawingName}
            onChange={(e) => setDrawingName(e.target.value)}
            className="px-5 py-1 outline-none border border-black text-black text-[14px]"
            type="text"
            placeholder="Type your drawing name .."
          />
        </div>
        <div className="flex items-center gap-2 mt-5">
          <label className="text-black" htmlFor="">
            Add Sample Data :
          </label>
          <div className="flex items-center gap-2">
            <input type="radio" name="sampleData" value="yes" />
            <label className="text-black" htmlFor="">
              Yes
            </label>
            <input type="radio" name="sampleData" value="no" />
            <label className="text-black" htmlFor="">
              No
            </label>
          </div>
        </div>
        <button className="px-5 py-1 bg-[#00A9E4] text-white mt-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateDrawingForm;
