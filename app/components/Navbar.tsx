// import { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { HowItWorksModal } from "./HowItWorksModal";
// import GalleryModal from "./GalleryModal";

// interface NavbarProps {
//   onImageSelect?: (src: string) => void;
// }

// const Navbar = ({ onImageSelect }: NavbarProps) => {
//   const [showHowItWorks, setShowHowItWorks] = useState(false);
//   const [showGallery, setShowGallery] = useState(false);

//   return (
//     <nav className="w-full border-b border-white/10">
//       <div className="container flex h-14 items-center">
//         <div className="mr-4 hidden md:flex">
//           <Link className="mr-6 flex items-center space-x-2" href="/">
//             <span className="hidden font-bold sm:inline-block">
//               LUT Generator Pro
//             </span>
//           </Link>
//           <nav className="flex items-center space-x-6 text-sm font-medium">
//             <Button
//               onClick={() => setShowHowItWorks(true)}
//               variant="ghost"
//               className="text-white/70 hover:text-white"
//             >
//               How it Works
//             </Button>
//             <Button
//               onClick={() => setShowGallery(true)}
//               variant="ghost"
//               className="text-white/70 hover:text-white"
//             >
//               Gallery
//             </Button>
//           </nav>
//         </div>

//         <HowItWorksModal
//           isOpen={showHowItWorks}
//           onClose={() => setShowHowItWorks(false)}
//         />
        
//         <GalleryModal
//           isOpen={showGallery}
//           onClose={() => setShowGallery(false)}
//           onImageSelect={(src) => {
//             if (onImageSelect) {
//               onImageSelect(src);
//             }
//           }}
//         />
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
