'use client';

import React, { useState } from 'react';
// import Link from 'next/link'; // Không cần Link vì chỉ làm phần nội dung chính
import {
  MdSearch,
  MdDelete,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge"; // Chưa dùng Badge trong trang này
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Breadcrumb from '@/components/Breadcrumb';

// Dữ liệu mẫu
const MOCK_REWARDS = [
  {
    id: 1,
    volunteerName: 'An Nguyễn',
    avatar: '', 
    rewardName: 'Tình nguyện viên Xuất sắc Quý 4',
    date: '31/12/2023',
  },
  {
    id: 2,
    volunteerName: 'Bình Lê',
    avatar: '',
    rewardName: 'Cống hiến nổi bật 2023',
    date: '15/12/2023',
  },
  {
    id: 3,
    volunteerName: 'Chi Phạm',
    avatar: '',
    rewardName: 'Tình nguyện viên của Tháng 11',
    date: '01/12/2023',
  },
  {
    id: 4,
    volunteerName: 'Dũng Trần',
    avatar: '',
    rewardName: 'Tình nguyện viên Xuất sắc Quý 3',
    date: '30/09/2023',
  },
];

export default function RewardPage(){
    const[searchTerm, setSearchTerm]= useState('');

    return (
    <div className="pb-10">
      <Breadcrumb
        items={[
          { label: "Khen thưởng" },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Khen thưởng</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý Khen thưởng</p>
            </div>
            <Button className="gap-2 bg-primary text-white hover:bg-teal-700 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">add</span>
                Tạo form khen thưởng mới
            </Button>
        </div>

      {/* Stats Cards - Sử dụng class .custom-card từ globals.css */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
               <Card className="custom-card border-none bg-white dark:bg-gray-800">
                  <CardContent className="p-6 flex flex-col gap-2">
                     <p className="text-custom-text-light font-medium">Tổng số Khen thưởng</p>
                     <p className="text-3xl font-bold text-custom-text-dark">128</p>
                  </CardContent>
               </Card>
               <Card className="custom-card border-none bg-white dark:bg-gray-800">
                  <CardContent className="p-6 flex flex-col gap-2">
                     <p className="text-custom-text-light font-medium">Khen thưởng năm nay</p>
                     <p className="text-3xl font-bold text-custom-text-dark">24</p>
                  </CardContent>
               </Card>
               <Card className="custom-card border-none bg-white dark:bg-gray-800">
                  <CardContent className="p-6 flex flex-col gap-2">
                     <p className="text-custom-text-light font-medium">TNV được vinh danh</p>
                     <p className="text-3xl font-bold text-custom-text-dark">76</p>
                  </CardContent>
               </Card>
            </div>

            {/* Search & Filter & Table Container */}
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl custom-card overflow-hidden">
               
               {/* Filters */}
               <div className="flex flex-wrap gap-4 items-center p-4 border-b border-custom-gray-border">
                  <div className="grow min-w-[200px]">
                     <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                        <Input 
                           placeholder="Tìm theo tên tình nguyện viên hoặc tên khen thưởng..." 
                           className="pl-10 bg-custom-gray-bg border-none focus-visible:ring-custom-teal"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </div>
                  <div className="flex gap-3">
                  </div>
               </div>

               {/* Table */}
               <div className="overflow-x-auto">
                  <Table>
                     <TableHeader className=''>
                        <TableRow className="hover:bg-transparent border-custom-gray-border">
                           <TableHead className="w-[300px] text-custom-text-light font-semibold">Tình nguyện viên</TableHead>
                           <TableHead className="text-custom-text-light font-semibold">Tên Khen thưởng</TableHead>
                           <TableHead className="text-custom-text-light font-semibold">Ngày trao</TableHead>
                           <TableHead className="text-right text-custom-text-light font-semibold">Hành động</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {MOCK_REWARDS.map((reward) => (
                           <TableRow key={reward.id} className="hover:bg-custom-teal-light/50 border-custom-gray-border">
                              <TableCell className="font-medium text-custom-text-dark">
                                 <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-gray-100">
                                       <AvatarImage src={reward.avatar} />
                                       <AvatarFallback className="bg-custom-teal-light text-custom-teal font-bold">
                                          {reward.volunteerName.charAt(0)}
                                       </AvatarFallback>
                                    </Avatar>
                                    <span>{reward.volunteerName}</span>
                                 </div>
                              </TableCell>
                              <TableCell className="text-custom-teal font-semibold">{reward.rewardName}</TableCell>
                              <TableCell className="text-custom-text-light">{reward.date}</TableCell>
                              <TableCell className="text-right">
                                 <div className="flex justify-end items-center gap-2">
                                    <Button variant="outline" className="text-custom-teal border-custom-teal hover:bg-custom-teal hover:text-white h-8 text-xs font-bold px-3">
                                       Khen thưởng
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50">
                                       <MdDelete className="text-lg" />
                                    </Button>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>

               {/* Pagination */}
               <div className="flex justify-center p-4 border-t border-custom-gray-border">
                  <nav className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" disabled className="text-gray-400">
                        <MdChevronLeft className="text-xl" />
                     </Button>
                     <Button className="bg-custom-teal hover:bg-custom-teal/90 h-8 w-8 p-0 text-sm font-bold shadow-none">1</Button>
                     <Button variant="ghost" className="h-8 w-8 p-0 text-sm text-custom-text-light hover:text-custom-teal">2</Button>
                     <Button variant="ghost" className="h-8 w-8 p-0 text-sm text-custom-text-light hover:text-custom-teal">3</Button>
                     <span className="text-gray-400 px-2">...</span>
                     <Button variant="ghost" className="h-8 w-8 p-0 text-sm text-custom-text-light hover:text-custom-teal">8</Button>
                     <Button variant="ghost" size="icon" className="text-custom-text-light hover:text-custom-teal">
                        <MdChevronRight className="text-xl" />
                     </Button>
                  </nav>
               </div>
               </div>
    </div>
  );
}