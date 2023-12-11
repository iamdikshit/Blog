import Link from "next/link";
const AdminMenu = ({ isMenuActive }) => {
  console.log(isMenuActive);
  return (
    <div
      className={`bg-slate-900 h-screen absolute ${
        isMenuActive ? "w-52 z-50" : "w-0 z-50"
      }  transition-all ease-in-out duration-300 md:w-52 md:relative `}
    >
      <ul
        className={`text-white  flex flex-col  uppercase text-sm mt-4 ${
          isMenuActive ? "" : "hidden"
        } md:flex`}
      >
        <li className="hover:bg-gray-800 transition-all duration-150 py-2 px-4">
          <Link href={"admin/"}>Home</Link>
        </li>
        <li className="hover:bg-gray-800 transition-all duration-150 py-2 px-4">
          <Link href={"admin/post/all"}>Post</Link>
        </li>
        <li className="hover:bg-gray-800 transition-all duration-150 py-2 px-4">
          <Link href={"admin/post"}>Create Post</Link>
        </li>
        <li className="hover:bg-gray-800 transition-all duration-150 py-2 px-4">
          <Link href={"admin/comments"}>Comments</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminMenu;
