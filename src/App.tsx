import "./App.css";
import DramaticCountdownButton from "./components/DramaticCountdownButton.tsx";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DramaticCountdownButton />
      <p>Anna palautetta natskulle :D</p>
    </div>
  );
}

export default App;
