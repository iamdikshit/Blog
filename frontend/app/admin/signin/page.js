import AdminHeader from "@/components/Header/AdminHeader";
import SignIn from "@/components/UI/SignIn";
export default function Home() {
  return (
    <main className="">
      {/* <AdminHeader /> */}
      <div className="mx-auto mt-20 flex justify-center items-center">
        <SignIn />
      </div>
    </main>
  );
}
