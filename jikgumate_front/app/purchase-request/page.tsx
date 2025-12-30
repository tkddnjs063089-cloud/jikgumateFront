'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PurchaseRequestPage() {
  const [productLink, setProductLink] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductLink(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productLink.trim()) {
      alert('상품 링크를 입력해주세요.');
      return;
    }

    // TODO: 상품 링크 처리 로직 구현
    console.log('상품 링크:', productLink);
    
    // 임시 처리
    alert('상품 링크가 제출되었습니다. (임시 처리)');
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

      {/* 인포그래픽 이미지 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex justify-center">
        <img src="/aigeranator.png" alt="구매 요청" className="w-1/2 h-auto object-contain" />
      </div>
    </div>
  );
}

