'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // 에러 메시지 초기화
    if (error) setError('');
  };

  const handleLogin = async () => {
    // 입력 검증
    if (!formData.username.trim()) {
      setError('아이디를 입력해주세요.');
      return;
    }
    if (!formData.password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    // 로그인 로직 구현 예정
    console.log('로그인 시도:', formData);
    
    // 임시로 성공 처리 (실제로는 API 호출)
    // TODO: 실제 로그인 API 호출
    // try {
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData),
    //   });
    //   if (response.ok) {
    //     router.push('/mypage');
    //   } else {
    //     setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    //   }
    // } catch (err) {
    //   setError('로그인 중 오류가 발생했습니다.');
    // }
    
    // 임시 성공 처리
    alert('로그인 성공! (임시 처리)');
    router.push('/mypage');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            로그인
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 입력 */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                아이디
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="아이디를 입력하세요"
                autoComplete="username"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handlePasswordKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              로그인
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <span className="text-gray-600 text-sm">계정이 없으신가요? </span>
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

