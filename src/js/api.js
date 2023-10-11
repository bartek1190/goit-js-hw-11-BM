import axios from 'axios';

const apiKey = '39933687-b994f8a104bb2829fdb605324';

export const fetchPhotos = async (searchQuery, page, perPage) => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
