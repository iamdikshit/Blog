"use client";
import AdminHeader from "@/components/Header/AdminHeader";
import AdminMenu from "@/components/Menu/AdminMenu";
import { use, useState } from "react";
export default function Home() {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const menuHandler = () => {
    setIsMenuActive((prev) => !prev);
  };
  return (
    <main className="">
      {/* Header section */}
      <AdminHeader menuHandler={menuHandler} isMenuActive={isMenuActive} />
      {/* body */}
      <div className="flex relative">
        {/* Menu section */}
        <AdminMenu isMenuActive={isMenuActive} />
        <div className="z-10">Body</div>
        {/* Inner body section */}
      </div>
    </main>
  );
}
