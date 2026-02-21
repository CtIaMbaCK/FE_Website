import type { Metadata } from "next";
import HomeHeader from "@/components/HomePageHeader";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BetterUS",
  description: "BetterUS cho Tổ chức xã hội",
};

export default function HomePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        {/* Header ở trên cùng, sticky */}
        <HomeHeader />

        {/* Nội dung thay đổi (Children) */}
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
}