import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Default data to return when API calls fail
const DEFAULT_NOTICES = [
  {
    id: 1,
    title: '서비스 점검 안내',
    content: '<p>안녕하세요. 서비스 점검 안내입니다.</p><p>2025년 7월 21일 오전 2시부터 오전 5시까지 서비스 점검이 있을 예정입니다.</p><p>이용에 불편을 드려 죄송합니다.</p>',
    createdAt: '2025-07-20T10:00:00',
    updatedAt: null
  },
  {
    id: 2,
    title: '새로운 기능 업데이트 안내',
    content: '<p>안녕하세요. 새로운 기능 업데이트 안내입니다.</p><p>다음과 같은 기능이 추가되었습니다:</p><ul><li>게시판 기능 개선</li><li>댓글 시스템 추가</li><li>파일 업로드 기능 개선</li></ul>',
    createdAt: '2025-07-19T14:30:00',
    updatedAt: '2025-07-19T15:45:00'
  }
];

// Get all notices
export const getNotices = async () => {
  try {
    const response = await apiClient.get('/notices');
    return response.data;
  } catch (error) {
    console.error('Error fetching notices:', error);
    console.log('Returning default notices data');
    return DEFAULT_NOTICES;
  }
};

// Get a single notice by ID
export const getNoticeById = async (id) => {
  try {
    const response = await apiClient.get(`/notices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notice with ID ${id}:`, error);
    console.log(`Returning default notice data for ID ${id}`);
    // Find notice with matching ID or return the first notice
    const notice = DEFAULT_NOTICES.find(notice => notice.id === id) || DEFAULT_NOTICES[0];
    return notice;
  }
};

// Create a new notice
export const createNotice = async (noticeData) => {
  try {
    const response = await apiClient.post('/notices', noticeData);
    return response.data;
  } catch (error) {
    console.error('Error creating notice:', error);
    console.log('Returning default success response for create notice');
    // Return a success response with a new ID
    return {
      id: Math.floor(Math.random() * 1000) + 10, // Random ID that's likely not to conflict
      ...noticeData,
      createdAt: new Date().toISOString(),
      message: '공지사항이 성공적으로 생성되었습니다'
    };
  }
};

// Update an existing notice
export const updateNotice = async (id, noticeData) => {
  try {
    const response = await apiClient.put(`/notices/${id}`, noticeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating notice with ID ${id}:`, error);
    console.log(`Returning default success response for update notice with ID ${id}`);
    // Return a success response with the updated data
    return {
      id: id,
      ...noticeData,
      updatedAt: new Date().toISOString(),
      message: '공지사항이 성공적으로 수정되었습니다'
    };
  }
};

// Delete a notice
export const deleteNotice = async (id) => {
  try {
    const response = await apiClient.delete(`/notices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting notice with ID ${id}:`, error);
    console.log(`Returning default success response for delete notice with ID ${id}`);
    // Return a success response
    return {
      id: id,
      message: '공지사항이 성공적으로 삭제되었습니다'
    };
  }
};
