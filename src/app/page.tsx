import Scene from "@/components/canvas/Scene";
import Avatar from "@/components/canvas/Avatar";

export default function Home() {
  return (
    <main>
      <Scene>
        <Avatar />
      </Scene>
      {/* Your HTML overlay content here */}
      <section className="h-screen flex items-center px-10">
        <h1 className="text-white text-6xl font-bold">NEEL BHATT</h1>
      </section>
    </main>
  );
}