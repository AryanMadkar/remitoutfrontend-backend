import Image from "next/image";
import Home1 from "@/components/home/Home1";
import Home2 from "@/components/home/Home2";
import Hero3 from "@/components/home/Hero3";
import Hero4 from "@/components/home/Hero4";
import Hero5 from "@/components/home/Hero5";
import Hero6 from "@/components/home/Home6";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Home1 />
      <Home2 />
      <Hero3 />
      <Hero4 />
      <Hero5 />
      <Hero6 />
      <Footer />
    </div>
  );
}
