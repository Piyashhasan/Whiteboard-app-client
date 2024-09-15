import SearchDrawing from "../components/SearchDrawing/SearchDrawing";
import DrawingItems from "../components/DrawingItems/DrawingItems";
import NavBar from "../shared/NavBar/NavBar";

const Home = () => {
  return (
    <div className="wrapper">
      <NavBar />
      <div className="py-[30px]">
        <SearchDrawing />
        <DrawingItems />
      </div>
    </div>
  );
};

export default Home;
