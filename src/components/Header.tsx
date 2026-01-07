export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 bg-white sticky top-0 h-16 px-6 z-10">
      <h1 className="text-gray-900 text-lg font-bold leading-tight"></h1>
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="relative flex items-center justify-center size-10 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></div>
        </button>
        {/* Avatar placeholder */}
        <div className="bg-gray-200 bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex items-center justify-center text-gray-500 font-bold">
           A
        </div>
      </div>
    </header>
  );
}