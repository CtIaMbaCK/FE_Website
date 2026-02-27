import { MdCheck, MdClose } from "react-icons/md";

export default function PendingList() {
  return (
    <div className="rounded-[2rem] bg-white/80 backdrop-blur-xl border border-slate-100 shadow-sm h-full overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100/60 bg-slate-50/30 flex justify-between items-center">
        <h2 className="text-slate-900 text-lg font-black tracking-tight">
          Chờ phê duyệt
        </h2>
        <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[11px] font-bold tracking-wider uppercase border border-teal-100 line-clamp-1 min-w-max">
           3 Yêu cầu
        </span>
      </div>
      <div className="p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
        
        {/* Item 1 */}
        <div className="flex items-center gap-4 p-3 hover:bg-slate-50/50 rounded-2xl transition-colors border border-transparent hover:border-slate-100/60">
          <div className="bg-blue-50 text-blue-600 rounded-xl size-10 flex items-center justify-center font-black shadow-sm border border-blue-100">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 font-bold text-sm truncate">Jane Doe</p>
            <p className="text-slate-500 text-xs mt-0.5 truncate font-medium">Đơn tình nguyện viên mới</p>
          </div>
          <div className="flex gap-2">
            <button className="size-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100 hover:border-transparent">
              <MdCheck className="text-lg" />
            </button>
            <button className="size-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 hover:border-transparent">
              <MdClose className="text-lg" />
            </button>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-4 p-3 hover:bg-slate-50/50 rounded-2xl transition-colors border border-transparent hover:border-slate-100/60">
          <div className="bg-purple-50 text-purple-600 rounded-xl size-10 flex items-center justify-center font-black shadow-sm border border-purple-100">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 font-bold text-sm truncate">John Smith</p>
            <p className="text-slate-500 text-xs mt-0.5 truncate font-medium">Đơn tình nguyện viên mới</p>
          </div>
          <div className="flex gap-2">
             <button className="size-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100 hover:border-transparent">
               <MdCheck className="text-lg" />
             </button>
             <button className="size-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 hover:border-transparent">
               <MdClose className="text-lg" />
             </button>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-center gap-4 p-3 hover:bg-slate-50/50 rounded-2xl transition-colors border border-transparent hover:border-slate-100/60">
          <div className="bg-orange-50 text-orange-600 rounded-xl size-10 flex items-center justify-center font-black shadow-sm border border-orange-100">
            E
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 font-bold text-sm truncate">Emily White</p>
            <p className="text-slate-500 text-xs mt-0.5 truncate font-medium">Đơn tình nguyện viên mới</p>
          </div>
          <div className="flex gap-2">
             <button className="size-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100 hover:border-transparent">
               <MdCheck className="text-lg" />
             </button>
             <button className="size-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 hover:border-transparent">
               <MdClose className="text-lg" />
             </button>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <button className="w-full text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline transition-all">
          Xem tất cả phê duyệt
        </button>
      </div>
    </div>
  );
}