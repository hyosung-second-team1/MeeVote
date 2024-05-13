const kakaoAPI = 	'782ddcea4d38ba4c585152a42fb4bf3b';

// ---- 경로 정보 받아오기 ----
export async function getRoute(origin, destination) {
  const result = await $.ajax({
    type: "GET",
    url: "https://apis-navi.kakaomobility.com/v1/directions",
    headers: {
      "Authorization": `KakaoAK ${kakaoAPI}`
    },
    data: {origin: origin, destination: destination},
    dataType: "json",
    contentType: "application/json",
  });

  return result;
}