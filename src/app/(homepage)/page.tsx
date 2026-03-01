"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getAllPublicPosts,
  CommunicationPost,
} from "@/services/communication.service";
import {
  getTopVolunteersGlobal,
  TopVolunteer,
} from "@/services/statistics.service";

import {
  MdOutlineVolunteerActivism,
  MdOutlineHealthAndSafety,
  MdOutlineCampaign,
  MdBolt,
  MdAutoAwesome,
  MdDiversity1,
  MdArrowForward,
  MdPlayCircleOutline,
  MdOutlineFavoriteBorder,
  MdFavorite,
  MdPeopleOutline,
  MdHandshake
} from "react-icons/md";

export default function HomePage() {
  const [posts, setPosts] = useState<CommunicationPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [topVolunteers, setTopVolunteers] = useState<TopVolunteer[]>([]);
  const [volunteersLoading, setVolunteersLoading] = useState(true);

  const scrollToFooter = () => {
    const footer = document.getElementById("main-footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      icon: <MdOutlineVolunteerActivism className="w-6 h-6" />,
      title: "Gắn kết cộng đồng",
      description: "Tìm kiếm và tham gia các hoạt động tình nguyện gần bạn với hệ thống gợi ý bản đồ thông minh.",
    },
    {
      icon: <MdOutlineHealthAndSafety className="w-6 h-6" />,
      title: "An toàn & Minh bạch",
      description: "Mọi hồ sơ đều được xác thực kỹ lưỡng thông qua CCCD và giấy tờ, đảm bảo môi trường tin cậy.",
    },
    {
      icon: <MdOutlineCampaign className="w-6 h-6" />,
      title: "Chiến dịch ý nghĩa",
      description: "Theo dõi và đóng góp công sức vào các chiến dịch cộng đồng quy mô do TCXH phát động.",
    },
    {
      icon: <MdBolt className="w-6 h-6" />,
      title: "Cứu trợ khẩn cấp",
      description: "Nút bấm SOS giúp người dùng phát tín hiệu để nhận sự hỗ trợ kịp thời nhất.",
    },
    {
      icon: <MdAutoAwesome className="w-6 h-6" />,
      title: "Tích điểm & Chứng nhận",
      description: "Hệ thống điểm thưởng động và cấp phát chứng nhận tình nguyện bản PDF tự động.",
    },
    {
      icon: <MdDiversity1 className="w-6 h-6" />,
      title: "Nhắn tin Realtime",
      description: "Trao đổi, liên lạc trực tiếp giữa tình nguyện viên và người cần giúp đỡ an toàn mọi nơi.",
    },
  ];

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setPostsLoading(true);
        const response = await getAllPublicPosts({ page: 1, limit: 3 });
        setPosts(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const loadTopVolunteers = async () => {
      try {
        setVolunteersLoading(true);
        const data = await getTopVolunteersGlobal(3);
        setTopVolunteers(data);
      } catch (error) {
        console.error("Lỗi khi tải top tình nguyện viên:", error);
      } finally {
        setVolunteersLoading(false);
      }
    };

    loadTopVolunteers();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#008080]/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] w-[45%] h-[55%] rounded-full bg-blue-300/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#008080]/15 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-32">
        {/* --- Hero Section 50-50 Layout --- */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="text-left flex flex-col items-start max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[#008080]/20 shadow-sm mb-8 text-sm font-medium text-[#008080] animate-fade-in hover:bg-white hover:shadow-md transition-all cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-[#008080] animate-pulse"></span>
                Nền tảng Tình nguyện & Cứu trợ chuẩn mới
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-8">
                Lan tỏa <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008080] to-[#00A79D]">Yêu thương</span> <br className="hidden sm:block" />
                Kiến tạo giá trị
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-light">
                Cùng BetterUS chung tay xây dựng một cộng đồng vững mạnh. Sẻ chia thời gian, kỹ năng để mang lại nụ cười và hy vọng cho những người đang gặp khó khăn. Mọi đóng góp đều đáng trân trọng.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/download" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#008080] to-[#00A79D] text-white font-bold text-lg shadow-[0_10px_30px_rgba(0,128,128,0.3)] hover:shadow-[0_15px_40px_rgba(0,128,128,0.45)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                  Tham gia ngay <MdArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button 
                  onClick={scrollToFooter}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/80 backdrop-blur-md text-slate-700 font-bold text-lg border border-slate-200 shadow-sm hover:text-[#008080] hover:bg-white hover:shadow-md hover border-[#008080]/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MdPlayCircleOutline className="w-6 h-6 opacity-70" /> Tìm hiểu thêm
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-12 pt-8 border-t border-slate-200/60 w-full">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Được tin dùng bởi hơn 10.000+ người</p>
                <div className="flex gap-4 items-center">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative shadow-sm">
                        <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" fill style={{objectFit: 'cover'}} />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#008080]/10 flex items-center justify-center text-xs font-bold text-[#008080] shadow-sm z-10">
                      +10k
                    </div>
                  </div>
                  <div className="flex text-amber-500 text-lg">
                    {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Visual Composition */}
            <div className="relative h-full min-h-[500px] lg:min-h-[600px] flex items-center justify-center lg:justify-end">
              {/* Main abstract card */}
              <div className="relative w-full max-w-md aspect-[4/5] bg-gradient-to-br from-[#008080] to-[#00A79D] rounded-[3rem] p-1 shadow-[0_30px_60px_rgba(0,128,128,0.2)] rotate-[-2deg] hover:rotate-0 transition-transform duration-700 ease-out group">
                <div className="w-full h-full bg-white/10 backdrop-blur-3xl rounded-[2.8rem] border border-white/20 p-8 flex flex-col justify-between overflow-hidden relative">
                   <div className="absolute inset-0 opacity-40 mix-blend-overlay rounded-[2.8rem] bg-[url('/images/pattern.jpg')] bg-cover bg-center pointer-events-none"></div>
                   
                   <div className="flex justify-between items-start z-10">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white">
                         <MdHandshake className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      <span className="px-4 py-1.5 rounded-full bg-white/20 text-white font-semibold text-sm backdrop-blur-md">Gắn kết</span>
                   </div>

                   <div className="z-10 mt-auto">
                     <h3 className="text-3xl font-bold text-white mb-2 leading-tight">Mạng lưới Lan tỏa</h3>
                     <p className="text-white/80 line-clamp-2 mb-6 text-sm">Hàng ngàn bàn tay đang cùng nối nhịp cầu yêu thương, kết nối những hoàn cảnh khó khăn với sự giúp đỡ kịp thời.</p>
                     
                     <div className="flex -space-x-4 mb-2">
                        {[5,12,33,45,60].map((img, idx) => (
                           <div key={idx} className="w-10 h-10 rounded-full border-2 border-white/40 overflow-hidden relative opacity-90 transition-transform hover:-translate-y-2 hover:opacity-100 hover:border-white hover:z-20 cursor-pointer">
                              <Image src={`https://i.pravatar.cc/100?img=${img}`} alt="User Avatar" fill className="object-cover" />
                           </div>
                        ))}
                     </div>
                     <div className="text-white/90 text-xs font-semibold mt-3">
                       Hơn <span className="text-amber-300 font-bold">100+</span> hoạt động tình nguyện diễn ra mỗi ngày
                     </div>
                   </div>
                </div>
              </div>

              {/* Floating card top right */}
              <div className="absolute right-0 top-10 lg:-right-8 w-56 bg-white/90 backdrop-blur-xl p-4 rounded-3xl border border-white shadow-[0_20px_40px_rgba(0,0,0,0.06)] hidden md:flex flex-col gap-3 animate-[floating_4s_ease-in-out_infinite_1s] z-20">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500"><MdDiversity1 size={20}/></div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Đã giúp đỡ</p>
                      <p className="text-lg font-bold text-slate-800">5,000+ Người</p>
                    </div>
                 </div>
              </div>

              {/* Secondary floating card bottom left */}
              <div className="absolute left-0 bottom-10 lg:-left-12 w-64 bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] border border-white shadow-[0_20px_50px_rgba(0,128,128,0.1)] hidden md:flex flex-col gap-3 animate-[floating_5s_ease-in-out_infinite]">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080] shadow-inner"><MdPeopleOutline size={24}/></div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Cộng đồng TNV</p>
                      <p className="text-xl font-bold text-slate-800 tracking-tight">10,000+ <span className="text-sm font-semibold text-[#008080]">Tích cực</span></p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Features & Mockup --- */}
        <section className="mb-32">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Trải nghiệm Hiện đại & Chuyên nghiệp</h2>
             <p className="text-slate-500 max-w-xl mx-auto">Thiết kế tinh gọn tập trung vào người dùng, giúp quá trình thiện nguyện trở nên dễ dàng và minh bạch hơn bao giờ hết.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Mockup Left */}
            <div className="lg:col-span-4 relative flex justify-center">
              <div className="relative w-full max-w-[320px] aspect-[9/19] rounded-[3rem] p-3 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-100">
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center items-end z-20">
                   <div className="w-1/3 h-4 bg-white rounded-b-3xl"></div>
                </div>
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-100 block">
                  <Image
                    src="/images/betterus.png"
                    alt="App Screenshot"
                    width={320}
                    height={660}
                    style={{objectFit: 'cover'}}
                  />
                </div>
              </div>
              <div className="absolute -left-8 top-1/4 w-16 h-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white flex items-center justify-center animate-[bounce_3s_ease-in-out_infinite]">
                <MdOutlineVolunteerActivism className="text-[#008080] w-8 h-8" />
              </div>
              <div className="absolute -right-6 bottom-1/3 w-20 h-20 bg-white/80 backdrop-blur-xl rounded-full shadow-xl border border-white flex items-center justify-center animate-[bounce_4s_ease-in-out_infinite]">
                 <MdBolt className="text-amber-500 w-10 h-10" />
              </div>
            </div>

            {/* Features Right */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/50 backdrop-blur-lg p-6 flex flex-col items-start rounded-3xl border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,128,128,0.1)] hover:bg-white transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-[#008080]/10 text-[#008080] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#008080] group-hover:text-white transition-all duration-300 shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10  ">
            <div className="bg-[#008080]/80 w-full gap-10 flex items-center justify-center rounded-lg">
            <div className="relative p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Sẵn sàng nâng cao hiệu suất công việc của bạn?
            </h3>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Khám phá ngay hôm nay cách BetterUS kết nối cộng đồng lại với nhau để có thể trở nên tốt đẹp hơn.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/download" className="bg-white text-[#008080] font-bold hover:bg-white/90 px-6 py-3 rounded-lg transition-all">
                Tải ứng dụng
              </Link>
            </div>
          </div>
            </div>
            
          </div>
        </section>

        {/* --- Top Volunteers --- */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row items-center justify-center mb-12 gap-4">
            <div className="flex items-center flex-col justify-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Ngôi Sao Sáng</h2>
              <p className="text-slate-500">Những cá nhân xuất sắc có đóng góp lớn nhất trong cộng đồng.</p>
            </div>
            {/* <button className="text-[#008080] font-semibold text-sm flex items-center gap-1 hover:text-[#006666] transition-colors bg-[#008080]/10 px-4 py-2 rounded-full">
              Xem tất cả <MdArrowForward />
            </button> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {volunteersLoading ? (
               <div className="col-span-3 flex justify-center py-12">
                 <div className="w-10 h-10 border-4 border-[#008080]/30 border-t-[#008080] rounded-full animate-spin"></div>
               </div>
             ) : topVolunteers.length === 0 ? (
               <div className="col-span-3 text-center py-12 text-slate-400 bg-white/40 rounded-3xl border border-white/50">Chưa có dữ liệu</div>
             ) : (
               topVolunteers.slice(0, 3).map((volunteer, index) => {
                 const ranks = [
                   { bg: "bg-amber-100", border: "border-amber-400", text: "text-amber-600", shadow: "shadow-amber-200/50" }, // 1st
                   { bg: "bg-slate-200", border: "border-slate-400", text: "text-slate-600", shadow: "shadow-slate-300/50" }, // 2nd
                   { bg: "bg-orange-100", border: "border-orange-400", text: "text-orange-600", shadow: "shadow-orange-200/50" } // 3rd
                 ];
                 const r = ranks[index];

                 return (
                   <div key={volunteer.userId} className="relative bg-white/70 backdrop-blur-xl border border-white/80 p-6 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,128,128,0.08)] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center group">
                      <div className={`absolute -top-4 w-10 h-10 rounded-full ${r.bg} ${r.border} border-2 flex items-center justify-center font-bold ${r.text} shadow-lg ${r.shadow} z-10`}>
                        {index + 1}
                      </div>

                      <div className="relative w-24 h-24 mb-5 mt-2">
                        {volunteer.avatarUrl ? (
                          <div className={`w-full h-full rounded-full border-4 ${r.border} shadow-md overflow-hidden relative`}>
                            <Image src={volunteer.avatarUrl} alt={volunteer.fullName} fill style={{objectFit: 'cover'}} />
                          </div>
                        ) : (
                          <div className={`w-full h-full rounded-full flex items-center justify-center text-3xl font-bold border-4 ${r.border} ${r.bg} ${r.text}`}>
                            {volunteer.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 mb-1">{volunteer.fullName}</h3>
                      {volunteer.organizationName && <p className="text-xs font-semibold text-[#008080] bg-[#008080]/10 px-3 py-1 rounded-full mb-3">{volunteer.organizationName}</p>}
                      
                      <div className="flex items-center gap-4 mt-auto w-full justify-center pt-4 border-t border-slate-100">
                        <div className="text-center">
                           <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Điểm</p>
                           <p className="font-bold text-slate-700">{volunteer.points}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="text-center">
                           <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Cảm ơn</p>
                           <p className="font-bold text-slate-700 opacity-80">{volunteer.totalThanks}</p>
                        </div>
                      </div>
                   </div>
                 );
               })
             )}
          </div>
        </section>

        {/* --- News / Posts Section --- */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row items-center justify-center mb-12 gap-4">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Tin tức & Sự kiện</h2>
              <p className="text-slate-500">Cập nhật nhanh những thông tin mới nhất từ các Tổ chức Xã hội.</p>
            </div>
            {/* <Link href="/posts" className="text-[#008080] font-semibold text-sm flex items-center gap-1 hover:text-[#006666] transition-colors bg-[#008080]/10 px-4 py-2 rounded-full">
              Xem tất cả <MdArrowForward />
            </Link> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {postsLoading ? (
              <div className="col-span-3 flex justify-center py-16">
                 <div className="w-10 h-10 border-4 border-[#008080]/30 border-t-[#008080] rounded-full animate-spin"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="col-span-3 bg-white/40 border border-white/60 rounded-3xl p-16 text-center shadow-sm">
                <p className="text-slate-400 font-medium">Chưa có bài viết mới</p>
              </div>
            ) : (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white/70 backdrop-blur-lg rounded-[2.5rem] overflow-hidden border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(0,128,128,0.12)] transition-all duration-300 group flex flex-col hover:-translate-y-2"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100 flex-shrink-0">
                    {post.coverImage ? (
                      <Image
                        alt={post.title}
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out block"
                        src={post.coverImage}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                       <div className="flex items-center justify-center h-full bg-[#008080]/10 group-hover:bg-[#008080]/20 transition-colors">
                         <MdAutoAwesome className="w-16 h-16 text-[#008080]/40" />
                       </div>
                    )}
                    {post.organization?.organizationProfiles?.organizationName && (
                       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm border border-white/50">
                          {post.organization.organizationProfiles.organizationName}
                       </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 leading-snug group-hover:text-[#008080] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed flex-grow">
                      {post.content}
                    </p>
                    <Link
                      href={`/posts/${post.id}`}
                      className="inline-flex items-center justify-center w-full py-3 rounded-2xl bg-slate-50 text-[#008080] font-semibold text-sm group-hover:bg-[#008080]/10 transition-colors"
                    >
                      Đọc chi tiết
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

    </div>
  );
}

