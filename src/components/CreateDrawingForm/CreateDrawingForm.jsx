import { useEffect, useState } from "react";
import { useCreateDrawingMutation } from "../../services/appApi";
import toast from "react-hot-toast";
import elements from "../../utils/twoSampleDrawing";

// eslint-disable-next-line react/prop-types
const CreateDrawingForm = ({ setVisible }) => {
  const [drawingName, setDrawingName] = useState("");
  const [includeElements, setIncludeElements] = useState("no");

  // --- Create drawing mutation ---
  const [createDrawing, { isLoading, isSuccess, isError }] =
    useCreateDrawingMutation();

  // --- Form submission handler ---
  const handleFromSubmit = async (e) => {
    e.preventDefault();
    const fileName = drawingName
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, " ");

    if (fileName) {
      const payload = {
        name: fileName,
        ...(includeElements === "yes" && { elements }),
      };

      await createDrawing(payload);
      setVisible(false);
    }

    setDrawingName("");
  };

  // --- Toast notifications ---
  useEffect(() => {
    if (isLoading) {
      toast.loading("Loading ...", { id: "createDrawing" });
    }
    if (!isLoading && isError) {
      toast.error("Drawing not added.", { id: "createDrawing" });
    }
    if (isSuccess) {
      toast.success("Successfully created drawing!", { id: "createDrawing" });
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
            <input
              type="radio"
              name="sampleData"
              value="yes"
              checked={includeElements === "yes"}
              onChange={(e) => setIncludeElements(e.target.value)}
            />
            <label className="text-black" htmlFor="">
              Yes
            </label>
            <input
              type="radio"
              name="sampleData"
              value="no"
              checked={includeElements === "no"}
              onChange={(e) => setIncludeElements(e.target.value)}
            />
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
