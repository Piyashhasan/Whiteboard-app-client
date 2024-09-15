import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import CreateDrawingForm from "../../components/CreateDrawingForm/CreateDrawingForm";

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  return (
    <nav className="wrapper bg-[#F0F0F0] my-5 rounded-[35px]">
      <div className="flex items-center justify-between px-5 py-3 ">
        <Link to="/">
          <h1 className="text-[18px] text-[#FFC82D] text-center capitalize font-bold">
            CanvasCloud
          </h1>
        </Link>
        <div>
          <button
            onClick={() => setVisible(true)}
            className="border-[1.5px] border-black text-[14px] px-5 py-2 rounded-full text-black hover:bg-black hover:text-white"
          >
            Add Drawing
          </button>
        </div>
      </div>

      <Dialog
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <CreateDrawingForm setVisible={setVisible} />
      </Dialog>
    </nav>
  );
};

export default NavBar;
