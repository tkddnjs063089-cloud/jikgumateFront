'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileEditModal from './components/ProfileEditModal';
import OrderHistoryModal from './components/OrderHistoryModal';

export default function MyPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOrderHistoryModalOpen, setIsOrderHistoryModalOpen] = useState(false);
  const hasShownAlertRef = useRef(false);
  const [profile, setProfile] = useState({
    nickname: '',
    email: '',
    address: '',
    profileImage: '',
  });

  // 로그인 확인 및 프로필 조회
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      try {
        // localStorage에서 토큰과 이메일 확인
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        
        console.log('마이페이지 접근 - 토큰:', token ? '있음' : '없음');
        console.log('마이페이지 접근 - 이메일:', email);
        
        // 토큰이 없으면 로그인 페이지로 리다이렉트
        if (!token) {
          console.log('토큰이 없습니다. 로그인 페이지로 이동합니다.');
          if (!hasShownAlertRef.current) {
            alert('로그인이 필요합니다.');
            hasShownAlertRef.current = true;
          }
          router.push('/login');
          return;
        }

        // 이메일이 없으면 로그인 페이지로 리다이렉트
        if (!email) {
          console.log('이메일이 없습니다. 로그인 페이지로 이동합니다.');
          router.push('/login');
          return;
        }

        // 백엔드 API에서 /users/{email}로 사용자 정보 조회
        // Swagger: https://tactful-skyler-histrionically.ngrok-free.dev/api#/
        // 실제 엔드포인트: /users/{email} (Swagger 문서 기준, /api 없음)
        let apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://tactful-skyler-histrionically.ngrok-free.dev';
        
        // Swagger URL에 /api가 있지만 실제 API 엔드포인트는 /users/{email}이므로
        // base URL에서 /api를 제거해야 함
        if (apiBaseUrl.endsWith('/api')) {
          apiBaseUrl = apiBaseUrl.slice(0, -4); // '/api' 제거
        } else if (apiBaseUrl.includes('/api/')) {
          // 중간에 /api/가 있으면 제거
          apiBaseUrl = apiBaseUrl.replace('/api', '');
        }
        
        // 마지막 슬래시 제거
        apiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
        
        const apiUrl = `${apiBaseUrl}/users/${encodeURIComponent(email)}`;
        console.log('API 호출 URL:', apiUrl);
        console.log('API Base URL:', apiBaseUrl);
        console.log('이메일:', email);
        console.log('사용하는 토큰:', token ? `${token.substring(0, 20)}...` : '없음');
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('API 응답 상태:', response.status, response.statusText);
        
        // 에러 응답 본문 확인
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`${response.status} 에러 응답 본문:`, errorText);
        }

        if (response.ok) {
          const userData = await response.json();
          console.log('사용자 데이터:', userData);
          setIsLoggedIn(true);
          setProfile({
            nickname: userData.name || userData.nickname || '',
            email: userData.email || email,
            address: userData.default_address || userData.address || '',
            profileImage: userData.profile_image || userData.profileImage || '',
          });
        } else if (response.status === 401) {
          // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
          console.log('토큰이 유효하지 않습니다. 로그인 페이지로 이동합니다.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('email');
          router.push('/login');
          return;
        } else {
          console.error('프로필 조회 실패:', response.status, response.statusText);
          // 다른 에러는 로그인 상태 유지하되 에러 표시
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('프로필 조회 오류:', error);
        // 네트워크 오류 등은 로그인 상태 유지
        setIsLoggedIn(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadProfile();
  }, [router]);

  const handleProfileUpdate = (updatedProfile: typeof profile) => {
    setProfile(updatedProfile);
    setIsProfileModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://tactful-skyler-histrionically.ngrok-free.dev';
      
      // /api 경로 제거
      let logoutUrl = apiBaseUrl;
      if (logoutUrl.endsWith('/api')) {
        logoutUrl = logoutUrl.slice(0, -4);
      } else if (logoutUrl.includes('/api/')) {
        logoutUrl = logoutUrl.replace('/api', '');
      }
      logoutUrl = logoutUrl.endsWith('/') ? logoutUrl.slice(0, -1) : logoutUrl;
      
      // 로그아웃 API 호출
      if (token) {
        await fetch(`${logoutUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('로그아웃 API 호출 오류:', error);
    } finally {
      // localStorage 정리
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      
      // 로그인 페이지로 리다이렉트
      router.push('/login');
    }
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

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
            <div className="flex items-center gap-6">
              {/* 왼쪽: 프로필 이미지 */}
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

              {/* 중간: 프로필 정보 */}
              <div className="flex-1 flex flex-col gap-2">
                <div>
                  <p className="text-sm text-gray-500 mb-1">이메일</p>
                  <p className="text-base font-medium">{profile.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">이름</p>
                  <p className="text-base font-medium">{profile.nickname || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">기본 배송지</p>
                  <p className="text-base">{profile.address || '등록된 배송지가 없습니다.'}</p>
                </div>
              </div>

              {/* 오른쪽: 버튼들 */}
              <div className="flex-shrink-0 flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  로그아웃
                </button>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  프로필 수정
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
