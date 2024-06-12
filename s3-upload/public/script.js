document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  const imageFiles = document.querySelector('input[type="file"]').files;
  for (const file of imageFiles) {
    formData.append('images', file); // 'images'로 변경
  }

  try {
    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    const imageUrls = result.images.map(image => `<img src="${image.url}" alt="${image.name}">`);
    document.getElementById('result').innerHTML = imageUrls.join('');
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('result').innerText = '이미지 업로드 실패';
  }
});
