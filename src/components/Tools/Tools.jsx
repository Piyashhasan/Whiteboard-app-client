import toolsButton from "../../utils/toolsButton";

const Tools = (props) => {
  // eslint-disable-next-line react/prop-types
  const { selectedShape, setSelectedShape, handleAddText, handleReset } = props;

  return (
    <div className="flex flex-col items-center gap-5 bg-[#F0F0F0] px-8 py-5 rounded-md">
      {toolsButton.map((tool, index) => {
        const IconComponent = tool.icon;
        return (
          <button
            key={index}
            className="py-1 flex items-center justify-center relative group"
            onClick={() =>
              tool.toolName === "Reset"
                ? handleReset()
                : tool.shape === "text"
                ? handleAddText()
                : setSelectedShape(tool.shape)
            }
          >
            <IconComponent
              className={`text-[28px]  ${
                selectedShape === tool.shape ? "text-black" : "text-[#a29898]"
              } hover:text-black`}
            />
            <div className="absolute bottom-full mb-2 hidden group-hover:flex justify-center items-center px-2 py-1 bg-gray-700 text-white text-sm rounded">
              {tool.toolName}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Tools;
