"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPublicPostDetail, CommunicationPost } from "@/services/communication.service";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HomeHeader from "@/components/HomePageHeader";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<CommunicationPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await getPublicPostDetail(postId);
      setPost(data);
    } catch (error: any) {
      toast.error("Lỗi khi tải bài viết: " + error.message);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <HomeHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#008080]/20 rounded-full"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-[#008080] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-slate-500 font-medium">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 fixed">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#008080]/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] w-[45%] h-[55%] rounded-full bg-blue-300/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#008080]/15 blur-[150px]" />
      </div>

      <HomeHeader />

      <main className="flex-1 relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Back button */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link href="/">
            <Button variant="ghost" className="rounded-full hover:bg-white/60 hover:text-[#008080] text-slate-500 transition-colors shadow-sm bg-white/40 backdrop-blur-md border border-white/50 px-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay về
            </Button>
          </Link>
        </div>

        {/* Content Box */}
        <article className="max-w-4xl mx-auto bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_30px_60px_rgba(0,128,128,0.06)] border border-white/80 overflow-hidden">
          
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
          )}

          <div className="p-8 md:p-14 lg:p-16 relative">
            {/* Header Content pushed up slightly if image exists */}
            <header className={`${post.coverImage ? "-mt-24 relative z-10 bg-white/90 backdrop-blur-lg p-8 rounded-[2rem] shadow-xl border border-white/50 mb-10" : "mb-10"}`}>
               {/* Meta Info */}
               <div className="flex flex-wrap items-center gap-4 text-sm text-[#008080] font-semibold mb-4">
                 {post.organization?.organizationProfiles?.organizationName && (
                   <div className="flex items-center gap-2 bg-[#008080]/10 px-4 py-1.5 rounded-full border border-[#008080]/20">
                     <Building2 className="w-4 h-4" />
                     <span>
                       {post.organization.organizationProfiles.organizationName}
                     </span>
                   </div>
                 )}
                 <div className="flex items-center gap-2 text-slate-500 font-medium">
                   <Calendar className="w-4 h-4" />
                   <time dateTime={post.createdAt}>
                     {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                       year: "numeric",
                       month: "long",
                       day: "numeric",
                     })}
                   </time>
                 </div>
               </div>

               <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.2] tracking-tight">
                 {post.title}
               </h1>
            </header>

            {/* Post Details */}
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 font-light leading-relaxed prose-a:text-[#008080] prose-a:font-semibold hover:prose-a:text-[#00A79D]">
               <div className="whitespace-pre-line text-lg">
                 {post.content}
               </div>
            </div>

            {/* Organization Info Card */}
            {post.organization?.organizationProfiles && (
              <div className="mt-14 p-6 md:p-8 bg-slate-50/80 rounded-3xl border border-slate-200/60 flex items-center md:items-start gap-6">
                {post.organization.organizationProfiles.avatarUrl ? (
                  <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden shrink-0">
                    <Image
                      src={post.organization.organizationProfiles.avatarUrl}
                      alt={post.organization.organizationProfiles.organizationName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-[#008080]/20 to-[#00A79D]/30 flex items-center justify-center text-3xl font-bold text-[#008080] shrink-0">
                    {post.organization.organizationProfiles.organizationName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-[#008080] uppercase tracking-wider mb-1">Tác giả</p>
                  <p className="text-xl font-bold text-slate-800 mb-2">
                    {post.organization.organizationProfiles.organizationName}
                  </p>
                  <p className="text-slate-500 text-sm">Một phần của cộng đồng lan tỏa yêu thương BetterUS.</p>
                </div>
              </div>
            )}

            {/* Footer Article Actions */}
            <div className="mt-12 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-sm text-slate-400 font-medium">
                Cập nhật lần cuối:{" "}
                {new Date(post.updatedAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <Link href="/">
                <Button className="rounded-full bg-slate-100 hover:bg-[#008080] text-slate-700 hover:text-white border-0 shadow-sm transition-all duration-300 font-semibold px-6 py-2">
                  Đọc thêm tin tức
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
