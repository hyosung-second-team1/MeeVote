import {displayMap, createMarker, searchPlace, locFromAddress, addrFromLoc,  createOverlay,} from '/js/module/map.js'
import {getMyInfo, getVotingDetail, postVotingItem, doVote, deleteSchedule, outSchedule} from '/js/module/ajax.js'
import {showPlaceList} from '/js/module/common.js'
import {getRoute} from '/js/module/mobility.js'

// 변수
// ---- 스케쥴 관련 정보
const urlSearch = new URLSearchParams(location.search);
let scheduleId; 
scheduleId = await urlSearch.get('scheduleId');
let scheduleInfo = await getVotingDetail(scheduleId);
// ---- 사용자 정보 ----
const myInfo = await getMyInfo();
const myScheduleInfo = scheduleInfo.memberList.find(v => v.email === myInfo.email)
const myPoint = myScheduleInfo.lat? [myScheduleInfo.lat, myScheduleInfo.lng] : await locFromAddress(myInfo.address);
// ---- 지도 객체 ----
const map = await displayMap('.map-container', myPoint[0], myPoint[1]);
// ---- 검색 위치 정보 ----
let serachList = [];
// ---- 마커 ----
let memberMarker = [];
let searchMarker = [];
// ---- 오버레이 ----
let overlayArr = [];
let nowOverlay;
// ---- 투표 항목 ----
let voteItems = {};
// 변수 End


// 함수
// ---- 함수 : 오버레이 요소 생성 함수 ----
function createOverlayElement(place) {
  // 생성
  const container = $('<div>').addClass('search-info-container');
  const name = $('<p>').addClass('name');
  const nameLink = $('<a>').attr('href', place.place_url).text(place.place_name);
  const closeIcon = $('<i>').addClass('bi bi-x-circle');
  const category = $('<p>').text(place.category_name).addClass('category');
  const address = $('<p>').addClass('address');
  const addressSpan1 = $('<span>').text(place.address_name);
  const addressSpan2 = $('<span>').text(place.road_address_name);
  const buttons = $('<div>').addClass('buttons');
  const crosshairIcon = $('<i>').addClass('bi bi-crosshair2');
  const addButton = $('<button>').addClass('add-btn').text('추가');
  // 조합
  name.append(nameLink, closeIcon);
  address.append(addressSpan1, '/', addressSpan2);
  buttons.append(crosshairIcon, addButton);
  container.append(name, category, address, buttons);
  // 이벤트 추가
  closeIcon.click((e) => nowOverlay.setMap(null));
  addButton.click(async function(e) {
    const placeInfo = {
      "placeName": place.place_name,
      "lat": place.y,
      "lng": place.x
    }
    nowOverlay.setMap(null);
    const response = await postVotingItem(scheduleId, placeInfo);
    Swal.fire({
      title: response.message,
      icon: response.isSuccess? 'success' : 'info',
      showConfirmButton: false
    });
    // 성공시 투표 항목 초기화

    if(response.isSuccess) resetVoteAll();
  })
  return container;
}
// ---- 함수 : 오버레이 요소 생성 함수 End----


// ---- 함수 : 검색 마커와 리스트 클릭 이벤트 ----
function searchClickEvent(idx) {
  // 해당 위치로 이동
  const moveLatLon = new kakao.maps.LatLng(serachList[idx].y, serachList[idx].x);
  map.setLevel(3);
  map.panTo(moveLatLon);
  // 오버레이 표시
  if(nowOverlay !== undefined) nowOverlay.setMap(null);
  nowOverlay = overlayArr[idx];
  nowOverlay.setMap(map);
}
// ---- 함수 : 검색 마커와 리스트 클릭 이벤트 End ----


// ---- 함수 : 장소 검색 후 리스트와 마커 표시 ----
async function serachTotal() {
  // 이전 마커 제거
  $.each(searchMarker, (idx, marker) => marker.setMap(null));
  serachList = [];
  searchMarker = [];
  overlayArr = [];
  // 장소 검색
  serachList = await searchPlace($('.place-search > input').val());
  showPlaceList(serachList, '.search-list-container', '.search-list')
  // 마커, 오버레이 추가
  $.each(serachList, function(idx, place) {
    const content = createOverlayElement(place).get(0);
    const marker = createMarker(map, place.y, place.x, 72);
    const overlay = createOverlay(map, marker, content);
    // 마커, 오버레이 배열에 넣기
    searchMarker.push(marker);
    overlayArr.push(overlay);
    // 마커에 이벤트 추가
    kakao.maps.event.addListener(marker, 'click', function() {
      searchClickEvent(idx)
    });
  });
  // 검색 리스트에 이벤트 추가하기
  $.each($('.search-list').children(), function (idx, li) { 
    $(li).click(function (e) { 
      searchClickEvent(idx)
    });
  });
}
// ---- 함수 : 장소 검색 후 리스트와 마커 표시 End ----


// ---- 함수 : 투표 항목 정보 불러오기 ----
async function getVoteItemData(id, voteItem) {
  // 경로 정보 받아오기
  const origin = `${myPoint[1]},${myPoint[0]}`
  const destination = `${voteItem.lng},${voteItem.lat}`
  const routeInfo = await getRoute(origin, destination);
  const addr = await addrFromLoc(voteItem.lat, voteItem.lng);
  // 객체로 저장
  const voteItemInfo = {"vote": voteItem}
  voteItemInfo.sections = routeInfo.routes[0].sections[0];
  voteItemInfo.summary = routeInfo.routes[0].summary;
  voteItemInfo.address = addr;
  // 전역 변수에 저장
  voteItems[id] = voteItemInfo;
}
// ---- 함수 : 투표 항목 정보 불러오기 ----


// ---- 함수 : 투표 항목 ui 생성 함수 ----
function createVoteItemUI(id) {
  const voteItemInfo = voteItems[id];
  const placeName = voteItemInfo.vote.placeName;
  const taxiTime = parseInt((voteItemInfo.summary.duration) / 60);
  const taxiFee = voteItemInfo.summary.fare.taxi;
  const walkTime = parseInt((voteItemInfo.summary.distance) / 65);
  const count = voteItemInfo.vote.votedCount;
  const totalDistance = parseInt((voteItemInfo.summary.distance) / 1000);
  // ui 구성하기
  const li = $(
    `<li class="vote-item ${voteItemInfo.vote.didRequesterVoteHere? "choosed" : ""}" id=${id}>
      <div class="row-container vote-head">
        <p class="name">${placeName}</p>
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <p class="address">${voteItemInfo.address[0].address.address_name}</p>
      <div class="row-container transporter-container">
        <div class="transporter">
          <img src="/image/icon/taxi.png" alt="">
          <span>${taxiTime}분</span>
        </div>
        <div class="transporter">
          <img src="/image/icon/walk.png" alt="">
          <span>${walkTime}분</span>
        </div>
        <div class="transporter">
          <img src="/image/icon/member.webp" alt="">
          <span class="vote-count">${count}명</span>
        </div>
      </div>
      <div class="row-container fee">
        <span>택시 : ${taxiFee}원</span>
        <span>${totalDistance}km</span>
      </div>
    </li>`
  );
  // 투표하기 이벤트 추가
  li.find('.vote-head > i').click(async function() {
    const result = await doVote(id);

    if(result.isSuccess) {
      voteItems[id].vote.didRequesterVoteHere = !voteItems[id].vote.didRequesterVoteHere;
      voteItems[id].vote.votedCount = voteItems[id].vote.didRequesterVoteHere? 
      voteItems[id].vote.votedCount + 1 : voteItems[id].vote.votedCount - 1;
      li.toggleClass('choosed');
      li.find('.vote-count').text(voteItems[id].vote.votedCount);
    }
  });

  return li;
}
// ---- 함수 : 투표 항목 ui 생성 함수 End----


// --- 함수 : 투표 항목 전부 갱신 ----
async function resetVoteAll() {
  scheduleInfo = await getVotingDetail(scheduleId);
  $.each(scheduleInfo.placeToVoteList, async function (index, voteItem) {
    const id = voteItem.placeToVoteId;
    if (!voteItems.hasOwnProperty(id)) {
      await getVoteItemData(id, voteItem);
      const li = createVoteItemUI(id);
      $('.vote-list').append(li);
    }
  });
}
// --- 함수 : 투표 항목 갱신 End----



// 이벤트 등록
// ---- 이벤트 등록 : 장소 검색 ----
$('.place-search > i').click(() => serachTotal())

$('.place-search > input').keypress(async function (e) {
  if(e.keyCode && e.keyCode == 13){
    serachTotal();
  }
})
// ---- 이벤트 등록 : 장소 검색 End----


// ---- 이벤트 등록 : 장소 검색어 변화 감지 -----
$('.place-search > input').on('input',function (e) { 
  // 이전 마커 제거
  $.each(searchMarker, (idx, marker) => marker.setMap(null));
  searchMarker = [];
  $('.search-list').empty();
  // 오버레이 끄기
  if(nowOverlay !== undefined) nowOverlay.setMap(null);
})
// ---- 이벤트 등록 : 장소 검색어 변화 감지 -----


// ---- 이벤트 등록 : 장소 선택 스크롤 컨트롤 ----
$('.search-container').click(function(event){
	event.stopPropagation();
});

$(document).click(function(){
	$('.search-list-container').css('display', 'none');
});

$('.place-search > input').click(function (e) { 
  $('.search-list-container').css('display', 'block');
})
// ---- 이벤트 등록 : 장소 선택 스크롤 컨트롤 End----


// ---- 이벤트 등록 : 스케쥴 삭제 혹은 나가기 ----
$('.del-btn').click(async function(e){
  const isOwner = scheduleInfo.isRequesterOwner
  const result = await Swal.fire({
    title: isOwner? '일정 삭제' : '일정 나가기',
    text: isOwner? 
      '한 번 삭제된 일정은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?' : 
      '한 번 나가면 다시 초대받을 때까지 들어올 수 없습니다. 정말로 나가시겠습니까?',
    icon: 'warning',
    showConfirmButton: false,
    showDenyButton: true,
    showCancelButton: true,
    cancelButtonText: '아니오',
    denyButtonText: '네'
  });

  if (result.isDenied) {
    console.log(scheduleId)
    let response = isOwner? await deleteSchedule(scheduleId) : await outSchedule(scheduleId)
    console.log(response)
    if (response.isSuccess) {
      location.replace('/');
    }
  }
})
// ---- 이벤트 등록 : 장소 선택 스크롤 컨트롤 End----



// 시작 이벤트
// ---- 시작 이벤트 : 참여자 마커 생성 ----
$.each(scheduleInfo.memberList, async function (index, info) {
  const startPoint = info.lat? [info.lat, info.lng] : await locFromAddress(info.address);
  let imgSrc = info.email === myInfo.email? 'my' : 'member';
  const marker = createMarker(map, startPoint[0], startPoint[1], 72, `/image/marker/${imgSrc}.png`);
  memberMarker.push(marker)
});
// ---- 시작 이벤트 : 참여자 마커 생성 End----


// ---- 시작 이벤트 : 투표 항목 표시 ----
resetVoteAll();
// ---- 시작 이벤트 : 투표 항목 표시 End----



