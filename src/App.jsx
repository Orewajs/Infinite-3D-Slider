import { Canvas } from "@react-three/fiber";
import Index from "./experience/Index";

function App() {
  return (
    <section className="h-screen">
      <Canvas
        camera={{
          position: [2, 3, 6],
          fov: 25,
          near: 0.1,
          far: 1000,
        }}
      >
        <Index />
      </Canvas>
    </section>
  );
}

export default App;
