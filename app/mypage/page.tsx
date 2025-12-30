'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProfileEditModal from './components/ProfileEditModal';
import OrderHistoryModal from './components/OrderHistoryModal';

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 (기본값: false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOrderHistoryModalOpen, setIsOrderHistoryModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    nickname: '홍길동',
    email: 'hong@example.com',
    address: '서울특별시 강남구 테헤란로 123',
    profileImage: '',
  });

  const handleProfileUpdate = (updatedProfile: typeof profile) => {
    setProfile(updatedProfile);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">마이페이지</h1>
        
        {/* 로그인하지 않은 경우 */}
        {!isLoggedIn ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 mb-6">
            <div className="flex flex-col items-center justify-center text-center">
              <svg 
                className="w-16 h-16 text-gray-400 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                로그인이 필요합니다
              </h2>
              <p className="text-gray-600 mb-6">
                마이페이지를 이용하시려면 로그인해주세요.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* 로그인한 경우: 프로필 섹션 */
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-6">
              {/* 왼쪽: 프로필 사진 */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt="프로필 사진" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg 
                      className="w-12 h-12 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* 중앙: 프로필 정보 (세로로) */}
              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">닉네임</p>
                  <p className="text-lg font-medium">{profile.nickname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">이메일</p>
                  <p className="text-base">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">기본 배송지</p>
                  <p className="text-base">{profile.address}</p>
                </div>
              </div>

              {/* 오른쪽: 버튼들 */}
              <div className="flex-shrink-0 flex flex-col gap-3">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  프로필 편집
                </button>
                <button
                  onClick={() => setIsOrderHistoryModalOpen(true)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  주문 내역
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 프로필 편집 모달 */}
      {isLoggedIn && isProfileModalOpen && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setIsProfileModalOpen(false)}
          onSave={handleProfileUpdate}
        />
      )}

      {/* 주문 내역 모달 */}
      {isLoggedIn && isOrderHistoryModalOpen && (
        <OrderHistoryModal
          onClose={() => setIsOrderHistoryModalOpen(false)}
        />
      )}
    </div>
  );
}
