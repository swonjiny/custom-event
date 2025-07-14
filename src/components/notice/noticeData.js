// Sample notice data with rich HTML content including images
export const initialNotices = [
  {
    id: 1,
    title: '첫 번째 공지사항',
    content: `
      <h2>환영합니다!</h2>
      <p>이것은 첫 번째 공지사항입니다.</p>
      <p>아래는 샘플 이미지입니다:</p>
      <img src="https://via.placeholder.com/600x300" alt="샘플 이미지" style="max-width: 100%; height: auto;" />
      <p>이미지가 잘 보이시나요?</p>
    `,
    createdAt: '2025-07-09 10:00:00',
  },
  {
    id: 2,
    title: '두 번째 공지사항',
    content: `
      <h2>중요한 업데이트가 있습니다</h2>
      <p>자세한 내용은 본문을 확인하세요.</p>
      <ul>
        <li>첫 번째 항목</li>
        <li>두 번째 항목</li>
        <li>세 번째 항목</li>
      </ul>
      <p>아래는 다른 샘플 이미지입니다:</p>
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <img src="https://via.placeholder.com/300x200/FF5733/FFFFFF" alt="샘플 이미지 1" style="width: 48%;" />
        <img src="https://via.placeholder.com/300x200/33FF57/FFFFFF" alt="샘플 이미지 2" style="width: 48%;" />
      </div>
      <p>이미지가 나란히 표시됩니다.</p>
    `,
    createdAt: '2025-07-09 11:30:00',
  },
  {
    id: 3,
    title: '세 번째 공지사항 - 다양한 HTML 요소',
    content: `
      <h1>다양한 HTML 요소 테스트</h1>
      <p>이 공지사항은 다양한 HTML 요소를 포함하고 있습니다.</p>
      
      <h2>표 예제</h2>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px;">항목</th>
            <th style="padding: 8px;">설명</th>
            <th style="padding: 8px;">비고</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px;">항목 1</td>
            <td style="padding: 8px;">설명 1</td>
            <td style="padding: 8px;">비고 1</td>
          </tr>
          <tr>
            <td style="padding: 8px;">항목 2</td>
            <td style="padding: 8px;">설명 2</td>
            <td style="padding: 8px;">비고 2</td>
          </tr>
        </tbody>
      </table>
      
      <h2>코드 예제</h2>
      <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto;">
const example = () => {
  console.log('Hello, World!');
  return true;
};
      </pre>
      
      <h2>인용문 예제</h2>
      <blockquote style="border-left: 4px solid #ccc; margin-left: 0; padding-left: 16px; color: #666;">
        이것은 인용문입니다. 다른 텍스트와 구분되어 표시됩니다.
      </blockquote>
      
      <p>마지막으로 또 다른 이미지:</p>
      <img src="https://via.placeholder.com/800x400/3357FF/FFFFFF" alt="큰 샘플 이미지" style="max-width: 100%; height: auto;" />
    `,
    createdAt: '2025-07-10 09:15:00',
  }
];
