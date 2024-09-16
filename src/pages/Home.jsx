import DrawingItems from "../components/DrawingItems/DrawingItems";
import NavBar from "../shared/NavBar/NavBar";

const Home = () => {
  return (
    <div className="wrapper">
      <div className="px-4 xl:px-0">
        <NavBar />
        <div className="py-[30px]">
          <DrawingItems />
        </div>
      </div>
    </div>
  );
};

export default Home;
