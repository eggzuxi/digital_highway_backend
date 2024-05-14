document.addEventListener('DOMContentLoaded', function() {
  // 다크 모드 토글 버튼
  var modeChangeButton = document.getElementById('mode_change');

  // 다크 모드 설정 가져오기
  var isDarkMode = localStorage.getItem('darkMode') === 'true';

  // 다크 모드 상태에 따라 초기 설정
  if (isDarkMode) {
      document.body.classList.add('dark-mode');
  } else {
      document.body.classList.remove('dark-mode');
  }

  // 클릭 이벤트 리스너 추가
  modeChangeButton.addEventListener('click', function() {
      // body 요소에 dark-mode 클래스를 추가/제거하여 다크 모드를 토글합니다.
      document.body.classList.toggle('dark-mode');

      // 다크 모드 상태 저장
      var isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  });
});
