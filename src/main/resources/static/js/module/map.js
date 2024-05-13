const geocoder = new kakao.maps.services.Geocoder();

// ---- 지도 표시 ----
export async function displayMap(selector, lat, lng) {
  const container = document.querySelector(selector);
  const options = { //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(lat, lng), //지도의 중심좌표.
    level: 9 //지도의 레벨(확대, 축소 정도)
  };
  
  const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

  return map
}
// ---- 지도 표시 End ----


// ---- 마커 생성 ----
export function createMarker(map, lat, lng, size, imgSrc) {
  // 마커 정의
  const imageSize = new kakao.maps.Size(size, size);
  const imageOption = {offset: new kakao.maps.Point(27, 69)};
  const markerImage = new kakao.maps.MarkerImage(imgSrc, imageSize, imageOption);
  const markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치입니다
  // 마커를 생성
  const marker = new kakao.maps.Marker({
      position: markerPosition, 
      image: imgSrc? markerImage : null
  });
  // 마커가 지도 위에 표시되도록 설정
  marker.setMap(map);
  return marker;
}
// ---- 참여자 마커 생성 End ----


// ---- 주소명 좌표로 변경 ----
export async function locFromAddress(address) {
  return new Promise((resolve, reject) => {
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, function(response, status) {
      if (status === kakao.maps.services.Status.OK) {
        const result = [Number(response[0].y), Number(response[0].x)];
        resolve(result);
      } 
    });
  });
}
// ---- 주소명 좌표로 변경 End ----


// ---- 좌표를 주소로 변경 ----
export async function addrFromLoc(lat, lng) {
  return new Promise((resolve, reject) => {
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.coord2Address(lng, lat, function(response, status) {
      if (status === kakao.maps.services.Status.OK) {
        resolve(response);
      } 
    });
  });
}
// ---- 주소명 좌표로 변경 End ----


// ---- 장소 검색 ----
export async function searchPlace(word){
  return new Promise((resolve, reject) => {
    // 카카오맵 장소검색 
    const ps = new kakao.maps.services.Places(); 
    ps.keywordSearch(word, (data, status) => {
      const placeList = kakao.maps.services.Status.OK? data : [];
      resolve(placeList)
    })
  })
}
// ---- 장소 검색 End ----


// ---- 오버레이 생성 ----
export function createOverlay(map, marker, content) {
  const overlay = new kakao.maps.CustomOverlay({
    content: content,
    map: map,
    position: marker.getPosition()       
  });

  overlay.setMap(null);

  return overlay
};
// ---- 오버레이 생성 End ----