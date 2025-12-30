'use client';

import { useState } from 'react';
import Image from 'next/image';

  interface ProductInfo {
  title: string;
  image: string;
  price: number;
  desc: string;
  url: string;
}

export default function PurchaseRequestPage() {
  const [productLink, setProductLink] = useState('');
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductLink(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productLink.trim()) {
      setError('상품 링크를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setProductInfo(null);

    try {
      // 토큰 확인
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다. 먼저 로그인해주세요.');
        setIsLoading(false);
        return;
      }

      // API URL 설정
      let apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://tactful-skyler-histrionically.ngrok-free.dev';
      
      // /api 경로 제거
      if (apiBaseUrl.endsWith('/api')) {
        apiBaseUrl = apiBaseUrl.slice(0, -4);
      } else if (apiBaseUrl.includes('/api/')) {
        apiBaseUrl = apiBaseUrl.replace('/api', '');
      }
      apiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;

      const apiUrl = `${apiBaseUrl}/products/analyze?url=${encodeURIComponent(productLink)}`;
      console.log('API 호출 URL:', apiUrl);
      console.log('토큰 존재:', !!token);
      console.log('토큰 앞부분:', token ? `${token.substring(0, 20)}...` : '없음');

      // /products/analyze로 GET 요청 (URL을 쿼리 파라미터로 전달, 토큰 포함)
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('API 응답 상태:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        setProductInfo(data);
      } else {
        // 에러 응답 본문 확인
        let errorMessage = '상품 정보를 가져오는데 실패했습니다.';
        
        if (response.status === 401) {
          // 401 에러인 경우 토큰이 유효하지 않거나 만료되었을 수 있음
          errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
          
          // 토큰 제거하고 로그인 페이지로 리다이렉트할 수도 있음
          // localStorage.removeItem('token');
          // localStorage.removeItem('email');
          // window.location.href = '/login';
        } else {
          try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              errorMessage = errorData.message || errorData.error || errorMessage;
              console.error('에러 응답:', errorData);
            } else {
              const errorText = await response.text();
              console.error('에러 응답 (텍스트):', errorText);
              if (errorText) {
                errorMessage = errorText;
              }
            }
          } catch (e) {
            console.error('에러 응답 파싱 오류:', e);
          }
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error('상품 분석 오류:', error);
      setError('상품 정보를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">구매 요청</h1>
      
      {/* 상품 링크 입력 폼 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="productLink"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            상품 링크
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              id="productLink"
              name="productLink"
              value={productLink}
              onChange={handleInputChange}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.shopee.kr/examplelink"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
            >
              확인
            </button>
          </div>
        </form>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 mb-8 flex items-center justify-center">
          <div className="text-gray-600">상품 정보를 분석하는 중...</div>
        </div>
      )}

      {/* 상품 정보 표시 */}
      {productInfo && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex gap-6">
            {/* 왼쪽: 상품 이미지 */}
            <div className="flex-shrink-0">
              <img
                src={productInfo.image}
                alt={productInfo.title}
                className="w-64 h-64 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.png'; // 이미지 로드 실패 시 대체 이미지
                }}
              />
            </div>

            {/* 오른쪽: 상품 정보 */}
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">상품명</h2>
                <p className="text-base text-gray-700">{productInfo.title}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">가격</h3>
                <p className="text-2xl font-bold text-blue-600">{productInfo.price.toLocaleString()}원</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">상품 설명</h3>
                <p className="text-base text-gray-700 whitespace-pre-line">{productInfo.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 인포그래픽 이미지 */}
      {!productInfo && !isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-center">
          <img src="/aigeranator.png" alt="구매 요청" className="w-1/2 h-auto object-contain" />
        </div>
      )}
    </div>
  );
}

