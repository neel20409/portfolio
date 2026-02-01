import Scene from "@/components/canvas/Scene";
import Avatar from "@/components/canvas/Avatar";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Scene>
        <Avatar />
      </Scene>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-screen">
        <h1 className="text-white text-7xl font-black uppercase">Neel Bhatt</h1>
        <p className="text-gray-400 mt-4">Backend Completed | 3D Portfolio in Progress</p>
      </div>
    </main>
  );
}