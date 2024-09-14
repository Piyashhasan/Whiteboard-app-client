import { AiOutlineSelect } from "react-icons/ai";
import { IoPencilOutline, IoTriangleOutline } from "react-icons/io5";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FaRegCircle } from "react-icons/fa";
import { CiText } from "react-icons/ci";
import { RxReset } from "react-icons/rx";

const toolsButton = [
  {
    toolName: "Select",
    icon: AiOutlineSelect,
    shape: "select",
  },
  {
    toolName: "Text",
    icon: CiText,
    shape: "text",
  },
  {
    toolName: "Pencil",
    icon: IoPencilOutline,
    shape: "line",
  },
  {
    toolName: "Rectangle",
    icon: LuRectangleHorizontal,
    shape: "rectangle",
  },
  {
    toolName: "Circle",
    icon: FaRegCircle,
    shape: "circle",
  },
  {
    toolName: "Triangle",
    icon: IoTriangleOutline,
    shape: "triangle",
  },
  {
    toolName: "Reset",
    icon: RxReset,
  },
];

export default toolsButton;
