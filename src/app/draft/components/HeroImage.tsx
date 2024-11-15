import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
interface Hero {
  name: string;
  img: string;
}

const HeroImage = React.memo(
  ({ hero, index }: { hero: Hero | null; index: Number }) => {
    return (
        <Image
          key={"hero" + index}
          src={hero?.img || "/placeholder.png"}
          alt={hero?.name || "Placeholder"}
          layout="fill"
          objectFit="cover"
          draggable={false}
        />
    );
  }
);

const HeroCard = (
  ({ hero, index, animate }: { hero: Hero | null; index: Number, animate: Boolean }) => {
    return (
      <div
        className="bg-cover z-[99]"
        style={{
          backgroundImage: animate ? `url('/placeholder.png')` :  `url('/placeholder2.png')`,
          // background: "black",
        }}
      >
        {/* <HeroImage hero={hero} index={index} /> */}
        {
          !animate ? (

            <Image
            key={"hero" + index}
            src={hero?.img || "/placeholder2.png"}
            alt={hero?.name || "Placeholder"}
            layout="fill"
            objectFit="cover"
            draggable={false}
            />
          ) : ( 
            <Image
            key={"animate" + index}
            src={"/placeholder.png"}
            alt={"AnimatedPlaceholder"}
            layout="fill"
            objectFit="cover"
            draggable={false}
            />
)}

        <div className="absolute top-0 left-0 px-1 opacity-70 w-full bg-black/70 text-white text-center z-50"
        >
          {hero?.name}
        </div>

      </div>
    );
  }
);

export { HeroImage, HeroCard };
