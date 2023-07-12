"use client";
import P5Sketch from "@/components/p5/sketch.component";
import StarsCollide from "@/components/stars-collide";

export default function Home() {
  return (
    <main>
      <div className="w-full h-screen">
        <div className="h-[50rem] w-full">
          <StarsCollide />
        </div>
      </div>
    </main>
  );
}
